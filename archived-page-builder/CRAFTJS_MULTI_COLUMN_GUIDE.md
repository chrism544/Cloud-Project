# Multi-Column Layout Guide - Craft.js Editor

## Quick Reference: Create Multi-Column Layouts

### Method 1: Container with Flexbox (RECOMMENDED)

**Advantages:**
- Enhanced Container with 50+ properties
- Full control over layout (gap, justifyContent, alignItems)
- Responsive breakpoints
- Advanced styling (background, transform, filters, animations)

**Steps:**
1. Start with the root Container (already on canvas)
2. Drag widgets into it (e.g., 3x Text widgets)
3. Select the Container
4. In the right panel, change **Direction** from `column` to `row`
5. Adjust **Gap** to control spacing between columns (default: 20px)
6. Set **Justify Content** to `space-between` or `space-evenly` for equal distribution

**Result:** Widgets appear side-by-side as columns

**Example Structure:**
```
Container (direction: row, gap: 20px)
  ├─ Text Widget (Column 1)
  ├─ Image Widget (Column 2)
  └─ Button Widget (Column 3)
```

**To make columns equal width:**
1. Select each widget inside the Container
2. In the widget's properties, set **Width** to `100%` or use **Flex Grow** = 1

---

### Method 2: Section + Column Widgets (Elementor-style)

**Advantages:**
- Familiar Elementor workflow
- Explicit column structure
- Max-width container built-in

**Steps:**
1. Drag a **Section** widget from the sidebar (Layout category)
2. Drag **Column** widgets into the Section
   - Drag 2 Columns for 2-column layout
   - Drag 3 Columns for 3-column layout
   - Drag 4 Columns for 4-column layout
3. Drag content widgets (Text, Image, Button, etc.) into each Column

**IMPORTANT:** Section widgets ONLY accept Column widgets as direct children!

**Example Structure:**
```
Section
  ├─ Column 1
  │   ├─ Heading
  │   └─ Text
  ├─ Column 2
  │   ├─ Image
  │   └─ Button
  └─ Column 3
      └─ Video
```

---

## Troubleshooting: "Can't Drag Section/Container to Blank Space"

### Issue 1: Drop Indicator Not Showing

**Cause:** Canvas widgets need a visible drop zone with the emerald green pulsing indicator.

**Solution:**
1. Make sure you're dragging OVER the existing Container (you should see the green drop line)
2. The drop indicator shows WHERE the widget will be inserted
3. If you don't see the green line, the drop target isn't valid

### Issue 2: Section Won't Accept Widgets

**Cause:** Section widget has strict rules - it ONLY accepts Column widgets.

**Solution:**
1. Drag Column widgets into the Section first
2. Then drag content widgets (Text, Image, Button) into the Columns
3. You cannot drag Text/Image/Button directly into a Section

### Issue 3: Dragging Not Working at All

**Possible Causes:**
1. Turbopack hot reload issue (requires hard refresh)
2. Craft.js connector not initialized
3. Browser cache issue

**Solutions:**
1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check browser console** for errors
3. **Try refreshing the page** normally first
4. **If still broken:** Restart the dev server

---

## Common Layout Patterns

### 1. Two-Column Layout (50/50)

**Using Container:**
```typescript
Container (direction: row, gap: 30px)
  ├─ Text Widget (width: 100%, flexGrow: 1)
  └─ Image Widget (width: 100%, flexGrow: 1)
```

**Using Section + Columns:**
```typescript
Section
  ├─ Column (width: 50%)
  │   └─ Text
  └─ Column (width: 50%)
      └─ Image
```

### 2. Three-Column Layout (33/33/33)

**Using Container:**
```typescript
Container (direction: row, gap: 20px, justifyContent: space-evenly)
  ├─ Text Widget (flexGrow: 1)
  ├─ Image Widget (flexGrow: 1)
  └─ Button Widget (flexGrow: 1)
```

### 3. Sidebar Layout (30/70)

**Using Container:**
```typescript
Container (direction: row, gap: 40px)
  ├─ Sidebar Widget (width: 30%, flexShrink: 0)
  └─ Main Content Widget (flexGrow: 1)
```

### 4. Nested Columns

**Using Container:**
```typescript
Container (direction: column)
  ├─ Container (direction: row) [Row 1]
  │   ├─ Text
  │   └─ Image
  └─ Container (direction: row) [Row 2]
      ├─ Button
      ├─ Icon
      └─ Text
```

---

## Why You're Seeing Only One Column

**Your Current Situation:**
- You have a single **Column** widget selected (blue label shows "Column")
- This is just ONE column, not a multi-column layout

**To Create Multiple Columns:**
- **Option 1:** Add more Column widgets to the parent Section
- **Option 2:** Delete this Column and use the Container approach instead
- **Option 3:** Keep this Column and add sibling Column widgets next to it

---

## Best Practices

### 1. Choose the Right Approach

**Use Container when:**
- You want full flexbox control
- You need advanced styling (gradients, transforms, animations)
- You want responsive breakpoints
- You need nested layouts with different directions

**Use Section + Columns when:**
- You want explicit column structure
- You prefer Elementor-style workflow
- You need max-width container (1200px default)
- You want separation between layout and content

### 2. Responsive Design

**Container Approach:**
- Use the **Responsive** settings panel
- Set different visibility for Desktop/Tablet/Mobile
- Adjust direction (row on desktop, column on mobile)

**Section Approach:**
- Set Column width to 100% for mobile
- Use responsive padding/margin settings

### 3. Alignment and Spacing

**Container Properties:**
- **Justify Content:** Horizontal alignment of children
  - `flex-start`: Align left
  - `center`: Align center
  - `flex-end`: Align right
  - `space-between`: Equal space between items
  - `space-evenly`: Equal space around items
- **Align Items:** Vertical alignment of children
  - `flex-start`: Align top
  - `center`: Center vertically
  - `flex-end`: Align bottom
  - `stretch`: Fill height
- **Gap:** Space between columns (e.g., 20px, 30px, 40px)

---

## Example: Creating a 3-Column Feature Section

### Step 1: Add Container
1. Root Container is already on the canvas
2. Change its properties:
   - **Direction:** row
   - **Gap:** 30px
   - **Justify Content:** space-evenly
   - **Padding:** 60px all sides

### Step 2: Add 3 Nested Containers (One for Each Column)
1. Drag 3 Container widgets into the root Container
2. Each nested Container represents one column
3. Set each nested Container:
   - **Width:** 100%
   - **Flex Grow:** 1
   - **Direction:** column (for vertical stacking inside the column)
   - **Align Items:** center
   - **Gap:** 15px

### Step 3: Add Content to Each Column
1. First column: Icon → Heading → Text → Button
2. Second column: Icon → Heading → Text → Button
3. Third column: Icon → Heading → Text → Button

### Result:
```
Container (row, gap: 30px, justify: space-evenly)
  ├─ Container (column, align: center) [Column 1]
  │   ├─ Icon
  │   ├─ Heading ("Feature 1")
  │   ├─ Text ("Description here")
  │   └─ Button ("Learn More")
  ├─ Container (column, align: center) [Column 2]
  │   ├─ Icon
  │   ├─ Heading ("Feature 2")
  │   ├─ Text ("Description here")
  │   └─ Button ("Learn More")
  └─ Container (column, align: center) [Column 3]
      ├─ Icon
      ├─ Heading ("Feature 3")
      ├─ Text ("Description here")
      └─ Button ("Learn More")
```

---

## Keyboard Shortcuts (Future Enhancement)

Currently, widgets must be dragged. Future enhancements may include:
- **Ctrl+D**: Duplicate selected widget
- **Del**: Delete selected widget
- **Ctrl+C/V**: Copy/Paste widgets
- **Arrow keys**: Navigate between widgets

---

## If Nothing Works: Debug Checklist

1. ✅ Hard refresh browser (Ctrl+Shift+R)
2. ✅ Check browser console for errors
3. ✅ Verify you're dragging over a valid drop target (look for green line)
4. ✅ Try creating a NEW page (old pages have old structure)
5. ✅ Restart dev server: `cd frontend && npm run dev`
6. ✅ Clear Next.js cache: `cd frontend && rm -rf .next && npm run dev`

---

## Related Files

- **Container Widget:** `frontend/lib/craftjs/widgets/layout/Container.tsx`
- **Section Widget:** `frontend/lib/craftjs/widgets/layout/Section.tsx`
- **Column Widget:** `frontend/lib/craftjs/widgets/layout/Column.tsx`
- **Toolbox:** `frontend/lib/craftjs/components/Toolbox.tsx`
- **Drop Indicator Styles:** `frontend/lib/craftjs/styles/editor.css` (lines 35-93)

---

## Summary

**To create multiple columns:**
1. **Container method:** Add widgets, change direction to `row`
2. **Section method:** Add Section, drag Columns into it, add content to Columns

**Why drag isn't working:**
- Make sure you see the emerald green pulsing drop indicator
- Section only accepts Column widgets (not content widgets directly)
- Try hard refresh if drag-drop is completely broken

**Recommended:** Use Container method for modern, flexible layouts with full styling control.
