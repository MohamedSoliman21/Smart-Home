# Docker Setup for Smart Home IoT Project

## 🐳 Overview

This project includes comprehensive Docker configuration for both development and production environments.

## 📁 Docker Files Structure

```
├── docker-compose.yml          # Production environment
├── docker-compose.dev.yml      # Development environment (databases only)
├── backend/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore          # Backend build exclusions
├── frontend/
│   ├── Dockerfile             # Frontend container
│   └── .dockerignore          # Frontend build exclusions
└── nginx/                     # Reverse proxy configuration (optional)
    ├── nginx.conf
    └── ssl/
```

## 🚀 Quick Start

### Development Environment

1. **Start databases only:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Run applications locally:**
   ```bash
   # Backend
   cd backend && pnpm dev
   
   # Frontend
   cd frontend && pnpm dev
   ```

### Production Environment

1. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f [service_name]
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

## 🏗️ Services

### Production Services

| Service | Port | Description |
|---------|------|-------------|
| **mongodb** | 27017 | MongoDB database |
| **backend** | 5000 | Node.js/TypeScript API |
| **frontend** | 3000 | Next.js React application |
| **redis** | 6379 | Redis cache (optional) |
| **nginx** | 80/443 | Reverse proxy (optional) |

### Development Services

| Service | Port | Description |
|---------|------|-------------|
| **mongodb** | 27017 | MongoDB database |
| **redis** | 6379 | Redis cache |

## 🔧 Configuration

### Environment Variables

#### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:smart_home_password@mongodb:27017/smart_home_db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

#### Frontend
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Configuration

- **MongoDB**: Version 7.0 with authentication
- **Redis**: Version 7-alpine with persistence
- **Volumes**: Persistent data storage for both databases

## 🛠️ Docker Commands

### Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Manage Containers
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f

# Execute commands in running containers
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Data Management
```bash
# Backup MongoDB data
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB data
docker-compose exec mongodb mongorestore /backup

# View volume usage
docker volume ls
docker volume inspect smart_home_mongodb_data
```

## 🔒 Security Considerations

### Production Deployment

1. **Change default passwords:**
   - MongoDB: Update `MONGO_INITDB_ROOT_PASSWORD`
   - JWT: Update `JWT_SECRET`

2. **Use environment files:**
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit with production values
   ```

3. **Enable SSL/TLS:**
   - Configure nginx with SSL certificates
   - Update frontend API URL to use HTTPS

4. **Network security:**
   - Use Docker networks for service isolation
   - Configure firewall rules
   - Limit exposed ports

### Development Security

1. **Local development:**
   - Use `docker-compose.dev.yml` for databases only
   - Run applications locally for faster development
   - Use different credentials for development

## 📊 Monitoring and Health Checks

All services include health checks:

- **Backend**: HTTP health endpoint at `/api/health`
- **Frontend**: HTTP health check on port 3000
- **MongoDB**: Database ping command
- **Redis**: Redis ping command
- **Nginx**: HTTP health check

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: docker-compose build
      - name: Push to registry
        run: |
          docker tag smart_home_backend:latest your-registry/backend:latest
          docker push your-registry/backend:latest
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :5000
   # Kill process or change port in docker-compose.yml
   ```

2. **Permission issues:**
   ```bash
   # Fix volume permissions
   sudo chown -R 1000:1000 ./backend/logs
   ```

3. **Memory issues:**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop > Settings > Resources > Memory
   ```

4. **Build failures:**
   ```bash
   # Clean build cache
   docker-compose build --no-cache
   docker system prune -a
   ```

### Debug Commands
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs [service]

# Inspect container
docker-compose exec [service] sh

# Check network connectivity
docker-compose exec backend ping mongodb
```

## 📈 Performance Optimization

### Production Optimizations

1. **Multi-stage builds:** Frontend uses multi-stage build for smaller images
2. **Layer caching:** Optimized Dockerfile order for better caching
3. **Volume mounts:** Persistent data storage
4. **Health checks:** Automatic service monitoring
5. **Resource limits:** Configure memory and CPU limits

### Development Optimizations

1. **Volume mounts:** Source code mounted for live reload
2. **Hot reload:** Development servers with file watching
3. **Debug ports:** Exposed debugging ports
4. **Fast rebuilds:** Optimized for frequent changes

## 🔗 External Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
