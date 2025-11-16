/**
 * CSS Generator Utilities
 *
 * Converts widget settings into CSS strings for inline styles and style tags.
 */

// ==================== INTERFACES ====================

export interface BackgroundValue {
  type: "none" | "color" | "gradient" | "image" | "video";
  color?: string;
  gradient?: {
    type: "linear" | "radial";
    angle?: number;
    stops: Array<{ color: string; position: number }>;
  };
  image?: {
    url: string;
    position?: string;
    size?: string;
    repeat?: string;
    attachment?: string;
  };
  video?: {
    url: string;
    fallbackImage?: string;
  };
}

export interface TransformValue {
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  translateX?: string;
  translateY?: string;
  origin?: string;
}

export interface FiltersValue {
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  hueRotate?: number;
  grayscale?: number;
  sepia?: number;
}

export interface AnimationValue {
  entrance?: {
    type: "fadeIn" | "slideInUp" | "slideInDown" | "slideInLeft" | "slideInRight" | "zoomIn" | "bounceIn" | "rollIn" | "flipInX" | "flipInY";
    duration: number;
    delay: number;
    easing: string;
  };
  hover?: {
    transform?: TransformValue;
    filters?: FiltersValue;
    transition: number;
  };
  scroll?: {
    parallax?: number;
    fade?: boolean;
    scale?: boolean;
  };
}

export interface ResponsiveValue {
  desktop: {
    visible: boolean;
    customCSS?: string;
  };
  tablet: {
    visible: boolean;
    customCSS?: string;
  };
  mobile: {
    visible: boolean;
    customCSS?: string;
  };
}

// ==================== BACKGROUND ====================

export const generateBackgroundCSS = (background?: BackgroundValue): string => {
  if (!background || background.type === "none") return "";

  switch (background.type) {
    case "color":
      return background.color || "";

    case "gradient":
      if (!background.gradient) return "";
      const { type, angle, stops } = background.gradient;

      if (type === "linear") {
        const gradientStops = stops
          .map((stop) => `${stop.color} ${stop.position}%`)
          .join(", ");
        return `linear-gradient(${angle || 180}deg, ${gradientStops})`;
      } else {
        const gradientStops = stops
          .map((stop) => `${stop.color} ${stop.position}%`)
          .join(", ");
        return `radial-gradient(circle, ${gradientStops})`;
      }

    case "image":
      if (!background.image) return "";
      const { url, position, size, repeat, attachment } = background.image;
      return `url(${url}) ${position || "center"} / ${size || "cover"} ${repeat || "no-repeat"} ${attachment || "scroll"}`;

    case "video":
      // Video backgrounds require special handling (background element with <video> tag)
      return "";

    default:
      return "";
  }
};

// ==================== TRANSFORM ====================

export const generateTransformCSS = (transform?: TransformValue): string => {
  if (!transform) return "";

  const transforms: string[] = [];

  if (transform.rotate) transforms.push(`rotate(${transform.rotate}deg)`);
  if (transform.rotateX) transforms.push(`rotateX(${transform.rotateX}deg)`);
  if (transform.rotateY) transforms.push(`rotateY(${transform.rotateY}deg)`);
  if (transform.scale) transforms.push(`scale(${transform.scale})`);
  if (transform.scaleX) transforms.push(`scaleX(${transform.scaleX})`);
  if (transform.scaleY) transforms.push(`scaleY(${transform.scaleY})`);
  if (transform.skewX) transforms.push(`skewX(${transform.skewX}deg)`);
  if (transform.skewY) transforms.push(`skewY(${transform.skewY}deg)`);
  if (transform.translateX) transforms.push(`translateX(${transform.translateX})`);
  if (transform.translateY) transforms.push(`translateY(${transform.translateY})`);

  return transforms.join(" ");
};

export const generateTransformOriginCSS = (transform?: TransformValue): string => {
  return transform?.origin || "center";
};

// ==================== FILTERS ====================

export const generateFiltersCSS = (filters?: FiltersValue): string => {
  if (!filters) return "";

  const filterList: string[] = [];

  if (filters.blur) filterList.push(`blur(${filters.blur}px)`);
  if (filters.brightness) filterList.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast) filterList.push(`contrast(${filters.contrast}%)`);
  if (filters.saturate) filterList.push(`saturate(${filters.saturate}%)`);
  if (filters.hueRotate) filterList.push(`hue-rotate(${filters.hueRotate}deg)`);
  if (filters.grayscale) filterList.push(`grayscale(${filters.grayscale}%)`);
  if (filters.sepia) filterList.push(`sepia(${filters.sepia}%)`);

  return filterList.join(" ");
};

// ==================== ANIMATION ====================

export const generateAnimationCSS = (animation?: AnimationValue): Record<string, any> => {
  if (!animation?.entrance) return {};

  const { type, duration, delay, easing } = animation.entrance;

  return {
    animation: `${type} ${duration}ms ${easing} ${delay}ms`,
    animationFillMode: "both",
  };
};

export const generateHoverCSS = (hover?: AnimationValue["hover"]): string => {
  if (!hover) return "";

  const styles: string[] = [];

  if (hover.transform) {
    const transform = generateTransformCSS(hover.transform);
    if (transform) styles.push(`transform: ${transform}`);
  }

  if (hover.filters) {
    const filters = generateFiltersCSS(hover.filters);
    if (filters) styles.push(`filter: ${filters}`);
  }

  if (hover.transition) {
    styles.push(`transition: all ${hover.transition}ms ease`);
  }

  return styles.join("; ");
};

// ==================== SPACING ====================

export const generatePaddingString = (padding: {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}): string => {
  return `${padding.top || "0px"} ${padding.right || "0px"} ${padding.bottom || "0px"} ${padding.left || "0px"}`;
};

export const generateMarginString = (margin: {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}): string => {
  return `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;
};

// ==================== BORDER ====================

export interface BorderValue {
  width?: string;
  style?: string;
  color?: string;
  radius?: {
    topLeft?: string;
    topRight?: string;
    bottomRight?: string;
    bottomLeft?: string;
  };
}

export const generateBorderCSS = (border?: BorderValue): string => {
  if (!border) return "";
  return `${border.width || "0px"} ${border.style || "solid"} ${border.color || "#000000"}`;
};

export const generateBorderRadiusCSS = (radius?: BorderValue["radius"]): string => {
  if (!radius) return "";
  return `${radius.topLeft || "0px"} ${radius.topRight || "0px"} ${radius.bottomRight || "0px"} ${radius.bottomLeft || "0px"}`;
};

// ==================== BOX SHADOW ====================

export interface BoxShadowValue {
  horizontal?: string;
  vertical?: string;
  blur?: string;
  spread?: string;
  color?: string;
  inset?: boolean;
}

export const generateBoxShadowCSS = (boxShadow?: BoxShadowValue): string => {
  if (!boxShadow) return "";

  const { horizontal, vertical, blur, spread, color, inset } = boxShadow;

  const parts = [
    inset ? "inset" : "",
    horizontal || "0px",
    vertical || "0px",
    blur || "0px",
    spread || "0px",
    color || "rgba(0, 0, 0, 0.1)",
  ].filter(Boolean);

  return parts.join(" ");
};

// ==================== TYPOGRAPHY ====================

export interface TypographyValue {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  textDecoration?: string;
  fontStyle?: string;
  color?: string;
}

export const generateTypographyCSS = (typography?: TypographyValue): Record<string, any> => {
  if (!typography) return {};

  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    textTransform: typography.textTransform,
    textDecoration: typography.textDecoration,
    fontStyle: typography.fontStyle,
    color: typography.color,
  };
};

// ==================== RESPONSIVE ====================

export const shouldShowOnDevice = (
  responsive?: ResponsiveValue,
  deviceType?: "desktop" | "tablet" | "mobile"
): boolean => {
  if (!responsive || !deviceType) return true;

  return responsive[deviceType].visible;
};

export const getResponsiveCSS = (
  responsive?: ResponsiveValue,
  deviceType?: "desktop" | "tablet" | "mobile"
): string => {
  if (!responsive || !deviceType) return "";

  return responsive[deviceType].customCSS || "";
};

// ==================== EXPORT ALL ====================

export default {
  generateBackgroundCSS,
  generateTransformCSS,
  generateTransformOriginCSS,
  generateFiltersCSS,
  generateAnimationCSS,
  generateHoverCSS,
  generatePaddingString,
  generateMarginString,
  generateBorderCSS,
  generateBorderRadiusCSS,
  generateBoxShadowCSS,
  generateTypographyCSS,
  shouldShowOnDevice,
  getResponsiveCSS,
};
