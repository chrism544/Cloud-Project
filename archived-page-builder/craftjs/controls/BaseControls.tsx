"use client";
import { ChangeEvent } from "react";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export const Label = ({ children, htmlFor }: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">
    {children}
  </label>
);

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "url" | "email";
}

export const TextInput = ({ label, value, onChange, placeholder, type = "text" }: TextInputProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  </div>
);

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}

export const Select = ({ label, value, onChange, options }: SelectProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const Slider = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = "" }: SliderProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <div className="flex items-center gap-3">
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <span className="text-sm text-gray-400 w-16 text-right">
        {value}{unit}
      </span>
    </div>
  </div>
);

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
      />
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="#000000"
      />
    </div>
  </div>
);

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const Textarea = ({ label, value, onChange, placeholder, rows = 4 }: TextareaProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
    />
  </div>
);

interface ToggleProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle = ({ label, value, onChange }: ToggleProps) => (
  <div className="flex items-center justify-between">
    {label && <Label>{label}</Label>}
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-indigo-600" : "bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);
