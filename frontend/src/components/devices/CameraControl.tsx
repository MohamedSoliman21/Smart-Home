'use client';

import { useState } from 'react';

interface CameraControlProps {
  name: string;
  isRecording: boolean;
  isMotion: boolean;
  icon: string;
  delay: number;
}

export default function CameraControl({ name, isRecording, isMotion, icon, delay }: CameraControlProps) {
  const [isRecordingState, setIsRecordingState] = useState(isRecording);
  const [isMotionState, setIsMotionState] = useState(isMotion);

  const handleToggleRecording = () => {
    setIsRecordingState(!isRecordingState);
  };

  return (
    <div 
      className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-red-500 to-orange-600"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl transition-transform duration-300 ${isRecordingState ? 'animate-pulse' : 'opacity-50'}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{name}</h3>
              <p className={`text-sm ${isRecordingState ? 'text-red-300' : 'text-gray-400'}`}>
                {isRecordingState ? 'RECORDING' : 'STANDBY'}
              </p>
            </div>
          </div>
          
          {/* Recording Indicator */}
          <div className={`w-4 h-4 rounded-full ${isRecordingState ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>

        {/* Camera Preview */}
        <div className="relative mb-4">
          <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl opacity-30">📹</div>
            </div>
            
            {/* Motion Detection Overlay */}
            {isMotionState && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse flex items-center justify-center">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-bounce">
                  MOTION DETECTED
                </div>
              </div>
            )}
            
            {/* Recording Overlay */}
            {isRecordingState && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                REC
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Recording</span>
            <button
              onClick={handleToggleRecording}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                isRecordingState ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                isRecordingState ? 'left-7' : 'left-1'
              }`}></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Motion Detection</span>
            <div className={`w-3 h-3 rounded-full ${isMotionState ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-200">Storage</span>
            <span className="text-white">78%</span>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400" style={{ width: '78%' }}></div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isRecordingState ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-xs text-purple-200">
            {isRecordingState ? 'Active' : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  );
}
