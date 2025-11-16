/**
 * Common Traits Library for GrapesJS Components
 *
 * This library provides reusable trait definitions organized by category (tab)
 * and section. All traits follow Elementor's comprehensive settings structure.
 *
 * Usage:
 * import { TypographyTraits, ColorTraits, SpacingTraits } from './commonTraits';
 *
 * traits: [
 *   ...TypographyTraits.fontSize(),
 *   ...TypographyTraits.fontWeight(),
 *   ...ColorTraits.textColor(),
 * ]
 */

// ==================== TYPOGRAPHY TRAITS (Style Tab) ====================

export const TypographyTraits = {
  /**
   * Font Family selector
   */
  fontFamily: () => ({
    type: 'select',
    label: 'Font Family',
    name: 'font-family',
    category: 'style',
    section: 'typography',
    options: [
      { id: 'default', name: 'Default' },
      { id: 'Arial, sans-serif', name: 'Arial' },
      { id: '"Helvetica Neue", Helvetica, sans-serif', name: 'Helvetica' },
      { id: 'Georgia, serif', name: 'Georgia' },
      { id: '"Times New Roman", Times, serif', name: 'Times New Roman' },
      { id: '"Courier New", Courier, monospace', name: 'Courier New' },
      { id: 'Verdana, sans-serif', name: 'Verdana' },
      { id: 'Tahoma, sans-serif', name: 'Tahoma' },
      { id: '"Trebuchet MS", sans-serif', name: 'Trebuchet MS' },
      { id: '"Palatino Linotype", serif', name: 'Palatino' },
      { id: '"Comic Sans MS", cursive', name: 'Comic Sans' },
      { id: 'Impact, sans-serif', name: 'Impact' },
      { id: '"Lucida Console", monospace', name: 'Lucida Console' },
      { id: 'system-ui, -apple-system, sans-serif', name: 'System UI' },
    ],
    changeProp: 1,
  }),

  /**
   * Font Size with units
   */
  fontSize: () => ({
    type: 'number',
    label: 'Font Size',
    name: 'font-size',
    category: 'style',
    section: 'typography',
    units: ['px', 'em', 'rem', '%', 'vw'],
    min: 1,
    max: 200,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Font Weight selector
   */
  fontWeight: () => ({
    type: 'select',
    label: 'Font Weight',
    name: 'font-weight',
    category: 'style',
    section: 'typography',
    options: [
      { id: 'normal', name: 'Normal (400)' },
      { id: '100', name: 'Thin (100)' },
      { id: '200', name: 'Extra Light (200)' },
      { id: '300', name: 'Light (300)' },
      { id: '500', name: 'Medium (500)' },
      { id: '600', name: 'Semi Bold (600)' },
      { id: '700', name: 'Bold (700)' },
      { id: '800', name: 'Extra Bold (800)' },
      { id: '900', name: 'Black (900)' },
    ],
    changeProp: 1,
  }),

  /**
   * Text Transform
   */
  textTransform: () => ({
    type: 'select',
    label: 'Text Transform',
    name: 'text-transform',
    category: 'style',
    section: 'typography',
    options: [
      { id: 'none', name: 'None' },
      { id: 'uppercase', name: 'UPPERCASE' },
      { id: 'lowercase', name: 'lowercase' },
      { id: 'capitalize', name: 'Capitalize' },
    ],
    changeProp: 1,
  }),

  /**
   * Font Style
   */
  fontStyle: () => ({
    type: 'select',
    label: 'Font Style',
    name: 'font-style',
    category: 'style',
    section: 'typography',
    options: [
      { id: 'normal', name: 'Normal' },
      { id: 'italic', name: 'Italic' },
      { id: 'oblique', name: 'Oblique' },
    ],
    changeProp: 1,
  }),

  /**
   * Text Decoration
   */
  textDecoration: () => ({
    type: 'select',
    label: 'Text Decoration',
    name: 'text-decoration',
    category: 'style',
    section: 'typography',
    options: [
      { id: 'none', name: 'None' },
      { id: 'underline', name: 'Underline' },
      { id: 'overline', name: 'Overline' },
      { id: 'line-through', name: 'Line Through' },
    ],
    changeProp: 1,
  }),

  /**
   * Line Height
   */
  lineHeight: () => ({
    type: 'number',
    label: 'Line Height',
    name: 'line-height',
    category: 'style',
    section: 'typography',
    units: ['px', 'em', 'rem', ''],
    min: 0,
    max: 10,
    step: 0.1,
    changeProp: 1,
  }),

  /**
   * Letter Spacing
   */
  letterSpacing: () => ({
    type: 'number',
    label: 'Letter Spacing',
    name: 'letter-spacing',
    category: 'style',
    section: 'typography',
    units: ['px', 'em', 'rem'],
    min: -10,
    max: 10,
    step: 0.1,
    changeProp: 1,
  }),

  /**
   * Word Spacing
   */
  wordSpacing: () => ({
    type: 'number',
    label: 'Word Spacing',
    name: 'word-spacing',
    category: 'style',
    section: 'typography',
    units: ['px', 'em', 'rem'],
    min: -10,
    max: 10,
    step: 0.1,
    changeProp: 1,
  }),
};

// ==================== COLOR TRAITS (Style Tab) ====================

export const ColorTraits = {
  /**
   * Text Color
   */
  textColor: () => ({
    type: 'color',
    label: 'Text Color',
    name: 'color',
    category: 'style',
    section: 'colors',
    changeProp: 1,
  }),

  /**
   * Background Color
   */
  backgroundColor: () => ({
    type: 'color',
    label: 'Background Color',
    name: 'background-color',
    category: 'style',
    section: 'colors',
    changeProp: 1,
  }),

  /**
   * Border Color
   */
  borderColor: () => ({
    type: 'color',
    label: 'Border Color',
    name: 'border-color',
    category: 'style',
    section: 'colors',
    changeProp: 1,
  }),

  /**
   * Link Color
   */
  linkColor: (name = 'link-color') => ({
    type: 'color',
    label: 'Link Color',
    name,
    category: 'style',
    section: 'colors',
    changeProp: 1,
  }),

  /**
   * Link Hover Color
   */
  linkHoverColor: (name = 'link-hover-color') => ({
    type: 'color',
    label: 'Link Hover Color',
    name,
    category: 'style',
    section: 'colors',
    changeProp: 1,
  }),
};

// ==================== SPACING TRAITS (Style Tab) ====================

export const SpacingTraits = {
  /**
   * Margin (all sides)
   */
  margin: () => ({
    type: 'composite',
    label: 'Margin',
    name: 'margin',
    category: 'style',
    section: 'spacing',
    properties: [
      { name: 'margin-top', label: 'Top', units: ['px', 'em', 'rem', '%'] },
      { name: 'margin-right', label: 'Right', units: ['px', 'em', 'rem', '%'] },
      { name: 'margin-bottom', label: 'Bottom', units: ['px', 'em', 'rem', '%'] },
      { name: 'margin-left', label: 'Left', units: ['px', 'em', 'rem', '%'] },
    ],
    changeProp: 1,
  }),

  /**
   * Padding (all sides)
   */
  padding: () => ({
    type: 'composite',
    label: 'Padding',
    name: 'padding',
    category: 'style',
    section: 'spacing',
    properties: [
      { name: 'padding-top', label: 'Top', units: ['px', 'em', 'rem', '%'] },
      { name: 'padding-right', label: 'Right', units: ['px', 'em', 'rem', '%'] },
      { name: 'padding-bottom', label: 'Bottom', units: ['px', 'em', 'rem', '%'] },
      { name: 'padding-left', label: 'Left', units: ['px', 'em', 'rem', '%'] },
    ],
    changeProp: 1,
  }),

  /**
   * Margin Top
   */
  marginTop: () => ({
    type: 'number',
    label: 'Margin Top',
    name: 'margin-top',
    category: 'style',
    section: 'spacing',
    units: ['px', 'em', 'rem', '%'],
    min: -500,
    max: 500,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Margin Bottom
   */
  marginBottom: () => ({
    type: 'number',
    label: 'Margin Bottom',
    name: 'margin-bottom',
    category: 'style',
    section: 'spacing',
    units: ['px', 'em', 'rem', '%'],
    min: -500,
    max: 500,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Padding Top
   */
  paddingTop: () => ({
    type: 'number',
    label: 'Padding Top',
    name: 'padding-top',
    category: 'style',
    section: 'spacing',
    units: ['px', 'em', 'rem', '%'],
    min: 0,
    max: 500,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Padding Bottom
   */
  paddingBottom: () => ({
    type: 'number',
    label: 'Padding Bottom',
    name: 'padding-bottom',
    category: 'style',
    section: 'spacing',
    units: ['px', 'em', 'rem', '%'],
    min: 0,
    max: 500,
    step: 1,
    changeProp: 1,
  }),
};

// ==================== BORDER TRAITS (Style Tab) ====================

export const BorderTraits = {
  /**
   * Border Width
   */
  borderWidth: () => ({
    type: 'number',
    label: 'Border Width',
    name: 'border-width',
    category: 'style',
    section: 'border',
    units: ['px'],
    min: 0,
    max: 50,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Border Style
   */
  borderStyle: () => ({
    type: 'select',
    label: 'Border Style',
    name: 'border-style',
    category: 'style',
    section: 'border',
    options: [
      { id: 'none', name: 'None' },
      { id: 'solid', name: 'Solid' },
      { id: 'dashed', name: 'Dashed' },
      { id: 'dotted', name: 'Dotted' },
      { id: 'double', name: 'Double' },
      { id: 'groove', name: 'Groove' },
      { id: 'ridge', name: 'Ridge' },
      { id: 'inset', name: 'Inset' },
      { id: 'outset', name: 'Outset' },
    ],
    changeProp: 1,
  }),

  /**
   * Border Radius
   */
  borderRadius: () => ({
    type: 'number',
    label: 'Border Radius',
    name: 'border-radius',
    category: 'style',
    section: 'border',
    units: ['px', '%', 'em', 'rem'],
    min: 0,
    max: 500,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Individual Border Radius corners
   */
  borderRadiusCorners: () => ({
    type: 'composite',
    label: 'Border Radius',
    name: 'border-radius-corners',
    category: 'style',
    section: 'border',
    properties: [
      { name: 'border-top-left-radius', label: 'Top Left', units: ['px', '%', 'em'] },
      { name: 'border-top-right-radius', label: 'Top Right', units: ['px', '%', 'em'] },
      { name: 'border-bottom-right-radius', label: 'Bottom Right', units: ['px', '%', 'em'] },
      { name: 'border-bottom-left-radius', label: 'Bottom Left', units: ['px', '%', 'em'] },
    ],
    changeProp: 1,
  }),
};

// ==================== BOX SHADOW TRAITS (Style Tab) ====================

export const BoxShadowTraits = {
  /**
   * Box Shadow Horizontal Offset
   */
  shadowH: () => ({
    type: 'number',
    label: 'Horizontal',
    name: 'box-shadow-h',
    category: 'style',
    section: 'box-shadow',
    units: ['px'],
    min: -100,
    max: 100,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Box Shadow Vertical Offset
   */
  shadowV: () => ({
    type: 'number',
    label: 'Vertical',
    name: 'box-shadow-v',
    category: 'style',
    section: 'box-shadow',
    units: ['px'],
    min: -100,
    max: 100,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Box Shadow Blur
   */
  shadowBlur: () => ({
    type: 'number',
    label: 'Blur',
    name: 'box-shadow-blur',
    category: 'style',
    section: 'box-shadow',
    units: ['px'],
    min: 0,
    max: 100,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Box Shadow Spread
   */
  shadowSpread: () => ({
    type: 'number',
    label: 'Spread',
    name: 'box-shadow-spread',
    category: 'style',
    section: 'box-shadow',
    units: ['px'],
    min: -100,
    max: 100,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Box Shadow Color
   */
  shadowColor: () => ({
    type: 'color',
    label: 'Shadow Color',
    name: 'box-shadow-color',
    category: 'style',
    section: 'box-shadow',
    changeProp: 1,
  }),

  /**
   * Box Shadow Position (inset/outset)
   */
  shadowPosition: () => ({
    type: 'select',
    label: 'Position',
    name: 'box-shadow-position',
    category: 'style',
    section: 'box-shadow',
    options: [
      { id: 'outset', name: 'Outline' },
      { id: 'inset', name: 'Inset' },
    ],
    changeProp: 1,
  }),
};

// ==================== BACKGROUND TRAITS (Style Tab) ====================

export const BackgroundTraits = {
  /**
   * Background Type
   */
  backgroundType: () => ({
    type: 'select',
    label: 'Background Type',
    name: 'background-type',
    category: 'style',
    section: 'background',
    options: [
      { id: 'none', name: 'None' },
      { id: 'color', name: 'Color' },
      { id: 'gradient', name: 'Gradient' },
      { id: 'image', name: 'Image' },
    ],
    changeProp: 1,
  }),

  /**
   * Background Image
   */
  backgroundImage: () => ({
    type: 'text',
    label: 'Background Image URL',
    name: 'background-image',
    category: 'style',
    section: 'background',
    placeholder: 'https://example.com/image.jpg',
    changeProp: 1,
  }),

  /**
   * Background Position
   */
  backgroundPosition: () => ({
    type: 'select',
    label: 'Position',
    name: 'background-position',
    category: 'style',
    section: 'background',
    options: [
      { id: 'center center', name: 'Center Center' },
      { id: 'top left', name: 'Top Left' },
      { id: 'top center', name: 'Top Center' },
      { id: 'top right', name: 'Top Right' },
      { id: 'center left', name: 'Center Left' },
      { id: 'center right', name: 'Center Right' },
      { id: 'bottom left', name: 'Bottom Left' },
      { id: 'bottom center', name: 'Bottom Center' },
      { id: 'bottom right', name: 'Bottom Right' },
    ],
    changeProp: 1,
  }),

  /**
   * Background Size
   */
  backgroundSize: () => ({
    type: 'select',
    label: 'Size',
    name: 'background-size',
    category: 'style',
    section: 'background',
    options: [
      { id: 'auto', name: 'Auto' },
      { id: 'cover', name: 'Cover' },
      { id: 'contain', name: 'Contain' },
      { id: '100% 100%', name: 'Stretch' },
    ],
    changeProp: 1,
  }),

  /**
   * Background Repeat
   */
  backgroundRepeat: () => ({
    type: 'select',
    label: 'Repeat',
    name: 'background-repeat',
    category: 'style',
    section: 'background',
    options: [
      { id: 'no-repeat', name: 'No Repeat' },
      { id: 'repeat', name: 'Repeat' },
      { id: 'repeat-x', name: 'Repeat X' },
      { id: 'repeat-y', name: 'Repeat Y' },
    ],
    changeProp: 1,
  }),

  /**
   * Background Attachment
   */
  backgroundAttachment: () => ({
    type: 'select',
    label: 'Attachment',
    name: 'background-attachment',
    category: 'style',
    section: 'background',
    options: [
      { id: 'scroll', name: 'Scroll' },
      { id: 'fixed', name: 'Fixed' },
      { id: 'local', name: 'Local' },
    ],
    changeProp: 1,
  }),
};

// ==================== LAYOUT/DIMENSIONS TRAITS (Style Tab) ====================

export const DimensionTraits = {
  /**
   * Width
   */
  width: () => ({
    type: 'number',
    label: 'Width',
    name: 'width',
    category: 'style',
    section: 'layout',
    units: ['px', '%', 'vw', 'auto'],
    min: 0,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Height
   */
  height: () => ({
    type: 'number',
    label: 'Height',
    name: 'height',
    category: 'style',
    section: 'layout',
    units: ['px', '%', 'vh', 'auto'],
    min: 0,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Min Width
   */
  minWidth: () => ({
    type: 'number',
    label: 'Min Width',
    name: 'min-width',
    category: 'style',
    section: 'layout',
    units: ['px', '%', 'vw'],
    min: 0,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Max Width
   */
  maxWidth: () => ({
    type: 'number',
    label: 'Max Width',
    name: 'max-width',
    category: 'style',
    section: 'layout',
    units: ['px', '%', 'vw', 'none'],
    min: 0,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Min Height
   */
  minHeight: () => ({
    type: 'number',
    label: 'Min Height',
    name: 'min-height',
    category: 'style',
    section: 'layout',
    units: ['px', '%', 'vh'],
    min: 0,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Max Height
   */
  maxHeight: () => ({
    type: 'number',
    label: 'Max Height',
    name: 'max-height',
    category: 'style',
    section: 'layout',
    units: ['px', '%', 'vh', 'none'],
    min: 0,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Display
   */
  display: () => ({
    type: 'select',
    label: 'Display',
    name: 'display',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'block', name: 'Block' },
      { id: 'inline', name: 'Inline' },
      { id: 'inline-block', name: 'Inline Block' },
      { id: 'flex', name: 'Flex' },
      { id: 'inline-flex', name: 'Inline Flex' },
      { id: 'grid', name: 'Grid' },
      { id: 'none', name: 'None' },
    ],
    changeProp: 1,
  }),

  /**
   * Overflow
   */
  overflow: () => ({
    type: 'select',
    label: 'Overflow',
    name: 'overflow',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'visible', name: 'Visible' },
      { id: 'hidden', name: 'Hidden' },
      { id: 'scroll', name: 'Scroll' },
      { id: 'auto', name: 'Auto' },
    ],
    changeProp: 1,
  }),
};

// ==================== FLEXBOX TRAITS (Style Tab) ====================

export const FlexboxTraits = {
  /**
   * Flex Direction
   */
  flexDirection: () => ({
    type: 'select',
    label: 'Direction',
    name: 'flex-direction',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'row', name: 'Row' },
      { id: 'row-reverse', name: 'Row Reverse' },
      { id: 'column', name: 'Column' },
      { id: 'column-reverse', name: 'Column Reverse' },
    ],
    changeProp: 1,
  }),

  /**
   * Justify Content
   */
  justifyContent: () => ({
    type: 'select',
    label: 'Justify Content',
    name: 'justify-content',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'flex-start', name: 'Start' },
      { id: 'center', name: 'Center' },
      { id: 'flex-end', name: 'End' },
      { id: 'space-between', name: 'Space Between' },
      { id: 'space-around', name: 'Space Around' },
      { id: 'space-evenly', name: 'Space Evenly' },
    ],
    changeProp: 1,
  }),

  /**
   * Align Items
   */
  alignItems: () => ({
    type: 'select',
    label: 'Align Items',
    name: 'align-items',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'flex-start', name: 'Start' },
      { id: 'center', name: 'Center' },
      { id: 'flex-end', name: 'End' },
      { id: 'stretch', name: 'Stretch' },
      { id: 'baseline', name: 'Baseline' },
    ],
    changeProp: 1,
  }),

  /**
   * Flex Wrap
   */
  flexWrap: () => ({
    type: 'select',
    label: 'Flex Wrap',
    name: 'flex-wrap',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'nowrap', name: 'No Wrap' },
      { id: 'wrap', name: 'Wrap' },
      { id: 'wrap-reverse', name: 'Wrap Reverse' },
    ],
    changeProp: 1,
  }),

  /**
   * Gap
   */
  gap: () => ({
    type: 'number',
    label: 'Gap',
    name: 'gap',
    category: 'style',
    section: 'layout',
    units: ['px', 'em', 'rem', '%'],
    min: 0,
    max: 200,
    step: 1,
    changeProp: 1,
  }),
};

// ==================== POSITION TRAITS (Advanced Tab) ====================

export const PositionTraits = {
  /**
   * Position Type
   */
  position: () => ({
    type: 'select',
    label: 'Position',
    name: 'position',
    category: 'advanced',
    section: 'position',
    options: [
      { id: 'static', name: 'Static' },
      { id: 'relative', name: 'Relative' },
      { id: 'absolute', name: 'Absolute' },
      { id: 'fixed', name: 'Fixed' },
      { id: 'sticky', name: 'Sticky' },
    ],
    changeProp: 1,
  }),

  /**
   * Top
   */
  top: () => ({
    type: 'number',
    label: 'Top',
    name: 'top',
    category: 'advanced',
    section: 'position',
    units: ['px', '%', 'em', 'rem', 'auto'],
    min: -2000,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Right
   */
  right: () => ({
    type: 'number',
    label: 'Right',
    name: 'right',
    category: 'advanced',
    section: 'position',
    units: ['px', '%', 'em', 'rem', 'auto'],
    min: -2000,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Bottom
   */
  bottom: () => ({
    type: 'number',
    label: 'Bottom',
    name: 'bottom',
    category: 'advanced',
    section: 'position',
    units: ['px', '%', 'em', 'rem', 'auto'],
    min: -2000,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Left
   */
  left: () => ({
    type: 'number',
    label: 'Left',
    name: 'left',
    category: 'advanced',
    section: 'position',
    units: ['px', '%', 'em', 'rem', 'auto'],
    min: -2000,
    max: 2000,
    step: 1,
    changeProp: 1,
  }),

  /**
   * Z-Index
   */
  zIndex: () => ({
    type: 'number',
    label: 'Z-Index',
    name: 'z-index',
    category: 'advanced',
    section: 'position',
    units: [''],
    min: -999,
    max: 999,
    step: 1,
    changeProp: 1,
  }),
};

// ==================== ANIMATION TRAITS (Advanced Tab) ====================

export const AnimationTraits = {
  /**
   * Animation Name/Type
   */
  animationName: () => ({
    type: 'select',
    label: 'Animation',
    name: 'animation-name',
    category: 'advanced',
    section: 'animation',
    options: [
      { id: 'none', name: 'None' },
      { id: 'fadeIn', name: 'Fade In' },
      { id: 'fadeOut', name: 'Fade Out' },
      { id: 'slideInLeft', name: 'Slide In Left' },
      { id: 'slideInRight', name: 'Slide In Right' },
      { id: 'slideInUp', name: 'Slide In Up' },
      { id: 'slideInDown', name: 'Slide In Down' },
      { id: 'zoomIn', name: 'Zoom In' },
      { id: 'zoomOut', name: 'Zoom Out' },
      { id: 'bounce', name: 'Bounce' },
      { id: 'pulse', name: 'Pulse' },
      { id: 'shake', name: 'Shake' },
    ],
    changeProp: 1,
  }),

  /**
   * Animation Duration
   */
  animationDuration: () => ({
    type: 'number',
    label: 'Duration',
    name: 'animation-duration',
    category: 'advanced',
    section: 'animation',
    units: ['s', 'ms'],
    min: 0,
    max: 10,
    step: 0.1,
    changeProp: 1,
  }),

  /**
   * Animation Delay
   */
  animationDelay: () => ({
    type: 'number',
    label: 'Delay',
    name: 'animation-delay',
    category: 'advanced',
    section: 'animation',
    units: ['s', 'ms'],
    min: 0,
    max: 10,
    step: 0.1,
    changeProp: 1,
  }),

  /**
   * Animation Timing Function
   */
  animationTimingFunction: () => ({
    type: 'select',
    label: 'Timing',
    name: 'animation-timing-function',
    category: 'advanced',
    section: 'animation',
    options: [
      { id: 'ease', name: 'Ease' },
      { id: 'linear', name: 'Linear' },
      { id: 'ease-in', name: 'Ease In' },
      { id: 'ease-out', name: 'Ease Out' },
      { id: 'ease-in-out', name: 'Ease In Out' },
    ],
    changeProp: 1,
  }),

  /**
   * Animation Iteration Count
   */
  animationIterationCount: () => ({
    type: 'select',
    label: 'Repeat',
    name: 'animation-iteration-count',
    category: 'advanced',
    section: 'animation',
    options: [
      { id: '1', name: 'Once' },
      { id: '2', name: 'Twice' },
      { id: '3', name: '3 Times' },
      { id: 'infinite', name: 'Infinite' },
    ],
    changeProp: 1,
  }),
};

// ==================== RESPONSIVE/VISIBILITY TRAITS (Advanced Tab) ====================

export const ResponsiveTraits = {
  /**
   * Hide on Desktop
   */
  hideDesktop: () => ({
    type: 'checkbox',
    label: 'Hide on Desktop',
    name: 'hide-desktop',
    category: 'advanced',
    section: 'responsive',
    changeProp: 1,
  }),

  /**
   * Hide on Tablet
   */
  hideTablet: () => ({
    type: 'checkbox',
    label: 'Hide on Tablet',
    name: 'hide-tablet',
    category: 'advanced',
    section: 'responsive',
    changeProp: 1,
  }),

  /**
   * Hide on Mobile
   */
  hideMobile: () => ({
    type: 'checkbox',
    label: 'Hide on Mobile',
    name: 'hide-mobile',
    category: 'advanced',
    section: 'responsive',
    changeProp: 1,
  }),

  /**
   * Visibility
   */
  visibility: () => ({
    type: 'select',
    label: 'Visibility',
    name: 'visibility',
    category: 'advanced',
    section: 'responsive',
    options: [
      { id: 'visible', name: 'Visible' },
      { id: 'hidden', name: 'Hidden' },
      { id: 'collapse', name: 'Collapse' },
    ],
    changeProp: 1,
  }),

  /**
   * Opacity
   */
  opacity: () => ({
    type: 'number',
    label: 'Opacity',
    name: 'opacity',
    category: 'advanced',
    section: 'responsive',
    units: [''],
    min: 0,
    max: 1,
    step: 0.1,
    changeProp: 1,
  }),
};

// ==================== CUSTOM CSS TRAITS (Advanced Tab) ====================

export const CustomCSSTraits = {
  /**
   * Custom CSS Classes
   */
  cssClasses: () => ({
    type: 'text',
    label: 'CSS Classes',
    name: 'css-classes',
    category: 'advanced',
    section: 'css',
    placeholder: 'class-1 class-2 class-3',
    changeProp: 1,
  }),

  /**
   * Custom CSS ID
   */
  cssId: () => ({
    type: 'text',
    label: 'CSS ID',
    name: 'css-id',
    category: 'advanced',
    section: 'css',
    placeholder: 'unique-element-id',
    changeProp: 1,
  }),

  /**
   * Custom CSS
   */
  customCSS: () => ({
    type: 'textarea',
    label: 'Custom CSS',
    name: 'custom-css',
    category: 'advanced',
    section: 'css',
    placeholder: 'selector {\n  property: value;\n}',
    changeProp: 1,
  }),
};

// ==================== ALIGNMENT TRAITS (Style Tab) ====================

export const AlignmentTraits = {
  /**
   * Text Align
   */
  textAlign: () => ({
    type: 'select',
    label: 'Text Align',
    name: 'text-align',
    category: 'style',
    section: 'typography',
    options: [
      { id: 'left', name: 'Left' },
      { id: 'center', name: 'Center' },
      { id: 'right', name: 'Right' },
      { id: 'justify', name: 'Justify' },
    ],
    changeProp: 1,
  }),

  /**
   * Vertical Align
   */
  verticalAlign: () => ({
    type: 'select',
    label: 'Vertical Align',
    name: 'vertical-align',
    category: 'style',
    section: 'layout',
    options: [
      { id: 'baseline', name: 'Baseline' },
      { id: 'top', name: 'Top' },
      { id: 'middle', name: 'Middle' },
      { id: 'bottom', name: 'Bottom' },
      { id: 'text-top', name: 'Text Top' },
      { id: 'text-bottom', name: 'Text Bottom' },
    ],
    changeProp: 1,
  }),
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all typography traits
 */
export function getAllTypographyTraits() {
  return [
    TypographyTraits.fontFamily(),
    TypographyTraits.fontSize(),
    TypographyTraits.fontWeight(),
    TypographyTraits.textTransform(),
    TypographyTraits.fontStyle(),
    TypographyTraits.textDecoration(),
    TypographyTraits.lineHeight(),
    TypographyTraits.letterSpacing(),
    TypographyTraits.wordSpacing(),
    AlignmentTraits.textAlign(),
  ];
}

/**
 * Get all color traits
 */
export function getAllColorTraits() {
  return [
    ColorTraits.textColor(),
    ColorTraits.backgroundColor(),
    ColorTraits.borderColor(),
  ];
}

/**
 * Get all spacing traits
 */
export function getAllSpacingTraits() {
  return [
    SpacingTraits.marginTop(),
    SpacingTraits.marginBottom(),
    SpacingTraits.paddingTop(),
    SpacingTraits.paddingBottom(),
  ];
}

/**
 * Get all border traits
 */
export function getAllBorderTraits() {
  return [
    BorderTraits.borderWidth(),
    BorderTraits.borderStyle(),
    ColorTraits.borderColor(),
    BorderTraits.borderRadius(),
  ];
}

/**
 * Get all box shadow traits
 */
export function getAllBoxShadowTraits() {
  return [
    BoxShadowTraits.shadowH(),
    BoxShadowTraits.shadowV(),
    BoxShadowTraits.shadowBlur(),
    BoxShadowTraits.shadowSpread(),
    BoxShadowTraits.shadowColor(),
    BoxShadowTraits.shadowPosition(),
  ];
}

/**
 * Get all dimension traits
 */
export function getAllDimensionTraits() {
  return [
    DimensionTraits.width(),
    DimensionTraits.height(),
    DimensionTraits.minWidth(),
    DimensionTraits.maxWidth(),
    DimensionTraits.minHeight(),
    DimensionTraits.maxHeight(),
  ];
}

/**
 * Get all position traits
 */
export function getAllPositionTraits() {
  return [
    PositionTraits.position(),
    PositionTraits.top(),
    PositionTraits.right(),
    PositionTraits.bottom(),
    PositionTraits.left(),
    PositionTraits.zIndex(),
  ];
}
