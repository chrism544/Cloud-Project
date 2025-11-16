"use client";
import { useNode } from "@craftjs/core";
import { ReactNode } from "react";
import { SectionSettings } from "../../settings/SectionSettings";

interface SectionProps {
  children?: ReactNode;
  contentWidth?: "boxed" | "full-width";
  height?: "default" | "fit-screen" | string;
  backgroundColor?: string;
  backgroundImage?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

export const Section = ({
  children,
  contentWidth = "boxed",
  height = "default",
  backgroundColor = "transparent",
  backgroundImage,
  padding = {},
  margin = {},
  className = "",
}: SectionProps) => {
  const {
    connectors: { connect },
  } = useNode();

  const paddingStyle = `${padding.top || "40px"} ${padding.right || "0px"} ${padding.bottom || "40px"} ${padding.left || "0px"}`;
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const sectionStyle: React.CSSProperties = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: paddingStyle,
    margin: marginStyle,
    minHeight: height === "fit-screen" ? "100vh" : height === "default" ? "auto" : height,
    width: "100%",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: contentWidth === "boxed" ? "1200px" : "100%",
    margin: "0 auto",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  };

  return (
    <section
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      style={sectionStyle}
      className={`craft-section ${className}`}
    >
      <div style={containerStyle}>
        {!children || (Array.isArray(children) && children.length === 0) ? (
          <div style={{
            color: "#9ca3af",
            fontSize: "14px",
            textAlign: "center",
            width: "100%",
            padding: "40px",
            border: "2px dashed #e5e7eb",
            borderRadius: "8px",
          }}>
            Drop columns here
          </div>
        ) : children}
      </div>
    </section>
  );
};

Section.craft = {
  displayName: "Section",
  props: {
    contentWidth: "boxed",
    height: "default",
    backgroundColor: "transparent",
    padding: { top: "40px", bottom: "40px" },
    margin: {},
  },
  related: {
    settings: SectionSettings,
  },
  rules: {
    // Elementor-style: Only Columns can go inside Sections
    canMoveIn: (incomingNodes: any[]) => {
      return incomingNodes.every((node) =>
        node.data.name === "Column" || node.data.name === "InnerSection"
      );
    },
    canMoveOut: () => true,
  },
  isCanvas: true,
};

