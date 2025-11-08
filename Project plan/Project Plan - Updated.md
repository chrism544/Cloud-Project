# Project Plan: Portal Management System (Version 4)

## 1. Introduction

This document is the definitive, comprehensive plan for developing the Portal Management System. Version 4 incorporates:
- **VPS Provider Abstraction** for flexible cloud storage
- **GitHub Integration** with commits after each phase
- **Complete Database Schema** with multi-tenancy strategy
- **Observability & Monitoring** for production readiness
- **Enhanced Security & Testing** strategies

**Repository:** `git@github.com:chrism544/Cloud-Project.git`

---

## Phase 0: Planning & Repository Setup ✅

*Goal: Establish project planning documentation and version control.*

1.  ✅ **Create Project Plan:** Document all phases and requirements
2.  ✅ **Define OpenAPI Specification:** Complete API contract
3.  ✅ **Initialize Git Repository:** Set up version control
4.  ✅ **Push to GitHub:** Initial commit to `git@github.com:chrism544/Cloud-Project.git`

**Git Commit:**
```bash
git add .
git commit -m "Phase 0 Complete: Project planning and documentation"
git push origin main
```

---

## Phase 1: Backend Foundation & Setup

*Goal: Establish a clean, scalable backend project structure with logging, error handling, and all core dependencies in place.*

### Tasks

1.  **Initialize Project & Dependencies:**
    - Set up `package.json` and install production dependencies:
      - `fastify` - Fast web framework
      - `@fastify/jwt` - JWT authentication
      - `@fastify/cors` - CORS support
      - `@fastify/rate-limit` - Rate limiting
      - `@fastify/cookie` - Cookie handling
      - `@fastify/swagger` - API documentation
      - `@fastify/swagger-ui` - Interactive API docs
      - `@prisma/client` - Database ORM
      - `pino` - Structured logging
      - `pino-pretty` - Log formatting (dev)
      - `dotenv` - Environment variables
      - `zod` - Schema validation
      - `bcrypt` or `argon2` - Password hashing
      - `ioredis` - Redis client
    - Install development dependencies:
      - `typescript` - Type safety
      - `@types/node` - Node.js types
      - `tsx` - TypeScript execution
      - `prisma` - Prisma CLI
      - `eslint` - Code linting
      - `prettier` - Code formatting

2.  **Configure TypeScript:**
    - Create `tsconfig.json` with strict mode enabled
    - Configure path aliases for clean imports

3.  **Establish Directory Structure:**
    ```
    src/
    ├── modules/           # Feature modules
    │   ├── auth/
    │   ├── portals/
    │   ├── pages/
    │   ├── menus/
    │   └── assets/
    ├── plugins/           # Fastify plugins
    │   ├── prisma.ts
    │   ├── redis.ts
    │   └── auth.ts
    ├── utils/             # Utility functions
    │   ├── logger.ts
    │   └── errors.ts
    └── server.ts          # Main entry point
    ```

4.  **Configure Logging & Error Handling:**
    - Set up structured, leveled logging using **Pino**
    - Implement a global error handling hook to standardize all API error responses
    - Create custom error classes (ValidationError, NotFoundError, UnauthorizedError, etc.)

5.  **Configure Environment:**
    - Create `.env.example` with all required variables:
      ```env
      # Server
      NODE_ENV=development
      PORT=3000
      HOST=0.0.0.0
      
      # Database
      DATABASE_URL=postgresql://user:password@localhost:5432/portals_db
      
      # Redis
      REDIS_URL=redis://localhost:6379
      
      # JWT
      JWT_SECRET=your-secret-key-change-in-production
      JWT_ACCESS_EXPIRY=15m
      JWT_REFRESH_EXPIRY=7d
      
      # Storage (VPS Provider)
      STORAGE_PROVIDER=local # local, digitalocean, linode, vultr
      STORAGE_ENDPOINT=
      STORAGE_REGION=
      STORAGE_BUCKET=
      STORAGE_ACCESS_KEY=
      STORAGE_SECRET_KEY=
      STORAGE_PUBLIC_URL=
      ```

6.  **Setup Local Development Services:**
    - Install and configure local PostgreSQL
    - Install and configure local Redis
    - Document setup commands in README

7.  **Create Server Entrypoint:**
    - Implement a basic Fastify server in `src/server.ts`
    - Add `/health` endpoint for monitoring
    - Add `/api/v1` prefix for all API routes

### Deliverables
- Working Fastify server with health check
- Structured logging configured
- Environment configuration ready
- Development dependencies installed

**Git Commit:**
```bash
git add .
git commit -m "Phase 1 Complete: Backend foundation and project structure"
git push origin main
git tag -a v0.1.0 -m "Phase 1: Backend Foundation"
git push origin v0.1.0
```

---

## Phase 2: Database Schema & Migration

*Goal: Define the complete database schema using Prisma and create the physical tables.*

### Tasks

1.  **Initialize & Configure Prisma:**
    - Run `npx prisma init`
    - Set up `schema.prisma` for PostgreSQL
    - Configure Prisma Client generation

2.  **Define Complete Models:**
    Code all database models with proper relationships:
    - `Portal` - Customer portal instances
    - `User` - System users with authentication
    - `RefreshToken` - JWT refresh token storage
    - `AssetContainer` - Theme and branding with inheritance
    - `Page` - Content pages with versioning
    - `Menu` - Navigation menus
    - `MenuItem` - Menu items with nesting
    - `AuditLog` - User action tracking
    - `StorageFile` - Uploaded file metadata

3.  **Multi-Tenancy Strategy:**
    - Implement row-level tenant isolation via `portal_id`
    - Add database indexes for performance
    - Document isolation strategy

4.  **Run First Migration:**
    - Execute `npx prisma migrate dev --name init`
    - Generate Prisma Client: `npx prisma generate`
    - Seed initial data (master theme, test portal, admin user)

5.  **Create Database Documentation:**
    - Document all tables, relationships, and constraints
    - Create ER diagram
    - Document backup and migration strategies

### Deliverables
- Complete Prisma schema with all models
- Initial database migration applied
- Seeded test data
- Database documentation

**Git Commit:**
```bash
git add .
git commit -m "Phase 2 Complete: Database schema and migrations"
git push origin main
git tag -a v0.2.0 -m "Phase 2: Database Schema"
git push origin v0.2.0
```

---

## Phase 3: Core API Implementation (CRUD)

*Goal: Build out the REST API endpoints with integrated caching and documentation.*

### Tasks

1.  **Structure & Implement Modules:**
    Build routes, controllers, and services for each resource:
    - **Portals Module:** CRUD operations for portals
    - **Pages Module:** CRUD with publishing workflow
    - **Menus Module:** CRUD with nested items
    - **Asset Containers Module:** Theme management with inheritance resolution

2.  **Implement API Versioning:**
    - All routes under `/api/v1`
    - Document versioning strategy for future API changes

3.  **Integrate Caching Layer:**
    - Connect to Redis
    - Implement cache-aside pattern for:
      - Published pages (cache key: `portal:{id}:page:{slug}`)
      - Menus (cache key: `portal:{id}:menu:{location}`)
      - Asset containers with inheritance resolved
    - Automated cache invalidation on updates
    - Set appropriate TTL values (e.g., 1 hour for pages, 5 minutes for menus)

4.  **Generate TypeScript Types:**
    - Export Prisma types for frontend consumption
    - Consider using `openapi-typescript` to generate types from OpenAPI spec

5.  **Serve API Documentation:**
    - Integrate `@fastify/swagger` and `@fastify/swagger-ui`
    - Automatically generate OpenAPI docs from route schemas
    - Serve interactive docs at `/docs`
    - Keep `openapi.yaml` in sync

6.  **Input Validation:**
    - Use Zod schemas for all route inputs
    - Validate query params, body, and path params
    - Return consistent error responses

### Deliverables
- Full CRUD API for all resources
- Redis caching implemented
- Interactive API documentation
- Type-safe request/response schemas

**Git Commit:**
```bash
git add .
git commit -m "Phase 3 Complete: Core API with caching and documentation"
git push origin main
git tag -a v0.3.0 -m "Phase 3: Core API Implementation"
git push origin v0.3.0
```

---

## Phase 4: Authentication & Security Enhancements

*Goal: Secure the API with a robust JWT implementation, RBAC, and other security measures.*

### Tasks

1.  **Implement Auth Module:**
    - `POST /api/v1/auth/register` - User registration with email verification
    - `POST /api/v1/auth/login` - Login with email/password
    - `POST /api/v1/auth/refresh` - Refresh access token
    - `POST /api/v1/auth/logout` - Revoke refresh token
    - `POST /api/v1/auth/forgot-password` - Password reset request
    - `POST /api/v1/auth/reset-password` - Complete password reset

2.  **JWT & Refresh Tokens:**
    - Short-lived access tokens (15 minutes)
    - Long-lived refresh tokens (7 days)
    - Store refresh tokens in `refresh_tokens` table with hashed values
    - Include user ID, portal ID, and role in JWT payload
    - Implement token rotation on refresh

3.  **Password Security:**
    - Use **argon2id** (preferred) or **bcrypt** with cost factor 12+
    - Enforce password complexity requirements
    - Implement rate limiting on login attempts

4.  **Implement Authorization (RBAC):**
    - Create Fastify plugin to verify user roles
    - Define roles: `admin`, `editor`, `viewer`
    - Protect sensitive endpoints with role checks
    - Implement decorator: `@requireRole('admin')`

5.  **Add Rate Limiting:**
    - Use `@fastify/rate-limit`
    - Protect authentication endpoints (5 attempts per 15 minutes)
    - Global rate limit (100 requests per minute per IP)
    - Per-user rate limits for expensive operations

6.  **Configure CORS:**
    - Implement dynamic CORS policy based on portal's `custom_domain`
    - Restrict origins to registered portal domains
    - Allow credentials for cookie-based auth

7.  **Security Headers:**
    - Add `@fastify/helmet` for security headers
    - Configure CSP, HSTS, X-Frame-Options, etc.

### Deliverables
- Complete authentication system
- JWT with refresh token strategy
- RBAC implementation
- Rate limiting on all endpoints
- Security headers configured

**Git Commit:**
```bash
git add .
git commit -m "Phase 4 Complete: Authentication and security"
git push origin main
git tag -a v0.4.0 -m "Phase 4: Authentication & Security"
git push origin v0.4.0
```

---

## Phase 5: Asset Management with VPS Provider Abstraction

*Goal: Enable secure user uploads of assets to flexible cloud storage providers.*

### Architecture: Storage Provider Interface

Create an abstraction layer to support multiple VPS storage providers:

```typescript
// src/modules/storage/providers/interface.ts
export interface StorageProvider {
  uploadFile(file: Buffer, filename: string, options: UploadOptions): Promise<UploadResult>;
  deleteFile(path: string): Promise<void>;
  getSignedUrl(path: string, expiresIn: number): Promise<string>;
  getPublicUrl(path: string): string;
}

export interface UploadOptions {
  mimeType: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  path: string;
  url: string;
  size: number;
}
```

### Supported Providers

1.  **Local Filesystem** (Development)
2.  **DigitalOcean Spaces** (S3-compatible)
3.  **Linode Object Storage** (S3-compatible)
4.  **Vultr Object Storage** (S3-compatible)
5.  **Generic S3-Compatible** (Configurable)

### Tasks

1.  **Create Storage Provider Interface:**
    - Define common interface for all providers
    - Implement factory pattern for provider instantiation

2.  **Implement Local Storage Provider:**
    ```typescript
    // src/modules/storage/providers/local.ts
    export class LocalStorageProvider implements StorageProvider {
      constructor(private basePath: string, private baseUrl: string) {}
      // Implementation for local development
    }
    ```

3.  **Implement S3-Compatible Provider:**
    ```typescript
    // src/modules/storage/providers/s3-compatible.ts
    import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
    import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
    
    export class S3CompatibleProvider implements StorageProvider {
      private client: S3Client;
      
      constructor(config: S3Config) {
        this.client = new S3Client({
          endpoint: config.endpoint,
          region: config.region,
          credentials: {
            accessKeyId: config.accessKey,
            secretAccessKey: config.secretKey,
          },
        });
      }
      // Implementation for S3-compatible storage
    }
    ```

4.  **Create Provider-Specific Implementations:**
    - **DigitalOcean:** `endpoint: https://${region}.digitaloceanspaces.com`
    - **Linode:** `endpoint: https://${region}.linodeobjects.com`
    - **Vultr:** `endpoint: https://${region}.vultrobjects.com`

5.  **Implement Storage Service:**
    ```typescript
    // src/modules/storage/storage.service.ts
    export class StorageService {
      private provider: StorageProvider;
      
      constructor() {
        this.provider = StorageProviderFactory.create(
          process.env.STORAGE_PROVIDER
        );
      }
      
      async uploadFile(file: Buffer, filename: string, portalId: string) {
        // Sanitize filename
        // Upload to provider
        // Store metadata in storage_files table
        // Return public URL
      }
    }
    ```

6.  **Create Upload Endpoints:**
    - `POST /api/v1/storage/upload` - Direct file upload
    - `POST /api/v1/storage/presigned-url` - Generate presigned URL for client-side upload
    - `DELETE /api/v1/storage/:fileId` - Delete file

7.  **Input Sanitization & Validation:**
    - Sanitize filenames (remove special characters, limit length)
    - Validate file types (whitelist: images, PDFs, etc.)
    - Enforce file size limits (e.g., 10MB per file)
    - Scan for malware (optional: integrate ClamAV)

8.  **File Management:**
    - Store metadata in `storage_files` table
    - Track storage provider used
    - Implement soft delete (mark as deleted, cleanup later)
    - Create cleanup job for orphaned files

### Configuration

```env
# Storage Provider: local, digitalocean, linode, vultr, s3-compatible
STORAGE_PROVIDER=digitalocean

# Local Storage (Development)
STORAGE_LOCAL_PATH=./uploads
STORAGE_LOCAL_URL=http://localhost:3000/uploads

# S3-Compatible Storage (Production)
STORAGE_ENDPOINT=https://nyc3.digitaloceanspaces.com
STORAGE_REGION=nyc3
STORAGE_BUCKET=my-portal-assets
STORAGE_ACCESS_KEY=DO00XXXXXXXXXXXXX
STORAGE_SECRET_KEY=YYYYYYYYYYYYYYYYYYY
STORAGE_PUBLIC_URL=https://my-portal-assets.nyc3.cdn.digitaloceanspaces.com

# Upload Limits
STORAGE_MAX_FILE_SIZE=10485760  # 10MB in bytes
STORAGE_ALLOWED_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

### Deliverables
- Storage provider abstraction layer
- Support for multiple VPS providers
- File upload API with validation
- Metadata tracking in database
- Documentation for configuring each provider

**Git Commit:**
```bash
git add .
git commit -m "Phase 5 Complete: Asset management with VPS provider abstraction"
git push origin main
git tag -a v0.5.0 -m "Phase 5: Asset Management"
git push origin v0.5.0
```

---

## Phase 6: Frontend Foundation & Setup

*Goal: Scaffold the Next.js frontend application with all approved technologies.*

### Tasks

1.  **Initialize Project:**
    ```bash
    npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
    ```

2.  **Install Dependencies:**
    ```bash
    npm install puck-editor @dnd-kit/core @dnd-kit/sortable @headlessui/react lucide-react zustand @tanstack/react-query axios zod
    ```

3.  **Install Dev Dependencies:**
    ```bash
    npm install -D @types/node eslint prettier prettier-plugin-tailwindcss
    ```

4.  **Configure Tooling:**
    - Set up `tailwind.config.ts` with custom theme
    - Configure ESLint and Prettier
    - Add path aliases in `tsconfig.json`

5.  **Establish Directory Structure:**
    ```
    frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/
    │   │   └── register/
    │   ├── (portal)/
    │   │   ├── pages/
    │   │   ├── menus/
    │   │   └── themes/
    │   └── layout.tsx
    ├── components/
    │   ├── ui/              # Reusable UI components
    │   ├── editors/         # Puck & menu editors
    │   └── layouts/
    ├── lib/
    │   ├── api/             # API client
    │   ├── hooks/           # Custom React hooks
    │   └── stores/          # Zustand stores
    └── types/               # TypeScript types
    ```

### Deliverables
- Next.js application initialized
- All dependencies installed
- Project structure established
- Development server running

**Git Commit:**
```bash
git add .
git commit -m "Phase 6 Complete: Frontend foundation"
git push origin main
git tag -a v0.6.0 -m "Phase 6: Frontend Foundation"
git push origin v0.6.0
```

---

## Phase 7: Frontend UI & API Integration

*Goal: Build an accessible, high-quality user interface and connect it to the backend API.*

### Tasks

1.  **Core Requirement - Accessibility (WCAG 2.1):**
    - All components must meet WCAG 2.1 AA standards
    - Implement keyboard navigation
    - Add proper ARIA attributes
    - Ensure sufficient color contrast (4.5:1 for text)
    - Test with screen readers

2.  **API Client & State:**
    - Configure Axios client with interceptors for auth tokens
    - Set up TanStack Query with proper cache configuration
    - Create Zustand stores for global state (auth, theme, etc.)
    - Implement automatic token refresh

3.  **Authentication Flow:**
    - Build login/register pages
    - Implement protected route wrapper
    - Handle session management
    - Add "Remember me" functionality

4.  **Build Core UI & Editors:**
    - Create main app layout with navigation
    - Integrate Puck editor for page building
    - Build menu editor with `@dnd-kit` for drag-and-drop
    - Implement theme preview system

5.  **Connect to API:**
    - Use TanStack Query hooks for all data fetching
    - Implement optimistic updates for better UX
    - Handle loading and error states
    - Add pagination for list views

6.  **Implement Theming:**
    - Dynamically apply themes based on `AssetContainer` data
    - Implement theme inheritance resolver
    - Allow real-time theme preview
    - Support custom CSS injection

7.  **Build Dashboard:**
    - Overview page with key metrics
    - Recent pages and menu items
    - Quick actions

### Deliverables
- Fully functional admin UI
- Puck page editor integrated
- Menu editor with drag-and-drop
- Theme management interface
- Connected to backend API

**Git Commit:**
```bash
git add .
git commit -m "Phase 7 Complete: Frontend UI and API integration"
git push origin main
git tag -a v0.7.0 -m "Phase 7: Frontend UI"
git push origin v0.7.0
```

---

## Phase 8: Comprehensive Testing & QA

*Goal: Ensure application quality and stability through a multi-layered testing strategy.*

### Tasks

1.  **Backend Testing:**
    - **Unit Tests (Jest):** Test services, utilities, and business logic
    - **Integration Tests (Jest + Supertest):** Test API endpoints
    - **Target Coverage:** 80%+ code coverage
    - Create test database and fixtures

2.  **Frontend Testing:**
    - **Component Tests (Jest + React Testing Library):** Test individual components
    - **Integration Tests:** Test page flows
    - **Accessibility Tests:** Use `jest-axe` for a11y testing

3.  **End-to-End (E2E) Testing:**
    - Use **Playwright** to automate critical user workflows:
      - User registration and login
      - Creating and publishing a page
      - Building and saving a menu
      - Uploading and applying assets
    - Run E2E tests in CI/CD pipeline

4.  **Performance Testing:**
    - Load testing with **k6** or **Artillery**
    - Test API response times under load
    - Verify cache effectiveness
    - Test concurrent user scenarios

5.  **Security Testing:**
    - Run dependency vulnerability scans (`npm audit`, `snyk`)
    - Test authentication bypass attempts
    - Verify RBAC enforcement
    - Test rate limiting effectiveness
    - SQL injection testing (should be prevented by Prisma)

6.  **QA Process:**
    - All features verified on staging environment
    - Maintain test plan document
    - Create bug report templates

### Deliverables
- Comprehensive test suite (unit, integration, E2E)
- 80%+ code coverage
- Performance test results
- Security scan reports
- QA checklist and procedures

**Git Commit:**
```bash
git add .
git commit -m "Phase 8 Complete: Comprehensive testing suite"
git push origin main
git tag -a v0.8.0 -m "Phase 8: Testing & QA"
git push origin v0.8.0
```

---

## Phase 9: Observability & Monitoring

*Goal: Implement comprehensive monitoring, logging, and alerting for production operations.*

### Tasks

1.  **Structured Logging Aggregation:**
    - Configure Pino to output JSON logs
    - Set up log aggregation (options: Loki, ELK Stack, or VPS-hosted solution)
    - Implement log levels: `error`, `warn`, `info`, `debug`, `trace`
    - Add correlation IDs for request tracing

2.  **Application Performance Monitoring (APM):**
    - Integrate APM solution (options):
      - **Self-hosted:** Grafana + Prometheus + Tempo
      - **Managed:** New Relic, Datadog, or VPS-compatible APM
    - Track key metrics:
      - API response times (p50, p95, p99)
      - Database query performance
      - Redis cache hit rates
      - Error rates

3.  **Error Tracking:**
    - Integrate error tracking (options):
      - **Self-hosted:** Sentry (open source)
      - **Managed:** Sentry, Rollbar
    - Capture stack traces, user context, and breadcrumbs
    - Set up error alerting via email/Slack

4.  **Uptime Monitoring:**
    - Set up external uptime monitoring (UptimeRobot, Pingdom, or self-hosted)
    - Monitor critical endpoints (`/health`, `/api/v1/auth/login`)
    - Configure alerting for downtime

5.  **Database Monitoring:**
    - Monitor PostgreSQL metrics:
      - Connection pool usage
      - Query performance
      - Lock contention
      - Replication lag (if using replicas)
    - Set up slow query logging

6.  **Custom Dashboards:**
    - Create Grafana dashboards for:
      - System health overview
      - API performance
      - User activity
      - Storage usage
    - Export dashboard configs to git

7.  **Alerting Rules:**
    - Define alerting thresholds:
      - API error rate > 1%
      - Response time p95 > 1000ms
      - CPU usage > 80%
      - Memory usage > 90%
      - Disk space < 10%
    - Configure notification channels (email, Slack, PagerDuty)

### Deliverables
- Log aggregation system configured
- APM dashboard with key metrics
- Error tracking integrated
- Uptime monitoring active
- Custom Grafana dashboards
- Alerting rules configured

**Git Commit:**
```bash
git add .
git commit -m "Phase 9 Complete: Observability and monitoring"
git push origin main
git tag -a v0.9.0 -m "Phase 9: Observability"
git push origin v0.9.0
```

---

## Phase 10: CI/CD, Deployment, & Operations

*Goal: Automate the full lifecycle of the application and ensure it is secure and reliable in production.*

### Tasks

1.  **Enhance CI Workflow:**
    Update `.github/workflows/ci.yml` to enforce:
    - Linting (ESLint for frontend, ESLint for backend)
    - Type checking (TypeScript compilation)
    - Unit and integration tests
    - E2E tests (on staging environment)
    - Security scans (npm audit, Snyk, Trivy for containers)
    - Code coverage reporting

2.  **Containerization:**
    - Create `Dockerfile` for backend (multi-stage build)
    - Create `Dockerfile` for frontend
    - Create `docker-compose.yml` for local development
    - Optimize image sizes (use Alpine base images)

3.  **Define Deployment Workflow:**
    - **Staging Environment:**
      - Auto-deploy on pushes to `main` branch
      - Use environment-specific configs
      - Run smoke tests after deployment
    - **Production Environment:**
      - Manual approval gate
      - Deploy from tagged releases (`v1.0.0`)
      - Blue-green or rolling deployment strategy

4.  **Deployment Targets:**
    - **Backend:** Deploy to VPS with Docker + Docker Compose or Kubernetes
    - **Frontend:** Deploy to Vercel or VPS with Nginx
    - **Database:** Managed PostgreSQL or VPS-hosted with backups
    - **Redis:** Managed Redis or VPS-hosted

5.  **Operational Readiness & Security:**
    - **Automated Backups:**
      - Daily PostgreSQL backups with 30-day retention
      - Backup storage files weekly
      - Test restore procedures quarterly
    - **High Availability:**
      - PostgreSQL replication (primary + replica)
      - Load balancer for backend (Nginx, HAProxy, or Cloudflare)
      - Multi-zone deployment if using Kubernetes
    - **WAF (Web Application Firewall):**
      - Place production behind Cloudflare or self-hosted WAF
      - Configure DDoS protection
      - Set up rate limiting at WAF level

6.  **Secrets Management:**
    - Use GitHub Secrets for CI/CD
    - Use environment variables for runtime secrets
    - Consider HashiCorp Vault for advanced secret management

7.  **Database Migrations in Production:**
    - Run migrations as separate CI/CD step before deployment
    - Use `prisma migrate deploy` for zero-downtime migrations
    - Implement rollback procedures

8.  **Documentation:**
    - Deployment runbook
    - Rollback procedures
    - Disaster recovery plan
    - Incident response guide

### Deliverables
- Automated CI/CD pipeline
- Staging and production environments
- Containerized applications
- Backup and HA configured
- WAF protection enabled
- Complete operational documentation

**Git Commit:**
```bash
git add .
git commit -m "Phase 10 Complete: CI/CD and production deployment"
git push origin main
git tag -a v1.0.0 -m "Phase 10: Production Ready"
git push origin v1.0.0
```

---

## Phase 11: Versioning & Auditing

*Goal: Track changes to key resources for rollback and accountability.*

### Tasks

1.  **Schema Updates:**
    - Modify `pages` schema to support version history (already included)
    - Consider versioning for `menus` and `asset_containers`
    - Add `version` and `parent_version_id` columns

2.  **Versioning API:**
    - `GET /api/v1/pages/:id/versions` - List all versions
    - `GET /api/v1/pages/:id/versions/:version` - Get specific version
    - `POST /api/v1/pages/:id/revert/:version` - Revert to version
    - Implement version comparison (diff)

3.  **Audit Log Implementation:**
    - Already have `audit_logs` table
    - Create audit service to log:
      - User logins/logouts
      - Resource creation/updates/deletes
      - Permission changes
      - Configuration changes
    - Store before/after values in JSONB

4.  **Audit Log UI:**
    - Build admin page to view audit logs
    - Filter by user, action, resource type, date range
    - Export audit logs to CSV

5.  **Compliance Features:**
    - GDPR: Implement user data export
    - GDPR: Implement user data deletion (anonymization)
    - Retain audit logs per compliance requirements

### Deliverables
- Page versioning with revert capability
- Comprehensive audit logging
- Audit log viewing interface
- GDPR compliance features

**Git Commit:**
```bash
git add .
git commit -m "Phase 11 Complete: Versioning and auditing"
git push origin main
git tag -a v1.1.0 -m "Phase 11: Versioning & Auditing"
git push origin v1.1.0
```

---

## Phase 12: Internationalization (i18n)

*Goal: Architect the platform to support multiple languages.*

### Tasks

1.  **Schema Updates:**
    - Modify database schemas to store translated content:
      - `pages.content` already supports JSONB (can store translations)
      - Add `locale` column to pages
      - Consider separate `page_translations` table for multiple locales
    - Update `menus` and `menu_items` for translation support

2.  **Backend i18n:**
    - Add `Accept-Language` header parsing
    - Return localized error messages
    - Store user's preferred locale in `users` table

3.  **Frontend Integration:**
    - Install `next-intl` or `next-i18next`
    - Create translation files: `locales/en.json`, `locales/es.json`, etc.
    - Implement locale detection and switching
    - Add language selector to UI

4.  **Locale-Aware UI:**
    - Format dates, numbers, and currencies per locale
    - Support RTL (right-to-left) languages
    - Translate all UI text
    - Implement locale-specific content rendering

5.  **Content Translation Workflow:**
    - Allow editors to create translations for pages
    - Show translation completeness indicators
    - Fallback to default locale if translation missing

### Deliverables
- Multi-language support for UI
- Translated content management
- Locale detection and switching
- Properly formatted dates/numbers per locale

**Git Commit:**
```bash
git add .
git commit -m "Phase 12 Complete: Internationalization"
git push origin main
git tag -a v1.2.0 -m "Phase 12: Internationalization"
git push origin v1.2.0
```

---

## Phase 13: Notifications

*Goal: Implement a system for transactional email notifications.*

### Tasks

1.  **Choose Email Service:**
    Options:
    - **Self-hosted:** Postfix, Sendmail (requires SMTP configuration)
    - **Transactional Email Services:** 
      - SendGrid
      - Postmark
      - Mailgun
      - Amazon SES
    - Recommendation: **Postmark** or **SendGrid** for reliability

2.  **Integrate Service:**
    - Add SDK to backend (`@sendgrid/mail` or `postmark`)
    - Configure API keys in environment

3.  **Create Email Templates:**
    - Welcome email (new user registration)
    - Email verification
    - Password reset
    - Invitation to portal
    - Weekly activity digest (optional)

4.  **Implement Notifications Service:**
    ```typescript
    // src/modules/notifications/notifications.service.ts
    export class NotificationsService {
      async sendWelcomeEmail(user: User): Promise<void>
      async sendPasswordResetEmail(user: User, resetToken: string): Promise<void>
      async sendEmailVerification(user: User, verificationToken: string): Promise<void>
    }
    ```

5.  **Queue Implementation (Optional):**
    - Use Redis + Bull or BullMQ for email queue
    - Prevents blocking API requests
    - Retry failed email sends

6.  **Email Tracking:**
    - Store sent emails in `notification_logs` table
    - Track delivery status
    - Handle bounces and complaints

### Deliverables
- Email service integrated
- Transactional email templates
- Notification service implemented
- Email tracking and logging

**Git Commit:**
```bash
git add .
git commit -m "Phase 13 Complete: Email notifications"
git push origin main
git tag -a v1.3.0 -m "Phase 13: Notifications"
git push origin v1.3.0
```

---

## Future Enhancements

*High-value features to consider after the core product is successfully launched.*

### Search & Indexing
- Implement full-text search using:
  - **PostgreSQL Full-Text Search** (simple, built-in)
  - **Meilisearch** (fast, typo-tolerant)
  - **Elasticsearch** (powerful, complex)
- Index pages, menus, and portal content
- Provide search API and UI

### Analytics
- Integrate privacy-friendly analytics:
  - **Self-hosted:** Matomo, Plausible, Umami
  - **Managed:** Plausible Cloud, Fathom
- Track:
  - Page views per portal
  - Editor usage patterns
  - User engagement metrics
- Build analytics dashboard for portal admins

### Feature Flags
- Integrate feature flag service:
  - **Self-hosted:** Unleash
  - **Managed:** LaunchDarkly, Flagsmith
- Use cases:
  - Progressive rollout of new features
  - A/B testing
  - Kill switch for problematic features

### Multi-Factor Authentication (MFA)
- Add 2FA support with TOTP (Google Authenticator, Authy)
- SMS-based 2FA (via Twilio)
- Backup codes

### Webhooks
- Allow portals to subscribe to events:
  - Page published
  - User registered
  - Menu updated
- Implement webhook delivery system with retries

### CDN Integration
- Integrate CDN for static asset delivery:
  - Cloudflare CDN
  - BunnyCDN (VPS-friendly)
- Automatic asset optimization and caching

### API Rate Plan System
- Implement tiered API access (Free, Pro, Enterprise)
- Track API usage per portal
- Enforce rate limits based on plan

---

## Project Milestones & Timeline

| Phase | Milestone | Estimated Duration |
|-------|-----------|-------------------|
| 0 | Planning Complete | ✅ Complete |
| 1 | Backend Foundation | 3-5 days |
| 2 | Database Schema | 2-3 days |
| 3 | Core API | 5-7 days |
| 4 | Authentication | 3-5 days |
| 5 | Asset Management | 3-4 days |
| 6 | Frontend Foundation | 2-3 days |
| 7 | Frontend UI | 7-10 days |
| 8 | Testing | 5-7 days |
| 9 | Observability | 3-4 days |
| 10 | CI/CD & Deployment | 4-5 days |
| **Total MVP** | **Phases 0-10** | **~6-8 weeks** |
| 11 | Versioning & Auditing | 3-4 days |
| 12 | Internationalization | 4-5 days |
| 13 | Notifications | 2-3 days |
| **Total v1.0** | **Phases 0-13** | **~8-10 weeks** |

---

## Git Workflow Summary

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch (optional)
- `feature/*` - Feature branches
- `hotfix/*` - Critical bug fixes

### After Each Phase
```bash
# Complete work
git add .
git commit -m "Phase X Complete: [Description]"
git push origin main

# Tag release
git tag -a vX.Y.Z -m "Phase X: [Title]"
git push origin vX.Y.Z
```

### Version Numbering
- **v0.x.x** - Development phases (MVP in progress)
- **v1.0.0** - Production ready (after Phase 10)
- **v1.x.0** - Minor releases (new features)
- **v1.x.x** - Patch releases (bug fixes)

---

## Success Criteria

### Phase Completion Checklist
Each phase is considered complete when:
- [ ] All tasks completed
- [ ] Code passes linting and type checking
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Committed and pushed to GitHub
- [ ] Tagged with version number

### Production Readiness (v1.0.0)
- [ ] All security features implemented and tested
- [ ] Performance meets targets (API p95 < 500ms)
- [ ] 80%+ test coverage
- [ ] All critical user workflows tested (E2E)
- [ ] Observability and monitoring active
- [ ] Backup and disaster recovery tested
- [ ] Documentation complete
- [ ] Staging environment validated
- [ ] Production deployment successful

---

## Repository Information

- **GitHub:** `git@github.com:chrism544/Cloud-Project.git`
- **Branch:** `main`
- **Current Version:** `v0.0.1` (Planning phase)
- **License:** (To be determined)
- **Documentation:** See `/docs` folder

---

## Notes

- All phases should be completed in order
- Each phase builds upon the previous
- Git commits ensure we can rollback if needed
- Tags mark stable milestones
- Adjust timeline based on team size and resources
- VPS provider abstraction allows easy migration between providers
- Security and testing are continuous, not one-time activities

---

*Last Updated: January 8, 2025*
*Document Version: 4.0*
