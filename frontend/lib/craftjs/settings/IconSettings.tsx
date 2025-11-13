"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";
import * as Icons from "lucide-react";

// Get list of available icons from lucide-react
const AVAILABLE_ICONS = Object.keys(Icons)
  .filter((key) => key[0] === key[0].toUpperCase() && key !== "default")
  .slice(0, 100) // Limit for performance
  .sort();

export const IconSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-2">
      <CollapsibleBlade title="Icon" defaultOpen={true}>
        <div className="space-y-3">
          <Select
            label="Icon"
            value={props.iconName || "Heart"}
            onChange={(value) => setProp((props: any) => (props.iconName = value))}
            options={AVAILABLE_ICONS.map((icon) => ({
              label: icon,
              value: icon,
            }))}
          />

          <Select
            label="Size"
            value={props.iconSize || "md"}
            onChange={(value) => setProp((props: any) => (props.iconSize = value))}
            options={[
              { label: "Extra Small", value: "xs" },
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
              { label: "Extra Large", value: "xl" },
            ]}
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Icon Color</label>
            <input
              type="color"
              value={props.iconColor || "#000000"}
              onChange={(e) => setProp((props: any) => (props.iconColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Background" defaultOpen={false}>
        <div className="space-y-3">
          <Select
            label="Shape"
            value={props.backgroundShape || "none"}
            onChange={(value) => setProp((props: any) => (props.backgroundShape = value))}
            options={[
              { label: "None", value: "none" },
              { label: "Circle", value: "circle" },
              { label: "Square", value: "square" },
              { label: "Rounded", value: "rounded" },
            ]}
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Background Color</label>
            <input
              type="color"
              value={props.backgroundColor || "#FFFFFF"}
              onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <TextInput
            label="Background Size"
            value={props.backgroundSize || "40px"}
            onChange={(value) => setProp((props: any) => (props.backgroundSize = value))}
            placeholder="40px"
          />

          <TextInput
            label="Padding"
            value={props.padding || "8px"}
            onChange={(value) => setProp((props: any) => (props.padding = value))}
            placeholder="8px"
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
