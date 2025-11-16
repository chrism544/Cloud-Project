# Craft.js Editor Improvements - Test Guide

## Summary of Changes

Three major improvements were implemented to enhance the Craft.js visual page builder:

### 1. **Right-Click Context Menu** (replaced inline toolbar)
- **Before**: Inline toolbar appeared above widgets on hover, cluttering the interface
- **After**: Professional right-click context menu with dark theme

### 2. **Fixed Duplicate Key Error** (React key collision)
- **Before**: Console error when duplicating widgets: `Encountered two children with the same key`
- **After**: Unique ID generation ensures no key collisions

### 3. **Enhanced Drop Indicator** (better visibility)
- **Before**: Thin blue line, hard to see
- **After**: Thick emerald green line with glow, pulsing animation, and glowing dots on both ends

---

## How to Test

### Prerequisites
1. Navigate to http://localhost:3000
2. Login with credentials (admin@example.com / ChangeMe123!)
3. Go to Pages dashboard
4. Create a NEW page (or edit existing page)
5. You'll be redirected to the Puck editor

---

## Test 1: Right-Click Context Menu

### Steps:
1. In the editor, add a widget (e.g., Heading or Text) from the left sidebar by clicking it
2. On the canvas, **hover over the widget** - you should see:
   - Slim indigo outline (2px) around the widget
   - Small label above showing widget name (e.g., "Heading")
   - **NO inline toolbar with buttons** (this was removed)
3. **Right-click on the widget** - you should see a context menu with:
   - Widget name header (gray text)
   - "Drag to Move" option (with grip icon)
   - "Select Parent" option (with arrow up icon, if widget has parent)
   - "Duplicate" option (with copy icon)
   - "Delete" option (red text, separated by border)
4. Try each menu option:
   - Click "Drag to Move" and drag the widget to reposition it
   - Click "Duplicate" to create a copy
   - Click "Delete" to remove it

### Expected Results:
- ✅ No inline toolbar on hover (only slim outline + label)
- ✅ Right-click shows context menu at cursor position
- ✅ Menu has dark theme (bg-gray-900, white text)
- ✅ All menu options work correctly
- ✅ Menu closes when clicking anywhere or right-clicking again

---

## Test 2: Duplicate Widget (No Key Collision)

### Steps:
1. Add a widget to the canvas (e.g., Container with some Text inside)
2. Right-click on the widget
3. Click "Duplicate" in the context menu
4. **Open browser console** (F12 → Console tab)
5. Check for React warnings

### Expected Results:
- ✅ Widget duplicates successfully
- ✅ **NO console error** about duplicate keys
- ✅ **NO warning**: `Encountered two children with the same key`
- ✅ Both original and duplicate widgets are independently selectable
- ✅ Both widgets have unique IDs in React DevTools

### How the Fix Works:
The duplicate function now generates completely new unique IDs:
```typescript
const generateNewId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
```
Every duplicated node (and all its children) gets a fresh ID, preventing React key collisions.

---

## Test 3: Enhanced Drop Indicator

### Steps:
1. Add a Container widget to the canvas
2. From the left sidebar, click a widget to add (e.g., Text or Button)
3. **Drag the widget from the sidebar** and move it over the canvas
4. As you drag over drop zones, observe the drop indicator

### Expected Results:
- ✅ Drop indicator is **emerald green** (#10B981), not blue
- ✅ Line is **thick** (4px, very visible)
- ✅ Line has **glowing effect** (box-shadow with blur)
- ✅ Line **pulses** with animation (grows/shrinks slightly)
- ✅ **Glowing dots** appear on both LEFT and RIGHT ends of the line
- ✅ Dots also pulse with animation
- ✅ Indicator is **easy to see** at a glance

### Visual Description:
```
Before: ────────── (thin blue line, 2px, single dot on left)
After:  ●━━━━━━━━━━━━● (thick green glowing line, 4px, pulsing dots on both ends)
```

---

## Additional Verification

### Check TypeScript Compilation:
```bash
cd frontend
npx tsc --noEmit
```
Expected: No errors (command completes silently)

### Check Browser Console:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - ❌ No React warnings about duplicate keys
   - ❌ No errors about undefined connectors
   - ❌ No TypeScript type errors

### Check for Regressions:
Test that existing functionality still works:
1. ✅ Adding widgets from sidebar works
2. ✅ Selecting widgets works
3. ✅ Properties panel (right sidebar) updates when selecting widgets
4. ✅ Deleting widgets works
5. ✅ Undo/Redo works
6. ✅ Publish button works

---

## Files Modified

### `frontend/lib/craftjs/components/RenderNode.tsx` (225 lines - COMPLETELY REWRITTEN)
- Removed inline toolbar (hover UI with buttons)
- Added right-click context menu with ReactDOM.createPortal
- Fixed duplicate key error with unique ID generation
- Changed hover indicator to slim outline with label

### `frontend/lib/craftjs/styles/editor.css` (lines 35-93 updated)
- Changed drop indicator color: blue → emerald green
- Increased thickness: 2px → 4px
- Added glowing box-shadow
- Added pulsing animations (pulse-drop, pulse-dot)
- Added ::after pseudo-element for right-side dot

---

## Known Issues

### Issue: Old Pages Still Show Section/Column Widgets
**Reason**: Pages created before the Container fix have Section/Column structure serialized in their JSON.

**Workaround**: Create NEW pages to use the enhanced Container widget.

**Long-term Fix**: Would require database migration to convert old page structures.

---

## Troubleshooting

### Context Menu Not Appearing
- **Check**: Are you right-clicking directly on the widget?
- **Check**: Is the widget selectable? (Some widgets might have `canDrag: false`)
- **Try**: Refresh the page (Ctrl+F5) to clear cache

### Duplicate Still Shows Key Error
- **Check**: Open browser console and verify the EXACT error message
- **Check**: Is it the same widget or a different one?
- **Try**: Hard refresh (Ctrl+Shift+R) to ensure new code is loaded

### Drop Indicator Still Blue
- **Check**: Are CSS changes loaded? Open DevTools → Sources → Check editor.css
- **Try**: Hard refresh (Ctrl+F5) to clear CSS cache
- **Check**: Turbopack might be caching - restart dev server

---

## Performance Notes

All changes maintain the same performance characteristics:
- Context menu uses ReactDOM.createPortal (efficient, no DOM restructuring)
- Unique ID generation is O(1) constant time
- CSS animations use GPU-accelerated transforms (no layout thrashing)

---

## Next Steps

After testing, if issues are found:
1. Note the EXACT steps to reproduce
2. Check browser console for errors
3. Take screenshots if UI doesn't match expectations
4. Report findings for further fixes

If all tests pass:
1. ✅ Editor UX is significantly improved
2. ✅ No more duplicate key warnings
3. ✅ Drop zones are clearly visible
4. ✅ Professional right-click menu matches modern editors (Elementor, Webflow, Framer)
