'use client';

import { useState, useEffect } from 'react';

export default function SecurityPanel() {
  const [securityStatus, setSecurityStatus] = useState({
    isArmed: true,
    mode: 'away',
    lastActivity: '2 min ago',
    sensors: {
      frontDoor: { active: true, status: 'closed' },
      backDoor: { active: true, status: 'closed' },
      windows: { active: true, status: 'closed' },
      motion: { active: true, status: 'clear' }
    }
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'motion', location: 'Front Door', time: '2 min ago', severity: 'low' },
    { id: 2, type: 'door', location: 'Back Door', time: '15 min ago', severity: 'medium' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate security system updates
      setSecurityStatus(prev => ({
        ...prev,
        lastActivity: `${Math.floor(Math.random() * 10) + 1} min ago`
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleArmDisarm = () => {
    setSecurityStatus(prev => ({
      ...prev,
      isArmed: !prev.isArmed
    }));
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'away': return 'from-red-500 to-orange-500';
      case 'home': return 'from-yellow-500 to-orange-500';
      case 'night': return 'from-purple-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl" data-tour="security-panel">
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-red-500 to-orange-600"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Security</h3>
          <div className="text-2xl">🔒</div>
        </div>

        {/* Status Display */}
        <div className="text-center mb-6">
          <div className={`text-2xl font-bold mb-2 ${securityStatus.isArmed ? 'text-red-400' : 'text-green-400'}`}>
            {securityStatus.isArmed ? 'ARMED' : 'DISARMED'}
          </div>
          <div className="text-purple-200 text-sm capitalize">
            {securityStatus.mode} Mode
          </div>
        </div>

        {/* Arm/Disarm Button */}
        <button
          onClick={handleArmDisarm}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mb-4 ${
            securityStatus.isArmed
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
          }`}
        >
          {securityStatus.isArmed ? 'DISARM' : 'ARM'}
        </button>

        {/* Sensor Status */}
        <div className="space-y-3 mb-4">
          <div className="text-purple-200 text-sm font-medium">Sensors</div>
          {Object.entries(securityStatus.sensors).map(([key, sensor]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-white text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${sensor.active ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <span className="text-xs text-purple-200 capitalize">
                  {sensor.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2">
          <div className="text-purple-200 text-sm font-medium">Recent Activity</div>
          {alerts.slice(0, 2).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-400' : 
                  alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-white text-xs">{alert.location}</span>
              </div>
              <span className="text-xs text-purple-200">{alert.time}</span>
            </div>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${securityStatus.isArmed ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-xs text-purple-200">
            {securityStatus.isArmed ? 'System Active' : 'System Disabled'}
          </span>
        </div>

        {/* Animated elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
