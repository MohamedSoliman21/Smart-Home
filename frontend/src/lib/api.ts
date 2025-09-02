const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  _id: string;
  username: string;
  email: string;
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
  lastLogin: string;
  isActive: boolean;
}

export interface Device {
  _id: string;
  name: string;
  type: 'light' | 'plug' | 'thermostat' | 'camera' | 'sensor' | 'switch';
  icon: string;
  room: string;
  status: {
    isOnline: boolean;
    isOn: boolean;
    lastSeen: string;
    batteryLevel?: number;
    signalStrength?: number;
  };
  light?: {
    brightness: number;
    color: 'warm' | 'cool' | 'white';
    colorTemperature?: number;
    rgb?: {
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
  isActive: boolean;
}

export interface Room {
  _id: string;
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
    lastDetected?: string;
    sensorId?: string;
  };
  settings: {
    autoLighting: boolean;
    autoClimate: boolean;
    privacyMode: boolean;
  };
  isActive: boolean;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getProfile(): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/profile');
    return response.data!.user;
  }

  async getDevices(): Promise<Device[]> {
    const response = await this.request<{ data: Device[]; pagination: unknown }>('/devices');
    return response.data!.data || response.data!;
  }

  async getDevice(id: string): Promise<Device> {
    const response = await this.request<Device>(`/devices/${id}`);
    return response.data!;
  }

  async toggleDevice(id: string): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}/toggle`, {
      method: 'POST',
    });
    return response.data!.device;
  }

  async toggleRoomDevices(roomId: string, turnOn: boolean): Promise<{ devices: Device[]; roomId: string; turnOn: boolean; toggledCount: number }> {
    const response = await this.request<{ devices: Device[]; roomId: string; turnOn: boolean; toggledCount: number }>(`/devices/room/${roomId}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ turnOn }),
    });
    return response.data!;
  }

  async updateDeviceStatus(id: string, status: Partial<Device['status']>): Promise<Device> {
    const response = await this.request<Device>(`/devices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
    return response.data!;
  }

  async controlLight(id: string, control: {
    brightness?: number;
    color?: string;
    colorTemperature?: number;
    rgb?: { red: number; green: number; blue: number };
  }): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}/light`, {
      method: 'POST',
      body: JSON.stringify(control),
    });
    return response.data!.device;
  }

  async controlThermostat(id: string, control: {
    targetTemp?: number;
    mode?: string;
    fanSpeed?: string;
  }): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}/thermostat`, {
      method: 'POST',
      body: JSON.stringify(control),
    });
    return response.data!.device;
  }

  async getRooms(): Promise<Room[]> {
    const response = await this.request<{ data: Room[]; pagination: unknown }>('/rooms');
    return response.data!.data || response.data!;
  }

  async getRoom(id: string): Promise<Room> {
    const response = await this.request<Room>(`/rooms/${id}`);
    return response.data!;
  }

  async getDevicesByRoom(roomId: string): Promise<Device[]> {
    const response = await this.request<Device[]>(`/rooms/${roomId}/devices`);
    return response.data!;
  }

  async updateRoomTemperature(roomId: string, temperature: number): Promise<Room> {
    const response = await this.request<Room>(`/rooms/${roomId}/temperature`, {
      method: 'PUT',
      body: JSON.stringify({ temperature }),
    });
    return response.data!;
  }

  async updateRoomLighting(roomId: string, lighting: {
    brightness?: number;
    color?: string;
  }): Promise<Room> {
    const response = await this.request<Room>(`/rooms/${roomId}/lighting`, {
      method: 'PUT',
      body: JSON.stringify(lighting),
    });
    return response.data!;
  }

  async getAnalyticsOverview(): Promise<unknown> {
    const response = await this.request('/analytics/overview');
    return response.data!;
  }

  async getEnergyConsumption(period: string = '24h'): Promise<unknown> {
    const response = await this.request(`/analytics/energy?period=${period}`);
    return response.data!;
  }

  async getDeviceUsage(deviceId?: string): Promise<unknown[]> {
    const url = deviceId ? `/analytics/device-usage?deviceId=${deviceId}` : '/analytics/device-usage';
    const response = await this.request<unknown[]>(url);
    return response.data!;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

