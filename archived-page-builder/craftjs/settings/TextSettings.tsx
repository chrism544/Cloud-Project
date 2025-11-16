"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";
import { TypographyControl } from "../controls/Typography";
import { DimensionsControl } from "../controls/Dimensions";

export const TextSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-2">
      <CollapsibleBlade title="Content" defaultOpen={true}>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Text Content</label>
            <textarea
              value={props.text || "Your text here..."}
              onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
              placeholder="Enter text content"
              className="w-full px-2 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              rows={4}
            />
          </div>

          <Select
            label="Text Alignment"
            value={props.align || "left"}
            onChange={(value) => setProp((props: any) => (props.align = value))}
            options={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
              { label: "Justify", value: "justify" },
            ]}
          />

          <TextInput
            label="Line Height"
            value={props.lineHeight || "1.5"}
            onChange={(value) => setProp((props: any) => (props.lineHeight = value))}
            placeholder="1.5"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Typography" defaultOpen={false}>
        <TypographyControl
          value={props.typography || {}}
          onChange={(value) => setProp((props: any) => (props.typography = value))}
        />
      </CollapsibleBlade>

      <CollapsibleBlade title="Spacing" defaultOpen={false}>
        <div className="space-y-3">
          <DimensionsControl
            label="Padding"
            value={props.padding || {}}
            onChange={(value) => setProp((props: any) => (props.padding = value))}
          />
          <DimensionsControl
            label="Margin"
            value={props.margin || {}}
            onChange={(value) => setProp((props: any) => (props.margin = value))}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Background" defaultOpen={false}>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Background Color</label>
            <input
              type="color"
              value={props.backgroundColor || "#ffffff"}
              onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>
        </div>
      </CollapsibleBlade>
    </div>
  );
};
