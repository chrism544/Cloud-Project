"use client";
import { useNode } from "@craftjs/core";
import { TextSettings } from "../../settings/TextSettings";
import { TypographyValue } from "../../controls/Typography";
import { dragDebugger } from "../../utils/dragDebug";

interface TextProps {
  text?: string;
  align?: "left" | "center" | "right" | "justify";
  typography?: TypographyValue;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  backgroundColor?: string;
  lineHeight?: string;
  className?: string;
}

export const Text = ({
  text = "Your text here...",
  align = "left",
  typography = {},
  padding = {},
  margin = {},
  backgroundColor = "transparent",
  lineHeight = "1.5",
  className = "",
}: TextProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const paddingStyle = `${padding.top || "0px"} ${padding.right || "0px"} ${padding.bottom || "0px"} ${padding.left || "0px"}`;
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const textStyle: React.CSSProperties = {
    textAlign: align,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight,
    letterSpacing: typography.letterSpacing,
    textTransform: typography.textTransform as any,
    textDecoration: typography.textDecoration,
    fontStyle: typography.fontStyle as any,
    color: typography.color,
    padding: paddingStyle,
    margin: marginStyle,
    backgroundColor,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      className={`craft-text ${className}`}
    >
      <p style={textStyle}>{text}</p>
    </div>
  );
};

Text.craft = {
  displayName: "Text Editor",
  props: {
    text: "Your text here...",
    align: "left",
    typography: {
      fontSize: "1rem",
      fontWeight: "400",
      color: "#000000",
    },
    padding: {},
    margin: {},
    backgroundColor: "transparent",
    lineHeight: "1.5",
  },
  related: {
    settings: TextSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
