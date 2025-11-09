import { Config } from "@measured/puck";
import { CSSProperties } from "react";

// Basic widget type definitions
type HeadingProps = {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align: "left" | "center" | "right";
};

type TextProps = {
  content: string;
  align: "left" | "center" | "right";
};

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
};

type ButtonProps = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline";
};

type SectionProps = {
  backgroundColor?: string;
  padding?: string;
};

type ColumnProps = {
  span: number;
};

type PostListProps = {
  limit: number;
  showExcerpt: boolean;
};

type FormProps = {
  title: string;
  submitLabel: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "textarea";
    required: boolean;
  }>;
};

type SliderProps = {
  autoplay: boolean;
  interval: number;
};

type TabsProps = {
  tabs: Array<{
    title: string;
    content: string;
  }>;
};

type HeroProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  alignment: "left" | "center" | "right";
};

type CounterProps = {
  targetNumber: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration: number;
};

type TestimonialProps = {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  rating?: number;
};

// Define all component props
export type ComponentProps = {
  Heading: HeadingProps;
  Text: TextProps;
  Image: ImageProps;
  Button: ButtonProps;
  Section: SectionProps;
  Column: ColumnProps;
  PostList: PostListProps;
  Form: FormProps;
  Slider: SliderProps;
  Tabs: TabsProps;
  Hero: HeroProps;
  Counter: CounterProps;
  Testimonial: TestimonialProps;
};

// Puck configuration
export const config: Config<ComponentProps> = {
  components: {
    Heading: {
      fields: {
        text: { type: "text", label: "Text" },
        level: {
          type: "select",
          label: "Level",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        align: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        text: "Heading",
        level: "h1",
        align: "left",
      },
      render: ({ text, level, align }) => {
        const Tag = level;
        const styles: CSSProperties = {
          textAlign: align,
          margin: "0 0 1rem 0",
        };

        const sizeMap = {
          h1: "2.5rem",
          h2: "2rem",
          h3: "1.75rem",
          h4: "1.5rem",
          h5: "1.25rem",
          h6: "1rem",
        };

        return (
          <Tag style={{ ...styles, fontSize: sizeMap[level] }}>
            {text}
          </Tag>
        );
      },
    },

    Text: {
      fields: {
        content: { type: "textarea", label: "Content" },
        align: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        content: "This is a text block.",
        align: "left",
      },
      render: ({ content, align }) => (
        <p style={{ textAlign: align, margin: "0 0 1rem 0", lineHeight: 1.6 }}>
          {content}
        </p>
      ),
    },

    Image: {
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        width: { type: "number", label: "Width (%)" },
      },
      defaultProps: {
        src: "https://via.placeholder.com/800x400",
        alt: "Placeholder image",
        width: 100,
      },
      render: ({ src, alt, width = 100 }) => (
        <img
          src={src}
          alt={alt}
          style={{
            width: `${width}%`,
            height: "auto",
            display: "block",
            margin: "0 0 1rem 0",
          }}
        />
      ),
    },

    Button: {
      fields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "Link URL" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
      },
      defaultProps: {
        label: "Click me",
        href: "#",
        variant: "primary",
      },
      render: ({ label, href, variant }) => {
        const variantStyles: Record<typeof variant, CSSProperties> = {
          primary: {
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
          },
          secondary: {
            backgroundColor: "#9333EA",
            color: "white",
            border: "none",
          },
          outline: {
            backgroundColor: "transparent",
            color: "#4F46E5",
            border: "2px solid #4F46E5",
          },
        };

        return (
          <a
            href={href}
            style={{
              ...variantStyles[variant],
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: 600,
              cursor: "pointer",
              margin: "0 0 1rem 0",
            }}
          >
            {label}
          </a>
        );
      },
    },

    Section: {
      fields: {
        backgroundColor: { type: "text", label: "Background Color" },
        padding: { type: "text", label: "Padding" },
      },
      defaultProps: {
        backgroundColor: "#f9fafb",
        padding: "2rem",
      },
      render: ({ backgroundColor, padding, puck }) => (
        <section
          style={{
            backgroundColor,
            padding,
            margin: "0 0 1rem 0",
          }}
        >
          {puck.renderDropZone({ zone: "section-content" }) as any}
        </section>
      ),
    },

    Column: {
      fields: {
        span: {
          type: "select",
          label: "Column Span",
          options: [
            { label: "1/4", value: 3 },
            { label: "1/3", value: 4 },
            { label: "1/2", value: 6 },
            { label: "2/3", value: 8 },
            { label: "3/4", value: 9 },
            { label: "Full", value: 12 },
          ],
        },
      },
      defaultProps: {
        span: 6,
      },
      render: ({ span, puck }) => (
        <div
          style={{
            flex: `0 0 ${(span / 12) * 100}%`,
            maxWidth: `${(span / 12) * 100}%`,
            padding: "0 0.5rem",
          }}
        >
          {puck.renderDropZone({ zone: "column-content" }) as any}
        </div>
      ),
    },

    PostList: {
      fields: {
        limit: { type: "number", label: "Number of Posts" },
        showExcerpt: { type: "radio", label: "Show Excerpt", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]},
      },
      defaultProps: {
        limit: 3,
        showExcerpt: true,
      },
      render: ({ limit, showExcerpt }) => (
        <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", margin: "0 0 1rem 0" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Latest Posts</h3>
          {[...Array(limit)].map((_, i) => (
            <div key={i} style={{ padding: "1rem", backgroundColor: "white", borderRadius: "0.5rem", marginBottom: "0.75rem", border: "1px solid #e5e7eb" }}>
              <h4 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Post Title {i + 1}</h4>
              {showExcerpt && <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>This is a sample excerpt for post {i + 1}. In production, this would pull real data from your CMS.</p>}
            </div>
          ))}
        </div>
      ),
    },

    Form: {
      fields: {
        title: { type: "text", label: "Form Title" },
        submitLabel: { type: "text", label: "Submit Button Label" },
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
                { label: "Textarea", value: "textarea" },
              ],
            },
            required: { type: "radio", label: "Required", options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]},
          },
          defaultItemProps: {
            name: "field",
            label: "Field Label",
            type: "text" as const,
            required: false,
          },
        },
      },
      defaultProps: {
        title: "Contact Form",
        submitLabel: "Submit",
        fields: [
          { name: "name", label: "Name", type: "text" as const, required: true },
          { name: "email", label: "Email", type: "email" as const, required: true },
          { name: "message", label: "Message", type: "textarea" as const, required: true },
        ],
      },
      render: ({ title, submitLabel, fields }) => (
        <div style={{ padding: "2rem", backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", margin: "0 0 1rem 0" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>{title}</h3>
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {fields.map((field, i) => (
              <div key={i}>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              {submitLabel}
            </button>
          </form>
        </div>
      ),
    },

    Slider: {
      fields: {
        autoplay: { type: "radio", label: "Autoplay", options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]},
        interval: { type: "number", label: "Autoplay Interval (ms)" },
      },
      defaultProps: {
        autoplay: true,
        interval: 5000,
      },
      render: ({ autoplay, interval, puck }) => (
        <div style={{ position: "relative", backgroundColor: "#1f2937", color: "white", borderRadius: "0.5rem", overflow: "hidden", margin: "0 0 1rem 0" }}>
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Slide Content</h3>
            <p style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>Drag and drop content into the slide zone below</p>
            {puck.renderDropZone({ zone: "slide-content" }) as any}
          </div>
          <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: i === 1 ? "white" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
          {autoplay && (
            <div style={{ fontSize: "0.75rem", padding: "0.5rem", backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: "0.5rem", right: "0.5rem", borderRadius: "0.25rem" }}>
              Auto-play: {interval}ms
            </div>
          )}
        </div>
      ),
    },

    Tabs: {
      fields: {
        tabs: {
          type: "array",
          label: "Tabs",
          arrayFields: {
            title: { type: "text", label: "Tab Title" },
            content: { type: "textarea", label: "Tab Content" },
          },
          defaultItemProps: {
            title: "Tab",
            content: "Tab content goes here...",
          },
        },
      },
      defaultProps: {
        tabs: [
          { title: "Tab 1", content: "Content for tab 1" },
          { title: "Tab 2", content: "Content for tab 2" },
          { title: "Tab 3", content: "Content for tab 3" },
        ],
      },
      render: ({ tabs }) => (
        <div style={{ margin: "0 0 1rem 0" }}>
          <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", gap: "0.5rem" }}>
            {tabs.map((tab, i) => (
              <button
                key={i}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: i === 0 ? "#4F46E5" : "transparent",
                  color: i === 0 ? "white" : "#6b7280",
                  border: "none",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div style={{ padding: "1.5rem", backgroundColor: "white", border: "1px solid #e5e7eb", borderTop: "none", borderBottomLeftRadius: "0.5rem", borderBottomRightRadius: "0.5rem" }}>
            <p style={{ lineHeight: "1.6" }}>{tabs[0]?.content}</p>
          </div>
        </div>
      ),
    },

    Hero: {
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        backgroundImage: { type: "text", label: "Background Image URL" },
        ctaText: { type: "text", label: "CTA Button Text" },
        ctaLink: { type: "text", label: "CTA Button Link" },
        alignment: {
          type: "radio",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        title: "Welcome to Our Platform",
        subtitle: "Build amazing experiences with our powerful tools",
        backgroundImage: "",
        ctaText: "Get Started",
        ctaLink: "#",
        alignment: "center",
      },
      render: ({ title, subtitle, backgroundImage, ctaText, ctaLink, alignment }) => (
        <div
          style={{
            position: "relative",
            padding: "6rem 2rem",
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            textAlign: alignment,
            margin: "0 0 1rem 0",
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: alignment === "center" ? "0 auto" : "0" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
              {title}
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.95, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              {subtitle}
            </p>
            {ctaText && (
              <a
                href={ctaLink}
                style={{
                  display: "inline-block",
                  padding: "1rem 2rem",
                  backgroundColor: "white",
                  color: "#667eea",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "1.125rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      ),
    },

    Counter: {
      fields: {
        targetNumber: { type: "number", label: "Target Number" },
        label: { type: "text", label: "Label" },
        prefix: { type: "text", label: "Prefix (e.g., $)" },
        suffix: { type: "text", label: "Suffix (e.g., +)" },
        duration: { type: "number", label: "Animation Duration (ms)" },
      },
      defaultProps: {
        targetNumber: 1000,
        label: "Happy Customers",
        prefix: "",
        suffix: "+",
        duration: 2000,
      },
      render: ({ targetNumber, label, prefix, suffix }) => (
        <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", margin: "0 0 1rem 0" }}>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#4F46E5", marginBottom: "0.5rem" }}>
            {prefix}{targetNumber.toLocaleString()}{suffix}
          </div>
          <div style={{ fontSize: "1.125rem", color: "#6b7280", fontWeight: "500" }}>
            {label}
          </div>
        </div>
      ),
    },

    Testimonial: {
      fields: {
        quote: { type: "textarea", label: "Quote" },
        author: { type: "text", label: "Author Name" },
        role: { type: "text", label: "Author Role/Title" },
        avatarUrl: { type: "text", label: "Avatar Image URL" },
        rating: { type: "number", label: "Rating (1-5)" },
      },
      defaultProps: {
        quote: "This platform has transformed the way we work. Highly recommended!",
        author: "John Doe",
        role: "CEO, Acme Corp",
        avatarUrl: "",
        rating: 5,
      },
      render: ({ quote, author, role, avatarUrl, rating }) => (
        <div style={{ padding: "2rem", backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", margin: "0 0 1rem 0" }}>
          {rating && rating > 0 && (
            <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < rating ? "#fbbf24" : "#e5e7eb", fontSize: "1.25rem" }}>★</span>
              ))}
            </div>
          )}
          <blockquote style={{ fontSize: "1.125rem", lineHeight: "1.75", color: "#374151", fontStyle: "italic", marginBottom: "1.5rem", borderLeft: "4px solid #4F46E5", paddingLeft: "1rem" }}>
            "{quote}"
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {avatarUrl && (
              <img src={avatarUrl} alt={author} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
            )}
            <div>
              <div style={{ fontWeight: "600", color: "#111827" }}>{author}</div>
              {role && <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{role}</div>}
            </div>
          </div>
        </div>
      ),
    },
  },
};
