# 🎯 How to Find and Drag the Section Widget

## ❌ What You're Doing Now (WRONG)

You're dragging the **Column** widget:

```
┌─────────────────┐
│   LAYOUT        │
├─────────────────┤
│ 📋 Section      │ ← NOT clicking this
│ 📦 Container    │
│ 📑 Column       │ ← DRAGGING THIS (wrong!)
│ ━  Spacer       │
│ ━  Divider      │
└─────────────────┘
```

**Result:** You get a single Column widget (dark grey button)

---

## ✅ What You SHOULD Do (CORRECT)

Click and drag the **Section** widget (FIRST item in Layout category):

```
┌─────────────────┐
│   LAYOUT        │
├─────────────────┤
│ 📋 Section      │ ← CLICK AND DRAG THIS!
│ 📦 Container    │
│ 📑 Column       │
│ ━  Spacer       │
│ ━  Divider      │
└─────────────────┘
```

**Result:** Section with 1 Column automatically created inside!

---

## 📸 Visual Comparison

### What "Section" Widget Looks Like in Sidebar

Look for a widget labeled **"Section"** with a **layout icon** (📋):

```
┌──────────┐
│    📋    │ ← Layout icon
│ Section  │ ← Label says "Section"
└──────────┘
```

### What "Column" Widget Looks Like in Sidebar (DON'T DRAG THIS)

The Column widget (what you're currently dragging) looks like:

```
┌──────────┐
│    ││    │ ← Columns icon (two vertical bars)
│  Column  │ ← Label says "Column"
└──────────┘
```

---

## 🔍 Step-by-Step Instructions

1. **Look at the LEFT sidebar**
2. **Find the "LAYOUT" section header**
3. **Look at the FIRST widget** under "LAYOUT"
4. It should say **"Section"** (NOT "Column")
5. **Click and hold** on "Section"
6. **Drag it** to the white canvas area
7. **Release** the mouse

---

## ✅ Expected Result After Dragging Section

When you drag Section to the canvas, you should see:

```
╔═══════════════════════════════════════════╗
║ Section (purple outer box)                ║
║ ┌───────────────────────────────────────┐ ║
║ │ Column (green inner box)              │ ║
║ │                                       │ ║
║ │        📄                             │ ║
║ │   Drop widgets                        │ ║
║ │                                       │ ║
║ └───────────────────────────────────────┘ ║
╚═══════════════════════════════════════════╝
```

**NOT just a single green "Drop widgets" placeholder!**

---

## 🐛 Troubleshooting

### Issue: "I only see Column, not Section"

**Solution:** Scroll up in the sidebar - Section is the FIRST item in Layout category.

### Issue: "Section widget doesn't appear when I drag it"

**Solution:**
1. Hard refresh: Ctrl+Shift+R
2. Close browser tab completely
3. Open new tab → http://localhost:3000
4. Create a NEW page
5. Try again

### Issue: "I'm dragging Section but it's still just one green box"

**Solution:** You're likely on an OLD page. Create a BRAND NEW page:
1. Go to Pages dashboard
2. Click "New Page"
3. Enter title: "Test Elementor Style"
4. Click "Create"
5. Try dragging Section again

---

## 📊 Quick Reference

| Widget | Icon | Label | What It Does |
|--------|------|-------|--------------|
| **Section** | 📋 | "Section" | Auto-creates with 1 Column inside (what you want!) |
| Column | ││ | "Column" | Single column only (NOT what you want) |
| Container | 📦 | "Container" | Flexbox container (different from Section) |

---

## 🎯 TL;DR

1. Look at LEFT sidebar
2. Find "LAYOUT" section
3. Click the FIRST widget labeled **"Section"** (has layout icon 📋)
4. Drag it to canvas
5. Should see Section with 1 Column inside automatically

**Don't drag "Column" widget - drag "Section" widget!**
