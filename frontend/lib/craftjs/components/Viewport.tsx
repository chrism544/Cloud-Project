"use client";
import { useEditor, Frame, Element } from "@craftjs/core";
import { Container } from "../widgets/layout/Container";

export const Viewport = () => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div className="flex-1 overflow-auto bg-gray-800 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl min-h-[600px]">
        <Frame>
          {/* Start with enhanced Container widget */}
          <Element is={Container} canvas id="root-container" />
        </Frame>
      </div>
    </div>
  );
};
