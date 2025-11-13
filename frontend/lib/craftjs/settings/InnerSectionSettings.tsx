"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { ColorPicker, TextInput } from "../controls/BaseControls";
import { DimensionsControl } from "../controls/Dimensions";

export const InnerSectionSettings = () => {
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
            label="Columns Gap"
            value={props.columnsGap || "20px"}
            onChange={(value) => setProp((props: any) => (props.columnsGap = value))}
            placeholder="20px"
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
