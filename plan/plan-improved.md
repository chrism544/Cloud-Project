# AI Execution Plan: Next.js Page Builder Engine (Improved)

**Objective:** To create a comprehensive, enterprise-ready Next.js page builder with enhanced security, a streamlined developer experience, and production-grade capabilities. This plan has been improved based on a detailed review.

---

## Phase 0: Compatibility Testing

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
             } catch (err) {
               setStatus(`❌ GrapesJS initialization failed: ${err}`);
             }
           }).catch(err => {
             setStatus(`❌ GrapesJS import failed: ${err}`);
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

---

## Phase 1: Directory Scaffolding (Enhanced)

**Goal:** Create complete directory structure including advanced features.

*   **Command:** 
    ```powershell
    mkdir "C:\Cloud Project\my-page-builder"
    mkdir "C:\Cloud Project\my-page-builder\app"
    mkdir "C:\Cloud Project\my-page-builder\app\admin"
    mkdir "C:\Cloud Project\my-page-builder\app\admin\editor\[id]"
    mkdir "C:\Cloud Project\my-page-builder\app\admin\templates"
    mkdir "C:\Cloud Project\my-page-builder\app\admin\assets"
    mkdir "C:\Cloud Project\my-page-builder\app\test"
    mkdir "C:\Cloud Project\my-page-builder\app\api"
    mkdir "C:\Cloud Project\my-page-builder\app\api\pages\[id]"
    mkdir "C:\Cloud Project\my-page-builder\app\api\templates"
    mkdir "C:\Cloud Project\my-page-builder\app\api\assets"
    mkdir "C:\Cloud Project\my-page-builder\app\api\websocket"
    mkdir "C:\Cloud Project\my-page-builder\app\api\analytics"
    mkdir "C:\Cloud Project\my-page-builder\app\api\health"
    mkdir "C:\Cloud Project\my-page-builder\app\[slug]"
    mkdir "C:\Cloud Project\my-page-builder\components"
    mkdir "C:\Cloud Project\my-page-builder\components\blocks"
    mkdir "C:\Cloud Project\my-page-builder\components\blocks\advanced"
    mkdir "C:\Cloud Project\my-page-builder\components\ui"
    mkdir "C:\Cloud Project\my-page-builder\components\editor"
    mkdir "C:\Cloud Project\my-page-builder\lib"
    mkdir "C:\Cloud Project\my-page-builder\lib\integrations"
    mkdir "C:\Cloud Project\my-page-builder\prisma"
    mkdir "C:\Cloud Project\my-page-builder\public\assets"
    mkdir "C:\Cloud Project\my-page-builder\styles"
    mkdir "C:\Cloud Project\my-page-builder\sdk"
    mkdir "C:\Cloud Project\my-page-builder\server"
    ```

---

## Phase 2: Core Application Configuration (Improved)

**Goal:** Create the essential configuration files for the Next.js project.

1. **Create `.env.local`**
    *   **Action:** Write placeholder environment variables, including the new WebSocket URL.
    *   **Tool:** `write_file`
    *   **Path:** `C:\Cloud Project\my-page-builder\.env.local`
    *   **Content:**
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
        NEXTAUTH_URL="http://localhost:3000"
        NEXTAUTH_SECRET="your-nextauth-secret"
        
        # WebSocket Server URL
        NEXT_PUBLIC_WEBSOCKET_URL="http://localhost:3001"
        
        # Add other secrets here (e.g., Cloudinary)
        CLOUDINARY_URL="your-cloudinary-url"
        ```

2. **Create Enhanced Prisma Schema**
   * **Path:** `C:\Cloud Project\my-page-builder\prisma\schema.prisma`
   * **Content:**
     ```prisma
     generator client {
       provider = "prisma-client-js"
     }

     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }

     model User {
       id        String   @id @default(cuid())
       email     String   @unique
       name      String?
       role      Role     @default(EDITOR)
       createdAt DateTime @default(now())
       updatedAt DateTime @updatedAt
       
       pages     Page[]
       sessions  Session[]
       
       @@index ([email])
     }

     model Page {
       id          String   @id @default(cuid())
       slug        String   @unique
       name        String
       description String?
       pageData    Json?
       pageHtml    String?
       pageCss     String?
       seoMeta     Json?
       source      String?
       published   Boolean  @default(false)
       templateId  String?
       authorId    String?
       createdAt   DateTime @default(now())
       updatedAt   DateTime @updatedAt
       
       author      User?         @relation(fields: [authorId], references: [id])
       template    Template?     @relation(fields: [templateId], references: [id])
       versions    PageVersion[]
       analytics   Analytics[]
       
       @@index ([slug])
       @@index ([published])
       @@index ([authorId])
     }

     model PageVersion {
       id        String   @id @default(cuid())
       pageId    String
       version   Int
       pageData  Json
       pageHtml  String?
       pageCss   String?
       message   String?
       createdAt DateTime @default(now())
       
       page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
       
       @@unique ([pageId, version])
       @@index ([pageId])
     }

     model Template {
       id          String   @id @default(cuid())
       name        String
       description String?
       preview     String?
       categoryId  String?
       pageData    Json
       pageHtml    String?
       pageCss     String?
       tags        String[]
       featured    Boolean  @default(false)
       createdAt   DateTime @default(now())
       updatedAt   DateTime @updatedAt
       
       category    TemplateCategory? @relation(fields: [categoryId], references: [id])
       pages       Page[]
       
       @@index ([categoryId])
       @@index ([featured])
     }

     model TemplateCategory {
       id          String     @id @default(cuid())
       name        String     @unique
       description String?
       templates   Template[]
     }

     model Asset {
       id        String    @id @default(cuid())
       filename  String
       originalName String
       mimeType  String
       size      Int
       url       String
       cdnUrl    String?
       tags      String[]
       metadata  Json?
       createdAt DateTime  @default(now())
       
       @@index ([mimeType])
       @@index ([tags])
     }

     model Session {
       id        String   @id @default(cuid())
       userId    String
       pageId    String?
       socketId  String?
       isActive  Boolean  @default(true)
       lastSeen  DateTime @default(now())
       createdAt DateTime @default(now())
       
       user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
       
       @@index ([userId])
       @@index ([pageId])
       @@index ([isActive])
     }

     model Analytics {
       id        String   @id @default(cuid())
       pageId    String
       event     String
       data      Json?
       userAgent String?
       ip        String?
       createdAt DateTime @default(now())
       
       page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
       
       @@index ([pageId])
       @@index ([event])
       @@index ([createdAt])
     }

     model Cache {
       id        String   @id @default(cuid())
       key       String   @unique
       value     Json
       expiresAt DateTime
       createdAt DateTime @default(now())
       
       @@index ([key])
       @@index ([expiresAt])
     }

     enum Role {
       ADMIN
       EDITOR
       VIEWER
     }
     ```

3. **Improved package.json**
   * **Content:**
     ```json
     {
       "name": "my-page-builder",
       "version": "0.1.0",
       "private": true,
       "scripts": {
         "dev": "concurrently \"next dev\" \"npm run websocket\"",
         "build": "next build",
         "start": "next start",
         "lint": "next lint",
         "prisma:generate": "prisma generate",
         "prisma:migrate": "prisma migrate dev",
         "prisma:reset": "prisma migrate reset --force",
         "websocket": "node server/websocket.js"
       },
       "dependencies": {
         "@prisma/client": "^5.14.0",
         "grapesjs": "^0.21.10",
         "next": "14.2.3",
         "next-auth": "^4.24.7",
         "react": "^18.3.1",
         "react-dom": "^18.3.1",
         "socket.io": "^4.7.5",
         "socket.io-client": "^4.7.5",
         "sharp": "^0.33.4",
         "redis": "^4.6.13",
         "zod": "^3.23.8",
         "framer-motion": "^11.2.10",
         "react-hook-form": "^7.51.5",
         "@hookform/resolvers": "^3.6.0"
       },
       "devDependencies": {
         "@types/node": "^20.12.12",
         "@types/react": "^18.3.3",
         "@types/react-dom": "^18.3.0",
         "@types/socket.io": "^3.0.2",
         "concurrently": "^8.2.2",
         "eslint": "^8.57.0",
         "eslint-config-next": "14.2.3",
         "postcss": "^8.4.38",
         "prisma": "^5.14.0",
         "tailwindcss": "^3.4.3",
         "typescript": "^5.4.5"
       }
     }
     ```

---

## Phase 3: Core Editor API (Restored and Improved)

**Goal:** Implement the essential save/load API for the GrapesJS editor.

1. **Create Page Save/Load API**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\pages\[id]\route.ts`
   * **Content:**
     ```ts
     import { NextRequest, NextResponse } from 'next/server';
     import { prisma } from '@/lib/prisma';
     import { getServerSession } from 'next-auth'; // Assuming next-auth setup
     import { Role } from '@prisma/client';

     // This would be configured in your [...nextauth] route
     // import { authOptions } from '@/app/api/auth/[...nextauth]/route';

     export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
       const session = await getServerSession(/* authOptions */);
       if (!session?.user) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
       }

       const page = await prisma.page.findUnique({ where: { id: params.id } });
       if (!page) {
         return NextResponse.json({ error: 'Page not found' }, { status: 404 });
       }
       
       return NextResponse.json({
         'gjs-html': page.pageHtml,
         'gjs-css': page.pageCss,
         'gjs-components': page.pageData, // Return JSON object directly
       });
     }

     export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
       const session = await getServerSession(/* authOptions */);
       if (!session?.user || (session.user as any).role === Role.VIEWER) {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
       }

       const body = await req.json();
       const { 'gjs-html': pageHtml, 'gjs-css': pageCss, 'gjs-components': pageData } = body;

       const updated = await prisma.page.update({
         where: { id: params.id },
         data: { 
           pageData: pageData, // Store JSON object directly
           pageHtml,
           pageCss 
         },
       });
       return NextResponse.json(updated);
     }
     ```

---

## Phase 4: Asset Management System (Improved Security)

1. **Asset Upload API (with Auth)**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\assets\route.ts`
   * **Content:**
     ```ts
     import { NextRequest, NextResponse } from 'next/server';
     import { prisma } from '@/lib/prisma';
     import { getServerSession } from 'next-auth';
     import { Role } from '@prisma/client';
     // import { authOptions } from '@/app/api/auth/[...nextauth]/route';
     // import { uploadToCloudinary } from '@/lib/cloudinary';
     import sharp from 'sharp';

     export async function POST(req: NextRequest) {
       const session = await getServerSession(/* authOptions */);
       if (!session?.user || !([Role.ADMIN, Role.EDITOR].includes((session.user as any).role))) {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
       }

       try {
         const formData = await req.formData();
         const file = formData.get('file') as File;
         
         if (!file) {
           return NextResponse.json({ error: 'No file provided' }, { status: 400 });
         }

         const buffer = Buffer.from(await file.arrayBuffer());
         const optimized = await sharp(buffer)
           .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
           .webp({ quality: 85 })
           .toBuffer();

         // const cdnResult = await uploadToCloudinary(optimized, file.name);
         const cdnResult = { secure_url: `/uploads/${file.name}`, width: 1024, height: 768, format: 'webp' }; // Placeholder

         const asset = await prisma.asset.create({
           data: {
             filename: `${Date.now()}-${file.name}`,
             originalName: file.name,
             mimeType: file.type,
             size: optimized.length,
             url: cdnResult.secure_url,
             cdnUrl: cdnResult.secure_url,
             metadata: {
               width: cdnResult.width,
               height: cdnResult.height,
               format: cdnResult.format
             }
           }
         });

         return NextResponse.json(asset);
       } catch (error) {
         console.error('Asset upload error:', error);
         return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
       }
     }
     // ... (GET handler remains the same)
     ```

---

## Phase 5: Template System 
_(No changes from previous plan)_

---

## Phase 6: Real-time Collaboration (Improved Config)

1. **WebSocket Server**
   * **Path:** `C:\Cloud Project\my-page-builder\server\websocket.js`
   * _(Content remains the same)_

2. **Collaboration Hook (with Environment Variable)**
   * **Path:** `C:\Cloud Project\my-page-builder\lib\useCollaboration.ts`
   * **Content:**
     ```ts
     import { useEffect, useState } from 'react';
     import { io, Socket } from 'socket.io-client';

     interface User {
       userId: string;
       userName: string;
     }

     const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

     export function useCollaboration(pageId: string, userId: string, userName: string) {
       const [socket, setSocket] = useState<Socket | null>(null);
       const [users, setUsers] = useState<User[]>([]);

       useEffect(() => {
         const newSocket = io(socketUrl);
         setSocket(newSocket);

         newSocket.emit('join-page', { pageId, userId, userName });

         newSocket.on('users-list', setUsers);
         newSocket.on('user-joined', (user: User) => {
           setUsers(prev => [...prev, user]);
         });
         newSocket.on('user-left', (user: User) => {
           setUsers(prev => prev.filter(u => u.userId !== user.userId));
         });

         return () => {
           newSocket.disconnect();
         };
       }, [pageId, userId, userName]);

       const broadcastUpdate = (changes: any) => {
         socket?.emit('page-update', { pageId, changes, userId });
       };

       const broadcastCursor = (position: { x: number; y: number }) => {
         socket?.emit('cursor-move', { pageId, position, userId });
       };

       return { users, broadcastUpdate, broadcastCursor };
     }
     ```

---

## Phase 7: Advanced Blocks
_(No changes from previous plan)_

---

## Phase 8: SEO & Analytics
_(No changes from previous plan)_

---

## Phase 9: Mobile Responsiveness
_(No changes from previous plan)_

---

## Phase 10: Version Control
_(No changes from previous plan)_

---

## Phase 11: Integration System (with Security Note)

1. **Webhook Manager**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\webhooks\route.ts`
   * **Content:**
     ```ts
     import { NextRequest, NextResponse } from 'next/server';

     // NOTE: In a production environment, this in-memory map is not suitable.
     // Use a persistent store like Redis or your database.
     const webhooks = new Map<string, string[]>();

     export async function POST(req: NextRequest) {
       // SECURITY NOTE: Add authentication/authorization here to ensure
       // only permitted users/services can register webhooks.
       const { event, url } = await req.json();
       
       if (!webhooks.has(event)) {
         webhooks.set(event, []);
       }
       
       webhooks.get(event)!.push(url);
       
       return NextResponse.json({ success: true });
     }

     export async function triggerWebhooks(event: string, data: any) {
       const urls = webhooks.get(event) || [];
       
       // SECURITY NOTE: A production webhook system should include request signing
       // (e.g., HMAC signatures) to allow receivers to verify the request's origin.
       await Promise.all(
         urls.map(url =>
           fetch(url, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' /*, 'X-Signature-256': '...' */ },
             body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
           }).catch(console.error)
         )
       );
     }
     ```

2. **GraphQL API**
   * _(No changes from previous plan)_

---

## Implementation Priority & Success Metrics
_(No changes from previous plan)_
```}