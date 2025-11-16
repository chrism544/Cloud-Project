# AI Execution Plan: Next.js Page Builder Engine (Complete)

**Objective:** To create a comprehensive, enterprise-ready Next.js page builder with advanced features, real-time collaboration, and production-grade capabilities.

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
    ```

---

## Phase 2: Enhanced Database Schema

**Goal:** Create comprehensive database schema for all features.

1. **Create Enhanced Prisma Schema**
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
       
       @@index([email])
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
       
       @@index([slug])
       @@index([published])
       @@index([authorId])
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
       
       @@unique([pageId, version])
       @@index([pageId])
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
       
       @@index([categoryId])
       @@index([featured])
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
       
       @@index([mimeType])
       @@index([tags])
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
       
       @@index([userId])
       @@index([pageId])
       @@index([isActive])
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
       
       @@index([pageId])
       @@index([event])
       @@index([createdAt])
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

     enum Role {
       ADMIN
       EDITOR
       VIEWER
     }
     ```

---

## Phase 3: Enhanced Package Configuration

1. **Enhanced package.json**
   * **Content:**
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
         "prisma:reset": "prisma migrate reset --force",
         "websocket": "node server/websocket.js"
       },
       "dependencies": {
         "@prisma/client": "^5.14.0",
         "@uploadthing/react": "^6.4.4",
         "grapesjs": "^0.21.10",
         "next": "14.2.3",
         "next-auth": "^4.24.7",
         "react": "^18.3.1",
         "react-dom": "^18.3.1",
         "socket.io": "^4.7.5",
         "socket.io-client": "^4.7.5",
         "sharp": "^0.33.4",
         "uploadthing": "^6.10.4",
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

## Phase 4: Asset Management System

1. **Asset Upload API**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\assets\route.ts`
   * **Content:**
     ```ts
     import { NextRequest, NextResponse } from 'next/server';
     import { prisma } from '@/lib/prisma';
     import { uploadToCloudinary } from '@/lib/cloudinary';
     import sharp from 'sharp';

     export async function POST(req: NextRequest) {
       try {
         const formData = await req.formData();
         const file = formData.get('file') as File;
         
         if (!file) {
           return NextResponse.json({ error: 'No file provided' }, { status: 400 });
         }

         // Optimize image
         const buffer = Buffer.from(await file.arrayBuffer());
         const optimized = await sharp(buffer)
           .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
           .webp({ quality: 85 })
           .toBuffer();

         // Upload to CDN
         const cdnResult = await uploadToCloudinary(optimized, file.name);
         
         // Save to database
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

     export async function GET(req: NextRequest) {
       const { searchParams } = new URL(req.url);
       const page = parseInt(searchParams.get('page') || '1');
       const limit = parseInt(searchParams.get('limit') || '20');
       const type = searchParams.get('type');

       const where = type ? { mimeType: { startsWith: type } } : {};

       const assets = await prisma.asset.findMany({
         where,
         skip: (page - 1) * limit,
         take: limit,
         orderBy: { createdAt: 'desc' }
       });

       return NextResponse.json(assets);
     }
     ```

2. **Asset Library Component**
   * **Path:** `C:\Cloud Project\my-page-builder\components\AssetLibrary.tsx`
   * **Content:**
     ```tsx
     'use client';
     import { useState, useEffect } from 'react';
     import { motion } from 'framer-motion';

     interface Asset {
       id: string;
       filename: string;
       originalName: string;
       url: string;
       mimeType: string;
       size: number;
     }

     export default function AssetLibrary({ onSelect }: { onSelect: (asset: Asset) => void }) {
       const [assets, setAssets] = useState<Asset[]>([]);
       const [uploading, setUploading] = useState(false);

       const handleUpload = async (file: File) => {
         setUploading(true);
         const formData = new FormData();
         formData.append('file', file);

         try {
           const response = await fetch('/api/assets', {
             method: 'POST',
             body: formData
           });
           const asset = await response.json();
           setAssets(prev => [asset, ...prev]);
         } catch (error) {
           console.error('Upload failed:', error);
         } finally {
           setUploading(false);
         }
       };

       return (
         <div className="asset-library">
           <div className="upload-zone">
             <input
               type="file"
               accept="image/*,video/*"
               onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
               disabled={uploading}
             />
           </div>
           
           <div className="asset-grid">
             {assets.map((asset) => (
               <motion.div
                 key={asset.id}
                 className="asset-item"
                 whileHover={{ scale: 1.05 }}
                 onClick={() => onSelect(asset)}
               >
                 <img src={asset.url} alt={asset.originalName} />
                 <div className="asset-info">
                   <span>{asset.originalName}</span>
                   <span>{(asset.size / 1024).toFixed(1)}KB</span>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       );
     }
     ```

---

## Phase 5: Template System

1. **Template API**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\templates\route.ts`
   * **Content:**
     ```ts
     import { NextRequest, NextResponse } from 'next/server';
     import { prisma } from '@/lib/prisma';

     export async function GET(req: NextRequest) {
       const { searchParams } = new URL(req.url);
       const category = searchParams.get('category');
       const featured = searchParams.get('featured') === 'true';

       const where: any = {};
       if (category) where.categoryId = category;
       if (featured) where.featured = true;

       const templates = await prisma.template.findMany({
         where,
         include: { category: true },
         orderBy: { createdAt: 'desc' }
       });

       return NextResponse.json(templates);
     }

     export async function POST(req: NextRequest) {
       const { name, description, categoryId, pageData, pageHtml, pageCss, tags } = await req.json();

       const template = await prisma.template.create({
         data: {
           name,
           description,
           categoryId,
           pageData,
           pageHtml,
           pageCss,
           tags
         }
       });

       return NextResponse.json(template);
     }
     ```

2. **Template Gallery Component**
   * **Path:** `C:\Cloud Project\my-page-builder\components\TemplateGallery.tsx`
   * **Content:**
     ```tsx
     'use client';
     import { useState, useEffect } from 'react';
     import { motion } from 'framer-motion';

     interface Template {
       id: string;
       name: string;
       description: string;
       preview: string;
       category: { name: string };
       tags: string[];
     }

     export default function TemplateGallery({ onSelect }: { onSelect: (template: Template) => void }) {
       const [templates, setTemplates] = useState<Template[]>([]);
       const [filter, setFilter] = useState('');

       useEffect(() => {
         fetch('/api/templates')
           .then(res => res.json())
           .then(setTemplates);
       }, []);

       const filteredTemplates = templates.filter(t => 
         t.name.toLowerCase().includes(filter.toLowerCase()) ||
         t.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
       );

       return (
         <div className="template-gallery">
           <input
             type="text"
             placeholder="Search templates..."
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="search-input"
           />
           
           <div className="template-grid">
             {filteredTemplates.map((template) => (
               <motion.div
                 key={template.id}
                 className="template-card"
                 whileHover={{ y: -5 }}
                 onClick={() => onSelect(template)}
               >
                 <div className="template-preview">
                   <img src={template.preview} alt={template.name} />
                 </div>
                 <div className="template-info">
                   <h3>{template.name}</h3>
                   <p>{template.description}</p>
                   <div className="template-tags">
                     {template.tags.map(tag => (
                       <span key={tag} className="tag">{tag}</span>
                     ))}
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       );
     }
     ```

---

## Phase 6: Real-time Collaboration

1. **WebSocket Server**
   * **Path:** `C:\Cloud Project\my-page-builder\server\websocket.js`
   * **Content:**
     ```js
     const { Server } = require('socket.io');
     const { createServer } = require('http');

     const server = createServer();
     const io = new Server(server, {
       cors: { origin: "*" }
     });

     const rooms = new Map();

     io.on('connection', (socket) => {
       socket.on('join-page', ({ pageId, userId, userName }) => {
         socket.join(pageId);
         
         if (!rooms.has(pageId)) {
           rooms.set(pageId, new Map());
         }
         
         rooms.get(pageId).set(socket.id, { userId, userName });
         
         // Broadcast user joined
         socket.to(pageId).emit('user-joined', { userId, userName });
         
         // Send current users
         const users = Array.from(rooms.get(pageId).values());
         socket.emit('users-list', users);
       });

       socket.on('page-update', ({ pageId, changes, userId }) => {
         socket.to(pageId).emit('page-updated', { changes, userId });
       });

       socket.on('cursor-move', ({ pageId, position, userId }) => {
         socket.to(pageId).emit('cursor-moved', { position, userId });
       });

       socket.on('disconnect', () => {
         for (const [pageId, users] of rooms.entries()) {
           if (users.has(socket.id)) {
             const user = users.get(socket.id);
             users.delete(socket.id);
             socket.to(pageId).emit('user-left', user);
             break;
           }
         }
       });
     });

     server.listen(3001, () => {
       console.log('WebSocket server running on port 3001');
     });
     ```

2. **Collaboration Hook**
   * **Path:** `C:\Cloud Project\my-page-builder\lib\useCollaboration.ts`
   * **Content:**
     ```ts
     import { useEffect, useState } from 'react';
     import { io, Socket } from 'socket.io-client';

     interface User {
       userId: string;
       userName: string;
     }

     export function useCollaboration(pageId: string, userId: string, userName: string) {
       const [socket, setSocket] = useState<Socket | null>(null);
       const [users, setUsers] = useState<User[]>([]);

       useEffect(() => {
         const newSocket = io('http://localhost:3001');
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

1. **Form Builder Block**
   * **Path:** `C:\Cloud Project\my-page-builder\components\blocks\advanced\FormBuilder.tsx`
   * **Content:**
     ```tsx
     'use client';
     import { useState } from 'react';
     import { useForm } from 'react-hook-form';

     interface FormField {
       id: string;
       type: 'text' | 'email' | 'textarea' | 'select';
       label: string;
       required: boolean;
       options?: string[];
     }

     export default function FormBuilder({ fields = [] }: { fields: FormField[] }) {
       const { register, handleSubmit, formState: { errors } } = useForm();

       const onSubmit = async (data: any) => {
         try {
           await fetch('/api/forms/submit', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
           });
           alert('Form submitted successfully!');
         } catch (error) {
           alert('Submission failed');
         }
       };

       return (
         <form onSubmit={handleSubmit(onSubmit)} className="form-builder">
           {fields.map((field) => (
             <div key={field.id} className="form-field">
               <label>{field.label}</label>
               {field.type === 'textarea' ? (
                 <textarea
                   {...register(field.id, { required: field.required })}
                   className={errors[field.id] ? 'error' : ''}
                 />
               ) : field.type === 'select' ? (
                 <select {...register(field.id, { required: field.required })}>
                   {field.options?.map(option => (
                     <option key={option} value={option}>{option}</option>
                   ))}
                 </select>
               ) : (
                 <input
                   type={field.type}
                   {...register(field.id, { required: field.required })}
                   className={errors[field.id] ? 'error' : ''}
                 />
               )}
               {errors[field.id] && <span className="error-message">This field is required</span>}
             </div>
           ))}
           <button type="submit">Submit</button>
         </form>
       );
     }
     ```

2. **E-commerce Product Grid**
   * **Path:** `C:\Cloud Project\my-page-builder\components\blocks\advanced\ProductGrid.tsx`
   * **Content:**
     ```tsx
     'use client';
     import { useState, useEffect } from 'react';
     import { motion } from 'framer-motion';

     interface Product {
       id: string;
       name: string;
       price: number;
       image: string;
       description: string;
     }

     export default function ProductGrid({ 
       category = 'all',
       limit = 12,
       columns = 3 
     }: {
       category?: string;
       limit?: number;
       columns?: number;
     }) {
       const [products, setProducts] = useState<Product[]>([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
         fetch(`/api/products?category=${category}&limit=${limit}`)
           .then(res => res.json())
           .then(data => {
             setProducts(data);
             setLoading(false);
           });
       }, [category, limit]);

       if (loading) return <div className="loading">Loading products...</div>;

       return (
         <div 
           className="product-grid"
           style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
         >
           {products.map((product, index) => (
             <motion.div
               key={product.id}
               className="product-card"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
             >
               <img src={product.image} alt={product.name} />
               <h3>{product.name}</h3>
               <p>{product.description}</p>
               <div className="price">${product.price}</div>
               <button className="add-to-cart">Add to Cart</button>
             </motion.div>
           ))}
         </div>
       );
     }
     ```

---

## Phase 8: SEO & Analytics

1. **SEO Manager**
   * **Path:** `C:\Cloud Project\my-page-builder\lib\seo.ts`
   * **Content:**
     ```ts
     interface SEOData {
       title: string;
       description: string;
       keywords: string[];
       ogImage: string;
       canonical: string;
     }

     export function generateSEOTags(seo: SEOData) {
       return {
         title: seo.title,
         description: seo.description,
         keywords: seo.keywords.join(', '),
         openGraph: {
           title: seo.title,
           description: seo.description,
           images: [{ url: seo.ogImage }],
         },
         twitter: {
           card: 'summary_large_image',
           title: seo.title,
           description: seo.description,
           images: [seo.ogImage],
         },
         alternates: {
           canonical: seo.canonical,
         },
       };
     }

     export async function generateSitemap(pages: any[]) {
       const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         ${pages.map(page => `
           <url>
             <loc>${process.env.NEXTAUTH_URL}/${page.slug}</loc>
             <lastmod>${page.updatedAt}</lastmod>
             <changefreq>weekly</changefreq>
             <priority>0.8</priority>
           </url>
         `).join('')}
       </urlset>`;
       
       return sitemap;
     }
     ```

2. **Analytics Tracker**
   * **Path:** `C:\Cloud Project\my-page-builder\lib\analytics.ts`
   * **Content:**
     ```ts
     export class Analytics {
       static async track(event: string, pageId: string, data?: any) {
         try {
           await fetch('/api/analytics', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               event,
               pageId,
               data,
               timestamp: new Date().toISOString(),
               userAgent: navigator.userAgent,
             }),
           });
         } catch (error) {
           console.error('Analytics tracking failed:', error);
         }
       }

       static trackPageView(pageId: string) {
         this.track('page_view', pageId);
       }

       static trackInteraction(pageId: string, element: string) {
         this.track('interaction', pageId, { element });
       }

       static trackFormSubmission(pageId: string, formId: string) {
         this.track('form_submit', pageId, { formId });
       }
     }
     ```

---

## Phase 9: Mobile Responsiveness

1. **Responsive Editor**
   * **Path:** `C:\Cloud Project\my-page-builder\components\editor\ResponsiveEditor.tsx`
   * **Content:**
     ```tsx
     'use client';
     import { useState } from 'react';

     type Device = 'desktop' | 'tablet' | 'mobile';

     export default function ResponsiveEditor({ children }: { children: React.ReactNode }) {
       const [device, setDevice] = useState<Device>('desktop');

       const deviceSizes = {
         desktop: { width: '100%', height: '100%' },
         tablet: { width: '768px', height: '1024px' },
         mobile: { width: '375px', height: '667px' },
       };

       return (
         <div className="responsive-editor">
           <div className="device-toolbar">
             {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
               <button
                 key={d}
                 className={device === d ? 'active' : ''}
                 onClick={() => setDevice(d)}
               >
                 {d}
               </button>
             ))}
           </div>
           
           <div className="device-preview">
             <div
               className="device-frame"
               style={deviceSizes[device]}
             >
               {children}
             </div>
           </div>
         </div>
       );
     }
     ```

---

## Phase 10: Version Control

1. **Version Manager**
   * **Path:** `C:\Cloud Project\my-page-builder\lib\versions.ts`
   * **Content:**
     ```ts
     import { prisma } from './prisma';

     export class VersionManager {
       static async createVersion(pageId: string, data: any, message?: string) {
         const lastVersion = await prisma.pageVersion.findFirst({
           where: { pageId },
           orderBy: { version: 'desc' },
         });

         const version = (lastVersion?.version || 0) + 1;

         return await prisma.pageVersion.create({
           data: {
             pageId,
             version,
             pageData: data.pageData,
             pageHtml: data.pageHtml,
             pageCss: data.pageCss,
             message,
           },
         });
       }

       static async getVersions(pageId: string) {
         return await prisma.pageVersion.findMany({
           where: { pageId },
           orderBy: { version: 'desc' },
         });
       }

       static async restoreVersion(pageId: string, version: number) {
         const versionData = await prisma.pageVersion.findUnique({
           where: { pageId_version: { pageId, version } },
         });

         if (!versionData) throw new Error('Version not found');

         await prisma.page.update({
           where: { id: pageId },
           data: {
             pageData: versionData.pageData,
             pageHtml: versionData.pageHtml,
             pageCss: versionData.pageCss,
           },
         });

         return versionData;
       }
     }
     ```

---

## Phase 11: Integration System

1. **Webhook Manager**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\webhooks\route.ts`
   * **Content:**
     ```ts
     import { NextRequest, NextResponse } from 'next/server';

     const webhooks = new Map<string, string[]>();

     export async function POST(req: NextRequest) {
       const { event, url } = await req.json();
       
       if (!webhooks.has(event)) {
         webhooks.set(event, []);
       }
       
       webhooks.get(event)!.push(url);
       
       return NextResponse.json({ success: true });
     }

     export async function triggerWebhooks(event: string, data: any) {
       const urls = webhooks.get(event) || [];
       
       await Promise.all(
         urls.map(url =>
           fetch(url, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
           }).catch(console.error)
         )
       );
     }
     ```

2. **GraphQL API**
   * **Path:** `C:\Cloud Project\my-page-builder\app\api\graphql\route.ts`
   * **Content:**
     ```ts
     import { NextRequest } from 'next/server';
     import { prisma } from '@/lib/prisma';

     const typeDefs = `
       type Page {
         id: ID!
         slug: String!
         name: String!
         pageHtml: String
         pageCss: String
         published: Boolean!
         createdAt: String!
       }

       type Query {
         pages: [Page!]!
         page(slug: String!): Page
       }
     `;

     const resolvers = {
       Query: {
         pages: () => prisma.page.findMany({ where: { published: true } }),
         page: (_: any, { slug }: { slug: string }) => 
           prisma.page.findUnique({ where: { slug, published: true } }),
       },
     };

     export async function POST(req: NextRequest) {
       const { query, variables } = await req.json();
       
       // Simple GraphQL resolver (use apollo-server-micro for production)
       if (query.includes('pages')) {
         const pages = await resolvers.Query.pages();
         return Response.json({ data: { pages } });
       }
       
       return Response.json({ error: 'Query not supported' });
     }
     ```

---

## Implementation Priority

### Phase A: Core (Weeks 1-2)
1. ✅ Compatibility Testing
2. ✅ Basic Editor Setup
3. ✅ Database Schema
4. ✅ Caching System

### Phase B: Essential Features (Weeks 3-4)
1. 🔄 Asset Management
2. 🔄 Template System
3. 🔄 Version Control
4. 🔄 SEO Integration

### Phase C: Advanced Features (Weeks 5-6)
1. 🔄 Real-time Collaboration
2. 🔄 Advanced Blocks
3. 🔄 Mobile Responsiveness
4. 🔄 Analytics

### Phase D: Enterprise Features (Weeks 7-8)
1. 🔄 Integration System
2. 🔄 Performance Optimization
3. 🔄 Security Hardening
4. 🔄 Monitoring & Logging

## Success Metrics

- ✅ **Performance**: Page load < 2s, API response < 200ms
- ✅ **Reliability**: 99.9% uptime, error rate < 0.1%
- ✅ **Scalability**: Handle 1000+ concurrent users
- ✅ **User Experience**: Drag-drop works flawlessly
- ✅ **SEO**: Perfect Lighthouse scores
- ✅ **Security**: No vulnerabilities in security audit

This comprehensive plan creates an enterprise-grade page builder that rivals commercial solutions while maintaining full control and customization capabilities.