"use client";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { SimpleText } from "../widgets/basic/SimpleText";
import { SimpleContainer } from "../widgets/layout/SimpleContainer";

interface CraftEditorProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onPublish: () => Promise<void>;
  onPreview: () => void;
  pageTitle: string;
  pageSlug: string;
}

function EditorContent() {
  const { connectors } = useEditor();
  
  return (
    <div className="h-screen flex">
      <div className="w-64 bg-gray-800 p-4">
        <h3 className="text-white mb-4">Widgets</h3>
        <div 
          ref={(ref) => connectors.create(ref, <SimpleText />)}
          className="p-2 bg-gray-700 text-white cursor-pointer rounded mb-2"
        >
          Text
        </div>
        <div 
          ref={(ref) => connectors.create(ref, <SimpleContainer />)}
          className="p-2 bg-gray-700 text-white cursor-pointer rounded"
        >
          Container
        </div>
      </div>
      <div className="flex-1 p-8 bg-white">
        <Frame>
          <Element is={SimpleContainer} canvas />
        </Frame>
      </div>
    </div>
  );
}

export default function CraftEditor(props: CraftEditorProps) {
  return (
    <Editor resolver={{ SimpleText, SimpleContainer }}>
      <EditorContent />
    </Editor>
  );
}