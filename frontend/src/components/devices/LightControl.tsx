'use client';

import { useState, useEffect } from 'react';
import { useDeviceContext } from '@/lib/deviceContext';

interface LightControlProps {
  deviceId: string;
  name: string;
  isOn: boolean;
  brightness: number;
  color: 'warm' | 'cool' | 'white';
  icon: string;
  delay: number;
}

export default function LightControl({ deviceId, name, isOn, brightness, color, icon, delay }: LightControlProps) {
  const [isOnState, setIsOnState] = useState(isOn);
  const [brightnessState, setBrightnessState] = useState(brightness);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleDevice, controlLight } = useDeviceContext();

  const colorClasses = {
    warm: 'from-yellow-400 to-orange-500',
    cool: 'from-blue-400 to-cyan-500',
    white: 'from-gray-300 to-white'
  };

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

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = Number(e.target.value);
    setBrightnessState(newBrightness);
  };

  const handleBrightnessBlur = async () => {
    try {
      setIsLoading(true);
      await controlLight(deviceId, { brightness: brightnessState });
    } catch (error) {
      setBrightnessState(brightness);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsOnState(isOn);
    setBrightnessState(brightness);
  }, [isOn, brightness]);

  return (
    <div 
      className={`group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${colorClasses[color]}`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
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
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isOnState ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
              isOnState ? 'left-8' : 'left-1'
            }`}></div>
          </button>
        </div>

        {/* Brightness Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Brightness</span>
            <span className="text-white font-mono text-sm">{brightnessState}%</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={brightnessState}
              onChange={handleBrightnessChange}
              onBlur={handleBrightnessBlur}
              disabled={!isOnState || isLoading}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                isOnState
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gray-600'
              } ${(!isOnState || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isOnState ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-xs text-purple-200">
            {isOnState ? 'Connected' : 'Disconnected'}
          </span>
          {isLoading && (
            <div className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    </div>
  );
}
