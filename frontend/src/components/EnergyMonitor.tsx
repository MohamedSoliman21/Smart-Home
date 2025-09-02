'use client';

import { useState, useEffect } from 'react';

export default function EnergyMonitor() {
  const [energyData, setEnergyData] = useState({
    currentUsage: 2.4,
    dailyUsage: 18.7,
    monthlyUsage: 456.2,
    solarProduction: 3.2,
    batteryLevel: 78
  });

  const [isCharging, setIsCharging] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time energy data updates
      setEnergyData(prev => ({
        ...prev,
        currentUsage: prev.currentUsage + (Math.random() - 0.5) * 0.2,
        solarProduction: prev.solarProduction + (Math.random() - 0.5) * 0.1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-tour="energy-monitor">
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-green-500 to-emerald-600"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Energy Monitor</h3>
          <div className="text-2xl">⚡</div>
        </div>

        {/* Current Usage */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-white mb-1">
            {energyData.currentUsage.toFixed(1)} kW
          </div>
          <div className="text-purple-200 text-sm">Current Usage</div>
        </div>

        {/* Usage Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">Daily Usage</span>
              <span className="text-white font-mono text-sm">{energyData.dailyUsage} kWh</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                style={{ width: `${Math.min((energyData.dailyUsage / 25) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">Solar Production</span>
              <span className="text-white font-mono text-sm">{energyData.solarProduction.toFixed(1)} kW</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
                style={{ width: `${Math.min((energyData.solarProduction / 5) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200 text-sm">Battery Level</span>
              <span className="text-white font-mono text-sm">{energyData.batteryLevel}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  energyData.batteryLevel > 50 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : energyData.batteryLevel > 20
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${energyData.batteryLevel}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Energy Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {energyData.monthlyUsage}
            </div>
            <div className="text-xs text-purple-200">kWh This Month</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              ${(energyData.monthlyUsage * 0.12).toFixed(2)}
            </div>
            <div className="text-xs text-purple-200">Monthly Cost</div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isCharging ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
          <span className="text-xs text-purple-200">
            {isCharging ? 'Solar Charging' : 'Grid Power'}
          </span>
        </div>

        {/* Animated elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
