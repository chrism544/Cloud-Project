"use client";
import { useNode, Element } from "@craftjs/core";
import { IconBoxSettings } from "../../settings/IconBoxSettings";
import * as Icons from "lucide-react";
import { dragDebugger } from "../../utils/dragDebug";

interface IconBoxProps {
  iconName?: string;
  iconSize?: "sm" | "md" | "lg";
  iconColor?: string;
  title?: string;
  description?: string;
  layout?: "vertical" | "horizontal";
  titleColor?: string;
  descriptionColor?: string;
  gap?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  backgroundColor?: string;
  borderRadius?: string;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  align?: "left" | "center" | "right";
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
};

export const IconBox = ({
  iconName = "Star",
  iconSize = "md",
  iconColor = "#000000",
  title = "Feature Title",
  description = "Feature description",
  layout = "vertical",
  titleColor = "#000000",
  descriptionColor = "#666666",
  gap = "12px",
  padding = { top: "16px", right: "16px", bottom: "16px", left: "16px" },
  backgroundColor = "#F9FAFB",
  borderRadius = "8px",
  margin = {},
  align = "left",
  className = "",
}: IconBoxProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const IconComponent = (Icons as any)[iconName] || Icons.Star;
  const size = sizeMap[iconSize];

  const paddingStyle = `${padding.top || "16px"} ${padding.right || "16px"} ${padding.bottom || "16px"} ${padding.left || "16px"}`;
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const containerStyle: React.CSSProperties = {
    display: layout === "vertical" ? "flex" : "flex",
    flexDirection: layout === "vertical" ? "column" : "row",
    alignItems: layout === "vertical" ? "flex-start" : "flex-start",
    gap,
    padding: paddingStyle,
    backgroundColor,
    borderRadius,
    margin: marginStyle,
    textAlign: align as any,
    width: "100%",
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      style={containerStyle}
      className={`craft-icon-box ${className}`}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconComponent size={size} color={iconColor} />
      </div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: titleColor,
            margin: "0 0 8px 0",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: descriptionColor,
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

IconBox.craft = {
  displayName: "Icon Box",
  props: {
    iconName: "Star",
    iconSize: "md",
    iconColor: "#000000",
    title: "Feature Title",
    description: "Feature description",
    layout: "vertical",
    titleColor: "#000000",
    descriptionColor: "#666666",
    gap: "12px",
    padding: { top: "16px", right: "16px", bottom: "16px", left: "16px" },
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    margin: {},
    align: "left",
  },
  related: {
    settings: IconBoxSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
