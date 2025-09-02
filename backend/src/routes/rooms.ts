import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '@/middleware/auth';
import Room from '@/models/Room';
import Device from '@/models/Device';
import { 
  IRoomInput, 
  RoomFilterQuery,
  ApiResponse,
  PaginatedResponse,
  RoomStats 
} from '@/types';

const router: ReturnType<typeof Router> = Router();

// Get all rooms with filtering and pagination
router.get('/', authenticateToken, async (req: Request<{}, {}, {}, RoomFilterQuery>, res: Response<ApiResponse<PaginatedResponse<any>>>, next: NextFunction) => {
  try {
    const { category, floor, limit = '50', page = '1' } = req.query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (floor) filter.floor = parseInt(floor);

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .limit(limitNum)
        .skip(skip)
        .sort({ name: 1 }),
      Room.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        data: rooms,
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

// Get room by ID with devices
router.get('/:roomId', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const [room, devices] = await Promise.all([
      Room.findById(req.params.roomId),
      Device.find({ room: req.params.roomId, isActive: true })
        .select('name type icon status light thermostat camera sensor')
    ]);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { 
        room,
        devices 
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get rooms by category
router.get('/category/:category', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const rooms = await Room.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    next(error);
  }
});

// Get room statistics
router.get('/:roomId/stats', authenticateToken, async (req: Request, res: Response<ApiResponse<RoomStats>>, next: NextFunction) => {
  try {
    const devices = await Device.find({ 
      room: req.params.roomId, 
      isActive: true 
    });

    const stats: RoomStats = {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status.isOnline).length,
      activeDevices: devices.filter(d => d.status.isOn).length,
      deviceTypes: devices.reduce((acc, device) => {
        acc[device.type] = (acc[device.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalPowerConsumption: devices.reduce((total, device) => {
        return total + (device.plug?.power || 0);
      }, 0),
      averageTemperature: devices.reduce((total, device) => {
        return total + (device.thermostat?.currentTemp || 0);
      }, 0) / Math.max(devices.filter(d => d.thermostat).length, 1)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Create new room
router.post('/', authenticateToken, async (req: Request<{}, {}, IRoomInput>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

// Update room
router.put('/:roomId', authenticateToken, async (req: Request<{ roomId: string }, {}, Partial<IRoomInput>>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

// Update room temperature
router.put('/:roomId/temperature', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { current, target, unit } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found'
      });
      return;
    }

    if (current !== undefined) room.temperature.current = current;
    if (target !== undefined) room.temperature.target = target;
    if (unit) room.temperature.unit = unit;

    await room.save();

    res.json({
      success: true,
      message: 'Room temperature updated successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

// Update room lighting
router.put('/:roomId/lighting', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { brightness, color } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found'
      });
      return;
    }

    if (brightness !== undefined) room.lighting.brightness = brightness;
    if (color) room.lighting.color = color;

    await room.save();

    res.json({
      success: true,
      message: 'Room lighting updated successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

// Update room occupancy
router.put('/:roomId/occupancy', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { isOccupied, sensorId } = req.body;
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found'
      });
      return;
    }

    room.occupancy.isOccupied = isOccupied;
    room.occupancy.lastDetected = new Date();
    if (sensorId) room.occupancy.sensorId = sensorId;

    await room.save();

    res.json({
      success: true,
      message: 'Room occupancy updated successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

// Deactivate room
router.delete('/:roomId', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      { isActive: false },
      { new: true }
    );

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Room deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
