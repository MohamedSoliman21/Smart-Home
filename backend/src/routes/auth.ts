import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '@/models/User';
import { authenticateToken } from '@/middleware/auth';
import { 
  IUserUpdate, 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest,
  ApiResponse
} from '@/types';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('admin', 'user', 'guest').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
router.post('/register', async (req: Request<{}, {}, RegisterRequest>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0]?.message || 'Validation error'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: value.email }, { username: value.username }]
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
      return;
    }

    // Create new user
    const user = new User(value);
    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret as any,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0]?.message || 'Validation error'
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email: value.email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(value.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret as any,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: {
        user: (req as any).user
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: Request<{}, {}, IUserUpdate>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    const user = await User.findById((req as any).user._id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req: Request<{}, {}, ChangePasswordRequest>, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
      return;
    }

    const user = await User.findById((req as any).user._id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const token = jwt.sign(
      { userId: (req as any).user._id },
      jwtSecret as any,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (_req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export default router;
