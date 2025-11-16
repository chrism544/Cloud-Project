/**
 * Custom GrapesJS Components for Elementor-style Column System
 *
 * This file defines Section and Column component types that implement
 * an Elementor-style hierarchy: Section → Columns → Widgets
 */

import {
  ColorTraits,
  SpacingTraits,
  BorderTraits,
  BoxShadowTraits,
  BackgroundTraits,
  DimensionTraits,
  FlexboxTraits,
  PositionTraits,
  ResponsiveTraits,
  CustomCSSTraits,
} from './commonTraits';

import {
  getContentWidgetTraits,
  getLayoutWidgetTraits,
  getCompleteAdvancedTab,
} from './widgetTraitSets';

export function registerSectionComponent(editor: any) {
  editor.DomComponents.addType('flex-section', {
    model: {
      defaults: {
        name: 'Section',
        tagName: 'section',
        draggable: true,
        droppable: '.flex-column', // Only columns can be dropped inside
        attributes: { class: 'flex-section-container', 'data-gjs-type': 'flex-section' },
        styles: `
          .flex-section-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            min-height: 100px;
            padding: 20px;
            gap: 10px;
            position: relative;
            background: #f9fafb;
            border: 2px dashed #e5e7eb;
          }
        `,
        // Start with one column by default
        components: [
          {
            type: 'flex-column',
            attributes: { class: 'flex-column' },
            style: { 'flex': '1 1 auto', 'min-width': '50px' }
          }
        ],
        // Toolbar with Add Column button
        toolbar: [
          {
            attributes: { class: 'fa fa-plus' },
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;

              const columns = selected.components();
              if (columns.length >= 6) {
                alert('Maximum 6 columns allowed');
                return;
              }

              // Add new column to the right
              selected.append({
                type: 'flex-column',
                attributes: { class: 'flex-column' },
                style: { 'flex': '1 1 auto', 'min-width': '50px' }
              });
            },
            label: '+ Column'
          }
        ],
        traits: [
          // ==================== CONTENT TAB ====================
          // Structure Section
          {
            type: 'button',
            label: 'Add Column',
            name: 'add-column',
            category: 'content',
            section: 'structure',
            text: '+ Add Column',
            full: true,
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;

              const columns = selected.components();
              const columnCount = columns.length;

              if (columnCount >= 6) {
                alert('Maximum 6 columns allowed');
                return;
              }

              selected.append({
                type: 'flex-column',
                attributes: {
                  class: 'flex-column',
                  style: 'flex: 1;'
                }
              });
            }
          },
          {
            type: 'button',
            label: 'Remove Column',
            name: 'remove-column',
            category: 'content',
            section: 'structure',
            text: '- Remove Column',
            full: true,
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;

              const columns = selected.components();

              if (columns.length <= 1) {
                alert('Sections must have at least 1 column');
                return;
              }

              columns.at(columns.length - 1).remove();
            }
          },

          // ==================== STYLE TAB ====================
          // Colors Section
          ColorTraits.backgroundColor(),
          ColorTraits.borderColor(),

          // Background Section
          BackgroundTraits.backgroundType(),
          BackgroundTraits.backgroundImage(),
          BackgroundTraits.backgroundPosition(),
          BackgroundTraits.backgroundSize(),
          BackgroundTraits.backgroundRepeat(),
          BackgroundTraits.backgroundAttachment(),

          // Spacing Section
          SpacingTraits.paddingTop(),
          SpacingTraits.paddingBottom(),
          SpacingTraits.marginTop(),
          SpacingTraits.marginBottom(),

          // Border Section
          BorderTraits.borderWidth(),
          BorderTraits.borderStyle(),
          BorderTraits.borderRadius(),

          // Box Shadow Section
          BoxShadowTraits.shadowH(),
          BoxShadowTraits.shadowV(),
          BoxShadowTraits.shadowBlur(),
          BoxShadowTraits.shadowSpread(),
          BoxShadowTraits.shadowColor(),
          BoxShadowTraits.shadowPosition(),

          // Layout Section
          {
            type: 'select',
            label: 'Column Gap',
            name: 'gap',
            category: 'style',
            section: 'layout',
            options: [
              { value: '0px', name: 'No Gap' },
              { value: '10px', name: 'Small (10px)' },
              { value: '20px', name: 'Medium (20px)' },
              { value: '30px', name: 'Large (30px)' },
              { value: '40px', name: 'X-Large (40px)' },
            ],
            changeProp: 1
          },
          FlexboxTraits.flexDirection(),
          FlexboxTraits.justifyContent(),
          FlexboxTraits.alignItems(),
          DimensionTraits.width(),
          DimensionTraits.minHeight(),
          DimensionTraits.maxWidth(),
          DimensionTraits.display(),
          DimensionTraits.overflow(),

          // ==================== ADVANCED TAB ====================
          // Position Section
          PositionTraits.position(),
          PositionTraits.top(),
          PositionTraits.right(),
          PositionTraits.bottom(),
          PositionTraits.left(),
          PositionTraits.zIndex(),

          // Responsive Section
          ResponsiveTraits.hideDesktop(),
          ResponsiveTraits.hideTablet(),
          ResponsiveTraits.hideMobile(),
          ResponsiveTraits.opacity(),

          // CSS Section
          CustomCSSTraits.cssClasses(),
          CustomCSSTraits.cssId(),
          CustomCSSTraits.customCSS(),
        ]
      }
    }
  });
}

export function registerColumnComponent(editor: any) {
  editor.DomComponents.addType('flex-column', {
    model: {
      defaults: {
        name: 'Column',
        tagName: 'div',
        draggable: '.flex-section-container', // Can only be dragged within sections
        droppable: true, // Can accept any component
        attributes: { class: 'flex-column', 'data-gjs-type': 'flex-column' },
        styles: `
          .flex-column {
            flex: 1;
            min-width: 50px;
            min-height: 50px;
            padding: 15px;
            background: #ffffff;
            border: 1px dashed #d1d5db;
            position: relative;
          }
          .flex-column:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
          }
          .flex-column.gjs-selected {
            background: rgba(59, 151, 227, 0.1);
            border: 2px solid #3b97e3;
          }
        `,
        resizable: {
          tl: 0, // top-left
          tc: 0, // top-center
          tr: 0, // top-right
          cl: 0, // center-left
          cr: 1, // center-right - ENABLED for horizontal resize
          bl: 0, // bottom-left
          bc: 1, // bottom-center - ENABLED for vertical resize
          br: 1, // bottom-right - ENABLED for both
          minDim: 50,
          maxDim: 100,
          step: 0.1,
          // Use percentage-based sizing for better flexbox behavior
          currentUnit: 1,
          minDimKeepRatio: 1,
          unitWidth: '%',
          unitHeight: 'px',
          keyWidth: 'flex-basis',
          keyHeight: 'min-height'
        },
        traits: [
          // ==================== CONTENT TAB ====================
          // Structure Section
          {
            type: 'button',
            label: 'Add Column to Right',
            name: 'add-column-right',
            category: 'content',
            section: 'structure',
            text: '➕ Add Column to Right',
            full: true,
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;

              const parent = selected.parent();
              if (!parent) return;

              const columns = parent.components();
              if (columns.length >= 6) {
                alert('Maximum 6 columns allowed');
                return;
              }

              const index = columns.indexOf(selected);
              parent.append({
                type: 'flex-column',
                attributes: { class: 'flex-column' },
                style: { 'flex': '1 1 auto', 'min-width': '50px' }
              }, { at: index + 1 });
            }
          },
          {
            type: 'button',
            label: 'Delete This Column',
            name: 'delete-column',
            category: 'content',
            section: 'structure',
            text: '🗑️ Delete This Column',
            full: true,
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;

              const parent = selected.parent();
              if (!parent) return;

              const columns = parent.components();
              if (columns.length <= 1) {
                alert('Sections must have at least 1 column');
                return;
              }

              selected.remove();
            }
          },

          // ==================== STYLE TAB ====================
          // Colors Section
          ColorTraits.backgroundColor(),
          ColorTraits.textColor(),
          ColorTraits.borderColor(),

          // Background Section
          BackgroundTraits.backgroundType(),
          BackgroundTraits.backgroundImage(),
          BackgroundTraits.backgroundPosition(),
          BackgroundTraits.backgroundSize(),
          BackgroundTraits.backgroundRepeat(),

          // Spacing Section
          SpacingTraits.paddingTop(),
          SpacingTraits.paddingBottom(),
          SpacingTraits.marginTop(),
          SpacingTraits.marginBottom(),

          // Border Section
          BorderTraits.borderWidth(),
          BorderTraits.borderStyle(),
          BorderTraits.borderRadius(),

          // Box Shadow Section
          BoxShadowTraits.shadowH(),
          BoxShadowTraits.shadowV(),
          BoxShadowTraits.shadowBlur(),
          BoxShadowTraits.shadowSpread(),
          BoxShadowTraits.shadowColor(),

          // Layout Section
          {
            type: 'select',
            label: 'Width',
            name: 'flex-basis',
            category: 'style',
            section: 'layout',
            options: [
              { value: 'auto', name: 'Auto (Equal Flex)' },
              { value: '25%', name: '25%' },
              { value: '33.333%', name: '33%' },
              { value: '50%', name: '50%' },
              { value: '66.666%', name: '66%' },
              { value: '75%', name: '75%' },
              { value: '100%', name: '100%' },
            ],
            changeProp: 1
          },
          {
            type: 'number',
            label: 'Flex Grow',
            name: 'flex-grow',
            category: 'style',
            section: 'layout',
            placeholder: '1',
            min: 0,
            max: 10,
            step: 1,
            changeProp: 1
          },
          FlexboxTraits.justifyContent(),
          FlexboxTraits.alignItems(),
          DimensionTraits.height(),
          DimensionTraits.minHeight(),
          DimensionTraits.overflow(),

          // ==================== ADVANCED TAB ====================
          // Position Section
          PositionTraits.position(),
          PositionTraits.top(),
          PositionTraits.right(),
          PositionTraits.bottom(),
          PositionTraits.left(),
          PositionTraits.zIndex(),

          // Responsive Section
          ResponsiveTraits.hideDesktop(),
          ResponsiveTraits.hideTablet(),
          ResponsiveTraits.hideMobile(),
          ResponsiveTraits.opacity(),

          // CSS Section
          CustomCSSTraits.cssClasses(),
          CustomCSSTraits.cssId(),
          CustomCSSTraits.customCSS(),
        ]
      }
    }
  });
}

/**
 * Menu Anchor Widget
 * Creates an invisible anchor point for smooth scroll navigation
 */
export function registerMenuAnchor(editor: any) {
  editor.DomComponents.addType('menu-anchor', {
    model: {
      defaults: {
        name: 'Menu Anchor',
        tagName: 'div',
        draggable: true,
        droppable: false,
        attributes: {
          class: 'menu-anchor',
          'data-gjs-type': 'menu-anchor',
          id: 'anchor-' + Math.random().toString(36).substr(2, 9)
        },
        styles: `
          .menu-anchor {
            position: relative;
            height: 0;
            width: 100%;
            overflow: visible;
          }
        `,
        traits: getContentWidgetTraits([
          {
            type: 'text',
            label: 'Anchor ID',
            name: 'id',
            category: 'content',
            section: 'content',
            placeholder: 'Enter unique anchor ID',
            changeProp: 0,
          }
        ])
      }
    },
    view: {
      onRender(this: any) {
        const el: HTMLElement = this.el;
        const anchorId = el.id || 'no-id';

        // Add visual indicator in editor only
        if (!el.querySelector('.anchor-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'anchor-indicator';
          indicator.innerHTML = `⚓ Anchor: <strong>${anchorId}</strong>`;
          indicator.style.cssText = `
            background: #fef3c7;
            border: 2px dashed #fbbf24;
            padding: 8px 12px;
            text-align: center;
            font-size: 12px;
            color: #92400e;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            border-radius: 4px;
            margin: 5px 0;
            cursor: pointer;
          `;
          el.appendChild(indicator);
        } else {
          // Update indicator if ID changes
          const indicator = el.querySelector('.anchor-indicator');
          if (indicator) {
            indicator.innerHTML = `⚓ Anchor: <strong>${anchorId}</strong>`;
          }
        }
      }
    }
  });
}
/**
 * Additional Elementor-style Widgets - Phases 1-4
 * These functions register all remaining widgets
 */

/**
 * Blockquote Widget - Phase 1.2
 * Styled quote block with author attribution
 */
export function registerBlockquote(editor: any) {
  editor.DomComponents.addType('blockquote-widget', {
    model: {
      defaults: {
        name: 'Blockquote',
        tagName: 'blockquote',
        draggable: true,
        droppable: false,
        attributes: { class: 'blockquote-widget' },
        content: `
          <div class="blockquote-icon">"</div>
          <div class="blockquote-content">
            <p class="blockquote-text" data-gjs-editable="true">This is a quote that inspires and motivates.</p>
            <div class="blockquote-author">
              <img class="blockquote-author-img" src="https://via.placeholder.com/64" alt="Author" />
              <div class="blockquote-author-info">
                <div class="blockquote-author-name" data-gjs-editable="true">John Doe</div>
                <div class="blockquote-author-title" data-gjs-editable="true">CEO, Company Inc.</div>
              </div>
            </div>
          </div>
        `,
        styles: `
          .blockquote-widget {
            padding: 30px;
            background: #f9fafb;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            position: relative;
          }
          .blockquote-icon {
            font-size: 64px;
            color: #3b82f6;
            opacity: 0.2;
            position: absolute;
            top: 10px;
            left: 10px;
            font-family: Georgia, serif;
          }
          .blockquote-content {
            position: relative;
            z-index: 1;
          }
          .blockquote-text {
            font-size: 20px;
            font-style: italic;
            margin-bottom: 20px;
            color: #1f2937;
          }
          .blockquote-author {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .blockquote-author-img {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
          }
          .blockquote-author-name {
            font-weight: bold;
            color: #374151;
          }
          .blockquote-author-title {
            font-size: 14px;
            color: #6b7280;
          }
        `,
        traits: getContentWidgetTraits([
          {
            type: 'select',
            label: 'Border Position',
            name: 'border-position',
            category: 'content',
            section: 'content',
            options: [
              { value: 'left', name: 'Left' },
              { value: 'right', name: 'Right' },
              { value: 'top', name: 'Top' },
              { value: 'bottom', name: 'Bottom' },
            ],
            changeProp: 1
          }
        ])
      }
    }
  });
}

/**
 * Site Logo Widget - Phase 1.3
 * Logo image with link
 */
export function registerSiteLogo(editor: any) {
  editor.DomComponents.addType('site-logo', {
    model: {
      defaults: {
        name: 'Site Logo',
        tagName: 'a',
        draggable: true,
        droppable: false,
        attributes: {
          class: 'site-logo',
          href: '/',
          'aria-label': 'Site Logo'
        },
        components: [
          {
            tagName: 'img',
            attributes: {
              src: 'https://via.placeholder.com/200x60/3b82f6/ffffff?text=LOGO',
              alt: 'Site Logo',
              class: 'site-logo-img'
            }
          }
        ],
        styles: `
          .site-logo {
            display: inline-block;
            text-decoration: none;
          }
          .site-logo-img {
            max-width: 200px;
            height: auto;
            display: block;
          }
        `,
        traits: getContentWidgetTraits([
          {
            type: 'text',
            label: 'Logo URL',
            name: 'src',
            category: 'content',
            section: 'content',
            placeholder: 'Enter logo image URL',
            changeProp: 0
          },
          {
            type: 'text',
            label: 'Link URL',
            name: 'href',
            category: 'content',
            section: 'content',
            placeholder: '/',
            changeProp: 0
          },
          {
            type: 'checkbox',
            label: 'Open in New Tab',
            name: 'target',
            category: 'content',
            section: 'content',
            valueTrue: '_blank',
            valueFalse: '',
            changeProp: 0
          },
          {
            type: 'text',
            label: 'Alt Text',
            name: 'alt',
            category: 'content',
            section: 'content',
            placeholder: 'Site Logo',
            changeProp: 0
          },
          {
            type: 'number',
            label: 'Max Width (px)',
            name: 'max-width',
            category: 'content',
            section: 'content',
            placeholder: '200',
            min: 50,
            max: 800,
            changeProp: 1
          }
        ])
      }
    }
  });
}

/**
 * Icon List Widget - Phase 1.4
 * List items with icons
 */
export function registerIconList(editor: any) {
  editor.DomComponents.addType('icon-list', {
    model: {
      defaults: {
        name: 'Icon List',
        tagName: 'ul',
        draggable: true,
        droppable: '.icon-list-item',
        attributes: { class: 'icon-list' },
        components: [
          { type: 'icon-list-item', content: '<span class="icon-list-icon">✓</span><span class="icon-list-text">First item</span>' },
          { type: 'icon-list-item', content: '<span class="icon-list-icon">✓</span><span class="icon-list-text">Second item</span>' },
          { type: 'icon-list-item', content: '<span class="icon-list-icon">✓</span><span class="icon-list-text">Third item</span>' }
        ],
        styles: `
          .icon-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .icon-list-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
          }
          .icon-list-icon {
            color: #3b82f6;
            font-size: 20px;
            flex-shrink: 0;
          }
          .icon-list-text {
            color: #374151;
            font-size: 16px;
          }
        `,
        traits: getContentWidgetTraits([
          {
            type: 'button',
            label: 'Add Item',
            name: 'add-item',
            category: 'content',
            section: 'content',
            text: '+ Add Item',
            full: true,
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;
              selected.append({
                type: 'icon-list-item',
                content: '<span class="icon-list-icon">✓</span><span class="icon-list-text">New item</span>'
              });
            }
          },
          {
            type: 'select',
            label: 'Layout',
            name: 'flex-direction',
            category: 'content',
            section: 'content',
            options: [
              { value: 'column', name: 'Vertical' },
              { value: 'row', name: 'Horizontal' }
            ],
            changeProp: 1
          }
        ])
      }
    }
  });

  editor.DomComponents.addType('icon-list-item', {
    model: {
      defaults: {
        name: 'Icon List Item',
        tagName: 'li',
        draggable: '.icon-list',
        droppable: false,
        attributes: { class: 'icon-list-item' }
      }
    }
  });
}

/**
 * Inner Section Widget - Phase 2.1
 * Nested section within columns
 */
export function registerInnerSection(editor: any) {
  editor.DomComponents.addType('inner-section', {
    model: {
      defaults: {
        name: 'Inner Section',
        tagName: 'div',
        draggable: '.flex-column',
        droppable: '.inner-column',
        attributes: {
          class: 'inner-section-container',
          'data-gjs-type': 'inner-section'
        },
        components: [
          {
            type: 'inner-column',
            attributes: { class: 'inner-column' },
            style: { 'flex': '1 1 auto', 'min-width': '50px' }
          }
        ],
        styles: `
          .inner-section-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            min-height: 80px;
            padding: 15px;
            gap: 10px;
            background: #fef3c7;
            border: 2px dashed #fbbf24;
            position: relative;
          }
          .inner-section-container:hover {
            border-color: #f59e0b;
            background: #fef3c7;
          }
          .inner-section-container.gjs-selected {
            outline: 2px solid #f59e0b !important;
            outline-offset: 2px;
            background: #fef3c7;
            border-color: #f59e0b;
          }
        `,
        traits: getLayoutWidgetTraits([
          {
            type: 'button',
            label: 'Add Inner Column',
            name: 'add-inner-column',
            category: 'content',
            section: 'structure',
            text: '+ Add Inner Column',
            full: true,
            command: (editor: any) => {
              const selected = editor.getSelected();
              if (!selected) return;
              const columns = selected.components();
              if (columns.length >= 4) {
                alert('Maximum 4 inner columns allowed');
                return;
              }
              selected.append({
                type: 'inner-column',
                attributes: { class: 'inner-column' },
                style: { 'flex': '1 1 auto', 'min-width': '50px' }
              });
            }
          },
          {
            type: 'select',
            label: 'Column Gap',
            name: 'gap',
            category: 'content',
            section: 'structure',
            options: [
              { value: '0px', name: 'No Gap' },
              { value: '10px', name: 'Small' },
              { value: '20px', name: 'Medium' },
              { value: '30px', name: 'Large' }
            ],
            changeProp: 1
          }
        ])
      }
    }
  });

  editor.DomComponents.addType('inner-column', {
    model: {
      defaults: {
        name: 'Inner Column',
        tagName: 'div',
        draggable: '.inner-section-container',
        droppable: (component: any) => {
          // Prevent inner-sections from being dropped into inner-columns
          const type = typeof component === 'string' ? component : component.get?.('type');
          return type !== 'inner-section' && type !== 'flex-section';
        },
        attributes: {
          class: 'inner-column',
          'data-gjs-type': 'inner-column'
        },
        styles: `
          .inner-column {
            flex: 1;
            min-width: 50px;
            min-height: 50px;
            padding: 10px;
            background: #ffffff;
            border: 1px dashed #fbbf24;
            position: relative;
          }
          .inner-column:hover {
            background: #fffbeb;
            border-color: #f59e0b;
          }
          .inner-column.gjs-selected {
            background: rgba(245, 158, 11, 0.1);
            border: 2px solid #f59e0b;
          }
        `
      }
    }
  });
}

/**
 * Breadcrumbs Widget - Phase 2.2
 * Navigation breadcrumbs
 */
export function registerBreadcrumbs(editor: any) {
  editor.DomComponents.addType('breadcrumbs', {
    model: {
      defaults: {
        name: 'Breadcrumbs',
        tagName: 'nav',
        draggable: true,
        droppable: false,
        attributes: {
          class: 'breadcrumbs',
          'aria-label': 'Breadcrumb'
        },
        content: `
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
              <a href="/">🏠 Home</a>
            </li>
            <li class="breadcrumb-separator">/</li>
            <li class="breadcrumb-item">
              <a href="/category">Category</a>
            </li>
            <li class="breadcrumb-separator">/</li>
            <li class="breadcrumb-item active">
              <span>Current Page</span>
            </li>
          </ol>
        `,
        styles: `
          .breadcrumbs {
            padding: 10px 0;
          }
          .breadcrumb-list {
            list-style: none;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0;
            margin: 0;
            flex-wrap: wrap;
          }
          .breadcrumb-item a {
            color: #3b82f6;
            text-decoration: none;
          }
          .breadcrumb-item a:hover {
            text-decoration: underline;
          }
          .breadcrumb-item.active {
            color: #6b7280;
          }
          .breadcrumb-separator {
            color: #9ca3af;
            user-select: none;
          }
        `,
        traits: getContentWidgetTraits([
          {
            type: 'text',
            label: 'Separator',
            name: 'separator',
            category: 'content',
            section: 'content',
            placeholder: '/',
            changeProp: 0
          },
          {
            type: 'select',
            label: 'Alignment',
            name: 'justify-content',
            category: 'content',
            section: 'content',
            options: [
              { value: 'flex-start', name: 'Left' },
              { value: 'center', name: 'Center' },
              { value: 'flex-end', name: 'Right' }
            ],
            changeProp: 1
          }
        ])
      }
    }
  });
}

/**
 * Countdown Widget - Phase 3.1
 * Countdown timer to a specific date
 */
export function registerCountdown(editor: any) {
  editor.DomComponents.addType('countdown', {
    model: {
      defaults: {
        name: 'Countdown',
        tagName: 'div',
        draggable: true,
        droppable: false,
        attributes: {
          class: 'countdown-widget',
          'data-target-date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        content: `
          <div class="countdown-container">
            <div class="countdown-unit">
              <div class="countdown-digit" data-unit="days">7</div>
              <div class="countdown-label">Days</div>
            </div>
            <div class="countdown-unit">
              <div class="countdown-digit" data-unit="hours">0</div>
              <div class="countdown-label">Hours</div>
            </div>
            <div class="countdown-unit">
              <div class="countdown-digit" data-unit="minutes">0</div>
              <div class="countdown-label">Minutes</div>
            </div>
            <div class="countdown-unit">
              <div class="countdown-digit" data-unit="seconds">0</div>
              <div class="countdown-label">Seconds</div>
            </div>
          </div>
          <div class="countdown-expire-message" style="display: none;">Time's up!</div>
        `,
        styles: `
          .countdown-widget {
            padding: 20px;
          }
          .countdown-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
          }
          .countdown-unit {
            text-align: center;
            min-width: 80px;
          }
          .countdown-digit {
            font-size: 48px;
            font-weight: bold;
            color: #3b82f6;
            line-height: 1;
            margin-bottom: 8px;
          }
          .countdown-label {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .countdown-expire-message {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #ef4444;
          }
        `,
        script: function(this: any) {
          const targetDate = new Date(this.getAttribute('data-target-date')).getTime();
          const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
              clearInterval(interval);
              this.querySelector('.countdown-container').style.display = 'none';
              this.querySelector('.countdown-expire-message').style.display = 'block';
              return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            this.querySelector('[data-unit="days"]').textContent = days;
            this.querySelector('[data-unit="hours"]').textContent = hours;
            this.querySelector('[data-unit="minutes"]').textContent = minutes;
            this.querySelector('[data-unit="seconds"]').textContent = seconds;
          };

          updateCountdown();
          const interval = setInterval(updateCountdown, 1000);
        },
        traits: getContentWidgetTraits([
          {
            type: 'text',
            label: 'Target Date',
            name: 'data-target-date',
            category: 'content',
            section: 'content',
            placeholder: 'YYYY-MM-DD',
            changeProp: 0
          },
          {
            type: 'text',
            label: 'Expire Message',
            name: 'expire-message',
            category: 'content',
            section: 'content',
            placeholder: "Time's up!",
            changeProp: 0
          }
        ])
      }
    }
  });
}

/**
 * Tabs Widget - Phase 3.2
 * Tabbed content interface
 */
export function registerTabs(editor: any) {
  editor.DomComponents.addType('tabs-container', {
    model: {
      defaults: {
        name: 'Tabs',
        tagName: 'div',
        draggable: true,
        droppable: false,
        attributes: { class: 'tabs-container' },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'tabs-nav' },
            components: [
              { tagName: 'button', attributes: { class: 'tab-nav-item active', 'data-tab': 'tab-1' }, content: 'Tab 1' },
              { tagName: 'button', attributes: { class: 'tab-nav-item', 'data-tab': 'tab-2' }, content: 'Tab 2' },
              { tagName: 'button', attributes: { class: 'tab-nav-item', 'data-tab': 'tab-3' }, content: 'Tab 3' }
            ]
          },
          {
            tagName: 'div',
            attributes: { class: 'tabs-content' },
            components: [
              { tagName: 'div', attributes: { class: 'tab-panel active', 'data-tab': 'tab-1' }, content: '<p>Content for tab 1</p>' },
              { tagName: 'div', attributes: { class: 'tab-panel', 'data-tab': 'tab-2' }, content: '<p>Content for tab 2</p>' },
              { tagName: 'div', attributes: { class: 'tab-panel', 'data-tab': 'tab-3' }, content: '<p>Content for tab 3</p>' }
            ]
          }
        ],
        styles: `
          .tabs-container {
            width: 100%;
          }
          .tabs-nav {
            display: flex;
            border-bottom: 2px solid #e5e7eb;
            gap: 4px;
          }
          .tab-nav-item {
            padding: 12px 24px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 16px;
            color: #6b7280;
            transition: all 0.2s;
          }
          .tab-nav-item:hover {
            color: #3b82f6;
          }
          .tab-nav-item.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
            font-weight: 600;
          }
          .tabs-content {
            padding: 20px 0;
          }
          .tab-panel {
            display: none;
          }
          .tab-panel.active {
            display: block;
          }
        `,
        script: function(this: any) {
          const tabs = this.querySelectorAll('.tab-nav-item');
          tabs.forEach((tab: Element) => {
            tab.addEventListener('click', function(this: HTMLElement) {
              const tabId = this.getAttribute('data-tab');
              const container = this.closest('.tabs-container');
              if (!container) return;

              // Remove active class from all tabs and panels
              tabs.forEach((t: Element) => t.classList.remove('active'));
              const panels = container.querySelectorAll('.tab-panel');
              panels.forEach((p: Element) => p.classList.remove('active'));

              // Add active class to clicked tab and corresponding panel
              this.classList.add('active');
              const panel = container.querySelector(`.tab-panel[data-tab="${tabId}"]`);
              if (panel) panel.classList.add('active');
            });
          });
        },
        traits: getLayoutWidgetTraits([
          {
            type: 'select',
            label: 'Tab Style',
            name: 'tab-style',
            category: 'content',
            section: 'structure',
            options: [
              { value: 'default', name: 'Default' },
              { value: 'pills', name: 'Pills' },
              { value: 'underline', name: 'Underline' }
            ],
            changeProp: 1
          }
        ])
      }
    }
  });
}

/**
 * Off-Canvas Widget - Phase 3.3
 * Slide-out panel/drawer
 */
export function registerOffCanvas(editor: any) {
  editor.DomComponents.addType('off-canvas', {
    model: {
      defaults: {
        name: 'Off Canvas',
        tagName: 'div',
        draggable: true,
        droppable: false,
        attributes: { class: 'off-canvas-wrapper' },
        components: [
          {
            tagName: 'button',
            attributes: { class: 'off-canvas-trigger-btn' },
            content: 'Open Panel'
          },
          {
            tagName: 'div',
            attributes: { class: 'off-canvas-panel' },
            components: [
              {
                tagName: 'button',
                attributes: { class: 'off-canvas-close' },
                content: '×'
              },
              {
                tagName: 'div',
                attributes: { class: 'off-canvas-content' },
                droppable: true,
                content: '<p>Panel content goes here...</p>'
              }
            ]
          },
          {
            tagName: 'div',
            attributes: { class: 'off-canvas-overlay' }
          }
        ],
        styles: `
          .off-canvas-trigger-btn {
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }
          .off-canvas-panel {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 9999;
            overflow-y: auto;
          }
          .off-canvas-panel.active {
            right: 0;
          }
          .off-canvas-close {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            border: none;
            background: #f3f4f6;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
          }
          .off-canvas-close:hover {
            background: #e5e7eb;
          }
          .off-canvas-content {
            padding: 60px 20px 20px 20px;
          }
          .off-canvas-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 9998;
          }
          .off-canvas-overlay.active {
            opacity: 1;
            visibility: visible;
          }
        `,
        script: function(this: any) {
          const trigger = this.querySelector('.off-canvas-trigger-btn');
          const panel = this.querySelector('.off-canvas-panel');
          const overlay = this.querySelector('.off-canvas-overlay');
          const close = this.querySelector('.off-canvas-close');

          trigger.addEventListener('click', () => {
            panel.classList.add('active');
            overlay.classList.add('active');
          });

          const closePanel = () => {
            panel.classList.remove('active');
            overlay.classList.remove('active');
          };

          close.addEventListener('click', closePanel);
          overlay.addEventListener('click', closePanel);
        },
        traits: getLayoutWidgetTraits([
          {
            type: 'text',
            label: 'Trigger Button Text',
            name: 'trigger-text',
            category: 'content',
            section: 'structure',
            placeholder: 'Open Panel',
            changeProp: 0
          },
          {
            type: 'select',
            label: 'Position',
            name: 'position',
            category: 'content',
            section: 'structure',
            options: [
              { value: 'right', name: 'Right' },
              { value: 'left', name: 'Left' }
            ],
            changeProp: 1
          }
        ])
      }
    }
  });
}

/**
 * Form Widget - Phase 4.1
 * Contact form builder
 */
export function registerFormBuilder(editor: any) {
  editor.DomComponents.addType('form-builder', {
    model: {
      defaults: {
        name: 'Form',
        tagName: 'form',
        draggable: true,
        droppable: true,
        attributes: {
          class: 'form-builder',
          method: 'POST',
          action: '/submit-form'
        },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'form-field' },
            content: '<label>Name:</label><input type="text" name="name" placeholder="Your name" required />'
          },
          {
            tagName: 'div',
            attributes: { class: 'form-field' },
            content: '<label>Email:</label><input type="email" name="email" placeholder="your@email.com" required />'
          },
          {
            tagName: 'div',
            attributes: { class: 'form-field' },
            content: '<label>Message:</label><textarea name="message" rows="5" placeholder="Your message..." required></textarea>'
          },
          {
            tagName: 'button',
            attributes: { type: 'submit', class: 'form-submit-btn' },
            content: 'Submit'
          }
        ],
        styles: `
          .form-builder {
            max-width: 600px;
            margin: 0 auto;
          }
          .form-field {
            margin-bottom: 20px;
          }
          .form-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
          }
          .form-field input,
          .form-field textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 16px;
            font-family: inherit;
          }
          .form-field input:focus,
          .form-field textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .form-submit-btn {
            width: 100%;
            padding: 14px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .form-submit-btn:hover {
            background: #2563eb;
          }
        `,
        traits: getLayoutWidgetTraits([
          {
            type: 'text',
            label: 'Form Action',
            name: 'action',
            category: 'content',
            section: 'structure',
            placeholder: '/submit-form',
            changeProp: 0
          },
          {
            type: 'select',
            label: 'Method',
            name: 'method',
            category: 'content',
            section: 'structure',
            options: [
              { value: 'POST', name: 'POST' },
              { value: 'GET', name: 'GET' }
            ],
            changeProp: 0
          }
        ])
      }
    }
  });
}

/**
 * Sitemap Widget - Phase 4.2
 * Hierarchical site structure navigation
 */
export function registerSitemap(editor: any) {
  editor.DomComponents.addType('sitemap', {
    model: {
      defaults: {
        name: 'Sitemap',
        tagName: 'div',
        draggable: true,
        droppable: false,
        attributes: { class: 'sitemap-widget' },
        content: `
          <div class="sitemap-container">
            <h3 class="sitemap-title">Sitemap</h3>
            <ul class="sitemap-list">
              <li class="sitemap-item">
                <a href="/">Home</a>
                <ul class="sitemap-list sitemap-list-nested">
                  <li class="sitemap-item"><a href="/about">About</a></li>
                  <li class="sitemap-item">
                    <a href="/services">Services</a>
                    <ul class="sitemap-list sitemap-list-nested">
                      <li class="sitemap-item"><a href="/services/web-design">Web Design</a></li>
                      <li class="sitemap-item"><a href="/services/seo">SEO</a></li>
                    </ul>
                  </li>
                  <li class="sitemap-item"><a href="/contact">Contact</a></li>
                </ul>
              </li>
            </ul>
          </div>
        `,
        styles: `
          .sitemap-widget {
            padding: 20px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .sitemap-title {
            margin-bottom: 15px;
            font-size: 24px;
            color: #1f2937;
          }
          .sitemap-list {
            list-style: none;
            padding-left: 0;
          }
          .sitemap-list-nested {
            padding-left: 20px;
            margin-top: 8px;
          }
          .sitemap-item {
            margin: 5px 0;
          }
          .sitemap-item a {
            color: #3b82f6;
            text-decoration: none;
          }
          .sitemap-item a:hover {
            text-decoration: underline;
          }
        `,
        traits: getContentWidgetTraits([
          {
            type: 'number',
            label: 'Max Depth',
            name: 'max-depth',
            category: 'content',
            section: 'content',
            placeholder: '3',
            min: 1,
            max: 6,
            changeProp: 0
          }
        ])
      }
    }
  });
}
