import { Document, Types } from 'mongoose';

// User Types
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    timezone: string;
  };
  lastLogin: Date;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}

export interface IUserInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  preferences?: Partial<IUser['preferences']>;
}

// Room Types
export interface IRoom extends Document {
  name: string;
  icon: string;
  category: 'living-areas' | 'bedrooms' | 'bathrooms' | 'utility' | 'outdoor' | 'security';
  description?: string;
  floor: number;
  area?: number;
  temperature: {
    current: number;
    target: number;
    unit: 'celsius' | 'fahrenheit';
  };
  humidity: {
    current: number;
    target: number;
  };
  lighting: {
    brightness: number;
    color: 'warm' | 'cool' | 'white';
  };
  occupancy: {
    isOccupied: boolean;
    lastDetected?: Date;
    sensorId?: string;
  };
  settings: {
    autoLighting: boolean;
    autoClimate: boolean;
    privacyMode: boolean;
  };
  isActive: boolean;
  deviceCount: number;
}

export interface IRoomInput {
  name: string;
  icon: string;
  category: IRoom['category'];
  description?: string;
  floor?: number;
  area?: number;
}

// Device Types
export interface IDevice extends Document {
  name: string;
  type: 'light' | 'plug' | 'thermostat' | 'camera' | 'sensor' | 'switch';
  icon: string;
  room: Types.ObjectId | IRoom;
  manufacturer?: string;
  deviceModel?: string;
  serialNumber?: string;
  firmware?: {
    version?: string;
    lastUpdate?: Date;
  };
  status: {
    isOnline: boolean;
    isOn: boolean;
    lastSeen: Date;
    batteryLevel?: number;
    signalStrength?: number;
  };
  light?: {
    brightness: number;
    color: 'warm' | 'cool' | 'white';
    colorTemperature?: number;
    rgb: {
      red: number;
      green: number;
      blue: number;
    };
  };
  plug?: {
    power: number;
    voltage: number;
    current: number;
    energyConsumption: number;
  };
  thermostat?: {
    currentTemp: number;
    targetTemp: number;
    mode: 'heat' | 'cool' | 'auto' | 'off';
    fanSpeed: 'low' | 'medium' | 'high' | 'auto';
  };
  camera?: {
    isRecording: boolean;
    isMotion: boolean;
    resolution: string;
    nightVision: boolean;
    recordingPath?: string;
  };
  sensor?: {
    sensorType: 'motion' | 'temperature' | 'humidity' | 'light' | 'smoke' | 'co2';
    value?: number;
    unit?: string;
    threshold?: number;
    isTriggered: boolean;
  };
  automation: {
    schedules: Array<{
      name: string;
      enabled: boolean;
      days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
      time: string;
      action: 'turnOn' | 'turnOff' | 'setBrightness' | 'setTemperature';
      value: any;
    }>;
    triggers: Array<{
      name: string;
      enabled: boolean;
      condition: string;
      action: string;
      value: any;
    }>;
  };
  permissions: {
    users: Array<{
      user: Types.ObjectId | IUser;
      level: 'read' | 'write' | 'admin';
    }>;
  };
  tags: string[];
  notes?: string;
  isActive: boolean;
  statusSummary: {
    isOnline: boolean;
    isOn: boolean;
    lastSeen: Date;
    batteryLevel?: number;
    signalStrength?: number;
  };
  updateStatus(statusData: Partial<IDevice['status']>): Promise<IDevice>;
  toggle(): Promise<IDevice>;
}

export interface IDeviceInput {
  name: string;
  type: IDevice['type'];
  icon: string;
  room: string;
  manufacturer?: string;
  deviceModel?: string;
  serialNumber?: string;
}

export interface IDeviceUpdate {
  name?: string;
  icon?: string;
  manufacturer?: string;
  deviceModel?: string;
  serialNumber?: string;
  tags?: string[];
  notes?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Socket Types
export interface SocketData {
  deviceId: string;
  status?: Partial<IDevice['status']>;
  action?: string;
  value?: any;
  roomId?: string;
}

export interface DeviceControlData {
  deviceId: string;
  action: 'toggle' | 'setBrightness' | 'setTemperature' | 'setColor';
  value?: any;
}

export interface RoomControlData {
  roomId: string;
  action: 'turnOn' | 'turnOff' | 'setBrightness';
  value?: any;
}

export interface DeviceStatusData {
  deviceId: string;
  status: Partial<IDevice['status']>;
}

// Authentication Types
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: IUser;
  device?: IDevice;
  userPermission?: {
    user: Types.ObjectId;
    level: 'read' | 'write' | 'admin';
  };
}

// Analytics Types
export interface AnalyticsOverview {
  totalDevices: number;
  onlineDevices: number;
  activeDevices: number;
  deviceTypes: Record<string, number>;
  totalPowerConsumption: number;
  averageTemperature: number;
  energyEfficiency: {
    lights: number;
    plugs: number;
  };
}

export interface RoomStats {
  totalDevices: number;
  onlineDevices: number;
  activeDevices: number;
  deviceTypes: Record<string, number>;
  totalPowerConsumption: number;
  averageTemperature: number;
}

export interface EnergyData {
  period: string;
  totalConsumption: number;
  byDevice: Array<{
    deviceId: string;
    name: string;
    consumption: number;
  }>;
  byRoom: Array<{
    roomId: string;
    name: string;
    consumption: number;
  }>;
  trends: Array<{
    timestamp: Date;
    consumption: number;
  }>;
}

export interface DeviceUsageData {
  deviceId: string;
  name?: string;
  type?: string;
  totalUsage: number;
  averageUsage: number;
  peakUsage: number;
  usageHistory?: Array<{
    timestamp: Date;
    usage: number;
  }>;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends IUserInput {}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeviceFilterQuery {
  room?: string;
  type?: IDevice['type'];
  status?: 'online' | 'offline' | 'on' | 'off';
  limit?: string;
  page?: string;
}

export interface RoomFilterQuery {
  category?: IRoom['category'];
  floor?: string;
  limit?: string;
  page?: string;
}

export interface AnalyticsQuery {
  period?: string;
  deviceId?: string;
}

// Environment Variables
export interface EnvironmentVariables {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URI: string;
  MONGODB_URI_PROD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  MQTT_BROKER_URL: string;
  MQTT_USERNAME: string;
  MQTT_PASSWORD: string;
  BCRYPT_ROUNDS: string;
  RATE_LIMIT_WINDOW_MS: string;
  RATE_LIMIT_MAX_REQUESTS: string;
  WEATHER_API_KEY?: string;
  WEATHER_BASE_URL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  LOG_LEVEL: string;
}
