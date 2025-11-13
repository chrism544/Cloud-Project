# Puck Editor - Comprehensive Guide

This document provides complete documentation for working with the Puck visual editor in the Portal Management System.

## Table of Contents

1. [Introduction](#introduction)
2. [Widget Structure](#widget-structure)
3. [Field Types](#field-types)
4. [Slot Fields](#slot-fields)
5. [Dynamic Widgets](#dynamic-widgets)
6. [Custom Fields](#custom-fields)
7. [Interactive Widgets](#interactive-widgets)
8. [Tab System](#tab-system)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Widget Library](#widget-library)

---

## Introduction

### What is Puck?

Puck is a React-based visual page builder that allows users to create pages by dragging and dropping components. It provides:

- **Visual Editing**: WYSIWYG interface for page building
- **Component-Based**: Uses React components as widgets
- **Type-Safe**: Full TypeScript support
- **Extensible**: Easy to add custom widgets
- **Data-Driven**: Support for dynamic content via API calls

### Core Concepts

- **Config**: Defines all available widgets and their fields
- **Data**: JSON structure representing the page content
- **Fields**: Form inputs for configuring widget properties
- **Slots**: Areas where nested components can be placed
- **Overrides**: Custom UI replacements for Puck's default interface

---

## Widget Structure

### Basic Component Config

Every Puck widget follows this structure:

```typescript
import { ComponentConfig } from "@measured/puck";

const MyWidget: ComponentConfig = {
  // Required: How the component renders
  render: (props) => {
    return <div>{props.text}</div>;
  },

  // Optional: Field definitions
  fields: {
    text: {
      type: "text",
      label: "Text Content",
    },
  },

  // Optional: Default property values
  defaultProps: {
    text: "Default text",
  },

  // Optional: Display name in component list
  label: "My Widget",
};
```

### Complete Config Structure

```typescript
const AdvancedWidget: ComponentConfig = {
  // === REQUIRED ===
  render: (props: WidgetProps) => JSX.Element,

  // === OPTIONAL ===

  // Field definitions
  fields: {
    fieldName: FieldDefinition,
    // ... more fields
  },

  // Default values
  defaultProps: {
    fieldName: defaultValue,
    // ... more defaults
  },

  // Display configuration
  label: string,                      // Name shown in component list
  inline: boolean,                    // Render without wrapper div

  // Permissions
  permissions: {
    canDelete: boolean,
    canDuplicate: boolean,
    canInsert: boolean,
  },

  // Dynamic behavior
  resolveData: async (data, params) => {
    // Fetch external data, modify props
    return { props, readOnly };
  },

  resolveFields: async (data, params) => {
    // Return dynamic fields based on current props
    return fields;
  },

  resolvePermissions: async (data, params) => {
    // Return dynamic permissions
    return permissions;
  },

  // Metadata
  metadata: Record<string, any>,
};
```

### Props Available in Render

```typescript
type RenderProps = {
  // Your custom fields
  ...yourFields,

  // Puck context (always available)
  puck: {
    isEditing: boolean,           // True in editor, false in preview
    isDragging: boolean,          // True when component is being dragged
  },

  // Component metadata
  id: string,                     // Unique component ID
  editMode: boolean,              // Same as puck.isEditing
};
```

---

## Field Types

Puck supports 10 built-in field types. All fields share common properties:

```typescript
type BaseField = {
  type: FieldType,
  label?: string,              // Field label
  labelIcon?: ReactElement,    // Icon next to label
  visible?: boolean,           // Show/hide field
  metadata?: any,              // Custom metadata (e.g., for grouping)
};
```

### 1. Text Field

Single-line text input.

```typescript
{
  myField: {
    type: "text",
    label: "Text Input",
    placeholder: "Enter text...",
    contentEditable: boolean,  // Allow inline editing on canvas
  }
}

// Default prop
defaultProps: {
  myField: "Default text"
}
```

### 2. Textarea Field

Multi-line text input.

```typescript
{
  description: {
    type: "textarea",
    label: "Description",
    placeholder: "Enter description...",
    contentEditable: boolean,
  }
}

defaultProps: {
  description: "Default description"
}
```

### 3. Number Field

Numeric input with optional min/max/step.

```typescript
{
  quantity: {
    type: "number",
    label: "Quantity",
    min: 0,
    max: 100,
    step: 1,
    placeholder: "0",
  }
}

defaultProps: {
  quantity: 1
}
```

### 4. Select Field

Dropdown selection.

```typescript
{
  alignment: {
    type: "select",
    label: "Alignment",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ],
  }
}

defaultProps: {
  alignment: "left"
}
```

### 5. Radio Field

Radio button selection.

```typescript
{
  size: {
    type: "radio",
    label: "Size",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  }
}

defaultProps: {
  size: "md"
}
```

### 6. Array Field

Repeatable field group.

```typescript
{
  items: {
    type: "array",
    label: "Items",
    arrayFields: {
      title: { type: "text", label: "Title" },
      description: { type: "textarea", label: "Description" },
      link: { type: "text", label: "Link" },
    },
    defaultItemProps: {
      title: "New Item",
      description: "",
      link: "#",
    },
    getItemSummary: (item, index) => item.title || `Item ${index + 1}`,
    min: 0,
    max: 10,
  }
}

defaultProps: {
  items: []
}

// Usage in render
render: ({ items }) => (
  <div>
    {items.map((item, idx) => (
      <div key={idx}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
)
```

### 7. Object Field

Nested field group.

```typescript
{
  settings: {
    type: "object",
    label: "Settings",
    objectFields: {
      enabled: { type: "radio", label: "Enabled", options: [...] },
      apiKey: { type: "text", label: "API Key" },
      limit: { type: "number", label: "Limit" },
    },
  }
}

defaultProps: {
  settings: {
    enabled: true,
    apiKey: "",
    limit: 10,
  }
}

// Usage in render
render: ({ settings }) => (
  settings.enabled && <div>API Key: {settings.apiKey}</div>
)
```

### 8. External Field

Fetch and select external data.

```typescript
{
  selectedPost: {
    type: "external",
    label: "Select Post",
    placeholder: "Search posts...",

    // Fetch function
    fetchList: async ({ query, filters }) => {
      const response = await fetch(`/api/posts?search=${query}`);
      return response.json();
    },

    // Map API response to props
    mapProp: (value) => ({ id: value.id, title: value.title }),

    // Display in UI
    mapRow: (value) => ({
      title: value.title,
      author: value.author,
      date: value.date,
    }),

    // Summary in field
    getItemSummary: (item) => item.title,

    // Optional search
    showSearch: true,

    // Optional filters
    filterFields: {
      category: {
        type: "select",
        label: "Category",
        options: [...]
      }
    },
    initialFilters: {
      category: "all",
    },

    // Footer in dropdown
    renderFooter: ({ items }) => (
      <div>Showing {items.length} posts</div>
    ),
  }
}

defaultProps: {
  selectedPost: null
}
```

### 9. Custom Field

Fully custom field renderer.

```typescript
{
  color: {
    type: "custom",
    label: "Color",
    render: ({ value, onChange, name, id, readOnly }) => {
      return (
        <div>
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
          />
          <input
            type="text"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            disabled={readOnly}
          />
        </div>
      );
    },
  }
}

defaultProps: {
  color: "#000000"
}
```

### 10. Slot Field

Container for nested components (see Slot Fields section).

```typescript
{
  children: {
    type: "slot",
    label: "Content",
    allow: ["Heading", "Text", "Image"],  // Whitelist
    // OR
    disallow: ["Container"],  // Blacklist
  }
}

defaultProps: {
  children: []  // Always initialize as empty array
}
```

---

## Slot Fields

Slot fields allow components to contain other components (nesting).

### Single Slot (Container Pattern)

```typescript
const Container: ComponentConfig = {
  fields: {
    // Slot field
    children: {
      type: "slot",
      label: "Content",
    },

    // Container settings
    maxWidth: { type: "text", label: "Max Width" },
    padding: { type: "text", label: "Padding" },
  },

  defaultProps: {
    children: [],  // IMPORTANT: Must be array
    maxWidth: "1200px",
    padding: "2rem",
  },

  render: ({ children, maxWidth, padding, puck }) => {
    return (
      <div
        style={{
          maxWidth,
          padding,
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    );
  },
};
```

**Important**:
- Slot fields are automatically transformed from `ComponentData[]` to renderable React elements
- Always initialize slot defaultProps as `[]` (empty array)
- Use slot props directly in JSX: `{children}`

### Multiple Slots (Columns Pattern)

```typescript
const Columns: ComponentConfig = {
  fields: {
    columnCount: {
      type: "select",
      label: "Columns",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
    },
    gap: { type: "text", label: "Gap" },

    // Separate slot for each column
    column1: { type: "slot", label: "Column 1" },
    column2: { type: "slot", label: "Column 2" },
    column3: { type: "slot", label: "Column 3" },
    column4: { type: "slot", label: "Column 4" },
  },

  defaultProps: {
    columnCount: 2,
    gap: "1rem",
    column1: [],
    column2: [],
    column3: [],
    column4: [],
  },

  render: ({ column1, column2, column3, column4, columnCount, gap }) => {
    // Render only the needed columns
    const columns = [column1, column2, column3, column4].slice(0, Number(columnCount));

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap,
        }}
      >
        {columns.map((Column, idx) => (
          <div key={idx}>
            {Column}
          </div>
        ))}
      </div>
    );
  },
};
```

### Slot Restrictions

```typescript
{
  children: {
    type: "slot",

    // Only allow specific components
    allow: ["Heading", "Text", "Button"],

    // OR disallow specific components
    disallow: ["Container", "Columns"],  // Prevent infinite nesting
  }
}
```

---

## Dynamic Widgets

Puck widgets can fetch data, update fields dynamically, and respond to changes.

### resolveData - Fetch External Data

`resolveData` runs when:
- Component is first loaded
- Any prop changes
- User manually triggers refresh

```typescript
const BlogPosts: ComponentConfig = {
  fields: {
    category: { type: "text", label: "Category" },
    limit: { type: "number", label: "Limit" },
  },

  defaultProps: {
    category: "news",
    limit: 5,
  },

  resolveData: async ({ props, lastData }, { changed, lastFields }) => {
    // Only fetch if category or limit changed
    if (!changed.category && !changed.limit && lastData) {
      return { props };  // Return unchanged
    }

    try {
      const response = await fetch(
        `/api/posts?category=${props.category}&limit=${props.limit}`
      );
      const posts = await response.json();

      return {
        props: {
          ...props,
          posts,  // Add fetched data to props
        },
        readOnly: {
          posts: true,  // Make posts field read-only
        },
      };
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return {
        props: {
          ...props,
          posts: [],
          error: "Failed to load posts",
        },
      };
    }
  },

  render: ({ posts, category, limit, error, puck }) => {
    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!posts || posts.length === 0) {
      return <div className="empty">No posts found</div>;
    }

    return (
      <div>
        <h2>{category} Posts</h2>
        {posts.map((post: any) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <a href={`/posts/${post.slug}`}>Read more</a>
          </article>
        ))}
      </div>
    );
  },
};
```

**Parameters:**
- `data.props` - Current component props
- `data.lastData` - Props from last resolveData run
- `params.changed` - Object indicating which props changed
- `params.lastFields` - Fields from previous resolveFields

**Return Value:**
```typescript
{
  props: Record<string, any>,  // Updated props
  readOnly?: Record<string, boolean>,  // Mark fields as read-only
}
```

### resolveFields - Dynamic Fields

`resolveFields` allows fields to change based on current props.

```typescript
const ConditionalWidget: ComponentConfig = {
  fields: {
    contentType: {
      type: "select",
      label: "Content Type",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
        { label: "Embed", value: "embed" },
      ],
    },
  },

  defaultProps: {
    contentType: "image",
  },

  resolveFields: async ({ props }, { fields }) => {
    const baseFields = {
      contentType: fields.contentType,  // Always keep contentType
    };

    if (props.contentType === "image") {
      return {
        ...baseFields,
        imageUrl: { type: "text", label: "Image URL" },
        altText: { type: "text", label: "Alt Text" },
        objectFit: {
          type: "select",
          label: "Object Fit",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
          ],
        },
      };
    }

    if (props.contentType === "video") {
      return {
        ...baseFields,
        videoUrl: { type: "text", label: "Video URL" },
        autoplay: {
          type: "radio",
          label: "Autoplay",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        controls: {
          type: "radio",
          label: "Show Controls",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      };
    }

    if (props.contentType === "embed") {
      return {
        ...baseFields,
        embedCode: { type: "textarea", label: "Embed Code" },
      };
    }

    return baseFields;
  },

  render: ({ contentType, imageUrl, altText, objectFit, videoUrl, autoplay, controls, embedCode }) => {
    if (contentType === "image") {
      return <img src={imageUrl} alt={altText} style={{ objectFit }} />;
    }

    if (contentType === "video") {
      return <video src={videoUrl} autoPlay={autoplay} controls={controls} />;
    }

    if (contentType === "embed") {
      return <div dangerouslySetInnerHTML={{ __html: embedCode }} />;
    }

    return null;
  },
};
```

### resolvePermissions - Dynamic Permissions

Control what users can do with a component.

```typescript
const LockedWidget: ComponentConfig = {
  fields: {
    locked: {
      type: "radio",
      label: "Lock Component",
      options: [
        { label: "Unlocked", value: false },
        { label: "Locked", value: true },
      ],
    },
  },

  defaultProps: {
    locked: false,
  },

  resolvePermissions: async ({ props }) => {
    if (props.locked) {
      return {
        canDelete: false,
        canDuplicate: true,
        canInsert: false,
      };
    }

    return {
      canDelete: true,
      canDuplicate: true,
      canInsert: true,
    };
  },

  render: ({ locked }) => (
    <div>
      {locked ? "🔒 Locked" : "🔓 Unlocked"}
    </div>
  ),
};
```

---

## Custom Fields

Create fully custom field UIs with the `custom` field type.

### Color Picker Example

```typescript
const ColorPicker: ComponentConfig = {
  fields: {
    backgroundColor: {
      type: "custom",
      label: "Background Color",
      render: ({ value, onChange, name, id, readOnly }) => {
        return (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="color"
              value={value || "#ffffff"}
              onChange={(e) => onChange(e.target.value)}
              disabled={readOnly}
              style={{ width: "50px", height: "38px" }}
            />
            <input
              type="text"
              value={value || "#ffffff"}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#ffffff"
              disabled={readOnly}
              style={{ flex: 1 }}
            />
          </div>
        );
      },
    },
  },

  defaultProps: {
    backgroundColor: "#ffffff",
  },

  render: ({ backgroundColor }) => (
    <div style={{ backgroundColor, padding: "2rem", minHeight: "100px" }}>
      Content with custom background
    </div>
  ),
};
```

### Rich Text Editor Example

```typescript
{
  content: {
    type: "custom",
    label: "Content",
    render: ({ value, onChange }) => {
      // You could integrate TinyMCE, Quill, etc.
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      );
    },
  }
}
```

### Image Upload Example

```typescript
{
  image: {
    type: "custom",
    label: "Image",
    render: ({ value, onChange }) => {
      const [uploading, setUploading] = React.useState(false);

      const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/v1/storage/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          onChange(data.url);
        } catch (error) {
          console.error("Upload failed:", error);
        } finally {
          setUploading(false);
        }
      };

      return (
        <div>
          {value && <img src={value} alt="Preview" style={{ maxWidth: "200px" }} />}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading && <span>Uploading...</span>}
        </div>
      );
    },
  }
}
```

---

## Interactive Widgets

### Form Widget with Submission

```typescript
const ContactForm: ComponentConfig = {
  fields: {
    title: { type: "text", label: "Form Title" },
    submitUrl: { type: "text", label: "Submit URL" },
    successMessage: { type: "text", label: "Success Message" },
    fields: {
      type: "array",
      label: "Form Fields",
      arrayFields: {
        name: { type: "text", label: "Field Name" },
        label: { type: "text", label: "Field Label" },
        type: {
          type: "select",
          label: "Field Type",
          options: [
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Tel", value: "tel" },
            { label: "Textarea", value: "textarea" },
          ],
        },
        required: {
          type: "radio",
          label: "Required",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        placeholder: { type: "text", label: "Placeholder" },
      },
      getItemSummary: (item) => item.label || item.name,
    },
    buttonText: { type: "text", label: "Button Text" },
  },

  defaultProps: {
    title: "Contact Us",
    submitUrl: "/api/contact",
    successMessage: "Thank you! We'll be in touch soon.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
      { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Your message..." },
    ],
    buttonText: "Submit",
  },

  render: ({ title, submitUrl, successMessage, fields, buttonText, puck }) => {
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");

    // Show placeholder in edit mode
    if (puck.isEditing) {
      return (
        <div style={{ padding: "2rem", background: "#f5f5f5", border: "1px dashed #ccc" }}>
          <h3>{title}</h3>
          <p>Form Preview ({fields.length} fields)</p>
          <ul>
            {fields.map((field, idx) => (
              <li key={idx}>{field.label} ({field.type})</li>
            ))}
          </ul>
        </div>
      );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);
      setError("");

      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch(submitUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Submission failed");

        setSubmitted(true);
      } catch (err) {
        setError("Failed to submit form. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    if (submitted) {
      return (
        <div style={{ padding: "2rem", background: "#d4edda", color: "#155724" }}>
          {successMessage}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2>{title}</h2>

        {fields.map((field, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>
              {field.label}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            )}
          </div>
        ))}

        {error && (
          <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.75rem 2rem",
            background: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : buttonText}
        </button>
      </form>
    );
  },
};
```

### Custom Script Widget

```typescript
const CustomScript: ComponentConfig = {
  fields: {
    scriptType: {
      type: "select",
      label: "Script Type",
      options: [
        { label: "Inline JavaScript", value: "inline" },
        { label: "External Script", value: "external" },
      ],
    },
    script: { type: "textarea", label: "Script Code" },
    externalUrl: { type: "text", label: "External URL" },
  },

  defaultProps: {
    scriptType: "inline",
    script: "console.log('Hello from custom script!');",
    externalUrl: "",
  },

  render: ({ scriptType, script, externalUrl, puck }) => {
    React.useEffect(() => {
      // IMPORTANT: Don't run scripts in edit mode (security + UX)
      if (puck.isEditing) return;

      if (scriptType === "inline" && script) {
        try {
          // Execute inline script
          new Function(script)();
        } catch (error) {
          console.error("Script execution error:", error);
        }
      } else if (scriptType === "external" && externalUrl) {
        // Load external script
        const scriptEl = document.createElement("script");
        scriptEl.src = externalUrl;
        scriptEl.async = true;
        document.body.appendChild(scriptEl);

        return () => {
          // Cleanup on unmount
          document.body.removeChild(scriptEl);
        };
      }
    }, [scriptType, script, externalUrl, puck.isEditing]);

    if (puck.isEditing) {
      return (
        <div style={{ padding: "1rem", background: "#fff3cd", border: "1px solid #ffc107" }}>
          ⚠️ Script Widget ({scriptType})
          <br />
          <small>Scripts only execute in preview mode</small>
        </div>
      );
    }

    return <div className="custom-script-container" data-script-type={scriptType} />;
  },
};
```

**Security Note**: Be careful with custom scripts. Always validate and sanitize user input, and consider:
- CSP (Content Security Policy) headers
- Sandboxing scripts in iframes
- Restricting script execution to admin users only

---

## Tab System

### ❌ WRONG APPROACH: Dynamic Config Switching

```typescript
// DON'T DO THIS - Breaks Puck's data model
const [activeTab, setActiveTab] = useState("content");
const config = useMemo(() => createConfigForTab(activeTab), [activeTab]);

<Puck config={config} data={data} />
```

**Why this breaks:**
- Puck expects consistent component structure
- Changing configs mid-session causes widgets to disappear
- Data model gets out of sync with fields
- Props become undefined when fields "disappear"

### ✅ CORRECT APPROACH: UI-Level Filtering with Metadata

#### Step 1: Add Metadata to Fields

```typescript
// widget-config-v3.tsx
const Heading: ComponentConfig = {
  fields: {
    // Content fields
    text: {
      type: "text",
      label: "Text",
      metadata: { group: "content" },  // Add metadata
    },
    tag: {
      type: "select",
      label: "HTML Tag",
      options: [...],
      metadata: { group: "content" },
    },
    link: {
      type: "text",
      label: "Link",
      metadata: { group: "content" },
    },

    // Style fields
    align: {
      type: "radio",
      label: "Alignment",
      options: [...],
      metadata: { group: "style" },
    },
    fontSize: {
      type: "text",
      label: "Font Size",
      metadata: { group: "style" },
    },
    color: {
      type: "text",
      label: "Color",
      metadata: { group: "style" },
    },

    // Advanced fields
    customClass: {
      type: "text",
      label: "CSS Class",
      metadata: { group: "advanced" },
    },
    customCSS: {
      type: "textarea",
      label: "Custom CSS",
      metadata: { group: "advanced" },
    },
  },

  defaultProps: {
    text: "Heading",
    tag: "h2",
    link: "",
    align: "left",
    fontSize: "2rem",
    color: "#000000",
    customClass: "",
    customCSS: "",
  },

  render: (props) => { /* ... */ },
};
```

#### Step 2: Visual Grouping with CSS

```css
/* editor-overrides.css */

/* Group fields visually */
[data-field-group="content"] {
  order: 1;
}

[data-field-group="style"] {
  order: 2;
}

[data-field-group="advanced"] {
  order: 3;
}

/* Add separators between groups */
[data-field-group="style"]:first-of-type {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #374151;
}

[data-field-group="advanced"]:first-of-type {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #374151;
}

/* Group labels */
[data-field-group="content"]:first-of-type::before,
[data-field-group="style"]:first-of-type::before,
[data-field-group="advanced"]:first-of-type::before {
  content: attr(data-field-group);
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}
```

#### Step 3: Alternative - Accordion Groups

```typescript
// If you want collapsible sections
overrides={{
  fields: ({ children }) => {
    const [expandedGroups, setExpandedGroups] = useState({
      content: true,
      style: false,
      advanced: false,
    });

    // Group fields by metadata
    const groupedFields = {
      content: [],
      style: [],
      advanced: [],
    };

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const group = child.props?.field?.metadata?.group || "content";
        groupedFields[group].push(child);
      }
    });

    return (
      <div className="fields-panel">
        {Object.entries(groupedFields).map(([group, fields]) => (
          <div key={group} className="field-group">
            <button
              onClick={() => setExpandedGroups(prev => ({
                ...prev,
                [group]: !prev[group]
              }))}
              className="group-header"
            >
              {group.toUpperCase()}
              <ChevronIcon expanded={expandedGroups[group]} />
            </button>

            {expandedGroups[group] && (
              <div className="group-fields">
                {fields}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },
}}
```

---

## Best Practices

### 1. Always Use Flat Field Structure

```typescript
// ❌ BAD - Categorized structure
fields: {
  content: {
    text: { type: "text" },
  },
  style: {
    color: { type: "text" },
  },
}

// ✅ GOOD - Flat structure with metadata
fields: {
  text: { type: "text", metadata: { group: "content" } },
  color: { type: "text", metadata: { group: "style" } },
}
```

### 2. Initialize Slot Fields as Empty Arrays

```typescript
// ❌ BAD
defaultProps: {
  children: null,  // Will break
}

// ✅ GOOD
defaultProps: {
  children: [],  // Always use empty array
}
```

### 3. Use puck.isEditing for Interactive Widgets

```typescript
render: ({ puck, onClick }) => {
  // Don't trigger interactions in edit mode
  if (puck.isEditing) {
    return <div>Interactive Widget Preview</div>;
  }

  return <button onClick={onClick}>Click Me</button>;
}
```

### 4. Provide Meaningful Labels and Summaries

```typescript
{
  items: {
    type: "array",
    label: "Menu Items",
    getItemSummary: (item, index) => {
      // Show meaningful summary instead of "Item 1"
      return item.label || `Untitled Item ${index + 1}`;
    },
  }
}
```

### 5. Use TypeScript Properly

```typescript
import { ComponentConfig } from "@measured/puck";

type HeadingProps = {
  text: string;
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color: string;
};

const Heading: ComponentConfig<HeadingProps> = {
  fields: {
    text: { type: "text" },
    tag: {
      type: "select",
      options: [
        { label: "H1", value: "h1" },
        // ...
      ],
    },
    color: { type: "text" },
  },

  defaultProps: {
    text: "Heading",
    tag: "h2",
    color: "#000000",
  },

  render: ({ text, tag, color }) => {
    const Tag = tag;
    return <Tag style={{ color }}>{text}</Tag>;
  },
};
```

### 6. Handle Loading States in resolveData

```typescript
resolveData: async ({ props }, { changed }) => {
  // Show loading state
  if (changed.category || changed.limit) {
    return {
      props: { ...props, loading: true, posts: [] }
    };
  }

  try {
    const posts = await fetchPosts(props.category, props.limit);
    return {
      props: { ...props, loading: false, posts, error: null }
    };
  } catch (error) {
    return {
      props: { ...props, loading: false, posts: [], error: error.message }
    };
  }
}
```

### 7. Performance Optimization

```typescript
// Memoize expensive renders
render: ({ items, settings }) => {
  const processedItems = React.useMemo(() => {
    return items.map(item => processItem(item, settings));
  }, [items, settings]);

  return (
    <div>
      {processedItems.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}
```

### 8. Security Best Practices

```typescript
// Sanitize HTML content
import DOMPurify from 'dompurify';

render: ({ htmlContent }) => {
  const sanitized = React.useMemo(() => {
    return DOMPurify.sanitize(htmlContent);
  }, [htmlContent]);

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

---

## Troubleshooting

### Issue: Widgets Disappear When Switching Tabs

**Cause**: Using dynamic config switching (createConfigForTab)

**Solution**: Always use fullConfig and filter at UI level

```typescript
// ❌ WRONG
const config = createConfigForTab(activeTab);
<Puck config={config} />

// ✅ CORRECT
<Puck config={fullConfig} />
// Filter fields in overrides.fields
```

### Issue: Slot Fields Don't Work

**Cause**: Incorrect defaultProps initialization

**Solution**: Initialize as empty array

```typescript
defaultProps: {
  children: [],  // Not null, not undefined
}
```

### Issue: Drag and Drop Broken

**Cause**: Manipulating Puck's children in overrides

**Solution**: Render children as-is, don't reorganize

```typescript
// ❌ BAD
components: ({ children }) => {
  const reordered = reorganizeByCategory(children);
  return <div>{reordered}</div>;
}

// ✅ GOOD
components: ({ children }) => {
  return <div className="components-list">{children}</div>;
}
```

### Issue: resolveData Not Running

**Cause**: Not returning changed data

**Solution**: Always return { props } from resolveData

```typescript
resolveData: async ({ props }) => {
  const data = await fetchData();

  // Must return this structure
  return {
    props: { ...props, data },
  };
}
```

### Issue: Custom Fields Not Saving

**Cause**: Not calling onChange

**Solution**: Always call onChange when value changes

```typescript
render: ({ value, onChange }) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}  // Must call onChange
    />
  );
}
```

---

## Widget Library

Complete widget examples for common use cases.

### 1. Heading

```typescript
export const Heading: ComponentConfig = {
  fields: {
    text: { type: "text", label: "Text", metadata: { group: "content" } },
    tag: {
      type: "select",
      label: "HTML Tag",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "H4", value: "h4" },
        { label: "H5", value: "h5" },
        { label: "H6", value: "h6" },
      ],
      metadata: { group: "content" },
    },
    link: { type: "text", label: "Link (optional)", metadata: { group: "content" } },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
      metadata: { group: "style" },
    },
    fontSize: { type: "text", label: "Font Size", metadata: { group: "style" } },
    fontWeight: { type: "text", label: "Font Weight", metadata: { group: "style" } },
    color: { type: "text", label: "Color", metadata: { group: "style" } },
    margin: { type: "text", label: "Margin", metadata: { group: "style" } },
    customClass: { type: "text", label: "CSS Class", metadata: { group: "advanced" } },
  },

  defaultProps: {
    text: "Heading Text",
    tag: "h2",
    link: "",
    align: "left",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#000000",
    margin: "0 0 1rem 0",
    customClass: "",
  },

  render: ({ text, tag, link, align, fontSize, fontWeight, color, margin, customClass }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    const styles = { textAlign: align, fontSize, fontWeight, color, margin };
    const heading = <Tag style={styles} className={customClass}>{text}</Tag>;

    if (link) {
      return <a href={link} style={{ textDecoration: "none", color: "inherit" }}>{heading}</a>;
    }

    return heading;
  },
};
```

### 2. Rich Text / Paragraph

```typescript
export const Text: ComponentConfig = {
  fields: {
    content: { type: "textarea", label: "Content", metadata: { group: "content" } },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
        { label: "Justify", value: "justify" },
      ],
      metadata: { group: "style" },
    },
    fontSize: { type: "text", label: "Font Size", metadata: { group: "style" } },
    lineHeight: { type: "text", label: "Line Height", metadata: { group: "style" } },
    color: { type: "text", label: "Color", metadata: { group: "style" } },
    margin: { type: "text", label: "Margin", metadata: { group: "style" } },
  },

  defaultProps: {
    content: "This is a text paragraph.",
    align: "left",
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#333333",
    margin: "0 0 1rem 0",
  },

  render: ({ content, align, fontSize, lineHeight, color, margin }) => (
    <p style={{ textAlign: align, fontSize, lineHeight, color, margin }}>
      {content}
    </p>
  ),
};
```

### 3. Button

```typescript
export const Button: ComponentConfig = {
  fields: {
    text: { type: "text", label: "Button Text", metadata: { group: "content" } },
    link: { type: "text", label: "Link", metadata: { group: "content" } },
    variant: {
      type: "select",
      label: "Variant",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Text", value: "text" },
      ],
      metadata: { group: "content" },
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      metadata: { group: "content" },
    },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
      metadata: { group: "style" },
    },
    backgroundColor: { type: "text", label: "Background Color", metadata: { group: "style" } },
    textColor: { type: "text", label: "Text Color", metadata: { group: "style" } },
    borderRadius: { type: "text", label: "Border Radius", metadata: { group: "style" } },
  },

  defaultProps: {
    text: "Click Me",
    link: "#",
    variant: "primary",
    size: "md",
    align: "left",
    backgroundColor: "",
    textColor: "",
    borderRadius: "0.5rem",
  },

  render: ({ text, link, variant, size, align, backgroundColor, textColor, borderRadius }) => {
    const variantStyles = {
      primary: { backgroundColor: backgroundColor || "#4F46E5", color: textColor || "white", border: "none" },
      secondary: { backgroundColor: backgroundColor || "#9333EA", color: textColor || "white", border: "none" },
      outline: { backgroundColor: "transparent", color: textColor || "#4F46E5", border: `2px solid ${backgroundColor || "#4F46E5"}` },
      text: { backgroundColor: "transparent", color: textColor || "#4F46E5", border: "none" },
    };

    const sizeStyles = {
      sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
      md: { padding: "0.75rem 1.5rem", fontSize: "1rem" },
      lg: { padding: "1rem 2rem", fontSize: "1.125rem" },
    };

    return (
      <div style={{ textAlign: align }}>
        <a
          href={link}
          style={{
            ...variantStyles[variant],
            ...sizeStyles[size],
            borderRadius,
            display: "inline-block",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {text}
        </a>
      </div>
    );
  },
};
```

### 4. Image

```typescript
export const Image: ComponentConfig = {
  fields: {
    src: { type: "text", label: "Image URL", metadata: { group: "content" } },
    alt: { type: "text", label: "Alt Text", metadata: { group: "content" } },
    link: { type: "text", label: "Link (optional)", metadata: { group: "content" } },
    objectFit: {
      type: "select",
      label: "Object Fit",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
      ],
      metadata: { group: "style" },
    },
    width: { type: "text", label: "Width", metadata: { group: "style" } },
    height: { type: "text", label: "Height", metadata: { group: "style" } },
    borderRadius: { type: "text", label: "Border Radius", metadata: { group: "style" } },
  },

  defaultProps: {
    src: "https://via.placeholder.com/800x400",
    alt: "Placeholder image",
    link: "",
    objectFit: "cover",
    width: "100%",
    height: "auto",
    borderRadius: "0",
  },

  render: ({ src, alt, link, objectFit, width, height, borderRadius }) => {
    const img = (
      <img
        src={src}
        alt={alt}
        style={{ objectFit, width, height, borderRadius, display: "block" }}
      />
    );

    if (link) {
      return <a href={link}>{img}</a>;
    }

    return img;
  },
};
```

### 5. Container (Slot)

```typescript
export const Container: ComponentConfig = {
  fields: {
    children: { type: "slot", label: "Content", metadata: { group: "content" } },
    maxWidth: { type: "text", label: "Max Width", metadata: { group: "style" } },
    padding: { type: "text", label: "Padding", metadata: { group: "style" } },
    margin: { type: "text", label: "Margin", metadata: { group: "style" } },
    backgroundColor: { type: "text", label: "Background Color", metadata: { group: "style" } },
    borderRadius: { type: "text", label: "Border Radius", metadata: { group: "style" } },
  },

  defaultProps: {
    children: [],
    maxWidth: "1200px",
    padding: "2rem",
    margin: "0 auto",
    backgroundColor: "transparent",
    borderRadius: "0",
  },

  render: ({ children, maxWidth, padding, margin, backgroundColor, borderRadius }) => (
    <div style={{ maxWidth, padding, margin, backgroundColor, borderRadius }}>
      {children}
    </div>
  ),
};
```

### 6. Columns (Multiple Slots)

```typescript
export const Columns: ComponentConfig = {
  fields: {
    columnCount: {
      type: "select",
      label: "Number of Columns",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
      metadata: { group: "content" },
    },
    gap: { type: "text", label: "Gap", metadata: { group: "style" } },
    column1: { type: "slot", label: "Column 1", metadata: { group: "content" } },
    column2: { type: "slot", label: "Column 2", metadata: { group: "content" } },
    column3: { type: "slot", label: "Column 3", metadata: { group: "content" } },
    column4: { type: "slot", label: "Column 4", metadata: { group: "content" } },
  },

  defaultProps: {
    columnCount: 2,
    gap: "1rem",
    column1: [],
    column2: [],
    column3: [],
    column4: [],
  },

  render: ({ column1, column2, column3, column4, columnCount, gap }) => {
    const columns = [column1, column2, column3, column4].slice(0, Number(columnCount));

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap,
        }}
      >
        {columns.map((Column, idx) => (
          <div key={idx}>{Column}</div>
        ))}
      </div>
    );
  },
};
```

### 7. Video Embed

```typescript
export const Video: ComponentConfig = {
  fields: {
    src: { type: "text", label: "Video URL", metadata: { group: "content" } },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      options: [
        { label: "16:9", value: "16/9" },
        { label: "4:3", value: "4/3" },
        { label: "1:1", value: "1/1" },
      ],
      metadata: { group: "style" },
    },
    width: { type: "text", label: "Width", metadata: { group: "style" } },
  },

  defaultProps: {
    src: "",
    aspectRatio: "16/9",
    width: "100%",
  },

  render: ({ src, aspectRatio, width }) => (
    <div
      style={{
        position: "relative",
        paddingBottom: `calc(100% / (${aspectRatio}))`,
        height: 0,
        width,
      }}
    >
      <iframe
        src={src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  ),
};
```

### 8. Spacer

```typescript
export const Spacer: ComponentConfig = {
  fields: {
    height: { type: "text", label: "Height", metadata: { group: "content" } },
    backgroundColor: { type: "text", label: "Background Color (optional)", metadata: { group: "style" } },
  },

  defaultProps: {
    height: "2rem",
    backgroundColor: "transparent",
  },

  render: ({ height, backgroundColor }) => (
    <div style={{ height, backgroundColor }} />
  ),
};
```

### 9. Divider

```typescript
export const Divider: ComponentConfig = {
  fields: {
    style: {
      type: "select",
      label: "Style",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
        { label: "Dotted", value: "dotted" },
      ],
      metadata: { group: "content" },
    },
    color: { type: "text", label: "Color", metadata: { group: "style" } },
    thickness: { type: "text", label: "Thickness", metadata: { group: "style" } },
    margin: { type: "text", label: "Margin", metadata: { group: "style" } },
  },

  defaultProps: {
    style: "solid",
    color: "#e5e7eb",
    thickness: "1px",
    margin: "1rem 0",
  },

  render: ({ style, color, thickness, margin }) => (
    <hr
      style={{
        border: "none",
        borderTop: `${thickness} ${style} ${color}`,
        margin,
      }}
    />
  ),
};
```

---

## Summary

This guide covers everything you need to know about creating Puck widgets:

1. **Widget Structure**: ComponentConfig with fields, defaultProps, and render
2. **Field Types**: 10 built-in types from text to slot
3. **Slot Fields**: Container patterns for nested content
4. **Dynamic Widgets**: resolveData, resolveFields, resolvePermissions
5. **Custom Fields**: Fully custom field UIs
6. **Interactive Widgets**: Forms, scripts, and user interactions
7. **Tab System**: Use metadata + UI filtering, NOT config switching
8. **Best Practices**: Flat fields, TypeScript, security, performance
9. **Troubleshooting**: Common issues and solutions
10. **Widget Library**: Complete examples for 9+ widgets

Remember: **Always use fullConfig and filter at the UI level with metadata**. Never switch configs dynamically.

For questions or issues, refer to:
- Official Puck docs: https://puck.dev
- TypeScript definitions: `node_modules/@measured/puck/dist/*.d.ts`
- This project's CLAUDE.md for integration details
