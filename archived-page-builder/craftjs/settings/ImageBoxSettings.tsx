"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput, Toggle } from "../controls/BaseControls";

export const ImageBoxSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-2">
      <CollapsibleBlade title="Image" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Image URL"
            value={props.imageSrc || ""}
            onChange={(value) => setProp((props: any) => (props.imageSrc = value))}
            placeholder="https://..."
            type="url"
          />

          <TextInput
            label="Alt Text"
            value={props.imageAlt || ""}
            onChange={(value) => setProp((props: any) => (props.imageAlt = value))}
            placeholder="Describe the image"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Content" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Title"
            value={props.title || "Box Title"}
            onChange={(value) => setProp((props: any) => (props.title = value))}
            placeholder="Enter title"
          />

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Description</label>
            <textarea
              value={props.description || ""}
              onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
              placeholder="Enter description"
              rows={4}
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

      <CollapsibleBlade title="Button" defaultOpen={false}>
        <div className="space-y-3">
          <Toggle
            label="Show Button"
            value={props.showButton || false}
            onChange={(value: boolean) => setProp((props: any) => (props.showButton = value))}
          />

          {props.showButton && (
            <>
              <TextInput
                label="Button Text"
                value={props.buttonText || "Learn More"}
                onChange={(value) => setProp((props: any) => (props.buttonText = value))}
                placeholder="Learn More"
              />

              <TextInput
                label="Button URL"
                value={props.buttonUrl || "#"}
                onChange={(value) => setProp((props: any) => (props.buttonUrl = value))}
                placeholder="https://..."
                type="url"
              />
            </>
          )}
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

          {props.layout === "horizontal" && (
            <Select
              label="Image Position"
              value={props.imagePosition || "left"}
              onChange={(value) => setProp((props: any) => (props.imagePosition = value))}
              options={[
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
              ]}
            />
          )}

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
            label="Border Radius"
            value={props.borderRadius || "8px"}
            onChange={(value) => setProp((props: any) => (props.borderRadius = value))}
            placeholder="8px"
          />
        </div>
      </CollapsibleBlade>
    </div>
  );
};
