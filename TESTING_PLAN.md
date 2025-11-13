# Comprehensive Widget Testing Plan

## Overview
This document provides a systematic testing plan for all widgets in the Page Editor, covering Content, Style, and Advanced settings for each widget.

## Testing Approach
1. **Manual Testing**: Visual verification of each widget and its properties
2. **Functional Testing**: Ensure each field updates the widget correctly
3. **Integration Testing**: Verify widgets work together on the same page
4. **Responsive Testing**: Check desktop, tablet, and mobile viewports
5. **Edge Case Testing**: Test extreme values, empty values, and invalid inputs

---

## Implemented Widgets (v3 Configuration)

### 1. HEADING WIDGET

#### Content Fields
| Field | Type | Default | Test Cases |
|-------|------|---------|------------|
| text | text | "Heading Text" | ✓ Update text<br>✓ Test empty string<br>✓ Test very long text (500+ chars)<br>✓ Test special characters (emoji, unicode)<br>✓ Test HTML tags (should escape) |
| tag | select | "h2" | ✓ Test each option: h1, h2, h3, h4, h5, h6<br>✓ Verify font size changes per tag<br>✓ Verify semantic HTML structure |
| link | text | "" | ✓ Add valid URL (http://example.com)<br>✓ Add relative URL (/page)<br>✓ Add anchor link (#section)<br>✓ Test empty (should not render anchor)<br>✓ Verify link is clickable |

#### Style Fields
| Field | Type | Default | Test Cases |
|-------|------|---------|------------|
| **Typography** |
| fontFamily | text | "inherit" | ✓ Test system fonts: Arial, Helvetica<br>✓ Test Google Fonts: "Roboto", "Open Sans"<br>✓ Test fallback stack: "Arial, sans-serif"<br>✓ Test invalid font (should fallback) |
| fontSize | text | "2rem" | ✓ Test rem units: 1rem, 2rem, 3rem<br>✓ Test px units: 16px, 24px, 32px<br>✓ Test em units: 1em, 1.5em<br>✓ Test percentage: 100%, 150%<br>✓ Test invalid value |
| fontWeight | select | "bold" | ✓ Test each option: normal, bold, 100-900<br>✓ Verify visual weight changes |
| lineHeight | text | "normal" | ✓ Test unitless: 1, 1.5, 2<br>✓ Test with units: 1.5rem, 24px<br>✓ Test "normal" keyword |
| letterSpacing | text | "normal" | ✓ Test positive: 0.1em, 2px<br>✓ Test negative: -0.05em<br>✓ Test "normal" keyword |
| textTransform | select | "none" | ✓ Test each: none, uppercase, lowercase, capitalize |
| textDecoration | select | "none" | ✓ Test each: none, underline, line-through, overline |
| color | text | "inherit" | ✓ Test hex: #000000, #FF5733<br>✓ Test rgb: rgb(255, 0, 0)<br>✓ Test rgba: rgba(0, 0, 0, 0.5)<br>✓ Test named: red, blue<br>✓ Test invalid |
| **Alignment** |
| align | radio | "left" | ✓ Test each: left, center, right, justify<br>✓ Verify text alignment |
| **Spacing** |
| margin | text | "0 0 1rem 0" | ✓ Test shorthand: 1rem, 1rem 2rem<br>✓ Test full: 1rem 2rem 3rem 4rem<br>✓ Test units: px, em, rem, %<br>✓ Test negative margins<br>✓ Test auto |
| padding | text | "0" | ✓ Same tests as margin |
| **Background** |
| backgroundColor | text | "transparent" | ✓ Same color tests as "color"<br>✓ Test "transparent" keyword<br>✓ Test opacity with rgba |
| **Border** |
| borderType | select | "none" | ✓ Test each: none, solid, dashed, dotted, double |
| borderWidth | text | "0" | ✓ Test values: 1px, 2px, 5px<br>✓ Test different sides: 1px 2px 3px 4px<br>✓ Test rem/em units |
| borderColor | text | "#000000" | ✓ Same color tests as "color" |
| borderRadius | text | "0" | ✓ Test single value: 0.5rem, 10px<br>✓ Test per corner: 5px 10px 15px 20px<br>✓ Test 50% for circles |
| **Shadow** |
| boxShadow | text | "none" | ✓ Test simple: 0 2px 4px rgba(0,0,0,0.1)<br>✓ Test spread: 0 0 10px 5px #000<br>✓ Test multiple: 0 2px 4px #000, 0 4px 8px #333<br>✓ Test inset: inset 0 2px 4px #000<br>✓ Test "none" keyword |
| **Dimensions** |
| width | text | "auto" | ✓ Test px: 200px, 500px<br>✓ Test %: 50%, 100%<br>✓ Test calc: calc(100% - 2rem)<br>✓ Test auto, min-content, max-content |
| maxWidth | text | "none" | ✓ Same as width |
| height | text | "auto" | ✓ Same as width |
| minHeight | text | "auto" | ✓ Same as width |

#### Advanced Fields
| Field | Type | Default | Test Cases |
|-------|------|---------|------------|
| **Positioning** |
| position | select | "relative" | ✓ Test each: relative, absolute, fixed, sticky<br>✓ Verify position behavior<br>✓ Test with top/left/right/bottom (if implemented) |
| zIndex | number | 0 | ✓ Test positive: 1, 10, 100, 9999<br>✓ Test negative: -1, -10<br>✓ Test 0<br>✓ Verify stacking order |
| **Responsive** |
| hideOnDesktop | radio | false | ✓ Set to true, verify hidden at >1024px<br>✓ Set to false, verify shown |
| hideOnTablet | radio | false | ✓ Set to true, verify hidden at 768-1023px<br>✓ Set to false, verify shown |
| hideOnMobile | radio | false | ✓ Set to true, verify hidden at <768px<br>✓ Set to false, verify shown |
| **Custom** |
| customClass | text | "" | ✓ Add single class: "my-heading"<br>✓ Add multiple classes: "class1 class2 class3"<br>✓ Verify class appears in DOM |
| customCSS | textarea | "" | ✓ Add inline styles: `background: blue;`<br>✓ Test multi-line CSS<br>✓ Test invalid CSS (should not break page) |

---

### 2. TEXT WIDGET

#### Content Fields
| Field | Type | Default | Test Cases |
|-------|------|---------|------------|
| content | textarea | "This is a text paragraph." | ✓ Update text<br>✓ Test multiline text<br>✓ Test empty string<br>✓ Test very long text (2000+ chars)<br>✓ Test special characters |

#### Style Fields
Same as Heading widget, except:
- No `tag` field (always renders as `<p>`)
- Default fontSize is "inherit" instead of "2rem"
- Default lineHeight is "1.6" instead of "normal"
- Default color is "#333333" instead of "inherit"

#### Advanced Fields
Same as Heading widget (identical)

---

### 3. BUTTON WIDGET

#### Content Fields
| Field | Type | Default | Test Cases |
|-------|------|---------|------------|
| text | text | "Click Me" | ✓ Update button text<br>✓ Test empty (should still render button)<br>✓ Test long text (50+ chars)<br>✓ Test special characters |
| link | text | "#" | ✓ Test valid URL<br>✓ Test relative URL<br>✓ Test anchor link<br>✓ Test mailto: link<br>✓ Test tel: link<br>✓ Verify link works |
| variant | select | "primary" | ✓ Test primary (blue background)<br>✓ Test secondary (purple background)<br>✓ Test outline (transparent bg, blue border)<br>✓ Test text (transparent bg, no border)<br>✓ Verify styles apply correctly |
| size | select | "medium" | ✓ Test small (padding: 0.5rem 1rem, font: 0.875rem)<br>✓ Test medium (padding: 0.75rem 1.5rem, font: 1rem)<br>✓ Test large (padding: 1rem 2rem, font: 1.125rem)<br>✓ Verify padding and font size |

#### Style Fields
| Field | Type | Default | Test Cases |
|-------|------|---------|------------|
| **Alignment** |
| align | radio | "left" | ✓ Test left, center, right<br>✓ Verify button container alignment |
| **Typography** | | | Same as Heading (affects button text) |
| **Spacing, Background, Border, Shadow, Dimensions** | | | Same as Heading |

**Important Note**: Button has default `borderRadius: "0.5rem"`, verify this applies.

#### Advanced Fields
Same as Heading widget (identical)

---

## Testing Scenarios

### Scenario 1: Single Widget Tests
**Objective**: Verify each widget works independently

**Steps**:
1. Create a new page
2. Add Heading widget
3. Test all Content fields
4. Test all Style fields
5. Test all Advanced fields
6. Repeat for Text and Button widgets

**Expected**: All fields update the widget correctly, visual changes are immediate

---

### Scenario 2: Multiple Widgets Interaction
**Objective**: Verify widgets work together without conflicts

**Steps**:
1. Add Heading, Text, and Button in sequence
2. Update styles on all widgets
3. Verify no style bleeding between widgets
4. Test z-index with overlapping widgets
5. Test margins/padding creating proper spacing

**Expected**: Each widget maintains its own styles independently

---

### Scenario 3: Responsive Behavior
**Objective**: Verify responsive visibility controls work

**Steps**:
1. Add a Heading widget
2. Set `hideOnDesktop: true`
3. Switch to Desktop viewport → widget should be hidden
4. Switch to Tablet viewport → widget should be visible
5. Repeat for `hideOnTablet` and `hideOnMobile`

**Expected**: Widgets hide/show based on viewport and visibility settings

---

### Scenario 4: Style Inheritance & Defaults
**Objective**: Verify default values and inheritance work correctly

**Steps**:
1. Add a Heading widget without changing defaults
2. Verify default styles apply:
   - fontSize: 2rem
   - fontWeight: bold
   - margin: 0 0 1rem 0
3. Change fontFamily to a custom font
4. Add a Text widget
5. Verify Text widget has different defaults:
   - lineHeight: 1.6
   - color: #333333

**Expected**: Each widget has correct default values that can be overridden

---

### Scenario 5: Edge Cases & Invalid Input
**Objective**: Verify editor handles invalid input gracefully

**Steps**:
1. Add a Heading widget
2. Set fontSize to invalid value: "abc"
3. Set color to invalid value: "not-a-color"
4. Set margin to invalid value: "10px 20px invalid"
5. Add very large values: width: "99999px"
6. Add negative values where invalid: fontSize: "-10px"

**Expected**:
- Invalid values are ignored or fallback to browser defaults
- Editor does not crash
- Widget still renders

---

### Scenario 6: Content/Style/Advanced Tab Switching
**Objective**: Verify property tabs show correct fields

**Steps**:
1. Add a Heading widget
2. Select the widget in the canvas
3. In right sidebar, click "Content" tab
   - Verify shows: text, tag, link fields
4. Click "Style" tab
   - Verify shows: typography, alignment, spacing, background, border, shadow, dimensions
5. Click "Advanced" tab
   - Verify shows: position, zIndex, hideOn fields, customClass, customCSS

**Expected**: Only fields for the active tab are shown

---

### Scenario 7: Save & Reload
**Objective**: Verify widget data persists correctly

**Steps**:
1. Add widgets with custom content and styles:
   - Heading with custom font, color, margin
   - Text with custom background, border
   - Button with custom variant and size
2. Click "Publish" to save
3. Navigate away from the page
4. Navigate back to the edit page
5. Verify all widgets retain their properties

**Expected**: All widget data is saved and restored correctly

---

### Scenario 8: Viewport Switching
**Objective**: Verify viewport controls affect canvas display

**Steps**:
1. Add a Heading widget with width: 100%
2. Click "Desktop" viewport button
   - Verify canvas is full width
3. Click "Tablet" viewport button
   - Verify canvas is 768px wide
4. Click "Mobile" viewport button
   - Verify canvas is 375px wide
5. Verify widget scales appropriately

**Expected**: Canvas resizes to match viewport, widgets respond accordingly

---

## Test Matrix

### Widget Coverage
| Widget | Content Fields | Style Fields | Advanced Fields | Total Fields |
|--------|---------------|--------------|-----------------|--------------|
| Heading | 3 | 23 | 7 | 33 |
| Text | 1 | 22 | 7 | 30 |
| Button | 4 | 23 | 7 | 34 |
| **TOTAL** | **8** | **68** | **21** | **97** |

### Field Type Coverage
| Field Type | Count | Test Cases per Type |
|------------|-------|-------------------|
| text | 42 | 5-10 test cases each |
| textarea | 2 | 5 test cases each |
| select | 7 | All options + invalid |
| radio | 4 | All options |
| number | 1 | Positive, negative, zero, extreme |

---

## Testing Checklist

### Pre-Testing Setup
- [ ] Frontend container is running
- [ ] Backend container is running
- [ ] Database is seeded with test data
- [ ] Test portal and user account exist
- [ ] Browser DevTools are open for debugging

### Widget Testing Checklist
For EACH widget, test:

#### Content Tab
- [ ] All content fields update correctly
- [ ] Empty values handled gracefully
- [ ] Special characters render correctly
- [ ] Very long content doesn't break layout

#### Style Tab
**Typography**
- [ ] fontFamily changes apply
- [ ] fontSize with rem/px/em/% all work
- [ ] fontWeight visual changes are correct
- [ ] lineHeight affects spacing
- [ ] letterSpacing affects character spacing
- [ ] textTransform uppercase/lowercase/capitalize work
- [ ] textDecoration underline/line-through work
- [ ] color with hex/rgb/rgba/named all work

**Alignment**
- [ ] left/center/right alignment works

**Spacing**
- [ ] margin shorthand and full values work
- [ ] padding shorthand and full values work
- [ ] Negative margins work
- [ ] Different units (px, rem, em, %) work

**Background**
- [ ] backgroundColor with all color formats works
- [ ] transparent keyword works

**Border**
- [ ] borderType none/solid/dashed/dotted/double work
- [ ] borderWidth applies correctly
- [ ] borderColor applies correctly
- [ ] borderRadius creates rounded corners

**Shadow**
- [ ] boxShadow applies correctly
- [ ] Multiple shadows work
- [ ] Inset shadow works
- [ ] "none" keyword removes shadow

**Dimensions**
- [ ] width with px/% /calc/auto works
- [ ] maxWidth constrains element
- [ ] height sets element height
- [ ] minHeight sets minimum height

#### Advanced Tab
**Positioning**
- [ ] position relative/absolute/fixed/sticky work
- [ ] zIndex affects stacking order

**Responsive**
- [ ] hideOnDesktop hides at desktop viewport
- [ ] hideOnTablet hides at tablet viewport
- [ ] hideOnMobile hides at mobile viewport

**Custom**
- [ ] customClass adds class to DOM
- [ ] customCSS applies inline styles

### Integration Testing
- [ ] Multiple widgets on same page don't conflict
- [ ] Styles don't bleed between widgets
- [ ] Save and reload preserves all data
- [ ] Undo/redo works (if implemented)
- [ ] Copy/paste widgets works (if implemented)

### Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

### Performance Testing
- [ ] Page with 50+ widgets loads in < 3 seconds
- [ ] Updating fields has < 100ms lag
- [ ] Save operation completes in < 1 second

---

## Bug Tracking Template

When a test fails, document:

```markdown
### Bug #[NUMBER]: [TITLE]

**Widget**: [Heading/Text/Button]
**Field**: [Field name]
**Tab**: [Content/Style/Advanced]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots**:
[Attach screenshots]

**Console Errors**:
[Paste any console errors]

**Severity**: [Critical/High/Medium/Low]
**Priority**: [P0/P1/P2/P3]
```

---

## Test Execution Plan

### Phase 1: Individual Widget Testing (Day 1-2)
1. Test Heading widget - all 33 fields
2. Test Text widget - all 30 fields
3. Test Button widget - all 34 fields

**Estimated Time**: 6-8 hours

### Phase 2: Integration Testing (Day 3)
1. Multiple widgets interaction
2. Responsive behavior
3. Save/reload persistence

**Estimated Time**: 3-4 hours

### Phase 3: Edge Case & Stress Testing (Day 4)
1. Invalid input handling
2. Extreme values
3. Performance with many widgets

**Estimated Time**: 2-3 hours

### Phase 4: Browser Compatibility (Day 5)
1. Test on Chrome/Edge
2. Test on Firefox
3. Test on Safari

**Estimated Time**: 2-3 hours

**Total Estimated Time**: 13-18 hours

---

## Success Criteria

The widget system is considered "production-ready" when:
- ✅ All 97 fields across 3 widgets function correctly
- ✅ No critical or high-severity bugs remain
- ✅ All 8 testing scenarios pass
- ✅ Browser compatibility verified across Chrome, Firefox, Safari
- ✅ Performance metrics met (page load < 3s, field updates < 100ms)
- ✅ No console errors during normal operation
- ✅ Responsive visibility controls work on all viewports
- ✅ Save/reload preserves all widget data correctly

---

## Next Steps After Testing

Once all tests pass:
1. Add remaining widgets from original design (Container, Section, Column, Image, Video, Gallery, Form, Countdown, PriceTable, Testimonial, Slider)
2. Implement Pro widgets (Posts, Portfolio, Login, Nav Menu)
3. Implement Theme Element widgets (Post Title, Post Excerpt, Site Logo)
4. Implement Advanced widgets (Lottie, Code Highlight, Hotspot, Mega Menu)
5. Create automated tests (Jest, Playwright)
6. Write end-user documentation
