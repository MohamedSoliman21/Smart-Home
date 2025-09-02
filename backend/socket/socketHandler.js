const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Device = require('../models/Device');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Invalid user'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);

    // Join user to their personal room
    socket.join(`user_${socket.user._id}`);

    // Join user to all rooms they have access to
    socket.on('join-rooms', async () => {
      try {
        const devices = await Device.find({
          'permissions.users.user': socket.user._id,
          isActive: true
        }).populate('room');

        const roomIds = [...new Set(devices.map(d => d.room._id.toString()))];
        
        roomIds.forEach(roomId => {
          socket.join(`room_${roomId}`);
        });

        socket.emit('rooms-joined', { roomIds });
      } catch (error) {
        console.error('Error joining rooms:', error);
      }
    });

    // Handle device status updates
    socket.on('device-status-update', async (data) => {
      try {
        const { deviceId, status } = data;
        
        const device = await Device.findById(deviceId);
        if (!device) {
          socket.emit('error', { message: 'Device not found' });
          return;
        }

        // Check permissions
        const hasPermission = device.permissions.users.some(
          p => p.user.toString() === socket.user._id.toString()
        );

        if (!hasPermission && socket.user.role !== 'admin') {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Update device status
        await device.updateStatus(status);

        // Broadcast to all users in the room
        io.to(`room_${device.room}`).emit('device-updated', {
          deviceId,
          status: device.status,
          updatedBy: socket.user.username,
          timestamp: new Date()
        });

        // Emit to specific device room
        io.to(`device_${deviceId}`).emit('device-status-changed', {
          deviceId,
          status: device.status,
          updatedBy: socket.user.username,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Error updating device status:', error);
        socket.emit('error', { message: 'Failed to update device status' });
      }
    });

    // Handle device control
    socket.on('device-control', async (data) => {
      try {
        const { deviceId, action, value } = data;
        
        const device = await Device.findById(deviceId);
        if (!device) {
          socket.emit('error', { message: 'Device not found' });
          return;
        }

        // Check permissions
        const hasPermission = device.permissions.users.some(
          p => p.user.toString() === socket.user._id.toString()
        );

        if (!hasPermission && socket.user.role !== 'admin') {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Perform device action
        switch (action) {
          case 'toggle':
            await device.toggle();
            break;
          case 'setBrightness':
            if (device.type === 'light') {
              device.light.brightness = value;
              await device.save();
            }
            break;
          case 'setTemperature':
            if (device.type === 'thermostat') {
              device.thermostat.targetTemp = value;
              await device.save();
            }
            break;
          case 'setColor':
            if (device.type === 'light') {
              device.light.color = value;
              await device.save();
            }
            break;
          default:
            socket.emit('error', { message: 'Invalid action' });
            return;
        }

        // Broadcast device update
        io.to(`room_${device.room}`).emit('device-controlled', {
          deviceId,
          action,
          value,
          status: device.status,
          controlledBy: socket.user.username,
          timestamp: new Date()
        });

        socket.emit('device-control-success', {
          deviceId,
          action,
          value,
          status: device.status
        });

      } catch (error) {
        console.error('Error controlling device:', error);
        socket.emit('error', { message: 'Failed to control device' });
      }
    });

    // Handle room control (all devices in a room)
    socket.on('room-control', async (data) => {
      try {
        const { roomId, action, value } = data;
        
        const devices = await Device.find({
          room: roomId,
          isActive: true
        });

        const results = [];
        
        for (const device of devices) {
          try {
            switch (action) {
              case 'turnOn':
                device.status.isOn = true;
                await device.save();
                break;
              case 'turnOff':
                device.status.isOn = false;
                await device.save();
                break;
              case 'setBrightness':
                if (device.type === 'light') {
                  device.light.brightness = value;
                  await device.save();
                }
                break;
            }
            
            results.push({
              deviceId: device._id,
              name: device.name,
              success: true
            });
          } catch (error) {
            results.push({
              deviceId: device._id,
              name: device.name,
              success: false,
              error: error.message
            });
          }
        }

        // Broadcast room control results
        io.to(`room_${roomId}`).emit('room-controlled', {
          roomId,
          action,
          value,
          results,
          controlledBy: socket.user.username,
          timestamp: new Date()
        });

        socket.emit('room-control-success', {
          roomId,
          action,
          value,
          results
        });

      } catch (error) {
        console.error('Error controlling room:', error);
        socket.emit('error', { message: 'Failed to control room' });
      }
    });

    // Handle device monitoring
    socket.on('monitor-device', (deviceId) => {
      socket.join(`device_${deviceId}`);
      socket.emit('device-monitoring-started', { deviceId });
    });

    socket.on('stop-monitoring-device', (deviceId) => {
      socket.leave(`device_${deviceId}`);
      socket.emit('device-monitoring-stopped', { deviceId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.username} (${socket.id})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Broadcast system-wide notifications
  const broadcastNotification = (type, data) => {
    io.emit('notification', {
      type,
      data,
      timestamp: new Date()
    });
  };

  // Broadcast device alerts
  const broadcastDeviceAlert = (deviceId, alert) => {
    io.to(`device_${deviceId}`).emit('device-alert', {
      deviceId,
      alert,
      timestamp: new Date()
    });
  };

  // Export broadcast functions for use in other parts of the application
  io.broadcastNotification = broadcastNotification;
  io.broadcastDeviceAlert = broadcastDeviceAlert;
};

module.exports = socketHandler;
