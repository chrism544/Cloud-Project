"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";
import { DimensionsControl } from "../controls/Dimensions";

export const ImageSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-2">
      <CollapsibleBlade title="Image Source" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Image URL"
            value={props.src || ""}
            onChange={(value) => setProp((props: any) => (props.src = value))}
            placeholder="https://..."
            type="url"
          />

          <TextInput
            label="Alt Text"
            value={props.alt || ""}
            onChange={(value) => setProp((props: any) => (props.alt = value))}
            placeholder="Describe the image"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Sizing" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Width"
            value={props.width || "100%"}
            onChange={(value) => setProp((props: any) => (props.width = value))}
            placeholder="100% or 400px"
          />

          <TextInput
            label="Height"
            value={props.height || "auto"}
            onChange={(value) => setProp((props: any) => (props.height = value))}
            placeholder="auto or 300px"
          />

          <Select
            label="Object Fit"
            value={props.objectFit || "cover"}
            onChange={(value) => setProp((props: any) => (props.objectFit = value))}
            options={[
              { label: "Cover", value: "cover" },
              { label: "Contain", value: "contain" },
              { label: "Fill", value: "fill" },
              { label: "Scale Down", value: "scale-down" },
            ]}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Styling" defaultOpen={false}>
        <div className="space-y-3">
          <TextInput
            label="Border Radius"
            value={props.borderRadius || "0px"}
            onChange={(value) => setProp((props: any) => (props.borderRadius = value))}
            placeholder="0px or 8px"
          />

          <Select
            label="Shadow"
            value={props.shadow || "none"}
            onChange={(value) => setProp((props: any) => (props.shadow = value))}
            options={[
              { label: "None", value: "none" },
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
              { label: "Extra Large", value: "xl" },
            ]}
          />

          <Select
            label="Alignment"
            value={props.align || "left"}
            onChange={(value) => setProp((props: any) => (props.align = value))}
            options={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Spacing" defaultOpen={false}>
        <DimensionsControl
          label="Margin"
          value={props.margin || {}}
          onChange={(value) => setProp((props: any) => (props.margin = value))}
        />
      </CollapsibleBlade>
    </div>
  );
};
