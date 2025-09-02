import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from '@/routes/auth';
import roomRoutes from '@/routes/rooms';
import deviceRoutes from '@/routes/devices';
import automationRoutes from '@/routes/automation';
import analyticsRoutes from '@/routes/analytics';

import { authenticateToken } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

import socketHandler from '@/socket/socketHandler';

dotenv.config();

const app: Application = express();
const server: HttpServer = createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);
app.use('/api/devices', authenticateToken, deviceRoutes);
app.use('/api/automation', authenticateToken, automationRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

socketHandler(io);

app.use(errorHandler);

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error: Error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

const PORT: string | number = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Smart Home Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
  });
});

export { app, server, io };
