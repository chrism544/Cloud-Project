"use client";
import React, { useState } from "react";

interface CustomCSSControlProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export const CustomCSSControl: React.FC<CustomCSSControlProps> = ({
  value = "",
  onChange,
  label = "Custom CSS",
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const examples = [
    {
      title: "Text Shadow",
      code: "text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
    },
    {
      title: "Box Shadow",
      code: "box-shadow: 0 4px 6px rgba(0,0,0,0.1);",
    },
    {
      title: "Border Gradient",
      code: "border: 2px solid transparent;\nbackground: linear-gradient(white, white) padding-box,\n            linear-gradient(to right, #ff6cf8, #5636d1) border-box;",
    },
    {
      title: "Transition",
      code: "transition: all 0.3s ease;",
    },
  ];

  const insertExample = (code: string) => {
    const currentValue = value || "";
    const newValue = currentValue ? `${currentValue}\n${code}` : code;
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          {showHelp ? "Hide" : "Show"} Examples
        </button>
      </div>

      {/* Help/Examples Panel */}
      {showHelp && (
        <div className="p-3 bg-gray-800 rounded border border-gray-700 space-y-3">
          <h4 className="text-xs font-medium text-gray-400">Quick Examples</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{example.title}</span>
                  <button
                    type="button"
                    onClick={() => insertExample(example.code)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Insert
                  </button>
                </div>
                <pre className="text-xs text-gray-400 bg-gray-900 p-2 rounded overflow-x-auto">
                  {example.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS Input */}
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/* Add custom CSS here */&#10;color: #ff6cf8;&#10;font-weight: bold;&#10;padding: 10px;&#10;&#10;/* Supports all CSS properties */"
          className="w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm font-mono rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-y min-h-[200px]"
          spellCheck={false}
        />

        {/* Character Count */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{value?.length || 0} characters</span>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-red-400 hover:text-red-300"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-3 bg-blue-900/20 rounded border border-blue-800/30">
        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-xs text-blue-300 space-y-1">
            <p className="font-medium">CSS Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-200/80">
              <li>Use standard CSS syntax (property: value;)</li>
              <li>Separate declarations with semicolons</li>
              <li>Supports all CSS properties and values</li>
              <li>Changes apply to the selected element only</li>
              <li>Custom CSS overrides other settings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Warning Panel (if CSS has potential issues) */}
      {value && value.includes("!important") && (
        <div className="p-3 bg-yellow-900/20 rounded border border-yellow-800/30">
          <div className="flex gap-2">
            <svg
              className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs text-yellow-300">
              <p className="font-medium">!important detected</p>
              <p className="text-yellow-200/80 mt-1">
                Using !important can make styles harder to override. Consider removing it if
                possible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Common Snippets */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400">Common Snippets</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              insertExample("/* Hover effect */\ntransition: all 0.3s ease;")
            }
            className="px-3 py-2 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-left"
          >
            Hover Transition
          </button>
          <button
            type="button"
            onClick={() =>
              insertExample("/* Centered text */\ntext-align: center;")
            }
            className="px-3 py-2 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-left"
          >
            Center Text
          </button>
          <button
            type="button"
            onClick={() =>
              insertExample("/* Full width */\nwidth: 100%;")
            }
            className="px-3 py-2 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-left"
          >
            Full Width
          </button>
          <button
            type="button"
            onClick={() =>
              insertExample("/* Rounded corners */\nborder-radius: 8px;")
            }
            className="px-3 py-2 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-left"
          >
            Rounded Corners
          </button>
        </div>
      </div>
    </div>
  );
};
