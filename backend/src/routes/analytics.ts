import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '@/middleware/auth';
import Device from '@/models/Device';
import Room from '@/models/Room';
import { 
  AnalyticsQuery,
  ApiResponse,
  AnalyticsOverview,
  EnergyData,
  DeviceUsageData 
} from '@/types';

const router: ReturnType<typeof Router> = Router();

// Get analytics overview
router.get('/overview', authenticateToken, async (_req: Request, res: Response<ApiResponse<AnalyticsOverview>>, next: NextFunction) => {
  try {
    const devices = await Device.find({ isActive: true });
    const rooms = await Room.find({ isActive: true });

    const overview: AnalyticsOverview = {
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
      averageTemperature: rooms.reduce((total, room) => {
        return total + room.temperature.current;
      }, 0) / Math.max(rooms.length, 1),
      energyEfficiency: {
        lights: devices.filter(d => d.type === 'light' && d.status.isOn).length,
        plugs: devices.filter(d => d.type === 'plug' && d.status.isOn).length
      }
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
});

// Get energy consumption data
router.get('/energy', authenticateToken, async (req: Request<{}, {}, {}, AnalyticsQuery>, res: Response<ApiResponse<EnergyData>>, next: NextFunction) => {
  try {
    const { period = '24h' } = req.query;
    
    // Get devices with energy consumption
    const devices = await Device.find({ 
      isActive: true, 
      type: 'plug' 
    }).populate('room', 'name');

    const byDevice = devices.map(device => ({
      deviceId: device._id.toString(),
      name: device.name,
      consumption: device.plug?.energyConsumption || 0
    }));

    const byRoom = devices.reduce((acc, device) => {
      const roomName = (device.room as any)?.name || 'Unknown';
      const existing = acc.find(r => r.name === roomName);
      if (existing) {
        existing.consumption += device.plug?.energyConsumption || 0;
      } else {
        acc.push({
          roomId: (device.room as any)?._id?.toString() || '',
          name: roomName,
          consumption: device.plug?.energyConsumption || 0
        });
      }
      return acc;
    }, [] as Array<{ roomId: string; name: string; consumption: number }>);

    // Generate mock trends data for the last 24 hours
    const trends = Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
      consumption: Math.random() * 100 + 50 // Mock data
    }));

    const energyData: EnergyData = {
      period,
      totalConsumption: devices.reduce((total, device) => {
        return total + (device.plug?.energyConsumption || 0);
      }, 0),
      byDevice,
      byRoom,
      trends
    };

    res.json({
      success: true,
      data: energyData
    });
  } catch (error) {
    next(error);
  }
});

// Get device usage statistics
router.get('/device-usage', authenticateToken, async (req: Request<{}, {}, {}, AnalyticsQuery>, res: Response<ApiResponse<DeviceUsageData[]>>, next: NextFunction) => {
  try {
    const { deviceId } = req.query;
    
    let devices;
    if (deviceId) {
      devices = await Device.find({ _id: deviceId, isActive: true });
    } else {
      devices = await Device.find({ isActive: true });
    }

    const usageData: DeviceUsageData[] = devices.map(device => {
      // Mock usage data - in a real app, this would come from historical data
      const totalUsage = Math.random() * 1000 + 100;
      const averageUsage = totalUsage / 30; // Assuming 30 days
      const peakUsage = totalUsage * 1.5;

      return {
        deviceId: device._id.toString(),
        name: device.name,
        type: device.type,
        totalUsage,
        averageUsage,
        peakUsage,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
          timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
          usage: Math.random() * 50 + 10
        }))
      };
    });

    res.json({
      success: true,
      data: usageData
    });
  } catch (error) {
    next(error);
  }
});

export default router;
