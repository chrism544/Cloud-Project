# Microsoft Entra Admin Center Implementation Research

**Date:** November 16, 2025
**Project:** Portal Management System
**Research Scope:** Safe integration of Material UI for Entra admin prototype
**Decision:** Isolated route group with MSW and custom MUI theme

---

## Executive Summary

This document contains comprehensive research for implementing a Microsoft Entra admin center prototype in the existing Next.js 16 application. The approved approach uses:

1. **Isolated route group** (`(entra)`) for complete separation from existing dashboard
2. **Mock Service Worker (MSW)** for realistic API mocking without backend changes
3. **Custom MUI theme** matching existing Tailwind design system
4. **CSS layer isolation** to prevent conflicts between MUI and Tailwind CSS v4
5. **Full CRUD prototype** with all three pages (Users, Groups, Devices) and modal interactions

**Risk Level:** LOW - Route group isolation ensures near-zero impact on existing functionality.

---

## Table of Contents

1. [Current Frontend Structure Analysis](#current-frontend-structure-analysis)
2. [Material UI + Tailwind CSS v4 Coexistence Strategy](#material-ui--tailwind-css-v4-coexistence-strategy)
3. [Recommended Route Structure](#recommended-route-structure)
4. [Potential Conflicts & Mitigation](#potential-conflicts--mitigation)
5. [Isolation Strategy](#isolation-strategy)
6. [MUI DataGrid Compatibility](#mui-datagrid-compatibility)
7. [Dependencies Analysis](#dependencies-analysis)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Risk Assessment](#risk-assessment)
10. [Mock Service Worker Strategy](#mock-service-worker-strategy)
11. [Custom Theme Requirements](#custom-theme-requirements)
12. [Testing Strategy](#testing-strategy)

---

## Current Frontend Structure Analysis

### App Router Organization

```
frontend/app/
├── layout.tsx (Root layout with Providers)
├── providers.tsx (React Query provider)
├── globals.css (Tailwind CSS v4)
├── (auth)/
│   ├── layout.tsx (Pass-through layout)
│   ├── login/
│   └── register/
├── (portal)/
│   ├── admin/
│   │   ├── layout.tsx (Uses DashboardLayout)
│   │   ├── page.tsx (Admin home)
│   │   ├── users/
│   │   └── themes/
│   └── dashboard/
│       ├── pages/
│       ├── menus/
│       ├── assets/
│       ├── builder/
│       ├── theme/
│       ├── settings/
│       └── global-content/
└── [slug]/ (Dynamic public pages)
```

### Key Technologies

- **Framework:** Next.js 16.0.1 (App Router)
- **React:** 19.2.0
- **Styling:** Tailwind CSS v4.1.17
- **State Management:** Zustand + React Query
- **Icons:** Lucide React
- **Page Builder:** Puck visual editor with 13+ widgets

### Existing Route Groups

1. `(auth)` - Authentication pages (login, register)
2. `(portal)` - Protected portal pages with nested admin and dashboard sections

### Critical Observations

- **DashboardLayout** component uses Tailwind extensively with 8 menu items
- **Puck page builder** is deeply integrated into dashboard/pages section
- **Zero TypeScript path alias conflicts** - Uses `@/*` prefix
- **Build tools:** Vite for dev, TypeScript strict mode enabled

---

## Material UI + Tailwind CSS v4 Coexistence Strategy

### Compatibility Status

#### ✅ Compatible Technologies

| Package | Version | React 19 Support | Next.js 16 Support | Status |
|---------|---------|------------------|--------------------| -------|
| `@mui/material` | 7.3.5 | ✅ Yes | ✅ Yes | Production Ready |
| `@mui/x-data-grid` | 8.5.1 | ✅ Yes | ✅ Yes | Production Ready |
| `@emotion/react` | 11.13.5 | ✅ Yes | ✅ Yes | Production Ready |
| `@emotion/styled` | 11.13.5 | ✅ Yes | ✅ Yes | Production Ready |

#### ⚠️ Known Issues

**Critical Issue:** `@mui/material-nextjs` does NOT support Next.js 16

- GitHub Issue #47109 confirms this blocker
- `@mui/material-nextjs/v16-appRouter` does not exist
- `AppRouterCacheProvider` causes errors with Next.js 16

**Solution:** Custom Emotion cache setup (more flexible and production-ready)

### CSS Conflict Prevention

#### Strategy: CSS Layers

Material UI v7 supports CSS layers via custom Emotion cache configuration. This prevents Tailwind from overriding MUI styles and vice versa.

**Layer Order:**
```css
@layer theme, base, mui, components, utilities;
```

- **theme:** Base theme variables
- **base:** Reset and base styles
- **mui:** Material UI component styles
- **components:** Custom component styles
- **utilities:** Tailwind utilities (highest priority)

This ensures Tailwind utilities can override MUI when needed, while preventing global conflicts.

#### Implementation

```typescript
// Custom Emotion cache with CSS layer support
const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    stylisPlugins: [
      (element) => {
        if (element.type === 'rule') {
          element.value = `@layer mui { ${element.value} }`;
        }
      }
    ]
  });
};
```

### Bundle Size Impact

**Estimated Additional Bundle Size:**

| Package | Gzipped Size | Notes |
|---------|-------------|-------|
| `@mui/material` | ~150 KB | Core components |
| `@mui/x-data-grid` | ~180 KB | DataGrid component |
| `@emotion/react` + `@emotion/styled` | ~30 KB | CSS-in-JS runtime |
| **Total** | **~360 KB** | Only loaded on Entra pages |

**Mitigation:**
- Route group isolation provides automatic code splitting
- MUI only loads when user navigates to `/entra-admin/*`
- Existing dashboard bundle remains unaffected

---

## Recommended Route Structure

### Approved Approach: Separate Route Group

```
frontend/app/
├── (entra)/                    # NEW - Isolated route group
│   ├── layout.tsx              # Entra-specific layout with MUI providers
│   ├── entra-admin/
│   │   ├── page.tsx            # Entra dashboard overview
│   │   ├── users/
│   │   │   └── page.tsx        # Users with MUI DataGrid
│   │   ├── groups/
│   │   │   └── page.tsx        # Groups with MUI DataGrid
│   │   └── devices/
│   │       └── page.tsx        # Devices with MUI DataGrid
```

### URL Structure

- Dashboard: `/entra-admin`
- Users: `/entra-admin/users`
- Groups: `/entra-admin/groups`
- Devices: `/entra-admin/devices`

### Why This Approach?

1. **Complete isolation** from existing Tailwind-based dashboard
2. **Separate layout** means separate CSS context
3. **Own MUI ThemeProvider** without affecting other pages
4. **Zero risk** to existing functionality (Puck builder, dashboard, etc.)
5. **Easy to remove** or replace if needed
6. **Automatic code splitting** via Next.js App Router

### Rejected Alternatives

❌ **Option 2:** Under existing `/admin` - Higher risk, nested layouts
❌ **Option 3:** Convert entire dashboard to MUI - Breaks Puck integration
❌ **Option 4:** Mix MUI + Tailwind on same pages - Complex CSS management

---

## Potential Conflicts & Mitigation

### 1. CSS Global Styles

**Risk:** Tailwind's global styles vs MUI's CSS-in-JS
**Severity:** Medium
**Probability:** Low

**Mitigation:**
- CSS layers (`@layer mui` vs `@layer utilities`)
- Exclude `(entra)` route from Tailwind content paths
- Use scoped styles in Entra layout

### 2. Bundle Size Increase

**Risk:** Adding ~360KB to bundle
**Severity:** Low
**Probability:** High

**Mitigation:**
- Route group provides automatic code splitting
- Tree-shake unused MUI components
- Only load DataGrid where needed
- Use dynamic imports for heavy modals

### 3. Next.js 16 Incompatibility

**Risk:** `@mui/material-nextjs` doesn't support Next.js 16
**Severity:** High
**Probability:** Low (with custom solution)

**Mitigation:**
- **DO NOT use** `@mui/material-nextjs`
- Use custom `ThemeRegistry` component
- Use `useServerInsertedHTML` hook manually
- Use `createCache` from `@emotion/cache`

### 4. TypeScript Path Aliases

**Risk:** Conflicts with existing `@/*` aliases
**Severity:** Low
**Probability:** Very Low

**Mitigation:** No changes needed - MUI doesn't interfere with path aliases

### 5. Icon Libraries

**Current:** Lucide React
**MUI:** Material Icons

**Mitigation:**
- Use `@mui/icons-material` only in Entra pages
- Keep Lucide React for existing dashboard
- No conflict - different packages

### 6. React Query/Zustand

**Risk:** State management conflicts
**Severity:** Low
**Probability:** Very Low

**Mitigation:** MUI works with any state management - continue using existing patterns

---

## Isolation Strategy

### Three-Layer Isolation Approach

#### Layer 1: Route Group Isolation

Create `(entra)` route group completely separate from `(portal)` and `(auth)`:

```typescript
// frontend/app/(entra)/layout.tsx
import { ThemeRegistry } from './ThemeRegistry';

export default function EntraLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      {children}
    </ThemeRegistry>
  );
}
```

#### Layer 2: Custom Theme Registry

```typescript
// frontend/app/(entra)/ThemeRegistry.tsx
'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const createEmotionCache = () => {
  return createCache({
    key: 'mui',
    stylisPlugins: [
      (element) => {
        if (element.type === 'rule') {
          element.value = `@layer mui { ${element.value} }`;
        }
      }
    ]
  });
};

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createEmotionCache());

  useServerInsertedHTML(() => {
    const names = cache.inserted;
    if (Object.keys(names).length === 0) return null;

    let styles = '';
    for (const name in names) {
      styles += names[name];
    }

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  const theme = createTheme({
    // Custom theme matching Tailwind will go here
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
```

#### Layer 3: CSS Scoping

```css
/* frontend/app/(entra)/entra-styles.css */
@layer theme, base, mui, components, utilities;

@layer mui {
  /* MUI styles injected here via Emotion */
}
```

#### Layer 4: Tailwind Config Exclusion

```typescript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "!./app/(entra)/**/*.{js,ts,jsx,tsx,mdx}", // Exclude Entra
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ...
}
```

---

## MUI DataGrid Compatibility

### Version Compatibility

- ✅ **React 19:** Officially supported (`^17.0.0 || ^18.0.0 || ^19.0.0`)
- ✅ **Next.js 16:** Works in App Router with `'use client'` directive
- ⚠️ **Known warnings:** React 19 warnings in DataGridPro/Premium (NOT in basic DataGrid)

### Required Package

Use `@mui/x-data-grid` (free version) - sufficient for Entra prototype

**Features included:**
- Sorting on all columns
- Column-based filtering
- Pagination (customizable rows per page)
- Selection (single/multi)
- Density controls
- Export to CSV
- Column visibility toggle
- Column reordering

### Critical Requirement

All DataGrid pages MUST use `'use client'` directive:

```typescript
'use client';

import { DataGrid } from '@mui/x-data-grid';

export default function UsersPage() {
  return <DataGrid /* ... */ />;
}
```

---

## Dependencies Analysis

### Required New Packages

```json
{
  "@mui/material": "^7.3.5",
  "@mui/x-data-grid": "^8.5.1",
  "@emotion/react": "^11.13.5",
  "@emotion/styled": "^11.13.5",
  "@emotion/cache": "^11.13.5",
  "@mui/icons-material": "^7.3.5",
  "msw": "^2.6.8",
  "@faker-js/faker": "^9.3.0"
}
```

### DO NOT INSTALL

❌ `@mui/material-nextjs` - Incompatible with Next.js 16

### Existing Packages (No Conflict)

- ✅ Tailwind CSS v4.1.17
- ✅ React 19.2.0
- ✅ Next.js 16.0.1
- ✅ React Query
- ✅ Zustand
- ✅ Lucide React

---

## Implementation Roadmap

### Phase 1: Setup & Configuration (Low Risk) ✅

1. Install MUI packages
2. Install MSW for API mocking
3. Create `(entra)` route group
4. Create custom `ThemeRegistry` component
5. Configure CSS layers
6. Extract Tailwind colors for MUI theme
7. Create Entra layout component

### Phase 2: Mock Data Layer (Zero Risk) ✅

1. Setup MSW with Next.js 16 App Router
2. Create data models (User, Group, Device interfaces)
3. Generate realistic mock data with Faker
4. Create MSW handlers for all CRUD operations
5. Test MSW integration in development

### Phase 3: Layout & Navigation (Isolated) ✅

1. Create `EntraLayout` with MUI AppBar and Drawer
2. Build navigation sidebar
3. Create dashboard overview page
4. Add responsive design for mobile/tablet

### Phase 4: Users Page (First Implementation) ✅

1. Create Users list page with DataGrid
2. Configure columns (Display Name, UPN, Email, Department, Status)
3. Add sorting and filtering
4. Add search bar
5. Implement pagination
6. Create User CRUD modals (Create, Edit, Delete)
7. Integrate with MSW handlers

### Phase 5: Groups & Devices Pages (Pattern Reuse) ✅

1. Build Groups page (same pattern)
2. Add Groups CRUD modals
3. Build Devices page (same pattern)
4. Add Devices CRUD modals

### Phase 6: UX Polish ✅

1. Add loading states (LinearProgress, Skeleton)
2. Add success/error notifications (Snackbar)
3. Improve interactivity (hover, transitions)
4. Add empty states
5. Keyboard shortcuts

### Phase 7: Testing ✅

1. Test Entra pages in isolation
2. Test existing dashboard (should be unaffected)
3. Test build and bundle size
4. Write component tests
5. Write integration tests

---

## Risk Assessment

| Risk | Severity | Probability | Mitigation | Status |
|------|----------|-------------|------------|--------|
| CSS conflicts | Medium | Low | CSS layers + route isolation | ✅ Mitigated |
| Bundle size | Low | High | Code splitting via route groups | ✅ Mitigated |
| Next.js 16 incompatibility | High | Low | Custom emotion cache | ✅ Mitigated |
| Breaking existing dashboard | Low | Very Low | Complete route isolation | ✅ Mitigated |
| TypeScript errors | Low | Low | Proper type definitions | ✅ Mitigated |
| Performance degradation | Low | Low | Only loads MUI on Entra pages | ✅ Mitigated |

**Overall Risk Level:** LOW ✅

The route group isolation strategy ensures near-zero risk to existing functionality.

---

## Mock Service Worker Strategy

### Why MSW Over JSON Files?

**Advantages:**
1. More realistic API simulation
2. Proper HTTP semantics (status codes, headers)
3. Request/response interception
4. Easier transition to real backend
5. Supports pagination, filtering, sorting
6. Can simulate errors and edge cases

### MSW Setup for Next.js 16

#### 1. Browser Handler

```typescript
// frontend/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

#### 2. Initialize in Development

```typescript
// frontend/app/(entra)/layout.tsx
'use client';

import { useEffect } from 'react';

if (process.env.NODE_ENV === 'development') {
  useEffect(() => {
    import('@/mocks/browser').then(({ worker }) => {
      worker.start();
    });
  }, []);
}
```

#### 3. Mock Handlers

```typescript
// frontend/mocks/handlers/users.ts
import { http, HttpResponse } from 'msw';
import { users } from '../data/users';

export const usersHandlers = [
  // List users with pagination
  http.get('/api/entra/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '25');
    const search = url.searchParams.get('search') || '';

    let filtered = users;
    if (search) {
      filtered = users.filter(u =>
        u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      limit
    });
  }),

  // Get single user
  http.get('/api/entra/users/:id', ({ params }) => {
    const user = users.find(u => u.id === params.id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  // Create user
  http.post('/api/entra/users', async ({ request }) => {
    const data = await request.json();
    const newUser = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Update user
  http.put('/api/entra/users/:id', async ({ params, request }) => {
    const data = await request.json();
    const user = users.find(u => u.id === params.id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ ...user, ...data });
  }),

  // Delete user
  http.delete('/api/entra/users/:id', ({ params }) => {
    const user = users.find(u => u.id === params.id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  })
];
```

### Data Generation with Faker

```typescript
// frontend/mocks/data/users.ts
import { faker } from '@faker-js/faker';

export const users = Array.from({ length: 100 }, () => ({
  id: faker.string.uuid(),
  displayName: faker.person.fullName(),
  userPrincipalName: faker.internet.email().toLowerCase(),
  email: faker.internet.email(),
  department: faker.helpers.arrayElement([
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
  ]),
  jobTitle: faker.person.jobTitle(),
  officeLocation: faker.location.city(),
  mobilePhone: faker.phone.number(),
  accountEnabled: faker.datatype.boolean(0.9), // 90% enabled
  createdDateTime: faker.date.past({ years: 2 }).toISOString(),
  lastSignInDateTime: faker.date.recent({ days: 30 }).toISOString()
}));
```

---

## Custom Theme Requirements

### Extract Tailwind Colors

From `frontend/app/globals.css` and `frontend/tailwind.config.ts`:

```typescript
// Tailwind theme colors to match
const tailwindColors = {
  primary: '#3b82f6', // blue-500
  secondary: '#6b7280', // gray-500
  success: '#10b981', // green-500
  error: '#ef4444', // red-500
  warning: '#f59e0b', // amber-500
  info: '#06b6d4', // cyan-500
  background: {
    default: '#ffffff',
    paper: '#f9fafb' // gray-50
  },
  text: {
    primary: '#111827', // gray-900
    secondary: '#6b7280' // gray-500
  }
};
```

### MUI Theme Configuration

```typescript
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#6b7280',
      light: '#9ca3af',
      dark: '#4b5563',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ef4444'
    },
    warning: {
      main: '#f59e0b'
    },
    success: {
      main: '#10b981'
    },
    info: {
      main: '#06b6d4'
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb'
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 8 // Match Tailwind's default
  },
  spacing: 8, // 8px base unit (matches Tailwind)
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  }
});
```

---

## Testing Strategy

### Component Tests

```typescript
// __tests__/entra/EntraLayout.test.tsx
import { render, screen } from '@testing-library/react';
import EntraLayout from '@/app/(entra)/entra-admin/layout';

describe('EntraLayout', () => {
  it('renders navigation menu', () => {
    render(<EntraLayout><div>Content</div></EntraLayout>);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/entra/users.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from '@/app/(entra)/entra-admin/users/page';

describe('Users Page', () => {
  it('loads and displays users', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it('opens create user modal', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    const newButton = screen.getByRole('button', { name: /new user/i });
    await user.click(newButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

- [ ] All three pages load without errors
- [ ] DataGrid sorting works on all columns
- [ ] Filtering works correctly
- [ ] Pagination controls work
- [ ] Search functionality works
- [ ] CRUD modals open and close
- [ ] Create/Edit/Delete actions trigger success notifications
- [ ] Existing dashboard loads normally
- [ ] Puck page builder still works
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Keyboard navigation works
- [ ] Build completes without errors
- [ ] Bundle size is acceptable

---

## Conclusions

### Approved Implementation Strategy

1. **Route Group Isolation:** Complete separation via `(entra)` route group
2. **Custom MUI Theme:** Match existing Tailwind design system
3. **Mock Service Worker:** Realistic API simulation without backend changes
4. **CSS Layer Strategy:** Prevent conflicts between MUI and Tailwind
5. **Full CRUD Prototype:** All three pages with modal interactions

### Success Criteria

- ✅ Entra admin center accessible at `/entra-admin/*`
- ✅ Zero impact on existing dashboard and Puck builder
- ✅ All three pages (Users, Groups, Devices) with DataGrid
- ✅ Full CRUD modals with MSW integration
- ✅ Custom theme matching Tailwind colors
- ✅ Comprehensive tests passing
- ✅ Bundle size under control (code splitting)
- ✅ Documentation complete

### Future Enhancements (Out of Scope)

- Real backend integration with existing `/api/v1/admin/*` endpoints
- Advanced RBAC (viewer/editor/admin permissions)
- Audit logging for user actions
- Export to Excel/PDF
- Bulk operations (bulk delete, bulk assign)
- Advanced filtering (date ranges, multi-select)
- User profile pages with detailed information
- Group membership management
- Device compliance reporting

---

## References

- [Material UI v7 Documentation](https://mui.com/material-ui/)
- [MUI DataGrid Documentation](https://mui.com/x/react-data-grid/)
- [Mock Service Worker Documentation](https://mswjs.io/)
- [Emotion CSS-in-JS](https://emotion.sh/)
- [Next.js 16 App Router](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [CSS Layers Specification](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)

---

**Research completed:** November 16, 2025
**Approved by:** User
**Implementation start:** Phase 1 (Package installation)
**Estimated completion:** 6-8 hours
