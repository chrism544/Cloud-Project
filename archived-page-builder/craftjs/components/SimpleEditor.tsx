"use client";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { Text } from "../widgets/basic/Text";
import { Button } from "../widgets/basic/Button";
import { Container } from "../widgets/layout/Container";

const Toolbox = () => {
  const { connectors } = useEditor();
  
  return (
    <div className="w-64 bg-gray-900 p-4">
      <h3 className="text-white mb-4">Widgets</h3>
      <div className="space-y-2">
        <div
          ref={(ref) => ref && connectors.create(ref, <Text />)}
          className="p-2 bg-gray-700 text-white cursor-pointer rounded"
        >
          Text
        </div>
        <div
          ref={(ref) => ref && connectors.create(ref, <Button />)}
          className="p-2 bg-gray-700 text-white cursor-pointer rounded"
        >
          Button
        </div>
        <div
          ref={(ref) => ref && connectors.create(ref, <Container />)}
          className="p-2 bg-gray-700 text-white cursor-pointer rounded"
        >
          Container
        </div>
      </div>
    </div>
  );
};

const Canvas = () => {
  return (
    <div className="flex-1 p-8 bg-gray-100">
      <Frame>
        <Element is={Container} canvas />
      </Frame>
    </div>
  );
};

export default function SimpleEditor() {
  return (
    <div className="h-screen flex">
      <Editor resolver={{ Text, Button, Container }}>
        <Toolbox />
        <Canvas />
      </Editor>
    </div>
  );
}