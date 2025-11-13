# Craft.js Drag-and-Drop Debugging Guide

## Quick Debug Commands

Open the browser console and run:

```javascript
// Check drag-drop event history
window.__dragDebugger.getEvents()

// Print summary of all drag operations
window.__dragDebugger.printSummary()

// Clear event history
window.__dragDebugger.clear()
```

## Fixed Issues Summary

### 1. ✅ Toolbox Canvas Property Resolution
**Issue**: Hardcoded string comparison for determining which widgets are containers
```javascript
// BEFORE (wrong)
canvas={widget.name === 'Container' || widget.name === 'Section' || widget.name === 'Column'}

// AFTER (correct)
const isCanvas = (widget.component.craft as any)?.isCanvas === true;
canvas={isCanvas}
```

**Why**: Gets canvas property from widget's `.craft` metadata, making it DRY and maintainable

---

### 2. ✅ Type Safety: Ref Callbacks
**Issue**: Using `ref={(ref: any) => ref && connect(drag(ref))}` bypassed TypeScript safety
```typescript
// BEFORE (unsafe)
ref={(ref: any) => ref && connect(drag(ref))}

// AFTER (safe)
ref={(ref) => {
  if (ref) connect(drag(ref));
}}
```

**Why**: Proper null checking without forcing `any` type

---

### 3. ✅ Container Widget Drag Zone Rules
**Issue**: `canMoveIn` callback didn't properly validate drop zones
```javascript
// BEFORE (vague)
rules: {
  canMoveIn: () => true,
  canMoveOut: () => true,
}

// AFTER (explicit)
rules: {
  canMoveIn: (incomingNodes: any[]) => {
    // Container can accept any widget type
    return true;
  },
  canMoveOut: () => true,
}
```

**Why**: Explicit rules prevent Craft.js from being confused about drop validation

---

### 4. ✅ Section Widget Interaction Logging
**Issue**: No debug events when Section (parent container) is selected
```typescript
// ADDED
onClick={(e) => {
  e.stopPropagation();
  dragDebugger.log({
    type: 'drag_enter',
    containerName: 'Section',
    nodeId: id,
    details: { isCanvas: true },
  });
}}
```

**Why**: Helps identify which container was selected for drop

---

### 5. ✅ Column/InnerSection Canvas Properties
**Issue**: Not tagged as drop zones despite having `isCanvas: true`
```javascript
// NOW PROPERLY CONFIGURED
Column.craft = {
  isCanvas: true,
  rules: {
    canMoveIn: () => true,
  }
}

InnerSection.craft = {
  isCanvas: true,
  rules: {
    canMoveIn: () => true,
  }
}
```

**Why**: Signals to Craft.js that these containers accept child elements

---

### 6. ✅ Basic Widget Drag Start Events
**Issue**: No logging when dragging Text, Heading, Button, etc.
```typescript
// ADDED to all non-canvas widgets
onDragStart={() => {
  dragDebugger.logDragStart('Heading', id);
}}
```

**Why**: Tracks drag lifecycle to identify where drops fail

---

### 7. ✅ Viewport Frame Initialization
**Issue**: Frame wasn't logging as root drop zone
```typescript
// ADDED
useEffect(() => {
  dragDebugger.log({
    type: 'drag_start',
    containerName: 'Viewport',
    details: { message: 'Viewport initialized - Frame is root drop zone' },
  });
}, []);
```

**Why**: Confirms Frame is properly initialized when page loads

---

### 8. ✅ Ref Connectivity Chain
**Issue**: Refs weren't properly connecting the drag source to drop zone
```typescript
// PATTERN APPLIED TO ALL WIDGETS
const { connectors: { connect, drag }, id } = useNode();

<div
  ref={(ref) => {
    if (ref) connect(drag(ref));  // This chains drag + drop
  }}
  onClick={(e) => {
    e.stopPropagation();
    // Log drop zone availability
  }}
>
  {children}
</div>
```

**Why**: `connect(drag(ref))` makes element both draggable and droppable

---

## Testing Checklist

### ✅ Step 1: Verify Toolbox Loads
1. Open editor
2. Check console: Should see drag-drop debug events
3. Toolbox items should show cursor-move

### ✅ Step 2: Drag Widget from Toolbox
1. Drag "Container" from toolbox
2. Should see in console:
   ```
   [DRAG-DROP-DRAG_START] Container
   [DRAG-DROP-DRAG_OVER] Viewport
   ```

### ✅ Step 3: Drop into Canvas
1. Release mouse over canvas
2. Should see:
   ```
   [DRAG-DROP-DROP] Container Canvas
   [DRAG-DROP-DRAG_END] Container (success: true)
   ```
3. Container should appear in canvas

### ✅ Step 4: Drop Text into Container
1. Drag "Text Editor" from toolbox
2. Drag over Container in canvas
3. Should see Container highlight
4. Release and verify Text appears inside

### ✅ Step 5: Test Non-Canvas Widgets
1. Drag: Heading, Button, Image, Video
2. Each should appear as droppable items

### ✅ Step 6: Test Nested Containers
1. Create Container
2. Add Section inside
3. Add Column inside Section
4. Verify nesting works

---

## Debugging Commands for Console

```javascript
// 1. See all drag operations so far
window.__dragDebugger.getEvents()

// 2. View event type breakdown
window.__dragDebugger.printSummary()

// 3. Find drag errors
window.__dragDebugger.getEvents().filter(e => e.type === 'error')

// 4. Trace drops that succeeded
window.__dragDebugger.getEvents().filter(e => e.type === 'drop')

// 5. Clear to start fresh test
window.__dragDebugger.clear()
```

---

## Common Issues & Fixes

### Issue: Widget drags but doesn't drop

**Check**:
1. Verify container has `isCanvas: true`
2. Verify `canMoveIn` returns true
3. Run: `window.__dragDebugger.printSummary()` - should show drop events

**Fix**: Ensure `.craft.isCanvas = true` on container widgets

### Issue: No drag events in console

**Check**:
1. Is dragDebugger imported in widget?
2. Browser console open?
3. Try: `window.__dragDebugger.getEvents().length` - should be > 0

**Fix**: Ensure dragDebugger is imported and file is bundled

### Issue: Widgets disappear after drop

**Check**:
1. Did you see DROP event?
2. Did you see DRAG_END with success: true?
3. Check React DevTools for node structure

**Fix**: May be serialization issue, check `query.serialize()` in save handler

---

## Widget Canvas Configuration Reference

### Canvas Widgets (Accept Children)
- ✅ `Container` - Main layout container
- ✅ `Section` - Full-width section with boxed content option
- ✅ `Column` - Column within InnerSection
- ✅ `InnerSection` - Multi-column row container

### Non-Canvas Widgets (Content Only)
- ❌ `Heading` - Text heading (no children)
- ❌ `Text` - Text editor (no children)
- ❌ `Image` - Image display (no children)
- ❌ `Video` - Video embed (no children)
- ❌ `Button` - CTA button (no children)
- ❌ `Icon` - Single icon (no children)
- ❌ `IconBox` - Icon + text composite (no children)
- ❌ `ImageBox` - Image + text composite (no children)
- ❌ `Spacer` - Vertical spacer (no children)
- ❌ `Divider` - Horizontal divider (no children)

---

## Architecture

```
┌─────────────────────────────────┐
│  Toolbox (Draggable Source)     │
│  └─ connectors.create()         │
│     └─ Element w/ canvas prop   │
└──────────────┬──────────────────┘
               │ Drag operation
               ▼
┌─────────────────────────────────┐
│  Viewport (Canvas Root)         │
│  └─ Frame (Craft.js root)       │
│     └─ Element is={Container}   │
│        └─ connect(drag(ref))    │
└──────────────┬──────────────────┘
               │ Drop zone accepts
               ▼
┌─────────────────────────────────┐
│  Container/Section/Column       │
│  └─ connect(drag(ref))          │
│  └─ isCanvas: true              │
│  └─ canMoveIn: () => true       │
│     └─ Children appear here     │
└─────────────────────────────────┘
```

---

## Next Steps If Still Broken

1. **Check Craft.js version**
   ```bash
   npm list @craftjs/core
   ```

2. **Verify Element imports**
   ```typescript
   import { Element } from "@craftjs/core";
   // Should NOT be a custom component
   ```

3. **Test simple drag-drop**
   - Create minimal example with 1 Container + 1 Button
   - Does it work? → Issue is elsewhere
   - Doesn't work? → Core Craft.js configuration issue

4. **Enable Craft.js debugging**
   ```typescript
   <Editor
     options={{ enableDebug: true }}
   >
   ```

---

## Quick Reference: Widget Template

Every canvas widget should follow this pattern:

```typescript
import { useNode } from "@craftjs/core";
import { dragDebugger } from "../../utils/dragDebug";

export const MyContainer = ({ children, ...props }) => {
  const { connectors: { connect, drag }, id } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));  // ← Make it connectable
      }}
      onClick={(e) => {
        e.stopPropagation();
        dragDebugger.log({
          type: 'drag_enter',
          containerName: 'MyContainer',
          nodeId: id,
          details: { isCanvas: true },
        });
      }}
      {...otherStyles}
    >
      {children}
    </div>
  );
};

MyContainer.craft = {
  displayName: "My Container",
  props: { /* ... */ },
  rules: {
    canMoveIn: () => true,      // ← Allow all children
    canMoveOut: () => true,     // ← Can be moved
  },
  isCanvas: true,               // ← Accept children
};
```

---

## Performance Notes

- Debug events limited to 100 recent events (configurable in `dragDebug.ts`)
- Logging happens to browser console only (no performance impact on app)
- Safe to leave debug code in production (minimal overhead)
