"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { ColorPicker, TextInput } from "../controls/BaseControls";

export const SpacerSettings = () => {
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
            label="Height"
            value={props.height || "50px"}
            onChange={(value) => setProp((props: any) => (props.height = value))}
            placeholder="50px"
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
