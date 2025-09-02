# Smart Home IoT Project - Docker Helper Scripts (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Service
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "=== $Message ===" -ForegroundColor $Blue
}

# Check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Status "Docker is running"
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop."
        return $false
    }
}

# Development environment
function Start-DevEnvironment {
    Write-Header "Starting Development Environment"
    
    if (-not (Test-Docker)) { return }
    
    Write-Status "Starting databases..."
    docker-compose -f docker-compose.dev.yml up -d
    
    Write-Status "Development environment started!"
    Write-Status "MongoDB: localhost:27017"
    Write-Status "Redis: localhost:6379"
    Write-Host ""
    Write-Status "Now run your applications locally:"
    Write-Status "Backend: cd backend && pnpm dev"
    Write-Status "Frontend: cd frontend && pnpm dev"
}

function Stop-DevEnvironment {
    Write-Header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    Write-Status "Development environment stopped"
}

# Production environment
function Start-ProdEnvironment {
    Write-Header "Starting Production Environment"
    
    if (-not (Test-Docker)) { return }
    
    Write-Status "Building and starting all services..."
    docker-compose up -d --build
    
    Write-Status "Production environment started!"
    Write-Status "Frontend: http://localhost:3000"
    Write-Status "Backend API: http://localhost:5000"
    Write-Status "MongoDB: localhost:27017"
    Write-Status "Redis: localhost:6379"
}

function Stop-ProdEnvironment {
    Write-Header "Stopping Production Environment"
    docker-compose down
    Write-Status "Production environment stopped"
}

# Logs
function Show-Logs {
    param([string]$ServiceName)
    
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Status "Showing all logs (Ctrl+C to exit)"
        docker-compose logs -f
    }
    else {
        Write-Status "Showing logs for $ServiceName (Ctrl+C to exit)"
        docker-compose logs -f $ServiceName
    }
}

# Database operations
function Backup-Database {
    Write-Header "Backing up MongoDB"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "./backups/$timestamp"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    docker-compose exec mongodb mongodump --out /backup
    docker cp smart_home_mongodb:/backup $backupDir
    
    Write-Status "Backup completed: $backupDir"
}

function Restore-Database {
    param([string]$BackupDir)
    
    if ([string]::IsNullOrEmpty($BackupDir)) {
        Write-Error "Please specify backup directory"
        Write-Host "Usage: .\docker.ps1 db-restore <backup_directory>"
        return
    }
    
    Write-Header "Restoring MongoDB from $BackupDir"
    docker cp $BackupDir smart_home_mongodb:/backup
    docker-compose exec mongodb mongorestore /backup
    
    Write-Status "Restore completed"
}

# Cleanup
function Clear-DockerResources {
    Write-Header "Cleaning up Docker resources"
    
    Write-Warning "This will remove all containers, networks, and volumes"
    $confirm = Read-Host "Are you sure? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down -v
        docker system prune -a -f
        Write-Status "Cleanup completed"
    }
    else {
        Write-Status "Cleanup cancelled"
    }
}

# Health check
function Test-ServiceHealth {
    Write-Header "Checking Service Health"
    
    $services = @("mongodb", "backend", "frontend", "redis")
    
    foreach ($service in $services) {
        $status = docker-compose ps | Select-String "$service.*Up"
        if ($status) {
            Write-Status "$service`: Running"
        }
        else {
            Write-Error "$service`: Not running"
        }
    }
}

# Show usage
function Show-Usage {
    Write-Host "Smart Home IoT Project - Docker Helper Script (PowerShell)"
    Write-Host ""
    Write-Host "Usage: .\docker.ps1 <command> [options]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  dev-start     Start development environment (databases only)"
    Write-Host "  dev-stop      Stop development environment"
    Write-Host "  prod-start    Start production environment (all services)"
    Write-Host "  prod-stop     Stop production environment"
    Write-Host "  logs [service] Show logs for all services or specific service"
    Write-Host "  db-backup     Backup MongoDB database"
    Write-Host "  db-restore <dir> Restore MongoDB from backup"
    Write-Host "  health        Check health of all services"
    Write-Host "  cleanup       Clean up all Docker resources"
    Write-Host "  help          Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\docker.ps1 dev-start"
    Write-Host "  .\docker.ps1 prod-start"
    Write-Host "  .\docker.ps1 logs backend"
    Write-Host "  .\docker.ps1 db-backup"
}

# Main script logic
switch ($Command) {
    "dev-start" {
        Start-DevEnvironment
    }
    "dev-stop" {
        Stop-DevEnvironment
    }
    "prod-start" {
        Start-ProdEnvironment
    }
    "prod-stop" {
        Stop-ProdEnvironment
    }
    "logs" {
        Show-Logs $Service
    }
    "db-backup" {
        Backup-Database
    }
    "db-restore" {
        Restore-Database $Service
    }
    "health" {
        Test-ServiceHealth
    }
    "cleanup" {
        Clear-DockerResources
    }
    "help" {
        Show-Usage
    }
    "" {
        Show-Usage
    }
    default {
        Write-Error "Unknown command: $Command"
        Write-Host ""
        Show-Usage
    }
}
