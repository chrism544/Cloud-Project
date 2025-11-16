"use client";
import React, { useState } from "react";
import { ResponsiveValue } from "../utils/cssGenerator";

interface ResponsiveControlProps {
  value?: ResponsiveValue;
  onChange: (value: ResponsiveValue) => void;
  label?: string;
}

export const ResponsiveControl: React.FC<ResponsiveControlProps> = ({
  value = {
    desktop: { visible: true },
    tablet: { visible: true },
    mobile: { visible: true },
  },
  onChange,
  label = "Responsive",
}) => {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const handleVisibilityChange = (
    device: "desktop" | "tablet" | "mobile",
    visible: boolean
  ) => {
    onChange({
      ...value,
      [device]: {
        ...value[device],
        visible,
      },
    });
  };

  const handleCustomCSSChange = (
    device: "desktop" | "tablet" | "mobile",
    customCSS: string
  ) => {
    onChange({
      ...value,
      [device]: {
        ...value[device],
        customCSS: customCSS || undefined,
      },
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Device Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {(["desktop", "tablet", "mobile"] as const).map((device) => (
          <button
            key={device}
            type="button"
            onClick={() => setActiveDevice(device)}
            className={`px-3 py-2 text-xs rounded transition-colors ${
              activeDevice === device
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {device === "desktop" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                )}
                {device === "tablet" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                )}
                {device === "mobile" && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                )}
              </svg>
              <span className="capitalize">{device}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Visibility Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">
            Visible on {activeDevice.charAt(0).toUpperCase() + activeDevice.slice(1)}
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value[activeDevice].visible}
              onChange={(e) => handleVisibilityChange(activeDevice, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500">
          {value[activeDevice].visible
            ? `Element will be visible on ${activeDevice} devices`
            : `Element will be hidden on ${activeDevice} devices`}
        </p>
      </div>

      {/* Breakpoint Info */}
      <div className="p-3 bg-gray-800 rounded border border-gray-700">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Breakpoint</h4>
        <div className="text-xs text-gray-500">
          {activeDevice === "desktop" && "≥ 1024px"}
          {activeDevice === "tablet" && "768px - 1023px"}
          {activeDevice === "mobile" && "< 768px"}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">
          Custom CSS for {activeDevice.charAt(0).toUpperCase() + activeDevice.slice(1)}
        </label>
        <textarea
          value={value[activeDevice].customCSS || ""}
          onChange={(e) => handleCustomCSSChange(activeDevice, e.target.value)}
          placeholder={`/* CSS for ${activeDevice} only */\ncolor: red;\nfont-size: 18px;`}
          className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-xs font-mono rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-y min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          CSS properties to apply only on {activeDevice} devices. Use standard CSS syntax
          (property: value;)
        </p>
      </div>

      {/* Summary */}
      <div className="p-3 bg-gray-800 rounded border border-gray-700 space-y-2">
        <h4 className="text-xs font-medium text-gray-400">Visibility Summary</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                value.desktop.visible ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-gray-500">Desktop</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                value.tablet.visible ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-gray-500">Tablet</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                value.mobile.visible ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-gray-500">Mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
};
