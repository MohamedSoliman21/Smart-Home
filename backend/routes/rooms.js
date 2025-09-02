const express = require('express');
const Room = require('../models/Room');
const Device = require('../models/Device');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { category, floor, limit = 50, page = 1 } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (floor) filter.floor = parseInt(floor);

    const rooms = await Room.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ name: 1 });

    const total = await Room.countDocuments(filter);

    res.json({
      success: true,
      data: {
        rooms,
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

// Get room by ID with devices
router.get('/:roomId', authenticateToken, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const devices = await Device.find({ 
      room: room._id, 
      isActive: true 
    }).populate('room', 'name icon category');

    res.json({
      success: true,
      data: { 
        room,
        devices,
        deviceCount: devices.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new room
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, icon, category, description, floor, area } = req.body;

    if (!name || !icon || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, icon, and category are required'
      });
    }

    const room = new Room({
      name,
      icon,
      category,
      description,
      floor,
      area
    });

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
router.put('/:roomId', authenticateToken, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    Object.assign(room, req.body);
    await room.save();

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
});

// Delete room
router.delete('/:roomId', authenticateToken, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has devices
    const deviceCount = await Device.countDocuments({ 
      room: room._id, 
      isActive: true 
    });

    if (deviceCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room with ${deviceCount} active devices`
      });
    }

    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get room statistics
router.get('/:roomId/stats', authenticateToken, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const devices = await Device.find({ 
      room: room._id, 
      isActive: true 
    });

    const stats = {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status.isOnline).length,
      activeDevices: devices.filter(d => d.status.isOn).length,
      deviceTypes: devices.reduce((acc, device) => {
        acc[device.type] = (acc[device.type] || 0) + 1;
        return acc;
      }, {}),
      totalPowerConsumption: devices.reduce((total, device) => {
        return total + (device.plug?.power || 0);
      }, 0),
      averageTemperature: devices
        .filter(d => d.type === 'thermostat')
        .reduce((sum, device) => sum + device.thermostat.currentTemp, 0) / 
        Math.max(devices.filter(d => d.type === 'thermostat').length, 1)
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
});

// Get rooms by category
router.get('/category/:category', authenticateToken, async (req, res, next) => {
  try {
    const { category } = req.params;
    const rooms = await Room.find({ 
      category, 
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

module.exports = router;
