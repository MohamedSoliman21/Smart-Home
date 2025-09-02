import mongoose, { Schema } from 'mongoose';
import { IRoom } from '@/types';

const roomSchema = new Schema<IRoom>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['living-areas', 'bedrooms', 'bathrooms', 'utility', 'outdoor', 'security'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  floor: {
    type: Number,
    default: 1
  },
  area: {
    type: Number, // in square meters
    min: 0
  },
  temperature: {
    current: { type: Number, default: 22 },
    target: { type: Number, default: 22 },
    unit: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' }
  },
  humidity: {
    current: { type: Number, default: 50 },
    target: { type: Number, default: 50 }
  },
  lighting: {
    brightness: { type: Number, min: 0, max: 100, default: 0 },
    color: { type: String, enum: ['warm', 'cool', 'white'], default: 'warm' }
  },
  occupancy: {
    isOccupied: { type: Boolean, default: false },
    lastDetected: { type: Date },
    sensorId: { type: String }
  },
  settings: {
    autoLighting: { type: Boolean, default: true },
    autoClimate: { type: Boolean, default: true },
    privacyMode: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
roomSchema.index({ category: 1, isActive: 1 });
roomSchema.index({ name: 1 });

export default mongoose.model<IRoom>('Room', roomSchema);
