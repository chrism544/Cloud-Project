# 🎨 Advanced Template System - Complete Expansion

## Template Architecture

### 1. **Enhanced Database Schema**
```prisma
model Template {
  id            String            @id @default(cuid())
  name          String
  description   String?
  preview       String?           // Screenshot URL
  thumbnail     String?           // Small preview image
  categoryId    String?
  subcategoryId String?
  
  // Template Data
  pageData      Json              // GrapesJS components
  pageHtml      String?           // Generated HTML
  pageCss       String?           // Generated CSS
  variables     Json?             // Customizable variables
  
  // Metadata
  tags          String[]
  difficulty    Difficulty        @default(BEGINNER)
  industry      String[]          // e.g., ["restaurant", "portfolio"]
  style         String[]          // e.g., ["modern", "minimal", "corporate"]
  colors        String[]          // Primary color palette
  
  // Marketplace
  featured      Boolean           @default(false)
  premium       Boolean           @default(false)
  price         Float?            // For premium templates
  authorId      String?
  downloads     Int               @default(0)
  rating        Float?            @default(0)
  reviews       TemplateReview[]
  
  // Versioning
  version       String            @default("1.0.0")
  changelog     Json?
  
  // Usage
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  lastUsed      DateTime?
  
  // Relations
  category      TemplateCategory? @relation(fields: [categoryId], references: [id])
  subcategory   TemplateSubcategory? @relation(fields: [subcategoryId], references: [id])
  author        User?             @relation(fields: [authorId], references: [id])
  pages         Page[]
  collections   TemplateCollection[]
  
  @@index([categoryId])
  @@index([featured])
  @@index([premium])
  @@index([downloads])
  @@index([rating])
}

model TemplateCategory {
  id            String                @id @default(cuid())
  name          String                @unique
  slug          String                @unique
  description   String?
  icon          String?               // Icon name or URL
  color         String?               // Brand color
  order         Int                   @default(0)
  
  templates     Template[]
  subcategories TemplateSubcategory[]
}

model TemplateSubcategory {
  id          String           @id @default(cuid())
  name        String
  slug        String
  categoryId  String
  description String?
  
  category    TemplateCategory @relation(fields: [categoryId], references: [id])
  templates   Template[]
  
  @@unique([categoryId, slug])
}

model TemplateCollection {
  id          String     @id @default(cuid())
  name        String
  description String?
  userId      String?
  isPublic    Boolean    @default(false)
  
  templates   Template[]
  user        User?      @relation(fields: [userId], references: [id])
}

model TemplateReview {
  id         String   @id @default(cuid())
  templateId String
  userId     String
  rating     Int      // 1-5 stars
  comment    String?
  createdAt  DateTime @default(now())
  
  template   Template @relation(fields: [templateId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
  
  @@unique([templateId, userId])
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}
```

### 2. **Template Variable System**
```ts
// lib/templateVariables.ts
interface TemplateVariable {
  key: string;
  type: 'text' | 'color' | 'image' | 'number' | 'boolean' | 'select';
  label: string;
  defaultValue: any;
  options?: string[]; // For select type
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface TemplateConfig {
  variables: TemplateVariable[];
  sections: {
    id: string;
    name: string;
    variables: string[]; // Variable keys
  }[];
}

export class TemplateProcessor {
  static processTemplate(template: any, variables: Record<string, any>) {
    let html = template.pageHtml;
    let css = template.pageCss;
    let data = JSON.parse(template.pageData);

    // Replace variables in HTML
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
      css = css.replace(new RegExp(placeholder, 'g'), value);
    });

    // Process component data
    data = this.processComponentData(data, variables);

    return { html, css, data };
  }

  private static processComponentData(data: any, variables: Record<string, any>): any {
    if (Array.isArray(data)) {
      return data.map(item => this.processComponentData(item, variables));
    }
    
    if (typeof data === 'object' && data !== null) {
      const processed: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && value.includes('{{')) {
          processed[key] = this.replaceVariables(value, variables);
        } else {
          processed[key] = this.processComponentData(value, variables);
        }
      }
      return processed;
    }
    
    return data;
  }

  private static replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }
}
```

### 3. **Template Marketplace API**
```ts
// app/api/templates/marketplace/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const industry = searchParams.get('industry');
  const style = searchParams.get('style');
  const difficulty = searchParams.get('difficulty');
  const premium = searchParams.get('premium') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const sort = searchParams.get('sort') || 'popular';
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  const where: any = {};
  
  if (category) where.categoryId = category;
  if (subcategory) where.subcategoryId = subcategory;
  if (industry) where.industry = { has: industry };
  if (style) where.style = { has: style };
  if (difficulty) where.difficulty = difficulty;
  if (premium !== undefined) where.premium = premium;
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } }
    ];
  }

  const orderBy: any = {};
  switch (sort) {
    case 'popular':
      orderBy.downloads = 'desc';
      break;
    case 'rating':
      orderBy.rating = 'desc';
      break;
    case 'newest':
      orderBy.createdAt = 'desc';
      break;
    case 'price-low':
      orderBy.price = 'asc';
      break;
    case 'price-high':
      orderBy.price = 'desc';
      break;
    default:
      orderBy.featured = 'desc';
  }

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      include: {
        category: true,
        subcategory: true,
        author: { select: { name: true, id: true } },
        _count: { select: { reviews: true } }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.template.count({ where })
  ]);

  return NextResponse.json({
    templates,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}
```

### 4. **Advanced Template Gallery Component**
```tsx
// components/templates/TemplateMarketplace.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, Eye, Heart, Filter } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  thumbnail: string;
  category: { name: string; color: string };
  tags: string[];
  difficulty: string;
  rating: number;
  downloads: number;
  premium: boolean;
  price?: number;
  author: { name: string };
}

export default function TemplateMarketplace() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    industry: '',
    style: '',
    difficulty: '',
    premium: false,
    search: ''
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    try {
      const response = await fetch(`/api/templates/marketplace?${params}`);
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const handlePreview = (template: Template) => {
    // Open preview modal
    window.open(`/templates/preview/${template.id}`, '_blank');
  };

  const handleUseTemplate = async (template: Template) => {
    try {
      const response = await fetch(`/api/templates/${template.id}/use`, {
        method: 'POST'
      });
      const { pageId } = await response.json();
      window.location.href = `/admin/editor/${pageId}`;
    } catch (error) {
      console.error('Failed to use template:', error);
    }
  };

  return (
    <div className="template-marketplace">
      {/* Header */}
      <div className="marketplace-header">
        <h1>Template Marketplace</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search templates..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
          <button className="filter-btn">
            <Filter size={20} />
            Filters
          </button>
          <div className="view-toggle">
            <button 
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="marketplace-filters">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="business">Business</option>
          <option value="portfolio">Portfolio</option>
          <option value="ecommerce">E-commerce</option>
          <option value="blog">Blog</option>
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
        >
          <option value="">All Levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        <label className="premium-filter">
          <input
            type="checkbox"
            checked={filters.premium}
            onChange={(e) => setFilters(prev => ({ ...prev, premium: e.target.checked }))}
          />
          Premium Only
        </label>
      </div>

      {/* Templates Grid */}
      <AnimatePresence>
        <div className={`templates-${view}`}>
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className="template-card"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
            >
              <div className="template-preview">
                <img src={template.thumbnail} alt={template.name} />
                <div className="template-overlay">
                  <button 
                    className="preview-btn"
                    onClick={() => handlePreview(template)}
                  >
                    <Eye size={20} />
                    Preview
                  </button>
                  <button className="favorite-btn">
                    <Heart size={20} />
                  </button>
                </div>
                {template.premium && (
                  <div className="premium-badge">Premium</div>
                )}
              </div>

              <div className="template-info">
                <div className="template-header">
                  <h3>{template.name}</h3>
                  <div className="template-rating">
                    <Star size={16} fill="currentColor" />
                    <span>{template.rating}</span>
                  </div>
                </div>

                <p className="template-description">{template.description}</p>

                <div className="template-meta">
                  <span className="category" style={{ color: template.category.color }}>
                    {template.category.name}
                  </span>
                  <span className="difficulty">{template.difficulty}</span>
                  <span className="downloads">
                    <Download size={14} />
                    {template.downloads}
                  </span>
                </div>

                <div className="template-tags">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="template-footer">
                  <div className="template-price">
                    {template.premium ? `$${template.price}` : 'Free'}
                  </div>
                  <button 
                    className="use-template-btn"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner">Loading templates...</div>
        </div>
      )}
    </div>
  );
}
```

### 5. **Template Customization Wizard**
```tsx
// components/templates/TemplateCustomizer.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TemplateProcessor } from '@/lib/templateVariables';

interface TemplateCustomizerProps {
  templateId: string;
  onComplete: (customizedTemplate: any) => void;
}

export default function TemplateCustomizer({ templateId, onComplete }: TemplateCustomizerProps) {
  const [template, setTemplate] = useState<any>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/templates/${templateId}`)
      .then(res => res.json())
      .then(data => {
        setTemplate(data);
        // Initialize variables with defaults
        const defaultVars: Record<string, any> = {};
        data.variables?.forEach((variable: any) => {
          defaultVars[variable.key] = variable.defaultValue;
        });
        setVariables(defaultVars);
      });
  }, [templateId]);

  useEffect(() => {
    if (template && Object.keys(variables).length > 0) {
      const processed = TemplateProcessor.processTemplate(template, variables);
      setPreview(processed);
    }
  }, [template, variables]);

  const handleVariableChange = (key: string, value: any) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const renderVariableInput = (variable: any) => {
    const value = variables[variable.key];

    switch (variable.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleVariableChange(variable.key, e.target.value)}
            placeholder={variable.label}
          />
        );

      case 'color':
        return (
          <div className="color-input">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleVariableChange(variable.key, e.target.value)}
            />
            <input
              type="text"
              value={value || '#000000'}
              onChange={(e) => handleVariableChange(variable.key, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );

      case 'image':
        return (
          <div className="image-input">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => handleVariableChange(variable.key, e.target.value)}
              placeholder="Image URL"
            />
            <button className="upload-btn">Upload Image</button>
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleVariableChange(variable.key, e.target.value)}
          >
            {variable.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleVariableChange(variable.key, e.target.checked)}
            />
            {variable.label}
          </label>
        );

      default:
        return null;
    }
  };

  if (!template) return <div>Loading...</div>;

  const sections = template.config?.sections || [{ id: 'general', name: 'General', variables: Object.keys(variables) }];
  const currentSectionData = sections[currentSection];

  return (
    <div className="template-customizer">
      <div className="customizer-sidebar">
        <h2>Customize Template</h2>
        
        {/* Section Navigation */}
        <div className="section-nav">
          {sections.map((section: any, index: number) => (
            <button
              key={section.id}
              className={currentSection === index ? 'active' : ''}
              onClick={() => setCurrentSection(index)}
            >
              {section.name}
            </button>
          ))}
        </div>

        {/* Variable Inputs */}
        <div className="variable-inputs">
          <h3>{currentSectionData.name}</h3>
          {template.variables
            ?.filter((v: any) => currentSectionData.variables.includes(v.key))
            .map((variable: any) => (
              <div key={variable.key} className="variable-input">
                <label>{variable.label}</label>
                {renderVariableInput(variable)}
              </div>
            ))}
        </div>

        <div className="customizer-actions">
          <button 
            className="preview-btn"
            onClick={() => window.open(`/templates/preview/${templateId}?vars=${encodeURIComponent(JSON.stringify(variables))}`, '_blank')}
          >
            Full Preview
          </button>
          <button 
            className="apply-btn"
            onClick={() => onComplete(preview)}
          >
            Use This Design
          </button>
        </div>
      </div>

      <div className="customizer-preview">
        <div className="preview-frame">
          {preview && (
            <iframe
              srcDoc={`
                <html>
                  <head>
                    <style>${preview.css}</style>
                  </head>
                  <body>${preview.html}</body>
                </html>
              `}
              width="100%"
              height="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

### 6. **Template Creation Studio**
```tsx
// components/templates/TemplateStudio.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TemplateStudio({ pageData }: { pageData: any }) {
  const { register, handleSubmit, watch } = useForm();
  const [variables, setVariables] = useState<any[]>([]);
  const [preview, setPreview] = useState('');

  const addVariable = () => {
    setVariables(prev => [...prev, {
      key: `var_${Date.now()}`,
      type: 'text',
      label: 'New Variable',
      defaultValue: ''
    }]);
  };

  const onSubmit = async (data: any) => {
    const templateData = {
      ...data,
      pageData,
      variables,
      config: {
        variables,
        sections: [
          { id: 'general', name: 'General', variables: variables.map(v => v.key) }
        ]
      }
    };

    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });
      alert('Template created successfully!');
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  return (
    <div className="template-studio">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="studio-section">
          <h3>Template Information</h3>
          <input {...register('name', { required: true })} placeholder="Template Name" />
          <textarea {...register('description')} placeholder="Description" />
          <input {...register('tags')} placeholder="Tags (comma separated)" />
        </div>

        <div className="studio-section">
          <h3>Customizable Variables</h3>
          {variables.map((variable, index) => (
            <div key={variable.key} className="variable-editor">
              <input
                value={variable.label}
                onChange={(e) => {
                  const newVars = [...variables];
                  newVars[index].label = e.target.value;
                  setVariables(newVars);
                }}
                placeholder="Variable Label"
              />
              <select
                value={variable.type}
                onChange={(e) => {
                  const newVars = [...variables];
                  newVars[index].type = e.target.value;
                  setVariables(newVars);
                }}
              >
                <option value="text">Text</option>
                <option value="color">Color</option>
                <option value="image">Image</option>
                <option value="select">Select</option>
              </select>
              <button type="button" onClick={() => setVariables(prev => prev.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addVariable}>Add Variable</button>
        </div>

        <button type="submit">Create Template</button>
      </form>
    </div>
  );
}
```

## Template Categories & Examples

### **Business Templates**
- Corporate Landing Pages
- SaaS Product Pages  
- Professional Services
- Consulting Firms
- Agency Portfolios

### **E-commerce Templates**
- Product Showcases
- Online Stores
- Fashion Boutiques
- Electronics Shops
- Marketplace Layouts

### **Creative Templates**
- Artist Portfolios
- Photography Studios
- Design Agencies
- Creative Blogs
- Event Websites

### **Personal Templates**
- Personal Blogs
- Resume/CV Sites
- Wedding Websites
- Travel Blogs
- Hobby Sites

This expanded template system creates a comprehensive marketplace that rivals commercial solutions like ThemeForest, with advanced customization, variable systems, and professional-grade templates.