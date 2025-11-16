# Elementor vs Craft.js: Deep Technical Comparison

## Overview

This document compares Elementor's internal layout system with Craft.js implementation and provides solutions to achieve Elementor-like behavior.

---

# 🎯 1. Widget Placement Detection

## Elementor's Approach

### ✅ DOM-Based Drop Zones (Placeholder Detection)
```html
<!-- Elementor injects temporary markers during drag -->
<div class="elementor-placeholder"></div>
```

**How it works:**
1. Each droppable area (Section/Column/Container) registers as droppable
2. During drag, Elementor:
   - Attaches drag-helper overlay
   - Listens for pointer movement
   - Injects visual placeholder at valid drop points
   - Shows blue/grey highlight
3. Placeholder destroyed on:
   - Pointer leaves region
   - Widget dropped
   - Drag cancelled

### ✅ Hitbox Calculation
```js
// Continuous bounding box collision checks
this.$el.offset()
this.$el.outerHeight()
this.$el.outerWidth()
```

**Priority rules when zones overlap:**
1. Closest to pointer
2. Highest in DOM hierarchy
3. Container > Column > Section

---

## Craft.js Current Implementation

### ✅ Drop Indicator System
**File:** `frontend/lib/craftjs/styles/editor.css` (lines 35-93)

```css
.craft-drop-indicator {
  position: absolute;
  background: #10B981;  /* Emerald green */
  height: 4px;
  width: 100%;
  pointer-events: none;
  z-index: 999;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.8), 0 0 16px rgba(16, 185, 129, 0.4);
  animation: pulse-drop 1.5s ease-in-out infinite;
}
```

**What Craft.js provides:**
- ✅ Visual drop indicator (emerald green pulsing line)
- ✅ Hitbox detection via `@craftjs/core` connectors
- ✅ Canvas nodes with `canvas` prop
- ✅ Drop validation via `canMoveIn` rules

**What's different from Elementor:**
- ❌ No explicit placeholder DIV injection (uses indicator line instead)
- ❌ Less visual feedback for empty drop zones
- ❌ Drop indicator may not show on EMPTY containers

---

# 🧱 2. Layout System Architecture

## Elementor: Two Systems Side-by-Side

### A) Legacy: Section → Column → Widget

**Internal Model:**
```json
{
  "id": "section123",
  "elType": "section",
  "settings": { "stretch_section": "yes" },
  "elements": [
    {
      "id": "column456",
      "elType": "column",
      "settings": { "column_width": 33 },
      "elements": [
        {
          "id": "widget789",
          "elType": "heading",
          "settings": { "title": "Hello" }
        }
      ]
    }
  ]
}
```

**Rules:**
- Section ONLY contains Columns
- Columns ONLY contain Widgets or Inner Sections
- Column widths sum to 100%
- Auto-insert Section+Column when needed

### B) Modern: Container → Children

**Internal Model:**
```json
{
  "id": "container123",
  "elType": "container",
  "settings": {
    "flex_direction": "row",
    "justify_content": "start",
    "gap": "20"
  },
  "elements": [
    { "elType": "container", /* nested */ },
    { "elType": "widget", "widgetType": "heading" }
  ]
}
```

**Rules:**
- Container can contain: Containers OR Widgets
- Infinite nesting allowed
- Flexbox-based layout
- No fixed hierarchy

---

## Craft.js Current Implementation

### Current Structure (Hybrid System)

**File:** `frontend/lib/craftjs/widgets/layout/Section.tsx`
```typescript
Section.craft = {
  displayName: "Section",
  rules: {
    canMoveIn: (incomingNodes: any[]) => {
      // Elementor-style: Only Columns can go inside Sections
      return incomingNodes.every((node) =>
        node.data.name === "Column" || node.data.name === "InnerSection"
      );
    },
  },
  isCanvas: true,
};
```

**File:** `frontend/lib/craftjs/widgets/layout/Container.tsx`
```typescript
Container.craft = {
  displayName: "Container",
  rules: {
    canMoveIn: (incomingNodes: any[]) => {
      // Container can accept any widget type
      return Array.isArray(incomingNodes) && incomingNodes.length > 0;
    },
  },
  isCanvas: true,
};
```

### ✅ What Works Like Elementor

1. **Section → Column → Widget** hierarchy enforced
2. **Container** accepts anything (modern flexbox approach)
3. **isCanvas: true** enables drop zones
4. **canMoveIn** validates allowed children

### ❌ What's Different / Missing

1. **No auto-insert behavior**
   - Elementor: Auto-creates Section+Column when dragging widget to empty space
   - Craft.js: Requires manual structure creation

2. **Empty container visibility**
   - Elementor: Shows prominent "Drop widgets here" placeholder
   - Craft.js: Shows placeholder but may be hard to see

3. **Drop indicator on empty containers**
   - Elementor: Always shows drop zone on empty containers
   - Craft.js: May not show indicator if container has no children

---

# 🧠 3. Parent-Child Validation

## Elementor's Schema System

```js
elementor.elements.registerElementType({
  type: 'container',
  isContainer: true,
  getChildTypes() {
    return ['container', 'widget'];
  },
});

// Validation during drag:
if (target.getChildTypes().includes(dragged.type)) {
    allowDrop = true;
}
```

## Craft.js Equivalent

```typescript
// Section widget
Section.craft = {
  rules: {
    canMoveIn: (incomingNodes: any[]) => {
      return incomingNodes.every((node) =>
        node.data.name === "Column" || node.data.name === "InnerSection"
      );
    },
  },
};

// Container widget
Container.craft = {
  rules: {
    canMoveIn: (incomingNodes: any[]) => {
      return Array.isArray(incomingNodes) && incomingNodes.length > 0;
    },
  },
};

// Regular widget (no children)
Heading.craft = {
  rules: {
    canMoveIn: () => false,  // Cannot accept children
  },
};
```

### Key Differences

| Feature | Elementor | Craft.js Current |
|---------|-----------|------------------|
| Validation method | `getChildTypes()` | `canMoveIn(nodes)` |
| Return type | Array of allowed types | Boolean |
| Granularity | Type-based | Node-based (can inspect full node data) |
| Auto-creation | Yes (Section+Column) | No |

---

# 🎨 4. Visual Feedback Comparison

## Elementor Drop Zones

```html
<!-- Active drop zone -->
<div class="elementor-section">
  <div class="elementor-drop-placeholder">
    <!-- Blue highlight area -->
  </div>
  <div class="elementor-column">
    <!-- Existing content -->
  </div>
</div>
```

**Visual characteristics:**
- Blue/grey rectangular placeholder
- Expands to show drop region
- Text: "Drop widget here" (on empty)
- Smooth animations

## Craft.js Drop Zones

```css
/* Current implementation */
.craft-drop-indicator {
  background: #10B981;  /* Emerald green */
  height: 4px;
  animation: pulse-drop 1.5s ease-in-out infinite;
}
```

**Visual characteristics:**
- ✅ Emerald green line with glow
- ✅ Pulsing animation
- ✅ Glowing dots on both ends
- ❌ No rectangular placeholder area
- ❌ Less prominent on empty containers

### Empty Container Placeholder

**File:** `frontend/lib/craftjs/widgets/layout/Container.tsx` (lines 218-234)

```typescript
{!children || (Array.isArray(children) && children.length === 0) ? (
  <div
    style={{
      color: "#9ca3af",
      fontSize: "14px",
      textAlign: "center",
      width: "100%",
      padding: "40px",
      border: "2px dashed #e5e7eb",
      borderRadius: "8px",
    }}
  >
    Drop widgets here
  </div>
) : (
  children
)}
```

**This DOES exist** but might not be prominent enough!

---

# 🔧 5. Key Issues in Current Implementation

## Issue 1: Empty Container Not Visible Enough

**Problem:** User can't see where to drop widgets in empty containers.

**Elementor Solution:** Large blue placeholder with "Drop widgets here" text.

**Current Craft.js:** Has placeholder but may be visually weak.

**Fix:** Enhance empty container styling (see solutions below).

---

## Issue 2: Section Requires Column First

**Problem:** User tries to drag Text/Image directly into Section, fails.

**Elementor Solution:** Auto-creates Column when needed.

**Current Craft.js:** Strict validation, no auto-creation.

**Fix:** Either:
1. Relax Section rules (allow any widget)
2. Add auto-Column creation logic
3. Improve user guidance (show error message)

---

## Issue 3: No Visual Feedback on Invalid Drop

**Problem:** User drags widget over invalid target, no feedback.

**Elementor Solution:** Cursor changes to "not-allowed", no placeholder shown.

**Current Craft.js:** Silent failure, no visual rejection.

**Fix:** Add invalid drop indicator (red outline or crossed circle cursor).

---

# 💡 Solutions to Achieve Elementor Behavior

## Solution 1: Enhance Empty Container Visibility

**Goal:** Make empty containers MUCH more obvious as drop targets.

### Current (Weak):
```typescript
border: "2px dashed #e5e7eb"  // Light grey, barely visible
```

### Improved (Strong):
```typescript
border: "3px dashed #6366f1"  // Indigo, more prominent
backgroundColor: "#f9fafb"     // Subtle background
minHeight: "120px"             // Larger drop area
```

---

## Solution 2: Relax Section Validation (Allow Direct Widget Drop)

**Goal:** Let users drop widgets directly into Section (auto-wrap in Column).

### Current:
```typescript
canMoveIn: (incomingNodes: any[]) => {
  return incomingNodes.every((node) =>
    node.data.name === "Column" || node.data.name === "InnerSection"
  );
},
```

### Improved (Option A - Allow All):
```typescript
canMoveIn: (incomingNodes: any[]) => {
  // Accept any widget - will auto-wrap in Column if needed
  return true;
},
```

### Improved (Option B - Auto-Create Column):
This requires custom logic in the Section component to wrap non-Column children.

---

## Solution 3: Add Invalid Drop Visual Feedback

**Goal:** Show red outline or "not-allowed" cursor on invalid drop targets.

### CSS Addition:
```css
.craft-invalid-drop-target {
  outline: 2px solid #ef4444 !important;  /* Red */
  outline-offset: 2px;
  cursor: not-allowed !important;
}
```

### JavaScript Hook:
Need to detect when dragging over invalid target and apply this class.

---

## Solution 4: Improve Drop Indicator for Empty Containers

**Goal:** Show drop indicator even when container is empty.

### Current Issue:
Drop indicator may only show BETWEEN existing children, not in empty container.

### Fix:
Ensure Craft.js recognizes empty containers as valid drop zones and shows indicator.

---

# 📊 Comparison Table: Elementor vs Craft.js

| Feature | Elementor | Craft.js (Current) | Status |
|---------|-----------|-------------------|--------|
| Visual drop placeholders | Blue rectangular areas | Emerald green line + dots | ✅ Different style |
| Empty container indication | Large "Drop widgets here" | Smaller dashed border | ⚠️ Needs enhancement |
| Section → Column enforcement | Strict | Strict | ✅ Same |
| Auto-create structure | Yes (Section+Column) | No | ❌ Missing |
| Invalid drop feedback | Cursor + no placeholder | Silent | ❌ Missing |
| Container flexbox support | Yes (modern system) | Yes | ✅ Same |
| Infinite nesting | Yes | Yes | ✅ Same |
| Hitbox detection | Custom jQuery | Craft.js built-in | ✅ Different tech |
| Parent-child rules | `getChildTypes()` | `canMoveIn()` | ✅ Different API |

---

# 🚀 Recommended Improvements

## Priority 1: Fix Empty Container Visibility (HIGH)

**Impact:** Users can immediately see where to drop widgets.

**Effort:** Low (CSS changes only)

**Files to modify:**
- `frontend/lib/craftjs/widgets/layout/Container.tsx` (lines 218-234)
- `frontend/lib/craftjs/widgets/layout/Section.tsx` (similar pattern)

---

## Priority 2: Relax Section Validation (MEDIUM)

**Impact:** Users can drop widgets directly into Section (more intuitive).

**Effort:** Low (change validation rule)

**Files to modify:**
- `frontend/lib/craftjs/widgets/layout/Section.tsx` (line 95-99)

---

## Priority 3: Add Invalid Drop Feedback (MEDIUM)

**Impact:** Users understand why drop failed.

**Effort:** Medium (requires CSS + JS hook)

**Files to modify:**
- `frontend/lib/craftjs/styles/editor.css`
- `frontend/lib/craftjs/components/RenderNode.tsx` (add invalid state detection)

---

## Priority 4: Auto-Create Column in Section (LOW PRIORITY)

**Impact:** Matches Elementor behavior exactly.

**Effort:** High (requires custom Section logic)

**Note:** May not be needed if Priority 2 is implemented.

---

# 🎯 Answering Your Original Question

## "Why can I have only one column?"

You have a **single Column widget** selected. To create multiple columns:

### Elementor Approach:
1. Section automatically creates Columns
2. You drag widgets into Columns
3. Columns appear side-by-side

### Craft.js Approach (Current):
1. **Option A - Section + Columns:**
   - Drag Section widget
   - Drag 2-3 Column widgets into Section
   - Drag content widgets into each Column

2. **Option B - Container + Flexbox:**
   - Use root Container
   - Drag 2-3 widgets into Container
   - Change Container direction to `row`
   - Widgets appear side-by-side (no explicit Column wrapper needed)

**Recommendation:** Use Container approach (Option B) - it's more flexible and has 50+ properties.

---

## "If I drag Section/Container to blank space, it doesn't work"

### Why it doesn't work:
1. **No visible drop indicator** on empty root container
2. **Section requires Column children** (can't accept widgets directly)
3. **May need hard refresh** if drag-drop broken

### How to fix:
1. **Look for the emerald green pulsing line** - that's where widget will drop
2. **For Section:** Drag Column widgets first, then content widgets into Columns
3. **For Container:** Drag any widget directly (no Column needed)
4. **Try hard refresh:** Ctrl+Shift+R

---

# 📋 Next Steps

I can implement any of these improvements:

1. ✅ **Enhance empty container visibility** (CSS changes)
2. ✅ **Relax Section validation** (allow direct widget drops)
3. ✅ **Add invalid drop feedback** (red outline on invalid targets)
4. ✅ **Create detailed visual diagram** showing drop zone architecture
5. ✅ **Build auto-Column creation** for Section widget

**Which improvement would you like me to implement first?**

Or I can create:
- 📊 Visual diagram comparing Elementor vs Craft.js drop zones
- 🎨 Enhanced CSS for better drop zone visibility
- 🧪 Step-by-step test guide for each layout system
