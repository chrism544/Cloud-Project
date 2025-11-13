"use client";
import React from "react";
import { FiltersValue } from "../utils/cssGenerator";

interface FiltersControlProps {
  value?: FiltersValue;
  onChange: (value: FiltersValue) => void;
  label?: string;
}

export const FiltersControl: React.FC<FiltersControlProps> = ({
  value = {},
  onChange,
  label = "Filters",
}) => {
  const handleChange = (field: keyof FiltersValue, newValue: number) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Blur */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Blur</label>
          <span className="text-xs text-gray-500">{value.blur || 0}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={value.blur || 0}
          onChange={(e) => handleChange("blur", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Brightness */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Brightness</label>
          <span className="text-xs text-gray-500">{value.brightness || 100}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="1"
          value={value.brightness || 100}
          onChange={(e) => handleChange("brightness", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Contrast</label>
          <span className="text-xs text-gray-500">{value.contrast || 100}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="1"
          value={value.contrast || 100}
          onChange={(e) => handleChange("contrast", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Saturate */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Saturate</label>
          <span className="text-xs text-gray-500">{value.saturate || 100}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="1"
          value={value.saturate || 100}
          onChange={(e) => handleChange("saturate", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Hue Rotate */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Hue Rotate</label>
          <span className="text-xs text-gray-500">{value.hueRotate || 0}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={value.hueRotate || 0}
          onChange={(e) => handleChange("hueRotate", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Grayscale */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Grayscale</label>
          <span className="text-xs text-gray-500">{value.grayscale || 0}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={value.grayscale || 0}
          onChange={(e) => handleChange("grayscale", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Sepia */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Sepia</label>
          <span className="text-xs text-gray-500">{value.sepia || 0}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={value.sepia || 0}
          onChange={(e) => handleChange("sepia", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={() =>
          onChange({
            blur: 0,
            brightness: 100,
            contrast: 100,
            saturate: 100,
            hueRotate: 0,
            grayscale: 0,
            sepia: 0,
          })
        }
        className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};
