"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";
import * as Icons from "lucide-react";

const AVAILABLE_ICONS = Object.keys(Icons)
  .filter((key) => key[0] === key[0].toUpperCase() && key !== "default")
  .slice(0, 100)
  .sort();

export const IconBoxSettings = () => {
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
            value={props.iconName || "Star"}
            onChange={(value) => setProp((props: any) => (props.iconName = value))}
            options={AVAILABLE_ICONS.map((icon) => ({
              label: icon,
              value: icon,
            }))}
          />

          <Select
            label="Icon Size"
            value={props.iconSize || "md"}
            onChange={(value) => setProp((props: any) => (props.iconSize = value))}
            options={[
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
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

      <CollapsibleBlade title="Content" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Title"
            value={props.title || "Feature Title"}
            onChange={(value) => setProp((props: any) => (props.title = value))}
            placeholder="Enter title"
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description</label>
            <textarea
              value={props.description || ""}
              onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
              placeholder="Enter description"
              rows={3}
              className="w-full px-2 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Title Color</label>
            <input
              type="color"
              value={props.titleColor || "#000000"}
              onChange={(e) => setProp((props: any) => (props.titleColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description Color</label>
            <input
              type="color"
              value={props.descriptionColor || "#666666"}
              onChange={(e) => setProp((props: any) => (props.descriptionColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Layout" defaultOpen={false}>
        <div className="space-y-3">
          <Select
            label="Direction"
            value={props.layout || "vertical"}
            onChange={(value) => setProp((props: any) => (props.layout = value))}
            options={[
              { label: "Vertical", value: "vertical" },
              { label: "Horizontal", value: "horizontal" },
            ]}
          />

          <TextInput
            label="Gap"
            value={props.gap || "12px"}
            onChange={(value) => setProp((props: any) => (props.gap = value))}
            placeholder="12px"
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Background Color</label>
            <input
              type="color"
              value={props.backgroundColor || "#F9FAFB"}
              onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
              className="w-full h-8 rounded cursor-pointer border border-gray-600"
            />
          </div>

          <TextInput
            label="Border Radius"
            value={props.borderRadius || "8px"}
            onChange={(value) => setProp((props: any) => (props.borderRadius = value))}
            placeholder="8px"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Alignment" defaultOpen={false}>
        <Select
          label="Text Alignment"
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
