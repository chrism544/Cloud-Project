"use client";
import { useEditor, Frame } from "@craftjs/core";

export const Viewport = () => {
  return (
    <div className="flex-1 overflow-auto bg-gray-800 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl min-h-[600px]">
        <Frame>
          <div style={{ padding: '40px', minHeight: '500px', border: '2px dashed #e5e7eb', textAlign: 'center', color: '#9ca3af' }}>
            Drop widgets here
          </div>
        </Frame>
      </div>
    </div>
  );
};
