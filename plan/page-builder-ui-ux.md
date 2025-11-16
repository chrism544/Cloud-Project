# 🎨 Page Builder UI/UX Design System

## Modern Editor Interface

### 1. **Main Layout Structure**
```tsx
// components/editor/EditorLayout.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorLayout() {
  const [leftPanel, setLeftPanel] = useState<'blocks' | 'layers' | 'assets'>('blocks');
  const [rightPanel, setRightPanel] = useState<'styles' | 'settings'>('styles');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  return (
    <div className="editor-layout">
      {/* Top Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button className="logo-btn">Builder</button>
          <div className="page-info">
            <span className="page-title">Homepage</span>
            <span className="save-status">Saved</span>
          </div>
        </div>
        
        <div className="toolbar-center">
          <div className="device-selector">
            <button className="device-btn active">Desktop</button>
            <button className="device-btn">Tablet</button>
            <button className="device-btn">Mobile</button>
          </div>
        </div>
        
        <div className="toolbar-right">
          <button className="btn-secondary">Preview</button>
          <button className="btn-primary">Publish</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="editor-content">
        {/* Left Panel */}
        <motion.div 
          className="left-panel"
          animate={{ width: isLeftCollapsed ? 60 : 280 }}
        >
          <div className="panel-tabs">
            <button 
              className={leftPanel === 'blocks' ? 'active' : ''}
              onClick={() => setLeftPanel('blocks')}
            >
              Blocks
            </button>
            <button 
              className={leftPanel === 'layers' ? 'active' : ''}
              onClick={() => setLeftPanel('layers')}
            >
              Layers
            </button>
            <button 
              className={leftPanel === 'assets' ? 'active' : ''}
              onClick={() => setLeftPanel('assets')}
            >
              Assets
            </button>
          </div>
          
          <div className="panel-content">
            {leftPanel === 'blocks' && <BlocksPanel />}
            {leftPanel === 'layers' && <LayersPanel />}
            {leftPanel === 'assets' && <AssetsPanel />}
          </div>
        </motion.div>

        {/* Canvas */}
        <div className="canvas-area">
          <div className="canvas-toolbar">
            <div className="zoom-controls">
              <button>-</button>
              <span>100%</span>
              <button>+</button>
            </div>
            <button className="fullscreen-btn">Fullscreen</button>
          </div>
          <div className="canvas-container">
            <div className="canvas-frame">
              {/* GrapesJS Canvas */}
              <div id="gjs-canvas"></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <motion.div 
          className="right-panel"
          animate={{ width: isRightCollapsed ? 60 : 320 }}
        >
          <div className="panel-tabs">
            <button 
              className={rightPanel === 'styles' ? 'active' : ''}
              onClick={() => setRightPanel('styles')}
            >
              Styles
            </button>
            <button 
              className={rightPanel === 'settings' ? 'active' : ''}
              onClick={() => setRightPanel('settings')}
            >
              Settings
            </button>
          </div>
          
          <div className="panel-content">
            {rightPanel === 'styles' && <StylesPanel />}
            {rightPanel === 'settings' && <SettingsPanel />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

### 2. **Modern Blocks Panel**
```tsx
// components/editor/BlocksPanel.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, Type, Image, Layout, Zap } from 'lucide-react';

const blockCategories = [
  {
    id: 'layout',
    name: 'Layout',
    icon: Layout,
    blocks: [
      { id: 'section', name: 'Section', icon: '📦' },
      { id: 'container', name: 'Container', icon: '🗂️' },
      { id: 'columns', name: 'Columns', icon: '📊' },
      { id: 'spacer', name: 'Spacer', icon: '📏' }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    icon: Type,
    blocks: [
      { id: 'heading', name: 'Heading', icon: '📝' },
      { id: 'text', name: 'Text', icon: '📄' },
      { id: 'button', name: 'Button', icon: '🔘' },
      { id: 'image', name: 'Image', icon: '🖼️' }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: Zap,
    blocks: [
      { id: 'form', name: 'Form', icon: '📋' },
      { id: 'gallery', name: 'Gallery', icon: '🖼️' },
      { id: 'video', name: 'Video', icon: '🎥' },
      { id: 'map', name: 'Map', icon: '🗺️' }
    ]
  }
];

export default function BlocksPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('layout');

  const filteredBlocks = blockCategories
    .find(cat => cat.id === activeCategory)
    ?.blocks.filter(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="blocks-panel">
      {/* Search */}
      <div className="search-container">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search blocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="category-tabs">
        {blockCategories.map(category => (
          <button
            key={category.id}
            className={activeCategory === category.id ? 'active' : ''}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon size={16} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Blocks Grid */}
      <div className="blocks-grid">
        {filteredBlocks.map(block => (
          <motion.div
            key={block.id}
            className="block-item"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            draggable
          >
            <div className="block-icon">{block.icon}</div>
            <span className="block-name">{block.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action">
          <Grid size={16} />
          Templates
        </button>
        <button className="quick-action">
          <Image size={16} />
          My Blocks
        </button>
      </div>
    </div>
  );
}
```

### 3. **Advanced Styles Panel**
```tsx
// components/editor/StylesPanel.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Layout, Spacing, Border, Shadow } from 'lucide-react';

export default function StylesPanel() {
  const [activeTab, setActiveTab] = useState('design');
  const [selectedElement, setSelectedElement] = useState('Text Block');

  const styleTabs = [
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'spacing', name: 'Spacing', icon: Spacing },
    { id: 'effects', name: 'Effects', icon: Shadow }
  ];

  return (
    <div className="styles-panel">
      {/* Selected Element */}
      <div className="selected-element">
        <div className="element-info">
          <div className="element-icon">T</div>
          <div>
            <div className="element-name">{selectedElement}</div>
            <div className="element-path">Section > Container > Text</div>
          </div>
        </div>
      </div>

      {/* Style Tabs */}
      <div className="style-tabs">
        {styleTabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Style Controls */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="style-controls"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'design' && <DesignControls />}
          {activeTab === 'layout' && <LayoutControls />}
          {activeTab === 'spacing' && <SpacingControls />}
          {activeTab === 'effects' && <EffectsControls />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DesignControls() {
  return (
    <div className="design-controls">
      {/* Typography */}
      <div className="control-group">
        <h4>Typography</h4>
        <div className="control-row">
          <label>Font Family</label>
          <select>
            <option>Inter</option>
            <option>Roboto</option>
            <option>Open Sans</option>
          </select>
        </div>
        <div className="control-row">
          <label>Font Size</label>
          <div className="input-with-unit">
            <input type="number" defaultValue={16} />
            <select>
              <option>px</option>
              <option>rem</option>
              <option>em</option>
            </select>
          </div>
        </div>
        <div className="control-row">
          <label>Font Weight</label>
          <div className="weight-buttons">
            <button>400</button>
            <button className="active">500</button>
            <button>600</button>
            <button>700</button>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="control-group">
        <h4>Colors</h4>
        <div className="color-controls">
          <div className="color-input">
            <label>Text Color</label>
            <div className="color-picker">
              <div className="color-swatch" style={{ backgroundColor: '#333' }}></div>
              <input type="text" value="#333333" />
            </div>
          </div>
          <div className="color-input">
            <label>Background</label>
            <div className="color-picker">
              <div className="color-swatch" style={{ backgroundColor: 'transparent' }}></div>
              <input type="text" value="transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacingControls() {
  return (
    <div className="spacing-controls">
      <div className="control-group">
        <h4>Padding</h4>
        <div className="spacing-visual">
          <div className="spacing-box">
            <input className="spacing-input top" placeholder="0" />
            <input className="spacing-input right" placeholder="0" />
            <input className="spacing-input bottom" placeholder="0" />
            <input className="spacing-input left" placeholder="0" />
            <div className="spacing-center">Element</div>
          </div>
        </div>
      </div>

      <div className="control-group">
        <h4>Margin</h4>
        <div className="spacing-visual">
          <div className="spacing-box margin">
            <input className="spacing-input top" placeholder="0" />
            <input className="spacing-input right" placeholder="0" />
            <input className="spacing-input bottom" placeholder="0" />
            <input className="spacing-input left" placeholder="0" />
            <div className="spacing-center">Element</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. **Responsive Canvas**
```tsx
// components/editor/ResponsiveCanvas.tsx
'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Maximize } from 'lucide-react';

type Device = 'desktop' | 'tablet' | 'mobile';

const deviceSizes = {
  desktop: { width: '100%', height: '100%', icon: Monitor },
  tablet: { width: 768, height: 1024, icon: Tablet },
  mobile: { width: 375, height: 667, icon: Smartphone }
};

export default function ResponsiveCanvas() {
  const [device, setDevice] = useState<Device>('desktop');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 10 : prev - 10;
      return Math.max(25, Math.min(200, newZoom));
    });
  };

  return (
    <div className="responsive-canvas">
      {/* Canvas Toolbar */}
      <div className="canvas-toolbar">
        <div className="device-controls">
          {Object.entries(deviceSizes).map(([key, config]) => (
            <button
              key={key}
              className={device === key ? 'active' : ''}
              onClick={() => setDevice(key as Device)}
            >
              <config.icon size={16} />
              <span>{key}</span>
            </button>
          ))}
        </div>

        <div className="canvas-controls">
          <div className="zoom-controls">
            <button onClick={() => handleZoom('out')}>-</button>
            <span>{zoom}%</span>
            <button onClick={() => handleZoom('in')}>+</button>
          </div>
          
          <button 
            className="fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="canvas-container" ref={canvasRef}>
        <motion.div
          className="canvas-frame"
          animate={{
            width: device === 'desktop' ? '100%' : deviceSizes[device].width,
            height: device === 'desktop' ? '100%' : deviceSizes[device].height,
            scale: zoom / 100
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="canvas-content">
            {/* GrapesJS Canvas */}
            <div id="gjs-canvas" className="gjs-canvas"></div>
            
            {/* Device Frame (for tablet/mobile) */}
            {device !== 'desktop' && (
              <div className="device-frame">
                <div className="device-screen">
                  <div className="device-content">
                    {/* Canvas content goes here */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Canvas Guidelines */}
        <div className="canvas-guidelines">
          <div className="guideline horizontal"></div>
          <div className="guideline vertical"></div>
        </div>

        {/* Rulers */}
        <div className="rulers">
          <div className="ruler horizontal">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="ruler-mark" style={{ left: `${i * 5}%` }}>
                {i * 50}
              </div>
            ))}
          </div>
          <div className="ruler vertical">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="ruler-mark" style={{ top: `${i * 5}%` }}>
                {i * 50}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5. **Modern CSS Styles**
```css
/* styles/editor.css */
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  height: 60px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-btn {
  font-weight: 700;
  font-size: 18px;
  color: #6366f1;
  background: none;
  border: none;
  cursor: pointer;
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  font-weight: 600;
  font-size: 14px;
}

.save-status {
  font-size: 12px;
  color: #10b981;
}

.device-selector {
  display: flex;
  background: #3a3a3a;
  border-radius: 8px;
  padding: 4px;
}

.device-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  color: #9ca3af;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.device-btn.active {
  background: #6366f1;
  color: white;
}

.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5856eb;
}

.btn-secondary {
  background: #374151;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 12px;
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-panel, .right-panel {
  background: #2a2a2a;
  border-right: 1px solid #3a3a3a;
  display: flex;
  flex-direction: column;
}

.right-panel {
  border-right: none;
  border-left: 1px solid #3a3a3a;
}

.panel-tabs {
  display: flex;
  background: #1f1f1f;
  border-bottom: 1px solid #3a3a3a;
}

.panel-tabs button {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.panel-tabs button.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  padding: 6px 12px;
  border-radius: 6px;
}

.zoom-controls button {
  width: 24px;
  height: 24px;
  border: none;
  background: #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: auto;
}

.canvas-frame {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

/* Blocks Panel */
.blocks-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1f1f1f;
  padding: 10px 12px;
  border-radius: 8px;
}

.search-container input {
  flex: 1;
  background: none;
  border: none;
  color: white;
  outline: none;
}

.category-tabs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-tabs button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: none;
  background: none;
  color: #9ca3af;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tabs button.active {
  background: #374151;
  color: white;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.block-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  background: #374151;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
}

.block-item:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.block-item:active {
  cursor: grabbing;
}

.block-icon {
  font-size: 24px;
}

.block-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

/* Styles Panel */
.selected-element {
  background: #1f1f1f;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.element-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.element-icon {
  width: 32px;
  height: 32px;
  background: #6366f1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.element-name {
  font-weight: 600;
  font-size: 14px;
}

.element-path {
  font-size: 12px;
  color: #9ca3af;
}

.style-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}

.style-tabs button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: none;
  background: #374151;
  color: #9ca3af;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.style-tabs button.active {
  background: #6366f1;
  color: white;
}

.control-group {
  margin-bottom: 24px;
}

.control-group h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.control-row label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.control-row input,
.control-row select {
  background: #1f1f1f;
  border: 1px solid #374151;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  outline: none;
}

.input-with-unit {
  display: flex;
  gap: 4px;
}

.input-with-unit input {
  flex: 1;
}

.input-with-unit select {
  width: 60px;
}

.weight-buttons {
  display: flex;
  gap: 4px;
}

.weight-buttons button {
  flex: 1;
  padding: 8px;
  border: 1px solid #374151;
  background: #1f1f1f;
  color: #9ca3af;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.weight-buttons button.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid #374151;
  cursor: pointer;
}

.spacing-visual {
  background: #1f1f1f;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}

.spacing-box {
  position: relative;
  background: #374151;
  border: 2px dashed #6b7280;
  border-radius: 8px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spacing-input {
  position: absolute;
  width: 40px;
  height: 24px;
  background: #1f1f1f;
  border: 1px solid #6366f1;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-size: 12px;
}

.spacing-input.top { top: -12px; left: 50%; transform: translateX(-50%); }
.spacing-input.right { right: -20px; top: 50%; transform: translateY(-50%); }
.spacing-input.bottom { bottom: -12px; left: 50%; transform: translateX(-50%); }
.spacing-input.left { left: -20px; top: 50%; transform: translateY(-50%); }

.spacing-center {
  background: #6366f1;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .left-panel, .right-panel {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .editor-toolbar {
    padding: 8px 12px;
  }
  
  .toolbar-center {
    display: none;
  }
  
  .left-panel, .right-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 280px;
  }
}
```

This UI/UX design creates a **modern, professional page builder interface** similar to Webflow, Figma, and other premium design tools with:

- **Clean, dark theme** with proper contrast
- **Responsive layout** that works on all devices  
- **Smooth animations** and micro-interactions
- **Intuitive navigation** with clear visual hierarchy
- **Professional styling** with consistent spacing and typography
- **Advanced controls** for precise design work