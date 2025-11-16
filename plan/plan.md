# AI Execution Plan: Next.js Page Builder Engine

**Objective:** To create a new, self-contained Next.js application named `my-page-builder` that functions as a decoupled page builder engine. This plan includes all necessary directory creation, file writing, and setup commands.

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
    mkdir "C:\Cloud Project\my-page-builder\app\api"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages\[id]"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages\ingest"
    mkdir "C:\Cloud Project\my-page-builder\app\api\data"
    mkdir "C:\Cloud Project\my-page-builder\app\api\data\products"
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

## Phase 2: Core Application Configuration

**Goal:** Create the essential configuration files for the Next.js project.

1.  **Create `package.json`**
    *   **Action:** Write the project's dependency and script definitions.
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
            "prisma:generate": "prisma generate"
          },
          "dependencies": {
            "@prisma/client": "^5.14.0",
            "grapesjs": "^0.21.10",
            "next": "14.2.3",
            "next-auth": "^4.24.7",
            "react": "^18.3.1",
            "react-dom": "^18.3.1"
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

2.  **Create `next.config.js`**
    *   **Action:** Write the Next.js configuration.
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\next.config.js`
    *   **Content:**
        ```js
        /** @type {import('next').NextConfig} */
        const nextConfig = {
          reactStrictMode: true,
        };

        module.exports = nextConfig;
        ```

3.  **Create `tsconfig.json`**
    *   **Action:** Write the TypeScript configuration.
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

4.  **Create `.env.local`**
    *   **Action:** Write placeholder environment variables.
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\.env.local`
    *   **Content:**
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
        EXTERNAL_API_KEY="your-secret-api-key"
        NEXTAUTH_URL="http://localhost:3000"
        NEXTAUTH_SECRET="your-nextauth-secret"
        ```

---

## Phase 3: Database and Library Setup

**Goal:** Create the Prisma schema and library helper files.

1.  **Create `prisma/schema.prisma`**
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
          createdAt DateTime @default(now())
          updatedAt DateTime @updatedAt
        }
        ```

2.  **Create `lib/prisma.ts`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\lib\prisma.ts`
    *   **Content:**
        ```ts
        import { PrismaClient } from '@prisma/client';

        export const prisma = new PrismaClient();
        ```

3.  **Create `lib/auth.ts`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\lib\auth.ts`
    *   **Content:**
        ```ts
        import { getServerSession as nextAuthGetServerSession } from 'next-auth';
        // Import your NextAuth configuration here
        // import { authOptions } from "@/app/api/auth/[...nextauth]/route";

        export async function getServerSession() {
          // Replace with the actual call including authOptions once defined
          return await nextAuthGetServerSession();
        }
        ```

---

## Phase 4: App Structure and API Routes

**Goal:** Create the core application layout, pages, and API endpoints.

1.  **Create `app/layout.tsx`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\layout.tsx`
    *   **Content:**
        ```tsx
        import './globals.css';
        import type { Metadata } from 'next';

        export const metadata: Metadata = {
          title: 'My Page Builder',
          description: 'Created with Next.js',
        };

        export default function RootLayout({
          children,
        }: {
          children: React.ReactNode;
        }) {
          return (
            <html lang="en">
              <body>{children}</body>
            </html>
          );
        }
        ```

2.  **Create `app/globals.css`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\globals.css`
    *   **Content:**
        ```css
        /* Add any global styles here */
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }
        ```

3.  **Create `app/api/pages/[id]/route.ts`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\api\pages\[id]\route.ts`
    *   **Content:**
        ```ts
        import { NextRequest, NextResponse } from 'next/server';
        import { prisma } from '@/lib/prisma';
        import { getServerSession } from '@/lib/auth';

        export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
          const session = await getServerSession();
          if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

          const page = await prisma.page.findUnique({ where: { id: params.id } });
          if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
          
          // GrapesJS expects a specific JSON structure for loading
          return NextResponse.json({ 'gjs-html': page.pageHtml, 'gjs-css': page.pageCss, 'gjs-components': page.pageData ? JSON.parse(page.pageData as string) : [] });
        }

        export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
          const session = await getServerSession();
          if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

          const body = await req.json();
          const { 'gjs-html': pageHtml, 'gjs-css': pageCss, 'gjs-components': pageData } = body;

          const updated = await prisma.page.update({
            where: { id: params.id },
            data: { 
              pageData: JSON.stringify(pageData), 
              pageHtml,
              pageCss 
            },
          });
          return NextResponse.json(updated);
        }
        ```

4.  **Create `app/api/pages/ingest/route.ts`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\api\pages\ingest\route.ts`
    *   **Content:**
        ```ts
        import { NextRequest, NextResponse } from 'next/server';
        import { prisma } from '@/lib/prisma';

        export async function POST(req: NextRequest) {
          const apiKey = req.headers.get('x-api-key');
          if (apiKey !== process.env.EXTERNAL_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

          const { slug, name, pageData, pageHtml, pageCss } = await req.json();

          const existing = await prisma.page.findUnique({ where: { slug } });
          if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });

          const page = await prisma.page.create({
            data: { slug, name, pageData, pageHtml, pageCss, source: 'external' },
          });

          return NextResponse.json(page);
        }
        ```

5.  **Create `app/api/data/products/route.ts`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\api\data\products\route.ts`
    *   **Content:**
        ```ts
        import { NextRequest, NextResponse } from 'next/server';

        export async function GET(req: NextRequest) {
          const products = [
            { id: 1, name: 'Product A', price: '$10' },
            { id: 2, name: 'Product B', price: '$15' },
          ];
          return NextResponse.json(products);
        }
        ```

---

## Phase 5: Component and Page Implementation

**Goal:** Create the React components and pages for the editor and public rendering.

1.  **Create `app/admin/editor/[id]/page.tsx`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\admin\editor\[id]\page.tsx`
    *   **Content:**
        ```tsx
        'use client';

        import Editor from '@/components/Editor';
        import { useParams } from 'next/navigation';

        export default function Page() {
          const params = useParams();
          const pageId = Array.isArray(params.id) ? params.id[0] : params.id;

          if (!pageId) {
            return <div>Loading...</div>;
          }

          return <Editor pageId={pageId} />;
        }
        ```

2.  **Create `components/Editor.tsx`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\components\Editor.tsx`
    *   **Content:**
        ```tsx
        'use client';

        import { useEffect } from 'react';
        import grapesjs from 'grapesjs';
        import 'grapesjs/dist/css/grapes.min.css';
        import '@/styles/editor.css';

        interface EditorProps {
          pageId: string;
        }

        export default function Editor({ pageId }: EditorProps) {
          useEffect(() => {
            const editor = grapesjs.init({
              container: '#gjs',
              fromElement: true,
              height: '100vh',
              width: 'auto',
              storageManager: {
                type: 'remote',
                urlLoad: `/api/pages/${pageId}`,
                urlStore: `/api/pages/${pageId}`,
                autosave: true,
                stepsBeforeSave: 1,
                params: { _method: 'PUT' }, // For frameworks that need method override
              },
              blockManager: {
                appendTo: '#blocks',
              },
            });

            editor.DomComponents.addType('product-list', {
              model: {
                defaults: {
                  script: function () {
                    fetch('/api/data/products')
                      .then(res => res.json())
                      .then(products => {
                        const list = products.map((p: any) => `<div>${p.name} - ${p.price}</div>`).join('');
                        this.innerHTML = `<div class="product-list-container">${list}</div>`;
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

            return () => {
              editor.destroy();
            };
          }, [pageId]);

          return (
            <div className="editor-container">
              <div id="blocks"></div>
              <div id="gjs"></div>
            </div>
          );
        }
        ```

3.  **Create `app/[slug]/page.tsx`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\app\[slug]\page.tsx`
    *   **Content:**
        ```tsx
        import { prisma } from '@/lib/prisma';
        import PageRenderer from '@/components/PageRenderer';
        import { notFound } from 'next/navigation';

        export default async function Page({ params }: { params: { slug: string } }) {
          const page = await prisma.page.findUnique({ where: { slug: params.slug } });
          
          if (!page) {
            return notFound();
          }

          // Option 1: Render from raw HTML/CSS (simple)
          if (page.pageHtml) {
            return (
              <>
                <style>{page.pageCss}</style>
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
        }
        ```

4.  **Create `components/PageRenderer.tsx`**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\components\PageRenderer.tsx`
    *   **Content:**
        ```tsx
        // This is a simplified example. A real implementation would need a more robust mapping.
        interface ComponentProps {
          type: string;
          content?: string;
          components?: ComponentProps[];
          attributes?: Record<string, any>;
        }

        const renderComponent = (props: ComponentProps, key: number) => {
          const { type, content, components, attributes } = props;
          const children = components?.map(renderComponent);

          switch (type) {
            case 'text':
              return <p key={key} {...attributes}>{content}{children}</p>;
            case 'image':
              return <img key={key} {...attributes} />;
            default:
              return <div key={key} {...attributes}>{content}{children}</div>;
          }
        };

        export default function PageRenderer({ components }: { components: ComponentProps[] }) {
          return <>{components.map(renderComponent)}</>;
        }
        ```

5.  **Create Placeholder and Style Files**
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\styles\editor.css`
    *   **Content:**
        ```css
        .editor-container {
          display: flex;
          height: 100vh;
          width: 100%;
        }
        #blocks {
          width: 250px;
          background-color: #f7f7f7;
          border-right: 1px solid #ddd;
        }
        #gjs {
          flex-grow: 1;
        }
        ```
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\styles\tailwind.css`
    *   **Content:** `/* Placeholder for Tailwind CSS */`
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\components\blocks\ProductListBlock.tsx`
    *   **Content:** `// This logic is now inside components/Editor.tsx for simplicity.`
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\components\ui\Button.tsx`
    *   **Content:** `// Placeholder for a reusable Button component.`

---

## Phase 6: Finalization

**Goal:** Install dependencies and generate the Prisma client.

1.  **Install Dependencies**
    *   **Action:** Run `npm install` to download all required packages.
    *   **Tool:** `run_shell_command`
    *   **Directory:** `C:\Cloud Project\my-page-builder`
    *   **Command:** `npm install`

2.  **Generate Prisma Client**
    *   **Action:** Generate the Prisma client from the schema.
    *   **Tool:** `run_shell_command`
    *   **Directory:** `C:\Cloud Project\my-page-builder`
    *   **Command:** `npx prisma generate`

---

## Phase 7: Verification

**Goal:** Ensure the application runs correctly.

*   **Action:** Start the development server.
*   **Tool:** `run_shell_command`
*   **Directory:** `C:\Cloud Project\my-page-builder`
*   **Command:** `npm run dev`
*   **Expected Outcome:** The Next.js application should start successfully. You can then proceed to set up the database, create a page record, and test the editor at `/admin/editor/[your-page-id]`.
