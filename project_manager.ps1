#############################################
# Portal Management System - Project Manager
# PowerShell script for Windows
#############################################

# Configuration file
$CONFIG_FILE = ".project_manager.conf"

# Default values
$script:DOCKER_HUB_USERNAME = $env:DOCKER_HUB_USERNAME
$script:DOCKER_HUB_REPO_BACKEND = "portal-backend"
$script:DOCKER_HUB_REPO_FRONTEND = "portal-frontend"

# VPS configurations
$script:VPS_CONFIGS = @{
    "production" = "ubuntu@37.59.115.194"
    "staging" = "ubuntu@37.59.115.194"
    "development" = "ubuntu@37.59.115.194"
}

# Helper Functions
function Write-Header {
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "     Portal Management System - Project Manager            " -ForegroundColor Cyan
    Write-Host "============================================================`n" -ForegroundColor Cyan
}

function Write-SuccessMsg {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-InfoMsg {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-WarningMsg {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

# Load configuration
function Load-Config {
    if (Test-Path $CONFIG_FILE) {
        Get-Content $CONFIG_FILE | ForEach-Object {
            if ($_ -match '^([^=]+)=(.+)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim('"')
                Set-Variable -Name $name -Value $value -Scope Script
            }
        }
        Write-InfoMsg "Configuration loaded from $CONFIG_FILE"
    }
}

# Save configuration
function Save-Config {
    @"
# Project Manager Configuration
DOCKER_HUB_USERNAME="$script:DOCKER_HUB_USERNAME"
DOCKER_HUB_REPO_BACKEND="$script:DOCKER_HUB_REPO_BACKEND"
DOCKER_HUB_REPO_FRONTEND="$script:DOCKER_HUB_REPO_FRONTEND"
"@ | Out-File -FilePath $CONFIG_FILE -Encoding UTF8
    Write-SuccessMsg "Configuration saved to $CONFIG_FILE"
}

# Docker Hub Configuration
function Set-DockerHubConfig {
    Write-Host "`n=== Docker Hub Configuration ===" -ForegroundColor Cyan
    $script:DOCKER_HUB_USERNAME = Read-Host "Enter Docker Hub username"
    $backend = Read-Host "Enter backend repository name [$script:DOCKER_HUB_REPO_BACKEND]"
    if ($backend) { $script:DOCKER_HUB_REPO_BACKEND = $backend }
    $frontend = Read-Host "Enter frontend repository name [$script:DOCKER_HUB_REPO_FRONTEND]"
    if ($frontend) { $script:DOCKER_HUB_REPO_FRONTEND = $frontend }
    Save-Config
}

# VPS Configuration
function Set-VPSConfig {
    Write-Host "`n=== VPS Configuration ===" -ForegroundColor Cyan
    Write-Host "Available VPS targets:"
    $script:VPS_CONFIGS.Keys | ForEach-Object { Write-Host "  - $_`: $($script:VPS_CONFIGS[$_])" }

    $vpsName = Read-Host "`nEnter VPS name to configure (or 'new' for new VPS)"
    if ($vpsName -eq "new") {
        $vpsName = Read-Host "Enter new VPS name"
    }

    $sshString = Read-Host "Enter SSH connection string (user@host)"
    $script:VPS_CONFIGS[$vpsName] = $sshString
    Write-SuccessMsg "VPS '$vpsName' configured: $sshString"
}

# Container Management
function Start-Containers {
    Write-Host "`n=== Starting Docker Containers ===" -ForegroundColor Cyan
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Containers started successfully"
        docker-compose ps
    } else {
        Write-ErrorMsg "Failed to start containers"
    }
}

function Stop-Containers {
    Write-Host "`n=== Stopping Docker Containers ===" -ForegroundColor Cyan
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Containers stopped successfully"
    } else {
        Write-ErrorMsg "Failed to stop containers"
    }
}

function Restart-Containers {
    Write-Host "`n=== Restarting Docker Containers ===" -ForegroundColor Cyan
    docker-compose restart
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Containers restarted successfully"
        docker-compose ps
    } else {
        Write-ErrorMsg "Failed to restart containers"
    }
}

function Show-ContainerLogs {
    Write-Host "`n=== Container Logs ===" -ForegroundColor Cyan
    Write-Host "Available services:"
    docker-compose ps --services

    $service = Read-Host "`nEnter service name (or 'all' for all services)"
    if ($service -eq "all") {
        docker-compose logs -f
    } else {
        docker-compose logs -f $service
    }
}

function Show-ContainerStatus {
    Write-Host "`n=== Container Status ===" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    docker stats --no-stream
}

# Build Management
function Build-Backend {
    Write-Host "`n=== Building Backend ===" -ForegroundColor Cyan
    Write-InfoMsg "Running type check..."
    npm run typecheck

    if ($LASTEXITCODE -eq 0) {
        Write-InfoMsg "Building TypeScript..."
        npm run build

        if ($LASTEXITCODE -eq 0) {
            Write-SuccessMsg "Backend built successfully"
        } else {
            Write-ErrorMsg "Backend build failed"
        }
    } else {
        Write-ErrorMsg "Type check failed"
    }
}

function Build-Frontend {
    Write-Host "`n=== Building Frontend ===" -ForegroundColor Cyan
    Push-Location frontend

    Write-InfoMsg "Running Next.js build..."
    npm run build

    Pop-Location

    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Frontend built successfully"
    } else {
        Write-ErrorMsg "Frontend build failed"
    }
}

function Build-DockerImages {
    Write-Host "`n=== Building Docker Images ===" -ForegroundColor Cyan

    Write-InfoMsg "Building backend Docker image..."
    docker build -t portal-backend:latest .

    Write-InfoMsg "Building frontend Docker image..."
    docker build -t portal-frontend:latest ./frontend

    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Docker images built successfully"
        docker images | Select-String "portal"
    } else {
        Write-ErrorMsg "Docker build failed"
    }
}

function Rebuild-All {
    Write-Host "`n=== Rebuilding Entire Project ===" -ForegroundColor Cyan

    Write-InfoMsg "Cleaning previous builds..."
    if (Test-Path "dist") { Remove-Item -Recurse -Force dist }
    if (Test-Path "frontend\.next") { Remove-Item -Recurse -Force frontend\.next }

    Write-InfoMsg "Reinstalling dependencies..."
    npm install
    Push-Location frontend
    npm install
    Pop-Location

    Build-Backend
    Build-Frontend
    Build-DockerImages

    Write-SuccessMsg "Project rebuilt successfully"
}

# Git Operations
function Show-GitStatus {
    Write-Host "`n=== Git Status ===" -ForegroundColor Cyan
    git status
    Write-Host ""
    git log --oneline -5
}

function Invoke-GitCommitAndPush {
    Write-Host "`n=== Git Commit and Push ===" -ForegroundColor Cyan

    git status
    Write-Host ""
    $addAll = Read-Host "Do you want to add all changes? (y/n)"

    if ($addAll -eq "y") {
        # Add all except nul file
        git add --all
        git reset HEAD nul 2>$null
    } else {
        $files = Read-Host "Enter files to add (space-separated)"
        git add $files.Split(' ')
    }

    $commitMsg = Read-Host "`nEnter commit message"

    git commit -m $commitMsg

    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Changes committed"

        $pushConfirm = Read-Host "Push to remote? (y/n)"
        if ($pushConfirm -eq "y") {
            git push
            if ($LASTEXITCODE -eq 0) {
                Write-SuccessMsg "Changes pushed to remote"
            } else {
                Write-ErrorMsg "Push failed"
            }
        }
    } else {
        Write-ErrorMsg "Commit failed"
    }
}

function Invoke-GitPull {
    Write-Host "`n=== Git Pull ===" -ForegroundColor Cyan
    git pull
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Repository updated"
    } else {
        Write-ErrorMsg "Pull failed"
    }
}

# Docker Hub Operations
function Connect-DockerHub {
    Write-Host "`n=== Docker Hub Login ===" -ForegroundColor Cyan

    if (-not $script:DOCKER_HUB_USERNAME) {
        Set-DockerHubConfig
    }

    docker login -u $script:DOCKER_HUB_USERNAME
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Logged in to Docker Hub"
    } else {
        Write-ErrorMsg "Login failed"
    }
}

function Push-ToDockerHub {
    Write-Host "`n=== Build and Push to Docker Hub ===" -ForegroundColor Cyan

    if (-not $script:DOCKER_HUB_USERNAME) {
        Write-ErrorMsg "Docker Hub not configured. Please configure first."
        Set-DockerHubConfig
        return
    }

    $version = Read-Host "Enter version tag (default: latest)"
    if (-not $version) { $version = "latest" }

    # Build images
    Write-InfoMsg "Building Docker images..."
    docker build -t "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):$version" .
    docker build -t "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):$version" ./frontend

    # Tag as latest
    docker tag "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):$version" "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):latest"
    docker tag "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):$version" "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):latest"

    # Push both versions
    Write-InfoMsg "Pushing images to Docker Hub..."
    docker push "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):$version"
    docker push "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_BACKEND):latest"
    docker push "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):$version"
    docker push "$script:DOCKER_HUB_USERNAME/$($script:DOCKER_HUB_REPO_FRONTEND):latest"

    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Images built and pushed to Docker Hub"
    } else {
        Write-ErrorMsg "Build/Push failed"
    }
}

# VPS Deployment Functions
function Deploy-ToVPS {
    Write-Host "`n=== Deploy to VPS ===" -ForegroundColor Cyan
    
    Write-Host "Available VPS targets:"
    $i = 1
    $vpsArray = @()
    $script:VPS_CONFIGS.Keys | ForEach-Object {
        Write-Host "  $i. $_ (ubuntu@37.59.115.194)" -ForegroundColor Yellow
        $vpsArray += $_
        $i++
    }
    
    $choice = Read-Host "`nSelect VPS target (1-$($vpsArray.Count))"
    
    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $vpsArray.Count) {
        $vpsName = $vpsArray[[int]$choice - 1]
    } else {
        Write-ErrorMsg "Invalid selection"
        return
    }
    
    $sshTarget = $script:VPS_CONFIGS[$vpsName]
    Write-InfoMsg "Deploying to $sshTarget..."
    
    if (-not $script:DOCKER_HUB_USERNAME) {
        Write-ErrorMsg "Docker Hub not configured. Please configure first."
        Set-DockerHubConfig
        return
    }
    
    # Setup docker permissions
    Write-InfoMsg "Setting up docker permissions..."
    ssh $sshTarget 'sudo usermod -aG docker ubuntu'
    
    # Copy docker-compose and .env
    Write-InfoMsg "Copying configuration files..."
    ssh $sshTarget 'mkdir -p /home/ubuntu/app'
    scp docker-compose.yml "$sshTarget`:/home/ubuntu/app/"
    scp .env "$sshTarget`:/home/ubuntu/app/"
    
    # Deploy on VPS - pull latest images from Docker Hub
    Write-InfoMsg "Pulling latest images and deploying..."
    ssh $sshTarget "cd /home/ubuntu/app && sg docker -c 'docker compose down && docker compose pull && docker image prune -f && docker compose up -d && docker compose ps'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Deployment completed"
    } else {
        Write-ErrorMsg "Deployment failed"
    }
}

function Connect-VPS {
    Write-Host "`n=== Connect to VPS ===" -ForegroundColor Cyan
    
    Write-Host "Available VPS targets:"
    $i = 1
    $vpsArray = @()
    $script:VPS_CONFIGS.Keys | ForEach-Object {
        Write-Host "  $i. $_ (ubuntu@37.59.115.194)" -ForegroundColor Yellow
        $vpsArray += $_
        $i++
    }
    
    $choice = Read-Host "`nSelect VPS target (1-$($vpsArray.Count))"
    
    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $vpsArray.Count) {
        $vpsName = $vpsArray[[int]$choice - 1]
    } else {
        Write-ErrorMsg "Invalid selection"
        return
    }
    
    $sshTarget = $script:VPS_CONFIGS[$vpsName]
    Write-InfoMsg "Connecting to $sshTarget..."
    ssh $sshTarget
}

function Show-VPSStatus {
    Write-Host "`n=== VPS Status ===" -ForegroundColor Cyan
    
    Write-Host "Available VPS targets:"
    $i = 1
    $vpsArray = @()
    $script:VPS_CONFIGS.Keys | ForEach-Object {
        Write-Host "  $i. $_ (ubuntu@37.59.115.194)" -ForegroundColor Yellow
        $vpsArray += $_
        $i++
    }
    
    $choice = Read-Host "`nSelect VPS target (1-$($vpsArray.Count))"
    
    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $vpsArray.Count) {
        $vpsName = $vpsArray[[int]$choice - 1]
    } else {
        Write-ErrorMsg "Invalid selection"
        return
    }
    
    $sshTarget = $script:VPS_CONFIGS[$vpsName]
    Write-InfoMsg "Checking status on $sshTarget..."
    
    ssh $sshTarget 'docker compose ps && docker stats --no-stream && df -h && free -h'
}

function Show-VPSLogs {
    Write-Host "`n=== VPS Logs ===" -ForegroundColor Cyan
    
    Write-Host "Available VPS targets:"
    $i = 1
    $vpsArray = @()
    $script:VPS_CONFIGS.Keys | ForEach-Object {
        Write-Host "  $i. $_ (ubuntu@37.59.115.194)" -ForegroundColor Yellow
        $vpsArray += $_
        $i++
    }
    
    $choice = Read-Host "`nSelect VPS target (1-$($vpsArray.Count))"
    
    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $vpsArray.Count) {
        $vpsName = $vpsArray[[int]$choice - 1]
    } else {
        Write-ErrorMsg "Invalid selection"
        return
    }
    
    $sshTarget = $script:VPS_CONFIGS[$vpsName]
    $service = Read-Host "Enter service name (or 'all' for all services)"
    
    Write-InfoMsg "Showing logs from $sshTarget..."
    
    if ($service -eq "all") {
        ssh $sshTarget 'docker compose logs --tail=50'
    } else {
        ssh $sshTarget "docker compose logs --tail=50 $service"
    }
}

function Restart-VPSServices {
    Write-Host "`n=== Restart VPS Services ===" -ForegroundColor Cyan
    
    Write-Host "Available VPS targets:"
    $i = 1
    $vpsArray = @()
    $script:VPS_CONFIGS.Keys | ForEach-Object {
        Write-Host "  $i. $_ (ubuntu@37.59.115.194)" -ForegroundColor Yellow
        $vpsArray += $_
        $i++
    }
    
    $choice = Read-Host "`nSelect VPS target (1-$($vpsArray.Count))"
    
    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $vpsArray.Count) {
        $vpsName = $vpsArray[[int]$choice - 1]
    } else {
        Write-ErrorMsg "Invalid selection"
        return
    }
    
    $sshTarget = $script:VPS_CONFIGS[$vpsName]
    Write-InfoMsg "Restarting services on $sshTarget..."
    
    ssh $sshTarget 'docker compose restart && docker compose ps'
    
    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Services restarted successfully"
    } else {
        Write-ErrorMsg "Restart failed"
    }
}

# Database Management
function Invoke-Migrations {
    Write-Host "`n=== Running Database Migrations ===" -ForegroundColor Cyan

    $location = Read-Host "Run in container or locally? (container/local)"

    if ($location -eq "container") {
        docker-compose exec backend npx prisma migrate deploy
    } else {
        npx prisma migrate deploy
    }

    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Migrations completed"
    } else {
        Write-ErrorMsg "Migrations failed"
    }
}

function Invoke-DatabaseSeed {
    Write-Host "`n=== Seeding Database ===" -ForegroundColor Cyan

    $location = Read-Host "Run in container or locally? (container/local)"

    if ($location -eq "container") {
        docker-compose exec backend npm run db:seed
    } else {
        npm run db:seed
    }

    if ($LASTEXITCODE -eq 0) {
        Write-SuccessMsg "Database seeded"
    } else {
        Write-ErrorMsg "Seeding failed"
    }
}

# Testing
function Invoke-Tests {
    Write-Host "`n=== Running Tests ===" -ForegroundColor Cyan

    Write-Host "Test suites:"
    Write-Host "  1. Backend unit tests"
    Write-Host "  2. Frontend unit tests"
    Write-Host "  3. E2E tests"
    Write-Host "  4. All tests"
    $testChoice = Read-Host "Select test suite"

    switch ($testChoice) {
        "1" { npm run test }
        "2" {
            Push-Location frontend
            npm run test
            Pop-Location
        }
        "3" {
            Push-Location frontend
            npm run test:e2e
            Pop-Location
        }
        "4" {
            npm run test
            Push-Location frontend
            npm run test
            npm run test:e2e
            Pop-Location
        }
        default { Write-ErrorMsg "Invalid selection" }
    }
}

# Main Menu
function Show-MainMenu {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "                      MAIN MENU                             " -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  Container Management                                      " -ForegroundColor Cyan
    Write-Host "    1. Start containers                                     " -ForegroundColor Cyan
    Write-Host "    2. Stop containers                                      " -ForegroundColor Cyan
    Write-Host "    3. Restart containers                                   " -ForegroundColor Cyan
    Write-Host "    4. View logs                                            " -ForegroundColor Cyan
    Write-Host "    5. Container status                                     " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Build Management                                          " -ForegroundColor Cyan
    Write-Host "    6. Build backend                                        " -ForegroundColor Cyan
    Write-Host "    7. Build frontend                                       " -ForegroundColor Cyan
    Write-Host "    8. Build Docker images                                  " -ForegroundColor Cyan
    Write-Host "    9. Rebuild entire project                               " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Git Operations                                            " -ForegroundColor Cyan
    Write-Host "   10. Git status                                           " -ForegroundColor Cyan
    Write-Host "   11. Commit and push                                      " -ForegroundColor Cyan
    Write-Host "   12. Pull latest changes                                  " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Docker Hub                                                " -ForegroundColor Cyan
    Write-Host "   13. Login to Docker Hub                                  " -ForegroundColor Cyan
    Write-Host "   14. Push images to Docker Hub                            " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Database                                                  " -ForegroundColor Cyan
    Write-Host "   15. Run migrations                                       " -ForegroundColor Cyan
    Write-Host "   16. Seed database                                        " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Testing                                                   " -ForegroundColor Cyan
    Write-Host "   17. Run tests                                            " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  VPS Deployment                                            " -ForegroundColor Cyan
    Write-Host "   18. Deploy to VPS                                        " -ForegroundColor Cyan
    Write-Host "   19. Connect to VPS (SSH)                                 " -ForegroundColor Cyan
    Write-Host "   20. Show VPS Status                                      " -ForegroundColor Cyan
    Write-Host "   21. Show VPS Logs                                        " -ForegroundColor Cyan
    Write-Host "   22. Restart VPS Services                                 " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Configuration                                             " -ForegroundColor Cyan
    Write-Host "   23. Configure Docker Hub                                 " -ForegroundColor Cyan
    Write-Host "   24. Configure VPS                                        " -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   0. Exit                                                  " -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
}

# Main execution
Write-Header
Load-Config

while ($true) {
    Show-MainMenu
    $choice = Read-Host "Select option"

    switch ($choice) {
        "1" { Start-Containers }
        "2" { Stop-Containers }
        "3" { Restart-Containers }
        "4" { Show-ContainerLogs }
        "5" { Show-ContainerStatus }
        "6" { Build-Backend }
        "7" { Build-Frontend }
        "8" { Build-DockerImages }
        "9" { Rebuild-All }
        "10" { Show-GitStatus }
        "11" { Invoke-GitCommitAndPush }
        "12" { Invoke-GitPull }
        "13" { Connect-DockerHub }
        "14" { Push-ToDockerHub }
        "15" { Invoke-Migrations }
        "16" { Invoke-DatabaseSeed }
        "17" { Invoke-Tests }
        "18" { Deploy-ToVPS }
        "19" { Connect-VPS }
        "20" { Show-VPSStatus }
        "21" { Show-VPSLogs }
        "22" { Restart-VPSServices }
        "23" { Set-DockerHubConfig }
        "24" { Set-VPSConfig }
        "0" {
            Write-InfoMsg "Exiting Project Manager"
            exit 0
        }
        default { Write-ErrorMsg "Invalid option. Please try again." }
    }

    Write-Host ""
    Read-Host "Press Enter to continue..."
}
