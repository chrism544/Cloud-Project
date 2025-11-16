"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, ColorPicker, TextInput } from "../controls/BaseControls";
import { DimensionsControl } from "../controls/Dimensions";

export const SectionSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <CollapsibleBlade title="Content" defaultOpen={true}>
        <div className="space-y-3">
          <Select
            label="Content Width"
            value={props.contentWidth || "boxed"}
            onChange={(value) => setProp((props: any) => (props.contentWidth = value))}
            options={[
              { label: "Boxed (1200px)", value: "boxed" },
              { label: "Full Width", value: "full-width" },
            ]}
          />

          <Select
            label="Height"
            value={props.height || "default"}
            onChange={(value) => setProp((props: any) => (props.height = value))}
            options={[
              { label: "Default", value: "default" },
              { label: "Fit to Screen", value: "fit-screen" },
              { label: "Custom", value: "custom" },
            ]}
          />

          {props.height === "custom" && (
            <TextInput
              label="Custom Height"
              value={typeof props.height === "string" && props.height !== "default" && props.height !== "fit-screen" ? props.height : ""}
              onChange={(value) => setProp((props: any) => (props.height = value))}
              placeholder="e.g. 500px"
            />
          )}
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Style" defaultOpen={false}>
        <div className="space-y-3">
          <ColorPicker
            label="Background Color"
            value={props.backgroundColor || "transparent"}
            onChange={(value) => setProp((props: any) => (props.backgroundColor = value))}
          />

          <TextInput
            label="Background Image URL"
            value={props.backgroundImage || ""}
            onChange={(value) => setProp((props: any) => (props.backgroundImage = value))}
            placeholder="https://..."
            type="url"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Advanced" defaultOpen={false}>
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

          <TextInput
            label="CSS Classes"
            value={props.className || ""}
            onChange={(value) => setProp((props: any) => (props.className = value))}
            placeholder="custom-class"
          />
        </div>
      </CollapsibleBlade>
    </div>
  );
};
