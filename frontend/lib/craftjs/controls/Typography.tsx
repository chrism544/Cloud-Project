"use client";
import { Select, Slider, ColorPicker } from "./BaseControls";

export interface TypographyValue {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  textDecoration?: string;
  fontStyle?: string;
  color?: string;
}

interface TypographyControlProps {
  value: TypographyValue;
  onChange: (value: TypographyValue) => void;
  showColor?: boolean;
}

export const TypographyControl = ({ value, onChange, showColor = true }: TypographyControlProps) => {
  const fontFamilies = [
    { label: "System", value: "system-ui, sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Courier", value: "'Courier New', monospace" },
  ];

  const fontWeights = [
    { label: "Light", value: "300" },
    { label: "Normal", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semibold", value: "600" },
    { label: "Bold", value: "700" },
  ];

  const textTransforms = [
    { label: "None", value: "none" },
    { label: "Uppercase", value: "uppercase" },
    { label: "Lowercase", value: "lowercase" },
    { label: "Capitalize", value: "capitalize" },
  ];

  const textDecorations = [
    { label: "None", value: "none" },
    { label: "Underline", value: "underline" },
    { label: "Line Through", value: "line-through" },
  ];

  const fontStyles = [
    { label: "Normal", value: "normal" },
    { label: "Italic", value: "italic" },
  ];

  const parseFontSize = (fontSize: string = "16px") => {
    return parseFloat(fontSize) || 16;
  };

  const parseLineHeight = (lineHeight: string = "1.5") => {
    return parseFloat(lineHeight) || 1.5;
  };

  const parseLetterSpacing = (letterSpacing: string = "0px") => {
    return parseFloat(letterSpacing) || 0;
  };

  return (
    <div className="space-y-3">
      <Select
        label="Font Family"
        value={value.fontFamily || fontFamilies[0].value}
        onChange={(v) => onChange({ ...value, fontFamily: v })}
        options={fontFamilies}
      />

      <Slider
        label="Font Size"
        value={parseFontSize(value.fontSize)}
        onChange={(v) => onChange({ ...value, fontSize: `${v}px` })}
        min={8}
        max={72}
        step={1}
        unit="px"
      />

      <Select
        label="Font Weight"
        value={value.fontWeight || "400"}
        onChange={(v) => onChange({ ...value, fontWeight: v })}
        options={fontWeights}
      />

      <Slider
        label="Line Height"
        value={parseLineHeight(value.lineHeight)}
        onChange={(v) => onChange({ ...value, lineHeight: v.toString() })}
        min={0.5}
        max={3}
        step={0.1}
      />

      <Slider
        label="Letter Spacing"
        value={parseLetterSpacing(value.letterSpacing)}
        onChange={(v) => onChange({ ...value, letterSpacing: `${v}px` })}
        min={-5}
        max={10}
        step={0.5}
        unit="px"
      />

      <Select
        label="Transform"
        value={value.textTransform || "none"}
        onChange={(v) => onChange({ ...value, textTransform: v })}
        options={textTransforms}
      />

      <Select
        label="Decoration"
        value={value.textDecoration || "none"}
        onChange={(v) => onChange({ ...value, textDecoration: v })}
        options={textDecorations}
      />

      <Select
        label="Style"
        value={value.fontStyle || "normal"}
        onChange={(v) => onChange({ ...value, fontStyle: v })}
        options={fontStyles}
      />

      {showColor && (
        <ColorPicker
          label="Color"
          value={value.color || "#000000"}
          onChange={(v) => onChange({ ...value, color: v })}
        />
      )}
    </div>
  );
};
