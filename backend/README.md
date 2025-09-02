# Smart Home Backend API (TypeScript)

A comprehensive Node.js/Express backend built with TypeScript for managing a smart home IoT system with real-time communication, device control, and analytics.

## 🚀 Features

- **TypeScript**: Full type safety and better developer experience
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Real-time Communication**: Socket.io for live device updates and control
- **Device Management**: CRUD operations for smart home devices
- **Room Management**: Organize devices by rooms and categories
- **Analytics**: Energy consumption and device usage statistics
- **Security**: Rate limiting, input validation, and error handling
- **Scalable Architecture**: Modular design with middleware and validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart-home
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

5. **Run the server**
   ```bash
   # Development (with hot reload)
   npm run dev
   
   # Build for production
   npm run build
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Device Endpoints

#### Get All Devices
```http
GET /api/devices?room=roomId&type=light&status=online&limit=50&page=1
Authorization: Bearer <token>
```

#### Get Device by ID
```http
GET /api/devices/:deviceId
Authorization: Bearer <token>
```

#### Create Device
```http
POST /api/devices
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Living Room Light",
  "type": "light",
  "icon": "💡",
  "room": "roomId",
  "manufacturer": "Philips",
  "model": "Hue Bulb"
}
```

#### Toggle Device
```http
POST /api/devices/:deviceId/toggle
Authorization: Bearer <token>
```

#### Control Light
```http
POST /api/devices/:deviceId/light
Authorization: Bearer <token>
Content-Type: application/json

{
  "brightness": 80,
  "color": "warm",
  "colorTemperature": 2700
}
```

### Room Endpoints

#### Get All Rooms
```http
GET /api/rooms?category=bedrooms&floor=1&limit=50&page=1
Authorization: Bearer <token>
```

#### Get Room with Devices
```http
GET /api/rooms/:roomId
Authorization: Bearer <token>
```

#### Create Room
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Master Bedroom",
  "icon": "🛏️",
  "category": "bedrooms",
  "description": "Main bedroom",
  "floor": 1,
  "area": 25
}
```

### Analytics Endpoints

#### Get Analytics Overview
```http
GET /api/analytics/overview
Authorization: Bearer <token>
```

#### Get Energy Consumption
```http
GET /api/analytics/energy?period=24h
Authorization: Bearer <token>
```

## 🔌 Socket.io Events

### Client to Server

#### Join Rooms
```javascript
socket.emit('join-rooms');
```

#### Device Status Update
```javascript
socket.emit('device-status-update', {
  deviceId: 'deviceId',
  status: {
    isOn: true,
    brightness: 80,
    temperature: 22
  }
});
```

#### Device Control
```javascript
socket.emit('device-control', {
  deviceId: 'deviceId',
  action: 'toggle', // or 'setBrightness', 'setTemperature', 'setColor'
  value: 80
});
```

#### Room Control
```javascript
socket.emit('room-control', {
  roomId: 'roomId',
  action: 'turnOn', // or 'turnOff', 'setBrightness'
  value: 80
});
```

### Server to Client

#### Device Updated
```javascript
socket.on('device-updated', (data) => {
  console.log('Device updated:', data);
});
```

#### Device Controlled
```javascript
socket.on('device-controlled', (data) => {
  console.log('Device controlled:', data);
});
```

#### Room Controlled
```javascript
socket.on('room-controlled', (data) => {
  console.log('Room controlled:', data);
});
```

## 🗄️ Database Models

### User Model
- Authentication and profile information
- Role-based permissions
- User preferences

### Room Model
- Room information and categorization
- Environmental data (temperature, humidity)
- Occupancy tracking

### Device Model
- Device information and status
- Device-specific properties (light, plug, thermostat, camera, sensor)
- Automation schedules and triggers
- User permissions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Admin, user, and guest roles
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **Error Handling**: Comprehensive error management
- **CORS Protection**: Cross-origin request handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── models/           # Database models (TypeScript)
│   │   ├── User.ts
│   │   ├── Room.ts
│   │   └── Device.ts
│   ├── routes/           # API routes (TypeScript)
│   │   ├── auth.ts
│   │   ├── devices.ts
│   │   ├── rooms.ts
│   │   ├── automation.ts
│   │   └── analytics.ts
│   ├── middleware/       # Custom middleware (TypeScript)
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── socket/           # Socket.io handlers (TypeScript)
│   │   └── socketHandler.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── server.ts         # Main server file (TypeScript)
├── dist/                 # Compiled JavaScript (generated)
├── tsconfig.json         # TypeScript configuration
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-home
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Build and Deploy
```bash
# Build the project
npm run build

# Start production server
npm start
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/server.js --name "smart-home-backend"

# Monitor
pm2 monit

# Logs
pm2 logs smart-home-backend
```

## 🔧 Development

### TypeScript Features
- **Strict Type Checking**: Full type safety across the application
- **Interface Definitions**: Comprehensive type definitions for all models and APIs
- **Path Mapping**: Clean imports with `@/` prefix
- **Source Maps**: Better debugging experience
- **Declaration Files**: Generated `.d.ts` files for better IDE support

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure TypeScript compilation passes
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ and TypeScript for Smart Home IoT Management**
