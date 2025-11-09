# Project Manager Script

A comprehensive command-line tool for managing the entire Portal Management System project.

## Features

The Project Manager provides a unified interface for:

### Container Management
- Start Docker containers
- Stop Docker containers
- Restart Docker containers
- View real-time logs
- Monitor container status and resource usage

### Build Management
- Build backend TypeScript code
- Build frontend Next.js application
- Build Docker images
- Rebuild entire project from scratch

### Git Operations
- Check git status and recent commits
- Commit and push changes
- Pull latest changes from remote

### Docker Hub Integration
- Login to Docker Hub
- Push images to Docker Hub with version tagging
- Configure Docker Hub credentials

### VPS Deployment
- Deploy to multiple VPS targets
- Three deployment methods:
  - Docker Compose deployment
  - Docker image pull from Docker Hub
  - Git pull and rebuild on server
- Support for multiple VPS configurations

### Database Management
- Run Prisma migrations
- Seed database with test data
- Execute in Docker container or locally

### Testing
- Run backend unit tests
- Run frontend unit tests
- Run E2E tests with Playwright
- Run all test suites

### Configuration
- Configure Docker Hub credentials
- Add and manage multiple VPS targets
- Persistent configuration storage

## Installation

1. Make the script executable:
```bash
chmod +x project_manager.sh
```

2. Run the script:
```bash
./project_manager.sh
```

## First-Time Setup

### Docker Hub Configuration

When using Docker Hub features for the first time:

1. Select option **19** (Configure Docker Hub)
2. Enter your Docker Hub username
3. Enter repository names for backend and frontend
4. Configuration is saved to `.project_manager.conf`

### VPS Configuration

To add a new VPS target:

1. Select option **20** (Configure VPS)
2. Choose to configure existing or add new VPS
3. Enter VPS name (e.g., "production", "staging")
4. Enter SSH connection string (e.g., "user@your-server.com")
5. Configuration is saved to `.project_manager.conf`

### Pre-configured VPS Targets

The script comes with three pre-configured VPS targets (edit as needed):
- **production**: user@production.example.com
- **staging**: user@staging.example.com
- **development**: user@dev.example.com

## Usage Examples

### Starting the Development Environment

```bash
./project_manager.sh
# Select option 1: Start containers
```

This will:
- Start PostgreSQL, Redis, MinIO (if configured)
- Start backend and frontend services
- Display container status

### Building and Pushing to Docker Hub

```bash
./project_manager.sh
# 1. Select option 8: Build Docker images
# 2. Select option 13: Login to Docker Hub
# 3. Select option 14: Push images to Docker Hub
```

### Deploying to Production VPS

```bash
./project_manager.sh
# Select option 15: Deploy to VPS
# Choose VPS: production
# Select deployment method (Docker Compose, Images, or Git)
```

### Running Database Migrations

```bash
./project_manager.sh
# Select option 16: Run migrations
# Choose: container (for Docker) or local
```

### Complete Git Workflow

```bash
./project_manager.sh
# 1. Select option 10: Git status (review changes)
# 2. Select option 11: Commit and push
#    - Choose to add all files or specific files
#    - Enter commit message
#    - Confirm push to remote
```

## Configuration File

The script saves configuration to `.project_manager.conf`:

```bash
# Docker Hub credentials
DOCKER_HUB_USERNAME="your-username"
DOCKER_HUB_REPO_BACKEND="portal-backend"
DOCKER_HUB_REPO_FRONTEND="portal-frontend"

# VPS configurations
VPS_production="user@production.example.com"
VPS_staging="user@staging.example.com"
```

## Deployment Methods Explained

### Method 1: Docker Compose Deployment
- Copies `docker-compose.yml` to VPS
- Requires `.env` configuration on VPS
- Best for: Simple deployments, development/staging

### Method 2: Docker Hub Images
- Pulls pre-built images from Docker Hub
- Requires images to be pushed first
- Best for: Production deployments, consistent images

### Method 3: Git Pull and Rebuild
- Pulls latest code from git repository
- Rebuilds on the VPS
- Restarts services
- Best for: When you want to build on the server

## Prerequisites

### Local Requirements
- Docker and Docker Compose
- Git
- Node.js 20+
- Bash shell

### VPS Requirements
- SSH access with key-based authentication
- Docker installed
- Git installed (for method 3)
- Sufficient resources for the application

## SSH Configuration

For passwordless VPS deployment, set up SSH keys:

```bash
# Generate SSH key (if not already done)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to VPS
ssh-copy-id user@your-server.com

# Test connection
ssh user@your-server.com
```

## Environment Variables

Before deploying to VPS, ensure the `.env` file is configured:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=your-secure-secret
JWT_REFRESH_SECRET=your-refresh-secret
STORAGE_PROVIDER=s3-compatible
# ... additional variables
```

## Troubleshooting

### Script Won't Execute
```bash
# Ensure script is executable
chmod +x project_manager.sh

# Check line endings (convert CRLF to LF if needed)
dos2unix project_manager.sh
```

### Docker Commands Fail
```bash
# Ensure Docker daemon is running
docker ps

# Check Docker Compose version
docker-compose --version
```

### SSH Connection Fails
```bash
# Test SSH connection manually
ssh user@your-server.com

# Check SSH key permissions
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### VPS Deployment Fails
1. Ensure VPS has Docker installed
2. Verify SSH access works
3. Check VPS has sufficient disk space
4. Ensure ports 3000, 5432, 6379 are available

## Advanced Usage

### Adding Custom VPS Targets

Edit `.project_manager.conf` directly:

```bash
VPS_custom="user@custom-server.com"
```

Or use option 20 in the menu.

### Version Tagging

When pushing to Docker Hub, you can specify version tags:
```
Enter version tag (default: latest): v1.0.0
```

This tags images as:
- `username/portal-backend:v1.0.0`
- `username/portal-frontend:v1.0.0`

### Automated Deployments

For CI/CD integration, you can call specific functions:

```bash
# Example: Build and push to Docker Hub
source project_manager.sh
docker_hub_login
build_docker_images
docker_hub_push
```

## Menu Reference

| Option | Function | Description |
|--------|----------|-------------|
| 1 | Start containers | Starts all Docker services |
| 2 | Stop containers | Stops all Docker services |
| 3 | Restart containers | Restarts all Docker services |
| 4 | View logs | View real-time logs from services |
| 5 | Container status | Show container status and resource usage |
| 6 | Build backend | Compile TypeScript backend |
| 7 | Build frontend | Build Next.js frontend |
| 8 | Build Docker images | Build Docker images for both services |
| 9 | Rebuild entire project | Clean and rebuild everything |
| 10 | Git status | Show git status and recent commits |
| 11 | Commit and push | Commit changes and push to remote |
| 12 | Pull latest changes | Pull from git remote |
| 13 | Login to Docker Hub | Authenticate with Docker Hub |
| 14 | Push images to Docker Hub | Push built images to registry |
| 15 | Deploy to VPS | Deploy to configured VPS |
| 16 | Run migrations | Execute Prisma migrations |
| 17 | Seed database | Populate database with seed data |
| 18 | Run tests | Execute test suites |
| 19 | Configure Docker Hub | Set up Docker Hub credentials |
| 20 | Configure VPS | Add/edit VPS configurations |
| 0 | Exit | Exit the Project Manager |

## Security Notes

- Never commit `.project_manager.conf` to version control (it's in `.gitignore`)
- Use SSH keys for VPS access, not passwords
- Rotate secrets regularly
- Use strong passwords for Docker Hub
- Limit SSH access to specific IPs when possible

## Support

For issues or questions:
- Check the main `DEPLOYMENT.md` guide
- Review `API.md` for API-specific questions
- Consult `SECURITY.md` for security concerns
- See `PERFORMANCE.md` for optimization tips

## License

Part of the Portal Management System project.
