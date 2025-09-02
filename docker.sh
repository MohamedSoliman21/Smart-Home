#!/bin/bash

# Smart Home IoT Project - Docker Helper Scripts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    print_status "Docker is running"
}

# Development environment
dev_start() {
    print_header "Starting Development Environment"
    check_docker
    
    print_status "Starting databases..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_status "Development environment started!"
    print_status "MongoDB: localhost:27017"
    print_status "Redis: localhost:6379"
    print_status ""
    print_status "Now run your applications locally:"
    print_status "Backend: cd backend && pnpm dev"
    print_status "Frontend: cd frontend && pnpm dev"
}

dev_stop() {
    print_header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    print_status "Development environment stopped"
}

# Production environment
prod_start() {
    print_header "Starting Production Environment"
    check_docker
    
    print_status "Building and starting all services..."
    docker-compose up -d --build
    
    print_status "Production environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:5000"
    print_status "MongoDB: localhost:27017"
    print_status "Redis: localhost:6379"
}

prod_stop() {
    print_header "Stopping Production Environment"
    docker-compose down
    print_status "Production environment stopped"
}

# Logs
show_logs() {
    if [ -z "$1" ]; then
        print_status "Showing all logs (Ctrl+C to exit)"
        docker-compose logs -f
    else
        print_status "Showing logs for $1 (Ctrl+C to exit)"
        docker-compose logs -f "$1"
    fi
}

# Database operations
db_backup() {
    print_header "Backing up MongoDB"
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="./backups/$timestamp"
    mkdir -p "$backup_dir"
    
    docker-compose exec mongodb mongodump --out /backup
    docker cp smart_home_mongodb:/backup "$backup_dir"
    
    print_status "Backup completed: $backup_dir"
}

db_restore() {
    if [ -z "$1" ]; then
        print_error "Please specify backup directory"
        echo "Usage: $0 db-restore <backup_directory>"
        exit 1
    fi
    
    print_header "Restoring MongoDB from $1"
    docker cp "$1" smart_home_mongodb:/backup
    docker-compose exec mongodb mongorestore /backup
    
    print_status "Restore completed"
}

# Cleanup
cleanup() {
    print_header "Cleaning up Docker resources"
    
    print_warning "This will remove all containers, networks, and volumes"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -a -f
        print_status "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Health check
health_check() {
    print_header "Checking Service Health"
    
    services=("mongodb" "backend" "frontend" "redis")
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            print_status "$service: Running"
        else
            print_error "$service: Not running"
        fi
    done
}

# Show usage
show_usage() {
    echo "Smart Home IoT Project - Docker Helper Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  dev-start     Start development environment (databases only)"
    echo "  dev-stop      Stop development environment"
    echo "  prod-start    Start production environment (all services)"
    echo "  prod-stop     Stop production environment"
    echo "  logs [service] Show logs for all services or specific service"
    echo "  db-backup     Backup MongoDB database"
    echo "  db-restore <dir> Restore MongoDB from backup"
    echo "  health        Check health of all services"
    echo "  cleanup       Clean up all Docker resources"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev-start"
    echo "  $0 prod-start"
    echo "  $0 logs backend"
    echo "  $0 db-backup"
}

# Main script logic
case "$1" in
    "dev-start")
        dev_start
        ;;
    "dev-stop")
        dev_stop
        ;;
    "prod-start")
        prod_start
        ;;
    "prod-stop")
        prod_stop
        ;;
    "logs")
        show_logs "$2"
        ;;
    "db-backup")
        db_backup
        ;;
    "db-restore")
        db_restore "$2"
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"--help"|"-h"|"")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
