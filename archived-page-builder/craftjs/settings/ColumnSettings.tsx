"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, ColorPicker, TextInput } from "../controls/BaseControls";
import { DimensionsControl } from "../controls/Dimensions";

export const ColumnSettings = () => {
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
          <TextInput
            label="Width"
            value={props.width || "auto"}
            onChange={(value) => setProp((props: any) => (props.width = value))}
            placeholder="e.g. 50%, 1, auto"
          />

          <Select
            label="Vertical Align"
            value={props.verticalAlign || "stretch"}
            onChange={(value) => setProp((props: any) => (props.verticalAlign = value))}
            options={[
              { label: "Top", value: "flex-start" },
              { label: "Middle", value: "center" },
              { label: "Bottom", value: "flex-end" },
              { label: "Stretch", value: "stretch" },
            ]}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Style" defaultOpen={false}>
        <div className="space-y-3">
          <ColorPicker
            label="Background Color"
            value={props.backgroundColor || "transparent"}
            onChange={(value) => setProp((props: any) => (props.backgroundColor = value))}
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
