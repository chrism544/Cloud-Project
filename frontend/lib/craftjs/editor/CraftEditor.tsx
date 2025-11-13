"use client";
import { Editor, SerializedNodes, useEditor } from "@craftjs/core";
import { Toolbox } from "../components/Toolbox";
import { SettingsPanel } from "../components/SettingsPanel";
import { Viewport } from "../components/Viewport";
import { RenderNode } from "../components/RenderNode";
import { Eye, Save } from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/editor.css";

// Import all widgets to create resolver
import { Container } from "../widgets/layout/Container";
import { Section } from "../widgets/layout/Section";
import { Column } from "../widgets/layout/Column";
import { InnerSection } from "../widgets/layout/InnerSection";
import { Spacer } from "../widgets/layout/Spacer";
import { Divider } from "../widgets/layout/Divider";
import { Heading } from "../widgets/basic/Heading";
import { Text } from "../widgets/basic/Text";
import { Image } from "../widgets/basic/Image";
import { Video } from "../widgets/basic/Video";
import { Button } from "../widgets/basic/Button";
import { Icon } from "../widgets/basic/Icon";
import { IconBox } from "../widgets/basic/IconBox";
import { ImageBox } from "../widgets/basic/ImageBox";

interface CraftEditorProps {
  initialData?: SerializedNodes;
  onSave: (data: SerializedNodes) => Promise<void>;
  onPublish: () => Promise<void>;
  onPreview: () => void;
  pageTitle: string;
  pageSlug: string;
}

function EditorContent({
  initialData,
  onSave,
  onPublish,
  onPreview,
  pageTitle,
  pageSlug,
}: CraftEditorProps) {
  const { query, actions } = useEditor();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('Loading initial data:', initialData);
      try {
        actions.deserialize(initialData);
        console.log('Data deserialized successfully');
      } catch (error) {
        console.error('Failed to deserialize:', error);
      }
    } else {
      console.log('No initial data - starting with empty canvas');
    }
  }, [initialData, actions]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const serializedString = query.serialize();
      const serializedData = JSON.parse(serializedString) as SerializedNodes;
      await onSave(serializedData);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-white">{pageTitle || "Untitled Page"}</h1>
            <p className="text-xs text-gray-400">/{pageSlug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </button>

          {/* Preview */}
          <button
            onClick={onPreview}
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          {/* Publish */}
          <button
            onClick={onPublish}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Main Editor Area - Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Widget Panel (Left) */}
        <Toolbox />

        {/* Canvas (Center) */}
        <Viewport />

        {/* Settings Panel (Right) */}
        <SettingsPanel />
      </div>
    </>
  );
}

export default function CraftEditor(props: CraftEditorProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 craftjs-renderer">
      <Editor
        resolver={{
          Container,
          Section,
          Column,
          InnerSection,
          Spacer,
          Divider,
          Heading,
          Text,
          Image,
          Video,
          Button,
          Icon,
          IconBox,
          ImageBox,
        }}
        enabled={true}
        onRender={RenderNode}
      >
        <EditorContent {...props} />
      </Editor>
    </div>
  );
}
