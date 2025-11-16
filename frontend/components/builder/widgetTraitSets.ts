/**
 * Pre-configured trait sets for different widget categories
 * This provides consistent, comprehensive settings across all widgets
 */

import {
  TypographyTraits,
  ColorTraits,
  SpacingTraits,
  BorderTraits,
  BoxShadowTraits,
  BackgroundTraits,
  DimensionTraits,
  PositionTraits,
  ResponsiveTraits,
  CustomCSSTraits,
  AlignmentTraits,
} from './commonTraits';

/**
 * Basic Style Traits - For simple content widgets
 * (Text, headings, icons, images, etc.)
 */
export function getBasicStyleTraits() {
  return [
    // Colors Section
    ColorTraits.textColor(),
    ColorTraits.backgroundColor(),

    // Spacing Section
    SpacingTraits.marginTop(),
    SpacingTraits.marginBottom(),
    SpacingTraits.paddingTop(),
    SpacingTraits.paddingBottom(),

    // Border Section
    BorderTraits.borderWidth(),
    BorderTraits.borderStyle(),
    ColorTraits.borderColor(),
    BorderTraits.borderRadius(),

    // Box Shadow Section
    BoxShadowTraits.shadowH(),
    BoxShadowTraits.shadowV(),
    BoxShadowTraits.shadowBlur(),
    BoxShadowTraits.shadowColor(),
  ];
}

/**
 * Typography Traits - For text-heavy widgets
 * (Headings, paragraphs, blockquotes, etc.)
 */
export function getTypographyTraits() {
  return [
    // Typography Section
    TypographyTraits.fontFamily(),
    TypographyTraits.fontSize(),
    TypographyTraits.fontWeight(),
    TypographyTraits.textTransform(),
    TypographyTraits.fontStyle(),
    TypographyTraits.lineHeight(),
    TypographyTraits.letterSpacing(),
    AlignmentTraits.textAlign(),
  ];
}

/**
 * Layout Traits - For container/layout widgets
 * (Sections, columns, containers, etc.)
 */
export function getLayoutTraits() {
  return [
    // Layout Section
    DimensionTraits.width(),
    DimensionTraits.minHeight(),
    DimensionTraits.maxWidth(),
    DimensionTraits.display(),
    DimensionTraits.overflow(),
  ];
}

/**
 * Advanced Position Traits - For all widgets
 */
export function getPositionTraits() {
  return [
    // Position Section
    PositionTraits.position(),
    PositionTraits.top(),
    PositionTraits.right(),
    PositionTraits.bottom(),
    PositionTraits.left(),
    PositionTraits.zIndex(),
  ];
}

/**
 * Responsive Traits - For all widgets
 */
export function getResponsiveTraits() {
  return [
    // Responsive Section
    ResponsiveTraits.hideDesktop(),
    ResponsiveTraits.hideTablet(),
    ResponsiveTraits.hideMobile(),
    ResponsiveTraits.opacity(),
  ];
}

/**
 * Custom CSS Traits - For all widgets
 */
export function getCustomCSSTraits() {
  return [
    // CSS Section
    CustomCSSTraits.cssClasses(),
    CustomCSSTraits.cssId(),
    CustomCSSTraits.customCSS(),
  ];
}

/**
 * Background Traits - For container widgets
 */
export function getBackgroundTraits() {
  return [
    // Background Section
    BackgroundTraits.backgroundType(),
    ColorTraits.backgroundColor(),
    BackgroundTraits.backgroundImage(),
    BackgroundTraits.backgroundPosition(),
    BackgroundTraits.backgroundSize(),
    BackgroundTraits.backgroundRepeat(),
  ];
}

/**
 * Complete Style Tab for simple content widgets
 */
export function getCompleteStyleTab() {
  return [
    ...getTypographyTraits(),
    ...getBasicStyleTraits(),
    ...getLayoutTraits(),
  ];
}

/**
 * Complete Advanced Tab for all widgets
 */
export function getCompleteAdvancedTab() {
  return [
    ...getPositionTraits(),
    ...getResponsiveTraits(),
    ...getCustomCSSTraits(),
  ];
}

/**
 * Full trait set for content widgets (like blockquote, icon, etc.)
 * Returns traits organized by category and section
 */
export function getContentWidgetTraits(contentTraits: any[] = []) {
  return [
    // Content Tab
    ...contentTraits,

    // Style Tab
    ...getCompleteStyleTab(),

    // Advanced Tab
    ...getCompleteAdvancedTab(),
  ];
}

/**
 * Full trait set for layout widgets (like inner section, container, etc.)
 */
export function getLayoutWidgetTraits(contentTraits: any[] = []) {
  return [
    // Content Tab
    ...contentTraits,

    // Style Tab
    ...getBackgroundTraits(),
    ...getBasicStyleTraits(),
    ...getLayoutTraits(),

    // Advanced Tab
    ...getCompleteAdvancedTab(),
  ];
}
