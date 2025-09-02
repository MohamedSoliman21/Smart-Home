const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['light', 'plug', 'thermostat', 'camera', 'sensor', 'switch'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  firmware: {
    version: { type: String },
    lastUpdate: { type: Date }
  },
  status: {
    isOnline: { type: Boolean, default: true },
    isOn: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    batteryLevel: { type: Number, min: 0, max: 100 }, // for battery-powered devices
    signalStrength: { type: Number, min: 0, max: 100 } // for wireless devices
  },
  // Device-specific properties
  light: {
    brightness: { type: Number, min: 0, max: 100, default: 0 },
    color: { type: String, enum: ['warm', 'cool', 'white'], default: 'warm' },
    colorTemperature: { type: Number, min: 2000, max: 6500 }, // Kelvin
    rgb: {
      red: { type: Number, min: 0, max: 255, default: 255 },
      green: { type: Number, min: 0, max: 255, default: 255 },
      blue: { type: Number, min: 0, max: 255, default: 255 }
    }
  },
  plug: {
    power: { type: Number, default: 0 }, // in watts
    voltage: { type: Number, default: 120 }, // in volts
    current: { type: Number, default: 0 }, // in amps
    energyConsumption: { type: Number, default: 0 } // in kWh
  },
  thermostat: {
    currentTemp: { type: Number, default: 22 },
    targetTemp: { type: Number, default: 22 },
    mode: { type: String, enum: ['heat', 'cool', 'auto', 'off'], default: 'auto' },
    fanSpeed: { type: String, enum: ['low', 'medium', 'high', 'auto'], default: 'auto' }
  },
  camera: {
    isRecording: { type: Boolean, default: false },
    isMotion: { type: Boolean, default: false },
    resolution: { type: String, default: '1080p' },
    nightVision: { type: Boolean, default: true },
    recordingPath: { type: String }
  },
  sensor: {
    sensorType: { type: String, enum: ['motion', 'temperature', 'humidity', 'light', 'smoke', 'co2'] },
    value: { type: Number },
    unit: { type: String },
    threshold: { type: Number },
    isTriggered: { type: Boolean, default: false }
  },
  // Automation and scheduling
  automation: {
    schedules: [{
      name: { type: String },
      enabled: { type: Boolean, default: true },
      days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
      time: { type: String }, // HH:MM format
      action: { type: String, enum: ['turnOn', 'turnOff', 'setBrightness', 'setTemperature'] },
      value: { type: mongoose.Schema.Types.Mixed }
    }],
    triggers: [{
      name: { type: String },
      enabled: { type: Boolean, default: true },
      condition: { type: String }, // e.g., "motion detected", "temperature > 25"
      action: { type: String },
      value: { type: mongoose.Schema.Types.Mixed }
    }]
  },
  // Permissions
  permissions: {
    users: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      level: { type: String, enum: ['read', 'write', 'admin'], default: 'read' }
    }]
  },
  // Metadata
  tags: [{ type: String }],
  notes: { type: String },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
deviceSchema.index({ room: 1, type: 1, isActive: 1 });
deviceSchema.index({ serialNumber: 1 });
deviceSchema.index({ 'status.isOnline': 1 });

// Virtual for device status summary
deviceSchema.virtual('statusSummary').get(function() {
  return {
    isOnline: this.status.isOnline,
    isOn: this.status.isOn,
    lastSeen: this.status.lastSeen,
    batteryLevel: this.status.batteryLevel,
    signalStrength: this.status.signalStrength
  };
});

// Method to update device status
deviceSchema.methods.updateStatus = function(statusData) {
  Object.assign(this.status, statusData);
  this.status.lastSeen = new Date();
  return this.save();
};

// Method to toggle device
deviceSchema.methods.toggle = function() {
  this.status.isOn = !this.status.isOn;
  return this.save();
};

module.exports = mongoose.model('Device', deviceSchema);
