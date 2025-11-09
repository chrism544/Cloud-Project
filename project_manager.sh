#!/bin/bash

#############################################
# Portal Management System - Project Manager
# Comprehensive script for managing the entire project
#############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration file
CONFIG_FILE=".project_manager.conf"

# Default values
DOCKER_HUB_USERNAME="${DOCKER_HUB_USERNAME:-}"
DOCKER_HUB_REPO_BACKEND="${DOCKER_HUB_REPO_BACKEND:-portal-backend}"
DOCKER_HUB_REPO_FRONTEND="${DOCKER_HUB_REPO_FRONTEND:-portal-frontend}"

# VPS configurations (can be extended)
declare -A VPS_CONFIGS
VPS_CONFIGS["production"]="user@production.example.com"
VPS_CONFIGS["staging"]="user@staging.example.com"
VPS_CONFIGS["development"]="user@dev.example.com"

# Functions

print_header() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     Portal Management System - Project Manager          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Load configuration
load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
        print_info "Configuration loaded from $CONFIG_FILE"
    fi
}

# Save configuration
save_config() {
    cat > "$CONFIG_FILE" <<EOF
# Project Manager Configuration
DOCKER_HUB_USERNAME="$DOCKER_HUB_USERNAME"
DOCKER_HUB_REPO_BACKEND="$DOCKER_HUB_REPO_BACKEND"
DOCKER_HUB_REPO_FRONTEND="$DOCKER_HUB_REPO_FRONTEND"
EOF
    print_success "Configuration saved to $CONFIG_FILE"
}

# Configure Docker Hub
configure_docker_hub() {
    echo -e "${CYAN}=== Docker Hub Configuration ===${NC}"
    read -p "Enter Docker Hub username: " DOCKER_HUB_USERNAME
    read -p "Enter backend repository name [$DOCKER_HUB_REPO_BACKEND]: " input
    DOCKER_HUB_REPO_BACKEND="${input:-$DOCKER_HUB_REPO_BACKEND}"
    read -p "Enter frontend repository name [$DOCKER_HUB_REPO_FRONTEND]: " input
    DOCKER_HUB_REPO_FRONTEND="${input:-$DOCKER_HUB_REPO_FRONTEND}"
    save_config
}

# Configure VPS
configure_vps() {
    echo -e "${CYAN}=== VPS Configuration ===${NC}"
    echo "Available VPS targets:"
    for vps in "${!VPS_CONFIGS[@]}"; do
        echo "  - $vps: ${VPS_CONFIGS[$vps]}"
    done
    echo ""
    read -p "Enter VPS name to configure (or 'new' for new VPS): " vps_name

    if [ "$vps_name" == "new" ]; then
        read -p "Enter new VPS name: " vps_name
    fi

    read -p "Enter SSH connection string (user@host): " ssh_string
    VPS_CONFIGS["$vps_name"]="$ssh_string"

    # Save to config file
    {
        echo ""
        echo "# VPS Configuration"
        for vps in "${!VPS_CONFIGS[@]}"; do
            echo "VPS_${vps}=\"${VPS_CONFIGS[$vps]}\""
        done
    } >> "$CONFIG_FILE"

    print_success "VPS '$vps_name' configured: ${VPS_CONFIGS[$vps_name]}"
}

# Docker Container Management

start_containers() {
    echo -e "${CYAN}=== Starting Docker Containers ===${NC}"
    docker-compose up -d
    print_success "Containers started successfully"
    docker-compose ps
}

stop_containers() {
    echo -e "${CYAN}=== Stopping Docker Containers ===${NC}"
    docker-compose down
    print_success "Containers stopped successfully"
}

restart_containers() {
    echo -e "${CYAN}=== Restarting Docker Containers ===${NC}"
    docker-compose restart
    print_success "Containers restarted successfully"
    docker-compose ps
}

view_logs() {
    echo -e "${CYAN}=== Container Logs ===${NC}"
    echo "Available services:"
    docker-compose ps --services
    echo ""
    read -p "Enter service name (or 'all' for all services): " service

    if [ "$service" == "all" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

container_status() {
    echo -e "${CYAN}=== Container Status ===${NC}"
    docker-compose ps
    echo ""
    docker stats --no-stream
}

# Build Management

build_backend() {
    echo -e "${CYAN}=== Building Backend ===${NC}"
    print_info "Running type check..."
    npm run typecheck

    print_info "Building TypeScript..."
    npm run build

    print_success "Backend built successfully"
}

build_frontend() {
    echo -e "${CYAN}=== Building Frontend ===${NC}"
    cd frontend

    print_info "Running type check..."
    npm run build

    cd ..
    print_success "Frontend built successfully"
}

build_docker_images() {
    echo -e "${CYAN}=== Building Docker Images ===${NC}"

    print_info "Building backend Docker image..."
    docker build -t portal-backend:latest .

    print_info "Building frontend Docker image..."
    docker build -t portal-frontend:latest ./frontend

    print_success "Docker images built successfully"
    docker images | grep portal
}

rebuild_all() {
    echo -e "${CYAN}=== Rebuilding Entire Project ===${NC}"

    print_info "Cleaning previous builds..."
    rm -rf dist frontend/.next

    print_info "Reinstalling dependencies..."
    npm install
    cd frontend && npm install && cd ..

    build_backend
    build_frontend
    build_docker_images

    print_success "Project rebuilt successfully"
}

# Git Operations

git_status() {
    echo -e "${CYAN}=== Git Status ===${NC}"
    git status
    echo ""
    git log --oneline -5
}

git_commit_and_push() {
    echo -e "${CYAN}=== Git Commit and Push ===${NC}"

    git status
    echo ""
    read -p "Do you want to add all changes? (y/n): " add_all

    if [ "$add_all" == "y" ]; then
        git add .
    else
        read -p "Enter files to add (space-separated): " files
        git add $files
    fi

    echo ""
    read -p "Enter commit message: " commit_msg

    git commit -m "$commit_msg

🤖 Generated with Project Manager

Co-Authored-By: Claude <noreply@anthropic.com>"

    print_success "Changes committed"

    read -p "Push to remote? (y/n): " push_confirm
    if [ "$push_confirm" == "y" ]; then
        git push
        print_success "Changes pushed to remote"
    fi
}

git_pull() {
    echo -e "${CYAN}=== Git Pull ===${NC}"
    git pull
    print_success "Repository updated"
}

# Docker Hub Operations

docker_hub_login() {
    echo -e "${CYAN}=== Docker Hub Login ===${NC}"

    if [ -z "$DOCKER_HUB_USERNAME" ]; then
        configure_docker_hub
    fi

    docker login -u "$DOCKER_HUB_USERNAME"
    print_success "Logged in to Docker Hub"
}

docker_hub_push() {
    echo -e "${CYAN}=== Push to Docker Hub ===${NC}"

    if [ -z "$DOCKER_HUB_USERNAME" ]; then
        print_error "Docker Hub not configured. Please configure first."
        configure_docker_hub
    fi

    read -p "Enter version tag (default: latest): " version
    version="${version:-latest}"

    # Tag and push backend
    print_info "Tagging and pushing backend image..."
    docker tag portal-backend:latest "$DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_BACKEND:$version"
    docker push "$DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_BACKEND:$version"

    # Tag and push frontend
    print_info "Tagging and pushing frontend image..."
    docker tag portal-frontend:latest "$DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_FRONTEND:$version"
    docker push "$DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_FRONTEND:$version"

    print_success "Images pushed to Docker Hub"
}

# VPS Deployment

deploy_to_vps() {
    echo -e "${CYAN}=== Deploy to VPS ===${NC}"

    echo "Available VPS targets:"
    local i=1
    local vps_list=()
    for vps in "${!VPS_CONFIGS[@]}"; do
        echo "  $i. $vps (${VPS_CONFIGS[$vps]})"
        vps_list+=("$vps")
        ((i++))
    done

    echo ""
    read -p "Select VPS number: " vps_num

    if [ "$vps_num" -lt 1 ] || [ "$vps_num" -gt "${#vps_list[@]}" ]; then
        print_error "Invalid selection"
        return 1
    fi

    local selected_vps="${vps_list[$((vps_num-1))]}"
    local vps_host="${VPS_CONFIGS[$selected_vps]}"

    print_info "Deploying to $selected_vps ($vps_host)"

    echo ""
    echo "Deployment method:"
    echo "  1. Deploy via Docker Compose"
    echo "  2. Deploy via Docker images (pull from Docker Hub)"
    echo "  3. Deploy via git pull and rebuild"
    read -p "Select method: " deploy_method

    case $deploy_method in
        1)
            deploy_docker_compose "$vps_host"
            ;;
        2)
            deploy_docker_images "$vps_host"
            ;;
        3)
            deploy_git_rebuild "$vps_host"
            ;;
        *)
            print_error "Invalid deployment method"
            ;;
    esac
}

deploy_docker_compose() {
    local vps_host="$1"

    print_info "Copying docker-compose.yml to VPS..."
    scp docker-compose.yml "$vps_host:~/portal-system/"
    scp .env.example "$vps_host:~/portal-system/.env"

    print_warning "Please configure .env on the VPS before continuing"
    read -p "Press Enter when ready..."

    print_info "Starting services on VPS..."
    ssh "$vps_host" "cd ~/portal-system && docker-compose up -d"

    print_success "Deployment complete"
}

deploy_docker_images() {
    local vps_host="$1"

    if [ -z "$DOCKER_HUB_USERNAME" ]; then
        print_error "Docker Hub not configured"
        return 1
    fi

    read -p "Enter image version to deploy (default: latest): " version
    version="${version:-latest}"

    print_info "Pulling images on VPS..."
    ssh "$vps_host" "docker pull $DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_BACKEND:$version"
    ssh "$vps_host" "docker pull $DOCKER_HUB_USERNAME/$DOCKER_HUB_REPO_FRONTEND:$version"

    print_info "Updating docker-compose.yml on VPS..."
    # Update image tags in docker-compose.yml
    ssh "$vps_host" "cd ~/portal-system && docker-compose up -d"

    print_success "Deployment complete"
}

deploy_git_rebuild() {
    local vps_host="$1"

    print_info "Pulling latest code on VPS..."
    ssh "$vps_host" "cd ~/portal-system && git pull"

    print_info "Rebuilding on VPS..."
    ssh "$vps_host" "cd ~/portal-system && npm install && npm run build"
    ssh "$vps_host" "cd ~/portal-system/frontend && npm install && npm run build"

    print_info "Restarting services..."
    ssh "$vps_host" "cd ~/portal-system && docker-compose restart"

    print_success "Deployment complete"
}

# Database Management

run_migrations() {
    echo -e "${CYAN}=== Running Database Migrations ===${NC}"

    read -p "Run in container or locally? (container/local): " location

    if [ "$location" == "container" ]; then
        docker-compose exec backend npx prisma migrate deploy
    else
        npx prisma migrate deploy
    fi

    print_success "Migrations completed"
}

seed_database() {
    echo -e "${CYAN}=== Seeding Database ===${NC}"

    read -p "Run in container or locally? (container/local): " location

    if [ "$location" == "container" ]; then
        docker-compose exec backend npm run db:seed
    else
        npm run db:seed
    fi

    print_success "Database seeded"
}

# Testing

run_tests() {
    echo -e "${CYAN}=== Running Tests ===${NC}"

    echo "Test suites:"
    echo "  1. Backend unit tests"
    echo "  2. Frontend unit tests"
    echo "  3. E2E tests"
    echo "  4. All tests"
    read -p "Select test suite: " test_choice

    case $test_choice in
        1)
            npm run test
            ;;
        2)
            cd frontend && npm run test && cd ..
            ;;
        3)
            cd frontend && npm run test:e2e && cd ..
            ;;
        4)
            npm run test
            cd frontend && npm run test && npm run test:e2e && cd ..
            ;;
        *)
            print_error "Invalid selection"
            ;;
    esac
}

# Main Menu

show_main_menu() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                      MAIN MENU                           ║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║  Container Management                                    ║${NC}"
    echo -e "${CYAN}║    1. Start containers                                   ║${NC}"
    echo -e "${CYAN}║    2. Stop containers                                    ║${NC}"
    echo -e "${CYAN}║    3. Restart containers                                 ║${NC}"
    echo -e "${CYAN}║    4. View logs                                          ║${NC}"
    echo -e "${CYAN}║    5. Container status                                   ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  Build Management                                        ║${NC}"
    echo -e "${CYAN}║    6. Build backend                                      ║${NC}"
    echo -e "${CYAN}║    7. Build frontend                                     ║${NC}"
    echo -e "${CYAN}║    8. Build Docker images                                ║${NC}"
    echo -e "${CYAN}║    9. Rebuild entire project                             ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  Git Operations                                          ║${NC}"
    echo -e "${CYAN}║   10. Git status                                         ║${NC}"
    echo -e "${CYAN}║   11. Commit and push                                    ║${NC}"
    echo -e "${CYAN}║   12. Pull latest changes                                ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  Docker Hub                                              ║${NC}"
    echo -e "${CYAN}║   13. Login to Docker Hub                                ║${NC}"
    echo -e "${CYAN}║   14. Push images to Docker Hub                          ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  VPS Deployment                                          ║${NC}"
    echo -e "${CYAN}║   15. Deploy to VPS                                      ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  Database                                                ║${NC}"
    echo -e "${CYAN}║   16. Run migrations                                     ║${NC}"
    echo -e "${CYAN}║   17. Seed database                                      ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  Testing                                                 ║${NC}"
    echo -e "${CYAN}║   18. Run tests                                          ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║  Configuration                                           ║${NC}"
    echo -e "${CYAN}║   19. Configure Docker Hub                               ║${NC}"
    echo -e "${CYAN}║   20. Configure VPS                                      ║${NC}"
    echo -e "${CYAN}║                                                          ║${NC}"
    echo -e "${CYAN}║   0. Exit                                                ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Main loop

main() {
    print_header
    load_config

    while true; do
        show_main_menu
        read -p "Select option: " choice

        case $choice in
            1) start_containers ;;
            2) stop_containers ;;
            3) restart_containers ;;
            4) view_logs ;;
            5) container_status ;;
            6) build_backend ;;
            7) build_frontend ;;
            8) build_docker_images ;;
            9) rebuild_all ;;
            10) git_status ;;
            11) git_commit_and_push ;;
            12) git_pull ;;
            13) docker_hub_login ;;
            14) docker_hub_push ;;
            15) deploy_to_vps ;;
            16) run_migrations ;;
            17) seed_database ;;
            18) run_tests ;;
            19) configure_docker_hub ;;
            20) configure_vps ;;
            0)
                print_info "Exiting Project Manager"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please try again."
                ;;
        esac

        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
