/**
 * Component Resolver for Craft.js
 * Maps component names to their definitions for dynamic rendering
 */

import { Container } from "../widgets/layout/Container";
import { Section } from "../widgets/layout/Section";
import { Column } from "../widgets/layout/Column";
import { InnerSection } from "../widgets/layout/InnerSection";
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

export type ComponentName =
  | "Container"
  | "Section"
  | "Column"
  | "InnerSection"
  | "Spacer"
  | "Divider"
  | "Heading"
  | "Text"
  | "Image"
  | "Video"
  | "Button"
  | "Icon"
  | "IconBox"
  | "ImageBox";

const COMPONENT_MAP: Record<ComponentName, React.ElementType> = {
  // Layout
  Container,
  Section,
  Column,
  InnerSection,
  Spacer,
  Divider,
  // Basic
  Heading,
  Text,
  Image,
  Video,
  Button,
  Icon,
  IconBox,
  ImageBox,
};

/**
 * Get a component by name
 * @param name - The component name
 * @returns The component or null if not found
 */
export function getComponent(name: string): React.ElementType | null {
  return COMPONENT_MAP[name as ComponentName] || null;
}

/**
 * Get all available component names
 */
export function getAvailableComponents(): ComponentName[] {
  return Object.keys(COMPONENT_MAP) as ComponentName[];
}

/**
 * Check if a component exists
 */
export function hasComponent(name: string): boolean {
  return name in COMPONENT_MAP;
}

/**
 * Get components grouped by category
 */
export function getComponentsByCategory(): Record<string, ComponentName[]> {
  return {
    Layout: ["Container", "Section", "Column", "InnerSection", "Spacer", "Divider"],
    Basic: ["Heading", "Text", "Image", "Video", "Button", "Icon", "IconBox", "ImageBox"],
  };
}

export default COMPONENT_MAP;
