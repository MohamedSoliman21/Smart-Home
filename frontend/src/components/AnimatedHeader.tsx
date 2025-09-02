'use client';

import { useState, useEffect } from 'react';

interface AnimatedHeaderProps {
  currentTime: Date;
  user?: {
    firstName: string;
    lastName: string;
    [key: string]: any;
  } | null;
  onUserClick?: () => void;
  onLogout?: () => void;
  onRestartTour?: () => void;
}

export default function AnimatedHeader({ currentTime, user, onUserClick, onLogout, onRestartTour }: AnimatedHeaderProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [currentTime]);

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="space-y-2" data-tour="greeting">
          <h1 className="text-3xl md:text-4xl font-bold text-white animate-fade-in">
            {greeting},{' '}
            {user && user.firstName ? (
              <button
                onClick={onUserClick}
                className="text-purple-300 hover:text-purple-200 transition-colors duration-200 cursor-pointer font-semibold"
                title="Click to edit profile"
              >
                {user.firstName}
              </button>
            ) : (
              'Home'
            )}
          </h1>
          <p className="text-purple-200 text-lg animate-fade-in-delay">
            Your smart home is ready
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
          {/* Time and Date */}
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-mono font-bold text-white animate-bounce-subtle">
              {currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-purple-200 text-sm animate-fade-in-delay">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            <button
              onClick={onRestartTour}
              className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 text-sm font-medium border border-purple-500/30 hover:border-purple-500/50"
              title="Restart tour"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 text-sm font-medium border border-red-500/30 hover:border-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-10 right-10 w-16 h-16 bg-blue-500/30 rounded-full blur-xl animate-float-delay"></div>
      <div className="absolute bottom-0 left-1/4 w-12 h-12 bg-pink-500/30 rounded-full blur-xl animate-float-slow"></div>
    </header>
  );
}
