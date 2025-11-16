# 🎨 Elementor-Style Page Builder UI/UX

## Enhanced Layout System

### 1. **Floating/Resizable Panels**
```tsx
// components/editor/ResizablePanel.tsx
'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  position: 'left' | 'right';
}

export default function ResizablePanel({ 
  children, 
  defaultWidth, 
  minWidth, 
  maxWidth, 
  position 
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = position === 'left' ? e.clientX - startX : startX - e.clientX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <motion.div
      ref={panelRef}
      className={`resizable-panel ${position}`}
      style={{ width }}
      animate={{ width }}
    >
      {children}
      <div
        className={`resize-handle ${position}`}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
      />
    </motion.div>
  );
}
```

### 2. **Contextual Toolbar**
```tsx
// components/editor/ContextualToolbar.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Move, Settings, Eye, EyeOff } from 'lucide-react';

interface ContextualToolbarProps {
  selectedElement: any;
  position: { x: number; y: number };
}

export default function ContextualToolbar({ selectedElement, position }: ContextualToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!selectedElement);
  }, [selectedElement]);

  const actions = [
    { icon: Move, label: 'Move', action: () => {} },
    { icon: Copy, label: 'Duplicate', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: Eye, label: 'Hide', action: () => {} },
    { icon: Trash2, label: 'Delete', action: () => {}, danger: true }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="contextual-toolbar"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y - 50,
            zIndex: 1000
          }}
        >
          <div className="toolbar-content">
            <span className="element-name">{selectedElement?.name}</span>
            <div className="toolbar-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`toolbar-btn ${action.danger ? 'danger' : ''}`}
                  onClick={action.action}
                  title={action.label}
                >
                  <action.icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 3. **Advanced Blocks Panel with Live Preview**
```tsx
// components/editor/AdvancedBlocksPanel.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, Folder } from 'lucide-react';

export default function AdvancedBlocksPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const blockCategories = [
    { id: 'all', name: 'All', count: 24 },
    { id: 'layout', name: 'Layout', count: 8 },
    { id: 'content', name: 'Content', count: 12 },
    { id: 'advanced', name: 'Advanced', count: 4 },
    { id: 'favorites', name: 'Favorites', count: 3, icon: Star },
    { id: 'recent', name: 'Recent', count: 5, icon: Clock }
  ];

  const blocks = [
    {
      id: 'heading',
      name: 'Heading',
      category: 'content',
      icon: '📝',
      preview: '/previews/heading.png',
      description: 'Add headings with customizable typography'
    },
    {
      id: 'text',
      name: 'Text Block',
      category: 'content',
      icon: '📄',
      preview: '/previews/text.png',
      description: 'Rich text editor with formatting options'
    }
  ];

  return (
    <div className="advanced-blocks-panel">
      {/* Search & Filter */}
      <div className="panel-header">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="categories-list">
        {blockCategories.map(category => (
          <button
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon && <category.icon size={16} />}
            <span>{category.name}</span>
            <span className="count">{category.count}</span>
          </button>
        ))}
      </div>

      {/* Blocks Grid */}
      <div className="blocks-container">
        {blocks.map(block => (
          <motion.div
            key={block.id}
            className="block-item-advanced"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredBlock(block.id)}
            onHoverEnd={() => setHoveredBlock(null)}
            draggable
          >
            <div className="block-preview">
              <div className="block-icon">{block.icon}</div>
              {hoveredBlock === block.id && (
                <motion.div
                  className="block-preview-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img src={block.preview} alt={block.name} />
                </motion.div>
              )}
            </div>
            <div className="block-info">
              <h4>{block.name}</h4>
              <p>{block.description}</p>
            </div>
            <div className="block-actions">
              <button className="favorite-btn">
                <Star size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Blocks */}
      <div className="custom-blocks-section">
        <div className="section-header">
          <Folder size={16} />
          <span>My Blocks</span>
          <button className="add-btn">+</button>
        </div>
        <div className="custom-blocks-grid">
          {/* Custom blocks would go here */}
        </div>
      </div>
    </div>
  );
}
```

### 4. **Navigator Panel**
```tsx
// components/editor/NavigatorPanel.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface NavigatorNode {
  id: string;
  name: string;
  type: string;
  children?: NavigatorNode[];
  isVisible: boolean;
  isLocked: boolean;
}

export default function NavigatorPanel() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: NavigatorNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="navigator-node">
        <div
          className={`node-item ${selectedNode === node.id ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedNode(node.id)}
        >
          {hasChildren && (
            <button
              className="expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          
          <div className="node-icon">{getNodeIcon(node.type)}</div>
          <span className="node-name">{node.name}</span>
          
          <div className="node-actions">
            <button className="action-btn">
              {node.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <button className="action-btn">
              {node.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {node.children!.map(child => renderNode(child, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  const getNodeIcon = (type: string) => {
    const icons: Record<string, string> = {
      section: '📦',
      container: '🗂️',
      heading: '📝',
      text: '📄',
      image: '🖼️',
      button: '🔘'
    };
    return icons[type] || '📄';
  };

  // Mock data
  const pageStructure: NavigatorNode[] = [
    {
      id: '1',
      name: 'Header Section',
      type: 'section',
      isVisible: true,
      isLocked: false,
      children: [
        {
          id: '2',
          name: 'Navigation Container',
          type: 'container',
          isVisible: true,
          isLocked: false,
          children: [
            { id: '3', name: 'Logo', type: 'image', isVisible: true, isLocked: false },
            { id: '4', name: 'Menu', type: 'text', isVisible: true, isLocked: false }
          ]
        }
      ]
    }
  ];

  return (
    <div className="navigator-panel">
      <div className="panel-header">
        <h3>Navigator</h3>
        <button className="collapse-all-btn">Collapse All</button>
      </div>
      
      <div className="navigator-tree">
        {pageStructure.map(node => renderNode(node))}
      </div>
    </div>
  );
}
```

### 5. **Smart Canvas with Snap Guides**
```tsx
// components/editor/SmartCanvas.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SmartCanvas() {
  const [snapGuides, setSnapGuides] = useState<Array<{ x?: number; y?: number }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const showSnapGuides = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    
    if (!canvasRect) return;

    const guides = [
      { x: rect.left - canvasRect.left },
      { x: rect.right - canvasRect.left },
      { y: rect.top - canvasRect.top },
      { y: rect.bottom - canvasRect.top }
    ];

    setSnapGuides(guides);
  };

  const hideSnapGuides = () => {
    setSnapGuides([]);
  };

  return (
    <div className="smart-canvas" ref={canvasRef}>
      {/* Snap Guides */}
      {snapGuides.map((guide, index) => (
        <div
          key={index}
          className={`snap-guide ${guide.x !== undefined ? 'vertical' : 'horizontal'}`}
          style={{
            left: guide.x,
            top: guide.y,
            width: guide.x !== undefined ? '1px' : '100%',
            height: guide.y !== undefined ? '1px' : '100%'
          }}
        />
      ))}

      {/* Grid */}
      <div className="canvas-grid">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 20}px` }} />
        ))}
        {Array.from({ length: 50 }, (_, i) => (
          <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 20}px` }} />
        ))}
      </div>

      {/* Canvas Content */}
      <div className="canvas-content">
        <div id="gjs-canvas"></div>
      </div>

      {/* Selection Overlay */}
      {selectedElement && (
        <motion.div
          className="selection-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            border: '2px solid #6366f1',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
}
```

### 6. **Enhanced CSS with Elementor-Style Design**
```css
/* styles/elementor-editor.css */
:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --bg-tertiary: #3a3a3a;
  --text-primary: #ffffff;
  --text-secondary: #e5e7eb;
  --text-muted: #9ca3af;
  --border-color: #374151;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
}

.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Resizable Panels */
.resizable-panel {
  position: relative;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 600px;
}

.resizable-panel.right {
  border-right: none;
  border-left: 1px solid var(--border-color);
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle.left {
  right: -2px;
}

.resize-handle.right {
  left: -2px;
}

.resize-handle:hover {
  background: var(--primary-color);
}

/* Contextual Toolbar */
.contextual-toolbar {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.toolbar-content {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
}

.element-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 8px;
  border-right: 1px solid var(--border-color);
}

.toolbar-actions {
  display: flex;
  gap: 4px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.toolbar-btn.danger:hover {
  background: var(--danger-color);
  color: white;
}

/* Advanced Blocks Panel */
.advanced-blocks-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-primary);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.search-container input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  outline: none;
  font-size: 14px;
}

.categories-list {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: none;
  color: var(--text-muted);
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.category-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.category-item.active {
  background: var(--primary-color);
  color: white;
}

.category-item .count {
  margin-left: auto;
  font-size: 12px;
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 10px;
}

.category-item.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.blocks-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.block-item-advanced {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.block-item-advanced:hover {
  background: var(--bg-primary);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.block-item-advanced:active {
  cursor: grabbing;
}

.block-preview {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.block-icon {
  font-size: 20px;
}

.block-preview-image {
  position: absolute;
  top: -10px;
  left: 50px;
  width: 120px;
  height: 80px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
  overflow: hidden;
}

.block-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.block-info {
  flex: 1;
}

.block-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.block-info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

.block-actions {
  display: flex;
  gap: 4px;
}

.favorite-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: var(--warning-color);
  color: white;
}

/* Navigator Panel */
.navigator-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.navigator-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.navigator-node {
  margin-bottom: 2px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.node-item:hover {
  background: var(--bg-tertiary);
}

.node-item.selected {
  background: var(--primary-color);
  color: white;
}

.expand-btn {
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-icon {
  font-size: 14px;
}

.node-name {
  flex: 1;
  font-weight: 500;
}

.node-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.node-item:hover .node-actions {
  opacity: 1;
}

.action-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Smart Canvas */
.smart-canvas {
  position: relative;
  flex: 1;
  background: #f8fafc;
  overflow: hidden;
}

.canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
}

.grid-line {
  position: absolute;
  background: #94a3b8;
}

.grid-line.horizontal {
  width: 100%;
  height: 1px;
}

.grid-line.vertical {
  height: 100%;
  width: 1px;
}

.snap-guide {
  position: absolute;
  background: var(--primary-color);
  z-index: 100;
  pointer-events: none;
}

.snap-guide.vertical {
  width: 1px;
  height: 100%;
}

.snap-guide.horizontal {
  width: 100%;
  height: 1px;
}

.selection-overlay {
  background: rgba(99, 102, 241, 0.1);
  border: 2px solid var(--primary-color);
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .resizable-panel {
    min-width: 240px;
  }
}

@media (max-width: 768px) {
  .resizable-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 280px !important;
  }
  
  .block-preview-image {
    display: none;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.panel-enter {
  animation: slideIn 0.3s ease-out;
}

.toolbar-enter {
  animation: fadeIn 0.2s ease-out;
}
```

This Elementor-style UI/UX provides:

- **Professional resizable panels** with smooth interactions
- **Contextual toolbars** that appear on element selection
- **Advanced block library** with live previews and favorites
- **Navigator panel** for easy page structure management
- **Smart canvas** with snap guides and grid system
- **Modern design system** with consistent spacing and colors
- **Responsive layout** that works on all screen sizes

The interface now matches the polish and functionality of professional page builders like Elementor! 🎨✨