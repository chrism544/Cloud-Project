"use client";
import { TextInput, Label } from "./BaseControls";

export interface DimensionsValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface DimensionsControlProps {
  label?: string;
  value: DimensionsValue;
  onChange: (value: DimensionsValue) => void;
}

export const DimensionsControl = ({ label, value, onChange }: DimensionsControlProps) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            type="text"
            placeholder="Top"
            value={value.top || ""}
            onChange={(e) => onChange({ ...value, top: e.target.value })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Right"
            value={value.right || ""}
            onChange={(e) => onChange({ ...value, right: e.target.value })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Bottom"
            value={value.bottom || ""}
            onChange={(e) => onChange({ ...value, bottom: e.target.value })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Left"
            value={value.left || ""}
            onChange={(e) => onChange({ ...value, left: e.target.value })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Use px, %, rem, etc. Example: 10px</p>
    </div>
  );
};
