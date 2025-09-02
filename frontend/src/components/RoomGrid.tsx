'use client';

import { useState } from 'react';
import { useRooms } from '@/lib/hooks';
import { useDeviceContext } from '@/lib/deviceContext';
import RoomCard from './rooms/RoomCard';

export default function RoomGrid() {
  const [activeRoom, setActiveRoom] = useState('all');
  const { rooms = [], isLoading: roomsLoading, error: roomsError } = useRooms();
  const { devices = [], isLoading: devicesLoading, error: devicesError } = useDeviceContext();

  const roomCategories = [
    { id: 'all', name: 'All Rooms', icon: '🏠' },
    { id: 'living-areas', name: 'Living Areas', icon: '🛋️' },
    { id: 'bedrooms', name: 'Bedrooms', icon: '🛏️' },
    { id: 'bathrooms', name: 'Bathrooms', icon: '🚿' },
    { id: 'utility', name: 'Utility', icon: '🔧' },
    { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const safeDevices = Array.isArray(devices) ? devices : [];

  const filteredRooms = safeRooms.filter((room: any) => {
    if (activeRoom === 'all') return true;
    return room.category === activeRoom;
  });

  const getDevicesForRoom = (roomId: string) => {
    return safeDevices.filter((device: any) => {
      if (typeof device.room === 'string') {
        return device.room === roomId;
      } else if (device.room && typeof device.room === 'object') {
        return device.room._id === roomId;
      }
      return false;
    });
  };

  const getCategoryDeviceCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return safeDevices.length;
    }
    
    const categoryRooms = safeRooms.filter((room: any) => room.category === categoryId);
    return categoryRooms.reduce((total: number, room: any) => {
      return total + getDevicesForRoom(room._id).length;
    }, 0);
  };

  if (roomsLoading || devicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading rooms and devices...</p>
        </div>
      </div>
    );
  }

  if (roomsError || devicesError) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-300">Error loading data: {roomsError || devicesError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Room Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20" data-tour="room-navigation">
        {roomCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveRoom(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeRoom === category.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {getCategoryDeviceCount(category.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room: any, index: number) => (
          <div key={room._id} data-tour={index === 0 ? "room-card" : undefined}>
            <RoomCard
              room={room}
              devices={getDevicesForRoom(room._id)}
            />
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-white mb-2">No rooms found</h3>
          <p className="text-purple-200">No rooms match the selected category.</p>
        </div>
      )}
    </div>
  );
}
