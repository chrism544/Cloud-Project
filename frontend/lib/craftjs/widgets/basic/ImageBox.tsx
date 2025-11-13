"use client";
import { useNode } from "@craftjs/core";
import { ImageBoxSettings } from "../../settings/ImageBoxSettings";
import { dragDebugger } from "../../utils/dragDebug";

interface ImageBoxProps {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  showButton?: boolean;
  layout?: "vertical" | "horizontal";
  imagePosition?: "top" | "left" | "right";
  titleColor?: string;
  descriptionColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

export const ImageBox = ({
  imageSrc = "https://via.placeholder.com/400x300?text=Image",
  imageAlt = "Box Image",
  title = "Box Title",
  description = "Box description goes here",
  buttonText = "Learn More",
  buttonUrl = "#",
  showButton = false,
  layout = "vertical",
  imagePosition = "top",
  titleColor = "#000000",
  descriptionColor = "#666666",
  backgroundColor = "#FFFFFF",
  borderRadius = "8px",
  padding = { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  margin = {},
  className = "",
}: ImageBoxProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const paddingStyle = `${padding.top || "0px"} ${padding.right || "0px"} ${padding.bottom || "0px"} ${padding.left || "0px"}`;
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: layout === "vertical" ? "column" : imagePosition === "right" ? "row-reverse" : "row",
    backgroundColor,
    borderRadius,
    overflow: "hidden",
    margin: marginStyle,
    width: "100%",
  };

  const imageWrapperStyle: React.CSSProperties = {
    flex: layout === "vertical" ? undefined : 1,
    minHeight: "200px",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: "20px",
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      style={containerStyle}
      className={`craft-image-box ${className}`}
    >
      <div style={imageWrapperStyle}>
        <img src={imageSrc} alt={imageAlt} style={imageStyle} />
      </div>

      <div style={contentStyle}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: titleColor,
            margin: "0 0 12px 0",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: "0.875rem",
            color: descriptionColor,
            margin: "0 0 16px 0",
            lineHeight: "1.6",
          }}
        >
          {description}
        </p>

        {showButton && (
          <button
            onClick={() => buttonUrl && window.open(buttonUrl)}
            style={{
              backgroundColor: "#4F46E5",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.backgroundColor = "#4338CA";
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.backgroundColor = "#4F46E5";
              }
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

ImageBox.craft = {
  displayName: "Image Box",
  props: {
    imageSrc: "https://via.placeholder.com/400x300?text=Image",
    imageAlt: "Box Image",
    title: "Box Title",
    description: "Box description goes here",
    buttonText: "Learn More",
    buttonUrl: "#",
    showButton: false,
    layout: "vertical",
    imagePosition: "top",
    titleColor: "#000000",
    descriptionColor: "#666666",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    padding: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    margin: {},
  },
  related: {
    settings: ImageBoxSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
