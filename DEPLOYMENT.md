# Deployment Guide

## Overview

This guide covers deploying the Portal Management System to production environments using Docker, Kubernetes, and various cloud providers.

## Prerequisites

- Docker and Docker Compose installed
- Kubernetes cluster (if deploying to K8s)
- PostgreSQL 16+
- Redis 7+
- Node.js 20+ (for local development)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_CONNECTION_LIMIT=20
DATABASE_POOL_TIMEOUT=10

# Redis
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-secure-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters

# Storage (choose one provider)
STORAGE_PROVIDER=s3-compatible  # or: local, digitalocean, linode, vultr

# For S3-compatible providers
STORAGE_S3_ENDPOINT=https://your-endpoint.com
STORAGE_S3_BUCKET=your-bucket-name
STORAGE_S3_ACCESS_KEY=your-access-key
STORAGE_S3_SECRET_KEY=your-secret-key
STORAGE_S3_REGION=us-east-1

# For local storage
STORAGE_LOCAL_PATH=./uploads
STORAGE_LOCAL_URL=/uploads

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Optional: Error Tracking
SENTRY_DSN=https://your-sentry-dsn

# Optional: Email (for password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@your-domain.com
```

## Local Development with Docker Compose

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/portal-system.git
cd portal-system

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed the database
docker-compose exec backend npm run db:seed

# View logs
docker-compose logs -f backend
```

### Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MinIO Console**: http://localhost:9001

### Common Commands

```bash
# Stop all services
docker-compose down

# Rebuild images
docker-compose build

# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate reset

# View service logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec backend npm run typecheck
docker-compose exec frontend npm run test
```

## Production Deployment

### Option 1: Docker Compose (Simple Deployment)

#### 1. Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-org/portal-system.git
cd portal-system

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Create production docker-compose override
cat > docker-compose.prod.yml <<EOF
version: '3.8'
services:
  backend:
    restart: always
    environment:
      NODE_ENV: production
  frontend:
    restart: always
    environment:
      NODE_ENV: production
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
EOF

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

#### 3. Configure Nginx Reverse Proxy

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    server {
        listen 443 ssl http2;
        server_name api.your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

### Option 2: Kubernetes Deployment

#### 1. Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Configure kubectl
export KUBECONFIG=~/.kube/config
```

#### 2. Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace portal-system

# Create secrets
kubectl create secret generic backend-secrets \
  --from-literal=DATABASE_URL=postgresql://... \
  --from-literal=REDIS_URL=redis://... \
  --from-literal=JWT_SECRET=... \
  --from-literal=JWT_REFRESH_SECRET=... \
  -n portal-system

# Apply configurations
kubectl apply -f k8s/database.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployments
kubectl rollout status deployment/backend -n portal-system
kubectl rollout status deployment/frontend -n portal-system

# Run migrations
kubectl exec -it deployment/backend -n portal-system -- npx prisma migrate deploy
```

#### 3. Monitor Deployment

```bash
# Check pods
kubectl get pods -n portal-system

# View logs
kubectl logs -f deployment/backend -n portal-system

# Check services
kubectl get svc -n portal-system

# Check ingress
kubectl get ingress -n portal-system

# View events
kubectl get events -n portal-system --sort-by='.lastTimestamp'
```

### Option 3: Cloud Providers

#### AWS ECS/Fargate

1. **Push Images to ECR**
```bash
# Authenticate
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t portal-backend .
docker tag portal-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/portal-backend:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/portal-backend:latest
```

2. **Create ECS Task Definition**
3. **Create ECS Service**
4. **Configure Application Load Balancer**

#### Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/your-project/portal-backend

# Deploy to Cloud Run
gcloud run deploy portal-backend \
  --image gcr.io/your-project/portal-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances

```bash
# Login to Azure
az login

# Create container registry
az acr create --resource-group myResourceGroup --name myregistry --sku Basic

# Build and push
az acr build --registry myregistry --image portal-backend:latest .

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name portal-backend \
  --image myregistry.azurecr.io/portal-backend:latest \
  --cpu 2 --memory 4 \
  --ports 3000
```

## Database Migration

### Production Migration Strategy

1. **Backup Database**
```bash
pg_dump -h hostname -U username -d database > backup.sql
```

2. **Run Migrations**
```bash
npx prisma migrate deploy
```

3. **Verify Migration**
```bash
npx prisma db pull
npx prisma validate
```

4. **Rollback Plan**
```bash
# If migration fails, restore from backup
psql -h hostname -U username -d database < backup.sql
```

## Monitoring & Logging

### Application Logs

```bash
# View logs with Docker Compose
docker-compose logs -f backend

# View logs in Kubernetes
kubectl logs -f deployment/backend -n portal-system

# Export logs to file
kubectl logs deployment/backend -n portal-system > logs.txt
```

### Health Checks

```bash
# Basic health
curl http://your-domain.com/api/v1/health

# Detailed health
curl http://your-domain.com/api/v1/health/detailed

# Readiness
curl http://your-domain.com/api/v1/health/ready

# Metrics
curl http://your-domain.com/api/v1/health/metrics
```

### Performance Monitoring

Set up monitoring with:
- Datadog
- New Relic
- Prometheus + Grafana
- AWS CloudWatch
- Google Cloud Monitoring

## Backup & Recovery

### Database Backups

**Automated Backups** (cron job):
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR=/backups
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U portal_user portals_db | gzip > $BACKUP_DIR/db-backup-$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

**Schedule**:
```cron
0 2 * * * /path/to/backup.sh
```

### File Storage Backups

If using local storage:
```bash
# Sync uploads to S3
aws s3 sync /app/uploads s3://backup-bucket/uploads/ --delete
```

## Scaling

### Horizontal Scaling

1. **Increase Replicas (Kubernetes)**
```bash
kubectl scale deployment/backend --replicas=5 -n portal-system
```

2. **Auto-scaling**
```bash
# Already configured in backend-deployment.yaml
# Scales based on CPU (70%) and Memory (80%)
```

### Vertical Scaling

Update resource limits in deployments:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate secure JWT secrets (32+ characters)
- [ ] Configure firewall rules
- [ ] Enable SSL/TLS with valid certificates
- [ ] Set up regular database backups
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure DDoS protection
- [ ] Enable audit logging
- [ ] Scan containers for vulnerabilities
- [ ] Review and update security headers
- [ ] Implement secrets management (AWS Secrets Manager, etc.)

## Troubleshooting

### Common Issues

**Application won't start**
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep DATABASE_URL

# Test database connection
docker-compose exec backend npx prisma db pull
```

**Database connection errors**
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U portal_user -d portals_db
```

**High memory usage**
```bash
# Check container stats
docker stats

# Restart services
docker-compose restart backend
```

## Rollback Procedures

### Docker Compose

```bash
# Pull previous image version
docker pull your-registry/portal-backend:previous-tag

# Update docker-compose.yml
# Change image tag to previous version

# Restart services
docker-compose up -d backend
```

### Kubernetes

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n portal-system

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2 -n portal-system

# Check rollout history
kubectl rollout history deployment/backend -n portal-system
```

## Support

For deployment issues:
- Check logs first
- Review health check endpoints
- Consult SECURITY.md and PERFORMANCE.md
- Contact support: support@your-domain.com
