'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Device } from './api';
import { useAuth } from './auth';

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.getDevices();
      setDevices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch devices');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const toggleDevice = useCallback(async (deviceId: string) => {
    try {
      const updatedDevice = await apiClient.toggleDevice(deviceId);
      setDevices(prev => 
        prev.map(device => 
          device._id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle device');
      throw err;
    }
  }, []);

  const updateDeviceStatus = useCallback(async (deviceId: string, status: Partial<Device['status']>) => {
    try {
      const updatedDevice = await apiClient.updateDeviceStatus(deviceId, status);
      setDevices(prev => 
        prev.map(device => 
          device._id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err: any) {
      setError(err.message || 'Failed to update device status');
      throw err;
    }
  }, []);

  const controlLight = useCallback(async (deviceId: string, control: {
    brightness?: number;
    color?: string;
    colorTemperature?: number;
    rgb?: { red: number; green: number; blue: number };
  }) => {
    try {
      const updatedDevice = await apiClient.controlLight(deviceId, control);
      setDevices(prev => 
        prev.map(device => 
          device._id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err: any) {
      setError(err.message || 'Failed to control light');
      throw err;
    }
  }, []);

  const controlThermostat = useCallback(async (deviceId: string, control: {
    targetTemp?: number;
    mode?: string;
    fanSpeed?: string;
  }) => {
    try {
      const updatedDevice = await apiClient.controlThermostat(deviceId, control);
      setDevices(prev => 
        prev.map(device => 
          device._id === deviceId ? updatedDevice : device
        )
      );
      return updatedDevice;
    } catch (err: any) {
      setError(err.message || 'Failed to control thermostat');
      throw err;
    }
  }, []);

  const toggleRoomDevices = useCallback(async (roomId: string, turnOn: boolean) => {
    try {
      const result = await apiClient.toggleRoomDevices(roomId, turnOn);
      // Update devices in state with the updated devices from the response
      setDevices(prev => 
        prev.map(device => {
          const updatedDevice = result.devices.find(d => d._id === device._id);
          return updatedDevice || device;
        })
      );
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle room devices');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    fetchDevices,
    toggleDevice,
    updateDeviceStatus,
    controlLight,
    controlThermostat,
    toggleRoomDevices,
  };
}

export function useRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.getRooms();
      setRooms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getDevicesByRoom = useCallback(async (roomId: string) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const data = await apiClient.getDevicesByRoom(roomId);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch room devices');
      throw err;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    isLoading,
    error,
    fetchRooms,
    getDevicesByRoom,
  };
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.getAnalyticsOverview();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEnergyConsumption = useCallback(async (period: string = '24h') => {
    try {
      const data = await apiClient.getEnergyConsumption(period);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch energy consumption');
      throw err;
    }
  }, []);

  const fetchDeviceUsage = useCallback(async (deviceId?: string) => {
    try {
      const data = await apiClient.getDeviceUsage(deviceId);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch device usage');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
    fetchEnergyConsumption,
    fetchDeviceUsage,
  };
}
