"use client";
import { Slider, ColorPicker } from "./BaseControls";

export interface BoxShadowValue {
  offsetX?: string;
  offsetY?: string;
  blur?: string;
  spread?: string;
  color?: string;
}

interface BoxShadowControlProps {
  value: BoxShadowValue;
  onChange: (value: BoxShadowValue) => void;
}

export const BoxShadowControl = ({ value, onChange }: BoxShadowControlProps) => {
  const parseValue = (val: string = "0px") => {
    return parseFloat(val) || 0;
  };

  return (
    <div className="space-y-3">
      <Slider
        label="Offset X"
        value={parseValue(value.offsetX)}
        onChange={(v) => onChange({ ...value, offsetX: `${v}px` })}
        min={-50}
        max={50}
        step={1}
        unit="px"
      />

      <Slider
        label="Offset Y"
        value={parseValue(value.offsetY)}
        onChange={(v) => onChange({ ...value, offsetY: `${v}px` })}
        min={-50}
        max={50}
        step={1}
        unit="px"
      />

      <Slider
        label="Blur"
        value={parseValue(value.blur)}
        onChange={(v) => onChange({ ...value, blur: `${v}px` })}
        min={0}
        max={100}
        step={1}
        unit="px"
      />

      <Slider
        label="Spread"
        value={parseValue(value.spread)}
        onChange={(v) => onChange({ ...value, spread: `${v}px` })}
        min={-50}
        max={50}
        step={1}
        unit="px"
      />

      <ColorPicker
        label="Shadow Color"
        value={value.color || "rgba(0,0,0,0.1)"}
        onChange={(v) => onChange({ ...value, color: v })}
      />
    </div>
  );
};
