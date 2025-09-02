'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import AnimatedHeader from './AnimatedHeader';
import RoomGrid from './RoomGrid';
import WeatherWidget from './WeatherWidget';
import EnergyMonitor from './EnergyMonitor';
import SecurityPanel from './SecurityPanel';
import UserModal from './UserModal';
import SmartHomeTour from './SmartHomeTour';

export default function SmartHomeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const tourCompleted = localStorage.getItem('tour-completed');
    setHasCompletedTour(!!tourCompleted);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
    }
  };

  const markTourCompleted = () => {
    localStorage.setItem('tour-completed', 'true');
    setHasCompletedTour(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold animate-pulse">Initializing Smart Home...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header with improved layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <AnimatedHeader 
            currentTime={currentTime} 
            user={user} 
            onUserClick={() => setIsUserModalOpen(true)}
            onLogout={handleLogout}
            onRestartTour={() => setHasCompletedTour(false)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RoomGrid />
        </div>
        <div className="space-y-6">
          <WeatherWidget />
          <EnergyMonitor />
          <SecurityPanel />
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={user}
      />

      {/* Smart Home Tour */}
      <SmartHomeTour
        isFirstTime={!hasCompletedTour}
        onComplete={markTourCompleted}
      />
    </div>
  );
}
