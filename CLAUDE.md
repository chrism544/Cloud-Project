# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal Management System** - A multi-tenant SaaS platform for managing customer portals with CMS capabilities, built with Fastify (backend) and Next.js (frontend, upcoming).

**Tech Stack:**
- **Backend:** Fastify + TypeScript + Prisma + PostgreSQL + Redis
- **Auth:** JWT with refresh tokens, RBAC (viewer/editor/admin/superadmin)
- **Storage:** Abstracted provider layer (local, S3-compatible: DigitalOcean, Linode, Vultr, MinIO)
- **Frontend:** Next.js 15 + Tailwind + Puck Editor (in progress)

**Current Status:** Phase 5 complete (backend MVP with auth, CRUD, caching, storage abstraction)

## Development Commands

### Backend

```bash
# Development with hot reload
npm run dev

# Type checking only (no build)
npm run typecheck

# Build for production
npm run build

# Run production build
npm start

# Database operations
npx prisma migrate dev        # Create and apply migration
npx prisma migrate deploy     # Apply migrations (production)
npx prisma generate          # Regenerate Prisma Client
npm run db:seed              # Seed database with test data
npx prisma studio            # Open Prisma Studio GUI
```

### Testing

**Note:** Test suite not yet implemented (Phase 8). When adding tests:
- Unit tests: Jest + Supertest
- E2E tests: Playwright
- Target: 80%+ coverage

## Architecture

### Multi-Tenancy Strategy

**Row-level isolation** via `portalId` foreign key on all tenant-scoped tables. Every request must be scoped to a portal. The JWT payload includes `portalId` to enforce tenant isolation.

### Path Aliases

TypeScript path aliases configured in `tsconfig.json`:
- `@utils/*` → `src/utils/*`
- `@plugins/*` → `src/plugins/*`
- `@modules/*` → `src/modules/*`

### Module Structure

```
src/
├── modules/              # Feature modules (auth, portals, pages, menus, storage, asset-containers)
│   └── {feature}/
│       └── routes.ts     # Fastify route handlers
├── plugins/              # Fastify plugins
│   ├── prisma.ts        # Prisma client plugin
│   ├── redis.ts         # Redis client plugin
│   └── auth.ts          # JWT auth + RBAC decorators
├── utils/
│   ├── logger.ts        # Pino structured logging
│   └── errors.ts        # Global error handler
└── server.ts            # Main entry point
```

### Authentication Flow

1. **Login:** `POST /api/v1/auth/login` → Returns `accessToken` (15m) + `refreshToken` (7d)
2. **Refresh:** `POST /api/v1/auth/refresh` → Rotates refresh token, returns new access token
3. **Protected Routes:** Use `app.authenticate` preHandler or `app.requireRole('admin')`

**RBAC Hierarchy:** `viewer < editor < admin < superadmin` (hierarchical role checking in `src/plugins/auth.ts:42-56`)

### Storage Abstraction

Storage provider abstraction in `src/modules/storage/`:
- **Interface:** `providers/interface.ts` - Common `StorageProvider` interface
- **Implementations:**
  - `providers/local.ts` - Local filesystem (dev)
  - `providers/s3-compatible.ts` - S3-compatible (MinIO, DigitalOcean Spaces, Linode, Vultr)
- **Factory:** `factory.ts` - Provider instantiation based on `STORAGE_PROVIDER` env var

Configure via `.env`:
```env
STORAGE_PROVIDER=local  # or: digitalocean, linode, vultr, s3-compatible
```

### Caching Strategy

Redis cache-aside pattern for:
- Published pages: `portal:{id}:page:{slug}`
- Menus: `portal:{id}:menu:{location}`
- Asset containers (with inheritance resolved)

Cache invalidation on updates is manual (implement in route handlers).

### Database Schema Highlights

**Key Models:**
- `Portal` - Tenant instances (identified by subdomain or customDomain)
- `User` - Multi-tenant users with portalId FK
- `AssetContainer` - Themes with inheritance (via parentId self-relation)
- `Page` - Content pages with versioning support (version, parentVersionId)
- `Menu` / `MenuItem` - Hierarchical navigation
- `StorageFile` - File metadata for multi-provider storage
- `RefreshToken` - JWT refresh tokens (hashed)
- `PasswordResetToken` - Password reset tokens (hashed, 30m expiry)
- `AuditLog` - User action tracking (not yet implemented)

**Prisma Client Location:** Generated to `src/generated/prisma/client` (custom output path)

### Seeding

Run `npm run db:seed` to create:
- Master theme (id: `00000000-0000-0000-0000-000000000001`)
- Test portal (subdomain: `test`)
- Admin user: `admin@example.com` / `ChangeMe123!`
- Superadmin user: `Chris.Malbon` / `Superman@1`

## API Documentation

- **Swagger UI:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health
- **Base Path:** `/api/v1`

All routes use Zod for input validation. Error responses follow standard format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set up PostgreSQL: `DATABASE_URL=postgresql://user:password@localhost:5432/portals_db`
3. Set up Redis: `REDIS_URL=redis://localhost:6379`
4. Generate JWT secret: `JWT_SECRET=<random-secret>`
5. Run migrations: `npx prisma migrate dev`
6. Seed database: `npm run db:seed`
7. Start server: `npm run dev`

## Important Conventions

### Error Handling

Use global error handler in `src/utils/errors.ts`. Custom error classes not yet implemented - use Fastify's built-in error responses.

### Logging

Structured logging via Pino (`@utils/logger`). Use levels: `error`, `warn`, `info`, `debug`, `trace`.

### Route Registration

Routes are registered in `src/server.ts:64-72`. All module routes export a default async function that registers routes on the Fastify instance.

### Role-Based Access Control

Use decorators from `src/plugins/auth.ts`:
- `app.authenticate` - Requires valid JWT
- `app.requireRole('admin')` - Requires specific role or higher

Example:
```typescript
app.get('/admin-only', { preHandler: app.requireRole('admin') }, async (req, reply) => {
  // Handler code
});
```

## Recent Fixes (Phase 4 Completion)

- ✅ Fixed plugin decorators to properly use `fastify-plugin` wrapper for Prisma and Redis plugins
- ✅ Added stricter rate limiting to auth endpoints (5 requests per 15 minutes)
- ✅ Fixed JWT type declarations to extend `@fastify/jwt` instead of conflicting with it
- ✅ Fixed S3-compatible storage provider TypeScript errors
- ✅ Added `@types/bcrypt` for proper type checking
- ✅ Fixed logger configuration in server.ts (inline config instead of Pino instance)
- ✅ All TypeScript compilation errors resolved
- ✅ Build passes successfully

## Known Issues / TODOs

- [ ] Phase 6-13 not yet started (frontend, testing, observability, CI/CD, etc.)
- [ ] Email notifications service placeholder (Phase 13) - password reset emails not sent
- [ ] Audit logging not implemented (table exists, service not wired)
- [ ] Cache invalidation not automated
- [ ] No test suite yet (Phase 8)
- [ ] Frontend not yet scaffolded (Phase 6)
- [ ] Redis and PostgreSQL need to be running for full functionality

## Phase Progress

According to `Project Plan - Updated.md`:
- ✅ Phase 0: Planning & Repository Setup
- ✅ Phase 1: Backend Foundation & Setup
- ✅ Phase 2: Database Schema & Migration
- ✅ Phase 3: Core API Implementation (CRUD)
- ✅ Phase 4: Authentication & Security Enhancements
- ✅ Phase 5: Asset Management with VPS Provider Abstraction
- ⏳ Phase 6+: Frontend, Testing, Observability, CI/CD, etc.

**Next Steps:** Begin Phase 6 (Frontend Foundation) or implement missing Phase 4/5 features.
