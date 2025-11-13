"use client";
import { useNode } from "@craftjs/core";
import { ReactNode } from "react";
import { ContainerSettings } from "../../settings/ContainerSettings";

interface ContainerProps {
  children?: ReactNode;
  direction?: "row" | "column";
  gap?: string;
  justifyContent?: string;
  alignItems?: string;
  backgroundColor?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  minHeight?: string;
  className?: string;
}

export const Container = ({
  children,
  direction = "column",
  gap = "20px",
  justifyContent = "flex-start",
  alignItems = "stretch",
  backgroundColor = "transparent",
  padding = {},
  margin = {},
  borderWidth = "0px",
  borderStyle = "solid",
  borderColor = "#000000",
  borderRadius = "0px",
  minHeight,
  className = "",
}: ContainerProps) => {
  const {
    connectors: { connect },
  } = useNode();

  const paddingStyle = `${padding.top || "0px"} ${padding.right || "0px"} ${padding.bottom || "0px"} ${padding.left || "0px"}`;
  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  return (
    <div
      ref={(ref) => connect(ref)}
      className={`craft-container ${className}`}
      style={{
        display: "flex",
        flexDirection: direction,
        gap,
        justifyContent,
        alignItems,
        backgroundColor: backgroundColor || "#f9fafb",
        padding: paddingStyle || "20px",
        margin: marginStyle,
        border: `${borderWidth || "2px"} ${borderStyle} ${borderColor || "#e5e7eb"}`,
        borderRadius,
        minHeight: minHeight || "200px",
        width: "100%",
        position: "relative",
        transition: "all 0.2s ease",
      }}
    >
      {!children || (Array.isArray(children) && children.length === 0) ? (
        <div style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", width: "100%", padding: "40px" }}>
          Drop widgets here
        </div>
      ) : children}
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: {
    direction: "column",
    gap: "20px",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "transparent",
    padding: {},
    margin: {},
    borderWidth: "0px",
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: "0px",
  },
  related: {
    settings: ContainerSettings,
  },
  rules: {
    canMoveIn: (incomingNodes: any[]) => {
      // Container can accept any widget type, but validate the array
      return Array.isArray(incomingNodes) && incomingNodes.length > 0;
    },
    canMoveOut: () => true,
  },
  isCanvas: true,
};
