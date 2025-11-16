"use client";
import { Select, Slider, ColorPicker } from "./BaseControls";

export interface BorderValue {
  width?: string;
  style?: string;
  color?: string;
  radius?: string;
}

interface BorderControlProps {
  value: BorderValue;
  onChange: (value: BorderValue) => void;
}

export const BorderControl = ({ value, onChange }: BorderControlProps) => {
  const borderStyles = [
    { label: "None", value: "none" },
    { label: "Solid", value: "solid" },
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" },
    { label: "Double", value: "double" },
  ];

  const parseWidth = (width: string = "0px") => {
    return parseFloat(width) || 0;
  };

  const parseRadius = (radius: string = "0px") => {
    return parseFloat(radius) || 0;
  };

  return (
    <div className="space-y-3">
      <Slider
        label="Width"
        value={parseWidth(value.width)}
        onChange={(v) => onChange({ ...value, width: `${v}px` })}
        min={0}
        max={20}
        step={1}
        unit="px"
      />

      <Select
        label="Style"
        value={value.style || "solid"}
        onChange={(v) => onChange({ ...value, style: v })}
        options={borderStyles}
      />

      <ColorPicker
        label="Color"
        value={value.color || "#000000"}
        onChange={(v) => onChange({ ...value, color: v })}
      />

      <Slider
        label="Radius"
        value={parseRadius(value.radius)}
        onChange={(v) => onChange({ ...value, radius: `${v}px` })}
        min={0}
        max={50}
        step={1}
        unit="px"
      />
    </div>
  );
};
