"use client";
import { useNode } from "@craftjs/core";
import { CollapsibleBlade } from "../components/CollapsibleBlade";
import { TextInput, Toggle } from "../controls/BaseControls";

export const VideoSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-2">
      <CollapsibleBlade title="Video Source" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Video URL"
            value={props.videoUrl || ""}
            onChange={(value) => setProp((props: any) => (props.videoUrl = value))}
            placeholder="YouTube, Vimeo URL or video file"
            type="url"
          />
          <p className="text-xs text-gray-400">
            Supports YouTube, Vimeo URLs, or direct video file paths
          </p>
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Sizing" defaultOpen={true}>
        <div className="space-y-3">
          <TextInput
            label="Width"
            value={props.width || "100%"}
            onChange={(value) => setProp((props: any) => (props.width = value))}
            placeholder="100% or 800px"
          />

          <TextInput
            label="Height"
            value={props.height || "500px"}
            onChange={(value) => setProp((props: any) => (props.height = value))}
            placeholder="500px"
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Controls" defaultOpen={true}>
        <div className="space-y-3">
          <Toggle
            label="Autoplay"
            value={props.autoplay || false}
            onChange={(value: boolean) => setProp((props: any) => (props.autoplay = value))}
          />

          <Toggle
            label="Show Controls"
            value={props.controls !== false}
            onChange={(value: boolean) => setProp((props: any) => (props.controls = value))}
          />

          <Toggle
            label="Muted"
            value={props.muted || false}
            onChange={(value: boolean) => setProp((props: any) => (props.muted = value))}
          />

          <Toggle
            label="Loop"
            value={props.loop || false}
            onChange={(value: boolean) => setProp((props: any) => (props.loop = value))}
          />
        </div>
      </CollapsibleBlade>

      <CollapsibleBlade title="Alignment" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-2">Position</label>
            <div className="flex gap-2">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  onClick={() => setProp((props: any) => (props.align = align))}
                  className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                    props.align === align
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleBlade>
    </div>
  );
};
