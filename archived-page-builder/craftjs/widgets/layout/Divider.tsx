"use client";
import { useNode } from "@craftjs/core";
import { DividerSettings } from "../../settings/DividerSettings";
import { dragDebugger } from "../../utils/dragDebug";

interface DividerProps {
  style?: "solid" | "dashed" | "dotted";
  width?: string;
  color?: string;
  thickness?: string;
  gap?: string;
  alignment?: "left" | "center" | "right";
  className?: string;
}

export const Divider = ({
  style = "solid",
  width = "100%",
  color = "#000000",
  thickness = "1px",
  gap = "10px",
  alignment = "center",
  className = "",
}: DividerProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      className={`craft-divider ${className}`}
      style={{
        textAlign: alignment,
        margin: `${gap} 0`,
        width: "100%",
      }}
    >
      <hr
        style={{
          borderStyle: style,
          width,
          borderColor: color,
          borderWidth: thickness,
          margin: 0,
          display: "inline-block",
        }}
      />
    </div>
  );
};

Divider.craft = {
  displayName: "Divider",
  props: {
    style: "solid",
    width: "100%",
    color: "#000000",
    thickness: "1px",
    gap: "10px",
    alignment: "center",
  },
  related: {
    settings: DividerSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
