# Portal Management System - Implementation Guide

## 🚀 Quick Start

### Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/documentation
- **MinIO Console**: http://localhost:9001 (user: minioadmin, pass: minioadmin)

### Default Login
After seeding the database, use:
- **Email**: admin@example.com
- **Password**: Admin123!

## 📁 Project Structure

```
Cloud Project/
├── src/                        # Backend (Fastify + TypeScript)
│   ├── modules/               # Feature modules
│   │   ├── auth/             # JWT authentication
│   │   ├── pages/            # Page CRUD
│   │   ├── menus/            # Menu management
│   │   ├── storage/          # File uploads with Sharp
│   │   └── ...
│   ├── plugins/              # Fastify plugins
│   ├── utils/                # Utilities
│   │   └── imageProcessor.ts # Image optimization with Sharp
│   └── server.ts             # Server entry point
├── frontend/                  # Frontend (Next.js 16 + React 19)
│   ├── app/
│   │   ├── (auth)/           # Login/Register
│   │   ├── (portal)/dashboard/ # Main dashboard
│   │   │   ├── pages/        # Page management
│   │   │   ├── menus/        # Menu editor
│   │   │   ├── theme/        # Theme editor
│   │   │   ├── settings/     # Global settings
│   │   │   ├── global-content/ # Reusable blocks
│   │   │   └── assets/       # Asset manager
│   │   └── page.tsx          # Welcome page
│   ├── components/
│   │   ├── layouts/          # Layout components
│   │   └── PageRenderer.tsx  # Puck renderer
│   └── lib/
│       ├── puck/config.tsx   # 13 Puck widgets
│       ├── hooks/            # React Query hooks
│       └── stores/           # Zustand stores
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # 3 migrations applied
└── docker-compose.yml        # Container orchestration
```

## ✅ Implemented Features

### Phase 1: Foundation ✅
- [x] Fastify backend with TypeScript
- [x] Prisma ORM with PostgreSQL
- [x] Redis caching
- [x] JWT authentication
- [x] RBAC (Role-Based Access Control)
- [x] Multipart file upload
- [x] VPS storage abstraction (Local + S3-compatible MinIO)
- [x] Error handling & logging
- [x] Health check endpoints

### Phase 2: Core Features ✅
- [x] **Visual Page Builder** (Puck.js)
  - 13 drag-and-drop widgets
  - Real-time preview
  - Responsive viewport controls (Desktop/Tablet/Mobile)

- [x] **Page Management**
  - CRUD operations
  - Publish/unpublish
  - SEO fields (seoTitle, metaDescription, canonicalUrl, noIndex, noFollow)
  - Custom CSS/JS per page
  - i18n support (locale, translationOf)
  - Version history schema (UI placeholder ready)

- [x] **Menu System**
  - Drag-and-drop menu builder (@dnd-kit)
  - Hierarchical menu items
  - Role-based visibility (requiredRole field)
  - Visual editor

- [x] **Image Optimization**
  - Sharp library integrated
  - Automatic resize to multiple sizes (thumbnail, small, medium, large)
  - WebP conversion
  - Quality optimization (85% JPEG with mozjpeg)
  - Metadata extraction

### Phase 3: Advanced Features ✅
- [x] **Theme Editor** (/dashboard/theme)
  - Colors: Primary, Secondary, Accent, Background, Surface, Text, etc.
  - Typography: Font family, sizes, weights, line height
  - Spacing: xs, sm, md, lg, xl, xxl
  - Border Radius: sm, md, lg, xl, full
  - Shadows: sm, md, lg, xl
  - Live preview
  - Reset to default

- [x] **Global Settings** (/dashboard/settings)
  - Site name, description, logo, favicon
  - Timezone & locale
  - Google Tag Manager
  - Custom analytics code
  - Custom head/footer code injection
  - Maintenance mode

- [x] **Reusable Content Blocks** (/dashboard/global-content)
  - Create/edit/delete blocks
  - Categorization
  - Unique keys for referencing
  - Grid view interface

## 🎨 Puck.js Widgets (13 Total)

### Basic Widgets (Phase 1)
1. **Heading** - H1-H6 with alignment
2. **Text** - Paragraph with alignment
3. **Image** - Image with width control
4. **Button** - 3 variants (primary, secondary, outline)
5. **Section** - Container with background & padding
6. **Column** - Grid layout (1/4, 1/3, 1/2, 2/3, 3/4, full)

### Dynamic Widgets (Phase 2)
7. **PostList** - Latest posts with excerpt toggle
8. **Form** - Dynamic form builder with validation
9. **Slider** - Carousel with autoplay
10. **Tabs** - Tab interface

### Advanced Widgets (Phase 3)
11. **Hero Banner** - Full-width hero with CTA
12. **Counter** - Animated numbers with prefix/suffix
13. **Testimonial** - Star ratings, quotes, avatars

## 🗄️ Database Schema

### Key Models
- `Portal` - Multi-tenant portals
- `User` - Users with role-based access
- `Page` - Pages with SEO & custom code
- `Menu` & `MenuItem` - Hierarchical menus
- `Theme` - Theme tokens (JSON)
- `GlobalContent` - Reusable blocks
- `GlobalSettings` - Portal-wide settings
- `StorageFile` - File uploads tracking
- `AuditLog` - Audit trail

### New Fields (Phase 2/3)
**Page Model:**
- `seoTitle`, `canonicalUrl`, `noIndex`, `noFollow`, `structuredData`
- `customCss`, `customJs`
- `locale`, `translationOf`

**GlobalSettings Model:**
- `siteName`, `siteDescription`, `faviconUrl`, `logoUrl`
- `defaultLocale`, `timezone`
- `analyticsCode`, `googleTagManager`
- `customHeadCode`, `customFooterCode`
- `maintenanceMode`, `maintenanceMessage`

## 📝 Usage Guide

### 1. Setup & Seed Database
```bash
# Run migrations
docker exec portal-backend npx prisma migrate deploy

# Seed database
docker exec portal-backend npm run db:seed
```

### 2. Login
1. Go to http://localhost:3000
2. Click "Go to Login"
3. Select your portal from dropdown
4. Enter credentials (admin@example.com / Admin123!)

### 3. Create a Page
1. Navigate to Dashboard → Pages
2. Click "New Page"
3. Enter title and slug
4. Click "Edit" to open page builder
5. Drag widgets from left sidebar
6. Configure widget properties in right panel
7. Click "Publish"

### 4. Use Responsive Preview
1. In page editor, click viewport icons (Desktop/Tablet/Mobile)
2. Preview responsive layout
3. Adjust widget properties for each breakpoint

### 5. Configure SEO
1. In page editor, click "SEO Settings" tab
2. Enter SEO title, meta description
3. Set canonical URL
4. Toggle noIndex/noFollow as needed
5. Click "Save SEO Settings"

### 6. Add Custom Code
1. In page editor, click "Custom Code" tab
2. Add page-specific CSS in first textarea
3. Add page-specific JavaScript in second textarea
4. Click "Save Custom Code"

### 7. Customize Theme
1. Navigate to Dashboard → Theme
2. Adjust colors using color pickers
3. Modify typography settings
4. Update spacing and border radius
5. See live preview at bottom
6. Click "Save Theme"

### 8. Configure Global Settings
1. Navigate to Dashboard → Settings
2. Update site name, description, logo, favicon
3. Set timezone and locale
4. Add Google Tag Manager ID
5. Inject custom head/footer code
6. Enable maintenance mode if needed
7. Click "Save Settings"

### 9. Create Reusable Blocks
1. Navigate to Dashboard → Global Content
2. Click "New Block"
3. Enter name, unique key, category
4. Click "Create Block"
5. Edit block content
6. Reference in pages using the unique key

### 10. Upload Images
Images are automatically optimized:
```bash
curl -X POST http://localhost:3001/api/v1/storage/upload \
  -F "file=@image.jpg"
```

Response includes:
- Original optimized JPEG
- WebP version
- Multiple sizes (thumbnail, small, medium, large)
- All variants' URLs

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Pages
- `GET /api/v1/pages` - List pages
- `POST /api/v1/pages` - Create page
- `GET /api/v1/pages/:id` - Get page
- `PUT /api/v1/pages/:id` - Update page
- `DELETE /api/v1/pages/:id` - Delete page

### Menus
- `GET /api/v1/menus` - List menus
- `POST /api/v1/menus` - Create menu
- `PUT /api/v1/menus/:id/items/:itemId/reorder` - Reorder items

### Storage
- `POST /api/v1/storage/upload` - Upload file (with image optimization)
- `POST /api/v1/storage/presigned-url` - Get presigned URL
- `DELETE /api/v1/storage` - Delete file

### Health
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Full system info
- `GET /api/v1/health/ready` - Readiness probe
- `GET /api/v1/health/live` - Liveness probe

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# View logs
docker logs portal-backend
docker logs portal-frontend

# Restart services
docker-compose restart backend frontend

# Stop all services
docker-compose down

# Full rebuild
docker-compose down
docker-compose build
docker-compose up -d
```

## 🧪 Testing

### Backend Tests
```bash
docker exec portal-backend npm test
docker exec portal-backend npm run test:coverage
```

### Frontend Tests
```bash
docker exec portal-frontend npm test
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## 🎯 Feature Status

| Feature | Status | Location |
|---------|--------|----------|
| Visual Page Builder | ✅ Complete | /dashboard/pages/[id]/edit |
| 13 Puck Widgets | ✅ Complete | lib/puck/config.tsx |
| SEO Management | ✅ Complete | Page editor → SEO tab |
| Custom CSS/JS | ✅ Complete | Page editor → Custom Code tab |
| Responsive Preview | ✅ Complete | Page editor toolbar |
| Theme Editor | ✅ Complete | /dashboard/theme |
| Global Settings | ✅ Complete | /dashboard/settings |
| Reusable Blocks | ✅ Complete | /dashboard/global-content |
| Menu Builder | ✅ Complete | /dashboard/menus |
| Image Optimization | ✅ Complete | Backend (Sharp) |
| Multi-language (i18n) | ✅ Schema Ready | Database fields |
| Version History | ⏳ Placeholder | UI created, logic pending |
| Accessibility | ⚠️ Partial | Basic structure |

## 🔐 Security Features

- JWT with refresh tokens
- Password hashing with bcrypt
- Rate limiting (5 req/15min on auth endpoints)
- CORS protection
- Helmet security headers
- SQL injection protection (Prisma ORM)
- XSS prevention
- RBAC authorization

## 📊 Performance Optimizations

- Redis caching for frequently accessed data
- Image optimization with Sharp (JPEG + WebP)
- Multiple image sizes for responsive loading
- Database indexing on key fields
- Next.js static generation where possible
- CDN-ready asset URLs

## 🚨 Troubleshooting

### Issue: Containers won't start
```bash
docker-compose down
docker system prune -f
docker-compose build
docker-compose up -d
```

### Issue: Database connection error
```bash
# Check PostgreSQL is running
docker logs portal-postgres

# Reset database
docker exec portal-backend npx prisma migrate reset
```

### Issue: Frontend build errors
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Images not optimizing
```bash
# Check Sharp is installed
docker exec portal-backend npm ls sharp

# Rebuild backend
docker-compose build backend
docker-compose up -d backend
```

## 📝 Next Steps

To complete the remaining features:

1. **Version History Implementation**
   - Backend API for creating page snapshots
   - UI for browsing history
   - Restore functionality

2. **Accessibility Enhancements**
   - Alt text validation
   - ARIA label enforcement
   - Contrast ratio checking
   - Keyboard navigation testing

3. **Asset Browser Enhancement**
   - Grid view with thumbnails
   - Folder organization
   - Bulk operations
   - Search and filter

4. **Advanced Features**
   - Page templates
   - A/B testing
   - Analytics integration
   - Custom domains per portal

## 📄 License

MIT

## 🤝 Support

For issues or questions, check:
1. This guide
2. Docker logs: `docker logs portal-backend` / `docker logs portal-frontend`
3. API docs: http://localhost:3001/documentation
4. Database state: Connect to PostgreSQL on localhost:5432
