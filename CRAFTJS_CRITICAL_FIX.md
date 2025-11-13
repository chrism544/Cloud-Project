# Craft.js Critical Fix - Drag Events Issue

## Problem Identified

**Issue**: Added `onDragStart` handlers to widgets, but Craft.js uses a **custom drag system**, not HTML5 native drag events.

**Result**: The handlers never fire because Craft.js intercepts mouse events and manages drag-and-drop internally.

## Solution

Removed all `onDragStart` handlers from widgets. Craft.js handles drag operations through:
- `connectors.create()` in Toolbox (makes items draggable)
- `connect(drag(ref))` in widgets (makes them movable/droppable)

## Files Fixed

### Removed onDragStart from:
1. Text.tsx
2. Heading.tsx  
3. Button.tsx
4. Image.tsx
5. Video.tsx
6. Icon.tsx
7. IconBox.tsx
8. ImageBox.tsx
9. Spacer.tsx
10. Divider.tsx

### Also Fixed:
- Container.tsx - Improved empty state detection for array children
- Toolbox.tsx - Formatted connectors.create() for clarity

## How Craft.js Drag Works

```
User clicks widget in Toolbox
         ↓
connectors.create() captures mouse events
         ↓
Craft.js internal drag manager takes over
         ↓
Tracks mouse position over canvas
         ↓
Checks if target has connect(drag(ref))
         ↓
Validates canMoveIn() rules
         ↓
Drops widget into canvas
```

**Key Point**: Craft.js never triggers HTML5 `dragstart`, `dragover`, `drop` events.

## Testing

Rebuild and test:
```bash
cd frontend
npm run dev
```

Then:
1. Open page editor
2. Drag widget from Toolbox
3. Drop into canvas
4. Widget should appear

## Debug

If still not working, check:
```javascript
// In browser console
window.__craftjs // Should exist
```

The drag system is internal to Craft.js - we can't easily log it without modifying Craft.js source.
