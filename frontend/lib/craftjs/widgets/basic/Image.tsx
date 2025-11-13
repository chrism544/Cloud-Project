"use client";
import { useNode } from "@craftjs/core";
import { ImageSettings } from "../../settings/ImageSettings";
import { dragDebugger } from "../../utils/dragDebug";

interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill" | "scale-down";
  borderRadius?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right";
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

const shadowMap = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

export const Image = ({
  src = "https://via.placeholder.com/400x300?text=Image",
  alt = "Image",
  width = "100%",
  height = "auto",
  objectFit = "cover",
  borderRadius = "0px",
  shadow = "none",
  align = "left",
  margin = {},
  className = "",
}: ImageProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const containerStyle: React.CSSProperties = {
    display: align === "center" ? "flex" : "block",
    justifyContent: align === "center" ? "center" : undefined,
    textAlign: align as any,
    margin: marginStyle,
  };

  const imageStyle: React.CSSProperties = {
    width,
    height,
    objectFit,
    borderRadius,
    boxShadow: shadowMap[shadow],
    display: "block",
    maxWidth: "100%",
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      style={containerStyle}
      className={`craft-image ${className}`}
    >
      <img src={src} alt={alt} style={imageStyle} />
    </div>
  );
};

Image.craft = {
  displayName: "Image",
  props: {
    src: "https://via.placeholder.com/400x300?text=Image",
    alt: "Image",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "0px",
    shadow: "none",
    align: "left",
    margin: {},
  },
  related: {
    settings: ImageSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
