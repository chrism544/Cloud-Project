"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";

export const ButtonSettings = () => {
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
          <TextInput
            label="Button Text"
            value={props.text || "Click me"}
            onChange={(value) => setProp((props: any) => (props.text = value))}
            placeholder="Enter button text"
          />

          <TextInput
            label="Link URL"
            value={props.href || "#"}
            onChange={(value) => setProp((props: any) => (props.href = value))}
            placeholder="https://..."
            type="url"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Style" defaultOpen={true}>
        <div className="space-y-3">
          <Select
            label="Variant"
            value={props.variant || "primary"}
            onChange={(value) => setProp((props: any) => (props.variant = value))}
            options={[
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Outline", value: "outline" },
            ]}
          />

          <Select
            label="Size"
            value={props.size || "md"}
            onChange={(value) => setProp((props: any) => (props.size = value))}
            options={[
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
            ]}
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Background Color</label>
            <input
              type="color"
              value={props.backgroundColor || "#4F46E5"}
              onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Text Color</label>
            <input
              type="color"
              value={props.textColor || "#FFFFFF"}
              onChange={(e) => setProp((props: any) => (props.textColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Hover Color</label>
            <input
              type="color"
              value={props.hoverColor || "#4338CA"}
              onChange={(e) => setProp((props: any) => (props.hoverColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <TextInput
            label="Border Radius"
            value={props.borderRadius || "6px"}
            onChange={(value) => setProp((props: any) => (props.borderRadius = value))}
            placeholder="6px"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Alignment" defaultOpen={false}>
        <Select
          label="Position"
          value={props.align || "left"}
          onChange={(value) => setProp((props: any) => (props.align = value))}
          options={[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]}
        />
      </CollapsibleBlade>
    </div>
  );
};
