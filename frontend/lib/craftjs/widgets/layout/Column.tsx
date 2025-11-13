"use client";
import { useNode } from "@craftjs/core";
import { ReactNode } from "react";
import { ColumnSettings } from "../../settings/ColumnSettings";

interface ColumnProps {
  children?: ReactNode;
  width?: string;
  verticalAlign?: "flex-start" | "center" | "flex-end" | "stretch";
  backgroundColor?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

export const Column = ({
  children,
  width = "auto",
  verticalAlign = "stretch",
  backgroundColor = "transparent",
  padding = {},
  className = "",
}: ColumnProps) => {
  const {
    connectors: { connect },
  } = useNode();

  const paddingStyle = `${padding.top || "0px"} ${padding.right || "0px"} ${padding.bottom || "0px"} ${padding.left || "0px"}`;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={`craft-column ${className}`}
      style={{
        flex: width,
        alignSelf: verticalAlign,
        backgroundColor,
        padding: paddingStyle || "20px",
        minHeight: "100px",
        cursor: "pointer",
      }}
    >
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
          Drop widgets here
        </div>
      ) : children}
    </div>
  );
};

Column.craft = {
  displayName: "Column",
  props: {
    width: "auto",
    verticalAlign: "stretch",
    backgroundColor: "transparent",
    padding: {},
  },
  related: {
    settings: ColumnSettings,
  },
  rules: {
    // Elementor-style: Only widgets (not Sections or Columns) can go inside Columns
    canMoveIn: (incomingNodes: any[]) => {
      return incomingNodes.every((node) =>
        node.data.name !== "Section" && node.data.name !== "Column"
      );
    },
    canMoveOut: () => true,
  },
  isCanvas: true,
};

