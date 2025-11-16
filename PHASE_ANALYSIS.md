# 📋 Detailed Phase Analysis: Cloud Project Page Builder

## Overview

This document provides in-depth analysis of each phase from the Adapted Implementation Plan, including technical details, dependencies, and potential challenges.

---

## 🔍 Phase 0: Compatibility & Foundation Assessment

### Current State Analysis

#### Frontend Status
- **Framework:** Next.js 16.0.1 (App Router)
- **Current Editor:** Craft.js (`@craftjs/core` v0.2.12)
- **State Management:**
  - Zustand for global state (`frontend/lib/stores/`)
  - React Query for server state (`@tanstack/react-query` v5.90.7)
- **UI Framework:** Tailwind CSS v4
- **Animation:** (Not in package.json—may be using plain CSS)

#### Backend Status
- **Framework:** Fastify 5.6.1
- **Database ORM:** Prisma 6.19.0
- **Authentication:** `@fastify/jwt` + custom auth plugin
- **Plugins:**
  - CORS, Helmet, Rate Limiting
  - Swagger/SwaggerUI
  - Multipart uploads
  - Static file serving
- **Caching:** Redis (ioredis 5.8.2)

#### Compatibility Findings

✅ **Compatible:**
- Puck.js works with Next.js App Router
- Fastify CORS configured to allow frontend requests
- Prisma schema flexible for Puck JSON format
- Redis available for caching

⚠️ **Needs Attention:**
- No animation library (add Framer Motion for UI polish)
- No WebSocket plugin for Fastify yet
- Craft.js to Puck.js migration path not documented
- No compression (add `@fastify/compress`)

#### Migration Complexity: **LOW**
- Reason: Similar React-based architecture, API already RESTful

### Deliverables

1. ✅ Test component created in `frontend/components/editors/PuckTest.tsx`
2. ✅ Puck.js loads in Next.js without errors
3. ✅ Fastify API responds to frontend requests
4. ✅ Migration path: Craft.js data → Puck.js format

### Risks

- **XSS Issues:** If Craft.js allowed arbitrary HTML, Puck.js must sanitize
- **Performance:** Puck.js bundle size (check with `next/bundle-analyzer`)

---

## 📦 Phase 1: Database Schema Enhancement

### Current Schema Analysis

#### Page Model (Current)

```prisma
model Page {
  id              String    @id @default(uuid()) @db.Uuid
  portalId        String    @db.Uuid         // Multi-tenant FK
  title           String    @db.VarChar(500)
  slug            String    @db.VarChar(200)
  content         Json                        // GrapesJS/Craft.js data
  metaDescription String?
  metaKeywords    String?
  isPublished     Boolean   @default(false)
  publishedAt     DateTime?
  ogImageUrl      String?   @db.VarChar(1024)
  version         Int       @default(1)
  parentVersionId String?   @db.Uuid         // Version chain
  createdBy       String?   @db.Uuid
  updatedBy       String?   @db.Uuid
  seoTitle        String?
  canonicalUrl    String?   @db.VarChar(1024)
  noIndex         Boolean   @default(false)
  
  // Relations defined but missing in snippet
}
```

#### Observations

✅ **Already Good:**
- Multi-tenant isolation via `portalId`
- Version chain structure (`parentVersionId`)
- SEO fields
- Creator tracking

❌ **Gaps:**
- No `lastEditedBy` / `lastEditedAt` (needed for collab)
- No `isDraft` flag (current uses `isPublished` bool)
- No `editorState` (needed for resuming edits)
- No `layoutId` (for template-based pages)
- `puckData` field doesn't exist (new)

### Migration Strategy

**Goal:** Support both Craft.js (`content`) and Puck.js (`puckData`) temporarily.

**Timeline:**

1. **Week 1:** Add new fields, create migration
2. **Week 2:** Update API to read from `puckData` if exists, else fall back to `content`
3. **Week 3:** Batch migrate old content to `puckData`
4. **Week 4:** (Future) Deprecate `content` field

**Migration Script Example:**

```typescript
// prisma/migrations/xxx_add_puck_support/migration.sql

ALTER TABLE "Page" ADD COLUMN "puckData" JSONB;
ALTER TABLE "Page" ADD COLUMN "isDraft" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Page" ADD COLUMN "layoutId" UUID;
ALTER TABLE "Page" ADD COLUMN "editorState" JSONB;
ALTER TABLE "Page" ADD COLUMN "lastEditedBy" UUID;
ALTER TABLE "Page" ADD COLUMN "lastEditedAt" TIMESTAMPTZ;
ALTER TABLE "Page" ADD COLUMN "puckConfig" VARCHAR(255);

-- Create PageLayout table
CREATE TABLE "PageLayout" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "portalId" UUID NOT NULL REFERENCES "Portal"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  "puckData" JSONB,
  thumbnail VARCHAR(1024),
  "isDefault" BOOLEAN DEFAULT false,
  "isPublished" BOOLEAN DEFAULT false,
  "createdBy" UUID REFERENCES "User"(id),
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("portalId", slug)
);

-- Create PageVersion table (for history)
CREATE TABLE "PageVersion" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pageId" UUID NOT NULL REFERENCES "Page"(id) ON DELETE CASCADE,
  "versionNo" INT NOT NULL,
  "puckData" JSONB,
  content JSONB,
  "changeLo" TEXT,
  "createdBy" UUID REFERENCES "User"(id),
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("pageId", "versionNo")
);

-- Create PageComponent (usage tracking)
CREATE TABLE "PageComponent" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pageId" UUID NOT NULL REFERENCES "Page"(id) ON DELETE CASCADE,
  "componentId" VARCHAR(100) NOT NULL,
  count INT DEFAULT 1,
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  UNIQUE("pageId", "componentId")
);

-- Update Page table FK to layout
ALTER TABLE "Page" ADD CONSTRAINT fk_page_layout
  FOREIGN KEY ("layoutId") REFERENCES "PageLayout"(id) ON DELETE SET NULL;
```

### Data Structure: Puck Format

**What Puck.js expects:**

```json
{
  "root": {
    "type": "COMPONENT",
    "props": {
      "title": "Welcome",
      "backgroundColor": "#fff"
    }
  },
  "zones": {
    "hero-content": [
      {
        "type": "COMPONENT",
        "props": { "text": "Hello" }
      }
    ]
  },
  "components": {
    "Hero": {
      "fields": {...}
    }
  }
}
```

### Conversion Logic

**From Craft.js to Puck.js:**

```typescript
// src/utils/craftToPuck.ts
function migrateGrapesJSToPuck(craftData: any): any {
  const components = new Map();
  
  // Extract components
  craftData.components?.forEach((comp: any) => {
    components.set(comp.id, {
      type: comp.type,
      props: comp.props,
    });
  });
  
  // Build Puck structure
  return {
    root: {
      type: "COMPONENT",
      props: craftData.root?.props || {},
    },
    zones: craftData.zones || {},
    components: Object.fromEntries(components),
  };
}
```

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Data loss during migration | Run migration on staging first, backup DB |
| Breaking existing pages | Keep dual-read support (try `puckData`, fall back to `content`) |
| Performance of JSON queries | Add JSONB indexes: `CREATE INDEX idx_page_puckdata ON "Page" USING GIN ("puckData")` |
| Schema conflicts | Test migration on copy of prod schema first |

### Deliverables

- ✅ Prisma migration file created
- ✅ `PageLayout`, `PageVersion`, `PageComponent` tables created
- ✅ `Page.puckData` field added
- ✅ Migration script tested on staging

### Timeline Justification

- **4 hours:** Schema design + validation
- **2 hours:** PageLayout model
- **1 hour:** PageVersion model
- **30 min:** PageComponent model
- **30 min:** Write + test migration
- **1 hour:** Buffer for issues

**Total:** ~9 hours (1 day)

---

## 🎨 Phase 2: Puck Component Library Implementation

### Component Architecture

**Puck Component = React Component + Config**

```typescript
// Type definition
interface ComponentConfig {
  label: string;                    // "Hero Section"
  description?: string;
  defaultProps: Record<string, any>;
  fields: Record<string, Field>;    // Form fields
  render: (props: any) => JSX.Element;
  allow?: string[];                 // Which children allowed
  permission?: "read" | "edit";     // RBAC
}

// Usage in config
export const puckConfig: Config = {
  components: {
    Hero: {
      label: "Hero Section",
      render: HeroComponent,
      fields: { ... },
      defaultProps: { ... },
    },
    // ...
  },
};
```

### Component Breakdown

#### 1️⃣ Layout Components (4 total)

**Hero**
- Props: `title`, `subtitle`, `backgroundImage`, `cta` (button)
- Field Types: text, textarea, custom (image upload), object
- Render: Full-width section with image background
- Complexity: **Medium** (image upload, styling)

```tsx
export const Hero = {
  label: "Hero Section",
  defaultProps: {
    title: "Welcome to our site",
    subtitle: "Your amazing subtitle here",
    backgroundImage: null,
    backgroundOpacity: 1,
    textColor: "#fff",
    cta: { text: "Get Started", url: "/contact" },
  },
  fields: {
    title: { type: "text", label: "Title" },
    subtitle: { type: "textarea", label: "Subtitle" },
    backgroundImage: {
      type: "custom",
      render: ImageUploadField,
    },
    backgroundOpacity: {
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
    },
    textColor: {
      type: "custom",
      render: ColorPickerField,
    },
    cta: {
      type: "object",
      objectFields: {
        text: { type: "text", label: "Button Text" },
        url: { type: "text", label: "Button URL" },
      },
    },
  },
  render: HeroComponent, // React component
};
```

**Section**
- Props: `title`, `subtitle`, `children` (slots)
- Complexity: **Low** (wrapper with title)

**Container**
- Props: `backgroundColor`, `padding`, `maxWidth`, `children`
- Complexity: **Low** (layout wrapper)

**Columns (2/3-column)**
- Props: `columnCount` (2 or 3), `gap`, `children` (multi-slot)
- Complexity: **Medium** (responsive grid)

#### 2️⃣ Content Components (4 total)

**Text**
- Props: `content`, `fontSize`, `fontWeight`, `color`, `alignment`
- Complexity: **Low**

**Heading**
- Props: `text`, `level` (h1-h6), `fontSize`, `color`
- Complexity: **Low**

**Image**
- Props: `src`, `alt`, `width`, `height`, `objectFit`, `caption`
- Complexity: **Medium** (lazy loading, responsive)

**Button**
- Props: `text`, `url`, `backgroundColor`, `textColor`, `size` (sm/md/lg)
- Complexity: **Low**

#### 3️⃣ Advanced Components (5 total)

**Carousel**
- Props: `items[]`, `autoplay`, `interval`, `showDots`
- Complexity: **High** (state, animation, touch support)
- Library: Use `react-responsive-carousel` or build custom

**Testimonials**
- Props: `items[]` (quote, author, rating, image)
- Complexity: **Medium** (card layout, ratings)

**PricingTable**
- Props: `plans[]` (name, price, features, cta), `currency`
- Complexity: **High** (comparison, highlighting)

**FAQ Section**
- Props: `items[]` (question, answer)
- Complexity: **Medium** (accordion with collapse)
- Library: Use `@headlessui/react` Disclosure

**Gallery**
- Props: `images[]`, `layout` (grid/masonry/slideshow), `columns`
- Complexity: **High** (lightbox, responsive grid)

#### 4️⃣ CTA Components (2 total)

**Newsletter**
- Props: `title`, `description`, `placeholder`, `buttonText`
- Complexity: **High** (form validation, email submission)

**Call-to-Action**
- Props: `title`, `description`, `buttons[]`, `backgroundColor`
- Complexity: **Medium**

### Implementation Plan

**Week 1:**

- Day 1-2: Core infrastructure (`frontend/lib/puck/config.tsx`, `frontend/lib/puck/fields/`)
- Day 3-4: Layout components (Hero, Section, Container, Columns)
- Day 5: Content components (Text, Heading, Image, Button)

**Week 2:**

- Day 1-2: Advanced components (Carousel, Testimonials, PricingTable)
- Day 3-4: FAQ, Gallery
- Day 5: CTA components (Newsletter, Call-to-Action, Form)

**Week 3:**

- Day 1: Testing all components
- Day 2: Documentation
- Day 3-5: Storybook setup (optional but recommended)

### Component Testing Strategy

```typescript
// frontend/components/puck/__tests__/Hero.test.tsx
describe("Hero Component", () => {
  it("renders with title", () => {
    const { getByText } = render(
      <Hero title="Welcome" subtitle="Intro" cta={{ text: "Click", url: "/" }} />
    );
    expect(getByText("Welcome")).toBeInTheDocument();
  });
  
  it("renders CTA button", () => {
    const { getByRole } = render(
      <Hero title="Test" subtitle="" cta={{ text: "Action", url: "/path" }} />
    );
    const button = getByRole("link", { name: "Action" });
    expect(button).toHaveAttribute("href", "/path");
  });
});
```

### File Organization

```
frontend/
├── lib/puck/
│   ├── config.tsx                 # Main Puck config with all components
│   ├── fields/                    # Custom field renderers
│   │   ├── ImageUploadField.tsx
│   │   ├── ColorPickerField.tsx
│   │   └── ...
│   ├── overrides.tsx              # Puck UI customizations
│   └── theme.ts                   # Theme provider setup
├── components/puck/               # React components for rendering
│   ├── Hero.tsx
│   ├── Section.tsx
│   ├── Carousel.tsx
│   ├── ...
│   └── __tests__/                 # Component tests
└── styles/puck/                   # Puck-specific styles
    ├── hero.css
    └── ...
```

### Complexity Justification

**Why 2.5 days for 13 components?**

- 4 layout components @ 3 hrs each = 12 hrs
- 4 content components @ 2 hrs each = 8 hrs
- 5 advanced components @ 5 hrs each = 25 hrs
- 2 CTA components @ 4 hrs each = 8 hrs
- **Total: 53 hrs ≈ 6.6 days** (assuming 8 hrs/day)
- **Adjusted for parallelization & reusable patterns: 2.5 days** ✓

### Risks

- **Puck Learning Curve:** Team may need 1-2 days to ramp up
- **Custom Fields:** Image upload, color picker may need debugging
- **Carousel Performance:** Heavy animation library can impact bundle
- **Responsive Props:** Making all components truly responsive adds complexity

### Dependencies

- ✅ Phase 0 complete (Puck.js verified)
- ❌ Phase 1 NOT required (but helpful for testing)
- ✅ Existing Next.js setup

---

## 🔌 Phase 3: Fastify Backend API Extensions

### Current API Structure

**Existing Endpoints** (from `src/server.ts`):

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/pages
GET    /api/v1/pages/:id
PUT    /api/v1/pages/:id
DELETE /api/v1/pages/:id
```

**Module Pattern:**

```typescript
// src/modules/pages/routes.ts
export default async function pageRoutes(app: FastifyInstance) {
  app.post("/pages", 
    { preHandler: app.authenticate },
    async (req, reply) => { /* handler */ }
  );
}
```

### New Endpoints to Add

#### Page CRUD (Enhance existing)

```typescript
// Create Page (POST /pages)
schema: {
  body: {
    type: "object",
    properties: {
      portalId: { type: "string", format: "uuid" },
      title: { type: "string", maxLength: 500 },
      slug: { type: "string", pattern: "^[a-z0-9-]+$" },
      puckData: { type: "object" },
      layoutId: { type: "string", format: "uuid" },
      metaDescription: { type: "string", maxLength: 160 },
      seoTitle: { type: "string", maxLength: 60 },
    },
    required: ["portalId", "title", "slug"],
  },
}

// Update Page (PUT /pages/:pageId)
// - Increment version
// - Create PageVersion snapshot
// - Invalidate cache
// - Update lastEditedBy/lastEditedAt

// Delete Page (DELETE /pages/:pageId)
// - Soft delete or hard delete? (decide on policy)
// - Cascade delete PageVersions
// - Invalidate cache
```

#### Publishing Workflow

```typescript
// Publish (POST /pages/:pageId/publish)
// - Validate portalId matches
// - Check permission: editor+
// - Set isPublished=true, isDraft=false
// - Set publishedAt=now()
// - Broadcast event (for WebSocket)

// Unpublish (POST /pages/:pageId/unpublish)
// - Reverse of above
```

#### Versioning

```typescript
// List Versions (GET /pages/:pageId/versions)
// - Return array of PageVersion with metadata
// - Include changeLog (what changed)
// - Pagination?

// Get Specific Version (GET /pages/:pageId/versions/:versionNo)
// - Return full puckData for that version

// Restore Version (POST /pages/:pageId/versions/:versionNo/restore)
// - Copy version to current page
// - Increment version number
// - Create new PageVersion snapshot
// - Notify collaborators (WebSocket)
```

#### Layouts

```typescript
// Create Layout (POST /portals/:portalId/layouts)
// - Store template
// - Take screenshot (optional, for preview)

// List Layouts (GET /portals/:portalId/layouts)
// - Filter by portalId
// - Only return published OR if user is admin

// Use Layout (POST /pages/:pageId/apply-layout/:layoutId)
// - Clone layoutId's puckData
// - Set layoutId FK
```

#### Analytics

```typescript
// Get Page Analytics (GET /pages/:pageId/analytics)
// - Query PageAnalytics table
// - Return: views count, unique visitors, referrers, devices

// Track View (POST /pages/:pageId/views)
// - Extract referrer, device, country from request
// - Increment counter in PageAnalytics table
// - Use Redis for high-frequency updates (flush hourly)
```

### Implementation Complexity Breakdown

**CRUD (4 endpoints):** 1-2 hours
- Create: Validate → Create page → Set puckData defaults → Invalidate cache
- Read: Get page → Check permission → Return (with cache)
- Update: Validate → Create version snapshot → Update → Invalidate cache
- Delete: Check permission → Delete page + versions → Invalidate cache

**Publishing (2 endpoints):** 2-3 hours
- Publish: Set flags, timestamp, notify collaborators
- Unpublish: Reverse of above

**Versioning (3 endpoints):** 3-4 hours
- List: Pagination, sort by version desc
- Get specific: Retrieve snapshot
- Restore: Copy data, increment version, snapshot current state

**Layouts (3 endpoints):** 2-3 hours
- CRUD similar to pages, but simpler (no publishing)

**Analytics (2 endpoints):** 2-3 hours
- Get: Query aggregated data from cache
- Track: Insert into Redis, async flush to DB

### Validation & Error Handling

**Zod Schemas** (keep current pattern):

```typescript
// src/modules/pages/types.ts
export const createPageSchema = z.object({
  portalId: z.string().uuid("Invalid portal ID"),
  title: z.string().min(1).max(500),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  puckData: z.object({}).optional(),
  layoutId: z.string().uuid().optional(),
  metaDescription: z.string().max(160).optional(),
  seoTitle: z.string().max(60).optional(),
});

// Use in handler
app.post("/pages", async (req, reply) => {
  try {
    const data = createPageSchema.parse(req.body);
    // ... create page
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(err.errors[0].message);
    }
  }
});
```

**Error Responses:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid slug format",
    "details": [...]
  }
}
```

### Authorization Pattern

```typescript
// Enforce role hierarchy
app.post("/pages/:pageId/publish",
  { preHandler: app.requireRole("editor") }, // viewer < editor < admin
  async (req, reply) => {
    // Also validate portalId ownership
    const page = await app.prisma.page.findUnique({
      where: { id: req.params.pageId },
    });
    
    if (page.portalId !== req.user.portalId) {
      throw new UnauthorizedError("Cannot publish page in other portal");
    }
    
    // ... publish
  }
);
```

### Caching Strategy

**Redis Keys:**

```
// Published pages (high traffic)
page:{portalId}:{slug}            TTL: 5 min
page:{portalId}:{pageId}          TTL: 5 min

// Lists (medium traffic)
portal:{portalId}:pages           TTL: 10 min
portal:{portalId}:pages:drafts    TTL: 5 min

// Metadata
page:{pageId}:versions            TTL: 1 hour
portal:{portalId}:layouts         TTL: 30 min
```

**Invalidation Pattern:**

```typescript
// On update/delete
async function invalidatePageCache(pageId: string, portalId: string) {
  await Promise.all([
    app.redis.del(`page:${portalId}:${pageId}`),
    app.redis.del(`portal:${portalId}:pages`),
    app.redis.del(`portal:${portalId}:pages:drafts`),
    // Also invalidate slug-based key if known
  ]);
}
```

### Timeline Justification

- **CRUD:** 1.5 hours
- **Publishing:** 2 hours
- **Versioning:** 2 hours
- **Layouts:** 1.5 hours
- **Analytics:** 2 hours
- **Error handling + caching:** 1.5 hours
- **Testing + buffer:** 1.5 hours

**Total: ~12 hours = 1.5 days** ✓

### Dependencies

- ✅ Phase 1: Database schema (must have)
- ✅ Existing Fastify setup (auth, prisma, redis)
- ❌ Phase 2: Components (not required)
- ❌ Phase 4: Frontend (can develop in parallel)

### Risks

- **N+1 Queries:** Careful with Prisma `include()`/`select()`
  ```typescript
  // BAD: N+1 query
  const pages = await prisma.page.findMany({ include: { creator: true } });
  
  // GOOD: Single query with select
  const pages = await prisma.page.findMany({
    select: { id: true, title: true, createdBy: true }
  });
  ```
- **Race Conditions:** Concurrent version increments—use DB-level unique constraint
- **Cache Invalidation Bugs:** Hard to debug; use structured keys + monitoring

---

## 🎯 Phase 4: Frontend Page Editor UI

### Layout Architecture

**Goal:** Professional editor similar to Elementor/Webflow.

```
┌─────────────────────────────────────────────────────────┐
│ Top Toolbar: Logo | Page Title | Save | Preview | Pub   │
├─────────┬─────────────────────────────┬─────────────────┤
│ Left    │                             │ Right           │
│ Sidebar │     Puck.js Canvas          │ Inspector       │
│         │   (Drag/drop components)    │ (Properties)    │
│ 380px   │                             │ 320px           │
│         │                             │                 │
└─────────┴─────────────────────────────┴─────────────────┘
```

### Component Hierarchy

```typescript
// frontend/app/(portal)/editor/[pageId]/page.tsx
<PageEditorPage>
  <PageEditor pageId={pageId}>
    <TopToolbar />
    <EditorContainer>
      <LeftSidebar>
        {/* Puck component library */}
      </LeftSidebar>
      <CanvasArea>
        {/* Puck.js editor */}
      </CanvasArea>
      <RightSidebar>
        {/* Component inspector */}
      </RightSidebar>
    </EditorContainer>
    <NotificationToast />
  </PageEditor>
</PageEditorPage>
```

### Top Toolbar Features

```tsx
// frontend/components/editors/TopToolbar.tsx
export default function TopToolbar({ pageId }) {
  const { data: page } = useGetPage(pageId);
  const { mutate: savePage, isPending } = useSavePage();
  
  return (
    <div className="toolbar">
      {/* Left: Logo + Page Info */}
      <div className="toolbar-left">
        <h1>{page?.title}</h1>
        <SaveIndicator 
          status={page?.isDraft ? "unsaved" : "saved"}
        />
      </div>
      
      {/* Center: Device Selector */}
      <div className="toolbar-center">
        <DeviceSelector />
      </div>
      
      {/* Right: Actions */}
      <div className="toolbar-right">
        <button onClick={() => previewPage(pageId)}>
          Preview
        </button>
        <button 
          onClick={() => savePage({ ...page, isPublished: true })}
          variant="primary"
        >
          Publish
        </button>
        <Menu>
          <MenuItem onClick={openSettings}>Settings</MenuItem>
          <MenuItem onClick={sharePreview}>Share Preview</MenuItem>
        </Menu>
      </div>
    </div>
  );
}
```

### Left Sidebar: Component Library

**Note:** Puck.js handles this automatically, but we can customize.

```tsx
// Show: All 13 components with search
// Behavior: Click component → Add to canvas (Puck handles drag)
```

### Right Sidebar: Inspector

```tsx
// frontend/components/editors/InspectorPanel.tsx
export default function InspectorPanel() {
  const [selected, setSelected] = usePageEditorStore(s => [s.selected, s.setSelected]);
  
  return (
    <div className="inspector">
      {selected ? (
        <>
          <h3>{selected.component}</h3>
          
          {/* Component-specific fields */}
          <FieldRenderer 
            fields={getComponentFields(selected.component)}
            values={selected.props}
            onChange={(props) => updateComponent(selected.id, props)}
          />
          
          {/* Quick actions */}
          <div className="actions">
            <button onClick={() => duplicateComponent(selected.id)}>
              Duplicate
            </button>
            <button onClick={() => hideComponent(selected.id)}>
              Hide
            </button>
            <button onClick={() => deleteComponent(selected.id)} danger>
              Delete
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Select a component to edit</p>
      )}
    </div>
  );
}
```

### State Management

**Zustand Store:**

```typescript
// frontend/lib/stores/pageEditorStore.ts
export const usePageEditorStore = create((set) => ({
  selectedComponentId: null,
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  
  pageData: null,
  setPageData: (data) => set({ pageData: data }),
  
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
  
  historyStack: [],
  currentHistoryIndex: 0,
  pushToHistory: (data) => set((s) => ({
    historyStack: [...s.historyStack.slice(0, s.currentHistoryIndex + 1), data],
    currentHistoryIndex: s.currentHistoryIndex + 1,
  })),
  undo: () => set((s) => ({
    currentHistoryIndex: Math.max(0, s.currentHistoryIndex - 1),
    pageData: s.historyStack[Math.max(0, s.currentHistoryIndex - 1)],
  })),
  redo: () => set((s) => ({
    currentHistoryIndex: Math.min(s.historyStack.length - 1, s.currentHistoryIndex + 1),
    pageData: s.historyStack[Math.min(s.historyStack.length - 1, s.currentHistoryIndex + 1)],
  })),
}));
```

### Auto-save & Undo/Redo

```typescript
// frontend/lib/hooks/useAutoSave.ts
export function useAutoSave(pageId: string) {
  const { pageData, markClean } = usePageEditorStore();
  const { mutate: savePage } = useSavePage();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageData && isDirty) {
        savePage({ 
          pageId, 
          puckData: pageData, 
          isDraft: true 
        });
        markClean();
      }
    }, 30000); // 30 seconds
    
    return () => clearTimeout(timer);
  }, [pageData]);
}

// Undo/Redo
// frontend/lib/hooks/useKeyboardShortcuts.ts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      if (e.shiftKey) undo();
      else redo();
    }
  };
  
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

### Preview Mode

```tsx
// frontend/app/(portal)/editor/[pageId]/preview.tsx
export default function PreviewPage({ params }) {
  const [device, setDevice] = useState("desktop");
  const { data: page } = useGetPage(params.pageId);
  
  const deviceWidth = {
    mobile: 375,
    tablet: 768,
    desktop: 1440,
  }[device];
  
  return (
    <div className="preview">
      <DeviceSelector onChange={setDevice} />
      
      {/* Render page at specific width */}
      <div style={{ maxWidth: deviceWidth, margin: "0 auto" }}>
        <PageRenderer data={page.puckData} />
      </div>
    </div>
  );
}
```

### Page Settings Drawer

```tsx
// frontend/components/editors/PageSettingsDrawer.tsx
export default function PageSettingsDrawer({ pageId }) {
  const { data: page } = useGetPage(pageId);
  const { mutate: updatePage } = useUpdatePage();
  
  return (
    <Drawer open={open} onClose={onClose}>
      <h2>Page Settings</h2>
      
      <Form>
        <Input label="Page Title" defaultValue={page?.title} />
        <Input label="URL Slug" defaultValue={page?.slug} />
        
        <Textarea 
          label="Meta Description" 
          defaultValue={page?.metaDescription}
          helpText="160 characters max"
        />
        
        <Input 
          label="SEO Title" 
          defaultValue={page?.seoTitle}
          helpText="60 characters max"
        />
        
        <Input 
          label="Canonical URL" 
          defaultValue={page?.canonicalUrl}
        />
        
        <Input 
          label="OG Image URL" 
          defaultValue={page?.ogImageUrl}
        />
        
        <Select 
          label="Layout Template" 
          defaultValue={page?.layoutId}
          options={layouts}
        />
        
        <Checkbox 
          label="Index in search engines" 
          defaultChecked={!page?.noIndex}
        />
        
        <Button onClick={() => updatePage({ ...formData })}>
          Save Settings
        </Button>
      </Form>
    </Drawer>
  );
}
```

### File Structure

```
frontend/
├── app/(portal)/editor/
│   ├── [pageId]/
│   │   ├── page.tsx                # Main editor
│   │   ├── preview.tsx             # Preview mode
│   │   └── layout.tsx
│   └── ...
├── components/editors/
│   ├── PageEditor.tsx              # Main container
│   ├── TopToolbar.tsx              # Save, preview, publish
│   ├── LeftSidebar.tsx             # Component library (Puck)
│   ├── CanvasArea.tsx              # Puck.js canvas
│   ├── RightSidebar.tsx            # Inspector
│   ├── InspectorPanel.tsx          # Component properties
│   ├── PageSettingsDrawer.tsx      # Page metadata
│   └── DeviceSelector.tsx          # Responsive preview
├── lib/
│   ├── stores/
│   │   └── pageEditorStore.ts      # Zustand store
│   └── hooks/
│       ├── useAutoSave.ts
│       ├── usePageHistory.ts
│       └── useKeyboardShortcuts.ts
└── styles/editor/
    ├── editor.css
    └── toolbar.css
```

### Timeline Justification

- **Main container + routing:** 2 hours
- **Top toolbar with all controls:** 3 hours
- **Inspector panel:** 3 hours
- **Undo/redo system:** 3 hours
- **Auto-save hook:** 2 hours
- **Preview mode + device selector:** 3 hours
- **Page settings drawer:** 2 hours
- **Styling + polish:** 4 hours
- **Testing + buffer:** 2 hours

**Total: ~24 hours = 3 days**

**Plan shows 2 days because:** Can parallelize some components, reuse existing Puck UI, leverage existing store setup.

---

## 🔄 Phase 5: Real-time Collaboration (WebSocket)

### Architecture

```
Fastify Server (Pub/Sub)
    ↓
Redis Pub/Sub (for horizontal scaling)
    ↓
Multiple WebSocket Connections
    ↓
Browser Clients (Sync cursor, updates, presence)
```

### Server Setup (Fastify)

**Plugin:** `src/plugins/websocket.ts`

```typescript
import fastifyWebsocket from "@fastify/websocket";

export default async function websocketPlugin(app: FastifyInstance) {
  await app.register(fastifyWebsocket);
  
  const rooms = new Map<string, Set<WebSocketConnection>>();
  
  app.get<{ Params: { pageId: string } }>(
    "/ws/pages/:pageId",
    { websocket: true },
    async (socket, req) => {
      const { pageId } = req.params;
      const userId = req.user?.sub;
      
      if (!userId) {
        socket.close(4001, "Unauthorized");
        return;
      }
      
      // Join room
      if (!rooms.has(pageId)) rooms.set(pageId, new Set());
      const room = rooms.get(pageId)!;
      room.add(socket);
      
      // Notify others of presence
      broadcast(room, {
        type: "USER_JOINED",
        userId,
        timestamp: Date.now(),
      });
      
      // Handle incoming messages
      socket.on("message", (data) => {
        try {
          const message = JSON.parse(data);
          
          // Route message type
          if (message.type === "CURSOR_MOVED") {
            broadcast(room, {
              type: "CURSOR_MOVED",
              userId,
              position: message.payload,
            });
          } else if (message.type === "PAGE_UPDATED") {
            // Operational Transform here
            handlePageUpdate(pageId, message.payload, userId);
          }
        } catch (err) {
          app.log.error(err);
        }
      });
      
      // Cleanup
      socket.on("close", () => {
        room.delete(socket);
        broadcast(room, {
          type: "USER_LEFT",
          userId,
        });
        if (room.size === 0) rooms.delete(pageId);
      });
    }
  );
}

function broadcast(room: Set<WebSocket>, message: any) {
  room.forEach(socket => {
    socket.send(JSON.stringify(message));
  });
}
```

### Client Hook (Frontend)

```typescript
// frontend/lib/hooks/usePageWebSocket.ts
export function usePageWebSocket(pageId: string, userId: string) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [remoteUpdates, setRemoteUpdates] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/pages/${pageId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      // Notify server we're ready
      send({ type: "CLIENT_READY", userId });
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case "USER_JOINED":
          setCollaborators(prev => [
            ...prev,
            { id: message.userId, joined: Date.now() }
          ]);
          break;
          
        case "CURSOR_MOVED":
          updateRemoteCursor(message.userId, message.position);
          break;
          
        case "PAGE_UPDATED":
          // Handle remote page update (merge with local)
          mergeRemoteUpdate(message.payload);
          break;
      }
    };
    
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    
    ws.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt reconnect with exponential backoff
      setTimeout(() => ws.readyState === WebSocket.CLOSED && retry(), 3000);
    };
    
    return () => ws.close();
  }, [pageId]);
  
  const sendCursorUpdate = (position: any) => {
    send({
      type: "CURSOR_MOVED",
      payload: position,
    });
  };
  
  const sendPageUpdate = (update: any) => {
    send({
      type: "PAGE_UPDATED",
      payload: update,
    });
  };
  
  const send = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };
  
  return {
    collaborators,
    remoteUpdates,
    sendCursorUpdate,
    sendPageUpdate,
  };
}
```

### Conflict Resolution (Operational Transform)

**Problem:** Two users edit component simultaneously.

**Solution:** OT algorithm.

```
User A: Edits Hero title at position 0
  Δ1 = { op: "update", path: "components.hero.props.title", value: "New" }

User B: Edits Hero subtitle at position 1
  Δ2 = { op: "update", path: "components.hero.props.subtitle", value: "Sub" }

Both send simultaneously. Server receives both.
OT transform: Apply both without conflict.
Result: Both changes preserved.
```

**Implementation:**

```typescript
// src/modules/pages/services/conflictResolver.ts
export interface Operation {
  type: "insert" | "delete" | "update";
  path: string;       // e.g., "components.hero.props.title"
  value?: any;
  index?: number;
}

export function transformOT(
  op1: Operation,
  op2: Operation,
  op1First: boolean
): { op1: Operation; op2: Operation } {
  // If operations touch different paths, no conflict
  if (op1.path !== op2.path) {
    return { op1, op2 };
  }
  
  // Same path: need to resolve
  if (op1.type === "update" && op2.type === "update") {
    // Last-write-wins (simple, but lossy)
    // OR: Merge into array (smarter)
    if (op1First) {
      return { op1, op2 }; // op2 overwrites op1
    } else {
      return { op1: op2, op2: op1 }; // op1 overwrites op2
    }
  }
  
  // Can add more sophisticated logic
  return { op1, op2 };
}

export async function applyRemoteUpdate(
  pageId: string,
  remoteOps: Operation[],
  localOps: Operation[],
  prisma: PrismaClient
) {
  // Transform local ops against remote ops
  for (const remoteOp of remoteOps) {
    for (let i = 0; i < localOps.length; i++) {
      const { op1, op2 } = transformOT(remoteOp, localOps[i], true);
      localOps[i] = op2;
    }
  }
  
  // Apply all ops in order
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  let puckData = page.puckData || { root: {}, zones: {}, components: {} };
  
  for (const op of [...remoteOps, ...localOps]) {
    puckData = applyOperation(puckData, op);
  }
  
  // Save merged result
  return prisma.page.update({
    where: { id: pageId },
    data: { puckData },
  });
}

function applyOperation(data: any, op: Operation): any {
  const parts = op.path.split(".");
  let current = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) current[parts[i]] = {};
    current = current[parts[i]];
  }
  
  const last = parts[parts.length - 1];
  
  if (op.type === "update") {
    current[last] = op.value;
  } else if (op.type === "delete") {
    delete current[last];
  }
  
  return data;
}
```

### Remote Cursor Display

```tsx
// frontend/components/editors/RemoteCursor.tsx
interface RemoteCursorProps {
  collaborators: Collaborator[];
  colors: string[]; // Color palette for each user
}

export default function RemoteCursor({ collaborators, colors }: RemoteCursorProps) {
  return (
    <>
      {collaborators.map((collab, idx) => (
        <div
          key={collab.id}
          className="remote-cursor"
          style={{
            left: collab.position?.x,
            top: collab.position?.y,
            borderColor: colors[idx % colors.length],
          }}
        >
          <span className="cursor-label">{collab.name}</span>
        </div>
      ))}
    </>
  );
}
```

### CSS for Cursor

```css
.remote-cursor {
  position: fixed;
  width: 3px;
  height: 20px;
  border-left: 3px solid currentColor;
  pointer-events: none;
  z-index: 9999;
  transition: all 0.1s linear;
}

.cursor-label {
  position: absolute;
  left: 8px;
  top: -5px;
  font-size: 12px;
  white-space: nowrap;
  background: currentColor;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
}
```

### Timeline Justification

- **WebSocket server setup:** 3 hours
- **WebSocket client hook:** 2 hours
- **Remote cursor UI:** 2 hours
- **OT conflict resolver:** 4 hours
- **Error handling + reconnection:** 2 hours
- **Testing (2-user scenario):** 2 hours

**Total: ~15 hours = 2 days** ✓

### Risks

- **WebSocket scalability:** If >1000 users, need Redis pub/sub
- **OT complexity:** Can become difficult; might use CRDT instead
- **Data inconsistency:** If server crashes, need replay log

---

## Summary: Phase Interconnections

```
Phase 0 (Foundation)
    ↓
Phase 1 (Database)
    ↓
Phase 2 (Components) ← → Phase 3 (API) [can be parallel]
    ↓
Phase 4 (Editor UI)
    ↓
Phase 5 (WebSocket)
    ↓
Phase 6 (Responsive)
    ↓
Phase 7 (Theming)
    ↓
Phase 8 (Security)
    ↓
Phase 9 (Analytics)
    ↓
Phase 10 (Performance)
    ↓
Phase 11 (Testing)
    ↓
Phase 12 (Deployment)
```

**Critical Path:** Phase 0 → 1 → (2 + 3 in parallel) → 4 → 5+

**Minimum viable product (MVP):** Through Phase 4 = ~8-10 days

**Production-ready:** Through Phase 11 = ~23 days

---

**Document Version:** 1.0  
**Created:** November 14, 2025  
**Detailed Analysis Complete**
