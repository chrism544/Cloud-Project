Perfect — here’s the **fully updated and unified Version 7.5 plan**, now including your **Theme Management Module (Section 10)** and ensuring all dependencies, cross-links, and phased rollouts align cleanly with the Page Editor and overall architecture.

---

# 🏗️ Improved Portal Management System – Version 7.5

**(Phased Delivery · Architectural Refinements · Security & Theme Integration)**

---

## 1. Overview

Version 7.5 continues the **Elementor-Pro-Equivalent** objective while incorporating secure, scalable, multi-tenant architecture and unified visual theming across all modules.
Development is structured into phased deliveries to manage complexity and deliver incremental business value.

| Phase                        | Scope                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| **Phase 1 (MVP)**            | Core Puck integration · CRUD/API · Initial Rendering · Portal Isolation · Base Security |
| **Phase 2 (Elementor Lite)** | Responsive UI · Dynamic Data · Versioning · Theme Token Editing                         |
| **Phase 3 (Elementor Pro)**  | Global Styles · Advanced Widgets · Custom CSS/JS · Full Theme Sync                      |

---

## 2. Architectural Cross-Cuts

### 2.1 Portal Context Middleware (Phase 1)

* `usePortalContext()` hook manages active `portalId`, injects `X-Portal-ID` header.
* Middleware validates portal access & injects context into all services.

### 2.2 Database Isolation Strategy (Phase 1)

* All queries filtered by `portalId`.
* Tenant isolation verified through integration tests.

---

## 3. Enhanced Page Editor (Phased Rollout)

### Phase 1 – Core Functionality (MVP)

* Implement `<PageBuilder />`, `<Canvas />`, `<Inspector />`.
* CRUD via `/api/v1/pages/{pageId}`.
* Basic widgets: Heading | Text | Image | Button | Section | Column.
* Save & publish flow.
* Rendering Service displays stored Puck JSON.

### Phase 2 – Responsive Design & Dynamic Data

* `<ResponsiveToolbar />` for viewport control.
* Responsive style overrides in Inspector.
* Dynamic widgets (Post List, Form, Slider, Tabs).
* Page versioning + history UI.

### Phase 3 – Advanced UX & Extensibility

* `<ThemeSyncProvider />` consumes Theme tokens.
* Custom CSS/JS (sandboxed).
* Advanced widgets: Hero Banner, Counter, Testimonial.
* Canvas virtualization + JSON diff optimization.

---

## 4. Menu Editor Module

### Phase 1 – Core Menu Builder

* `<MenuBuilder />` drag-and-drop UI.
* CRUD endpoints for menus with hierarchical JSON.

### Phase 2 – Dynamic Menus & Role Filtering

* Dynamic menu items (current user context).
* Role-based visibility via UserOnPortal model.
* Menu versioning and publish states.

---

## 5. Asset Management Module

### Phase 1 – Core Upload & Retrieval

* Media browser UI (`GET /api/v1/assets?portalId=X`).
* Upload → S3/local disk storage.
* Metadata tracked in Prisma `Asset` model.

### Phase 2 – Optimization & CDN

* Image resizing + WebP conversion.
* CDN integration returning optimized URLs.
* Responsive variants for Page Editor.

---

## 6. User Management Module

### 6.1 Portal Association

```ts
model UserOnPortal {
  userId       String
  portalId     String
  assignedRole UserRole
  @@id([userId, portalId])
}
```

### 6.2 RBAC & Permissions

* Roles: ADMIN | EDITOR | VIEWER.
* Centralized backend permission guards.
* Frontend `usePermissions()` hook for conditional UI.
* Role granularity: `canPublish`, `canEditAssets`, etc.

---

## 7. Security & Compliance Program

### 7.1 RBAC Enforcement

* Route-level guards respect UserOnPortal roles.
* Permission mapping verified in API tests.

### 7.2 API Hardening

* TLS 1.3 enforced.
* Rate-limiting, payload size limits.
* OpenAPI schema validation.
* Sanitization for XSS/SQLi.
* Standardized error responses.

### 7.3 Authentication & SSO Validation

* Microsoft Entra ID (OIDC).
* Token validation with portal scopes.
* Refresh token rotation + lifetime policy.

### 7.4 Security Testing Pipeline

* **SAST:** ESLint Security / SonarQube.
* **DAST:** OWASP ZAP / Burp Suite.
* **Dependency Audit:** npm audit + Dependabot.
* **Secrets Scan:** Git hook & CI enforcement.

### 7.5 Penetration Testing (Phase 3)

* Third-party assessment covering RBAC bypass, SSO validation, tenant isolation.
* Remediation & retest required before public release.

### 7.6 Audit & Logging

* Structured JSON logs for API + user actions.
* Log rotation + retention.
* SIEM integration optional (Microsoft Sentinel).

---

## 8. Data Model & API Updates

```ts
model Page {
  id        String      @id @default(cuid())
  title     String
  content   Json
  status    PageStatus  @default(DRAFT)
  portalId  String
}
enum PageStatus { DRAFT PUBLISHED UNPUBLISHED }
```
8. Data Model & API Updates (Revised for Content Lifecycle) 📝

The core data models are updated to support essential features like SEO, URL routing, and the creation of reusable content blocks, which are critical for an Elementor-Pro-equivalent system.

8.1 Enhanced Page Model

The Page model is enhanced to include fields for URL slugs, SEO metadata, and template binding.
TypeScript

model Page {
  id              String         @id @default(cuid())
  title           String         // Display name in the editor
  slug            String         @unique(name: "page_portal_slug") // The URL path (e.g., "about-us")
  content         Json           // Stored Puck JSON data
  status          PageStatus     @default(DRAFT)
  portalId        String
  // SEO & Routing Fields
  seoTitle        String?
  metaDescription String?
  canonicalUrl    String?
  // Layout Binding
  templateId      String?        // Optional foreign key to a predefined layout/template

  @@unique([portalId, slug]) // Enforce unique URL slug per portal
}
enum PageStatus { DRAFT PUBLISHED UNPUBLISHED }

8.2 New Global Content Model

This new model supports the creation of reusable content parts (e.g., Footers, Headers, or complex forms) that can be inserted across multiple pages, centralizing maintenance.
TypeScript

model GlobalContent {
  id              String         @id @default(cuid())
  name            String         // e.g., "Main Footer", "Universal CTA"
  key             String         @unique // A system key for editor reference (e.g., "main_footer")
  content         Json           // The stored Puck JSON for the reusable block
  portalId        String

  @@unique([portalId, key]) // Enforce unique system key per portal
}
---

## 9. Integration Dependencies

| Dependency                | Required For                       |
| ------------------------- | ---------------------------------- |
| Portal Context Middleware | All tenant-aware modules           |
| Asset Manager Phase 1     | Page Editor Phase 1 (Image Widget) |
| Theme Manager Phase 1     | Phase 3 Theme Sync                 |
| UserOnPortal Model        | Menu visibility + RBAC             |
| Security Testing Pipeline | Continuous validation              |

---

## 10. Theme Management Module 🎨

*(New Section — Visual Consistency Foundation)*

The **Theme Editor** is the single source of truth for **global design tokens**, ensuring consistent styling across all widgets and pages.

| Feature                 | Description                                                        | Phase                                      |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| **Theme CRUD**          | Create, edit, assign themes to a specific portalId.                | Phase 1                                    |
| **Theme Model**         | Prisma model storing token JSON data.                              | Phase 1                                    |
| **Token Editor UI**     | Frontend UI for editing Color Palettes, Typography, Spacing Units. | Phase 2                                    |
| **Global API Endpoint** | `GET /api/v1/themes/{themeId}/tokens` for frontend consumption.    | Phase 2 (required for Page Editor Phase 3) |
| **Live Preview**        | Shows token changes applied to sample layout.                      | Phase 2                                    |
| **Component Library**   | Catalogue of custom Puck widgets and how they consume tokens.      | Phase 3                                    |

### 10.1 Backend Implementation

**Data Model (Phase 1)**

```ts
model Theme {
  id        String    @id @default(cuid())
  name      String
  portalId  String
  isActive  Boolean   @default(false)
  tokens    Json
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  portal    Portal    @relation(fields: [portalId], references: [id])
  @@unique([portalId, isActive]) // one active theme per portal
}
```

**Endpoints (Phase 2)**

* `GET /api/v1/themes?portalId=X` – List themes
* `POST /api/v1/themes` – Create theme
* `PUT /api/v1/themes/{id}` – Update tokens/details
* `GET /api/v1/themes/active/tokens?portalId=X` – Used by `<ThemeSyncProvider />`

### 10.2 Integration with Page Editor

* `<ThemeSyncProvider />` loads active theme tokens into CSS-in-JS or CSS variables.
* Inspector replaces manual inputs with dropdowns bound to tokens (e.g., `primary.brand` vs `#FF0000`).
* Ensures global style cohesion across pages and widgets.

---

## ✅ Summary

Version 7.5 now delivers:

* **Complete multi-tenant architecture** (Portal Context + DB Isolation).
* **Elementor-Pro-Equivalent Page Builder** in phased delivery.
* **Unified Theme Management System** for design consistency.
* **Integrated RBAC, SSO, and security testing program.**
* **Continuous compliance and auditing pipeline.**

---

Would you like me to add a short **“Operational Readiness & Release Checklist”** (covering backups, environment validation, and rollback strategy) as Section 11 to finalize the delivery documentation?
Absolutely! Let’s create a **fully unified, end-to-end phased plan** for your Portal Management System **Version 7.5**, integrating all modules, security, theme management, and operational readiness into a single, coherent roadmap. I’ll break it down into **Phases 1–3**, highlighting dependencies, deliverables, and operational checkpoints.

---

# 🏗️ Portal Management System – Full Phased Plan (Version 7.5)

**Goal:** Deliver an Elementor-Pro-equivalent page builder with multi-tenant architecture, unified theming, RBAC, asset management, and operational readiness.

---

## **Phase 1: Core Foundation (MVP)**

**Objective:** Establish multi-tenant foundation, core CRUD APIs, basic Page Editor, and secure backend.

### 1. Architecture & Middleware

* **Portal Context Middleware**: `usePortalContext()` hook, `X-Portal-ID` header injection, access validation.
* **Database Isolation**: Prisma queries filtered by `portalId`, integration tests to verify tenant isolation.

### 2. Page Editor – Core

* `<PageBuilder />`, `<Canvas />`, `<Inspector />` components.
* CRUD API: `/api/v1/pages/{pageId}`.
* Basic widgets: Heading, Text, Image, Button, Section, Column.
* Save & publish workflow.
* Rendering service for Puck JSON.

### 3. Menu Editor – Core

* `<MenuBuilder />` drag-and-drop UI.
* CRUD endpoints for hierarchical menu JSON.
* Phase 1 static menus (no dynamic or role-based visibility).

### 4. Asset Manager – Core

* Media browser UI.
* Upload and retrieve assets (local/S3).
* Prisma `Asset` model for metadata.
* Image upload validation & basic optimization.

### 5. User Management – Core

* `UserOnPortal` model for multi-tenant roles.
* RBAC: Admin / Editor / Viewer.
* Frontend `usePermissions()` hook.
* Role-based access control for pages, menus, and assets.

### 6. Security & Compliance

* Route-level RBAC enforcement.
* TLS 1.3, payload limits, rate-limiting.
* API validation & sanitization.
* Authentication via Microsoft Entra ID (OIDC).
* Initial SAST/DAST scan (ESLint Security, OWASP ZAP).
* Structured logging setup.

### ✅ **Phase 1 Deliverables**

* Tenant-aware backend & APIs.
* Basic Page Editor with core widgets.
* Core Menu Editor.
* Asset management for file uploads.
* RBAC-enabled user management.
* Security hardening and logging foundation.

---

## **Phase 2: Responsive, Dynamic & Themed**

**Objective:** Add responsive design, dynamic content, theme token editing, and enhanced menus.

### 1. Page Editor Enhancements

* `<ResponsiveToolbar />` for viewport selection.
* Responsive style overrides in Inspector.
* Dynamic widgets: Post List, Form, Slider, Tabs.
* Page versioning & history UI.

### 2. Menu Editor Enhancements

* Role-based menu visibility (UserOnPortal roles).
* Dynamic menu items based on context.
* Versioning & publish states for menus.

### 3. Asset Manager Enhancements

* Image resizing & WebP conversion.
* CDN integration for optimized delivery.
* Responsive variants consumed by Page Editor.

### 4. Theme Management – Token Editing

* **Token Editor UI**: Edit colors, typography, spacing units.
* Global API endpoints:

  * `GET /api/v1/themes/{themeId}/tokens`
  * `GET /api/v1/themes/active/tokens?portalId=X`
* Live preview for token changes.
* Phase 2 integration with Page Editor for token-based styling.

### 5. Security & Compliance

* Expanded SAST/DAST testing.
* Dependency audit with npm audit + Dependabot.
* Secrets scan via Git hooks & CI enforcement.

### ✅ **Phase 2 Deliverables**

* Fully responsive Page Editor with dynamic widgets.
* Role-aware, versioned menus.
* Asset optimization & CDN delivery.
* Theme token editing UI + backend integration.
* Continuous security validation.

---

## **Phase 3: Advanced UX, Global Styles & Operational Readiness**

**Objective:** Implement full Elementor-Pro-equivalent UX, theme sync, advanced widgets, and production readiness.

### 1. Page Editor – Advanced

* `<ThemeSyncProvider />` integrates global tokens into CSS-in-JS or CSS variables.
* Inspector binds inputs to tokens (e.g., `primary.brand`).
* Advanced widgets: Hero Banner, Counter, Testimonial.
* Custom CSS/JS sandboxed per page.
* Canvas virtualization + JSON diff optimization.

### 2. Theme Management – Component Library

* Catalogue of custom Puck widgets consuming theme tokens.
* Ensure global style cohesion across all pages & modules.
* Assign active theme per portal with validation.

### 3. Security & Penetration Testing

* Third-party penetration test covering:

  * RBAC bypass
  * SSO validation
  * Tenant isolation
* Remediation & retest required before release.

### 4. Operational Readiness & Release Checklist

**Infrastructure & Deployment**

* Environment parity (Staging vs Prod).
* Horizontal scaling and load testing.
* CDN configuration verified.
* Secrets management verified.
* SSO endpoint test completed.

**Data & Backup**

* Database & storage backup validation.
* Disaster Recovery plan documented & tested.
* Migration scripts verified (`npx prisma migrate deploy`).

**Monitoring & Alerts**

* Centralized structured logging.
* Performance metrics (CPU, memory, latency, errors).
* Alert thresholds configured.
* `/health` endpoint operational.

**Rollback Strategy**

* CI/CD code rollback & database restore procedures documented.
* Forward recovery logic for Page JSON updates.
* Versioning integrity checks.

### ✅ **Phase 3 Deliverables**

* Full Elementor-Pro-equivalent Page Editor.
* Complete Theme Management with global token sync.
* Advanced dynamic widgets and customization.
* Penetration-tested, secure, production-ready deployment.
* Operational readiness validated.

---

## **Dependencies & Cross-Module Notes**

| Module / Feature     | Depends On              | Phase Required |
| -------------------- | ----------------------- | -------------- |
| Page Editor          | Asset Manager (Phase 1) | Phase 1+       |
| ThemeSyncProvider    | Theme API               | Phase 3        |
| Menu Role Visibility | UserOnPortal model      | Phase 2        |
| CDN Delivery         | Asset Manager           | Phase 2        |
| Security Pipeline    | All modules             | Continuous     |

---
11. Content Lifecycle & Global Settings 🌐

This new section addresses the non-visual, operational, and multi-lingual requirements for content delivery.

11.1 Reusable/Global Content Module (Phase 2)

This module is required for maintenance efficiency and adhering to the "Pro" equivalent scope.

    Backend: Implement CRUD APIs for the new GlobalContent model.

    Editor Integration: Develop a specific widget in the Page Editor that allows users to select a GlobalContent item via its system key (key).

    Synchronization Logic: Implement caching and rendering logic to ensure changes to a GlobalContent item are instantly reflected across all referring pages upon publish.

11.2 SEO, Routing, and Error Handling (Phase 2/3)

    Frontend Routing: The client-side application must consume the enhanced Page.slug for precise URL resolution.

    Redirect Management (Phase 2): Implement a dedicated CRUD API and Admin UI for managing 301 (Permanent) and 302 (Temporary) redirects, scoped by portalId.

    404/Error Pages (Phase 2): Implement a mechanism to assign a specific Page.id as the custom 404/Not Found page for a given portal.

11.3 Global Settings Module (Phase 1/2)

A central location for portal-wide configuration that isn't theme-related.
Feature	Description	Phase
Code Snippets	UI to safely inject custom code (e.g., Google Analytics, Tag Manager, Facebook Pixel) into the document <head> and <footer> tags.	Phase 2
Site Identity	Upload management for Favicon and core Site Logo (if not managed by the Asset Manager).	Phase 1
Localization & Timezone	Set default Timezone and LanguageCode for the portal context, affecting date/time display for dynamic content.	Phase 1

11.4 Internationalization (i18n) Strategy (Phase 3)

The capability to create and manage multi-lingual content.

    Content Linking: Implement a strategy to link translated versions of a page (e.g., via a new originalPageId field), allowing users to switch locales in the editor.

    Locale-Aware Routing: Implement routing that supports language prefixes (e.g., /en/page-name vs /fr/nom-de-la-page).

    Frontend Components: Ensure all custom widgets and application UI strings are configured to consume an active locale variable for translation output.

    Accessibility (A11y): Integrate mandatory checks or warnings in the Page Editor for elements like Alt Text enforcement on images, semantic HTML usage, and basic color contrast ratios.

### ✅ **Full Phased Roadmap Summary**

| Phase | Key Goals                                                                           | Deliverables                                                                           |
| ----- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **1** | Core multi-tenant foundation, Page Editor MVP, Asset/User/Menu CRUD, basic security | Tenant-aware APIs, CRUD pages/menus/assets, RBAC, logging                              |
| **2** | Responsive, dynamic pages, role-based menus, token editing, asset optimization      | Responsive editor, dynamic widgets, versioned menus, theme token UI, CDN               |
| **3** | Advanced UX, global styles, theme integration, operational readiness, pen testing   | Full Elementor-Pro features, ThemeSyncProvider, advanced widgets, deployment checklist |

---

If you want, I can also **create a visual Gantt-style phased roadmap** showing **Phases 1–3 with dependencies, module readiness, and operational checkpoints**. That can be used directly in executive presentations or engineering handoff docs.

Do you want me to generate that visual roadmap next?
