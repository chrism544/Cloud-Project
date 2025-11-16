"use client";
import { useNode } from "@craftjs/core";
import { ReactNode } from "react";
import { InnerSectionSettings } from "../../settings/InnerSectionSettings";

interface InnerSectionProps {
  children?: ReactNode;
  columnsGap?: string;
  backgroundColor?: string;
  padding?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

export const InnerSection = ({
  children,
  columnsGap = "20px",
  backgroundColor = "transparent",
  padding = {},
  className = "",
}: InnerSectionProps) => {
  const {
    connectors: { connect },
  } = useNode();

  const paddingStyle = `${padding.top || "20px"} ${padding.right || "0px"} ${padding.bottom || "20px"} ${padding.left || "0px"}`;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={`craft-inner-section ${className}`}
      style={{
        display: "flex",
        gap: columnsGap,
        backgroundColor,
        padding: paddingStyle,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

InnerSection.craft = {
  displayName: "Inner Section",
  props: {
    columnsGap: "20px",
    backgroundColor: "transparent",
    padding: { top: "20px", bottom: "20px" },
  },
  related: {
    settings: InnerSectionSettings,
  },
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  isCanvas: true,
};

