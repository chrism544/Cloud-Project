"use client";
import { useNode } from "@craftjs/core";
import { SpacerSettings } from "../../settings/SpacerSettings";
import { dragDebugger } from "../../utils/dragDebug";

interface SpacerProps {
  height?: string;
  backgroundColor?: string;
  className?: string;
}

export const Spacer = ({
  height = "50px",
  backgroundColor = "transparent",
  className = "",
}: SpacerProps) => {
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
      className={`craft-spacer ${className}`}
      style={{
        height,
        backgroundColor,
        width: "100%",
      }}
    />
  );
};

Spacer.craft = {
  displayName: "Spacer",
  props: {
    height: "50px",
    backgroundColor: "transparent",
  },
  related: {
    settings: SpacerSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
