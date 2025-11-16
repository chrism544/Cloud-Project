"use client";
import React from "react";
import { useEditor, Element } from "@craftjs/core";
import {
  Box,
  Columns2,
  Minus,
  Square,
  Type,
  Image as ImageIcon,
  Video as VideoIcon,
  MousePointerClick,
  Star,
  Package,
  Layout,
} from "lucide-react";
import { Container } from "../widgets/layout/Container";
import { Section } from "../widgets/layout/Section";
import { Column } from "../widgets/layout/Column";
import { Spacer } from "../widgets/layout/Spacer";
import { Divider } from "../widgets/layout/Divider";
import { Heading } from "../widgets/basic/Heading";
import { Text } from "../widgets/basic/Text";
import { Image } from "../widgets/basic/Image";
import { Video } from "../widgets/basic/Video";
import { Button } from "../widgets/basic/Button";
import { Icon } from "../widgets/basic/Icon";
import { IconBox } from "../widgets/basic/IconBox";
import { ImageBox } from "../widgets/basic/ImageBox";

interface WidgetCategory {
  title: string;
  widgets: Array<{
    name: string;
    displayName: string;
    icon: React.ElementType;
    component: React.ElementType;
  }>;
}

export const Toolbox = () => {
  const { connectors, query } = useEditor();

  // Widget categories following Elementor structure
  const categories: WidgetCategory[] = [
    {
      title: "Layout",
      widgets: [
        { name: "Section", displayName: "Section", icon: Layout, component: Section },
        { name: "Container", displayName: "Container", icon: Box, component: Container },
        { name: "Column", displayName: "Column", icon: Columns2, component: Column },
        { name: "Spacer", displayName: "Spacer", icon: Minus, component: Spacer },
        { name: "Divider", displayName: "Divider", icon: Minus, component: Divider },
      ],
    },
    {
      title: "Basic",
      widgets: [
        { name: "Heading", displayName: "Heading", icon: Type, component: Heading },
        { name: "Text", displayName: "Text Editor", icon: Type, component: Text },
        { name: "Image", displayName: "Image", icon: ImageIcon, component: Image },
        { name: "Video", displayName: "Video", icon: VideoIcon, component: Video },
        { name: "Button", displayName: "Button", icon: MousePointerClick, component: Button },
        { name: "Icon", displayName: "Icon", icon: Star, component: Icon },
        { name: "IconBox", displayName: "Icon Box", icon: Package, component: IconBox },
        { name: "ImageBox", displayName: "Image Box", icon: Square, component: ImageBox },
      ],
    },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 uppercase">Widgets</h2>
      </div>

      <div className="p-3 space-y-4">
        {categories.map((category) => (
          <div key={category.title}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
              {category.title}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {category.widgets.map((widget) => {
                const Icon = widget.icon;
                // Get canvas property from widget's craft config
                return (
                  <div
                    key={widget.name}
                    ref={(ref) => 
                      ref && connectors.create(ref, React.createElement(widget.component))
                    }
                    className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-grab active:cursor-grabbing border border-gray-700 hover:border-gray-600 w-full"
                    role="button"
                    tabIndex={0}
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-300">{widget.displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
