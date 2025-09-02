import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Device from '@/models/Device';
import Room from '@/models/Room';
import { 
  DeviceControlData, 
  RoomControlData, 
  DeviceStatusData,
  JwtPayload 
} from '@/types';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

const socketHandler = (io: SocketIOServer) => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {

    // Join rooms for real-time updates
    socket.on('join-rooms', async () => {
      try {
        const rooms = await Room.find({ isActive: true });
        rooms?.forEach(room => {
          socket.join(`room-${room._id}`);
        });
        socket.emit('rooms-joined', { success: true });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join rooms' });
      }
    });

    // Handle device status updates
    socket.on('device-status-update', async (data: DeviceStatusData) => {
      try {
        const device = await Device.findById(data.deviceId);
        if (!device) {
          socket.emit('error', { message: 'Device not found' });
          return;
        }

        await device.updateStatus(data.status);
        
        // Broadcast to all clients in the room
        io.to(`room-${device.room}`).emit('device-updated', {
          deviceId: device._id,
          status: device.status,
          roomId: device.room
        });

        socket.emit('status-update-success', { deviceId: device._id });
      } catch (error) {
        socket.emit('error', { message: 'Failed to update device status' });
      }
    });

    // Handle device control
    socket.on('device-control', async (data: DeviceControlData) => {
      try {
        const device = await Device.findById(data.deviceId);
        if (!device) {
          socket.emit('error', { message: 'Device not found' });
          return;
        }

        switch (data.action) {
          case 'toggle':
            await device.toggle();
            break;
          case 'setBrightness':
            if (device.type === 'light' && data.value !== undefined) {
              device.light!.brightness = data.value;
              await device.save();
            }
            break;
          case 'setTemperature':
            if (device.type === 'thermostat' && data.value !== undefined) {
              device.thermostat!.targetTemp = data.value;
              await device.save();
            }
            break;
          case 'setColor':
            if (device.type === 'light' && data.value) {
              device.light!.color = data.value;
              await device.save();
            }
            break;
        }

        // Broadcast to all clients in the room
        io.to(`room-${device.room}`).emit('device-controlled', {
          deviceId: device._id,
          action: data.action,
          value: data.value,
          roomId: device.room
        });

        socket.emit('control-success', { deviceId: device._id });
      } catch (error) {
        socket.emit('error', { message: 'Failed to control device' });
      }
    });

    // Handle room control
    socket.on('room-control', async (data: RoomControlData) => {
      try {
        const devices = await Device.find({ 
          room: data.roomId, 
          isActive: true,
          type: { $in: ['light', 'plug'] }
        });

        for (const device of devices) {
          switch (data.action) {
            case 'turnOn':
              device.status.isOn = true;
              if (device.type === 'light' && data.value !== undefined) {
                device.light!.brightness = data.value;
              }
              break;
            case 'turnOff':
              device.status.isOn = false;
              break;
            case 'setBrightness':
              if (device.type === 'light' && data.value !== undefined) {
                device.light!.brightness = data.value;
                device.status.isOn = data.value > 0;
              }
              break;
          }
          await device.save();
        }

        // Broadcast to all clients in the room
        io.to(`room-${data.roomId}`).emit('room-controlled', {
          roomId: data.roomId,
          action: data.action,
          value: data.value,
          affectedDevices: devices.length
        });

        socket.emit('room-control-success', { roomId: data.roomId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to control room' });
      }
    });

    // Monitor specific device
    socket.on('monitor-device', async (deviceId: string) => {
      try {
        const device = await Device.findById(deviceId);
        if (!device) {
          socket.emit('error', { message: 'Device not found' });
          return;
        }

        socket.join(`device-${deviceId}`);
        socket.emit('monitoring-started', { deviceId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to start monitoring' });
      }
    });

    // Stop monitoring device
    socket.on('stop-monitor-device', (deviceId: string) => {
      socket.leave(`device-${deviceId}`);
      socket.emit('monitoring-stopped', { deviceId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
    });
  });

  // Broadcast functions for external use
  const broadcastDeviceUpdate = (deviceId: string, status: any) => {
    io.emit('device-updated', { deviceId, status });
  };

  const broadcastRoomUpdate = (roomId: string, data: any) => {
    io.to(`room-${roomId}`).emit('room-updated', { roomId, ...data });
  };

  const broadcastAlert = (alert: any) => {
    io.emit('alert', alert);
  };

  return {
    broadcastDeviceUpdate,
    broadcastRoomUpdate,
    broadcastAlert
  };
};

export default socketHandler;
