/**
 * Puck to Craft.js Migration Utility
 * Converts legacy Puck page data format to Craft.js format
 */

/**
 * Legacy Puck widget format
 */
interface PuckWidget {
  type: string;
  props?: Record<string, any>;
  children?: PuckWidget[];
}

/**
 * Legacy Puck page format
 */
interface PuckPageData {
  widgets?: PuckWidget[];
  content?: any;
}

/**
 * Convert a Puck widget to a Craft.js node
 */
function convertPuckWidgetToCraftNode(
  widget: PuckWidget,
  parentId: string | null = null
): { node: any; children: string[] } {
  const nodeId = `node_${Math.random().toString(36).substr(2, 9)}`;
  const children: string[] = [];

  // Map Puck component types to Craft.js component types
  const componentTypeMap: Record<string, string> = {
    section: "Section",
    container: "Container",
    column: "Column",
    heading: "Heading",
    text: "Text",
    paragraph: "Text",
    image: "Image",
    video: "Video",
    button: "Button",
    icon: "Icon",
    iconBox: "IconBox",
    imageBox: "ImageBox",
    spacer: "Spacer",
    divider: "Divider",
  };

  const craftComponentType = componentTypeMap[widget.type?.toLowerCase()] || widget.type;

  // Convert props
  const props = convertPuckPropsTocraft(widget.props || {}, widget.type);

  // Handle children
  if (widget.children && Array.isArray(widget.children)) {
    widget.children.forEach((child) => {
      // Recursively convert children
      // In a full implementation, you'd build the complete node tree
      children.push(`child_${Math.random().toString(36).substr(2, 9)}`);
    });
  }

  const node: any = {
    type: {
      resolvedName: craftComponentType,
    },
    props,
    parent: parentId,
    displayName: craftComponentType,
    custom: {},
    hidden: false,
  };

  return { node, children };
}

/**
 * Convert Puck props to Craft.js props
 * Maps old prop names to new ones based on component type
 */
function convertPuckPropsTocraft(puckProps: Record<string, any>, componentType: string): Record<string, any> {
  const crafProps: Record<string, any> = { ...puckProps };

  // Component-specific prop mappings
  switch (componentType?.toLowerCase()) {
    case "text":
    case "paragraph":
      // Map 'content' to 'text'
      if (crafProps.content) {
        crafProps.text = crafProps.content;
        delete crafProps.content;
      }
      break;

    case "heading":
      // Map 'title' to 'text' if needed
      if (crafProps.title) {
        crafProps.text = crafProps.title;
        delete crafProps.title;
      }
      break;

    case "image":
      // Map 'src' to stay the same, but ensure 'alt' is set
      if (!crafProps.alt) {
        crafProps.alt = "Image";
      }
      break;

    case "video":
      // Map 'url' to 'videoUrl'
      if (crafProps.url && !crafProps.videoUrl) {
        crafProps.videoUrl = crafProps.url;
        delete crafProps.url;
      }
      break;

    case "button":
      // Map 'label' to 'text'
      if (crafProps.label) {
        crafProps.text = crafProps.label;
        delete crafProps.label;
      }
      // Map 'url' to 'href'
      if (crafProps.url && !crafProps.href) {
        crafProps.href = crafProps.url;
        delete crafProps.url;
      }
      break;
  }

  return crafProps;
}

/**
 * Convert an entire Puck page to Craft.js format
 * Creates a basic structure with a ROOT container
 */
export function convertPuckToCraft(puckData: PuckPageData | any): any {
  // Handle various input formats
  const widgets = puckData.widgets || puckData.content?.widgets || [];

  if (!Array.isArray(widgets) || widgets.length === 0) {
    // Return empty Craft.js structure
    return {
      ROOT: {
        type: {
          resolvedName: "Container",
        },
        props: {
          direction: "column",
          gap: "20px",
          justifyContent: "flex-start",
          alignItems: "stretch",
          backgroundColor: "transparent",
          padding: {},
          margin: {},
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "#000000",
          borderRadius: "0px",
        },
        parent: null,
        displayName: "Container",
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    };
  }

  // Build the node tree
  const nodes: Record<string, any> = {};
  const rootChildren: string[] = [];

  widgets.forEach((widget: PuckWidget) => {
    const { node, children } = convertPuckWidgetToCraftNode(widget, "ROOT");
    const nodeId = `node_${Math.random().toString(36).substr(2, 9)}`;
    nodes[nodeId] = node;
    rootChildren.push(nodeId);
  });

  // Create ROOT container
  const craftNodes: any = {
    ROOT: {
      type: {
        resolvedName: "Container",
      },
      props: {
        direction: "column",
        gap: "20px",
        justifyContent: "flex-start",
        alignItems: "stretch",
        backgroundColor: "transparent",
        padding: {},
        margin: {},
        borderWidth: "0px",
        borderStyle: "solid",
        borderColor: "#000000",
        borderRadius: "0px",
      },
      parent: null,
      displayName: "Container",
      custom: {},
      hidden: false,
      nodes: rootChildren,
      linkedNodes: {},
    },
  };

  // Merge all nodes
  return {
    ...craftNodes,
    ...nodes,
  };
}

/**
 * Convert Craft.js data back to Puck format (reverse migration)
 * Useful for export/backup purposes
 */
export function convertCraftToPuck(craftData: any): any {
  const widgets: PuckWidget[] = [];

  // Traverse ROOT node's children
  const rootNode = craftData.ROOT;
  if (rootNode.nodes && Array.isArray(rootNode.nodes)) {
    rootNode.nodes.forEach((nodeId: string) => {
      const node = craftData[nodeId];
      if (node) {
        const puckWidget = convertCraftNodeToPuckWidget(node, craftData);
        widgets.push(puckWidget);
      }
    });
  }

  return {
    widgets,
    version: "1.0.0",
    convertedAt: new Date().toISOString(),
  };
}

/**
 * Convert a single Craft.js node to Puck widget format
 */
function convertCraftNodeToPuckWidget(node: any, allNodes: any): PuckWidget {
  const puckWidget: PuckWidget = {
    type: node.type.resolvedName,
    props: { ...node.props },
  };

  // Reverse prop mappings
  const componentType = node.type.resolvedName;
  switch (componentType) {
    case "Text":
      if (puckWidget.props?.text) {
        puckWidget.props.content = puckWidget.props.text;
        delete puckWidget.props.text;
      }
      break;
    case "Video":
      if (puckWidget.props?.videoUrl) {
        puckWidget.props.url = puckWidget.props.videoUrl;
        delete puckWidget.props.videoUrl;
      }
      break;
    case "Button":
      if (puckWidget.props?.text) {
        puckWidget.props.label = puckWidget.props.text;
        delete puckWidget.props.text;
      }
      if (puckWidget.props?.href) {
        puckWidget.props.url = puckWidget.props.href;
        delete puckWidget.props.href;
      }
      break;
  }

  // Handle children if any
  if (node.nodes && Array.isArray(node.nodes)) {
    puckWidget.children = node.nodes
      .map((childId: string) => convertCraftNodeToPuckWidget(allNodes[childId], allNodes))
      .filter(Boolean);
  }

  return puckWidget;
}

/**
 * Validate if data can be migrated
 */
export function validatePuckData(data: any): boolean {
  if (!data) return false;

  // Check if it has the expected structure
  const hasWidgets = data.widgets || data.content?.widgets;
  return hasWidgets !== undefined;
}

/**
 * Get migration summary
 */
export function getMigrationSummary(puckData: PuckPageData, craftData: any) {
  const puckWidgets = puckData.widgets || puckData.content?.widgets || [];
  const craftNodeCount = Object.keys(craftData).length;

  return {
    sourcePuckWidgets: puckWidgets.length,
    targetCraftNodes: craftNodeCount,
    status: "completed",
    timestamp: new Date().toISOString(),
  };
}
