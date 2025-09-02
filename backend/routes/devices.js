const express = require('express');
const Device = require('../models/Device');
const Room = require('../models/Room');
const { authenticateToken, authorizeDeviceAccess } = require('../middleware/auth');

const router = express.Router();

// Get all devices (with optional filtering)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { room, type, status, limit = 50, page = 1 } = req.query;
    
    const filter = { isActive: true };
    if (room) filter.room = room;
    if (type) filter.type = type;
    if (status === 'online') filter['status.isOnline'] = true;
    if (status === 'offline') filter['status.isOnline'] = false;
    if (status === 'on') filter['status.isOn'] = true;
    if (status === 'off') filter['status.isOn'] = false;

    const devices = await Device.find(filter)
      .populate('room', 'name icon category')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Device.countDocuments(filter);

    res.json({
      success: true,
      data: {
        devices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get device by ID
router.get('/:deviceId', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.deviceId)
      .populate('room', 'name icon category')
      .populate('permissions.users.user', 'username firstName lastName');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
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
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, type, icon, room, manufacturer, model, serialNumber } = req.body;

    // Validate required fields
    if (!name || !type || !icon || !room) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, icon, and room are required'
      });
    }

    // Check if room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(400).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if serial number is unique
    if (serialNumber) {
      const existingDevice = await Device.findOne({ serialNumber });
      if (existingDevice) {
        return res.status(400).json({
          success: false,
          message: 'Device with this serial number already exists'
        });
      }
    }

    const device = new Device({
      name,
      type,
      icon,
      room,
      manufacturer,
      model,
      serialNumber,
      permissions: {
        users: [{ user: req.user._id, level: 'admin' }]
      }
    });

    await device.save();

    const populatedDevice = await Device.findById(device._id)
      .populate('room', 'name icon category');

    res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: { device: populatedDevice }
    });
  } catch (error) {
    next(error);
  }
});

// Update device
router.put('/:deviceId', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Check permissions
    const userPermission = device.permissions.users.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!userPermission || (userPermission.level !== 'admin' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this device'
      });
    }

    // Update device
    Object.assign(device, req.body);
    await device.save();

    const updatedDevice = await Device.findById(device._id)
      .populate('room', 'name icon category');

    res.json({
      success: true,
      message: 'Device updated successfully',
      data: { device: updatedDevice }
    });
  } catch (error) {
    next(error);
  }
});

// Toggle device on/off
router.post('/:deviceId/toggle', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
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
router.post('/:deviceId/status', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
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
router.post('/:deviceId/light', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const { brightness, color, colorTemperature, rgb } = req.body;
    const device = await Device.findById(req.params.deviceId);
    
    if (!device || device.type !== 'light') {
      return res.status(400).json({
        success: false,
        message: 'Device not found or not a light device'
      });
    }

    if (brightness !== undefined) device.light.brightness = brightness;
    if (color !== undefined) device.light.color = color;
    if (colorTemperature !== undefined) device.light.colorTemperature = colorTemperature;
    if (rgb !== undefined) device.light.rgb = rgb;

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
router.post('/:deviceId/thermostat', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const { targetTemp, mode, fanSpeed } = req.body;
    const device = await Device.findById(req.params.deviceId);
    
    if (!device || device.type !== 'thermostat') {
      return res.status(400).json({
        success: false,
        message: 'Device not found or not a thermostat device'
      });
    }

    if (targetTemp !== undefined) device.thermostat.targetTemp = targetTemp;
    if (mode !== undefined) device.thermostat.mode = mode;
    if (fanSpeed !== undefined) device.thermostat.fanSpeed = fanSpeed;

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

// Delete device
router.delete('/:deviceId', authenticateToken, authorizeDeviceAccess, async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Check admin permissions
    const userPermission = device.permissions.users.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!userPermission || (userPermission.level !== 'admin' && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete this device'
      });
    }

    device.isActive = false;
    await device.save();

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
