# Craft.js Drag-Drop Quick Troubleshooting

## If Widgets Don't Drop

### 1️⃣ Check Debug Events
```javascript
// In browser console:
window.__dragDebugger.printSummary()
```

**Expected output**:
```
drag_start: 1+
drag_over: 1+  
drop: 1+
drag_end: 1+
```

**If drop count is 0**: Container isn't recognizing drops

---

### 2️⃣ Verify Container Configuration
```javascript
// In browser console (after selecting Container):
// Check if Container has isCanvas = true
// Should see when you click on a container:
window.__dragDebugger.getEvents().find(e => e.containerName === 'Container')
```

**Should return**: Event with `isCanvas: true`

---

### 3️⃣ Check Connector Chain
```typescript
// In widget file - should look like:
ref={(ref) => {
  if (ref) connect(drag(ref));  // ← This chains everything
}}
```

**If missing or broken**: Widget won't accept drops

---

## Common Error Patterns

### ❌ Pattern 1: No drag_start events
**Problem**: Widget isn't being recognized as draggable

**Check**:
```javascript
window.__dragDebugger.getEvents().filter(e => e.type === 'drag_start')
// Should not be empty
```

**Fix**: Ensure `connectors.create()` was called in Toolbox

---

### ❌ Pattern 2: drag_start but no drag_over
**Problem**: Drag events fire but hover doesn't register

**Check**:
```javascript
window.__dragDebugger.getEvents().filter(e => e.type === 'drag_over')
// Should not be empty
```

**Fix**: Ensure Canvas/Container has `connect(drag(ref))`

---

### ❌ Pattern 3: drag_over but no drop
**Problem**: Hover works but drop fails

**Check**:
```javascript
window.__dragDebugger.getEvents().filter(e => e.type === 'drop')
// Should not be empty
```

**Fix**: Verify container has `canMoveIn: () => true`

---

### ❌ Pattern 4: drag_end with success: false
**Problem**: Drop registered but didn't actually place widget

**Check**:
```javascript
window.__dragDebugger.getEvents()
  .filter(e => e.type === 'drag_end' && !e.details?.success)
```

**Fix**: Check for `canMoveOut` rules or other restrictions

---

## Widget Configuration Template

Every widget must follow this pattern:

### Canvas Widgets (Container, Section, Column, InnerSection)
```typescript
import { dragDebugger } from "../../utils/dragDebug";

export const MyContainer = ({ children }) => {
  const { connectors: { connect, drag }, id } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));  // ← CRITICAL
      }}
      onClick={(e) => {
        e.stopPropagation();
        dragDebugger.log({           // ← Optional but helpful
          type: 'drag_enter',
          containerName: 'MyContainer',
          nodeId: id,
          details: { isCanvas: true },
        });
      }}
    >
      {children}
    </div>
  );
};

MyContainer.craft = {
  displayName: "My Container",
  rules: {
    canMoveIn: () => true,           // ← Allow any child
    canMoveOut: () => true,
  },
  isCanvas: true,                    // ← CRITICAL - accept children
};
```

### Content Widgets (Text, Heading, Button, etc.)
```typescript
export const MyContent = ({ text }) => {
  const { connectors: { connect, drag }, id } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));  // ← CRITICAL
      }}
      onDragStart={() => {
        dragDebugger.logDragStart('MyContent', id); // ← Optional
      }}
    >
      {text}
    </div>
  );
};

MyContent.craft = {
  displayName: "My Content",
  rules: {
    canMoveIn: () => false,          // ← Content can't have children
    canMoveOut: () => true,
  },
  // NO isCanvas property needed
};
```

---

## Step-by-Step Debug Process

### If widgets don't drop:

**Step 1**: Check Toolbox
```javascript
// See all events
window.__dragDebugger.getEvents()

// Filter drag starts
window.__dragDebugger.getEvents().filter(e => e.type === 'drag_start')
```
✓ If array has items → Toolbox works
✗ If empty → Fix: Check Toolbox `connectors.create()`

---

**Step 2**: Check Container Selection
```javascript
// Drag over container and look for:
window.__dragDebugger.getEvents().find(e => 
  e.type === 'drag_over' && e.containerName === 'Container'
)
```
✓ If found → Container recognized
✗ If not → Fix: Check Container has `connect(drag(ref))`

---

**Step 3**: Check Drop Validation
```javascript
// Look for drop events:
window.__dragDebugger.getEvents().filter(e => e.type === 'drop')
```
✓ If array has items → Drop works!
✗ If empty → Fix: Check `canMoveIn: () => true`

---

**Step 4**: Check Drop Success
```javascript
// Last drag_end should have success: true
const lastDragEnd = window.__dragDebugger.getEvents()
  .filter(e => e.type === 'drag_end')
  .slice(-1)[0];

lastDragEnd.details.success  // Should be true
```
✓ If true → Widget should appear ✓
✗ If false → Debug serialization issue

---

## Checklist for Adding New Widget

- [ ] Widget file created in `frontend/lib/craftjs/widgets/{category}/`
- [ ] Imported in `CraftEditor.tsx` resolver
- [ ] Added to Toolbox widget list
- [ ] Ref callback: `ref={(ref) => { if (ref) connect(drag(ref)); }}`
- [ ] `.craft.rules.canMoveIn` defined (true for containers, false for content)
- [ ] `.craft.rules.canMoveOut` defined
- [ ] `.craft.isCanvas` defined (true only for containers)
- [ ] `.craft.displayName` set
- [ ] (Optional) Debug logging added

---

## Visual Debugging: Console Color Codes

When debug logging is enabled:

| Color | Event | Meaning |
|-------|-------|---------|
| 🟢 Green | DRAG_START | Widget picked up |
| 🔵 Blue | DRAG_ENTER | Entered drop zone |
| 🔷 Cyan | DRAG_OVER | Hovering over zone |
| 🟠 Orange | DRAG_LEAVE | Left drop zone |
| 🟡 Yellow | DROP | Widget released |
| 🔴 Red | DRAG_END (fail) | Drop failed |
| 🟣 Purple | ERROR | Something broke |

---

## Ultimate Test: Minimal Example

If all else fails, test with this minimal example:

```typescript
// In Viewport.tsx, replace with:
<Frame>
  <Element is={Container} canvas>
    <Element is={Text} text="Hello World" />
  </Element>
</Frame>
```

Then drag from Toolbox. If this works:
- ✓ Craft.js is installed correctly
- ✓ Core drag-drop works
- ✓ Problem is in specific widget config

If this ALSO fails:
- ✗ Check Craft.js version
- ✗ Check Editor initialization
- ✗ Check Frame setup

---

## Performance Debug

```javascript
// Check event queue size
window.__dragDebugger.getEvents().length  // Should stay < 100

// Monitor memory
setInterval(() => {
  console.log('Events:', window.__dragDebugger.getEvents().length);
}, 1000);
```

---

## Emergency Disable Debug Logging

If debug logging causes issues:

**In Viewport.tsx**:
```typescript
// Comment out this line:
// dragDebugger.log({ ... });
```

**In widgets**: Comment out all `dragDebugger.log()` calls

Debug utility won't break anything if called but not imported.

---

## Get Help: What Info To Provide

If you need help debugging:

1. **Get the event log**:
```javascript
JSON.stringify(window.__dragDebugger.getEvents(), null, 2)
```

2. **Screenshot console** showing events

3. **Run this diagnostic**:
```javascript
{
  events: window.__dragDebugger.getEvents().length,
  dragStarts: window.__dragDebugger.getEvents().filter(e => e.type === 'drag_start').length,
  drops: window.__dragDebugger.getEvents().filter(e => e.type === 'drop').length,
  errors: window.__dragDebugger.getEvents().filter(e => e.type === 'error'),
}
```

4. **Check frame**: `console.log(document.querySelector('[data-testid="frame"]'))`
