# Craft.js Drag-Drop Real Root Cause Fix

## Investigation Finding

The root cause has been identified: **The Viewport component's Frame needs to properly expose its drop zone to Craft.js drag system**.

### The Problem

1. **Toolbox**: Using `connectors.create()` ✅ WORKS - widgets become draggable
2. **Container**: Using `connect(drag(ref))` ✅ WORKS - can accept drops  
3. **Frame**: Uses default behavior ❌ ISSUE - may not register as valid drop target

###The Fix

The Frame inside Viewport needs to be wrapped or configured so that Craft.js recognizes it as the main drop zone. There are two approaches:

#### Approach 1: Wrap Frame with RenderNode Component (Recommended)
```typescript
// This ensures Frame is properly managed by Craft.js
<Frame>
  <Element is={Container} canvas />
</Frame>
```

This should already work since Container has `isCanvas: true` and is inside a Frame.

#### Approach 2: Use RenderNode Hook Directly
```typescript
import { useRender } from "@craftjs/core";

export const Viewport = () => {
  const render = useRender();
  
  return (
    <div className="flex-1 overflow-auto bg-gray-800 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl min-h-[600px] p-8">
        {render()}
      </div>
    </div>
  );
};
```

### Current Status

- ✅ Build succeeds
- ✅ Toolbox widgets draggable
- ❓ Frame accepting drops - needs verification

### Next Debugging Steps

1. Open browser DevTools Console
2. Run: `window.__craftjs__` - check if Craft.js is loaded
3. Check if Frame is registering as drop zone
4. Verify connectors.create() is returning proper components

### Files to Check

- `frontend/lib/craftjs/components/Viewport.tsx` - Frame configuration
- `frontend/lib/craftjs/editor/CraftEditor.tsx` - Editor root configuration
- `frontend/lib/craftjs/components/Toolbox.tsx` - Widget dragging setup
