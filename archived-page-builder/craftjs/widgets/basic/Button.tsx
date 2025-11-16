"use client";
import { useNode } from "@craftjs/core";
import { ButtonSettings } from "../../settings/ButtonSettings";
import { dragDebugger } from "../../utils/dragDebug";

interface ButtonProps {
  text?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  borderRadius?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  align?: "left" | "center" | "right";
  className?: string;
}

const sizeMap = {
  sm: { fontSize: "0.875rem", padding: "0.5rem 1rem" },
  md: { fontSize: "1rem", padding: "0.75rem 1.5rem" },
  lg: { fontSize: "1.125rem", padding: "1rem 2rem" },
};

const variantMap = {
  primary: { bg: "#4F46E5", text: "#FFFFFF", hover: "#4338CA" },
  secondary: { bg: "#6B7280", text: "#FFFFFF", hover: "#4B5563" },
  outline: { bg: "transparent", text: "#4F46E5", hover: "#EEF2FF", border: "2px solid #4F46E5" },
};

export const Button = ({
  text = "Click me",
  href = "#",
  variant = "primary",
  size = "md",
  backgroundColor,
  textColor,
  hoverColor,
  borderRadius = "6px",
  padding,
  margin = {},
  align = "left",
  className = "",
}: ButtonProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const variantStyle = variantMap[variant];
  const sizeStyle = sizeMap[size];
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const buttonStyle: React.CSSProperties = {
    ...sizeStyle,
    backgroundColor: backgroundColor || variantStyle.bg,
    color: textColor || variantStyle.text,
    border: variantMap.outline.border && variant === "outline" ? variantMap.outline.border : "none",
    borderRadius,
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
    margin: marginStyle,
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      style={containerStyle}
      className={`craft-button ${className}`}
    >
      <button
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = hoverColor || variantStyle.hover;
          }
        }}
        onMouseLeave={(e) => {
          if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.backgroundColor = backgroundColor || variantStyle.bg;
          }
        }}
        onClick={() => href && window.open(href)}
      >
        {text}
      </button>
    </div>
  );
};

Button.craft = {
  displayName: "Button",
  props: {
    text: "Click me",
    href: "#",
    variant: "primary",
    size: "md",
    backgroundColor: "",
    textColor: "",
    hoverColor: "",
    borderRadius: "6px",
    padding: {},
    margin: {},
    align: "left",
  },
  related: {
    settings: ButtonSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
