import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Device from '@/models/Device';
import { IUser, JwtPayload } from '@/types';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or inactive user'
      });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
      return;
    }
    
    res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const authorizeRole = (...roles: IUser['role'][]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as any;
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const authorizeDeviceAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as any;
    const deviceId = req.params.deviceId || req.body.deviceId;
    
    if (!deviceId) {
      next(); // No device ID, skip authorization
      return;
    }

    const device = await Device.findById(deviceId);

    if (!device) {
      res.status(404).json({
        success: false,
        message: 'Device not found'
      });
      return;
    }

    // Check if user has permission to access this device
    const userPermission = device.permissions.users.find(
      p => p.user.toString() === authReq.user!._id.toString()
    );

    if (!userPermission && authReq.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied to this device'
      });
      return;
    }

    authReq.device = device;
    authReq.userPermission = userPermission || undefined;
    next();
  } catch (error) {
    next(error);
  }
};
