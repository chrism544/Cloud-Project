"use client";
import { useNode } from "@craftjs/core";

export const SimpleContainer = ({ children }) => {
  const { connectors: { connect } } = useNode();
  
  return (
    <div 
      ref={connect}
      style={{ 
        minHeight: "100px", 
        padding: "20px", 
        border: "2px dashed #ccc",
        backgroundColor: "#f9f9f9"
      }}
    >
      {children || "Drop here"}
    </div>
  );
};

SimpleContainer.craft = {
  displayName: "Simple Container",
  isCanvas: true
};