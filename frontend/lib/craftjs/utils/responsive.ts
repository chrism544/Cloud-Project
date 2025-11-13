/**
 * Responsive Utilities
 *
 * Handles breakpoint detection and responsive behavior.
 */

import { ResponsiveValue } from "./cssGenerator";

// ==================== BREAKPOINTS ====================

export const breakpoints = {
  mobile: { max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024 },
};

export type DeviceType = "desktop" | "tablet" | "mobile";

// ==================== DEVICE DETECTION ====================

/**
 * Get current device type based on window width
 */
export const getCurrentDevice = (): DeviceType => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;

  if (width < breakpoints.mobile.max + 1) {
    return "mobile";
  } else if (width >= breakpoints.tablet.min && width <= breakpoints.tablet.max) {
    return "tablet";
  } else {
    return "desktop";
  }
};

/**
 * Check if current device matches given type
 */
export const isDevice = (deviceType: DeviceType): boolean => {
  return getCurrentDevice() === deviceType;
};

// ==================== RESPONSIVE VISIBILITY ====================

/**
 * Check if element should be visible on current device
 */
export const shouldShowElement = (responsive?: ResponsiveValue): boolean => {
  if (!responsive) return true;

  const device = getCurrentDevice();
  return responsive[device].visible;
};

/**
 * Apply responsive styles to an element
 */
export const applyResponsiveStyles = (element: HTMLElement, responsive?: ResponsiveValue): void => {
  if (!element || !responsive) return;

  const device = getCurrentDevice();

  // Handle visibility
  if (!responsive[device].visible) {
    element.style.display = "none";
  } else {
    // Remove display: none if previously hidden
    if (element.style.display === "none") {
      element.style.display = "";
    }
  }

  // Apply custom CSS for current device
  const customCSS = responsive[device].customCSS;
  if (customCSS) {
    // Parse custom CSS and apply as inline styles
    // Note: This is a simplified implementation
    // For complex CSS, consider injecting a <style> tag instead
    try {
      const styles = parseCustomCSS(customCSS);
      Object.assign(element.style, styles);
    } catch (error) {
      console.warn("Failed to parse custom CSS:", error);
    }
  }
};

/**
 * Simple CSS parser for custom CSS strings
 * Converts "color: red; font-size: 16px;" to { color: "red", fontSize: "16px" }
 */
const parseCustomCSS = (css: string): Record<string, string> => {
  const styles: Record<string, string> = {};

  // Split by semicolon and parse each declaration
  const declarations = css.split(";").filter((d) => d.trim());

  for (const declaration of declarations) {
    const [property, value] = declaration.split(":").map((s) => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelProperty] = value;
    }
  }

  return styles;
};

// ==================== RESPONSIVE HOOKS ====================

/**
 * React hook to get current device type (updates on window resize)
 * Note: Simplified to avoid React dependency in utility file
 */
export const useDevice = (): DeviceType => {
  if (typeof window === "undefined") return "desktop";
  return getCurrentDevice();
};

// ==================== MEDIA QUERIES ====================

/**
 * Generate media query string for a device type
 */
export const getMediaQuery = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case "mobile":
      return `(max-width: ${breakpoints.mobile.max}px)`;
    case "tablet":
      return `(min-width: ${breakpoints.tablet.min}px) and (max-width: ${breakpoints.tablet.max}px)`;
    case "desktop":
      return `(min-width: ${breakpoints.desktop.min}px)`;
    default:
      return "";
  }
};

/**
 * Check if media query matches
 */
export const matchesMediaQuery = (deviceType: DeviceType): boolean => {
  if (typeof window === "undefined") return false;

  const query = getMediaQuery(deviceType);
  return window.matchMedia(query).matches;
};

// ==================== RESPONSIVE CSS GENERATION ====================

/**
 * Generate CSS with media queries for responsive settings
 */
export const generateResponsiveCSS = (
  selector: string,
  responsive: ResponsiveValue
): string => {
  const cssRules: string[] = [];

  // Desktop
  if (responsive.desktop.customCSS) {
    cssRules.push(`
      @media ${getMediaQuery("desktop")} {
        ${selector} {
          ${responsive.desktop.customCSS}
        }
      }
    `);
  }

  // Tablet
  if (responsive.tablet.customCSS) {
    cssRules.push(`
      @media ${getMediaQuery("tablet")} {
        ${selector} {
          ${responsive.tablet.customCSS}
        }
      }
    `);
  }

  // Mobile
  if (responsive.mobile.customCSS) {
    cssRules.push(`
      @media ${getMediaQuery("mobile")} {
        ${selector} {
          ${responsive.mobile.customCSS}
        }
      }
    `);
  }

  return cssRules.join("\n");
};

/**
 * Inject responsive CSS into document
 */
export const injectResponsiveCSS = (
  elementId: string,
  responsive: ResponsiveValue
): void => {
  if (typeof document === "undefined") return;

  const styleId = `responsive-${elementId}`;
  let styleTag = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  const selector = `[data-element-id="${elementId}"]`;
  const css = generateResponsiveCSS(selector, responsive);
  styleTag.innerHTML = css;
};

// ==================== EXPORT ALL ====================

export default {
  breakpoints,
  getCurrentDevice,
  isDevice,
  shouldShowElement,
  applyResponsiveStyles,
  useDevice,
  getMediaQuery,
  matchesMediaQuery,
  generateResponsiveCSS,
  injectResponsiveCSS,
};
