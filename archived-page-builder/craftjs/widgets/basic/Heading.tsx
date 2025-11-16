"use client";
import { useNode } from "@craftjs/core";
import { HeadingSettings } from "../../settings/HeadingSettings";
import { TypographyValue } from "../../controls/Typography";
import { dragDebugger } from "../../utils/dragDebug";

interface HeadingProps {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  link?: string;
  align?: "left" | "center" | "right" | "justify";
  typography?: TypographyValue;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

export const Heading = ({
  text = "Heading",
  tag = "h2",
  link,
  align = "left",
  typography = {},
  margin = {},
  className = "",
}: HeadingProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const Tag = tag;
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const headingStyle: React.CSSProperties = {
    textAlign: align,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    textTransform: typography.textTransform as any,
    textDecoration: typography.textDecoration,
    fontStyle: typography.fontStyle as any,
    color: typography.color,
    margin: marginStyle,
  };

  const content = <Tag style={headingStyle}>{text}</Tag>;

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      className={`craft-heading ${className}`}
    >
      {link ? (
        <a href={link} style={{ textDecoration: "none", color: "inherit" }}>
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

Heading.craft = {
  displayName: "Heading",
  props: {
    text: "Heading",
    tag: "h2",
    link: "",
    align: "left",
    typography: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#000000",
    },
    margin: {},
  },
  related: {
    settings: HeadingSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
