# Craft.js Editor Testing Guide

## Quick Start Testing

### 1. Access the Editor
```
1. Start the development server: npm run dev
2. Login to the portal
3. Navigate to: Dashboard → Pages
4. Click "Edit" on any page
```

### 2. First Visual Check
**Expected:**
- Dark theme editor interface
- Three-panel layout:
  - Left: Toolbox with widgets
  - Center: Canvas/Viewport
  - Right: Settings panel
- Top toolbar with: Page title, Save, Preview, Publish buttons

**If you see errors:**
- Check browser console (F12)
- Verify all imports are correct
- Check if @craftjs/core is installed

### 3. Test Widget Toolbox
**Widgets should appear in two categories:**

**Layout Widgets:**
- Container
- Section  
- Column
- InnerSection
- Spacer
- Divider

**Basic Widgets:**
- Heading
- Text
- Image
- Video
- Button
- Icon
- IconBox
- ImageBox

**Test:** Try dragging a Text widget onto the canvas

### 4. Test Drag & Drop
1. Drag "Text" widget from toolbox
2. Drop it onto the canvas
3. **Expected:** Widget appears on canvas
4. Try dragging another widget
5. **Expected:** Can rearrange widgets

### 5. Test Settings Panel
1. Click on a widget in the canvas
2. **Expected:** Settings panel shows on the right
3. Try changing a property (e.g., text content)
4. **Expected:** Widget updates in real-time

### 6. Test Save Functionality
1. Make some changes to the page
2. Click "Save" button
3. **Expected:** "Saving..." appears, then "Save"
4. Refresh the page
5. **Expected:** Changes are persisted

### 7. Test Migration (If you have old Puck pages)
1. Open a page that was created with Puck editor
2. **Expected:** Page loads without errors
3. **Expected:** Console shows "Migrating Puck data to Craft.js format..."
4. **Expected:** Widgets appear on canvas

## Common Issues & Solutions

### Issue: "Cannot find module @craftjs/core"
**Solution:**
```bash
cd frontend
npm install @craftjs/core
```

### Issue: Widgets not draggable
**Solution:**
- Check if Editor has `enabled={true}`
- Verify widgets have proper craft settings
- Check browser console for errors

### Issue: Settings panel not showing
**Solution:**
- Click directly on a widget (not empty space)
- Check if widget has Settings component defined
- Verify useEditor hook is working

### Issue: Save not working
**Solution:**
- Check network tab for API errors
- Verify authentication token is valid
- Check backend API endpoint is accessible

### Issue: Page loads blank
**Solution:**
- Check if initialData is properly set
- Verify ROOT node exists in data
- Check console for serialization errors

## Testing Checklist

### Basic Functionality
- [ ] Editor loads without errors
- [ ] Toolbox displays all 14 widgets
- [ ] Can drag widgets onto canvas
- [ ] Can rearrange widgets
- [ ] Settings panel appears when clicking widgets
- [ ] Settings changes update in real-time
- [ ] Save button works
- [ ] Changes persist after refresh
- [ ] Preview button works
- [ ] Publish button works

### Widget-Specific Tests
- [ ] Text: Can edit content
- [ ] Heading: Can change level (H1-H6)
- [ ] Image: Can set URL and see image
- [ ] Video: Can embed YouTube/Vimeo
- [ ] Button: Can set text and link
- [ ] Icon: Can select different icons
- [ ] Container: Can nest other widgets
- [ ] Section: Can create layout sections

### Migration Tests (if applicable)
- [ ] Old Puck pages load
- [ ] Migration happens automatically
- [ ] Migrated content displays correctly
- [ ] Can edit migrated content
- [ ] Can save migrated pages

## Performance Checks
- [ ] Editor loads in < 3 seconds
- [ ] Drag/drop is smooth
- [ ] Settings update instantly
- [ ] No memory leaks (check DevTools)
- [ ] Works with 20+ widgets on page

## Browser Compatibility
Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Report Template

When reporting issues, include:
```
**Issue:** Brief description
**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected:** What should happen
**Actual:** What actually happened
**Browser:** Chrome 120
**Console Errors:** [paste any errors]
**Screenshots:** [if applicable]
```

## Success Criteria

✅ **Integration is successful if:**
1. Editor loads without errors
2. All 14 widgets are visible and draggable
3. Settings panel works for all widgets
4. Save/load functionality works
5. Migration from Puck works (if applicable)
6. No console errors during normal usage
7. Performance is acceptable (< 3s load, smooth interactions)

---

**Need Help?**
- Check browser console for errors
- Review CRAFTJS_INTEGRATION_CHECKLIST.md
- Check component files in `frontend/lib/craftjs/`
