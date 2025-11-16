'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  registerSectionComponent,
  registerColumnComponent,
  registerMenuAnchor,
  registerBlockquote,
  registerSiteLogo,
  registerIconList,
  registerInnerSection,
  registerBreadcrumbs,
  registerCountdown,
  registerTabs,
  registerOffCanvas,
  registerFormBuilder,
  registerSitemap
} from './customComponents';
import { TraitTabManager } from './TraitTabManager';
import { StyleApplier, injectAnimationKeyframes } from './StyleApplier';
import 'grapesjs/dist/css/grapes.min.css';
import './editor-styles.css';

interface PageBuilderEditorProps {
  pageId: string;
  portalId: string;
}

export default function PageBuilderEditor({ pageId, portalId }: PageBuilderEditorProps) {
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      // Wait for DOM elements to be ready
      const checkElements = setInterval(() => {
        const blocksEl = document.getElementById('gjs-blocks');
        const stylesEl = document.getElementById('gjs-styles');
        const layersEl = document.getElementById('gjs-layers');
        const editorEl = document.getElementById('gjs-editor');

        if (blocksEl && stylesEl && layersEl && editorEl) {
          clearInterval(checkElements);

          // Dynamically import GrapesJS to avoid SSR issues
          Promise.all([
            import('grapesjs'),
            import('grapesjs-blocks-basic')
          ]).then(([grapesjs, blocksBasic]) => {
            const editorInstance = grapesjs.default.init({
          container: '#gjs-editor',
          height: '100vh',
          width: 'auto',
          plugins: [blocksBasic.default],
          pluginsOpts: {},
          storageManager: false, // Disable built-in storage, we'll handle it manually
          blockManager: {
            appendTo: '#gjs-blocks',
          },
          styleManager: {
            appendTo: '#gjs-styles',
          },
          layerManager: {
            appendTo: '#gjs-layers',
          },
        });

            // Load existing page data
            api.get(`/api/v1/builder/pages/${pageId}`)
              .then(response => {
                const data = response.data;
                if (data['gjs-html']) {
                  editorInstance.setComponents(data['gjs-html']);
                }
                if (data['gjs-css']) {
                  editorInstance.setStyle(data['gjs-css']);
                }
                setEditorReady(true);
              })
              .catch(error => {
                console.error('Failed to load page data:', error);
                setEditorReady(true);
              });

        // Add custom blocks
        const blockManager = editorInstance.BlockManager;

        // Hero Section Block
        blockManager.add('hero-section', {
          label: 'Hero Section',
          category: 'Sections',
          content: `
            <section style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Website</h1>
                <p style="font-size: 20px; margin-bottom: 30px;">Build amazing pages with our visual editor</p>
                <a href="#" style="display: inline-block; padding: 15px 30px; background: white; color: #667eea; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
              </div>
            </section>
          `,
        });

        // Call-to-Action Block
        blockManager.add('cta-block', {
          label: 'Call to Action',
          category: 'Sections',
          content: `
            <section style="padding: 60px 20px; text-align: center; background: #f7fafc;">
              <div style="max-width: 600px; margin: 0 auto;">
                <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 15px; color: #2d3748;">Ready to Get Started?</h2>
                <p style="font-size: 18px; margin-bottom: 25px; color: #4a5568;">Join thousands of satisfied customers today</p>
                <a href="#" style="display: inline-block; padding: 12px 24px; background: #4299e1; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign Up Now</a>
              </div>
            </section>
          `,
        });

        // Features Section Block
        blockManager.add('features-3col', {
          label: '3-Column Features',
          category: 'Sections',
          content: `
            <section style="padding: 60px 20px;">
              <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="text-align: center; font-size: 36px; font-weight: bold; margin-bottom: 40px; color: #2d3748;">Our Features</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                  <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
                    <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">Fast</h3>
                    <p style="color: #4a5568;">Lightning-fast performance for your users</p>
                  </div>
                  <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 15px;">🔒</div>
                    <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">Secure</h3>
                    <p style="color: #4a5568;">Enterprise-grade security built-in</p>
                  </div>
                  <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 15px;">⚡</div>
                    <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">Easy</h3>
                    <p style="color: #4a5568;">Simple and intuitive to use</p>
                  </div>
                </div>
              </div>
            </section>
          `,
        });

        // Testimonial Block
        blockManager.add('testimonial', {
          label: 'Testimonial',
          category: 'Sections',
          content: `
            <section style="padding: 60px 20px; background: #edf2f7;">
              <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <p style="font-size: 24px; font-style: italic; margin-bottom: 20px; color: #2d3748;">"This product has completely transformed how we work. Highly recommended!"</p>
                <div style="font-weight: bold; color: #4a5568;">John Doe</div>
                <div style="color: #718096;">CEO, Company Inc.</div>
              </div>
            </section>
          `,
        });

        // ==================== Register Custom Components ====================
        registerSectionComponent(editorInstance);
        registerColumnComponent(editorInstance);
        registerMenuAnchor(editorInstance);
        registerBlockquote(editorInstance);
        registerSiteLogo(editorInstance);
        registerIconList(editorInstance);
        registerInnerSection(editorInstance);
        registerBreadcrumbs(editorInstance);
        registerCountdown(editorInstance);
        registerTabs(editorInstance);
        registerOffCanvas(editorInstance);
        registerFormBuilder(editorInstance);
        registerSitemap(editorInstance);

        // ==================== Initialize Trait Tab System ====================
        const traitTabManager = new TraitTabManager(editorInstance);
        console.log('TraitTabManager initialized - Elementor-style tabs ready');

        // ==================== Initialize Style Applier ====================
        // Inject animation keyframes first
        injectAnimationKeyframes();

        // Initialize auto CSS generation
        const styleApplier = new StyleApplier(editorInstance);
        styleApplier.init();
        console.log('StyleApplier initialized - Auto CSS generation active');

        // ==================== Layout Category - Column System ====================

        // Single Section Block (Only one preset - users add columns via toolbar)
        blockManager.add('flex-section', {
          label: 'Section',
          category: 'Layout',
          content: { type: 'flex-section' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="2" y="4" width="20" height="16" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // ==================== Widgets Category ====================

        // Heading Widget
        blockManager.add('heading-widget', {
          label: 'Heading',
          category: 'Widgets',
          content: '<h2 style="margin: 0; padding: 10px 0; font-size: 32px; font-weight: bold; color: #1f2937;">Heading Text</h2>',
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <text x="4" y="16" font-size="14" font-weight="bold" fill="currentColor">H</text>
            </svg>
          `
        });

        // Text Widget
        blockManager.add('text-widget', {
          label: 'Text',
          category: 'Widgets',
          content: '<p style="margin: 0; padding: 10px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" stroke-width="2"/>
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"/>
              <line x1="4" y1="16" x2="14" y2="16" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // Image Widget
        blockManager.add('image-widget', {
          label: 'Image',
          category: 'Widgets',
          content: '<img src="https://via.placeholder.com/400x300/667eea/ffffff?text=Image" alt="Placeholder" style="max-width: 100%; height: auto; display: block; border-radius: 4px;"/>',
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <polyline points="3,17 8,12 13,17" fill="none" stroke="currentColor" stroke-width="2"/>
              <polyline points="12,14 16,10 21,15 21,21 3,21" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // Button Widget
        blockManager.add('button-widget', {
          label: 'Button',
          category: 'Widgets',
          content: '<a href="#" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; transition: background 0.2s;">Click Me</a>',
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="4" y="9" width="16" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="12" y="14" font-size="6" text-anchor="middle" fill="currentColor">BTN</text>
            </svg>
          `
        });

        // ==================== Navigation Category ====================

        // Menu Anchor Widget
        blockManager.add('menu-anchor', {
          label: 'Menu Anchor',
          category: 'Navigation',
          content: { type: 'menu-anchor' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <path d="M12,2 C12,2 8,6 8,10 C8,13 10,15 12,15 C14,15 16,13 16,10 C16,6 12,2 12,2 Z" fill="none" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="15" x2="12" y2="22" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // Breadcrumbs Widget
        blockManager.add('breadcrumbs-widget', {
          label: 'Breadcrumbs',
          category: 'Navigation',
          content: { type: 'breadcrumbs' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <circle cx="4" cy="12" r="2" fill="currentColor"/>
              <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <line x1="14" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="12" r="2" fill="currentColor"/>
            </svg>
          `
        });

        // Sitemap Widget
        blockManager.add('sitemap-widget', {
          label: 'Sitemap',
          category: 'Navigation',
          content: { type: 'sitemap' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="8" y="2" width="8" height="4" fill="none" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="6" x2="12" y2="10" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="2"/>
              <rect x="2" y="12" width="4" height="4" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="10" y="12" width="4" height="4" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="18" y="12" width="4" height="4" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // ==================== Basic Widgets ====================

        // Blockquote Widget
        blockManager.add('blockquote-widget', {
          label: 'Blockquote',
          category: 'Widgets',
          content: { type: 'blockquote-widget' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <path d="M6,17 L6,7 L10,7 L10,13 L7,13 L10,17 Z" fill="currentColor"/>
              <path d="M14,17 L14,7 L18,7 L18,13 L15,13 L18,17 Z" fill="currentColor"/>
            </svg>
          `
        });

        // Site Logo Widget
        blockManager.add('site-logo-widget', {
          label: 'Site Logo',
          category: 'Widgets',
          content: { type: 'site-logo' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="3" y="8" width="18" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <text x="12" y="14" font-size="6" text-anchor="middle" fill="currentColor">LOGO</text>
            </svg>
          `
        });

        // Icon List Widget
        blockManager.add('icon-list-widget', {
          label: 'Icon List',
          category: 'Widgets',
          content: { type: 'icon-list' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
              <line x1="10" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2"/>
              <circle cx="6" cy="12" r="2" fill="currentColor"/>
              <line x1="10" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"/>
              <circle cx="6" cy="18" r="2" fill="currentColor"/>
              <line x1="10" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // ==================== Advanced Widgets ====================

        // Countdown Widget
        blockManager.add('countdown-widget', {
          label: 'Countdown',
          category: 'Advanced',
          content: { type: 'countdown' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="12" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // Tabs Widget
        blockManager.add('tabs-widget', {
          label: 'Tabs',
          category: 'Advanced',
          content: { type: 'tabs-container' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="2" y="4" width="6" height="4" fill="currentColor"/>
              <rect x="9" y="4" width="6" height="4" fill="none" stroke="currentColor" stroke-width="1"/>
              <rect x="16" y="4" width="6" height="4" fill="none" stroke="currentColor" stroke-width="1"/>
              <rect x="2" y="9" width="20" height="11" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // Off-Canvas Widget
        blockManager.add('off-canvas-widget', {
          label: 'Off Canvas',
          category: 'Advanced',
          content: { type: 'off-canvas' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="2" width="8" height="20" fill="currentColor" opacity="0.3"/>
              <line x1="16" y1="6" x2="20" y2="6" stroke="white" stroke-width="2"/>
              <line x1="16" y1="10" x2="20" y2="10" stroke="white" stroke-width="2"/>
              <line x1="16" y1="14" x2="20" y2="14" stroke="white" stroke-width="2"/>
            </svg>
          `
        });

        // Form Widget
        blockManager.add('form-builder-widget', {
          label: 'Form',
          category: 'Advanced',
          content: { type: 'form-builder' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="4" y="4" width="16" height="3" fill="none" stroke="currentColor" stroke-width="1"/>
              <rect x="4" y="9" width="16" height="3" fill="none" stroke="currentColor" stroke-width="1"/>
              <rect x="4" y="14" width="16" height="5" fill="none" stroke="currentColor" stroke-width="1"/>
            </svg>
          `
        });

        // ==================== Layout - Inner Section ====================

        // Inner Section Widget
        blockManager.add('inner-section-widget', {
          label: 'Inner Section',
          category: 'Layout',
          content: { type: 'inner-section' },
          media: `
            <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
              <rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2,2"/>
              <rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        });

        // ==================== Add Global Right-Click Handler ====================
        // Wait for canvas to be ready before attaching context menu handler
        editorInstance.on('load', () => {
          const canvas = editorInstance.Canvas.getFrameEl();
          const doc = canvas?.contentDocument || canvas?.contentWindow?.document;

          if (doc) {
            // Use capture phase to intercept event before it bubbles
            doc.addEventListener('contextmenu', (ev: MouseEvent) => {
            let target = ev.target as HTMLElement;

            // Find if clicked element is or is inside a column (check both our custom class and GrapesJS's cell class)
            let column: HTMLElement | null = null;
            while (target && target !== doc.body) {
              if (target.classList?.contains('flex-column') || target.classList?.contains('gjs-cell')) {
                column = target;
                break;
              }
              target = target.parentElement as HTMLElement;
            }

            // If we found a column, show custom context menu
            if (column) {
              ev.preventDefault();
              ev.stopPropagation();

              // Get the component from GrapesJS using the element's ID
              const columnId = column.id;
              const component = editorInstance.DomComponents.getWrapper()?.find(`#${columnId}`)[0];

              if (!component) {
                return;
              }

              // Remove any existing context menu
              const existingMenu = document.querySelector('.column-context-menu');
              if (existingMenu) {
                existingMenu.remove();
              }

              // Get viewport coordinates
              const canvasRect = canvas.getBoundingClientRect();
              const menuX = canvasRect.left + ev.clientX;
              const menuY = canvasRect.top + ev.clientY;

              // Create context menu element
              const menu = document.createElement('div');
              menu.className = 'column-context-menu';
              menu.style.cssText = `
                position: fixed;
                left: ${menuX}px;
                top: ${menuY}px;
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                z-index: 999999;
                min-width: 220px;
                padding: 4px 0;
              `;

              // Get parent and siblings info
              const parent: any = component.parent();
              const columns: any[] = parent ? parent.components() : [];
              const columnCount = columns.length;

              // Add Column to Left option
              const addColumnLeftOption = document.createElement('div');
              addColumnLeftOption.className = 'context-menu-item';
              addColumnLeftOption.innerHTML = '⬅️ Add Column to Left';
              addColumnLeftOption.style.cssText = `
                padding: 10px 16px;
                cursor: pointer;
                font-size: 14px;
                color: #1f2937;
              `;
              addColumnLeftOption.onmouseover = () => {
                addColumnLeftOption.style.background = '#f3f4f6';
              };
              addColumnLeftOption.onmouseout = () => {
                addColumnLeftOption.style.background = 'white';
              };
              addColumnLeftOption.onclick = (e: any) => {
                e.stopPropagation();
                menu.remove();

                if (!parent) return;

                if (columnCount >= 6) {
                  alert('Maximum 6 columns allowed');
                  return;
                }

                const index = columns.indexOf(component);
                parent.append({
                  type: 'flex-column',
                  attributes: { class: 'flex-column' },
                  style: { 'flex': '1 1 auto', 'min-width': '50px' }
                }, { at: index }); // Insert BEFORE current column
              };

              // Disable if at max columns
              if (columnCount >= 6) {
                addColumnLeftOption.style.opacity = '0.5';
                addColumnLeftOption.style.cursor = 'not-allowed';
                addColumnLeftOption.onclick = (e: any) => {
                  e.stopPropagation();
                  menu.remove();
                  alert('Maximum 6 columns allowed');
                };
              }

              menu.appendChild(addColumnLeftOption);

              // Add Column to Right option
              const addColumnOption = document.createElement('div');
              addColumnOption.className = 'context-menu-item';
              addColumnOption.innerHTML = '➡️ Add Column to Right';
              addColumnOption.style.cssText = `
                padding: 10px 16px;
                cursor: pointer;
                font-size: 14px;
                color: #1f2937;
              `;
              addColumnOption.onmouseover = () => {
                addColumnOption.style.background = '#f3f4f6';
              };
              addColumnOption.onmouseout = () => {
                addColumnOption.style.background = 'white';
              };
              addColumnOption.onclick = (e: any) => {
                e.stopPropagation();
                menu.remove();

                if (!parent) return;

                if (columnCount >= 6) {
                  alert('Maximum 6 columns allowed');
                  return;
                }

                const index = columns.indexOf(component);
                parent.append({
                  type: 'flex-column',
                  attributes: { class: 'flex-column' },
                  style: { 'flex': '1 1 auto', 'min-width': '50px' }
                }, { at: index + 1 });
              };

              // Disable if at max columns
              if (columnCount >= 6) {
                addColumnOption.style.opacity = '0.5';
                addColumnOption.style.cursor = 'not-allowed';
                addColumnOption.onclick = (e: any) => {
                  e.stopPropagation();
                  menu.remove();
                  alert('Maximum 6 columns allowed');
                };
              }

              menu.appendChild(addColumnOption);

              // Divider
              const divider = document.createElement('div');
              divider.style.cssText = `
                height: 1px;
                background: #e5e7eb;
                margin: 4px 0;
              `;
              menu.appendChild(divider);

              // Delete Column option
              const deleteOption = document.createElement('div');
              deleteOption.className = 'context-menu-item';
              deleteOption.innerHTML = '🗑️ Delete Column';
              deleteOption.style.cssText = `
                padding: 10px 16px;
                cursor: pointer;
                font-size: 14px;
                color: #dc2626;
              `;
              deleteOption.onmouseover = () => {
                deleteOption.style.background = '#fef2f2';
              };
              deleteOption.onmouseout = () => {
                deleteOption.style.background = 'white';
              };
              deleteOption.onclick = (e: any) => {
                e.stopPropagation();
                menu.remove();

                if (!parent) return;

                if (columnCount <= 1) {
                  alert('Sections must have at least 1 column');
                  return;
                }

                component.remove();
              };

              // Disable if only one column
              if (columnCount <= 1) {
                deleteOption.style.opacity = '0.5';
                deleteOption.style.cursor = 'not-allowed';
                deleteOption.onclick = (e: any) => {
                  e.stopPropagation();
                  menu.remove();
                  alert('Sections must have at least 1 column');
                };
              }

              menu.appendChild(deleteOption);

              // Add to body
              document.body.appendChild(menu);

              // Close menu when clicking outside
              const closeMenu = () => {
                menu.remove();
                document.removeEventListener('click', closeMenu);
                doc.removeEventListener('click', closeMenu);
              };

              // Delay adding the listener to avoid immediate close
              setTimeout(() => {
                document.addEventListener('click', closeMenu, { once: true });
                doc.addEventListener('click', closeMenu, { once: true });
              }, 10);
            }
          }, true); // Use capture phase to intercept event early
          }
        });

            setEditor(editorInstance);
          });
        }
      }, 100); // Check every 100ms

      // Cleanup interval if component unmounts
      return () => clearInterval(checkElements);
    }
  }, [pageId, isLoading]);

  const handleSave = async () => {
    if (editor) {
      try {
        const html = editor.getHtml();
        const css = editor.getCss();
        const components = editor.getComponents();

        await api.put(`/api/v1/builder/pages/${pageId}`, {
          'gjs-html': html,
          'gjs-css': css,
          'gjs-components': components
        });

        alert('✅ Page saved successfully!');
      } catch (error) {
        console.error('Save error:', error);
        alert('❌ Failed to save page');
      }
    }
  };

  const handlePublish = async () => {
    if (editor) {
      try {
        // Save first
        const html = editor.getHtml();
        const css = editor.getCss();
        const components = editor.getComponents();

        await api.put(`/api/v1/builder/pages/${pageId}`, {
          'gjs-html': html,
          'gjs-css': css,
          'gjs-components': components
        });

        // Then publish
        await api.post(`/api/v1/builder/pages/${pageId}/publish`);

        alert('✅ Page saved and published!');
      } catch (error) {
        console.error('Publish error:', error);
        alert('❌ Failed to publish page');
      }
    }
  };

  const handlePreview = () => {
    if (editor) {
      const html = editor.getHtml();
      const css = editor.getCss();

      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Preview</title>
              <style>${css}</style>
            </head>
            <body>${html}</body>
          </html>
        `);
        previewWindow.document.close();
      }
    }
  };

  const handleBack = () => {
    if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
      window.location.href = '/dashboard/builder';
    }
  };

  // Set isLoading to false immediately to render the DOM elements
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!editorReady && isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading editor...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Blocks */}
      <div className="bg-gray-800 text-white p-4 flex flex-col w-64 overflow-y-auto">
        <h3 className="font-semibold mb-4 text-lg">Blocks</h3>
        <div id="gjs-blocks" className="flex-1"></div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-gray-700 text-white p-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            ← Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              👁 Preview
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              💾 Save
            </button>
            <button
              onClick={handlePublish}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors font-semibold"
            >
              🚀 Save & Publish
            </button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-auto">
          <div id="gjs-editor"></div>
        </div>
      </div>

      {/* Right Sidebar - Layers & Styles */}
      <div className="bg-gray-800 text-white p-4 flex flex-col w-64 overflow-y-auto">
        <h3 className="font-semibold mb-4 text-lg">Layers</h3>
        <div id="gjs-layers" className="mb-6"></div>

        <h3 className="font-semibold mb-4 text-lg">Styles</h3>
        <div id="gjs-styles" className="flex-1"></div>
      </div>
    </div>
  );
}