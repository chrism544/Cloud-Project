"use client";
import { useNode } from "@craftjs/core";

export const SimpleText = ({ text = "Hello World" }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <p>{text}</p>
    </div>
  );
};

SimpleText.craft = {
  displayName: "Simple Text"
};