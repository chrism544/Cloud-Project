# 🎯 Adapted Implementation Plan: Page Builder for Cloud Project

**Objective:** Implement an enterprise-grade visual page builder integrated with existing Fastify + Next.js + Prisma architecture.

**Architecture:** Fastify backend (API) + Next.js frontend (Puck.js editor) + PostgreSQL + Redis

---

## 📋 Project Context

### Current Stack ✅
- **Backend:** Fastify 5.x + TypeScript
- **Frontend:** Next.js 16.x (App Router) with Craft.js (transitioning to Puck.js)
- **Database:** PostgreSQL with Prisma ORM
- **Caching:** Redis (ioredis)
- **Authentication:** JWT + Fastify plugins
- **Multi-tenancy:** Row-level isolation via `portalId` FK

### Key Existing Models
- `Portal`: Tenant instance
- `Page`: Content pages
- `User`: Portal users with RBAC
- `AssetContainer`: Theme/branding data
- `Menu`/`MenuItem`: Navigation
- `Theme`: Theme tokens (JSON)
- `GlobalContent`: Reusable blocks
- `StorageFile`: File uploads

---

## 🚀 Phase 0: Compatibility & Foundation Assessment

### Goal
Verify Puck.js integrates seamlessly with existing Next.js frontend and Fastify backend.

### Tasks

#### 0.1 Analyze Current Frontend State
- **Subtask:** Review existing Craft.js implementation
  - Check `frontend/lib/` for hooks (usePages, useMenus, etc.)
  - Verify React Query setup (`@tanstack/react-query`)
  - Review Zustand stores (`frontend/lib/stores/`)
- **Outcome:** Document migration path from Craft.js → Puck.js
- **Owner:** Frontend Lead
- **Timeline:** 1 day
- **Validation:** Run `npm run dev` in frontend, check for console errors

#### 0.2 Puck.js Compatibility Test
- **Subtask:** Create test component in `frontend/components/editors/PuckTest.tsx`
  ```tsx
  'use client';
  import { Puck, Config } from "@measured/puck";
  
  const config: Config = {
    components: {
      text: {
        label: "Text",
        render: ({ text }) => <div>{text}</div>,
        fields: { text: { type: "text" } },
      },
    },
  };
  
  export default function PuckTest() {
    return <Puck config={config} data={{}} />;
  }
  ```
- **Outcome:** Puck loads, renders components, no layout conflicts
- **Timeline:** 2 hours
- **Pass Criteria:** 
  - ✅ Puck renders without errors
  - ✅ Components appear in sidebar
  - ✅ Drag-and-drop functional
  - ✅ No CSS conflicts with existing Tailwind setup

#### 0.3 API Integration Dry Run
- **Subtask:** Test Fastify API calls from Next.js frontend
  - Call existing `/api/v1/pages` endpoint
  - Verify JWT auth from Next.js context
  - Check CORS headers
- **Outcome:** Confirm API connectivity, auth flow
- **Timeline:** 2 hours
- **Pass Criteria:**
  - ✅ API requests succeed with valid JWT
  - ✅ CORS allows frontend domain
  - ✅ Response times < 500ms

#### 0.4 Database Schema Review
- **Subtask:** Analyze `Page` model for Puck.js compatibility
  - Current: `content` (Json), `metaDescription`, `seoTitle`
  - Needed: Puck data structure (components, root layer)
  - Check existing versioning: `version`, `parentVersionId`
- **Outcome:** Schema migration plan (no breaking changes)
- **Timeline:** 1 day
- **Validation:** Write Prisma migration script

---

## 📦 Phase 1: Database Schema Enhancement

### Goal
Extend Prisma schema to support Puck.js data model while maintaining backward compatibility.

### Context
The existing `Page.content` (Json) stores page data. Puck requires:
```json
{
  "root": { "type": "COMPONENT", "props": {...} },
  "zones": { "zone-1": [{"type": "COMPONENT", ...}] },
  "components": {...}
}
```

### Tasks

#### 1.1 Extend Page Model
- **File:** `prisma/schema.prisma`
- **Changes:**
  ```prisma
  model Page {
    // Existing fields (keep as-is for backward compat)
    id              String    @id @default(uuid()) @db.Uuid
    portalId        String    @db.Uuid
    title           String    @db.VarChar(500)
    slug            String    @db.VarChar(200)
    content         Json      // Legacy: GrapesJS data (deprecated)
    
    // NEW: Puck.js structure
    puckData        Json?     // Puck components + root layer
    puckConfig      String?   // Serialized component config ref
    layoutId        String?   @db.Uuid // Reference to layout template
    
    // Enhanced versioning
    version         Int       @default(1)
    parentVersionId String?   @db.Uuid // For version history
    isDraft         Boolean   @default(true)
    
    // Editor state (NEW)
    editorState     Json?     // Cursor pos, selection, zoom for collab
    lastEditedBy    String?   @db.Uuid // Track last editor
    lastEditedAt    DateTime?
    
    // Metadata
    metaDescription String?
    seoTitle        String?
    canonicalUrl    String?   @db.VarChar(1024)
    noIndex         Boolean   @default(false)
    ogImageUrl      String?   @db.VarChar(1024)
    
    isPublished     Boolean   @default(false)
    publishedAt     DateTime?
    createdBy       String?   @db.Uuid
    updatedBy       String?   @db.Uuid
    createdAt       DateTime  @default(now()) @db.Timestamptz(6)
    updatedAt       DateTime  @default(now()) @updatedAt @db.Timestamptz(6)

    // Relations
    portal          Portal    @relation(fields: [portalId], references: [id], onDelete: Cascade)
    creator         User?     @relation("PageCreator", fields: [createdBy], references: [id])
    updater         User?     @relation("PageUpdater", fields: [updatedBy], references: [id])
    lastEditor      User?     @relation("PageEditor", fields: [lastEditedBy], references: [id])
    layout          PageLayout? @relation(fields: [layoutId], references: [id])
    versions        PageVersion[]
    components      PageComponent[]
    
    @@unique([portalId, slug])
    @@index([portalId])
    @@index([isPublished])
    @@index([isDraft])
    @@index([layoutId])
  }
  ```

- **Outcome:** Schema supports both legacy & Puck data
- **Timeline:** 4 hours
- **Validation:** Run `npx prisma migrate dev --name add_puck_support`

#### 1.2 Create Page Layout Model
- **File:** `prisma/schema.prisma`
- **Purpose:** Store layout templates (columns, grids, sections)
- **Schema:**
  ```prisma
  model PageLayout {
    id          String    @id @default(uuid()) @db.Uuid
    portalId    String    @db.Uuid
    name        String    @db.VarChar(255)
    slug        String    @db.VarChar(100)
    description String?
    
    // Layout structure
    puckData    Json      // Puck template components
    thumbnail   String?   @db.VarChar(1024) // Preview image
    
    // Metadata
    isDefault   Boolean   @default(false)
    isPublished Boolean   @default(false)
    createdBy   String?   @db.Uuid
    createdAt   DateTime  @default(now()) @db.Timestamptz(6)
    updatedAt   DateTime  @default(now()) @updatedAt @db.Timestamptz(6)
    
    portal      Portal    @relation(fields: [portalId], references: [id], onDelete: Cascade)
    creator     User?     @relation(fields: [createdBy], references: [id])
    pages       Page[]
    
    @@unique([portalId, slug])
    @@index([portalId])
    @@index([isDefault])
  }
  ```

- **Timeline:** 2 hours

#### 1.3 Create Page Version History Model
- **File:** `prisma/schema.prisma`
- **Purpose:** Store page snapshots for undo/restore
- **Schema:**
  ```prisma
  model PageVersion {
    id        String    @id @default(uuid()) @db.Uuid
    pageId    String    @db.Uuid
    versionNo Int
    
    // Snapshot
    puckData  Json
    content   Json?     // Legacy data
    
    // Metadata
    changeLog String?   // User description of changes
    createdBy String?   @db.Uuid
    createdAt DateTime  @default(now()) @db.Timestamptz(6)
    
    page      Page      @relation(fields: [pageId], references: [id], onDelete: Cascade)
    creator   User?     @relation(fields: [createdBy], references: [id])
    
    @@unique([pageId, versionNo])
    @@index([pageId])
  }
  ```

- **Timeline:** 1 hour

#### 1.4 Create Page Component Registry Model
- **File:** `prisma/schema.prisma`
- **Purpose:** Track which components are used in which pages (for analytics)
- **Schema:**
  ```prisma
  model PageComponent {
    id          String   @id @default(uuid()) @db.Uuid
    pageId      String   @db.Uuid
    componentId String   @db.VarChar(100) // e.g., "Hero", "TextBlock"
    count       Int      @default(1) // How many instances
    updatedAt   DateTime @default(now()) @updatedAt @db.Timestamptz(6)
    
    page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
    
    @@unique([pageId, componentId])
    @@index([pageId])
  }
  ```

- **Timeline:** 30 minutes

#### 1.5 Run Migration
- **Command:**
  ```bash
  npx prisma migrate dev --name "add_puck_editor_support"
  ```
- **Validate:** Check `prisma/migrations/` for new migration file
- **Timeline:** 30 minutes
- **Owner:** Backend Lead

---

## 🎨 Phase 2: Puck Component Library Implementation

### Goal
Define and implement 13+ reusable Puck.js widgets for the page builder.

### Context
Existing Craft.js widgets provide reference; migrate to Puck.js config format.

### Tasks

#### 2.1 Core Component Infrastructure
- **File:** `frontend/lib/puck/config.tsx`
- **Purpose:** Central Puck config with all component definitions
- **Structure:**
  ```typescript
  import { Config } from "@measured/puck";
  
  export const puckConfig: Config = {
    components: {
      // Layouts
      Hero: {...},
      Section: {...},
      Container: {...},
      TwoColumn: {...},
      ThreeColumn: {...},
      
      // Content
      Text: {...},
      Heading: {...},
      Image: {...},
      Button: {...},
      
      // Advanced
      Carousel: {...},
      Testimonials: {...},
      PricingTable: {...},
      FAQSection: {...},
      Gallery: {...},
      Form: {...},
      
      // CTA
      Newsletter: {...},
      CallToAction: {...},
    },
  };
  ```

- **Outcome:** Puck config file with all component definitions
- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 2.2 Layout Components (Hero, Section, Container, Columns)
- **Files:**
  - `frontend/components/puck/Hero.tsx`
  - `frontend/components/puck/Section.tsx`
  - `frontend/components/puck/Container.tsx`
  - `frontend/components/puck/Columns.tsx`

- **Hero Component Example:**
  ```tsx
  // frontend/lib/puck/config.tsx
  Hero: {
    label: "Hero Section",
    defaultProps: {
      title: "Welcome to our site",
      subtitle: "Amazing subtitle here",
      backgroundImage: null,
      cta: { text: "Get Started", url: "/contact" },
    },
    fields: {
      title: { type: "text", label: "Title" },
      subtitle: { type: "textarea", label: "Subtitle" },
      backgroundImage: {
        type: "custom",
        label: "Background Image",
        render: ({ value, onChange }) => (
          <ImageUpload value={value} onChange={onChange} />
        ),
      },
      cta: {
        type: "object",
        label: "Call-to-Action",
        objectFields: {
          text: { type: "text" },
          url: { type: "text" },
        },
      },
    },
    render: (props) => (
      <section
        className="hero"
        style={{
          backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        }}
      >
        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>
        <a href={props.cta.url} className="btn btn-primary">
          {props.cta.text}
        </a>
      </section>
    ),
  }
  ```

- **Outcome:** 4 core layout components implemented
- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 2.3 Content Components (Text, Heading, Image, Button)
- **Files:**
  - `frontend/components/puck/Text.tsx`
  - `frontend/components/puck/Heading.tsx`
  - `frontend/components/puck/Image.tsx`
  - `frontend/components/puck/Button.tsx`

- **Features:**
  - Text: Rich text editor, font customization
  - Heading: Typography levels (h1-h6), styling
  - Image: Upload, sizing, alignment, lazy loading
  - Button: Colors, sizes, link targets

- **Outcome:** 4 content components with rich editing
- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 2.4 Advanced Components (Carousel, Testimonials, Pricing, FAQ, Gallery)
- **Files:**
  - `frontend/components/puck/Carousel.tsx` - Image/content carousel with autoplay
  - `frontend/components/puck/Testimonials.tsx` - Review cards with ratings
  - `frontend/components/puck/PricingTable.tsx` - Plans with features/CTA
  - `frontend/components/puck/FAQSection.tsx` - Accordion
  - `frontend/components/puck/Gallery.tsx` - Grid/masonry gallery

- **Carousel Example:**
  ```tsx
  Carousel: {
    label: "Carousel",
    fields: {
      items: {
        type: "array",
        label: "Items",
        arrayFields: {
          image: { type: "custom", render: ImageUpload },
          title: { type: "text" },
          description: { type: "textarea" },
        },
      },
      autoplay: { type: "radio", label: "Autoplay", options: [
        { label: "On", value: true },
        { label: "Off", value: false },
      ]},
      interval: { type: "number", label: "Interval (ms)" },
    },
    render: (props) => <CarouselComponent {...props} />,
  }
  ```

- **Outcome:** 5 advanced components
- **Timeline:** 2.5 days
- **Owner:** Frontend Lead + UI/UX Designer

#### 2.5 CTA Components (Newsletter, Call-to-Action, Form)
- **Files:**
  - `frontend/components/puck/Newsletter.tsx`
  - `frontend/components/puck/CallToAction.tsx`
  - `frontend/components/puck/Form.tsx`

- **Features:**
  - Newsletter: Email capture with validation
  - CTA: Flexible button groups + description
  - Form: Dynamic fields, validation, submission

- **Outcome:** 3 conversion-focused components
- **Timeline:** 2 days
- **Owner:** Frontend Lead

#### 2.6 Component Testing & Documentation
- **File:** `frontend/lib/puck/__tests__/config.test.ts`
- **Coverage:**
  - All 13 components render without errors
  - Field validation works
  - Slot fields accept children

- **Outcome:** 100% component coverage
- **Timeline:** 1 day
- **Owner:** QA Lead

---

## 🔌 Phase 3: Fastify Backend API Extensions

### Goal
Create REST API endpoints for page builder operations: CRUD, versioning, publishing.

### Context
Existing modules in `src/modules/pages/`, existing auth via `app.authenticate` + `app.requireRole()`.

### Tasks

#### 3.1 Page CRUD Endpoints
- **File:** `src/modules/pages/routes.ts` (extend existing)
- **Endpoints:**

  ```
  POST   /api/v1/pages
  GET    /api/v1/pages/:pageId
  PUT    /api/v1/pages/:pageId
  DELETE /api/v1/pages/:pageId
  GET    /api/v1/portals/:portalId/pages (list all)
  ```

- **Handler Patterns:**
  ```typescript
  // Example: Create Page
  app.post<{ Body: CreatePageSchema }>(
    "/pages",
    { preHandler: app.authenticate },
    async (req, reply) => {
      const data = createPageSchema.parse(req.body);
      
      // Validate portalId matches JWT
      if (data.portalId !== req.user.portalId) {
        throw new UnauthorizedError("Portal mismatch");
      }
      
      // Create page
      const page = await app.prisma.page.create({
        data: {
          ...data,
          createdBy: req.user.sub,
          puckData: data.puckData || {
            root: { type: "COMPONENT", props: {} },
            zones: {},
            components: {},
          },
        },
      });
      
      // Cache invalidate
      await app.redis.del(`portal:${data.portalId}:pages:*`);
      
      reply.code(201).send(page);
    }
  );
  ```

- **Validation Schema** (Zod):
  ```typescript
  const createPageSchema = z.object({
    portalId: z.string().uuid(),
    title: z.string().min(1).max(500),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    puckData: z.record(z.unknown()).optional(),
    metaDescription: z.string().max(160).optional(),
    seoTitle: z.string().max(60).optional(),
  });
  ```

- **Outcome:** Full CRUD with validation + caching
- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 3.2 Page Publishing Endpoint
- **File:** `src/modules/pages/routes.ts`
- **Endpoint:**
  ```
  POST /api/v1/pages/:pageId/publish
  POST /api/v1/pages/:pageId/unpublish
  ```

- **Handler:**
  ```typescript
  app.post<{ Params: { pageId: string } }>(
    "/pages/:pageId/publish",
    { preHandler: app.requireRole("editor") },
    async (req, reply) => {
      const page = await app.prisma.page.update({
        where: { id: req.params.pageId },
        data: {
          isPublished: true,
          publishedAt: new Date(),
          isDraft: false,
        },
      });
      
      // Invalidate cache
      await app.redis.del(`portal:${page.portalId}:pages:*`);
      
      reply.send({ success: true, page });
    }
  );
  ```

- **Outcome:** Publish/unpublish with timestamps
- **Timeline:** 4 hours
- **Owner:** Backend Lead

#### 3.3 Page Version History Endpoints
- **File:** `src/modules/pages/routes.ts`
- **Endpoints:**
  ```
  GET    /api/v1/pages/:pageId/versions
  GET    /api/v1/pages/:pageId/versions/:versionNo
  POST   /api/v1/pages/:pageId/versions/:versionNo/restore
  ```

- **Features:**
  - Auto-save versions on every update
  - Store diff/changelog
  - Restore with timestamp

- **Outcome:** Full version management
- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 3.4 Page Layout Endpoints
- **File:** `src/modules/pages/routes.ts` or new `src/modules/layouts/routes.ts`
- **Endpoints:**
  ```
  POST   /api/v1/portals/:portalId/layouts
  GET    /api/v1/portals/:portalId/layouts
  GET    /api/v1/portals/:portalId/layouts/:layoutId
  PUT    /api/v1/portals/:portalId/layouts/:layoutId
  DELETE /api/v1/portals/:portalId/layouts/:layoutId
  ```

- **Outcome:** Layout CRUD with caching
- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 3.5 Page Analytics Endpoints
- **File:** `src/modules/analytics/routes.ts` (extend if exists)
- **Endpoints:**
  ```
  GET    /api/v1/pages/:pageId/analytics
  POST   /api/v1/pages/:pageId/views (track pageview)
  ```

- **Metrics:**
  - Page views (count, timestamps)
  - Referrers
  - Device types
  - Geographic location

- **Outcome:** Basic analytics tracking
- **Timeline:** 1.5 days
- **Owner:** Backend Lead

#### 3.6 Bulk Operations Endpoints
- **File:** `src/modules/pages/routes.ts`
- **Endpoints:**
  ```
  POST   /api/v1/pages/bulk/delete
  POST   /api/v1/pages/bulk/publish
  POST   /api/v1/pages/bulk/move-to-layout
  ```

- **Outcome:** Batch operations for admin/editor workflows
- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 3.7 API Integration Testing
- **File:** `tests/modules/pages.test.ts`
- **Coverage:**
  - CRUD operations
  - Authorization checks (viewer cannot publish)
  - Validation errors
  - Cache invalidation

- **Outcome:** >80% test coverage
- **Timeline:** 1 day
- **Owner:** QA Lead

---

## 🎯 Phase 4: Frontend Page Editor UI

### Goal
Create professional page editor interface with Puck.js + custom panels.

### Context
Reference: `plan/elementor-style-ui-ux.md`. Use existing Zustand stores + React Query.

### Tasks

#### 4.1 Main Editor Layout
- **File:** `frontend/app/(portal)/editor/[pageId]/page.tsx`
- **Structure:**
  ```
  ┌─────────────────────────────────────────┐
  │  Top Toolbar (save, preview, publish)  │
  ├──────────┬──────────────────┬───────────┤
  │ Left     │                  │ Right     │
  │ Panel    │   Canvas Area    │ Settings  │
  │ (blocks) │   (Puck)         │ Panel     │
  │          │                  │           │
  └──────────┴──────────────────┴───────────┘
  ```

- **Components:**
  - `frontend/components/editors/PageEditor.tsx` (main container)
  - `frontend/components/editors/TopToolbar.tsx` (save/preview/publish)
  - `frontend/components/editors/LeftPanel.tsx` (components sidebar)
  - `frontend/components/editors/RightPanel.tsx` (inspector)

- **Features:**
  - Puck.js canvas in center
  - Collapsible left/right panels
  - Responsive toolbar
  - Floating notification toasts

- **Timeline:** 2 days
- **Owner:** Frontend Lead

#### 4.2 Custom Puck Overrides
- **File:** `frontend/lib/puck/overrides.tsx`
- **Purpose:** Customize Puck UI (toolbar, layer tree, field editor)
- **Customizations:**
  ```typescript
  const overrides = {
    // Custom toolbar
    Toolbar: (props) => (
      <div className="custom-toolbar">
        {/* ... */}
      </div>
    ),
    
    // Custom layer tree
    LayerTree: (props) => (
      <div className="custom-layers">
        {/* ... */}
      </div>
    ),
  };
  ```

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 4.3 Component Inspector (Right Panel)
- **File:** `frontend/components/editors/InspectorPanel.tsx`
- **Features:**
  - Display selected component properties
  - Edit component fields in real-time
  - Preview style changes
  - Delete/duplicate/hide component

- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 4.4 Undo/Redo System
- **File:** `frontend/lib/hooks/usePageHistory.ts`
- **Features:**
  - Track page state changes
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
  - Max 50 undo steps
  - Persisted to IndexedDB for recovery

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 4.5 Auto-save Implementation
- **File:** `frontend/lib/hooks/useAutoSave.ts`
- **Features:**
  - Save draft every 30 seconds
  - Show save status indicator
  - Debounce rapid changes
  - Sync with API via React Query

- **Implementation:**
  ```typescript
  export function useAutoSave(pageId: string, puckData: any) {
    const savePageMutation = useSavePageMutation();
    
    useEffect(() => {
      const timer = setTimeout(() => {
        if (puckData) {
          savePageMutation.mutate({
            pageId,
            puckData,
            isDraft: true,
          });
        }
      }, 30000); // 30 seconds
      
      return () => clearTimeout(timer);
    }, [puckData]);
  }
  ```

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 4.6 Preview Mode
- **File:** `frontend/app/(portal)/editor/[pageId]/preview.tsx`
- **Features:**
  - Full-screen page preview
  - Responsive device switcher (desktop/tablet/mobile)
  - SEO meta tag preview
  - Share preview link

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 4.7 Page Settings Drawer
- **File:** `frontend/components/editors/PageSettingsDrawer.tsx`
- **Fields:**
  - Title, Slug
  - Meta description, SEO title
  - Canonical URL
  - Open Graph image
  - Layout template selection
  - Publishing status

- **Timeline:** 1 day
- **Owner:** Frontend Lead

---

## 🔄 Phase 5: Real-time Collaboration (WebSocket)

### Goal
Enable multiple users to edit pages simultaneously with cursor tracking and presence awareness.

### Context
Optional but recommended for enterprise. Requires WebSocket infrastructure.

### Tasks

#### 5.1 WebSocket Server Setup (Fastify)
- **File:** `src/plugins/websocket.ts`
- **Purpose:** Real-time events for page updates
- **Features:**
  - Connect/disconnect tracking
  - Room-based subscriptions (per page)
  - Broadcast page updates
  - Cursor position sync

- **Implementation Outline:**
  ```typescript
  // Fastify plugin setup
  import fastifyWebsocket from "@fastify/websocket";
  
  export default async function websocketPlugin(app: FastifyInstance) {
    await app.register(fastifyWebsocket);
    
    // Connection management
    const rooms = new Map<string, Set<string>>();
    
    app.get("/ws/pages/:pageId", { websocket: true }, (socket, req) => {
      const { pageId } = req.params;
      const userId = req.user.sub;
      
      // Join room
      if (!rooms.has(pageId)) rooms.set(pageId, new Set());
      rooms.get(pageId)!.add(userId);
      
      // Broadcast presence
      broadcast(pageId, { type: "user-joined", userId });
      
      // Handle messages
      socket.on("message", (data) => {
        const event = JSON.parse(data);
        broadcast(pageId, {
          type: event.type,
          userId,
          payload: event.payload,
        });
      });
      
      // Cleanup
      socket.on("close", () => {
        rooms.get(pageId)?.delete(userId);
        broadcast(pageId, { type: "user-left", userId });
      });
    });
  }
  ```

- **Timeline:** 1.5 days
- **Owner:** Backend Lead

#### 5.2 WebSocket Client Hook (Frontend)
- **File:** `frontend/lib/hooks/usePageWebSocket.ts`
- **Purpose:** Connect to WebSocket and handle real-time updates
- **Features:**
  - Auto-reconnect on disconnect
  - Cursor position tracking
  - Update debouncing

- **Implementation:**
  ```typescript
  export function usePageWebSocket(pageId: string) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    
    useEffect(() => {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/ws/pages/${pageId}`
      );
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === "user-joined") {
          setCollaborators(prev => [...prev, message.user]);
        } else if (message.type === "cursor-moved") {
          updateCursorPosition(message.userId, message.position);
        }
      };
      
      return () => ws.close();
    }, [pageId]);
    
    const sendCursorUpdate = (position) => {
      ws?.send(JSON.stringify({
        type: "cursor-moved",
        payload: position,
      }));
    };
    
    return { collaborators, sendCursorUpdate };
  }
  ```

- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 5.3 Cursor Visualization
- **File:** `frontend/components/editors/RemoteCursor.tsx`
- **Features:**
  - Show remote user cursors with color coding
  - Display user avatar + name on hover
  - Smooth cursor movement animations

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 5.4 Conflict Resolution
- **File:** `src/modules/pages/services/conflictResolver.ts`
- **Strategy:** Operational Transformation (OT) or CRDT
- **Features:**
  - Merge concurrent updates
  - Preserve intent of all changes
  - Log conflicts for audit

- **Timeline:** 2 days
- **Owner:** Backend Lead (advanced)

#### 5.5 Collaboration Testing
- **Scenario:** Two users edit same page simultaneously
- **Validation:**
  - Both see updates from other user
  - No data loss
  - Conflicts resolved correctly

- **Timeline:** 1 day
- **Owner:** QA Lead

---

## 📱 Phase 6: Responsive Editor & Device Preview

### Goal
Support page building for multiple device sizes (desktop, tablet, mobile).

### Tasks

#### 6.1 Device Breakpoints Configuration
- **File:** `frontend/lib/puck/breakpoints.ts`
- **Definition:**
  ```typescript
  export const breakpoints = {
    mobile: { width: 375, label: "Mobile (375px)" },
    tablet: { width: 768, label: "Tablet (768px)" },
    laptop: { width: 1440, label: "Desktop (1440px)" },
  };
  ```

- **Timeline:** 2 hours
- **Owner:** Frontend Lead

#### 6.2 Device Selector in Toolbar
- **File:** `frontend/components/editors/DeviceSelector.tsx`
- **Features:**
  - Radio buttons for devices
  - Preview canvas resizes accordingly
  - Save device preference per user

- **Timeline:** 4 hours
- **Owner:** Frontend Lead

#### 6.3 Responsive Component Props
- **Update:** All Puck components to support responsive styling
- **Pattern:**
  ```typescript
  Text: {
    fields: {
      fontSize: {
        type: "object",
        objectFields: {
          mobile: { type: "text" },
          tablet: { type: "text" },
          desktop: { type: "text" },
        },
      },
    },
  }
  ```

- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 6.4 Mobile Preview Tab
- **File:** `frontend/app/(portal)/editor/[pageId]/mobile-preview.tsx`
- **Features:**
  - Simulated mobile device frame
  - Touch gesture preview
  - Performance metrics

- **Timeline:** 1 day
- **Owner:** Frontend Lead

---

## 🎨 Phase 7: Styling & Theme Integration

### Goal
Integrate Fastify `Theme` model with Puck components for visual consistency.

### Context
Existing `Theme` model stores theme tokens (JSON), `AssetContainer` stores branding.

### Tasks

#### 7.1 Theme Provider Setup
- **File:** `frontend/lib/puck/themeProvider.ts`
- **Purpose:** Load theme data and provide to components
- **Implementation:**
  ```typescript
  export async function getThemeForPortal(portalId: string) {
    const theme = await fetch(`/api/v1/themes/${portalId}`);
    return {
      colors: theme.colorPrimary, // From AssetContainer
      fonts: theme.primaryFontUrl,
      // ... other theme vars
    };
  }
  ```

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 7.2 Component Theming
- **Update:** All Puck components to use theme tokens
- **Pattern:**
  ```tsx
  export const Hero: ComponentConfig = {
    render: (props) => (
      <section
        style={{
          backgroundColor: props.backgroundColor || theme.colors.background,
          color: props.textColor || theme.colors.text,
          fontFamily: theme.fonts.primary,
        }}
      >
        {/* ... */}
      </section>
    ),
  };
  ```

- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 7.3 Theme Customization Panel
- **File:** `frontend/components/editors/ThemePanel.tsx`
- **Features:**
  - Color picker for primary/secondary/accent
  - Font selection
  - Spacing scale (padding/margin presets)
  - Live preview of changes

- **Timeline:** 1.5 days
- **Owner:** Frontend Lead

#### 7.4 CSS Generation & Export
- **File:** `src/modules/pages/services/cssGenerator.ts`
- **Purpose:** Generate production CSS from Puck data + theme
- **Output:**
  ```css
  /* Generated CSS for page */
  .hero { background-color: #007bff; }
  .text { font-family: 'Inter', sans-serif; }
  /* ... */
  ```

- **Timeline:** 1 day
- **Owner:** Backend Lead

---

## 🔐 Phase 8: Security & Content Moderation

### Goal
Prevent XSS, injection attacks, and enforce content policies.

### Tasks

#### 8.1 Input Sanitization
- **File:** `src/utils/sanitizer.ts`
- **Libraries:** `dompurify`, `sanitize-html`
- **Features:**
  - Sanitize HTML content
  - Whitelist allowed tags/attributes
  - Remove scripts, event handlers

- **Usage:**
  ```typescript
  import sanitizeHtml from "sanitize-html";
  
  const cleanHtml = sanitizeHtml(puckData.components.text.props.html, {
    allowedTags: ["b", "i", "em", "strong", "p", "a", "h1", "h2"],
    allowedAttributes: { a: ["href"] },
  });
  ```

- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 8.2 XSS Prevention
- **File:** `frontend/lib/puck/config.tsx`
- **Implementation:**
  - Never use `dangerouslySetInnerHTML` without sanitization
  - Escape user content in templates
  - Content Security Policy (CSP) headers

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 8.3 Rate Limiting for Page Saves
- **File:** `src/server.ts`
- **Implementation:**
  ```typescript
  // Already registered: @fastify/rate-limit
  // Add per-endpoint limit
  app.post("/pages/:pageId", 
    {
      preHandler: app.rateLimit({ max: 60, timeWindow: "1 minute" })
    },
    // ...
  );
  ```

- **Timeline:** 2 hours
- **Owner:** Backend Lead

#### 8.4 Audit Logging
- **File:** `src/modules/audit/routes.ts`
- **Events Tracked:**
  - Page created/updated/deleted
  - Page published/unpublished
  - User role changes
  - Failed access attempts

- **Schema:**
  ```prisma
  model AuditLog {
    id        String   @id @default(uuid()) @db.Uuid
    userId    String   @db.Uuid
    action    String   // "PAGE_CREATED", "PAGE_PUBLISHED"
    resourceId String? // pageId
    changes   Json?    // Before/after diff
    ipAddress String?
    timestamp DateTime @default(now())
  }
  ```

- **Timeline:** 1.5 days
- **Owner:** Backend Lead

---

## 📊 Phase 9: Analytics & Reporting

### Goal
Track page performance, user behavior, and engagement metrics.

### Tasks

#### 9.1 Page View Tracking
- **File:** `frontend/lib/hooks/usePageAnalytics.ts`
- **Implementation:**
  ```typescript
  export function usePageAnalytics(pageId: string) {
    useEffect(() => {
      // Track pageview
      fetch(`/api/v1/pages/${pageId}/views`, {
        method: "POST",
        body: JSON.stringify({
          referrer: document.referrer,
          device: getDeviceType(),
        }),
      });
    }, [pageId]);
  }
  ```

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 9.2 Analytics Dashboard
- **File:** `frontend/app/(portal)/analytics/pages.tsx`
- **Metrics:**
  - Total views (chart)
  - Unique visitors
  - Top pages
  - Traffic sources
  - Device breakdown
  - Geographic data (if enabled)

- **Libraries:** Recharts (already in package.json)

- **Timeline:** 2 days
- **Owner:** Frontend Lead

#### 9.3 Export Analytics
- **File:** `src/modules/analytics/routes.ts`
- **Endpoints:**
  ```
  GET /api/v1/pages/:pageId/analytics/export?format=csv|json
  ```

- **Formats:** CSV, JSON
- **Timeline:** 1 day
- **Owner:** Backend Lead

---

## 🚀 Phase 10: Performance Optimization

### Goal
Ensure fast page load times, optimized bundle sizes, and efficient rendering.

### Tasks

#### 10.1 Image Optimization
- **Libraries:** `next/image`, `sharp` (already in use)
- **Implementation:**
  - Auto-resize images
  - Multiple formats (webp, avif)
  - Lazy loading by default
  - CDN integration

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 10.2 Code Splitting & Lazy Loading
- **File:** `frontend/lib/puck/config.tsx`
- **Implementation:**
  ```typescript
  // Lazy-load heavy components
  const Carousel = lazy(() => import("../components/puck/Carousel"));
  const Gallery = lazy(() => import("../components/puck/Gallery"));
  
  const puckConfig: Config = {
    components: {
      Carousel: { render: Carousel, ... },
      Gallery: { render: Gallery, ... },
    },
  };
  ```

- **Timeline:** 1 day
- **Owner:** Frontend Lead

#### 10.3 Redis Caching Strategy
- **File:** `src/modules/pages/services/cacheService.ts`
- **Strategy:** Cache-aside pattern
  - Cache published pages for 5 min
  - Invalidate on publish/update
  - Cache theme data for 1 hour

- **Keys:**
  ```
  page:{portalId}:{pageId}         // Page data
  portal:{portalId}:theme          // Theme data
  portal:{portalId}:layouts        // Layouts list
  ```

- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 10.4 Database Query Optimization
- **Prisma Query Optimization:**
  - Use `select` to fetch only needed fields
  - Add missing indexes
  - Use `include` judiciously

- **Example:**
  ```typescript
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: {
      id: true,
      puckData: true,
      title: true,
      // Don't fetch unnecessary relations
    },
  });
  ```

- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 10.5 Bundle Size Analysis
- **Tools:** `next/bundle-analyzer`
- **Goal:** Keep bundle < 150KB (gzip)
- **Timeline:** 1 day
- **Owner:** Frontend Lead

---

## 🧪 Phase 11: Testing & Quality Assurance

### Goal
Comprehensive testing coverage (unit, integration, E2E).

### Tasks

#### 11.1 Unit Tests - Components
- **File:** `frontend/components/puck/__tests__/*.test.ts`
- **Coverage:** All 13+ Puck components
- **Framework:** Jest + React Testing Library
- **Target:** 80% coverage

- **Example:**
  ```typescript
  describe("Hero Component", () => {
    it("renders with title and subtitle", () => {
      const { getByText } = render(
        <Hero title="Welcome" subtitle="Intro" />
      );
      expect(getByText("Welcome")).toBeInTheDocument();
    });
  });
  ```

- **Timeline:** 2 days
- **Owner:** QA Lead

#### 11.2 Integration Tests - API
- **File:** `tests/modules/pages.integration.test.ts`
- **Coverage:**
  - CRUD operations
  - Publishing workflow
  - Version history
  - Permissions (viewer/editor/admin)

- **Timeline:** 2 days
- **Owner:** QA Lead

#### 11.3 E2E Tests - User Workflows
- **File:** `frontend/tests/e2e/page-builder.spec.ts`
- **Playwright Tests:**
  - Create page
  - Add components
  - Save draft
  - Publish
  - Preview

- **Timeline:** 2 days
- **Owner:** QA Lead

#### 11.4 Performance Testing
- **Tools:** Lighthouse, Web Vitals
- **Targets:**
  - Lighthouse score > 90
  - LCP < 2.5s
  - CLS < 0.1

- **Timeline:** 1 day
- **Owner:** QA Lead

#### 11.5 Security Testing
- **Tools:** OWASP ZAP, npm audit
- **Checks:**
  - XSS prevention
  - CSRF protection
  - Rate limiting
  - SQL injection

- **Timeline:** 1 day
- **Owner:** Security Lead

---

## 📦 Phase 12: Deployment & Documentation

### Goal
Package for production, document API, and create admin guides.

### Tasks

#### 12.1 Docker Build
- **File:** `Dockerfile`, `docker-compose.yml`
- **Build:**
  ```bash
  docker build -t cloud-project-backend .
  docker build -t cloud-project-frontend frontend/Dockerfile
  docker-compose up
  ```

- **Timeline:** 1 day
- **Owner:** DevOps Lead

#### 12.2 Kubernetes Manifests
- **File:** `k8s/page-builder-*.yaml`
- **Resources:**
  - Deployment (backend, frontend)
  - Service
  - ConfigMap (env vars)
  - Secrets (JWT_SECRET, DB_URL)
  - PVC (uploads storage)

- **Timeline:** 2 days
- **Owner:** DevOps Lead

#### 12.3 API Documentation
- **Format:** OpenAPI/Swagger (already using `@fastify/swagger`)
- **Update:**
  - Document all new endpoints in Phase 3
  - Include auth requirements
  - Add example requests/responses

- **Access:** http://localhost:3001/docs

- **Timeline:** 1.5 days
- **Owner:** Backend Lead

#### 12.4 Admin Guide
- **File:** `docs/admin/PAGE_BUILDER_GUIDE.md`
- **Sections:**
  - Getting started
  - Creating pages
  - Using components
  - Publishing workflow
  - Collaboration
  - Analytics

- **Timeline:** 1.5 days
- **Owner:** Product Lead

#### 12.5 Developer Guide
- **File:** `docs/dev/PUCK_WIDGETS.md`
- **Sections:**
  - Adding custom widgets
  - Theming system
  - WebSocket setup
  - API integration

- **Timeline:** 1 day
- **Owner:** Backend Lead

#### 12.6 Release & Deployment
- **Steps:**
  - Tag version (e.g., `v1.0.0`)
  - Build Docker images
  - Push to registry
  - Deploy to staging
  - Run smoke tests
  - Deploy to production
  - Monitor for errors

- **Timeline:** 1 day
- **Owner:** DevOps Lead

---

## 📈 Phase 13: Feature Extensions & Future Work

### Goal
Plan for post-launch enhancements and scaling.

### Tasks

#### 13.1 Template Marketplace
- **Feature:** Pre-built page templates
- **Reference:** `plan/template-system-expansion.md`
- **Models:** `Template`, `TemplateCategory`, `TemplateReview`
- **Endpoints:** Browse, filter, import templates
- **Timeline:** 5-10 days (post-launch)

#### 13.2 Advanced SEO Tools
- **Features:**
  - XML sitemap generation
  - Schema.org markup
  - Meta tag suggestions
  - SEO score calculation

- **Timeline:** 3-5 days

#### 13.3 A/B Testing
- **Features:**
  - Create page variants
  - Track conversion rates
  - Statistical analysis
  - Auto-optimize winner

- **Timeline:** 5-7 days

#### 13.4 AI-Powered Features
- **Features:**
  - Auto-generate page content from description
  - Suggest component arrangements
  - Accessibility checker
  - Image alt-text generator

- **Timeline:** 7-10 days

#### 13.5 Third-Party Integrations
- **Examples:**
  - Mailchimp (email capture)
  - Stripe (payments)
  - Zapier (automations)
  - Analytics (GA4, Mixpanel)

- **Timeline:** 3-5 days each

---

## 📊 Implementation Timeline Summary

| Phase | Title | Duration | Owner |
|-------|-------|----------|-------|
| 0 | Foundation & Compatibility | 1.5 days | Both |
| 1 | Database Schema | 1 day | Backend |
| 2 | Puck Components | 2.5 days | Frontend |
| 3 | Fastify API | 1.5 days | Backend |
| 4 | Editor UI | 2 days | Frontend |
| 5 | WebSocket Collab | 2 days | Both |
| 6 | Responsive Design | 1.5 days | Frontend |
| 7 | Theming | 1.5 days | Frontend |
| 8 | Security | 1.5 days | Backend |
| 9 | Analytics | 1.5 days | Frontend |
| 10 | Performance | 1.5 days | Both |
| 11 | Testing | 2 days | QA |
| 12 | Deployment | 2 days | DevOps |
| 13 | Future Work | TBD | TBD |
| | **TOTAL** | **~23 days** | |

**Parallel tracks possible:** Frontend (2-4) can proceed while Backend (1, 3) works independently. Phase 5+ depends on earlier phases.

---

## 🔍 Key Technical Decisions

### 1. Puck.js vs. Craft.js
- **Choice:** Migrate to Puck.js
- **Reasoning:**
  - Puck has better documentation
  - More flexible field system
  - Active maintenance
  - Better TypeScript support

### 2. Real-time Sync Strategy
- **Choice:** WebSocket + operational transform
- **Reasoning:**
  - Multi-user editing required
  - OT proven for collaborative apps (Google Docs)
  - Redis pub/sub for horizontal scaling

### 3. Versioning & History
- **Choice:** Separate `PageVersion` table + Redis
- **Reasoning:**
  - Easy undo/restore
  - Audit trail for compliance
  - Efficient storage (only diffs in future)

### 4. Caching Strategy
- **Choice:** Cache-aside pattern with Redis
- **Reasoning:**
  - Fast reads for published pages
  - Manual invalidation gives control
  - Simple to implement in Fastify

### 5. Frontend State Management
- **Choice:** Zustand (global) + React Query (server)
- **Reasoning:**
  - Already in use
  - Lightweight, performant
  - Good DevTools integration

---

## ✅ Success Criteria

- [ ] All 13 Puck components rendering correctly
- [ ] CRUD API endpoints working with multi-tenant isolation
- [ ] Page publishing workflow functional
- [ ] Version history with restore working
- [ ] 2+ users can edit same page simultaneously (WebSocket)
- [ ] Responsive preview for 3 device sizes
- [ ] Theme tokens applied to all components
- [ ] >80% test coverage (unit + integration)
- [ ] Lighthouse score > 90
- [ ] API docs complete and accessible
- [ ] Admin/user guides complete
- [ ] <23 days total implementation time

---

## 🚨 Known Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Puck.js learning curve | Dev time +30% | Early spike (Phase 0), documentation |
| WebSocket scaling issues | Collab broken at scale | Use Redis pub/sub early |
| Component bloat | Bundle size > 200KB | Code-split heavy components |
| Data migration from GrapesJS | Downtime, data loss | Dual-format support (Phase 1) |
| Concurrent edit conflicts | Data loss | Implement OT (Phase 5) |
| XSS in user content | Security breach | Sanitize + CSP headers (Phase 8) |

---

## 📚 References

- **Puck.js Docs:** https://puce.puckjs.io/
- **Fastify Docs:** https://www.fastify.io/
- **Next.js Docs:** https://nextjs.org/
- **Prisma Docs:** https://www.prisma.io/docs/
- **Existing Plans:** `plan/plan-complete.md`, `plan/elementor-style-ui-ux.md`

---

## 🎯 Next Steps

1. **Review this plan** with team (1 hour)
2. **Set up Phase 0** test environment (2 hours)
3. **Begin Phase 1** database schema updates (1 day)
4. **Parallel start** Phase 2 (components) & Phase 3 (API) (2-3 days)
5. **Track progress** weekly in standups
6. **Adjust timeline** based on blockers

---

**Document Version:** 1.0  
**Created:** November 14, 2025  
**Last Updated:** November 14, 2025  
**Status:** Ready for Implementation
