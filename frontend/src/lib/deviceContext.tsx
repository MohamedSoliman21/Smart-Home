'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useDevices } from './hooks';

interface DeviceContextType {
  devices: any[];
  isLoading: boolean;
  error: string;
  toggleDevice: (deviceId: string) => Promise<any>;
  updateDeviceStatus: (deviceId: string, status: any) => Promise<any>;
  controlLight: (deviceId: string, control: any) => Promise<any>;
  controlThermostat: (deviceId: string, control: any) => Promise<any>;
  toggleRoomDevices: (roomId: string, turnOn: boolean) => Promise<any>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const deviceData = useDevices();

  return (
    <DeviceContext.Provider value={deviceData}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return context;
}
