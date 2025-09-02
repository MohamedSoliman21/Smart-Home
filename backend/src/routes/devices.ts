import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, authorizeDeviceAccess } from '@/middleware/auth';
import Device from '@/models/Device';
import { 
  IDeviceInput, 
  IDeviceUpdate, 
  DeviceFilterQuery,
  ApiResponse,
  PaginatedResponse 
} from '@/types';

const router: ReturnType<typeof Router> = Router();

// Get all devices with filtering and pagination
router.get('/', authenticateToken, async (req: Request<{}, {}, {}, DeviceFilterQuery>, res: Response<ApiResponse<PaginatedResponse<any>>>, next: NextFunction) => {
  try {
    const { room, type, status, limit = '50', page = '1' } = req.query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { isActive: true };
    if (room) filter.room = room;
    if (type) filter.type = type;
    if (status) {
      if (status === 'online') filter['status.isOnline'] = true;
      else if (status === 'offline') filter['status.isOnline'] = false;
      else if (status === 'on') filter['status.isOn'] = true;
      else if (status === 'off') filter['status.isOn'] = false;
    }

    const [devices, total] = await Promise.all([
      Device.find(filter)
        .populate('room', 'name icon category')
        .limit(limitNum)
        .skip(skip)
        .sort({ createdAt: -1 }),
      Device.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        data: devices,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get device by ID
router.get('/:deviceId', authenticateToken, authorizeDeviceAccess, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const device = await Device.findById(req.params.deviceId)
      .populate('room', 'name icon category')
      .populate('permissions.users.user', 'username firstName lastName');

    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Create new device
router.post('/', authenticateToken, async (req: Request<{}, {}, IDeviceInput>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const device = new Device(req.body);
    await device.save();

    res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Update device
router.put('/:deviceId', authenticateToken, authorizeDeviceAccess, async (req: Request<{ deviceId: string }, {}, IDeviceUpdate>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.deviceId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Device updated successfully',
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Toggle all devices in a room
router.post('/room/:roomId/toggle', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { turnOn } = req.body;
    const { roomId } = req.params;

    if (typeof turnOn !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'turnOn parameter is required and must be a boolean'
      });
      return;
    }

    // Find all toggleable devices in the room (lights, plugs, and thermostats)
    const devices = await Device.find({
      room: roomId,
      type: { $in: ['light', 'plug', 'thermostat'] },
      isActive: true
    });

    if (devices.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No toggleable devices found in this room'
      });
      return;
    }

    // Toggle each device
    const togglePromises = devices.map(async (device) => {
      if (device.type === 'thermostat') {
        // For thermostats, change mode instead of toggling power
        const needsToggle = turnOn ? device.thermostat!.mode === 'off' : device.thermostat!.mode !== 'off';
        if (needsToggle) {
          device.thermostat!.mode = turnOn ? 'auto' : 'off';
          await device.save();
        }
      } else {
        // For lights and plugs, use the existing toggle method
        const needsToggle = turnOn ? !device.status.isOn : device.status.isOn;
        if (needsToggle) {
          await device.toggle();
        }
      }
      return device;
    });

    const updatedDevices = await Promise.all(togglePromises);

    res.json({
      success: true,
      message: `Successfully ${turnOn ? 'turned on' : 'turned off'} ${updatedDevices.length} devices in room`,
      data: { 
        devices: updatedDevices,
        roomId,
        turnOn,
        toggledCount: updatedDevices.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Toggle device
router.post('/:deviceId/toggle', authenticateToken, authorizeDeviceAccess, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    await device.toggle();

    res.json({
      success: true,
      message: `Device ${device.status.isOn ? 'turned on' : 'turned off'} successfully`,
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Update device status
router.post('/:deviceId/status', authenticateToken, authorizeDeviceAccess, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    await device.updateStatus(req.body);

    res.json({
      success: true,
      message: 'Device status updated successfully',
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Control light device
router.post('/:deviceId/light', authenticateToken, authorizeDeviceAccess, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { brightness, color, colorTemperature } = req.body;
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    if (device.type !== 'light') {
      res.status(400).json({
        success: false,
        message: 'Device is not a light'
      });
      return;
    }

    if (brightness !== undefined) device.light!.brightness = brightness;
    if (color) device.light!.color = color;
    if (colorTemperature) device.light!.colorTemperature = colorTemperature;

    await device.save();

    res.json({
      success: true,
      message: 'Light settings updated successfully',
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Control thermostat device
router.post('/:deviceId/thermostat', authenticateToken, authorizeDeviceAccess, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { targetTemp, mode, fanSpeed } = req.body;
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    if (device.type !== 'thermostat') {
      res.status(400).json({
        success: false,
        message: 'Device is not a thermostat'
      });
      return;
    }

    if (targetTemp !== undefined) device.thermostat!.targetTemp = targetTemp;
    if (mode) device.thermostat!.mode = mode;
    if (fanSpeed) device.thermostat!.fanSpeed = fanSpeed;

    await device.save();

    res.json({
      success: true,
      message: 'Thermostat settings updated successfully',
      data: { device }
    });
  } catch (error) {
    next(error);
  }
});

// Deactivate device
router.delete('/:deviceId', authenticateToken, authorizeDeviceAccess, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.deviceId,
      { isActive: false },
      { new: true }
    );

    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Device deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
