"use client";
import React from "react";
import { TransformValue } from "../utils/cssGenerator";

interface TransformControlProps {
  value?: TransformValue;
  onChange: (value: TransformValue) => void;
  label?: string;
}

export const TransformControl: React.FC<TransformControlProps> = ({
  value = {},
  onChange,
  label = "Transform",
}) => {
  const handleChange = (field: keyof TransformValue, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Rotate */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Rotate</label>
          <span className="text-xs text-gray-500">{value.rotate || 0}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          value={value.rotate || 0}
          onChange={(e) => handleChange("rotate", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Rotate X */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Rotate X</label>
          <span className="text-xs text-gray-500">{value.rotateX || 0}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          value={value.rotateX || 0}
          onChange={(e) => handleChange("rotateX", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Rotate Y */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Rotate Y</label>
          <span className="text-xs text-gray-500">{value.rotateY || 0}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          value={value.rotateY || 0}
          onChange={(e) => handleChange("rotateY", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Scale */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Scale</label>
          <span className="text-xs text-gray-500">{value.scale || 1}</span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={value.scale || 1}
          onChange={(e) => handleChange("scale", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Scale X */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Scale X</label>
          <span className="text-xs text-gray-500">{value.scaleX || 1}</span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={value.scaleX || 1}
          onChange={(e) => handleChange("scaleX", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Scale Y */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Scale Y</label>
          <span className="text-xs text-gray-500">{value.scaleY || 1}</span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={value.scaleY || 1}
          onChange={(e) => handleChange("scaleY", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Skew X */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Skew X</label>
          <span className="text-xs text-gray-500">{value.skewX || 0}°</span>
        </div>
        <input
          type="range"
          min="-45"
          max="45"
          value={value.skewX || 0}
          onChange={(e) => handleChange("skewX", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Skew Y */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-400">Skew Y</label>
          <span className="text-xs text-gray-500">{value.skewY || 0}°</span>
        </div>
        <input
          type="range"
          min="-45"
          max="45"
          value={value.skewY || 0}
          onChange={(e) => handleChange("skewY", parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Translate X */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Translate X</label>
        <input
          type="text"
          value={value.translateX || "0px"}
          onChange={(e) => handleChange("translateX", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          placeholder="0px"
        />
      </div>

      {/* Translate Y */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Translate Y</label>
        <input
          type="text"
          value={value.translateY || "0px"}
          onChange={(e) => handleChange("translateY", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
          placeholder="0px"
        />
      </div>

      {/* Transform Origin */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Transform Origin</label>
        <select
          value={value.origin || "center"}
          onChange={(e) => handleChange("origin", e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top left">Top Left</option>
          <option value="top right">Top Right</option>
          <option value="bottom left">Bottom Left</option>
          <option value="bottom right">Bottom Right</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={() =>
          onChange({
            rotate: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            translateX: "0px",
            translateY: "0px",
            origin: "center",
          })
        }
        className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
      >
        Reset Transform
      </button>
    </div>
  );
};
