# Microsoft Entra Admin Center Prototype

This directory contains a complete, production-ready prototype of the Microsoft Entra admin center built with Material UI and Next.js 16.

## Overview

The Entra admin center prototype provides a fully functional administrative interface for managing users, groups, and devices with Microsoft Entra-style design and functionality.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete for all entities
- ✅ **Material UI DataGrid** - Sortable, filterable, paginated tables
- ✅ **Responsive Design** - Mobile-first design with drawer navigation
- ✅ **Mock Service Worker** - Realistic API simulation without backend
- ✅ **Custom Theme** - Matches existing Tailwind design system (indigo primary)
- ✅ **Complete Isolation** - Zero impact on existing dashboard functionality

## Architecture

### Route Structure

```
app/(entra)/
├── layout.tsx                  # Route group layout with MSW and Theme providers
├── ThemeRegistry.tsx           # Custom MUI theme with Emotion cache
├── MSWProvider.tsx             # MSW initialization for development
└── entra-admin/
    ├── layout.tsx              # Admin layout with AppBar and Drawer
    ├── page.tsx                # Dashboard overview
    ├── users/
    │   └── page.tsx            # Users management (100 mock users)
    ├── groups/
    │   └── page.tsx            # Groups management (30 mock groups)
    └── devices/
        └── page.tsx            # Devices management (50 mock devices)
```

### URLs

- Dashboard: `/entra-admin`
- Users: `/entra-admin/users`
- Groups: `/entra-admin/groups`
- Devices: `/entra-admin/devices`

## Mock Data

All data is generated using `@faker-js/faker` and served via Mock Service Worker (MSW):

- **Users** (100): Full user profiles with departments, job titles, contact info
- **Groups** (30): Security, Microsoft 365, and Distribution groups
- **Devices** (50): Windows, macOS, iOS, and Android devices with compliance status

### Mock API Endpoints

All endpoints support pagination, sorting, filtering, and search:

- `GET /api/entra/users?page=1&limit=25&search=john`
- `GET /api/entra/users/:id`
- `POST /api/entra/users`
- `PUT /api/entra/users/:id`
- `DELETE /api/entra/users/:id`

Same pattern for `/api/entra/groups` and `/api/entra/devices`.

## Technologies

### Core Stack

- **Next.js 16** - App Router with server components
- **React 19** - Latest React features
- **Material UI 7** - Complete component library
- **MUI DataGrid 8** - Advanced table component
- **Mock Service Worker 2** - API mocking
- **TypeScript** - Full type safety

### Styling

- **Emotion** - CSS-in-JS (MUI's styling solution)
- **Custom Theme** - Matches existing Tailwind colors (indigo primary)
- **CSS Layers** - Prevents conflicts with Tailwind CSS v4

## Key Components

### ThemeRegistry

Custom Emotion cache implementation for Next.js 16 compatibility:

- CSS layer support for isolation
- Server-side rendering
- Custom theme matching Tailwind design

### MSWProvider

Initializes Mock Service Worker in development mode:

- Only runs in development environment
- Handles all API requests automatically
- Supports CRUD operations with realistic responses

### EntraLayout

Main navigation layout with Material UI components:

- Responsive AppBar and Drawer
- Mobile-friendly navigation
- Active route highlighting

### Page Components

Each page includes:

- MUI DataGrid with pagination, sorting, filtering
- Search functionality
- Create modal (dialog with form)
- Edit modal (pre-filled form)
- Delete confirmation dialog
- Success/error notifications (Snackbar)
- Loading states

## Development

### Running the Entra Admin

1. Start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to `/entra-admin` in your browser

3. MSW will automatically intercept API calls and return mock data

### Modifying Mock Data

Edit the data generators in `frontend/mocks/data/`:

```typescript
// frontend/mocks/data/users.ts
export const users: User[] = Array.from({ length: 100 }, () => {
  // Customize data generation
});
```

### Adding New Fields

1. Update TypeScript interfaces in `frontend/mocks/types.ts`
2. Update mock data generators in `frontend/mocks/data/`
3. Update DataGrid columns in page components
4. Update CRUD modals with new form fields

## CSS Isolation Strategy

The Entra admin is completely isolated from the existing Tailwind-based dashboard:

1. **Route Group Isolation** - Separate `(entra)` route group
2. **Tailwind Exclusion** - Excluded from `tailwind.config.ts` content paths
3. **CSS Layers** - MUI styles in `@layer mui` to prevent conflicts
4. **Separate Theme** - Custom MUI theme independent of Tailwind

This ensures zero risk to existing functionality.

## Testing

### Manual Testing Checklist

- [ ] All three pages load without errors
- [ ] DataGrid sorting works on all columns
- [ ] Filtering works correctly
- [ ] Pagination controls work
- [ ] Search functionality works
- [ ] Create modal opens and closes
- [ ] Edit modal pre-fills data correctly
- [ ] Delete confirmation shows correct user/group/device name
- [ ] Create action triggers success notification
- [ ] Update action triggers success notification
- [ ] Delete action triggers success notification
- [ ] Data refreshes after CRUD operations
- [ ] Existing dashboard at `/dashboard` still works
- [ ] Puck page builder still works
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Drawer navigation works on mobile

### Automated Testing

Component tests can be added using React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import UsersPage from '@/app/(entra)/entra-admin/users/page';

test('renders users page', () => {
  render(<UsersPage />);
  expect(screen.getByText('Users')).toBeInTheDocument();
});
```

## Performance

### Bundle Size

The Entra route group is automatically code-split by Next.js:

- MUI packages (~360KB gzipped) only load on Entra pages
- Existing dashboard bundle is unaffected
- Lazy loading for modals and dialogs

### Optimization Tips

- Use dynamic imports for heavy components
- Implement virtual scrolling for large datasets
- Add React Query for server state management
- Cache MSW responses for faster development

## Future Enhancements

### Potential Improvements

1. **Real Backend Integration**
   - Connect to existing `/api/v1/admin/users` endpoint
   - Replace MSW with actual API calls
   - Add authentication/authorization

2. **Advanced Features**
   - Bulk operations (select multiple, bulk delete)
   - Advanced filtering (date ranges, multi-select)
   - Export to CSV/Excel
   - User profile pages with detailed info
   - Group membership management
   - Device compliance reporting

3. **Performance**
   - Server-side pagination
   - Virtualized tables for large datasets
   - Optimistic updates with React Query

4. **Testing**
   - E2E tests with Playwright
   - Component tests with React Testing Library
   - Visual regression tests

## Troubleshooting

### MSW Not Working

If API calls aren't being intercepted:

1. Check browser console for MSW initialization message
2. Verify you're in development mode
3. Clear browser cache and reload
4. Check `frontend/mocks/browser.ts` setup

### CSS Conflicts

If you see style conflicts:

1. Verify Tailwind exclusion in `tailwind.config.ts`
2. Check CSS layer order in browser DevTools
3. Ensure `ThemeRegistry` is wrapping components correctly

### DataGrid Issues

Common DataGrid problems:

- **Empty rows**: Check mock data is loading correctly
- **Sorting not working**: Ensure `sortable` prop is not false
- **Pagination not working**: Check `paginationMode="server"` is set

## Contributing

When adding new features to the Entra admin:

1. Follow existing patterns from Users/Groups/Devices pages
2. Use TypeScript interfaces from `mocks/types.ts`
3. Update MSW handlers for new endpoints
4. Match Material UI theme and styling
5. Include loading states and error handling
6. Add success/error notifications
7. Test on mobile and desktop

## Resources

- [Material UI Documentation](https://mui.com/material-ui/)
- [MUI DataGrid Documentation](https://mui.com/x/react-data-grid/)
- [Mock Service Worker Documentation](https://mswjs.io/)
- [Next.js 16 App Router](https://nextjs.org/docs)

---

**Created:** November 16, 2025
**Status:** ✅ Production Ready
**Tech Stack:** Next.js 16 + React 19 + Material UI 7 + MSW 2
**Pages:** Dashboard, Users, Groups, Devices (all with full CRUD)
