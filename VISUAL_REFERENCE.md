# 🎨 Visual Reference Guide: Implementation Overview

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  Presentation Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (Puck.js Page Editor)              │  │
│  │  - Component Sidebar (13 widgets)                    │  │
│  │  - Canvas Area (Drag & Drop)                         │  │
│  │  - Inspector Panel (Properties)                      │  │
│  │  - Top Toolbar (Save/Publish/Preview)               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                   API Layer                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Fastify Backend (TypeScript)                        │  │
│  │  - REST Routes (CRUD, Publish, Versions)            │  │
│  │  - WebSocket Handler (Real-time Collab)             │  │
│  │  - Auth & RBAC (Viewer/Editor/Admin)                │  │
│  │  - Caching & Cache Invalidation                     │  │
│  │  - Audit Logging                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ Prisma ORM
┌────────────────────▼────────────────────────────────────────┐
│                Data Layer                                   │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │   PostgreSQL         │  │   Redis                  │   │
│  │                      │  │                          │   │
│  │ - Portal             │  │ - Page Cache (5 min)     │   │
│  │ - User               │  │ - Portal Cache           │   │
│  │ - Page (puckData)    │  │ - Pub/Sub (WebSocket)    │   │
│  │ - PageVersion        │  │ - Session Store          │   │
│  │ - PageLayout         │  │                          │   │
│  │ - Theme              │  │                          │   │
│  │ - AuditLog           │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Timeline: 23 Days

```
Week 1: Foundation
├─ Day 1:  [████████░░] Phase 0: Compatibility Tests
├─ Day 2:  [██████████] Phase 1: Database Schema
├─ Day 3:  [████████░░] Phase 2: Components (Layout)
├─ Day 4:  [████████░░] Phase 2: Components (Content/Advanced)
└─ Day 5:  [████████░░] Phase 3: API Endpoints

Week 2: Core Features
├─ Day 6:  [████████░░] Phase 4: Editor UI (Layout)
├─ Day 7:  [████████░░] Phase 4: Editor UI (State/Preview)
├─ Day 8:  [████████░░] Phase 5: WebSocket Collaboration
├─ Day 9:  [████████░░] Phase 6-7: Responsive + Theming
└─ Day 10: [████████░░] Phase 8-9: Security + Analytics

Week 3: Polish & Launch
├─ Days 11-12: [████████░░] Phase 10: Performance
├─ Days 13-14: [████████░░] Phase 11: Testing
├─ Days 15+:   [████████░░] Phase 12: Deployment
└─ LAUNCH!

Legend:
  ████ = Code Writing
  ░░░░ = Testing/Review
```

---

## Component Ecosystem (13 Total)

```
                        ┌─ Layout Components (4)
                        │
                        ├─ Hero Section
                        │  └─ Props: title, subtitle, image, CTA
                        │
                        ├─ Section
                        │  └─ Props: title, children
                        │
                        ├─ Container
                        │  └─ Props: maxWidth, padding, bg
                        │
                        └─ Columns (2 or 3)
                           └─ Props: gap, responsive layout

                        ┌─ Content Components (4)
                        │
                        ├─ Text
                        │  └─ Props: content, font, color
                        │
                        ├─ Heading
                        │  └─ Props: text, level, styling
                        │
                        ├─ Image
                        │  └─ Props: src, alt, responsive
                        │
                        └─ Button
                           └─ Props: text, url, style

Puck Config             ┌─ Advanced Components (5)
(13 Widgets)            │
                        ├─ Carousel
                        │  └─ Auto-scroll, indicators
                        │
                        ├─ Testimonials
                        │  └─ Cards, ratings, avatars
                        │
                        ├─ Pricing Table
                        │  └─ Plans, features, CTA
                        │
                        ├─ FAQ Section
                        │  └─ Accordion, collapse
                        │
                        └─ Gallery
                           └─ Grid, lightbox, responsive

                        ┌─ CTA Components (2)
                        │
                        ├─ Newsletter
                        │  └─ Email form, validation
                        │
                        └─ Call-to-Action
                           └─ Flexible buttons + desc
```

---

## Data Model Relationships

```
┌─────────────┐
│   Portal    │ (Tenant)
│ ├─ name     │
│ └─ subdomain│
└──────┬──────┘
       │
       │ 1:N
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
   ┌──────────┐              ┌──────────────┐
   │  User    │              │   Page       │
   │├─ email  │              │ ├─ title     │
   │└─ role   │              │ ├─ slug      │
   └──────────┘              │ ├─ puckData* │
                              │ ├─ version  │
                              │ └─ isDraft  │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐  ┌────────────┐  ┌────────────────┐
            │  PageVersion │  │ PageLayout │  │  PageComponent │
            │├─ versionNo  │  │├─ name     │  │├─ componentId  │
            │├─ puckData   │  │├─ puckData │  │└─ count        │
            │└─ changeLog  │  │└─ featured │  └────────────────┘
            └──────────────┘  └────────────┘

Relationships:
  Portal 1:N User
  Portal 1:N Page
  Page 1:N PageVersion
  Page N:1 PageLayout
  Page 1:N PageComponent
  User 1:N PageVersion (via createdBy)
```

---

## API Request/Response Cycle

```
CREATE PAGE
────────────────────────────────────────────────

Frontend: useCreatePageMutation()
   │
   ▼
POST /api/v1/pages
   {
     portalId: "uuid",
     title: "Home",
     slug: "home",
     puckData: { root: {...}, zones: {...} }
   }
   │
   ▼ Backend: Create handler
Validate & Check Auth
   │
   ├─ Verify portalId matches JWT ✓
   ├─ Check role (editor+) ✓
   └─ Parse puckData ✓
   │
   ▼
Create Page in DB
   │
   ├─ Save Page record
   ├─ Set createdBy = user.id
   ├─ Set version = 1
   └─ Set isDraft = true
   │
   ▼
Invalidate Cache
   │
   ├─ DEL page:{portalId}:{pageId}
   ├─ DEL portal:{portalId}:pages
   └─ DEL portal:{portalId}:pages:drafts
   │
   ▼
Response 201 Created
   {
     id: "uuid",
     portalId: "uuid",
     title: "Home",
     slug: "home",
     puckData: {...},
     isDraft: true,
     version: 1,
     createdAt: "2025-11-14T10:00:00Z"
   }
   │
   ▼
Frontend: Update local state
   │
   ▼
UI: Show success toast
```

---

## Real-time Collaboration: Operational Transform

```
USER A                          SERVER                          USER B
────────────────────────────────────────────────────────────────────────

Edit Hero title:
{
  path: "components.hero.props.title",
  value: "New Title"
}
  │
  │ Send via WebSocket
  ├─────────────────────────────────────────────────────────────┐
  │                                                              │
  │                                          Edit Hero subtitle:
  │                                          {
  │                                            path: "components.hero.props.subtitle",
  │                                            value: "New Subtitle"
  │                                          }
  │                                            │
  │                                            │ Send via WebSocket
  │                                            ├──────────────────────┐
  │                                                                   │
  │◄─────── Transform Operations (OT Algorithm) ────────────────────►│
  │                                                                   │
  │  ✓ Different paths (title vs subtitle)                         │
  │  ✓ No conflict, apply both                                     │
  │  ✓ User A receives op from B (titleRx = New Subtitle)         │
  │  ✓ User B receives op from A (titleRx = New Title)            │
  │                                                                   │
  ▼                                                                   ▼

RESULT: Both changes applied correctly
  components.hero.props = {
    title: "New Title",
    subtitle: "New Subtitle"
  }
```

---

## Testing Pyramid

```
                          E2E Tests
                      (10% of effort)
                    ┌─────────────────┐
                    │  Playwright     │
                    │  • Full workflow│
                    │  • 2 browsers   │
                    │  • 5 scenarios  │
                    └─────────────────┘

              Integration Tests
          (30% of effort)
      ┌──────────────────────────────┐
      │  Jest + Supertest            │
      │  • API endpoints             │
      │  • Permissions               │
      │  • Cache behavior            │
      │  • Version history           │
      └──────────────────────────────┘

    Unit Tests
  (60% of effort)
┌──────────────────────────────────────┐
│ Jest + React Testing Library         │
│ • Component rendering               │
│ • Field validation                  │
│ • Hook behavior                     │
│ • Service functions                 │
└──────────────────────────────────────┘

Target: 80% Coverage
```

---

## Git Commit Strategy

```
Phase 0:
├─ chore: setup puck compatibility test
├─ test: verify puck loads in next.js
└─ test: verify api connectivity

Phase 1:
├─ feat: add puckData field to page model
├─ feat: create PageLayout table
├─ feat: create PageVersion table
└─ chore: run prisma migration

Phase 2:
├─ feat: implement hero component
├─ feat: implement text component
├─ feat: implement carousel component
└─ feat: complete puck config with 13 components

Phase 3:
├─ feat: add POST /api/v1/pages
├─ feat: add GET /api/v1/pages/:id
├─ feat: add PUT /api/v1/pages/:id
└─ feat: add DELETE /api/v1/pages/:id

Phase 4:
├─ feat: create page editor layout
├─ feat: add auto-save hook
├─ feat: add undo/redo system
└─ feat: create preview mode

Phase 5:
├─ feat: register websocket plugin
├─ feat: implement usePageWebSocket hook
├─ feat: add remote cursor display
└─ feat: implement OT conflict resolution

...and so on
```

---

## Performance Targets

```
Metric                    Target      Current    Status
─────────────────────────────────────────────────────────
Largest Contentful Paint  < 2.5s      TBD        ?
First Input Delay         < 100ms     TBD        ?
Cumulative Layout Shift   < 0.1       TBD        ?
Lighthouse Score          ≥ 90        TBD        ?
Bundle Size (gzip)        < 150KB     TBD        ?
API Latency (p95)         < 500ms     TBD        ?
WebSocket Latency         < 100ms     TBD        ?
Error Rate                < 1%        TBD        ?

Strategy:
  1. Image optimization (next/image, WebP)
  2. Code splitting (lazy load components)
  3. Redis caching (5 min TTL)
  4. Database indexing (on puckData, version)
  5. Compression (@fastify/compress)
  6. Tree shaking (production builds)
```

---

## Deployment Pipeline

```
Developer Push
    ↓
Git Commit → GitHub
    ↓
CI/CD Trigger
    ├─ npm run typecheck
    ├─ npm run test
    ├─ npm run lint
    ├─ npm run build
    └─ npm run test:e2e
    ↓
Build Docker Images
    ├─ backend:latest
    └─ frontend:latest
    ↓
Push to Registry
    ↓
Deploy to Staging
    ├─ Run smoke tests
    ├─ Check health endpoints
    └─ Monitor for 5 min
    ↓
Manual Approval
    ↓
Deploy to Production
    ├─ Rolling update (0 downtime)
    ├─ Monitor error rates
    └─ Alert on-call if > 5% errors
    ↓
Done! 🚀
```

---

## Daily Standup Format

```
Each Team Member (5 min each):

YESTERDAY:
  ✓ What was completed
  ✓ Tests passing/failing
  ✓ Code review status

TODAY:
  → What will be worked on
  → Expected completion
  → Any dependencies

BLOCKERS:
  ⚠ Any issues blocking progress?
  → What's needed to unblock?
  → Who can help?

METRICS:
  📊 Test coverage
  📊 Lines of code
  📊 Bugs filed/closed
  📊 Days remaining
```

---

## Success Checklist at Each Phase

```
Phase Completion Checklist:

BEFORE:
  □ Read phase description
  □ Review success criteria
  □ Check dependencies (prior phases complete)
  □ Create GitHub issue

DURING:
  □ Write code
  □ Add unit tests
  □ Run local tests
  □ Get code review

AFTER:
  □ All tests passing
  □ Coverage > 80% for new code
  □ Lighthouse score checked
  □ Documentation updated
  □ GitHub issue closed
  □ Demo in Friday standup

NEXT PHASE:
  □ Can proceed to next phase
  □ No blockers identified
```

---

## Emergency Response Plan

```
IF: Tests Fail in Production
THEN:
  1. Immediate rollback (< 5 min)
  2. Notify team (Slack alert)
  3. Investigate cause
  4. Fix in develop branch
  5. Re-test before redeployment

IF: WebSocket Crashes
THEN:
  1. Auto-reconnect triggers (client-side)
  2. Backoff: 3s → 10s → 30s
  3. Server monitors connection pool
  4. Alert if > 50% failed connections
  5. Page editor falls back to manual save

IF: Database Migration Fails
THEN:
  1. Rollback migration
  2. Restore from backup (< 1 hour RTO)
  3. Investigate schema issue
  4. Re-test migration locally
  5. Redeployment when ready

IF: Performance Degrades
THEN:
  1. Check cache hit rate (Grafana)
  2. Check DB slow queries (Datadog)
  3. Profile N+1 queries (Prisma)
  4. Increase caching or add indexes
  5. Monitor improvements
```

---

## Key Milestones

```
Week 1 END: ✓ MVP Functional
  ├─ All 13 components rendering
  ├─ CRUD API working
  ├─ Auto-save functional
  └─ Demo to stakeholders

Week 2 END: ✓ Real-time Collab
  ├─ WebSocket connections stable
  ├─ 2+ users editing simultaneously
  ├─ Responsive preview working
  └─ Performance baseline established

Week 3 END: ✓ Production Ready
  ├─ 80%+ test coverage
  ├─ Security audit passed
  ├─ Deployment tested
  └─ Documentation complete

Week 4: 🚀 LAUNCH
  ├─ Deploy to production
  ├─ Monitor metrics
  ├─ Support team ready
  └─ Celebrate! 🎉
```

---

**Visual Reference Version:** 1.0  
**Created:** November 14, 2025
