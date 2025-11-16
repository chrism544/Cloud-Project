"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { Select, TextInput } from "../controls/BaseControls";
import { DimensionsControl } from "../controls/Dimensions";
import { BorderControl } from "../controls/Border";
import {
  BackgroundControl,
  TransformControl,
  FiltersControl,
  AnimationControl,
  ResponsiveControl,
  CustomCSSControl,
} from "../controls";

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-1">
      {/* LAYOUT SECTION */}
      <CollapsibleBlade title="Layout" defaultOpen={true}>
        <div className="space-y-3">
          {/* Flex Direction */}
          <Select
            label="Direction"
            value={props.direction || "column"}
            onChange={(value) => setProp((props: any) => (props.direction = value))}
            options={[
              { label: "Column", value: "column" },
              { label: "Column Reverse", value: "column-reverse" },
              { label: "Row", value: "row" },
              { label: "Row Reverse", value: "row-reverse" },
            ]}
          />

          {/* Flex Wrap */}
          <Select
            label="Wrap"
            value={props.wrap || "nowrap"}
            onChange={(value) => setProp((props: any) => (props.wrap = value))}
            options={[
              { label: "No Wrap", value: "nowrap" },
              { label: "Wrap", value: "wrap" },
              { label: "Wrap Reverse", value: "wrap-reverse" },
            ]}
          />

          {/* Gap */}
          <TextInput
            label="Gap"
            value={props.gap || "20px"}
            onChange={(value) => setProp((props: any) => (props.gap = value))}
            placeholder="20px"
          />

          {/* Justify Content */}
          <Select
            label="Justify Content"
            value={props.justifyContent || "flex-start"}
            onChange={(value) => setProp((props: any) => (props.justifyContent = value))}
            options={[
              { label: "Start", value: "flex-start" },
              { label: "Center", value: "center" },
              { label: "End", value: "flex-end" },
              { label: "Space Between", value: "space-between" },
              { label: "Space Around", value: "space-around" },
              { label: "Space Evenly", value: "space-evenly" },
            ]}
          />

          {/* Align Items */}
          <Select
            label="Align Items"
            value={props.alignItems || "stretch"}
            onChange={(value) => setProp((props: any) => (props.alignItems = value))}
            options={[
              { label: "Stretch", value: "stretch" },
              { label: "Start", value: "flex-start" },
              { label: "Center", value: "center" },
              { label: "End", value: "flex-end" },
              { label: "Baseline", value: "baseline" },
            ]}
          />

          {/* Align Content (for wrapped items) */}
          <Select
            label="Align Content"
            value={props.alignContent || ""}
            onChange={(value) => setProp((props: any) => (props.alignContent = value || undefined))}
            options={[
              { label: "Auto", value: "" },
              { label: "Stretch", value: "stretch" },
              { label: "Start", value: "flex-start" },
              { label: "Center", value: "center" },
              { label: "End", value: "flex-end" },
              { label: "Space Between", value: "space-between" },
              { label: "Space Around", value: "space-around" },
            ]}
          />
        </div>
      </CollapsibleBlade>

      {/* SIZING SECTION */}
      <CollapsibleBlade title="Sizing" defaultOpen={false}>
        <div className="space-y-3">
          {/* Width Controls */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Width</label>
            <div className="grid grid-cols-3 gap-2">
              <TextInput
                label="Min"
                value={props.minWidth || ""}
                onChange={(value) => setProp((props: any) => (props.minWidth = value || undefined))}
                placeholder="auto"
              />
              <TextInput
                label="Width"
                value={props.width || ""}
                onChange={(value) => setProp((props: any) => (props.width = value || undefined))}
                placeholder="100%"
              />
              <TextInput
                label="Max"
                value={props.maxWidth || ""}
                onChange={(value) => setProp((props: any) => (props.maxWidth = value || undefined))}
                placeholder="none"
              />
            </div>
          </div>

          {/* Height Controls */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Height</label>
            <div className="grid grid-cols-3 gap-2">
              <TextInput
                label="Min"
                value={props.minHeight || "100px"}
                onChange={(value) => setProp((props: any) => (props.minHeight = value))}
                placeholder="100px"
              />
              <TextInput
                label="Height"
                value={props.height || ""}
                onChange={(value) => setProp((props: any) => (props.height = value || undefined))}
                placeholder="auto"
              />
              <TextInput
                label="Max"
                value={props.maxHeight || ""}
                onChange={(value) => setProp((props: any) => (props.maxHeight = value || undefined))}
                placeholder="none"
              />
            </div>
          </div>
        </div>
      </CollapsibleBlade>

      {/* FLEX ITEM PROPERTIES (when inside another Container) */}
      <CollapsibleBlade title="Flex Item" defaultOpen={false}>
        <div className="space-y-3">
          <p className="text-xs text-gray-500 mb-3">
            Controls how this container behaves when placed inside another container
          </p>

          {/* Flex Grow/Shrink/Basis */}
          <div className="grid grid-cols-3 gap-2">
            <TextInput
              label="Grow"
              value={props.flexGrow !== undefined ? String(props.flexGrow) : ""}
              onChange={(value) =>
                setProp((props: any) => (props.flexGrow = value ? parseFloat(value) : undefined))
              }
              placeholder="0"
            />
            <TextInput
              label="Shrink"
              value={props.flexShrink !== undefined ? String(props.flexShrink) : ""}
              onChange={(value) =>
                setProp((props: any) => (props.flexShrink = value ? parseFloat(value) : undefined))
              }
              placeholder="1"
            />
            <TextInput
              label="Basis"
              value={props.flexBasis || ""}
              onChange={(value) => setProp((props: any) => (props.flexBasis = value || undefined))}
              placeholder="auto"
            />
          </div>

          {/* Align Self */}
          <Select
            label="Align Self"
            value={props.alignSelf || ""}
            onChange={(value) => setProp((props: any) => (props.alignSelf = value || undefined))}
            options={[
              { label: "Auto", value: "" },
              { label: "Stretch", value: "stretch" },
              { label: "Start", value: "flex-start" },
              { label: "Center", value: "center" },
              { label: "End", value: "flex-end" },
              { label: "Baseline", value: "baseline" },
            ]}
          />

          {/* Order */}
          <TextInput
            label="Order"
            value={props.order !== undefined ? String(props.order) : ""}
            onChange={(value) =>
              setProp((props: any) => (props.order = value ? parseInt(value) : undefined))
            }
            placeholder="0"
          />
        </div>
      </CollapsibleBlade>

      {/* BACKGROUND SECTION */}
      <CollapsibleBlade title="Background" defaultOpen={false}>
        <BackgroundControl
          value={props.background}
          onChange={(value) => setProp((props: any) => (props.background = value))}
        />
      </CollapsibleBlade>

      {/* BORDER SECTION */}
      <CollapsibleBlade title="Border" defaultOpen={false}>
        <BorderControl
          value={{
            width: props.borderWidth,
            style: props.borderStyle,
            color: props.borderColor,
            radius: props.borderRadius,
          }}
          onChange={(value) =>
            setProp((props: any) => {
              props.borderWidth = value.width;
              props.borderStyle = value.style;
              props.borderColor = value.color;
              props.borderRadius = value.radius;
            })
          }
        />
      </CollapsibleBlade>

      {/* SPACING SECTION */}
      <CollapsibleBlade title="Spacing" defaultOpen={false}>
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
        </div>
      </CollapsibleBlade>

      {/* TRANSFORM SECTION */}
      <CollapsibleBlade title="Transform" defaultOpen={false}>
        <TransformControl
          value={props.transform}
          onChange={(value) => setProp((props: any) => (props.transform = value))}
        />
      </CollapsibleBlade>

      {/* FILTERS SECTION */}
      <CollapsibleBlade title="Filters" defaultOpen={false}>
        <FiltersControl
          value={props.filters}
          onChange={(value) => setProp((props: any) => (props.filters = value))}
        />
      </CollapsibleBlade>

      {/* ANIMATION SECTION */}
      <CollapsibleBlade title="Animation" defaultOpen={false}>
        <AnimationControl
          value={props.animation}
          onChange={(value) => setProp((props: any) => (props.animation = value))}
        />
      </CollapsibleBlade>

      {/* RESPONSIVE SECTION */}
      <CollapsibleBlade title="Responsive" defaultOpen={false}>
        <ResponsiveControl
          value={
            props.responsive || {
              desktop: { visible: true },
              tablet: { visible: true },
              mobile: { visible: true },
            }
          }
          onChange={(value) => setProp((props: any) => (props.responsive = value))}
        />
      </CollapsibleBlade>

      {/* ADVANCED SECTION */}
      <CollapsibleBlade title="Advanced" defaultOpen={false}>
        <div className="space-y-3">
          <CustomCSSControl
            value={props.customCSS || ""}
            onChange={(value) => setProp((props: any) => (props.customCSS = value))}
          />

          <TextInput
            label="CSS Classes"
            value={props.className || ""}
            onChange={(value) => setProp((props: any) => (props.className = value))}
            placeholder="custom-class another-class"
          />
        </div>
      </CollapsibleBlade>
    </div>
  );
};
