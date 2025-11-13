# Copilot Instructions for Cloud Project

A multi-tenant Portal Management System (Fastify + Next.js + Prisma + PostgreSQL).

## Architecture Overview

**Three-tier system:**
- **Backend** (`src/`): Fastify API with modular structure, Prisma ORM, Redis caching
- **Frontend** (`frontend/`): Next.js 15 with Puck.js visual editor (13 widgets)
- **Database**: PostgreSQL with multi-tenant row-level isolation via `portalId` foreign keys

**Key principle:** Every tenant-scoped table includes `portalId` FK. All requests must be scoped to `req.user.portalId`.

## Multi-Tenancy Pattern

All tenant-scoped models (User, Page, Menu, Theme, GlobalContent) include `portalId: String @db.Uuid`. 
- JWT payload includes `portalId` (set in `src/plugins/auth.ts`)
- Routes must validate `portalId` from JWT matches request data
- Example: `await app.prisma.page.findMany({ where: { portalId: req.user.portalId } })`

## Module Structure

Each feature lives in `src/modules/{feature}/`:
```
src/modules/{feature}/
├── routes.ts          # Main route handler exporting default async (app) => {}
├── services/          # Business logic (optional)
└── types.ts           # Zod schemas + TypeScript types (optional)
```

**All modules export** a default async function that receives FastifyInstance and registers routes. See `src/modules/auth/routes.ts`, `src/modules/pages/routes.ts` for patterns. Modules are registered in `src/server.ts:67-76`.

## Critical Patterns

### Route Registration
- Base path: `/api/v1/{resource}`
- All routes use Zod validation: `const schema = z.object({ ... }); schema.parse(req.body)`
- Return format: `{ error: { code: "ERROR_CODE", message: "..." } }` for errors

### Authentication & RBAC
- **Decorator:** `app.authenticate` (preHandler) verifies JWT
- **Role check:** `app.requireRole('admin')` enforces RBAC hierarchy: `viewer < editor < admin < superadmin`
- Example: `app.post('/path', { preHandler: app.requireRole('admin') }, ...)`
- JWT payload type: `{ sub: string, role: string, portalId: string }`

### Error Handling
Custom error classes in `src/utils/errors.ts`: `AppError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`.
- Throw errors; global handler in `registerErrorHandler()` converts to JSON responses
- Example: `throw new NotFoundError('Page not found')`

### Caching Strategy
Redis cache-aside pattern: `portal:{id}:{resource}:{params}` keys with 5min expiry.
- Get: `await app.redis.get(key)` → parse if exists
- Set: `await app.redis.set(key, JSON.stringify(data), 'EX', 300)`
- Invalidate on updates: `await app.redis.keys('portal:*').then(keys => app.redis.del(keys))`

### Logging
Pino structured logging via `@utils/logger`. Levels: `error`, `warn`, `info`, `debug`, `trace`.
- Use: `app.log.info({ context }, 'message')` or `req.log.info(...)`

## Backend Development

### Setup
```powershell
npm run dev              # Hot reload (uses tsx watch)
npm run typecheck       # TypeScript check only
npm run build           # Production build
npx prisma migrate dev  # Create+apply migration
npm run db:seed         # Seed with test data
npm run db:studio       # Open Prisma GUI
```

**Default credentials (after seed):**
- Email: `admin@example.com`
- Password: `ChangeMe123!`

### TypeScript Path Aliases
Configured in `tsconfig.json`:
- `@utils/*` → `src/utils/*`
- `@plugins/*` → `src/plugins/*`
- `@modules/*` → `src/modules/*`

Use these in all imports; they're compiled via `tsc-alias` in build step.

### Environment Variables
Copy from `.env.example`. Critical:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection
- `JWT_SECRET`: Minimum 32 chars
- `STORAGE_PROVIDER`: `local` | `digitalocean` | `linode` | `vultr` | `s3-compatible`

## Frontend Development

### Setup
```powershell
cd frontend
npm run dev                  # Next.js dev server
npm run build && npm start   # Production
npm run test:e2e           # Playwright tests
npm run test:e2e:ui        # Playwright UI mode
```

### Key Files
- `frontend/app/layout.tsx`: Root layout with providers
- `frontend/app/(portal)/dashboard/`: Main portal routes
- `frontend/components/PageRenderer.tsx`: Puck.js page renderer
- `frontend/lib/puck/config.tsx`: 13 Puck widget configs
- `frontend/lib/hooks/`: React Query hooks (usePages, useMenus, etc.)

### State Management
- **Global:** Zustand stores in `lib/stores/` (e.g., `uiStore.ts`)
- **Server:** React Query in `lib/hooks/` (e.g., `usePages()` hook)

## Storage Abstraction Layer

All uploads use provider-agnostic layer in `src/modules/storage/`:
- **Interface:** `providers/interface.ts` defines `StorageProvider`
- **Implementations:** `providers/local.ts`, `providers/s3-compatible.ts`
- **Factory:** `factory.ts` instantiates based on `STORAGE_PROVIDER` env var

Adding new provider:
1. Implement `StorageProvider` interface
2. Add case to factory `getProvider()`
3. Add env vars for that provider

## Testing

### Backend Testing
```powershell
npm run test              # Jest
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

Jest configured in `jest.config.js` with 70% threshold. Test files: `**/*.test.ts` or `**/__tests__/*.ts`. Setup hook: `tests/setup.ts`.

### Frontend Testing
- **Unit/Integration:** Jest + React Testing Library
- **E2E:** Playwright (config: `frontend/playwright.config.ts`)
- Run E2E: `npm run test:e2e` from frontend dir

## Key Database Models

**Multi-tenant tables** (include `portalId`):
- `User`: Portal users with RBAC roles
- `Page`: Content pages with Puck.js JSON content
- `Menu`, `MenuItem`: Hierarchical navigation
- `Theme`: Theme tokens (stored as JSON)
- `GlobalContent`: Reusable content blocks

**Shared tables** (no `portalId`):
- `Portal`: Tenant instances
- `AssetContainer`: Themes with parent inheritance
- `RefreshToken`, `PasswordResetToken`: Auth tokens

**Admin extensions:**
- `UserOnPortal`: Multi-role assignments
- `PageAnalytics`, `UserActivity`, `SecurityAlert`, `SystemConfig`: Monitoring/auditing

See `prisma/schema.prisma` for full schema.

## Build & Deployment

### Docker
```bash
docker-compose up -d        # Local dev with PostgreSQL + Redis + MinIO
docker-compose logs backend # View logs
```

### Production
- Backend: `npm run build` → `node dist/server.js`
- Frontend: `npm run build` → `npm start` (Next.js production server)
- Kubernetes manifests: `k8s/*.yaml`

See `DEPLOYMENT.md` for detailed K8s/cloud provider setup.

## Common Workflows

### Adding a New API Endpoint
1. Create `src/modules/{feature}/routes.ts` (or add to existing)
2. Define Zod schema for validation
3. Export `default async (app: FastifyInstance) => { app.post(...) }`
4. Register in `src/server.ts:67-76`
5. Test with `npm run dev` + API client

### Modifying Database Schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name {description}`
3. Review migration file in `prisma/migrations/`
4. Commit migration file (auto-applied in CI/CD)

### Adding a Puck Widget
1. Define config in `frontend/lib/puck/config.tsx`
2. Create component in `frontend/components/puck/`
3. Export from config with render function
4. Add to page editor automatically

## Conventions & Gotchas

- **Always use preHandler decorators** for auth: `{ preHandler: app.authenticate }`
- **Cache invalidation is manual**: Update handlers must call `app.redis.del(keys)`
- **Prisma Client generated** to `src/generated/prisma/client` (custom output_path)
- **Fastify plugins must use `fp()` wrapper** from `fastify-plugin`
- **JWT decorators extend `@fastify/jwt`**, not replace it (see `src/plugins/auth.ts:8-12`)
- **Multipart uploads:** Use `@fastify/multipart` → `req.file()` returns async iterator

## References

- API Docs: http://localhost:3001/docs (Swagger auto-generated)
- Health Check: http://localhost:3001/health
- Existing AI conventions: See `CLAUDE.md`, `IMPLEMENTATION_GUIDE.md`, docs/admin/ENDPOINTS.md
- Error codes: Defined per module (e.g., `USER_EXISTS`, `VALIDATION_ERROR`)
