# AI Prompt: Build Admin Portal for Existing Cloud Project Platform

## Context & Existing Platform Overview

You are tasked with building an **Admin Portal** for an existing multi-tenant portal management system. The platform already has:

### Current Architecture:
- **Backend**: Fastify + TypeScript + Prisma + PostgreSQL
- **Frontend**: Next.js 16 + React 19 + TypeScript + TailwindCSS
- **Database**: Multi-tenant PostgreSQL with row-level isolation via `portalId`
- **Authentication**: JWT-based with refresh tokens
- **File Storage**: Local/S3-compatible storage system
- **Page Builder**: Puck.js integration for visual page editing

### Existing Models & Infrastructure:
```typescript
// Key existing models (already implemented):
- Portal (multi-tenant isolation)
- User (with role-based access)
- Page (with Puck.js JSON content)
- Menu/MenuItem (hierarchical navigation)
- AssetContainer (theming & branding)
- StorageFile (file management)
- AuditLog (activity tracking)
```

### Current File Structure:
```
C:\Cloud Project\
├── src/ (Backend - Fastify API)
├── frontend/ (Next.js app with dashboard routes)
├── prisma/ (Database schema & migrations)
└── k8s/ (Kubernetes deployment configs)
```

## Mission: Implement Admin Portal Following Version 7.5 Plan

Build a comprehensive **Elementor-Pro-equivalent** admin portal with the following phased approach:

---

## Phase 1: Core Admin Foundation (MVP)

### 1.1 Portal Context & Security
**EXTEND existing middleware to support admin-level operations:**

```typescript
// Extend existing usePortalContext() hook
interface AdminPortalContext extends PortalContext {
  isAdmin: boolean;
  canManageUsers: boolean;
  canManageThemes: boolean;
  canAccessAnalytics: boolean;
}

// Add admin-specific middleware
const adminMiddleware = {
  requireSuperAdmin: () => // Cross-portal admin access
  requirePortalAdmin: () => // Portal-specific admin access
  auditAdminAction: () => // Enhanced audit logging
}
```

### 1.2 Enhanced Page Editor Integration
**BUILD ON existing Puck.js implementation:**

```typescript
// Extend existing Page model with admin features
interface AdminPageEditor extends PageEditor {
  globalTemplates: Template[];
  themeTokens: ThemeTokens;
  advancedWidgets: Widget[];
  customCSS: string;
  customJS: string;
}

// New components to build:
- <AdminPageBuilder /> // Enhanced version of existing PageBuilder
- <GlobalTemplateManager />
- <WidgetLibrary />
- <ThemeTokenEditor />
```

### 1.3 User Management Module
**EXTEND existing User model with admin capabilities:**

```typescript
// Add to existing Prisma schema:
model UserOnPortal {
  userId       String
  portalId     String
  assignedRole UserRole // ADMIN | EDITOR | VIEWER
  permissions  Json     // Granular permissions
  @@id([userId, portalId])
}

enum UserRole {
  SUPER_ADMIN    // Cross-portal access
  PORTAL_ADMIN   // Full portal access
  EDITOR         // Content management
  VIEWER         // Read-only
}
```

**Build admin UI components:**
- `<UserManagementTable />` - List/edit users
- `<RolePermissionEditor />` - Assign roles & permissions
- `<UserInviteModal />` - Invite new users
- `<BulkUserActions />` - Bulk operations

---

## Phase 2: Advanced Content Management

### 2.1 Theme Management System
**NEW module - integrate with existing AssetContainer:**

```typescript
// Extend existing AssetContainer model:
model Theme {
  id        String    @id @default(cuid())
  name      String
  portalId  String
  isActive  Boolean   @default(false)
  tokens    Json      // Design tokens
  // Link to existing AssetContainer
  assetContainerId String?
  assetContainer   AssetContainer?
}

// Design token structure:
interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    headingSizes: Record<string, string>;
    bodySize: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}
```

**Build theme management UI:**
- `<ThemeEditor />` - Visual theme token editor
- `<ColorPalettePicker />` - Color scheme management
- `<TypographyControls />` - Font & sizing controls
- `<ThemePreview />` - Live preview component
- `<ThemeLibrary />` - Pre-built theme templates

### 2.2 Enhanced Menu System
**EXTEND existing Menu/MenuItem models:**

```typescript
// Add to existing MenuItem model:
interface AdminMenuItem extends MenuItem {
  dynamicContent?: {
    type: 'user_pages' | 'categories' | 'custom_query';
    filter?: Json;
  };
  roleVisibility: UserRole[];
  conditionalDisplay: Json; // Show/hide based on user context
}
```

**Build advanced menu features:**
- `<DynamicMenuBuilder />` - Auto-populate menu items
- `<MenuRoleManager />` - Role-based menu visibility
- `<MenuAnalytics />` - Track menu usage
- `<MegaMenuDesigner />` - Complex menu layouts

### 2.3 Global Content Management
**NEW model for reusable content blocks:**

```typescript
model GlobalContent {
  id              String         @id @default(cuid())
  name            String         // e.g., "Main Footer", "Universal CTA"
  key             String         @unique // System key (e.g., "main_footer")
  content         Json           // Puck JSON for reusable block
  portalId        String
  category        String?        // Group related content
  isActive        Boolean        @default(true)
  
  @@unique([portalId, key])
}
```

**Build global content UI:**
- `<GlobalContentLibrary />` - Manage reusable blocks
- `<ContentBlockEditor />` - Edit global content with Puck
- `<ContentUsageTracker />` - See where content is used
- `<ContentVersioning />` - Version control for global content

---

## Phase 3: Advanced Features & Analytics

### 3.1 Analytics & Reporting Dashboard
**NEW analytics system:**

```typescript
model PageAnalytics {
  id          String   @id @default(cuid())
  pageId      String
  portalId    String
  views       Int      @default(0)
  uniqueViews Int      @default(0)
  avgTimeOnPage Float?
  bounceRate  Float?
  date        DateTime @default(now())
  
  @@unique([pageId, date])
}

model UserActivity {
  id           String   @id @default(cuid())
  userId       String
  portalId     String
  action       String   // 'page_view', 'edit', 'publish', etc.
  resourceType String
  resourceId   String?
  metadata     Json?
  timestamp    DateTime @default(now())
}
```

**Build analytics UI:**
- `<AnalyticsDashboard />` - Overview metrics
- `<PagePerformanceChart />` - Page-specific analytics
- `<UserActivityFeed />` - Real-time activity
- `<ContentPerformanceReport />` - Content effectiveness
- `<ExportReports />` - Data export functionality

### 3.2 Advanced Security & Compliance
**EXTEND existing security with admin features:**

```typescript
// Add to existing AuditLog model:
interface AdminAuditLog extends AuditLog {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'SECURITY' | 'CONTENT' | 'USER_MGMT' | 'SYSTEM';
  alertTriggered: boolean;
}

model SecurityAlert {
  id          String   @id @default(cuid())
  portalId    String
  type        String   // 'FAILED_LOGIN', 'PERMISSION_ESCALATION', etc.
  severity    String
  description String
  resolved    Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

**Build security management UI:**
- `<SecurityDashboard />` - Security overview
- `<AuditLogViewer />` - Enhanced audit log interface
- `<SecurityAlerts />` - Real-time security alerts
- `<PermissionAuditor />` - Review user permissions
- `<ComplianceReports />` - Generate compliance reports

### 3.3 System Administration
**NEW system-level management:**

```typescript
model SystemConfig {
  id       String @id @default(cuid())
  key      String @unique
  value    Json
  category String // 'SECURITY', 'PERFORMANCE', 'FEATURES'
  updatedBy String
  updatedAt DateTime @updatedAt
}

model BackupJob {
  id          String   @id @default(cuid())
  type        String   // 'FULL', 'INCREMENTAL'
  status      String   // 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
  startedAt   DateTime?
  completedAt DateTime?
  fileSize    BigInt?
  location    String?
}
```

**Build system admin UI:**
- `<SystemConfigPanel />` - System-wide settings
- `<BackupManager />` - Database backup management
- `<PerformanceMonitor />` - System performance metrics
- `<MaintenanceMode />` - System maintenance controls
- `<LogViewer />` - System log analysis

---

## Implementation Guidelines

### 1. **Preserve Existing Architecture**
- **DO NOT** modify existing database models without extending them
- **REUSE** existing API endpoints and extend with new admin routes
- **MAINTAIN** existing authentication and portal isolation
- **EXTEND** existing components rather than replacing them

### 2. **Follow Existing Patterns**
```typescript
// Follow existing route structure:
// src/modules/admin/ (new admin-specific routes)
// frontend/app/(portal)/admin/ (new admin UI routes)

// Extend existing hooks:
// lib/hooks/useAdminPortals.ts
// lib/hooks/useAdminUsers.ts
// lib/hooks/useAdminAnalytics.ts
```

### 3. **Security First**
- All admin routes must validate admin permissions
- Implement proper RBAC for all admin features
- Add comprehensive audit logging for admin actions
- Sanitize all admin inputs and outputs

### 4. **Performance Considerations**
- Implement pagination for all admin data tables
- Use React Query for efficient data fetching
- Add loading states and error boundaries
- Optimize database queries with proper indexing

### 5. **UI/UX Standards**
- Follow existing TailwindCSS design system
- Maintain consistency with current dashboard UI
- Implement responsive design for all admin interfaces
- Add proper accessibility features

---

## Specific Tasks to Complete

### Backend Tasks:
1. **Extend Prisma schema** with new admin models
2. **Create admin API routes** in `src/modules/admin/`
3. **Implement admin middleware** for permission checking
4. **Add admin-specific validation schemas**
5. **Create admin service layers** for business logic

### Frontend Tasks:
1. **Create admin layout** in `frontend/app/(portal)/admin/`
2. **Build admin dashboard** with key metrics
3. **Implement user management interface**
4. **Create theme management system**
5. **Build analytics and reporting UI**
6. **Add system administration panels**

### Database Tasks:
1. **Run new migrations** for admin models
2. **Create admin user seed data**
3. **Add database indexes** for admin queries
4. **Set up admin-specific constraints**

### Testing Tasks:
1. **Write admin API tests**
2. **Create admin UI component tests**
3. **Add admin E2E test scenarios**
4. **Test admin permission boundaries**

---

## Success Criteria

### Phase 1 Success:
- [ ] Admin users can manage portal users and roles
- [ ] Enhanced page editor with admin features works
- [ ] Basic theme management is functional
- [ ] Admin audit logging is implemented

### Phase 2 Success:
- [ ] Complete theme management system operational
- [ ] Advanced menu system with role-based visibility
- [ ] Global content management working
- [ ] Admin dashboard shows key metrics

### Phase 3 Success:
- [ ] Comprehensive analytics dashboard functional
- [ ] Security monitoring and alerts working
- [ ] System administration tools operational
- [ ] All admin features properly tested and documented

---

## Notes for Implementation

1. **Start with Phase 1** - build core admin foundation first
2. **Test thoroughly** - admin features affect entire platform
3. **Document everything** - admin features need comprehensive docs
4. **Consider scalability** - admin features should work across multiple portals
5. **Plan for maintenance** - admin tools should be easy to maintain and extend

This admin portal should transform the existing platform into a comprehensive, enterprise-ready portal management system with full administrative capabilities while maintaining the existing architecture and user experience.