# Smart Home IoT Dashboard - Complete Full Stack Solution

## 🚀 **Advanced Smart Home Management System**

A comprehensive, fully integrated smart home IoT dashboard featuring a modern Next.js frontend with real-time animations and a robust TypeScript Node.js backend with MongoDB integration. This project demonstrates a complete smart home automation system with user authentication, device management, room organization, and real-time monitoring.

## ✨ **Key Features**

### 🎨 **Frontend Excellence**
- **Modern UI/UX**: Beautiful animated interface with smooth transitions
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Real-time Updates**: Live device status and energy monitoring
- **Interactive Controls**: Touch-friendly device controls with visual feedback
- **Guided Tour**: React Joyride integration for user onboarding
- **Theme Support**: Dark/light theme with user preferences

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration, login, logout with profile management
- **Role-based Access**: Admin, user, and guest roles
- **Password Security**: Bcrypt hashing with configurable rounds
- **Protected Routes**: Middleware-based route protection
- **Token Management**: Automatic token refresh and storage

### 🏠 **Smart Home Management**
- **13 Rooms**: Complete home coverage from living areas to security
- **80+ Devices**: Comprehensive device ecosystem across all room types
- **Device Types**: Lights, plugs, thermostats, cameras, sensors, switches
- **Real-time Control**: Instant device toggling and parameter adjustment
- **Bulk Operations**: Room-wide device control with single API calls
- **Energy Monitoring**: Real-time power consumption tracking

### 🐳 **Docker Support**
- **Containerized Deployment**: Full Docker support for development and production
- **Multi-stage Builds**: Optimized Docker images for frontend and backend
- **Service Orchestration**: Docker Compose for complete application stack
- **Environment Management**: Separate development and production configurations
- **Helper Scripts**: Automated Docker management scripts for all platforms

## 📁 **Project Structure**

```
frontend/              # Next.js Frontend (TypeScript)
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── globals.css  # Custom animations & styling
│   │   └── layout.tsx   # Root layout with providers
│   ├── components/      # React Components
│   │   ├── SmartHomeDashboard.tsx    # Main dashboard
│   │   ├── AnimatedHeader.tsx        # Greeting & time display
│   │   ├── LoginForm.tsx             # Authentication forms
│   │   ├── UserModal.tsx             # Profile management
│   │   ├── SmartHomeTour.tsx         # Guided tour
│   │   ├── RoomGrid.tsx              # Room organization
│   │   ├── rooms/
│   │   │   ├── RoomCard.tsx          # Individual room display
│   │   │   └── QuickRoomControl.tsx  # Bulk room controls
│   │   └── devices/
│   │       ├── LightControl.tsx      # Light device controls
│   │       ├── ThermostatControl.tsx # AC/thermostat controls
│   │       ├── SmartPlug.tsx          # Plug device controls
│   │       └── CameraControl.tsx     # Camera device controls
│   └── lib/             # Utilities & API Integration
│       ├── api.ts       # Backend API client with full CRUD
│       ├── auth.tsx     # Authentication context & hooks
│       ├── hooks.ts     # Custom React hooks for data fetching
│       └── deviceContext.tsx # Centralized device state
├── Dockerfile           # Frontend container configuration
└── .dockerignore        # Frontend build exclusions

backend/                 # TypeScript Node.js Backend
├── src/
│   ├── models/          # MongoDB Models
│   │   ├── User.ts      # User schema with preferences
│   │   ├── Room.ts      # Room schema with sensors
│   │   └── Device.ts    # Device schema with types
│   ├── routes/          # API Routes
│   │   ├── auth.ts      # Authentication endpoints
│   │   ├── devices.ts   # Device management
│   │   ├── rooms.ts     # Room management
│   │   └── analytics.ts # Analytics endpoints
│   ├── middleware/      # Express Middleware
│   │   ├── auth.ts      # JWT authentication
│   │   ├── validation.ts # Request validation
│   │   └── errorHandler.ts # Error handling
│   ├── socket/          # Socket.io Handlers
│   │   └── socketHandler.ts # Real-time communication
│   ├── types/           # TypeScript Types
│   │   └── index.ts     # Shared type definitions
│   └── server.ts        # Express server setup
├── scripts/
│   └── seed.ts         # Database seeding with 80+ devices
├── Dockerfile           # Backend container configuration
└── .dockerignore        # Backend build exclusions

# Docker Configuration
docker-compose.yml       # Production environment
docker-compose.dev.yml   # Development environment
docker.sh               # Bash helper script (Linux/macOS)
docker.ps1              # PowerShell helper script (Windows)
DOCKER.md               # Comprehensive Docker documentation
env.example             # Environment variables template
.gitignore              # Git exclusions
```

## 🐳 **Docker Quick Start**

### **Development Environment (Recommended)**
```bash
# Start databases only
./docker.sh dev-start
# or on Windows: .\docker.ps1 dev-start

# Run applications locally
cd backend && pnpm dev
cd frontend && pnpm dev
```

### **Production Environment**
```bash
# Start all services
./docker.sh prod-start
# or on Windows: .\docker.ps1 prod-start
```

### **Docker Services**
| Service | Port | Description |
|---------|------|-------------|
| **MongoDB** | 27017 | Database |
| **Backend** | 5000 | API Server |
| **Frontend** | 3000 | Web App |
| **Redis** | 6379 | Cache (optional) |
| **Nginx** | 80/443 | Reverse Proxy (optional) |

## 🏠 **Complete Room & Device Ecosystem**

### **Living Areas**
- **Living Room**: 7 devices (lights, TV, sound system, air purifier)
- **Kitchen**: 8 devices (lights, refrigerator, coffee maker, dishwasher)
- **Dining Room**: 5 devices (chandelier, wine fridge, coffee station)
- **Home Office**: 6 devices (desk lamp, computer, printer, space heater)

### **Bedrooms**
- **Master Bedroom**: 6 devices (lights, AC, ceiling fan)
- **Bedroom 2**: 5 devices (lights, AC, ceiling fan)
- **Bedroom 3**: 5 devices (lights, AC, ceiling fan)

### **Bathrooms**
- **Main Bathroom**: 5 devices (lights, heated towel rail, hair dryer)
- **Guest Bathroom**: 4 devices (lights, heated towel rail, hair dryer)

### **Utility Areas**
- **Laundry Room**: 5 devices (lights, washer, dryer, iron)
- **Garage**: 5 devices (lights, garage door, air compressor)

### **Outdoor & Security**
- **Garden**: 8 devices (path lights, irrigation, fountain, pool pump)
- **Security**: 6 devices (cameras, alarm system, motion sensors)

## 🔧 **Device Types & Capabilities**

### **Smart Lights** 💡
- **Brightness Control**: 0-100% dimming
- **Color Temperature**: Warm, cool, white options
- **RGB Control**: Full color spectrum support
- **Automation**: Scheduled lighting and motion detection

### **Smart Plugs** 🔌
- **Power Monitoring**: Real-time wattage tracking
- **Energy Consumption**: Historical usage data
- **Voltage/Current**: Electrical parameter monitoring
- **Remote Control**: On/off control from anywhere

### **Thermostats** 🌡️
- **Temperature Control**: Precise temperature setting
- **Mode Selection**: Heat, cool, auto, off modes
- **Fan Speed**: Low, medium, high, auto options
- **Smart Scheduling**: Automated temperature management

### **Security Cameras** 📹
- **Motion Detection**: Real-time motion alerts
- **Recording Control**: Manual and automatic recording
- **Night Vision**: Low-light capability
- **Resolution**: HD video quality

## 🛠 **Setup Instructions**

### **Option 1: Docker Setup (Recommended)**

#### **Prerequisites**
- Docker Desktop installed and running
- Git

#### **Quick Start with Docker**
```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Start development environment
./docker.sh dev-start

# Run applications locally
cd backend && pnpm dev
cd frontend && pnpm dev
```

#### **Production Deployment**
```bash
# Start all services
./docker.sh prod-start

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### **Option 2: Local Development Setup**

#### **Prerequisites**
- Node.js 18+ and pnpm
- MongoDB (local or cloud)
- Git

#### **1. Backend Setup**
```bash
cd backend
pnpm install
```

Create `.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/smart-home

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=100
```

Start backend:
```bash
pnpm run dev
```

Seed database:
```bash
pnpm run seed
```

#### **2. Frontend Setup**
```bash
cd frontend
pnpm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
pnpm run dev
```

## 🔐 **Authentication System**

### **User Registration**
```typescript
// Automatic admin role assignment
const userData = {
  username: "mohamed",
  email: "mohamed@example.com",
  password: "securepassword",
  firstName: "Mohamed",
  lastName: "Soliman",
  role: "admin" // Automatically set
};
```

### **Login Flow**
- Email/password authentication
- JWT token generation and storage
- Automatic token refresh
- Secure logout with token cleanup

### **Profile Management**
- User profile viewing and editing
- Theme preferences (dark/light)
- Notification settings
- Timezone configuration

## 🔌 **API Integration**

### **Authentication Endpoints**
```typescript
POST /api/auth/register    // User registration
POST /api/auth/login       // User login
POST /api/auth/logout      // User logout
GET  /api/auth/profile     // Get user profile
PUT  /api/auth/profile     // Update user profile
```

### **Device Management**
```typescript
GET    /api/devices                    // Get all devices
GET    /api/devices/:id               // Get specific device
POST   /api/devices/:id/toggle        // Toggle device
POST   /api/devices/room/:roomId/toggle // Bulk room toggle
POST   /api/devices/:id/light         // Control light
POST   /api/devices/:id/thermostat    // Control thermostat
PUT    /api/devices/:id/status        // Update device status
```

### **Room Management**
```typescript
GET  /api/rooms              // Get all rooms
GET  /api/rooms/:id          // Get specific room
GET  /api/rooms/:id/devices  // Get devices in room
PUT  /api/rooms/:id/temperature // Update room temperature
PUT  /api/rooms/:id/lighting    // Update room lighting
```

## 🎨 **Frontend Features**

### **Animated Components**
- **Fade-in Animations**: Smooth component transitions
- **Floating Effects**: Dynamic background elements
- **Loading States**: Spinner animations during API calls
- **Hover Effects**: Interactive button and card animations
- **Pulse Effects**: Attention-grabbing notifications

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Touch-friendly tablet interface
- **Desktop Enhancement**: Full-featured desktop experience
- **Flexible Layout**: Adaptive grid system

### **User Experience**
- **Guided Tour**: React Joyride onboarding
- **Real-time Updates**: Live device status changes
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Success Notifications**: Confirmation of actions

## 🔒 **Security Features**

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable rounds
- **Token Expiration**: Automatic token refresh
- **Secure Storage**: LocalStorage with token management

### **API Security**
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: Request throttling protection
- **Input Validation**: Joi schema validation
- **Helmet Headers**: Security header implementation
- **Error Handling**: Secure error responses

### **Data Protection**
- **MongoDB Security**: Database access control
- **Input Sanitization**: XSS protection
- **SQL Injection Prevention**: Parameterized queries
- **Data Validation**: Schema-based validation

## 📊 **Real-time Features**

### **Live Updates**
- **Device Status**: Real-time device state changes
- **Energy Monitoring**: Live power consumption data
- **Temperature Tracking**: Real-time temperature updates
- **Security Alerts**: Instant security notifications

### **WebSocket Integration**
- **Socket.io Setup**: Real-time communication
- **Event Broadcasting**: Device state changes
- **Connection Management**: Automatic reconnection
- **Room-based Updates**: Targeted room notifications

## 🚀 **Performance Optimizations**

### **Frontend Performance**
- **Code Splitting**: Dynamic imports for better loading
- **Image Optimization**: Next.js image optimization
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Efficient data caching

### **Backend Performance**
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Response Caching**: API response caching
- **Compression**: Gzip response compression

### **Docker Optimizations**
- **Multi-stage Builds**: Smaller production images
- **Layer Caching**: Optimized build times
- **Health Checks**: Automatic service monitoring
- **Resource Limits**: Memory and CPU constraints

## 🧪 **Testing & Quality**

### **Code Quality**
- **TypeScript**: Full type safety across the stack
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting consistency
- **Error Handling**: Comprehensive error management

### **API Testing**
- **Endpoint Testing**: All API endpoints tested
- **Authentication Testing**: Secure authentication flow
- **Data Validation**: Input/output validation
- **Error Scenarios**: Edge case handling

### **Docker Testing**
- **Container Health**: Health check validation
- **Service Integration**: Inter-service communication
- **Volume Persistence**: Data persistence testing
- **Network Isolation**: Service network security

## 📈 **Analytics & Monitoring**

### **Energy Analytics**
- **Real-time Consumption**: Live power usage tracking
- **Historical Data**: Energy usage over time
- **Device Efficiency**: Per-device energy analysis
- **Cost Calculation**: Energy cost estimation

### **Usage Analytics**
- **Device Usage**: Most/least used devices
- **Room Activity**: Room occupancy patterns
- **User Behavior**: User interaction analytics
- **Performance Metrics**: System performance tracking

### **Docker Monitoring**
- **Container Metrics**: Resource usage monitoring
- **Service Health**: Health check status
- **Log Aggregation**: Centralized logging
- **Performance Tracking**: Container performance metrics

## 🔄 **Recent Improvements**

### **Docker Integration**
- **Containerization**: Full Docker support for all services
- **Multi-stage Builds**: Optimized production images
- **Service Orchestration**: Docker Compose configuration
- **Helper Scripts**: Cross-platform Docker management
- **Environment Management**: Development and production separation

### **Authentication Fixes**
- **Profile API Fix**: Corrected nested user data extraction
- **Login/Register Fix**: Updated response structure handling
- **Token Management**: Improved token refresh logic
- **User Display**: Fixed user name display in greeting

### **Device Integration**
- **Bulk Toggle API**: New room-wide device control endpoint
- **Thermostat Support**: AC units now work with quick controls
- **API Method Updates**: Corrected HTTP methods for device control
- **Error Handling**: Improved API error responses

### **UI Enhancements**
- **User Modal**: Clickable user name with profile management
- **Tour Integration**: React Joyride guided tour
- **Button Positioning**: Improved logout and tour button placement
- **Color Themes**: Theme-aware user name styling

## 🐳 **Docker Management**

### **Helper Scripts**
```bash
# Development
./docker.sh dev-start     # Start development environment
./docker.sh dev-stop      # Stop development environment

# Production
./docker.sh prod-start    # Start production environment
./docker.sh prod-stop     # Stop production environment

# Management
./docker.sh logs [service] # View service logs
./docker.sh health        # Check service health
./docker.sh db-backup     # Backup database
./docker.sh cleanup       # Clean up Docker resources
```

### **Docker Compose Files**
- **`docker-compose.yml`**: Production environment with all services
- **`docker-compose.dev.yml`**: Development environment (databases only)

### **Environment Configuration**
- **`env.example`**: Template for environment variables
- **`.dockerignore`**: Build context exclusions
- **`DOCKER.md`**: Comprehensive Docker documentation

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comprehensive error handling
- Include proper documentation
- Test all new features thoroughly
- Update Docker configurations when needed

### **Docker Development**
- Test Docker builds locally before committing
- Update Docker documentation for new services
- Ensure environment variables are documented
- Test both development and production configurations

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Next.js** for the amazing React framework
- **MongoDB** for the flexible database solution
- **Socket.io** for real-time communication
- **Tailwind CSS** for the utility-first styling
- **React Joyride** for the guided tour functionality
- **Docker** for containerization and deployment
- **Docker Compose** for service orchestration

---

## 🎯 **Project Status**

✅ **Complete**: Full-stack smart home dashboard  
✅ **Production Ready**: Comprehensive error handling and security  
✅ **Scalable**: Modular architecture for easy expansion  
✅ **Containerized**: Full Docker support for deployment  
✅ **Maintained**: Active development and improvements  

**Built with ❤️ using Next.js, TypeScript, Node.js, MongoDB, Socket.io, and Docker**

---

*For support, questions, or contributions, please open an issue or contact the development team.*

## 📚 **Additional Documentation**

- **[DOCKER.md](DOCKER.md)**: Comprehensive Docker setup and management guide
- **[env.example](env.example)**: Environment variables template
- **[docker.sh](docker.sh)**: Bash helper script for Docker management
- **[docker.ps1](docker.ps1)**: PowerShell helper script for Windows users
