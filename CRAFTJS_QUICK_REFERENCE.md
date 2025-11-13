# Craft.js Quick Reference Guide

## Widget Usage

### Importing Widgets

```typescript
import { Text } from "@/lib/craftjs/widgets/basic/Text";
import { Image } from "@/lib/craftjs/widgets/basic/Image";
import { Video } from "@/lib/craftjs/widgets/basic/Video";
import { Button } from "@/lib/craftjs/widgets/basic/Button";
import { Icon } from "@/lib/craftjs/widgets/basic/Icon";
import { IconBox } from "@/lib/craftjs/widgets/basic/IconBox";
import { ImageBox } from "@/lib/craftjs/widgets/basic/ImageBox";
```

### Using Component Resolver

```typescript
import { getComponent, getAvailableComponents, getComponentsByCategory } from "@/lib/craftjs/utils/componentResolver";

// Get a component by name
const TextComponent = getComponent("Text");

// Get all components
const allComponents = getAvailableComponents(); // ["Container", "Section", ...]

// Get components by category
const byCategory = getComponentsByCategory(); // { Layout: [...], Basic: [...] }
```

### Using Migration Utilities

```typescript
import { 
  convertPuckToCraft, 
  convertCraftToPuck, 
  validatePuckData,
  getMigrationSummary 
} from "@/lib/craftjs/utils/puckToCraftMigration";

// Convert Puck data to Craft.js
if (validatePuckData(pageData)) {
  const craftData = convertPuckToCraft(pageData);
}

// Convert back to Puck (for export)
const puckData = convertCraftToPuck(craftData);

// Get migration info
const summary = getMigrationSummary(puckData, craftData);
// { sourcePuckWidgets: 5, targetCraftNodes: 7, status: "completed", ... }
```

## Widget Props Reference

### Text Widget
```typescript
interface TextProps {
  text?: string;                    // "Your text here..."
  align?: "left" | "center" | "right" | "justify";
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    textDecoration?: string;
    fontStyle?: string;
    color?: string;
  };
  padding?: { top?, right?, bottom?, left? };
  margin?: { top?, right?, bottom?, left? };
  backgroundColor?: string;
  lineHeight?: string;
}
```

### Image Widget
```typescript
interface ImageProps {
  src?: string;                     // Image URL
  alt?: string;                     // Alt text
  width?: string;                   // "100%" or "400px"
  height?: string;                  // "auto" or "300px"
  objectFit?: "cover" | "contain" | "fill" | "scale-down";
  borderRadius?: string;            // "8px"
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right";
  margin?: { top?, right?, bottom?, left? };
}
```

### Video Widget
```typescript
interface VideoProps {
  videoUrl?: string;                // YouTube/Vimeo URL or video file
  width?: string;                   // "100%" or "800px"
  height?: string;                  // "500px"
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  align?: "left" | "center" | "right";
  margin?: { top?, right?, bottom?, left? };
}
```

### Button Widget
```typescript
interface ButtonProps {
  text?: string;                    // "Click me"
  href?: string;                    // "#" or "https://..."
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  borderRadius?: string;            // "6px"
  padding?: { top?, right?, bottom?, left? };
  margin?: { top?, right?, bottom?, left? };
  align?: "left" | "center" | "right";
}
```

### Icon Widget
```typescript
interface IconProps {
  iconName?: string;                // "Heart", "Star", "Settings", etc.
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl";
  iconColor?: string;
  backgroundColor?: string;
  backgroundShape?: "none" | "circle" | "square" | "rounded";
  backgroundSize?: string;          // "40px"
  padding?: string;                 // "8px"
  margin?: { top?, right?, bottom?, left? };
  align?: "left" | "center" | "right";
}
```

### IconBox Widget
```typescript
interface IconBoxProps {
  iconName?: string;                // Icon name
  iconSize?: "sm" | "md" | "lg";
  iconColor?: string;
  title?: string;                   // "Feature Title"
  description?: string;             // "Feature description"
  layout?: "vertical" | "horizontal";
  titleColor?: string;
  descriptionColor?: string;
  gap?: string;                     // "12px"
  padding?: { top?, right?, bottom?, left? };
  backgroundColor?: string;
  borderRadius?: string;
  margin?: { top?, right?, bottom?, left? };
  align?: "left" | "center" | "right";
}
```

### ImageBox Widget
```typescript
interface ImageBoxProps {
  imageSrc?: string;                // Image URL
  imageAlt?: string;
  title?: string;                   // "Box Title"
  description?: string;
  buttonText?: string;              // "Learn More"
  buttonUrl?: string;               // "#"
  showButton?: boolean;
  layout?: "vertical" | "horizontal";
  imagePosition?: "top" | "left" | "right";
  titleColor?: string;
  descriptionColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: { top?, right?, bottom?, left? };
  margin?: { top?, right?, bottom?, left? };
}
```

## Component Resolver API

```typescript
// Get single component
const Component = getComponent("Text");
if (Component) {
  return <Component text="Hello" />;
}

// Check if component exists
if (hasComponent("VideoX")) {
  // Won't execute - VideoX doesn't exist
}

// List all available
const all = getAvailableComponents();
// ["Container", "Section", "Column", "InnerSection", "Spacer", 
//  "Divider", "Heading", "Text", "Image", "Video", "Button", 
//  "Icon", "IconBox", "ImageBox"]

// Group by category
const grouped = getComponentsByCategory();
// {
//   Layout: ["Container", "Section", "Column", ...],
//   Basic: ["Heading", "Text", "Image", ...]
// }
```

## Migration API

```typescript
// Validate Puck format
const isPuck = validatePuckData(data);

// Convert Puck → Craft.js
const craftNodes = convertPuckToCraft({
  widgets: [
    { type: "heading", props: { text: "Title" } },
    { type: "image", props: { src: "..." } }
  ]
});

// Convert Craft.js → Puck (for export)
const puckFormat = convertCraftToPuck(craftNodes);

// Get summary
const stats = getMigrationSummary(puckData, craftData);
console.log(stats.sourcePuckWidgets);  // 5
console.log(stats.targetCraftNodes);   // 7
```

## Integration Example

```typescript
// pages/[id]/editor/page.tsx
"use client";

import { useState, useEffect } from "react";
import CraftEditor from "@/lib/craftjs/editor/CraftEditor";
import { convertPuckToCraft, validatePuckData } from "@/lib/craftjs/utils/puckToCraftMigration";
import { usePageQuery } from "@/lib/hooks/usePages";

export default function EditorPage({ params }: { params: { id: string } }) {
  const { data: page } = usePageQuery(params.id);
  const [craftData, setCraftData] = useState(null);

  useEffect(() => {
    if (page?.content) {
      // Check if it's old Puck format and migrate if needed
      const converted = validatePuckData(page.content) 
        ? convertPuckToCraft(page.content)
        : page.content;
      setCraftData(converted);
    }
  }, [page]);

  const handleSave = async (serializedData: any) => {
    // Save to API
    await fetch(`/api/v1/pages/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ content: serializedData })
    });
  };

  const handlePublish = async () => {
    // Publish page
    await fetch(`/api/v1/pages/${params.id}/publish`, {
      method: "POST"
    });
  };

  const handlePreview = () => {
    // Open preview
    window.open(`/preview/${page?.slug}`, "_blank");
  };

  return (
    <CraftEditor
      initialData={craftData}
      onSave={handleSave}
      onPublish={handlePublish}
      onPreview={handlePreview}
      pageTitle={page?.title || "Untitled"}
      pageSlug={page?.slug || ""}
    />
  );
}
```

## Common Tasks

### Add a new widget

1. Create widget in `widgets/basic/YourWidget.tsx`
2. Export craft config with settings reference
3. Create settings component in `settings/YourWidgetSettings.tsx`
4. Add to `componentResolver.ts` COMPONENT_MAP
5. Import in `CraftEditor.tsx`

### Customize a widget

1. Edit the widget component file
2. Update props interface
3. Update settings component
4. Update default props in widget's `.craft` config

### Handle migration from Puck

Use `convertPuckToCraft()` to transform old format:
```typescript
const craftData = convertPuckToCraft(legacyPuckData);
```

### Get all available widgets for UI

```typescript
const widgets = getAvailableComponents();
// Display in dropdown/list
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget not in toolbox | Check `CraftEditor.tsx` imports |
| Settings not showing | Verify `.craft.related.settings` is set |
| Component not found | Check `componentResolver.ts` COMPONENT_MAP |
| Props not updating | Verify `setProp()` in settings component |
| Migration fails | Check `validatePuckData()` first |

## Performance Tips

- Lazy load icon picker (currently limited to ~100 icons)
- Use useMemo for large component lists
- Defer heavy image processing
- Limit widgets per page to ~100

## Future Enhancements

- [ ] Add rich text editor (Slate.js)
- [ ] Add file upload support
- [ ] Add animation controls
- [ ] Add conditional display rules
- [ ] Add undo/redo functionality
- [ ] Add collaborative editing
- [ ] Add widget templates
- [ ] Add custom CSS editor

---

**Last Updated:** November 11, 2025
**Version:** 1.0.0
