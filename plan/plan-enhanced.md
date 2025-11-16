# AI Execution Plan: Next.js Page Builder Engine (Enhanced)

**Objective:** To create a new, self-contained Next.js application named `my-page-builder` that functions as a decoupled page builder engine with caching, error handling, and compatibility testing.

---

## Phase 0: Compatibility Testing (NEW)

**Goal:** Verify GrapesJS works with Next.js 14 before full implementation.

1. **Create Test Component**
   * **Tool:** `write_file`
   * **Path:** `C:\Cloud Project\my-page-builder\components\TestGrapes.tsx`
   * **Content:**
     ```tsx
     'use client';
     import { useEffect, useState } from 'react';

     export default function TestGrapes() {
       const [status, setStatus] = useState('Loading...');

       useEffect(() => {
         if (typeof window !== 'undefined') {
           import('grapesjs').then((grapesjs) => {
             try {
               const editor = grapesjs.default.init({
                 container: '#gjs-test',
                 height: '300px',
                 width: 'auto',
               });
               setStatus('✅ GrapesJS loaded successfully');
               console.log('GrapesJS loaded successfully');
             } catch (err) {
               setStatus('❌ GrapesJS initialization failed');
               console.error('GrapesJS failed:', err);
             }
           }).catch(err => {
             setStatus('❌ GrapesJS import failed');
             console.error('GrapesJS import failed:', err);
           });
         }
       }, []);

       return (
         <div>
           <h2>GrapesJS Compatibility Test</h2>
           <p>Status: {status}</p>
           <div id="gjs-test" style={{ border: '1px solid #ccc', minHeight: '300px' }}></div>
         </div>
       );
     }
     ```

2. **Create Test Page**
   * **Tool:** `write_file`
   * **Path:** `C:\Cloud Project\my-page-builder\app\test\page.tsx`
   * **Content:**
     ```tsx
     import TestGrapes from '@/components/TestGrapes';

     export default function TestPage() {
       return (
         <div style={{ padding: '20px' }}>
           <TestGrapes />
         </div>
       );
     }
     ```

---

## Phase 1: Directory Scaffolding

**Goal:** Create the complete directory structure for the new application.

*   **Action:** Execute a shell command to create all necessary directories at once.
*   **Tool:** `run_shell_command`
*   **Command:**
    ```powershell
    mkdir "C:\Cloud Project\my-page-builder"
    mkdir "C:\Cloud Project\my-page-builder\app"
    mkdir "C:\Cloud Project\my-page-builder\app\admin"
    mkdir "C:\Cloud Project\my-page-builder\app\admin\editor"
    mkdir "C:\Cloud Project\my-page-builder\app\admin\editor\[id]"
    mkdir "C:\Cloud Project\my-page-builder\app\test"
    mkdir "C:\Cloud Project\my-page-builder\app\api"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages\[id]"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages\ingest"
    mkdir "C:\Cloud Project\my-page-builder\app\api\data"
    mkdir "C:\Cloud Project\my-page-builder\app\api\data\products"
    mkdir "C:\Cloud Project\my-page-builder\app\api\health"
    mkdir "C:\Cloud Project\my-page-builder\app\[slug]"
    mkdir "C:\Cloud Project\my-page-builder\components"
    mkdir "C:\Cloud Project\my-page-builder\components\blocks"
    mkdir "C:\Cloud Project\my-page-builder\components\ui"
    mkdir "C:\Cloud Project\my-page-builder\lib"
    mkdir "C:\Cloud Project\my-page-builder\prisma"
    mkdir "C:\Cloud Project\my-page-builder\public"
    mkdir "C:\Cloud Project\my-page-builder\public\assets"
    mkdir "C:\Cloud Project\my-page-builder\styles"
    ```

---

## Phase 2: Core Application Configuration (Enhanced)

**Goal:** Create the essential configuration files for the Next.js project with caching and error handling.

1.  **Create `package.json` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\package.json`
    *   **Content:**
        ```json
        {
          "name": "my-page-builder",
          "version": "0.1.0",
          "private": true,
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint",
            "prisma:generate": "prisma generate",
            "prisma:migrate": "prisma migrate dev",
            "prisma:reset": "prisma migrate reset --force"
          },
          "dependencies": {
            "@prisma/client": "^5.14.0",
            "grapesjs": "^0.21.10",
            "next": "14.2.3",
            "next-auth": "^4.24.7",
            "react": "^18.3.1",
            "react-dom": "^18.3.1",
            "redis": "^4.6.13"
          },
          "devDependencies": {
            "@types/node": "^20.12.12",
            "@types/react": "^18.3.3",
            "@types/react-dom": "^18.3.0",
            "eslint": "^8.57.0",
            "eslint-config-next": "14.2.3",
            "postcss": "^8.4.38",
            "prisma": "^5.14.0",
            "tailwindcss": "^3.4.3",
            "typescript": "^5.4.5"
          }
        }
        ```

2.  **Create `next.config.js` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\next.config.js`
    *   **Content:**
        ```js
        /** @type {import('next').NextConfig} */
        const nextConfig = {
          reactStrictMode: true,
          transpilePackages: ['grapesjs'],
          experimental: {
            serverComponentsExternalPackages: ['grapesjs']
          },
          webpack: (config) => {
            config.resolve.fallback = {
              ...config.resolve.fallback,
              fs: false,
            };
            return config;
          },
        };

        module.exports = nextConfig;
        ```

3.  **Create `tsconfig.json`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\tsconfig.json`
    *   **Content:**
        ```json
        {
          "compilerOptions": {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": true,
            "skipLibCheck": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "noEmit": true,
            "esModuleInterop": true,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "jsx": "preserve",
            "incremental": true,
            "paths": {
              "@/*": ["./*"]
            }
          },
          "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
          "exclude": ["node_modules"]
        }
        ```

4.  **Create `.env.local` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\.env.local`
    *   **Content:**
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/pagebuilder?schema=public"
        REDIS_URL="redis://localhost:6379"
        EXTERNAL_API_KEY="your-secret-api-key"
        NEXTAUTH_URL="http://localhost:3000"
        NEXTAUTH_SECRET="your-nextauth-secret"
        NODE_ENV="development"
        ```

---

## Phase 3: Database and Library Setup (Enhanced)

**Goal:** Create the Prisma schema with caching and error handling utilities.

1.  **Create `prisma/schema.prisma` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\prisma\schema.prisma`
    *   **Content:**
        ```prisma
        generator client {
          provider = "prisma-client-js"
        }

        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model Page {
          id        String   @id @default(cuid())
          slug      String   @unique
          name      String
          pageData  Json?
          pageHtml  String?
          pageCss   String?
          source    String?
          published Boolean  @default(false)
          createdAt DateTime @default(now())
          updatedAt DateTime @updatedAt
          
          @@index([slug])
          @@index([published])
        }

        model Cache {
          id        String   @id @default(cuid())
          key       String   @unique
          value     Json
          expiresAt DateTime
          createdAt DateTime @default(now())
          
          @@index([key])
          @@index([expiresAt])
        }
        ```

2.  **Create `lib/prisma.ts`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\lib\prisma.ts`
    *   **Content:**
        ```ts
        import { PrismaClient } from '@prisma/client';

        const globalForPrisma = globalThis as unknown as {
          prisma: PrismaClient | undefined;
        };

        export const prisma = globalForPrisma.prisma ?? new PrismaClient();

        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
        ```

3.  **Create `lib/cache.ts` (NEW)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\lib\cache.ts`
    *   **Content:**
        ```ts
        import { prisma } from './prisma';

        export class CacheManager {
          static async get<T>(key: string): Promise<T | null> {
            try {
              const cached = await prisma.cache.findUnique({
                where: { key },
              });

              if (!cached || cached.expiresAt < new Date()) {
                if (cached) await prisma.cache.delete({ where: { key } });
                return null;
              }

              return cached.value as T;
            } catch (error) {
              console.error('Cache get error:', error);
              return null;
            }
          }

          static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
            try {
              const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
              
              await prisma.cache.upsert({
                where: { key },
                update: { value, expiresAt },
                create: { key, value, expiresAt },
              });
            } catch (error) {
              console.error('Cache set error:', error);
            }
          }

          static async delete(key: string): Promise<void> {
            try {
              await prisma.cache.delete({ where: { key } });
            } catch (error) {
              console.error('Cache delete error:', error);
            }
          }
        }
        ```

4.  **Create `lib/env.ts` (NEW)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\lib\env.ts`
    *   **Content:**
        ```ts
        export const requiredEnvVars = {
          DATABASE_URL: process.env.DATABASE_URL,
          EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        };

        export function validateEnv() {
          const missing = Object.entries(requiredEnvVars)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

          if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
          }
        }
        ```

5.  **Create `components/ErrorBoundary.tsx` (NEW)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\components\ErrorBoundary.tsx`
    *   **Content:**
        ```tsx
        'use client';
        import { Component, ReactNode } from 'react';

        interface Props {
          children: ReactNode;
          fallback?: ReactNode;
        }

        interface State {
          hasError: boolean;
          error?: Error;
        }

        export default class ErrorBoundary extends Component<Props, State> {
          constructor(props: Props) {
            super(props);
            this.state = { hasError: false };
          }

          static getDerivedStateFromError(error: Error): State {
            return { hasError: true, error };
          }

          componentDidCatch(error: Error, errorInfo: any) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
          }

          render() {
            if (this.state.hasError) {
              return this.props.fallback || (
                <div className="p-4 border border-red-300 bg-red-50 rounded">
                  <h2 className="text-red-800 font-semibold">Something went wrong</h2>
                  <p className="text-red-600">{this.state.error?.message}</p>
                </div>
              );
            }

            return this.props.children;
          }
        }
        ```

---

## Phase 4: App Structure and API Routes (Enhanced)

**Goal:** Create the core application layout, pages, and API endpoints with caching.

1.  **Create `app/layout.tsx` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\layout.tsx`
    *   **Content:**
        ```tsx
        import './globals.css';
        import type { Metadata } from 'next';
        import ErrorBoundary from '@/components/ErrorBoundary';
        import { validateEnv } from '@/lib/env';

        // Validate environment on startup
        validateEnv();

        export const metadata: Metadata = {
          title: 'My Page Builder',
          description: 'Created with Next.js and GrapesJS',
        };

        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode;
        }) {
          return (
            <html lang="en">
              <body>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </body>
            </html>
          );
        }
        ```

2.  **Create `app/api/health/route.ts` (NEW)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\api\health\route.ts`
    *   **Content:**
        ```ts
        import { NextResponse } from 'next/server';
        import { prisma } from '@/lib/prisma';

        export async function GET() {
          try {
            await prisma.$queryRaw`SELECT 1`;
            return NextResponse.json({ 
              status: 'ok', 
              timestamp: new Date().toISOString(),
              database: 'connected'
            });
          } catch (error) {
            return NextResponse.json({ 
              status: 'error', 
              timestamp: new Date().toISOString(),
              database: 'disconnected',
              error: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
          }
        }
        ```

3.  **Create `app/api/pages/[id]/route.ts` (Enhanced with Caching)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\api\pages\[id]\route.ts`
    *   **Content:**
        ```ts
        import { NextRequest, NextResponse } from 'next/server';
        import { prisma } from '@/lib/prisma';
        import { CacheManager } from '@/lib/cache';
        import { getServerSession } from '@/lib/auth';

        export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
          try {
            const session = await getServerSession();
            if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

            // Try cache first
            const cacheKey = `page:${params.id}`;
            const cached = await CacheManager.get(cacheKey);
            if (cached) {
              return NextResponse.json(cached);
            }

            const page = await prisma.page.findUnique({ where: { id: params.id } });
            if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
            
            const response = { 
              'gjs-html': page.pageHtml || '', 
              'gjs-css': page.pageCss || '', 
              'gjs-components': page.pageData ? JSON.parse(page.pageData as string) : [] 
            };

            // Cache for 5 minutes
            await CacheManager.set(cacheKey, response, 300);
            
            return NextResponse.json(response);
          } catch (error) {
            console.error('GET /api/pages/[id] error:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
          }
        }

        export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
          try {
            const session = await getServerSession();
            if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

            const body = await req.json();
            const { 'gjs-html': pageHtml, 'gjs-css': pageCss, 'gjs-components': pageData } = body;

            const updated = await prisma.page.update({
              where: { id: params.id },
              data: { 
                pageData: JSON.stringify(pageData), 
                pageHtml,
                pageCss,
                updatedAt: new Date()
              },
            });

            // Invalidate cache
            await CacheManager.delete(`page:${params.id}`);
            await CacheManager.delete(`public:${updated.slug}`);

            return NextResponse.json(updated);
          } catch (error) {
            console.error('PUT /api/pages/[id] error:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
          }
        }
        ```

4.  **Create `app/[slug]/page.tsx` (Enhanced with Caching)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\[slug]\page.tsx`
    *   **Content:**
        ```tsx
        import { prisma } from '@/lib/prisma';
        import { CacheManager } from '@/lib/cache';
        import PageRenderer from '@/components/PageRenderer';
        import { notFound } from 'next/navigation';

        export const revalidate = 300; // Revalidate every 5 minutes

        export default async function Page({ params }: { params: { slug: string } }) {
          try {
            // Try cache first
            const cacheKey = `public:${params.slug}`;
            let page = await CacheManager.get<any>(cacheKey);

            if (!page) {
              page = await prisma.page.findUnique({ 
                where: { slug: params.slug, published: true } 
              });
              
              if (!page) return notFound();
              
              // Cache for 1 hour
              await CacheManager.set(cacheKey, page, 3600);
            }

            // Option 1: Render from raw HTML/CSS (simple)
            if (page.pageHtml) {
              return (
                <>
                  <style dangerouslySetInnerHTML={{ __html: page.pageCss || '' }} />
                  <div dangerouslySetInnerHTML={{ __html: page.pageHtml }} />
                </>
              );
            }

            // Option 2: Render from JSON (advanced, more flexible)
            if (page.pageData) {
              const pageDataJson = JSON.parse(page.pageData as string);
              return <PageRenderer components={pageDataJson} />;
            }

            return <div>This page is empty.</div>;
          } catch (error) {
            console.error('Error rendering page:', error);
            return <div>Error loading page</div>;
          }
        }
        ```

---

## Phase 5: Component and Page Implementation (Enhanced)

**Goal:** Create the React components and pages for the editor with proper error handling.

1.  **Create `components/Editor.tsx` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\components\Editor.tsx`
    *   **Content:**
        ```tsx
        'use client';

        import { useEffect, useState } from 'react';
        import ErrorBoundary from './ErrorBoundary';

        interface EditorProps {
          pageId: string;
        }

        export default function Editor({ pageId }: EditorProps) {
          const [isLoaded, setIsLoaded] = useState(false);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
            if (typeof window !== 'undefined') {
              Promise.all([
                import('grapesjs'),
                import('grapesjs/dist/css/grapes.min.css')
              ]).then(([grapesjs]) => {
                try {
                  const editor = grapesjs.default.init({
                    container: '#gjs',
                    fromElement: true,
                    height: '100vh',
                    width: 'auto',
                    storageManager: {
                      type: 'remote',
                      urlLoad: `/api/pages/${pageId}`,
                      urlStore: `/api/pages/${pageId}`,
                      autosave: true,
                      stepsBeforeSave: 3,
                      params: { _method: 'PUT' },
                    },
                    blockManager: {
                      appendTo: '#blocks',
                    },
                    styleManager: {
                      appendTo: '#styles',
                    },
                    layerManager: {
                      appendTo: '#layers',
                    },
                    traitManager: {
                      appendTo: '#traits',
                    },
                  });

                  // Add custom blocks
                  editor.DomComponents.addType('product-list', {
                    model: {
                      defaults: {
                        script: function () {
                          fetch('/api/data/products')
                            .then(res => res.json())
                            .then(products => {
                              const list = products.map((p: any) => 
                                `<div class="product-item">${p.name} - ${p.price}</div>`
                              ).join('');
                              this.innerHTML = `<div class="product-list-container">${list}</div>`;
                            })
                            .catch(err => {
                              this.innerHTML = '<div class="error">Failed to load products</div>';
                            });
                        },
                      },
                    },
                  });

                  editor.BlockManager.add('product-list-block', {
                    label: 'Product List',
                    category: 'Dynamic',
                    content: { type: 'product-list' },
                  });

                  setIsLoaded(true);

                  return () => {
                    try {
                      editor.destroy();
                    } catch (e) {
                      console.warn('Error destroying editor:', e);
                    }
                  };
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to initialize editor');
                }
              }).catch(err => {
                setError('Failed to load GrapesJS');
                console.error('GrapesJS load error:', err);
              });
            }
          }, [pageId]);

          if (error) {
            return (
              <div className="p-4 border border-red-300 bg-red-50 rounded">
                <h2 className="text-red-800 font-semibold">Editor Error</h2>
                <p className="text-red-600">{error}</p>
              </div>
            );
          }

          return (
            <ErrorBoundary>
              <div className="editor-container">
                <div className="editor-sidebar">
                  <div id="blocks"></div>
                  <div id="styles"></div>
                  <div id="layers"></div>
                  <div id="traits"></div>
                </div>
                <div id="gjs">
                  {!isLoaded && <div className="loading">Loading editor...</div>}
                </div>
              </div>
            </ErrorBoundary>
          );
        }
        ```

2.  **Create `styles/editor.css` (Enhanced)**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\styles\editor.css`
    *   **Content:**
        ```css
        .editor-container {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        .editor-sidebar {
          width: 300px;
          background-color: #f7f7f7;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
        }

        .editor-sidebar > div {
          flex: 1;
          border-bottom: 1px solid #ddd;
          overflow-y: auto;
        }

        #gjs {
          flex-grow: 1;
          position: relative;
        }

        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 18px;
          color: #666;
        }

        .error {
          color: #dc3545;
          padding: 10px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }

        .product-list-container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .product-item {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .product-item:last-child {
          border-bottom: none;
        }
        ```

---

## Phase 6: Finalization (Enhanced)

**Goal:** Install dependencies, generate Prisma client, and run compatibility test.

1.  **Install Dependencies**
    *   **Tool:** `run_shell_command`
    *   **Directory:** `C:\Cloud Project\my-page-builder`
    *   **Command:** `npm install`

2.  **Generate Prisma Client**
    *   **Tool:** `run_shell_command`
    *   **Directory:** `C:\Cloud Project\my-page-builder`
    *   **Command:** `npx prisma generate`

3.  **Run Database Migration**
    *   **Tool:** `run_shell_command`
    *   **Directory:** `C:\Cloud Project\my-page-builder`
    *   **Command:** `npx prisma migrate dev --name init`

4.  **Start Development Server**
    *   **Tool:** `run_shell_command`
    *   **Directory:** `C:\Cloud Project\my-page-builder`
    *   **Command:** `npm run dev`

5.  **Test Compatibility**
    *   Navigate to `http://localhost:3000/test`
    *   Verify GrapesJS loads without errors
    *   Check browser console for any issues

---

## Phase 7: Additional Improvements

**Goal:** Add performance monitoring and additional features.

1. **Performance Monitoring**
   - Add page load time tracking
   - Monitor cache hit rates
   - Log slow queries

2. **Security Enhancements**
   - Rate limiting on API endpoints
   - Input validation and sanitization
   - CSRF protection

3. **Backup Strategy**
   - Automated database backups
   - Page version history
   - Export/import functionality

4. **Monitoring Dashboard**
   - System health metrics
   - Cache performance
   - User activity logs

---

## Success Criteria

- ✅ GrapesJS loads without errors in test environment
- ✅ Pages can be created, edited, and saved
- ✅ Public pages render correctly with caching
- ✅ API endpoints respond within 200ms (cached)
- ✅ Database queries are optimized with indexes
- ✅ Error handling prevents crashes
- ✅ Cache hit rate > 80% for public pages

This enhanced plan addresses all compatibility concerns, adds robust caching, error handling, and provides a solid foundation for a production-ready page builder.