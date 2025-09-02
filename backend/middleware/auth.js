const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

const authorizeDeviceAccess = async (req, res, next) => {
  try {
    const deviceId = req.params.deviceId || req.body.deviceId;
    
    if (!deviceId) {
      return next(); // No device ID, skip authorization
    }

    const Device = require('../models/Device');
    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Check if user has permission to access this device
    const userPermission = device.permissions.users.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!userPermission && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this device'
      });
    }

    req.device = device;
    req.userPermission = userPermission;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeDeviceAccess
};
