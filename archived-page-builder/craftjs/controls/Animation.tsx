"use client";
import React, { useState } from "react";
import { AnimationValue } from "../utils/cssGenerator";
import { getAvailableAnimations, getAvailableEasings } from "../utils/animations";

interface AnimationControlProps {
  value?: AnimationValue;
  onChange: (value: AnimationValue) => void;
  label?: string;
}

export const AnimationControl: React.FC<AnimationControlProps> = ({
  value = {},
  onChange,
  label = "Animation",
}) => {
  const [activeTab, setActiveTab] = useState<"entrance" | "hover" | "scroll">("entrance");

  const handleEntranceChange = (updates: Partial<AnimationValue["entrance"]>) => {
    onChange({
      ...value,
      entrance: value.entrance
        ? { ...value.entrance, ...updates }
        : ({
            type: "fadeIn",
            duration: 500,
            delay: 0,
            easing: "ease",
            ...updates,
          } as any),
    });
  };

  const handleHoverChange = (updates: Partial<AnimationValue["hover"]>) => {
    onChange({
      ...value,
      hover: value.hover
        ? { ...value.hover, ...updates }
        : ({
            transition: 300,
            ...updates,
          } as any),
    });
  };

  const handleScrollChange = (updates: Partial<AnimationValue["scroll"]>) => {
    onChange({
      ...value,
      scroll: value.scroll ? { ...value.scroll, ...updates } : ({} as any),
    });
  };

  const clearEntrance = () => {
    onChange({ ...value, entrance: undefined });
  };

  const clearHover = () => {
    onChange({ ...value, hover: undefined });
  };

  const clearScroll = () => {
    onChange({ ...value, scroll: undefined });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {(["entrance", "hover", "scroll"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs rounded transition-colors ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Entrance Animation */}
      {activeTab === "entrance" && (
        <div className="space-y-3">
          {value.entrance ? (
            <>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Animation Type</label>
                <select
                  value={value.entrance.type}
                  onChange={(e) => handleEntranceChange({ type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="fadeIn">Fade In</option>
                  <option value="slideInUp">Slide In Up</option>
                  <option value="slideInDown">Slide In Down</option>
                  <option value="slideInLeft">Slide In Left</option>
                  <option value="slideInRight">Slide In Right</option>
                  <option value="zoomIn">Zoom In</option>
                  <option value="bounceIn">Bounce In</option>
                  <option value="rollIn">Roll In</option>
                  <option value="flipInX">Flip In X</option>
                  <option value="flipInY">Flip In Y</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400">Duration</label>
                  <span className="text-xs text-gray-500">{value.entrance.duration}ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={value.entrance.duration}
                  onChange={(e) =>
                    handleEntranceChange({ duration: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400">Delay</label>
                  <span className="text-xs text-gray-500">{value.entrance.delay}ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={value.entrance.delay}
                  onChange={(e) =>
                    handleEntranceChange({ delay: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">Easing</label>
                <select
                  value={value.entrance.easing}
                  onChange={(e) => handleEntranceChange({ easing: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="linear">Linear</option>
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="cubic-bezier(0.55, 0.055, 0.675, 0.19)">Ease In Cubic</option>
                  <option value="cubic-bezier(0.215, 0.61, 0.355, 1)">Ease Out Cubic</option>
                  <option value="cubic-bezier(0.6, 0.04, 0.98, 0.335)">Ease In Circ</option>
                  <option value="cubic-bezier(0.075, 0.82, 0.165, 1)">Ease Out Circ</option>
                  <option value="cubic-bezier(0.6, -0.28, 0.735, 0.045)">Ease In Back</option>
                  <option value="cubic-bezier(0.175, 0.885, 0.32, 1.275)">Ease Out Back</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearEntrance}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Remove Entrance Animation
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                handleEntranceChange({
                  type: "fadeIn",
                  duration: 500,
                  delay: 0,
                  easing: "ease",
                })
              }
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Add Entrance Animation
            </button>
          )}
        </div>
      )}

      {/* Hover Animation */}
      {activeTab === "hover" && (
        <div className="space-y-3">
          {value.hover ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400">Transition Duration</label>
                  <span className="text-xs text-gray-500">{value.hover.transition}ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={value.hover.transition || 300}
                  onChange={(e) =>
                    handleHoverChange({ transition: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              {/* Transform on Hover */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Transform</label>

                <div className="space-y-2 pl-2 border-l-2 border-gray-700">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-gray-500">Scale</label>
                      <span className="text-xs text-gray-500">
                        {value.hover.transform?.scale || 1}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={value.hover.transform?.scale || 1}
                      onChange={(e) =>
                        handleHoverChange({
                          transform: {
                            ...value.hover?.transform,
                            scale: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-gray-500">Rotate</label>
                      <span className="text-xs text-gray-500">
                        {value.hover.transform?.rotate || 0}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={value.hover.transform?.rotate || 0}
                      onChange={(e) =>
                        handleHoverChange({
                          transform: {
                            ...value.hover?.transform,
                            rotate: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Translate Y</label>
                    <input
                      type="text"
                      value={value.hover.transform?.translateY || "0px"}
                      onChange={(e) =>
                        handleHoverChange({
                          transform: {
                            ...value.hover?.transform,
                            translateY: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="0px"
                    />
                  </div>
                </div>
              </div>

              {/* Filters on Hover */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Filters</label>

                <div className="space-y-2 pl-2 border-l-2 border-gray-700">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-gray-500">Brightness</label>
                      <span className="text-xs text-gray-500">
                        {value.hover.filters?.brightness || 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      value={value.hover.filters?.brightness || 100}
                      onChange={(e) =>
                        handleHoverChange({
                          filters: {
                            ...value.hover?.filters,
                            brightness: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-gray-500">Saturate</label>
                      <span className="text-xs text-gray-500">
                        {value.hover.filters?.saturate || 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      value={value.hover.filters?.saturate || 100}
                      onChange={(e) =>
                        handleHoverChange({
                          filters: {
                            ...value.hover?.filters,
                            saturate: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearHover}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Remove Hover Animation
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleHoverChange({ transition: 300 })}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Add Hover Animation
            </button>
          )}
        </div>
      )}

      {/* Scroll Animation */}
      {activeTab === "scroll" && (
        <div className="space-y-3">
          {value.scroll ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Parallax Effect</label>
                  <input
                    type="checkbox"
                    checked={value.scroll.parallax !== undefined}
                    onChange={(e) =>
                      handleScrollChange({
                        parallax: e.target.checked ? -50 : undefined,
                      })
                    }
                    className="w-4 h-4"
                  />
                </div>
                {value.scroll.parallax !== undefined && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Speed</span>
                      <span className="text-xs text-gray-500">{value.scroll.parallax}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="10"
                      value={value.scroll.parallax}
                      onChange={(e) =>
                        handleScrollChange({ parallax: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Fade on Scroll</label>
                  <input
                    type="checkbox"
                    checked={value.scroll.fade || false}
                    onChange={(e) => handleScrollChange({ fade: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Scale on Scroll</label>
                  <input
                    type="checkbox"
                    checked={value.scroll.scale || false}
                    onChange={(e) => handleScrollChange({ scale: e.target.checked })}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={clearScroll}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Remove Scroll Animation
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleScrollChange({ fade: true })}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Add Scroll Animation
            </button>
          )}
        </div>
      )}
    </div>
  );
};
