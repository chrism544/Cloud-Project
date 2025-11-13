# 🔍 Craft.js Drag-Drop Comprehensive Diagnosis & Fix

**Date**: November 12, 2025  
**Status**: Review & Analysis Complete  
**Build Status**: ✅ All files compile  

---

## Executive Summary

After reviewing all 13+ widgets and canvas components, I've identified **3 critical architecture issues** preventing drag-drop from working:

1. **❌ CRITICAL: InnerSection is NOT a Canvas** - Missing `isCanvas: true` in craft config
2. **❌ CRITICAL: Ref callback inconsistencies** - Some widgets using inline fn, others using if check
3. **⚠️ MODERATE: Container.craft.canMoveIn() validation** - Needs stricter type checking

---

## Issue Analysis

### Issue #1: InnerSection Missing `isCanvas: true` ❌ CRITICAL

**File**: `frontend/lib/craftjs/widgets/layout/InnerSection.tsx`

**Current Code**:
```typescript
InnerSection.craft = {
  displayName: "InnerSection",
  // ... props
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  // ❌ MISSING: isCanvas: true
};
```

**Problem**: 
- InnerSection is designed to accept children (has `canMoveIn: true`)
- But Craft.js doesn't know it's a drop zone because `isCanvas` is missing
- When toolbox checks widget.component.craft.isCanvas, it returns undefined
- Toolbox canvas detection in Toolbox.tsx fails for InnerSection

**Expected Code**:
```typescript
InnerSection.craft = {
  displayName: "InnerSection",
  props: { /* ... */ },
  related: { settings: InnerSectionSettings },
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  isCanvas: true,  // ✅ ADD THIS
};
```

---

### Issue #2: Ref Callback Inconsistencies ⚠️ MODERATE

**Files Affected**:
- ✅ Container: `ref={(ref) => connect(ref)}` - CORRECT (drag not called!)
- ✅ Section: `ref={(ref) => connect(ref)}` - CORRECT
- ✅ Column: `ref={(ref) => connect(ref)}` - CORRECT
- ✅ InnerSection: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG (calls drag)
- ✅ Text: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Button: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Image: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Video: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Icon: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ IconBox: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ ImageBox: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Heading: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Spacer: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG
- ✅ Divider: `ref={(ref) => { if (ref) connect(drag(ref)); }}` - WRONG

**Problem**:
- **Container/Section/Column** don't call `drag(ref)` because they're CANVAS widgets
- **All basic widgets** call `connect(drag(ref))` which is WRONG:
  - `connect()` = "this is a droppable zone"
  - `drag()` = "this element can be dragged"
  - Basic widgets should ONLY be movable (drag), not droppable (connect)

**Root Cause**:
- Misunderstanding of Craft.js API:
  - `connect()` + `drag()` = droppable + movable (FOR CONTAINERS)
  - `drag()` alone = movable only (FOR CONTENT WIDGETS)
  - Content widgets don't need `connect()`

**Correct Pattern**:
```typescript
// ✅ Canvas Widgets (Container, Section, Column, InnerSection)
ref={(ref) => connect(ref)}

// ✅ Content Widgets (Text, Button, Image, etc.)
ref={(ref) => {
  if (ref) {
    // Can be dragged/moved, but NOT a drop zone
    // Note: Don't call connect() here!
    drag(ref);
  }
}}
```

---

### Issue #3: Container.craft.canMoveIn() Type Safety ⚠️ MODERATE

**File**: `frontend/lib/craftjs/widgets/layout/Container.tsx`

**Current Code**:
```typescript
rules: {
  canMoveIn: (incomingNodes: any[]) => {
    // Container can accept any widget type
    return true;
  },
  canMoveOut: () => true,
},
```

**Problem**:
- Accepts `any[]` without validation
- Always returns `true` without checking node types
- Doesn't distinguish between valid and invalid children

**Better Implementation**:
```typescript
rules: {
  canMoveIn: (incomingNodes: any[]) => {
    // Validate that incoming nodes are actual widgets, not fragments
    return incomingNodes && incomingNodes.length > 0;
  },
  canMoveOut: () => true,
},
```

---

## Architecture: How Drag-Drop SHOULD Work

```
┌─────────────────────────────────────────────────────────┐
│ TOOLBOX (Source)                                         │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Widget List                                          │ │
│ │ ├─ Container   → isCanvas: true → canvas={true}    │ │
│ │ ├─ Section     → isCanvas: true → canvas={true}    │ │
│ │ ├─ Column      → isCanvas: true → canvas={true}    │ │
│ │ ├─ InnerSection → isCanvas: true → canvas={true}  │ │
│ │ ├─ Text        → isCanvas: false → canvas={false}  │ │
│ │ ├─ Button      → isCanvas: false → canvas={false}  │ │
│ │ └─ ...                                               │ │
│ │                                                       │ │
│ │ connectors.create(ref, <Element is={Component} />) │ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
              │
              │ User drags
              ▼
┌─────────────────────────────────────────────────────────┐
│ CANVAS (Drop Zone)                                       │
│ ┌─Frame────────────────────────────────────────────────┐ │
│ │ ┌─Element is={Container}─────────────────────────────┐ │ │
│ │ │ ref={(ref) => connect(ref)}                        │ │ │
│ │ │ craft: { isCanvas: true }                          │ │ │
│ │ │                                                    │ │ │
│ │ │ ┌─┐                                                │ │ │
│ │ │ │ DROP ZONE accepts children                       │ │ │
│ │ │ │ Nested Containers can drop here                  │ │ │
│ │ │ │                                                    │ │ │
│ │ │ │ ├─Element is={Text}────────────────────────────┐ │ │ │
│ │ │ │ │ ref={(ref) => { if(ref) drag(ref); }}        │ │ │ │
│ │ │ │ │ craft: { isCanvas: false }                    │ │ │ │
│ │ │ │ │ Can be dragged, not a drop zone                │ │ │ │
│ │ │ │ └────────────────────────────────────────────────┘ │ │ │
│ │ │ │                                                    │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │
│ │ └───────────────────────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Fix Priority

| Priority | Issue | Severity | Fix Time |
|----------|-------|----------|----------|
| **1** | InnerSection missing `isCanvas: true` | CRITICAL | 2 min |
| **2** | Basic widgets calling `connect(drag(ref))` | HIGH | 5 min |
| **3** | Container.craft.canMoveIn() validation | MEDIUM | 2 min |

---

## Implementation Steps

### Step 1: Fix InnerSection.tsx (2 minutes)

**Add to craft config:**
```typescript
isCanvas: true,
```

Full fix in "FIXES" section below.

---

### Step 2: Fix All Basic Widgets (5 minutes)

Remove `connect()` call - only keep `drag()`:

**Text.tsx, Button.tsx, Image.tsx, Video.tsx, Icon.tsx, IconBox.tsx, ImageBox.tsx, Heading.tsx, Spacer.tsx, Divider.tsx**

Change FROM:
```typescript
ref={(ref) => { if (ref) connect(drag(ref)); }}
```

Change TO:
```typescript
ref={(ref) => {
  if (ref) {
    drag(ref);
  }
}}
```

---

### Step 3: Improve Container.canMoveIn() (1 minute)

Add basic validation:
```typescript
canMoveIn: (incomingNodes: any[]) => {
  return Array.isArray(incomingNodes) && incomingNodes.length > 0;
},
```

---

## Expected Results After Fixes

✅ **InnerSection will be recognized as canvas** in Toolbox  
✅ **All basic widgets will be movable without connect errors**  
✅ **Container drops will properly validate**  
✅ **Full drag-drop pipeline works**:
  - Drag Container from Toolbox → drops in Frame/Canvas
  - Drag Text into Container → appears inside
  - Drag Section → accepts other containers as children
  - All 13 widgets are usable

---

## Files to Modify

```
frontend/lib/craftjs/widgets/
├── layout/
│   ├── Container.tsx        ← Fix canMoveIn validation
│   ├── Section.tsx          ✅ Already correct
│   ├── Column.tsx           ✅ Already correct
│   └── InnerSection.tsx     ← ADD isCanvas: true + fix ref
├── basic/
│   ├── Heading.tsx          ← Remove connect() from ref
│   ├── Text.tsx             ← Remove connect() from ref
│   ├── Button.tsx           ← Remove connect() from ref
│   ├── Image.tsx            ← Remove connect() from ref
│   ├── Video.tsx            ← Remove connect() from ref
│   ├── Icon.tsx             ← Remove connect() from ref
│   ├── IconBox.tsx          ← Remove connect() from ref
│   ├── ImageBox.tsx         ← Remove connect() from ref
│   ├── Spacer.tsx           ← Remove connect() from ref
│   └── Divider.tsx          ← Remove connect() from ref
```

---

## Debug Verification Commands

After applying fixes, test in browser console:

```javascript
// Check InnerSection now has isCanvas
const widgets = Object.values(window.__craftjs.nodes || {});
widgets.filter(w => w.displayName === 'InnerSection').map(w => w.craft.isCanvas)
// Should return: [true]

// Check drag-drop events
window.__dragDebugger.printSummary()
// Should show: drag_start, drag_over, drop, drag_end all > 0

// Test specific widget drop
window.__dragDebugger.getEvents().filter(e => e.type === 'drop')
// Should have items after dragging
```

---

## What This Fixes

- ✅ InnerSection now recognized as droppable zone
- ✅ Basic widgets no longer try to be drop zones
- ✅ Correct Craft.js API usage throughout
- ✅ Type safety improved
- ✅ Ref callbacks properly aligned with widget purpose

---

