/**
 * Animation Utilities
 *
 * Handles CSS animations, keyframes, and animation effects.
 */

import { AnimationValue } from "./cssGenerator";

// ==================== ANIMATION KEYFRAMES ====================

/**
 * Predefined CSS keyframes for entrance animations
 */
export const animationKeyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  slideInDown: `
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  bounceIn: `
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }
  `,
  rollIn: `
    @keyframes rollIn {
      from {
        opacity: 0;
        transform: translateX(-100%) rotate(-120deg);
      }
      to {
        opacity: 1;
        transform: translateX(0) rotate(0);
      }
    }
  `,
  flipInX: `
    @keyframes flipInX {
      from {
        opacity: 0;
        transform: perspective(400px) rotateX(90deg);
      }
      to {
        opacity: 1;
        transform: perspective(400px) rotateX(0);
      }
    }
  `,
  flipInY: `
    @keyframes flipInY {
      from {
        opacity: 0;
        transform: perspective(400px) rotateY(90deg);
      }
      to {
        opacity: 1;
        transform: perspective(400px) rotateY(0);
      }
    }
  `,
};

/**
 * Easing functions for animations
 */
export const easingFunctions = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeInCirc: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
  easeOutCirc: "cubic-bezier(0.075, 0.82, 0.165, 1)",
  easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
  easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
  easeInOutExpo: "cubic-bezier(1, 0, 0, 1)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeInQuart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
  easeInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  easeOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
  easeInOutQuint: "cubic-bezier(0.86, 0, 0.07, 1)",
  easeInSine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
  easeOutSine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
  easeInOutSine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  easeInBack: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
  easeOutBack: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  easeInOutBack: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

// ==================== ANIMATION INJECTION ====================

/**
 * Inject animation keyframes into document
 */
export const injectAnimationKeyframes = (): void => {
  if (typeof document === "undefined") return;

  const styleId = "craftjs-animations";
  let styleTag = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);

    // Inject all keyframes
    const allKeyframes = Object.values(animationKeyframes).join("\n");
    styleTag.innerHTML = allKeyframes;
  }
};

// ==================== ENTRANCE ANIMATIONS ====================

/**
 * Apply entrance animation to an element
 */
export const applyEntranceAnimation = (
  element: HTMLElement,
  animation?: AnimationValue["entrance"]
): void => {
  if (!element || !animation) return;

  // Ensure keyframes are injected
  injectAnimationKeyframes();

  const { type, duration, delay, easing } = animation;

  // Apply animation
  element.style.animation = `${type} ${duration}ms ${easing} ${delay}ms both`;
};

/**
 * Remove entrance animation from an element
 */
export const removeEntranceAnimation = (element: HTMLElement): void => {
  if (!element) return;
  element.style.animation = "";
};

// ==================== HOVER ANIMATIONS ====================

/**
 * Apply hover styles to an element
 */
export const applyHoverStyles = (
  element: HTMLElement,
  hover?: AnimationValue["hover"],
  isHovered: boolean = false
): void => {
  if (!element || !hover) return;

  const { transform, filters, transition } = hover;

  if (isHovered) {
    // Apply hover state
    if (transform) {
      const transformValue = generateHoverTransform(transform);
      element.style.transform = transformValue;
    }

    if (filters) {
      const filterValue = generateHoverFilters(filters);
      element.style.filter = filterValue;
    }
  } else {
    // Reset to normal state
    element.style.transform = "";
    element.style.filter = "";
  }

  // Always set transition
  if (transition) {
    element.style.transition = `all ${transition}ms ease`;
  }
};

/**
 * Generate transform string for hover effects
 */
const generateHoverTransform = (transform: any): string => {
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

/**
 * Generate filter string for hover effects
 */
const generateHoverFilters = (filters: any): string => {
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

/**
 * Add hover listeners to an element
 */
export const attachHoverListeners = (
  element: HTMLElement,
  hover?: AnimationValue["hover"]
): (() => void) => {
  if (!element || !hover) return () => {};

  const handleMouseEnter = () => applyHoverStyles(element, hover, true);
  const handleMouseLeave = () => applyHoverStyles(element, hover, false);

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// ==================== SCROLL ANIMATIONS ====================

/**
 * Apply scroll-based animation to an element
 */
export const applyScrollAnimation = (
  element: HTMLElement,
  scroll?: AnimationValue["scroll"]
): void => {
  if (!element || !scroll) return;

  const { parallax, fade, scale } = scroll;

  // Get scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const elementTop = element.getBoundingClientRect().top + scrollTop;
  const windowHeight = window.innerHeight;

  // Calculate scroll progress (0 to 1)
  const scrollProgress = Math.max(
    0,
    Math.min(1, (scrollTop + windowHeight - elementTop) / windowHeight)
  );

  // Apply parallax
  if (parallax) {
    const parallaxOffset = scrollProgress * parallax;
    element.style.transform = `translateY(${parallaxOffset}px)`;
  }

  // Apply fade
  if (fade) {
    element.style.opacity = scrollProgress.toString();
  }

  // Apply scale
  if (scale) {
    const scaleValue = 0.8 + scrollProgress * 0.2; // Scale from 0.8 to 1.0
    element.style.transform = `scale(${scaleValue})`;
  }
};

/**
 * Attach scroll listener to update scroll animations
 */
export const attachScrollListener = (
  element: HTMLElement,
  scroll?: AnimationValue["scroll"]
): (() => void) => {
  if (!element || !scroll) return () => {};

  const handleScroll = () => applyScrollAnimation(element, scroll);

  window.addEventListener("scroll", handleScroll);
  // Initial call
  handleScroll();

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

// ==================== INTERSECTION OBSERVER ====================

/**
 * Trigger entrance animation when element enters viewport
 */
export const observeEntranceAnimation = (
  element: HTMLElement,
  animation?: AnimationValue["entrance"],
  options?: IntersectionObserverInit
): (() => void) => {
  if (!element || !animation) return () => {};

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: "0px",
    ...options,
  };

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        applyEntranceAnimation(element, animation);
        hasAnimated = true;
        observer.unobserve(element);
      }
    });
  }, defaultOptions);

  observer.observe(element);

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
};

// ==================== REACT HOOKS ====================

/**
 * React hook to apply entrance animation when element enters viewport
 * Note: These hooks are exported but not used internally to avoid React dependency
 */
export const useEntranceAnimation = (
  animation?: AnimationValue["entrance"],
  options?: IntersectionObserverInit
): { ref: any } => {
  return { ref: null };
};

/**
 * React hook to apply hover animation
 */
export const useHoverAnimation = (hover?: AnimationValue["hover"]): { ref: any } => {
  return { ref: null };
};

/**
 * React hook to apply scroll animation
 */
export const useScrollAnimation = (scroll?: AnimationValue["scroll"]): { ref: any } => {
  return { ref: null };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate CSS animation string
 */
export const generateAnimationCSS = (animation?: AnimationValue["entrance"]): string => {
  if (!animation) return "";

  const { type, duration, delay, easing } = animation;
  return `${type} ${duration}ms ${easing} ${delay}ms both`;
};

/**
 * Check if an animation type exists
 */
export const isValidAnimationType = (
  type: string
): type is keyof typeof animationKeyframes => {
  return type in animationKeyframes;
};

/**
 * Get all available animation types
 */
export const getAvailableAnimations = (): string[] => {
  return Object.keys(animationKeyframes);
};

/**
 * Get all available easing functions
 */
export const getAvailableEasings = (): string[] => {
  return Object.keys(easingFunctions);
};

// ==================== EXPORT ALL ====================

export default {
  animationKeyframes,
  easingFunctions,
  injectAnimationKeyframes,
  applyEntranceAnimation,
  removeEntranceAnimation,
  applyHoverStyles,
  attachHoverListeners,
  applyScrollAnimation,
  attachScrollListener,
  observeEntranceAnimation,
  useEntranceAnimation,
  useHoverAnimation,
  useScrollAnimation,
  generateAnimationCSS,
  isValidAnimationType,
  getAvailableAnimations,
  getAvailableEasings,
};
