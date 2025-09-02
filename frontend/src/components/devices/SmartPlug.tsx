'use client';

import { useState, useEffect } from 'react';
import { useDeviceContext } from '@/lib/deviceContext'; // Updated import

interface SmartPlugProps {
  deviceId: string;
  name: string;
  isOn: boolean;
  power: number;
  icon: string;
  delay: number;
}

export default function SmartPlug({ deviceId, name, isOn, power, icon, delay }: SmartPlugProps) {
  const [isOnState, setIsOnState] = useState(isOn);
  const [powerState, setPowerState] = useState(power);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleDevice } = useDeviceContext(); // Updated to use context

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await toggleDevice(deviceId);
      setIsOnState(!isOnState);
    } catch (error) {
      setIsOnState(isOn);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsOnState(isOn);
    setPowerState(power);
  }, [isOn, power]);

  return (
    <div
      className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-green-500 to-blue-600"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`text-3xl transition-transform duration-300 ${isOnState ? 'animate-pulse' : 'opacity-50'}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <p className={`text-sm ${isOnState ? 'text-green-300' : 'text-gray-400'}`}>
              {isOnState ? 'ON' : 'OFF'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            isOnState ? 'bg-green-600' : 'bg-gray-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
            isOnState ? 'left-8' : 'left-1'
          }`}></div>
        </button>
      </div>

      {/* Power Usage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-purple-200 text-sm">Power Usage</span>
          <span className="text-white font-mono text-sm">{powerState}W</span>
        </div>

        <div className="relative">
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOnState
                  ? 'bg-gradient-to-r from-green-400 to-blue-500'
                  : 'bg-gray-600'
              }`}
              style={{ width: `${isOnState ? Math.min(powerState, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Energy Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {isOnState ? Math.round(powerState * 0.24) : 0}
          </div>
          <div className="text-xs text-purple-200">kWh Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            ${isOnState ? (powerState * 0.12 / 1000).toFixed(2) : '0.00'}
          </div>
          <div className="text-xs text-purple-200">Cost Today</div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isOnState ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
        <span className="text-xs text-purple-200">
          {isOnState ? 'Connected' : 'Disconnected'}
        </span>
        {isLoading && (
          <div className="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
}
