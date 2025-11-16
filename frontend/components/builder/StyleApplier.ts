/**
 * StyleApplier - Automatic CSS Generation from GrapesJS Traits
 *
 * This utility reads trait values from components and generates CSS that's
 * automatically applied. It handles complex properties like box-shadow,
 * background, responsive visibility, and custom CSS.
 *
 * Usage:
 * const styleApplier = new StyleApplier(editor);
 * styleApplier.init(); // Start listening for changes
 */

export class StyleApplier {
  private editor: any;
  private styleElement: HTMLStyleElement | null = null;
  private componentStyles: Map<string, string> = new Map();

  constructor(editor: any) {
    this.editor = editor;
  }

  /**
   * Initialize the style applier
   * Sets up event listeners for component changes
   */
  init(): void {
    // Create style element for injecting CSS
    this.createStyleElement();

    // Listen for component updates
    this.editor.on('component:update', (component: any) => {
      this.updateComponentStyles(component);
    });

    // Listen for component creation
    this.editor.on('component:add', (component: any) => {
      this.updateComponentStyles(component);
    });

    // Listen for component removal
    this.editor.on('component:remove', (component: any) => {
      this.removeComponentStyles(component);
    });

    // Listen for trait changes
    this.editor.on('component:update:attributes', (component: any) => {
      this.updateComponentStyles(component);
    });

    // Apply styles to all existing components on init
    this.applyAllStyles();

    console.log('StyleApplier initialized - Auto CSS generation active');
  }

  /**
   * Create style element in document head
   */
  private createStyleElement(): void {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'grapesjs-auto-styles';
    document.head.appendChild(this.styleElement);
  }

  /**
   * Apply styles to all components
   */
  private applyAllStyles(): void {
    const wrapper = this.editor.getWrapper();
    if (!wrapper) return;

    this.processComponent(wrapper);
  }

  /**
   * Recursively process component and its children
   */
  private processComponent(component: any): void {
    this.updateComponentStyles(component);

    const children = component.components();
    if (children) {
      children.forEach((child: any) => this.processComponent(child));
    }
  }

  /**
   * Update styles for a specific component
   */
  private updateComponentStyles(component: any): void {
    const componentId = component.getId();
    const css = this.generateComponentCSS(component);

    if (css) {
      this.componentStyles.set(componentId, css);
    } else {
      this.componentStyles.delete(componentId);
    }

    this.updateStyleElement();
  }

  /**
   * Remove styles for a component
   */
  private removeComponentStyles(component: any): void {
    const componentId = component.getId();
    this.componentStyles.delete(componentId);
    this.updateStyleElement();
  }

  /**
   * Update the style element with all component styles
   */
  private updateStyleElement(): void {
    if (!this.styleElement) return;

    const allCSS = Array.from(this.componentStyles.values()).join('\n\n');
    this.styleElement.textContent = allCSS;
  }

  /**
   * Generate CSS for a component based on its traits/attributes
   */
  private generateComponentCSS(component: any): string {
    const componentId = component.getId();
    const attributes = component.getAttributes();
    const styles: string[] = [];

    // Build CSS rules
    const cssRules: { [key: string]: string } = {};

    // ==================== Typography ====================
    this.applyTypography(attributes, cssRules);

    // ==================== Colors ====================
    this.applyColors(attributes, cssRules);

    // ==================== Spacing ====================
    this.applySpacing(attributes, cssRules);

    // ==================== Border ====================
    this.applyBorder(attributes, cssRules);

    // ==================== Box Shadow ====================
    this.applyBoxShadow(attributes, cssRules);

    // ==================== Background ====================
    this.applyBackground(attributes, cssRules);

    // ==================== Dimensions ====================
    this.applyDimensions(attributes, cssRules);

    // ==================== Position ====================
    this.applyPosition(attributes, cssRules);

    // ==================== Animation ====================
    this.applyAnimation(attributes, cssRules);

    // ==================== Responsive Visibility ====================
    const responsiveCSS = this.applyResponsiveVisibility(attributes, componentId);

    // Convert CSS rules to string
    const mainCSS = this.rulesToCSS(componentId, cssRules);
    const customCSS = this.applyCustomCSS(attributes);

    // Combine all CSS
    const allCSS = [mainCSS, responsiveCSS, customCSS].filter(Boolean).join('\n');

    return allCSS;
  }

  /**
   * Apply typography styles
   */
  private applyTypography(attrs: any, rules: any): void {
    if (attrs['font-family']) rules['font-family'] = attrs['font-family'];
    if (attrs['font-size']) rules['font-size'] = this.addUnit(attrs['font-size'], 'px');
    if (attrs['font-weight']) rules['font-weight'] = attrs['font-weight'];
    if (attrs['text-transform']) rules['text-transform'] = attrs['text-transform'];
    if (attrs['font-style']) rules['font-style'] = attrs['font-style'];
    if (attrs['text-decoration']) rules['text-decoration'] = attrs['text-decoration'];
    if (attrs['line-height']) rules['line-height'] = this.addUnit(attrs['line-height'], '');
    if (attrs['letter-spacing']) rules['letter-spacing'] = this.addUnit(attrs['letter-spacing'], 'px');
    if (attrs['word-spacing']) rules['word-spacing'] = this.addUnit(attrs['word-spacing'], 'px');
    if (attrs['text-align']) rules['text-align'] = attrs['text-align'];
    if (attrs['vertical-align']) rules['vertical-align'] = attrs['vertical-align'];
  }

  /**
   * Apply color styles
   */
  private applyColors(attrs: any, rules: any): void {
    if (attrs['color']) rules['color'] = attrs['color'];
    if (attrs['background-color']) rules['background-color'] = attrs['background-color'];
    if (attrs['border-color']) rules['border-color'] = attrs['border-color'];
  }

  /**
   * Apply spacing styles
   */
  private applySpacing(attrs: any, rules: any): void {
    if (attrs['margin-top']) rules['margin-top'] = this.addUnit(attrs['margin-top'], 'px');
    if (attrs['margin-right']) rules['margin-right'] = this.addUnit(attrs['margin-right'], 'px');
    if (attrs['margin-bottom']) rules['margin-bottom'] = this.addUnit(attrs['margin-bottom'], 'px');
    if (attrs['margin-left']) rules['margin-left'] = this.addUnit(attrs['margin-left'], 'px');

    if (attrs['padding-top']) rules['padding-top'] = this.addUnit(attrs['padding-top'], 'px');
    if (attrs['padding-right']) rules['padding-right'] = this.addUnit(attrs['padding-right'], 'px');
    if (attrs['padding-bottom']) rules['padding-bottom'] = this.addUnit(attrs['padding-bottom'], 'px');
    if (attrs['padding-left']) rules['padding-left'] = this.addUnit(attrs['padding-left'], 'px');
  }

  /**
   * Apply border styles
   */
  private applyBorder(attrs: any, rules: any): void {
    if (attrs['border-width']) rules['border-width'] = this.addUnit(attrs['border-width'], 'px');
    if (attrs['border-style']) rules['border-style'] = attrs['border-style'];
    if (attrs['border-radius']) rules['border-radius'] = this.addUnit(attrs['border-radius'], 'px');

    // Individual border radius corners
    if (attrs['border-top-left-radius']) rules['border-top-left-radius'] = this.addUnit(attrs['border-top-left-radius'], 'px');
    if (attrs['border-top-right-radius']) rules['border-top-right-radius'] = this.addUnit(attrs['border-top-right-radius'], 'px');
    if (attrs['border-bottom-right-radius']) rules['border-bottom-right-radius'] = this.addUnit(attrs['border-bottom-right-radius'], 'px');
    if (attrs['border-bottom-left-radius']) rules['border-bottom-left-radius'] = this.addUnit(attrs['border-bottom-left-radius'], 'px');
  }

  /**
   * Apply box shadow
   */
  private applyBoxShadow(attrs: any, rules: any): void {
    const h = attrs['box-shadow-h'];
    const v = attrs['box-shadow-v'];
    const blur = attrs['box-shadow-blur'];
    const spread = attrs['box-shadow-spread'];
    const color = attrs['box-shadow-color'];
    const position = attrs['box-shadow-position'];

    if (h !== undefined || v !== undefined || blur !== undefined) {
      const parts = [
        position === 'inset' ? 'inset' : '',
        this.addUnit(h || 0, 'px'),
        this.addUnit(v || 0, 'px'),
        this.addUnit(blur || 0, 'px'),
        this.addUnit(spread || 0, 'px'),
        color || 'rgba(0, 0, 0, 0.3)',
      ].filter(Boolean);

      rules['box-shadow'] = parts.join(' ');
    }
  }

  /**
   * Apply background styles
   */
  private applyBackground(attrs: any, rules: any): void {
    const bgType = attrs['background-type'];

    if (bgType === 'image' && attrs['background-image']) {
      rules['background-image'] = `url('${attrs['background-image']}')`;

      if (attrs['background-position']) {
        rules['background-position'] = attrs['background-position'];
      }
      if (attrs['background-size']) {
        rules['background-size'] = attrs['background-size'];
      }
      if (attrs['background-repeat']) {
        rules['background-repeat'] = attrs['background-repeat'];
      }
      if (attrs['background-attachment']) {
        rules['background-attachment'] = attrs['background-attachment'];
      }
    }
  }

  /**
   * Apply dimension styles
   */
  private applyDimensions(attrs: any, rules: any): void {
    if (attrs['width']) rules['width'] = this.addUnit(attrs['width'], 'px');
    if (attrs['height']) rules['height'] = this.addUnit(attrs['height'], 'px');
    if (attrs['min-width']) rules['min-width'] = this.addUnit(attrs['min-width'], 'px');
    if (attrs['max-width']) rules['max-width'] = this.addUnit(attrs['max-width'], 'px');
    if (attrs['min-height']) rules['min-height'] = this.addUnit(attrs['min-height'], 'px');
    if (attrs['max-height']) rules['max-height'] = this.addUnit(attrs['max-height'], 'px');
    if (attrs['display']) rules['display'] = attrs['display'];
    if (attrs['overflow']) rules['overflow'] = attrs['overflow'];

    // Flexbox
    if (attrs['flex-direction']) rules['flex-direction'] = attrs['flex-direction'];
    if (attrs['justify-content']) rules['justify-content'] = attrs['justify-content'];
    if (attrs['align-items']) rules['align-items'] = attrs['align-items'];
    if (attrs['flex-wrap']) rules['flex-wrap'] = attrs['flex-wrap'];
    if (attrs['gap']) rules['gap'] = this.addUnit(attrs['gap'], 'px');
  }

  /**
   * Apply position styles
   */
  private applyPosition(attrs: any, rules: any): void {
    if (attrs['position']) rules['position'] = attrs['position'];
    if (attrs['top']) rules['top'] = this.addUnit(attrs['top'], 'px');
    if (attrs['right']) rules['right'] = this.addUnit(attrs['right'], 'px');
    if (attrs['bottom']) rules['bottom'] = this.addUnit(attrs['bottom'], 'px');
    if (attrs['left']) rules['left'] = this.addUnit(attrs['left'], 'px');
    if (attrs['z-index']) rules['z-index'] = attrs['z-index'];
  }

  /**
   * Apply animation styles
   */
  private applyAnimation(attrs: any, rules: any): void {
    if (attrs['animation-name'] && attrs['animation-name'] !== 'none') {
      rules['animation-name'] = attrs['animation-name'];
    }
    if (attrs['animation-duration']) {
      rules['animation-duration'] = this.addUnit(attrs['animation-duration'], 's');
    }
    if (attrs['animation-delay']) {
      rules['animation-delay'] = this.addUnit(attrs['animation-delay'], 's');
    }
    if (attrs['animation-timing-function']) {
      rules['animation-timing-function'] = attrs['animation-timing-function'];
    }
    if (attrs['animation-iteration-count']) {
      rules['animation-iteration-count'] = attrs['animation-iteration-count'];
    }

    if (attrs['opacity']) rules['opacity'] = attrs['opacity'];
    if (attrs['visibility']) rules['visibility'] = attrs['visibility'];
  }

  /**
   * Apply responsive visibility
   */
  private applyResponsiveVisibility(attrs: any, componentId: string): string {
    const cssRules: string[] = [];

    // Hide on desktop (> 1024px)
    if (attrs['hide-desktop']) {
      cssRules.push(`
@media (min-width: 1025px) {
  [data-gjs-type][data-gjs-id="${componentId}"] {
    display: none !important;
  }
}`.trim());
    }

    // Hide on tablet (768px - 1024px)
    if (attrs['hide-tablet']) {
      cssRules.push(`
@media (min-width: 768px) and (max-width: 1024px) {
  [data-gjs-type][data-gjs-id="${componentId}"] {
    display: none !important;
  }
}`.trim());
    }

    // Hide on mobile (< 768px)
    if (attrs['hide-mobile']) {
      cssRules.push(`
@media (max-width: 767px) {
  [data-gjs-type][data-gjs-id="${componentId}"] {
    display: none !important;
  }
}`.trim());
    }

    return cssRules.join('\n\n');
  }

  /**
   * Apply custom CSS
   */
  private applyCustomCSS(attrs: any): string {
    if (attrs['custom-css']) {
      return attrs['custom-css'];
    }
    return '';
  }

  /**
   * Convert CSS rules object to CSS string
   */
  private rulesToCSS(componentId: string, rules: any): string {
    const entries = Object.entries(rules);
    if (entries.length === 0) return '';

    const cssProperties = entries
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');

    return `
[data-gjs-type][data-gjs-id="${componentId}"] {
${cssProperties}
}`.trim();
  }

  /**
   * Add unit to value if needed
   */
  private addUnit(value: any, defaultUnit: string): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }

    // If value is already a string with units, return as is
    if (typeof value === 'string' && (
      value.includes('px') ||
      value.includes('em') ||
      value.includes('rem') ||
      value.includes('%') ||
      value.includes('vw') ||
      value.includes('vh') ||
      value === 'auto' ||
      value === 'none'
    )) {
      return value;
    }

    // If value is a number, add default unit
    if (!isNaN(value)) {
      return defaultUnit ? `${value}${defaultUnit}` : String(value);
    }

    return String(value);
  }

  /**
   * Destroy the style applier
   */
  destroy(): void {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.remove();
    }
    this.componentStyles.clear();
    this.editor.off('component:update');
    this.editor.off('component:add');
    this.editor.off('component:remove');
    this.editor.off('component:update:attributes');
  }

  /**
   * Manually refresh all styles
   */
  refresh(): void {
    this.componentStyles.clear();
    this.applyAllStyles();
  }
}

// ==================== ANIMATION KEYFRAMES ====================

/**
 * Inject common animation keyframes
 * Call this once when the editor initializes
 */
export function injectAnimationKeyframes(): void {
  const keyframes = `
/* Fade Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Animations */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Zoom Animations */
@keyframes zoomIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes zoomOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* Bounce Animation */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

/* Pulse Animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Shake Animation */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}
`;

  const styleEl = document.createElement('style');
  styleEl.id = 'grapesjs-animation-keyframes';
  styleEl.textContent = keyframes;
  document.head.appendChild(styleEl);
}
