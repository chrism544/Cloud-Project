"use client";
import { useNode } from "@craftjs/core";
import { IconSettings } from "../../settings/IconSettings";
import * as Icons from "lucide-react";
import { dragDebugger } from "../../utils/dragDebug";

interface IconProps {
  iconName?: string;
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl";
  iconColor?: string;
  backgroundColor?: string;
  backgroundShape?: "none" | "circle" | "square" | "rounded";
  backgroundSize?: string;
  padding?: string;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  align?: "left" | "center" | "right";
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

export const Icon = ({
  iconName = "Heart",
  iconSize = "md",
  iconColor = "#000000",
  backgroundColor = "transparent",
  backgroundShape = "none",
  backgroundSize = "40px",
  padding = "8px",
  margin = {},
  align = "left",
  className = "",
}: IconProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const IconComponent = (Icons as any)[iconName] || Icons.Heart;
  const size = sizeMap[iconSize];

  const getBackgroundStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor,
      padding,
    };

    if (backgroundShape === "circle") {
      return { ...base, borderRadius: "50%", width: backgroundSize, height: backgroundSize };
    } else if (backgroundShape === "square") {
      return { ...base, width: backgroundSize, height: backgroundSize };
    } else if (backgroundShape === "rounded") {
      return { ...base, borderRadius: "8px", width: backgroundSize, height: backgroundSize };
    }

    return base;
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
      className={`craft-icon ${className}`}
    >
      <div style={getBackgroundStyle()}>
        <IconComponent size={size} color={iconColor} />
      </div>
    </div>
  );
};

Icon.craft = {
  displayName: "Icon",
  props: {
    iconName: "Heart",
    iconSize: "md",
    iconColor: "#000000",
    backgroundColor: "transparent",
    backgroundShape: "none",
    backgroundSize: "40px",
    padding: "8px",
    margin: {},
    align: "left",
  },
  related: {
    settings: IconSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
