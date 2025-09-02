import mongoose from 'mongoose';
import Room from '../src/models/Room';
import Device from '../src/models/Device';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Room.deleteMany({});
    await Device.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, sms: false },
        timezone: 'UTC'
      },
      isActive: true
    });
    console.log('👤 Created test user');

    // Create rooms with current icons
    const rooms = await Room.create([
      {
        name: 'Living Room',
        icon: '🛋️',
        category: 'living-areas',
        description: 'Main living area with entertainment system',
        floor: 1,
        area: 25,
        temperature: { current: 22, target: 22, unit: 'celsius' },
        humidity: { current: 45, target: 50 },
        lighting: { brightness: 60, color: 'warm' },
        occupancy: { isOccupied: true, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: false },
        isActive: true
      },
      {
        name: 'Kitchen',
        icon: '🍳',
        category: 'living-areas',
        description: 'Modern kitchen with smart appliances',
        floor: 1,
        area: 18,
        temperature: { current: 24, target: 22, unit: 'celsius' },
        humidity: { current: 55, target: 50 },
        lighting: { brightness: 80, color: 'white' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: false },
        isActive: true
      },
      {
        name: 'Master Bedroom',
        icon: '🛏️',
        category: 'bedrooms',
        description: 'Main bedroom with smart lighting',
        floor: 2,
        area: 20,
        temperature: { current: 21, target: 20, unit: 'celsius' },
        humidity: { current: 50, target: 50 },
        lighting: { brightness: 30, color: 'warm' },
        occupancy: { isOccupied: true, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: true },
        isActive: true
      },
      {
        name: 'Guest Bedroom',
        icon: '🛏️',
        category: 'bedrooms',
        description: 'Guest bedroom with smart controls',
        floor: 2,
        area: 16,
        temperature: { current: 22, target: 22, unit: 'celsius' },
        humidity: { current: 48, target: 50 },
        lighting: { brightness: 0, color: 'warm' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: false },
        isActive: true
      },
      {
        name: 'Home Office',
        icon: '💼',
        category: 'living-areas',
        description: 'Dedicated workspace with smart lighting',
        floor: 2,
        area: 12,
        temperature: { current: 23, target: 22, unit: 'celsius' },
        humidity: { current: 45, target: 50 },
        lighting: { brightness: 90, color: 'white' },
        occupancy: { isOccupied: true, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: false },
        isActive: true
      },
      {
        name: 'Bathroom',
        icon: '🚿',
        category: 'bathrooms',
        description: 'Main bathroom with smart features',
        floor: 2,
        area: 8,
        temperature: { current: 25, target: 24, unit: 'celsius' },
        humidity: { current: 65, target: 60 },
        lighting: { brightness: 70, color: 'white' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: true },
        isActive: true
      },
      {
        name: 'Garden',
        icon: '🌿',
        category: 'outdoor',
        description: 'Outdoor garden with smart irrigation',
        floor: 0,
        area: 50,
        temperature: { current: 18, target: 20, unit: 'celsius' },
        humidity: { current: 70, target: 60 },
        lighting: { brightness: 40, color: 'warm' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: false, privacyMode: false },
        isActive: true
      },
      {
        name: 'Dining Room',
        icon: '🍽️',
        category: 'living-areas',
        description: 'Elegant dining area with ambient lighting',
        floor: 1,
        area: 15,
        temperature: { current: 22, target: 22, unit: 'celsius' },
        humidity: { current: 45, target: 50 },
        lighting: { brightness: 50, color: 'warm' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: true, privacyMode: false },
        isActive: true
      },
      {
        name: 'Laundry Room',
        icon: '👕',
        category: 'utility',
        description: 'Utility room with smart appliances',
        floor: 1,
        area: 10,
        temperature: { current: 20, target: 20, unit: 'celsius' },
        humidity: { current: 60, target: 55 },
        lighting: { brightness: 80, color: 'white' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: false, privacyMode: false },
        isActive: true
      },
      {
        name: 'Garage',
        icon: '🚗',
        category: 'utility',
        description: 'Smart garage with automated systems',
        floor: 0,
        area: 30,
        temperature: { current: 15, target: 18, unit: 'celsius' },
        humidity: { current: 40, target: 45 },
        lighting: { brightness: 60, color: 'white' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: true, autoClimate: false, privacyMode: false },
        isActive: true
      },
      {
        name: 'Security',
        icon: '🔒',
        category: 'security',
        description: 'Security monitoring and control center',
        floor: 1,
        area: 8,
        temperature: { current: 22, target: 22, unit: 'celsius' },
        humidity: { current: 45, target: 50 },
        lighting: { brightness: 40, color: 'white' },
        occupancy: { isOccupied: false, lastDetected: new Date() },
        settings: { autoLighting: false, autoClimate: true, privacyMode: true },
        isActive: true
      }
    ]);
    console.log('🏠 Created rooms');

    // Create devices for each room
    const devices = await Device.create([
      // Living Room Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 80, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'LR-LIGHT-001',
        isActive: true
      },
      {
        name: 'Accent Light',
        type: 'light',
        icon: '🔆',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 60, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'LR-LIGHT-002',
        isActive: true
      },
      {
        name: 'Floor Lamp',
        type: 'light',
        icon: '🛋️',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 40, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'LR-LIGHT-003',
        isActive: true
      },
      {
        name: 'Fireplace Light',
        type: 'light',
        icon: '🔥',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 30, color: 'warm', colorTemperature: 2200 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'LR-LIGHT-004',
        isActive: true
      },
      {
        name: 'TV',
        type: 'plug',
        icon: '📺',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 45, voltage: 120, current: 0.375, energyConsumption: 0.324 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'LR-PLUG-001',
        isActive: true
      },
      {
        name: 'Sound System',
        type: 'plug',
        icon: '🔊',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'LR-PLUG-002',
        isActive: true
      },
      {
        name: 'Air Purifier',
        type: 'plug',
        icon: '🌬️',
        room: rooms[0]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 25, voltage: 120, current: 0.208, energyConsumption: 0.18 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'LR-PLUG-003',
        isActive: true
      },

      // Kitchen Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 100, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'KIT-LIGHT-001',
        isActive: true
      },
      {
        name: 'Under Cabinet',
        type: 'light',
        icon: '🔆',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 40, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'KIT-LIGHT-002',
        isActive: true
      },
      {
        name: 'Island Light',
        type: 'light',
        icon: '🍳',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 70, color: 'warm', colorTemperature: 3000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'KIT-LIGHT-003',
        isActive: true
      },
      {
        name: 'Pantry Light',
        type: 'light',
        icon: '🥫',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 60, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'KIT-LIGHT-004',
        isActive: true
      },
      {
        name: 'Coffee Maker',
        type: 'plug',
        icon: '☕',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'KIT-PLUG-001',
        isActive: true
      },
      {
        name: 'Refrigerator',
        type: 'plug',
        icon: '❄️',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 120, voltage: 120, current: 1, energyConsumption: 2.88 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'KIT-PLUG-002',
        isActive: true
      },
      {
        name: 'Microwave',
        type: 'plug',
        icon: '📟',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'KIT-PLUG-003',
        isActive: true
      },
      {
        name: 'Dishwasher',
        type: 'plug',
        icon: '🍽️',
        room: rooms[1]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'KIT-PLUG-004',
        isActive: true
      },

      // Master Bedroom Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[2]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 40, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'MB-LIGHT-001',
        isActive: true
      },
      {
        name: 'Bedside Lamp L',
        type: 'light',
        icon: '🛏️',
        room: rooms[2]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 30, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'MB-LIGHT-002',
        isActive: true
      },
      {
        name: 'Bedside Lamp R',
        type: 'light',
        icon: '🛏️',
        room: rooms[2]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 30, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'MB-LIGHT-003',
        isActive: true
      },
      {
        name: 'Closet Light',
        type: 'light',
        icon: '👔',
        room: rooms[2]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 50, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'MB-LIGHT-004',
        isActive: true
      },
      {
        name: 'Master AC',
        type: 'thermostat',
        icon: '🌡️',
        room: rooms[2]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        thermostat: { currentTemp: 22, targetTemp: 21, mode: 'cool', fanSpeed: 'auto' },
        manufacturer: 'Nest',
        deviceModel: 'Learning Thermostat',
        serialNumber: 'MB-THERM-001',
        isActive: true
      },
      {
        name: 'Ceiling Fan',
        type: 'plug',
        icon: '💨',
        room: rooms[2]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 35, voltage: 120, current: 0.292, energyConsumption: 0.252 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'MB-PLUG-001',
        isActive: true
      },

      // Guest Bedroom Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[3]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 60, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'GB-LIGHT-001',
        isActive: true
      },
      {
        name: 'Desk Lamp',
        type: 'light',
        icon: '📚',
        room: rooms[3]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 80, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'GB-LIGHT-002',
        isActive: true
      },
      {
        name: 'Closet Light',
        type: 'light',
        icon: '👔',
        room: rooms[3]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 50, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'GB-LIGHT-003',
        isActive: true
      },
      {
        name: 'Bedroom 2 AC',
        type: 'thermostat',
        icon: '🌡️',
        room: rooms[3]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        thermostat: { currentTemp: 24, targetTemp: 23, mode: 'cool', fanSpeed: 'auto' },
        manufacturer: 'Nest',
        deviceModel: 'Learning Thermostat',
        serialNumber: 'GB-THERM-001',
        isActive: true
      },
      {
        name: 'Ceiling Fan',
        type: 'plug',
        icon: '💨',
        room: rooms[3]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'GB-PLUG-001',
        isActive: true
      },

      // Home Office Devices
      {
        name: 'Desk Lamp',
        type: 'light',
        icon: '💼',
        room: rooms[4]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 90, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'OFF-LIGHT-001',
        isActive: true
      },
      {
        name: 'Ceiling Light',
        type: 'light',
        icon: '💡',
        room: rooms[4]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 70, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'OFF-LIGHT-002',
        isActive: true
      },
      {
        name: 'Bookshelf Light',
        type: 'light',
        icon: '📚',
        room: rooms[4]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 40, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'OFF-LIGHT-003',
        isActive: true
      },
      {
        name: 'Computer',
        type: 'plug',
        icon: '💻',
        room: rooms[4]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 85, voltage: 120, current: 0.708, energyConsumption: 0.612 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'OFF-PLUG-001',
        isActive: true
      },
      {
        name: 'Printer',
        type: 'plug',
        icon: '🖨️',
        room: rooms[4]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'OFF-PLUG-002',
        isActive: true
      },
      {
        name: 'Space Heater',
        type: 'plug',
        icon: '🔥',
        room: rooms[4]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'OFF-PLUG-003',
        isActive: true
      },

      // Bathroom Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[5]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 100, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'BATH-LIGHT-001',
        isActive: true
      },
      {
        name: 'Mirror Light',
        type: 'light',
        icon: '🚿',
        room: rooms[5]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 80, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'BATH-LIGHT-002',
        isActive: true
      },
      {
        name: 'Shower Light',
        type: 'light',
        icon: '🚿',
        room: rooms[5]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 60, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'BATH-LIGHT-003',
        isActive: true
      },
      {
        name: 'Heated Towel Rail',
        type: 'plug',
        icon: '🧺',
        room: rooms[5]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 150, voltage: 120, current: 1.25, energyConsumption: 1.08 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'BATH-PLUG-001',
        isActive: true
      },
      {
        name: 'Hair Dryer',
        type: 'plug',
        icon: '💇',
        room: rooms[5]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'BATH-PLUG-002',
        isActive: true
      },

      // Garden Devices
      {
        name: 'Path Lights',
        type: 'light',
        icon: '🛤️',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 60, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue Outdoor',
        serialNumber: 'GARD-LIGHT-001',
        isActive: true
      },
      {
        name: 'Garden Spotlights',
        type: 'light',
        icon: '🌳',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 80, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue Outdoor',
        serialNumber: 'GARD-LIGHT-002',
        isActive: true
      },
      {
        name: 'Deck Lights',
        type: 'light',
        icon: '🏡',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 50, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue Outdoor',
        serialNumber: 'GARD-LIGHT-003',
        isActive: true
      },
      {
        name: 'Pool Lights',
        type: 'light',
        icon: '🏊',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 70, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue Outdoor',
        serialNumber: 'GARD-LIGHT-004',
        isActive: true
      },
      {
        name: 'Irrigation System',
        type: 'plug',
        icon: '💧',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'Rachio',
        deviceModel: 'Smart Sprinkler',
        serialNumber: 'GARD-SPRINK-001',
        isActive: true
      },
      {
        name: 'Fountain Pump',
        type: 'plug',
        icon: '⛲',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 30, voltage: 120, current: 0.25, energyConsumption: 0.216 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'GARD-PLUG-001',
        isActive: true
      },
      {
        name: 'Garden Shed',
        type: 'plug',
        icon: '🏠',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'GARD-PLUG-002',
        isActive: true
      },
      {
        name: 'Pool Pump',
        type: 'plug',
        icon: '🏊',
        room: rooms[6]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'GARD-PLUG-003',
        isActive: true
      },

      // Dining Room Devices
      {
        name: 'Chandelier',
        type: 'light',
        icon: '🍽️',
        room: rooms[7]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 60, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'DIN-LIGHT-001',
        isActive: true
      },
      {
        name: 'Wall Sconces',
        type: 'light',
        icon: '🔆',
        room: rooms[7]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 40, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'DIN-LIGHT-002',
        isActive: true
      },
      {
        name: 'Buffet Light',
        type: 'light',
        icon: '🍽️',
        room: rooms[7]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 30, color: 'warm', colorTemperature: 2700 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'DIN-LIGHT-003',
        isActive: true
      },
      {
        name: 'Wine Fridge',
        type: 'plug',
        icon: '🍷',
        room: rooms[7]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 35, voltage: 120, current: 0.292, energyConsumption: 0.252 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'DIN-PLUG-001',
        isActive: true
      },
      {
        name: 'Coffee Station',
        type: 'plug',
        icon: '☕',
        room: rooms[7]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'DIN-PLUG-002',
        isActive: true
      },

      // Laundry Room Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[8]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        light: { brightness: 100, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'LAU-LIGHT-001',
        isActive: true
      },
      {
        name: 'Ironing Light',
        type: 'light',
        icon: '👕',
        room: rooms[8]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 80, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'LAU-LIGHT-002',
        isActive: true
      },
      {
        name: 'Washer',
        type: 'plug',
        icon: '👕',
        room: rooms[8]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'LAU-PLUG-001',
        isActive: true
      },
      {
        name: 'Dryer',
        type: 'plug',
        icon: '👕',
        room: rooms[8]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 150, voltage: 120, current: 1.25, energyConsumption: 1.08 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'LAU-PLUG-002',
        isActive: true
      },
      {
        name: 'Iron',
        type: 'plug',
        icon: '👕',
        room: rooms[8]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'LAU-PLUG-003',
        isActive: true
      },

      // Garage Devices
      {
        name: 'Main Light',
        type: 'light',
        icon: '💡',
        room: rooms[9]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 100, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'GAR-LIGHT-001',
        isActive: true
      },
      {
        name: 'Workbench Light',
        type: 'light',
        icon: '🔧',
        room: rooms[9]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 80, color: 'cool', colorTemperature: 4000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'GAR-LIGHT-002',
        isActive: true
      },
      {
        name: 'Car Bay Light',
        type: 'light',
        icon: '🚗',
        room: rooms[9]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        light: { brightness: 90, color: 'white', colorTemperature: 5000 },
        manufacturer: 'Philips',
        deviceModel: 'Hue White',
        serialNumber: 'GAR-LIGHT-003',
        isActive: true
      },
      {
        name: 'Garage Door',
        type: 'plug',
        icon: '🚗',
        room: rooms[9]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 25, voltage: 120, current: 0.208, energyConsumption: 0.18 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'GAR-PLUG-001',
        isActive: true
      },
      {
        name: 'Air Compressor',
        type: 'plug',
        icon: '🔧',
        room: rooms[9]!._id,
        status: { isOnline: true, isOn: false, lastSeen: new Date() },
        plug: { power: 0, voltage: 120, current: 0, energyConsumption: 0 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'GAR-PLUG-002',
        isActive: true
      },

      // Security Devices
      {
        name: 'Front Door Camera',
        type: 'camera',
        icon: '📹',
        room: rooms[10]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        camera: { isRecording: true, isMotion: false, resolution: '1080p', nightVision: true },
        manufacturer: 'Ring',
        deviceModel: 'Video Doorbell',
        serialNumber: 'SEC-CAM-001',
        isActive: true
      },
      {
        name: 'Backyard Camera',
        type: 'camera',
        icon: '📹',
        room: rooms[10]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        camera: { isRecording: false, isMotion: true, resolution: '1080p', nightVision: true },
        manufacturer: 'Ring',
        deviceModel: 'Stick Up Cam',
        serialNumber: 'SEC-CAM-002',
        isActive: true
      },
      {
        name: 'Garage Camera',
        type: 'camera',
        icon: '📹',
        room: rooms[10]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        camera: { isRecording: true, isMotion: false, resolution: '1080p', nightVision: true },
        manufacturer: 'Ring',
        deviceModel: 'Stick Up Cam',
        serialNumber: 'SEC-CAM-003',
        isActive: true
      },
      {
        name: 'Side Yard Camera',
        type: 'camera',
        icon: '📹',
        room: rooms[10]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        camera: { isRecording: false, isMotion: false, resolution: '1080p', nightVision: true },
        manufacturer: 'Ring',
        deviceModel: 'Stick Up Cam',
        serialNumber: 'SEC-CAM-004',
        isActive: true
      },
      {
        name: 'Alarm System',
        type: 'plug',
        icon: '🚨',
        room: rooms[10]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 15, voltage: 120, current: 0.125, energyConsumption: 0.108 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'SEC-PLUG-001',
        isActive: true
      },
      {
        name: 'Motion Sensors',
        type: 'plug',
        icon: '👁️',
        room: rooms[10]!._id,
        status: { isOnline: true, isOn: true, lastSeen: new Date() },
        plug: { power: 5, voltage: 120, current: 0.042, energyConsumption: 0.036 },
        manufacturer: 'TP-Link',
        deviceModel: 'Kasa Smart Plug',
        serialNumber: 'SEC-PLUG-002',
        isActive: true
      }
    ]);
    console.log('🔌 Created devices');

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${rooms.length} rooms and ${devices.length} devices`);
    console.log('👤 Test user: test@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
