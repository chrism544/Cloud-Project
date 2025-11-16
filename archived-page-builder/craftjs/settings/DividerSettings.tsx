"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, ColorPicker, TextInput } from "../controls/BaseControls";

export const DividerSettings = () => {
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
            label="Style"
            value={props.style || "solid"}
            onChange={(value) => setProp((props: any) => (props.style = value))}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
            ]}
          />

          <TextInput
            label="Width"
            value={props.width || "100%"}
            onChange={(value) => setProp((props: any) => (props.width = value))}
            placeholder="100%"
          />

          <Select
            label="Alignment"
            value={props.alignment || "center"}
            onChange={(value) => setProp((props: any) => (props.alignment = value))}
            options={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Style" defaultOpen={false}>
        <div className="space-y-3">
          <ColorPicker
            label="Color"
            value={props.color || "#000000"}
            onChange={(value) => setProp((props: any) => (props.color = value))}
          />

          <TextInput
            label="Thickness"
            value={props.thickness || "1px"}
            onChange={(value) => setProp((props: any) => (props.thickness = value))}
            placeholder="1px"
          />

          <TextInput
            label="Gap (Spacing)"
            value={props.gap || "10px"}
            onChange={(value) => setProp((props: any) => (props.gap = value))}
            placeholder="10px"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Advanced" defaultOpen={false}>
        <div className="space-y-3">
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
