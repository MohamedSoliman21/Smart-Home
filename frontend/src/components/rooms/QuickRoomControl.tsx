'use client';

import { useState } from 'react';

interface QuickRoomControlProps {
  roomName: string;
  deviceCount: number;
  activeCount: number;
  onToggleAll: (turnOn: boolean) => void;
  isLoading?: boolean;
}

export default function QuickRoomControl({ roomName, deviceCount, activeCount, onToggleAll, isLoading = false }: QuickRoomControlProps) {
  // Remove the local state and use props directly for color logic
  const isAllOn = activeCount === deviceCount && deviceCount > 0;
  const isAllOff = activeCount === 0;

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">Quick Control</h4>
        <div className="text-xs text-purple-200">
          {activeCount}/{deviceCount} active
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onToggleAll(true)}
          disabled={isLoading}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
            isAllOn 
              ? 'bg-green-600 text-white' 
              : 'bg-white/10 text-purple-200 hover:text-white hover:bg-white/20'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Loading...' : 'All On'}
        </button>
        <button
          onClick={() => onToggleAll(false)}
          disabled={isLoading}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
            isAllOff
              ? 'bg-red-600 text-white' 
              : 'bg-white/10 text-purple-200 hover:text-white hover:bg-white/20'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Loading...' : 'All Off'}
        </button>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-purple-200">Status</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            activeCount > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-xs text-purple-200">
            {activeCount > 0 ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
