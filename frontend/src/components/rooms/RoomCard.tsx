'use client';

import { useState } from 'react';
import { useDeviceContext } from '@/lib/deviceContext';
import QuickRoomControl from './QuickRoomControl';
import LightControl from '../devices/LightControl';
import ThermostatControl from '../devices/ThermostatControl';
import SmartPlug from '../devices/SmartPlug';
import CameraControl from '../devices/CameraControl';

interface RoomCardProps {
  room: any;
  devices: any[];
}

export default function RoomCard({ room, devices }: RoomCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleRoomDevices } = useDeviceContext();

  const getActiveDeviceCount = () => {
    return devices.filter(device => 
      device.type === 'light' ? device.status.isOn :
      device.type === 'plug' ? device.status.isOn :
      device.type === 'camera' ? device.camera?.isRecording :
      device.type === 'thermostat' ? device.thermostat?.mode !== 'off' : false
    ).length;
  };

  const handleToggleAll = async (turnOn: boolean) => {
    try {
      setIsLoading(true);
      
      const result = await toggleRoomDevices(room._id, turnOn);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const renderDevice = (device: any, deviceIndex: number) => {
    const deviceDelay = deviceIndex * 50;

    switch (device.type) {
      case 'light':
        return (
          <LightControl
            key={device._id}
            deviceId={device._id}
            name={device.name}
            isOn={device.status.isOn}
            brightness={device.light?.brightness || 0}
            color={device.light?.color || 'warm'}
            icon={device.icon}
            delay={deviceDelay}
          />
        );
      case 'thermostat':
        return (
          <ThermostatControl
            key={device._id}
            deviceId={device._id}
            name={device.name}
            currentTemp={device.thermostat?.currentTemp || 22}
            targetTemp={device.thermostat?.targetTemp || 22}
            mode={device.thermostat?.mode || 'auto'}
            delay={deviceDelay}
          />
        );
      case 'plug':
        return (
          <SmartPlug
            key={device._id}
            deviceId={device._id}
            name={device.name}
            isOn={device.status.isOn}
            power={device.plug?.power || 0}
            icon={device.icon}
            delay={deviceDelay}
          />
        );
      case 'camera':
        return (
          <CameraControl
            key={device._id}
            name={device.name}
            isRecording={device.camera?.isRecording || false}
            isMotion={device.camera?.isMotion || false}
            icon={device.icon}
            delay={deviceDelay}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `0ms` }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-purple-500 to-blue-600"></div>
      
      <div className="relative z-10">
        {/* Room Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{room.icon}</div>
            <div>
              <h3 className="text-white font-semibold text-xl">{room.name}</h3>
              <p className="text-purple-200 text-sm">
                {getActiveDeviceCount()} of {room.deviceCount} devices active
              </p>
            </div>
          </div>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isExpanded 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-purple-200 hover:text-white hover:bg-white/20'
            }`}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Quick Room Control */}
        <div className="mb-6">
                      <QuickRoomControl
              roomName={room.name}
              deviceCount={devices.length}
              activeCount={getActiveDeviceCount()}
              onToggleAll={handleToggleAll}
              isLoading={isLoading}
            />
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{getActiveDeviceCount()}</div>
            <div className="text-xs text-purple-200">Active</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{devices.length}</div>
            <div className="text-xs text-purple-200">Total</div>
          </div>
        </div>

        {/* Device List - Collapsed View */}
        {!isExpanded && (
          <div className="space-y-3">
            {devices.slice(0, 3).map((device, index) => (
              <div key={device.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`text-xl ${device.status.isOn ? 'animate-pulse' : 'opacity-50'}`}>
                    {device.icon}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{device.name}</div>
                                         <div className="text-purple-200 text-xs">
                       {device.type === 'light' ? (device.status.isOn ? 'ON' : 'OFF') :
                        device.type === 'plug' ? (device.status.isOn ? 'ON' : 'OFF') :
                        device.type === 'camera' ? (device.camera?.isRecording ? 'RECORDING' : 'STANDBY') :
                        device.type === 'thermostat' ? `${device.thermostat?.currentTemp || 22}°C` : 'Unknown'}
                     </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  device.status.isOn || device.camera?.isRecording || device.thermostat?.mode !== 'off' 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-gray-500'
                }`}></div>
              </div>
            ))}
            {devices.length > 3 && (
              <div className="text-center text-purple-200 text-sm">
                +{devices.length - 3} more devices
              </div>
            )}
          </div>
        )}

        {/* Device List - Expanded View */}
        {isExpanded && (
          <div className="space-y-4">
            <div className="text-purple-200 text-sm font-medium mb-3">All Devices</div>
            <div className="grid grid-cols-1 gap-4">
              {devices.map((device, index) => renderDevice(device, index))}
            </div>
          </div>
        )}

        {/* Room Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-purple-200">
            Room Connected • {getActiveDeviceCount()} devices active
          </span>
        </div>
      </div>
    </div>
  );
}
