'use client';

import { useState, useEffect } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    icon: '⛅'
  });

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-tour="weather-widget">
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-blue-500 to-cyan-600"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Weather</h3>
          <div className="text-2xl">🌤️</div>
        </div>

        {/* Current Weather */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{weather.icon}</div>
          <div className="text-4xl font-bold text-white mb-1">
            {weather.temp}°C
          </div>
          <div className="text-purple-200 text-sm">
            {weather.condition}
          </div>
        </div>

        {/* Weather Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Humidity</span>
            <span className="text-white font-mono text-sm">{weather.humidity}%</span>
          </div>
          
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-300"
              style={{ width: `${weather.humidity}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Wind Speed</span>
            <span className="text-white font-mono text-sm">{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Time Display */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-white">
              {time.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="text-xs text-purple-200">
              {time.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Animated elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
