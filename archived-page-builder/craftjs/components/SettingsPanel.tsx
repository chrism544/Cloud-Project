"use client";
import { useEditor } from "@craftjs/core";
import { CollapsibleBlade } from "./CollapsibleBlade";

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const currentlySelected = state.events.selected;

    if (!currentlySelected || currentlySelected.size === 0) {
      return { selected: null };
    }

    const selectedNodeId = Array.from(currentlySelected)[0];
    const node = state.nodes[selectedNodeId];

    // Get the settings component from the node's related configuration
    const SettingsComponent = node.related?.settings;

    return {
      selected: {
        id: selectedNodeId,
        name: node.data.displayName || node.data.name,
        settings: SettingsComponent,
      },
    };
  });

  if (!selected) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  // Extract the settings component for rendering
  const SettingsComponent = selected.settings;

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 uppercase">
          Edit {selected.name}
        </h2>
      </div>

      <div>
        {SettingsComponent ? (
          <SettingsComponent />
        ) : (
          <>
            <CollapsibleBlade title="Content" defaultOpen={true}>
              <p className="text-sm text-gray-500">No content settings available</p>
            </CollapsibleBlade>
            <CollapsibleBlade title="Style" defaultOpen={false}>
              <p className="text-sm text-gray-500">No style settings available</p>
            </CollapsibleBlade>
            <CollapsibleBlade title="Advanced" defaultOpen={false}>
              <p className="text-sm text-gray-500">No advanced settings available</p>
            </CollapsibleBlade>
          </>
        )}
      </div>
    </div>
  );
};
