"use client";
import React, { useState } from "react";
import { BackgroundValue } from "../utils/cssGenerator";

interface BackgroundControlProps {
  value?: BackgroundValue;
  onChange: (value: BackgroundValue) => void;
  label?: string;
}

export const BackgroundControl: React.FC<BackgroundControlProps> = ({
  value = { type: "none" },
  onChange,
  label = "Background",
}) => {
  const [type, setType] = useState<BackgroundValue["type"]>(value.type);

  const handleTypeChange = (newType: BackgroundValue["type"]) => {
    setType(newType);

    if (newType === "none") {
      onChange({ type: "none" });
    } else if (newType === "color") {
      onChange({ type: "color", color: "#ffffff" });
    } else if (newType === "gradient") {
      onChange({
        type: "gradient",
        gradient: {
          type: "linear",
          angle: 180,
          stops: [
            { color: "#ff6cf8", position: 0 },
            { color: "#5636d1", position: 100 },
          ],
        },
      });
    } else if (newType === "image") {
      onChange({
        type: "image",
        image: {
          url: "",
          position: "center",
          size: "cover",
          repeat: "no-repeat",
          attachment: "scroll",
        },
      });
    } else if (newType === "video") {
      onChange({
        type: "video",
        video: {
          url: "",
          fallbackImage: "",
        },
      });
    }
  };

  const handleColorChange = (color: string) => {
    onChange({ type: "color", color });
  };

  const handleGradientChange = (updates: Partial<BackgroundValue["gradient"]>) => {
    if (value.type === "gradient" && value.gradient) {
      onChange({
        type: "gradient",
        gradient: { ...value.gradient, ...updates } as any,
      });
    }
  };

  const handleGradientStopChange = (index: number, field: "color" | "position", newValue: any) => {
    if (value.type === "gradient" && value.gradient?.stops) {
      const newStops = [...value.gradient.stops];
      newStops[index] = { ...newStops[index], [field]: newValue };
      handleGradientChange({ stops: newStops });
    }
  };

  const addGradientStop = () => {
    if (value.type === "gradient" && value.gradient?.stops) {
      const newStops = [
        ...value.gradient.stops,
        { color: "#000000", position: 50 },
      ];
      handleGradientChange({ stops: newStops });
    }
  };

  const removeGradientStop = (index: number) => {
    if (value.type === "gradient" && value.gradient?.stops && value.gradient.stops.length > 2) {
      const newStops = value.gradient.stops.filter((_, i) => i !== index);
      handleGradientChange({ stops: newStops });
    }
  };

  const handleImageChange = (updates: Partial<BackgroundValue["image"]>) => {
    if (value.type === "image" && value.image) {
      onChange({
        type: "image",
        image: { ...value.image, ...updates } as any,
      });
    }
  };

  const handleVideoChange = (updates: Partial<BackgroundValue["video"]>) => {
    if (value.type === "video" && value.video) {
      onChange({
        type: "video",
        video: { ...value.video, ...updates } as any,
      });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Type Selector */}
      <div className="grid grid-cols-5 gap-2">
        {(["none", "color", "gradient", "image", "video"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`px-3 py-2 text-xs rounded transition-colors ${
              type === t
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Color Picker */}
      {type === "color" && (
        <div className="space-y-2">
          <label className="block text-xs text-gray-400">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value.color || "#ffffff"}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value.color || "#ffffff"}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {/* Gradient Editor */}
      {type === "gradient" && value.gradient && (
        <div className="space-y-3">
          {/* Gradient Type */}
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">Gradient Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(["linear", "radial"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleGradientChange({ type: t })}
                  className={`px-3 py-2 text-xs rounded transition-colors ${
                    value.gradient?.type === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Angle (Linear only) */}
          {value.gradient.type === "linear" && (
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">
                Angle: {value.gradient.angle || 180}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={value.gradient.angle || 180}
                onChange={(e) =>
                  handleGradientChange({ angle: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs text-gray-400">Color Stops</label>
              <button
                type="button"
                onClick={addGradientStop}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add
              </button>
            </div>

            {value.gradient.stops.map((stop, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) =>
                    handleGradientStopChange(index, "color", e.target.value)
                  }
                  className="h-8 w-16 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) =>
                    handleGradientStopChange(index, "color", e.target.value)
                  }
                  className="flex-1 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) =>
                    handleGradientStopChange(
                      index,
                      "position",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-gray-500">%</span>
                {value.gradient?.stops && value.gradient.stops.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeGradientStop(index)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Settings */}
      {type === "image" && value.image && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">Image URL</label>
            <input
              type="text"
              value={value.image.url}
              onChange={(e) => handleImageChange({ url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Position</label>
              <select
                value={value.image.position}
                onChange={(e) => handleImageChange({ position: e.target.value })}
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

            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Size</label>
              <select
                value={value.image.size}
                onChange={(e) => handleImageChange({ size: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
                <option value="100% 100%">Stretch</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Repeat</label>
              <select
                value={value.image.repeat}
                onChange={(e) => handleImageChange({ repeat: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="no-repeat">No Repeat</option>
                <option value="repeat">Repeat</option>
                <option value="repeat-x">Repeat X</option>
                <option value="repeat-y">Repeat Y</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Attachment</label>
              <select
                value={value.image.attachment}
                onChange={(e) => handleImageChange({ attachment: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="scroll">Scroll</option>
                <option value="fixed">Fixed</option>
                <option value="local">Local</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Video Settings */}
      {type === "video" && value.video && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">Video URL</label>
            <input
              type="text"
              value={value.video.url}
              onChange={(e) => handleVideoChange({ url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/video.mp4"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-400">
              Fallback Image (optional)
            </label>
            <input
              type="text"
              value={value.video.fallbackImage || ""}
              onChange={(e) =>
                handleVideoChange({ fallbackImage: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/fallback.jpg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
