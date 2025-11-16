"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";
import { TypographyControl } from "../controls/Typography";
import { DimensionsControl } from "../controls/Dimensions";

export const HeadingSettings = () => {
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
            label="Text"
            value={props.text || "Heading"}
            onChange={(value) => setProp((props: any) => (props.text = value))}
            placeholder="Enter heading text"
          />

          <Select
            label="HTML Tag"
            value={props.tag || "h2"}
            onChange={(value) => setProp((props: any) => (props.tag = value))}
            options={[
              { label: "H1", value: "h1" },
              { label: "H2", value: "h2" },
              { label: "H3", value: "h3" },
              { label: "H4", value: "h4" },
              { label: "H5", value: "h5" },
              { label: "H6", value: "h6" },
            ]}
          />

          <TextInput
            label="Link (Optional)"
            value={props.link || ""}
            onChange={(value) => setProp((props: any) => (props.link = value))}
            placeholder="https://..."
            type="url"
          />

          <Select
            label="Text Alignment"
            value={props.align || "left"}
            onChange={(value) => setProp((props: any) => (props.align = value))}
            options={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
              { label: "Justify", value: "justify" },
            ]}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Style" defaultOpen={false}>
        <TypographyControl
          value={props.typography || {}}
          onChange={(value) => setProp((props: any) => (props.typography = value))}
          showColor={true}
        />
      </CollapsibleBlade>

      <CollapsibleBlade title="Advanced" defaultOpen={false}>
        <div className="space-y-3">
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
