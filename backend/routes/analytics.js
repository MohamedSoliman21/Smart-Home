const express = require('express');
const Device = require('../models/Device');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get analytics overview
router.get('/overview', authenticateToken, async (req, res, next) => {
  try {
    const devices = await Device.find({ isActive: true });
    
    const analytics = {
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
        Math.max(devices.filter(d => d.type === 'thermostat').length, 1),
      energyEfficiency: {
        lights: devices.filter(d => d.type === 'light' && d.status.isOn).length,
        plugs: devices.filter(d => d.type === 'plug' && d.status.isOn).length
      }
    };

    res.json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    next(error);
  }
});

// Get energy consumption data
router.get('/energy', authenticateToken, async (req, res, next) => {
  try {
    const { period = '24h' } = req.query;
    
    // Placeholder for energy consumption analytics
    const energyData = {
      period,
      totalConsumption: 0,
      byDevice: [],
      byRoom: [],
      trends: []
    };

    res.json({
      success: true,
      data: { energyData }
    });
  } catch (error) {
    next(error);
  }
});

// Get device usage statistics
router.get('/device-usage', authenticateToken, async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    
    if (deviceId) {
      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({
          success: false,
          message: 'Device not found'
        });
      }
      
      // Placeholder for device-specific usage data
      const usageData = {
        deviceId,
        totalUsage: 0,
        averageUsage: 0,
        peakUsage: 0,
        usageHistory: []
      };

      res.json({
        success: true,
        data: { usageData }
      });
    } else {
      // Get usage for all devices
      const devices = await Device.find({ isActive: true });
      
      const usageData = devices.map(device => ({
        deviceId: device._id,
        name: device.name,
        type: device.type,
        totalUsage: 0,
        averageUsage: 0,
        peakUsage: 0
      }));

      res.json({
        success: true,
        data: { usageData }
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
