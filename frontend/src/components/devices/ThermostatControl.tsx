'use client';

import { useState, useEffect } from 'react';
import { useDeviceContext } from '@/lib/deviceContext';

interface ThermostatControlProps {
  deviceId: string;
  name: string;
  currentTemp: number;
  targetTemp: number;
  mode: 'heat' | 'cool' | 'auto' | 'off';
  delay: number;
}

export default function ThermostatControl({ deviceId, name, currentTemp, targetTemp, mode, delay }: ThermostatControlProps) {
  const [currentTempState, setCurrentTempState] = useState(currentTemp);
  const [targetTempState, setTargetTempState] = useState(targetTemp);
  const [modeState, setModeState] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  const { controlThermostat } = useDeviceContext();

  const modes = [
    { id: 'heat', label: 'Heat', icon: '🔥', color: 'from-red-500 to-orange-500' },
    { id: 'cool', label: 'Cool', icon: '❄️', color: 'from-blue-500 to-cyan-500' },
    { id: 'auto', label: 'Auto', icon: '🔄', color: 'from-purple-500 to-pink-500' },
    { id: 'off', label: 'Off', icon: '⏸️', color: 'from-gray-500 to-gray-600' }
  ];

  const handleTargetTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTemp = Number(e.target.value);
    setTargetTempState(newTemp);
  };

  const handleTargetTempBlur = async () => {
    try {
      setIsLoading(true);
      await controlThermostat(deviceId, { targetTemp: targetTempState });
    } catch (error) {
      setTargetTempState(targetTemp);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = async (newMode: string) => {
    try {
      setIsLoading(true);
      await controlThermostat(deviceId, { mode: newMode });
      setModeState(newMode as typeof mode);
    } catch (error) {
      setModeState(mode);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentTempState(currentTemp);
    setTargetTempState(targetTemp);
    setModeState(mode);
  }, [currentTemp, targetTemp, mode]);

  return (
    <div 
      className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-blue-500 to-purple-600"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🌡️</div>
            <div>
              <h3 className="text-white font-semibold text-lg">{name}</h3>
              <p className="text-sm text-purple-200">Climate Control</p>
            </div>
          </div>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Temperature Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-white mb-2">
            {currentTempState}°C
          </div>
          <div className="text-sm text-purple-200">
            Target: {targetTempState}°C
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Target Temperature</span>
            <span className="text-white font-mono text-sm">{targetTempState}°C</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="16"
              max="30"
              value={targetTempState}
              onChange={handleTargetTempChange}
              onBlur={handleTargetTempBlur}
              disabled={isLoading}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <span className="text-purple-200 text-sm">Mode</span>
          <div className="grid grid-cols-2 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                disabled={isLoading}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  modeState === m.id
                    ? `bg-gradient-to-r ${m.color} text-white shadow-lg transform scale-105`
                    : 'bg-white/10 text-purple-200 hover:text-white hover:bg-white/20'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{m.icon}</span>
                  <span>{m.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${modeState === 'off' ? 'bg-gray-500' : 'bg-green-400 animate-pulse'}`}></div>
          <span className="text-xs text-purple-200">
            {modeState === 'off' ? 'System Off' : 'System Active'}
          </span>
        </div>
      </div>
    </div>
  );
}
