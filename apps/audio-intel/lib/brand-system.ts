/**
 * Audio Intel Brand System
 * Centralized branding constants and utilities for consistent UI
 * Sprint Week optimized for rapid development
 */

// Brand Colors
export const BRAND_COLORS = {
  primary: {
    blue: '#1E88E5',
    blueHover: '#1976D2',
    blueDark: '#1565C0',
  },
  secondary: {
    yellow: '#FFD700',
    yellowHover: '#FFC107',
    yellowDark: '#FF8F00',
  },
  status: {
    success: '#059669',
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#0EA5E9',
  },
  neutral: {
    gray50: '#F8F9FA',
    gray100: '#E5E7EB',
    gray600: '#4B5563',
    gray900: '#111827',
  }
} as const;

// Typography System
export const TYPOGRAPHY = {
  fontFamilies: {
    primary: 'system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, "Cascadia Code", Monaco, consolas, monospace',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '6xl': '3.75rem', // 60px
  },
  weights: {
    medium: 500,
    bold: 600,
    black: 900,
  }
} as const;

// Spacing System (Tailwind compatible)
export const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} as const;

// Animation System
export const ANIMATIONS = {
  transition: {
    fast: '150ms ease-out',
    normal: '300ms ease-out',
    slow: '500ms ease-out',
  },
  easing: {
    easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  }
} as const;

// Loading State Configuration
export const LOADING_STATES = {
  messages: {
    upload: 'Ready to process your contact spreadsheets...',
    processing: 'Analysing and cleaning your contact data...',
    analysing: 'Gathering music industry intelligence...',
    success: 'Contact enrichment completed successfully!',
    error: 'Something went wrong. Let\'s try again.',
    export: 'Downloading your organised contact database...',
    launch: 'Your music is flying out to all verified contacts!'
  },
  durations: {
    fast: 1000,
    normal: 2000,
    slow: 3000,
  }
} as const;

// Button Variants System
export const BUTTON_VARIANTS = {
  primary: {
    base: `bg-gradient-to-r from-[${BRAND_COLORS.primary.blue}] to-[${BRAND_COLORS.secondary.yellow}]`,
    hover: 'hover:scale-105 hover:shadow-xl',
    text: 'text-white font-bold',
    transition: ANIMATIONS.transition.normal,
  },
  secondary: {
    base: `bg-white border-2 border-[${BRAND_COLORS.primary.blue}]`,
    hover: `hover:bg-[${BRAND_COLORS.primary.blue}] hover:text-white`,
    text: `text-[${BRAND_COLORS.primary.blue}] font-bold`,
    transition: ANIMATIONS.transition.normal,
  },
  ghost: {
    base: 'bg-transparent',
    hover: 'hover:bg-gray-100',
    text: 'text-gray-700 font-medium',
    transition: ANIMATIONS.transition.fast,
  }
} as const;

// Card System
export const CARD_VARIANTS = {
  default: {
    base: 'bg-white rounded-xl shadow-lg border border-gray-200',
    hover: 'hover:shadow-xl hover:-translate-y-1',
    transition: ANIMATIONS.transition.normal,
  },
  elevated: {
    base: 'bg-white rounded-2xl shadow-xl border-4 border-black',
    hover: 'hover:shadow-2xl hover:-translate-y-2',
    transition: ANIMATIONS.transition.normal,
  },
  success: {
    base: `bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[${BRAND_COLORS.status.success}]`,
    hover: 'hover:scale-[1.02]',
    transition: ANIMATIONS.transition.normal,
  },
  error: {
    base: `bg-gradient-to-br from-red-50 to-pink-50 border-2 border-[${BRAND_COLORS.status.error}]`,
    hover: 'hover:scale-[1.02]',
    transition: ANIMATIONS.transition.normal,
  }
} as const;

// UK Spelling Dictionary
export const UK_SPELLING = {
  'analyze': 'analyse',
  'analyzing': 'analysing',
  'analyzed': 'analysed',
  'organize': 'organise',
  'organizing': 'organising',
  'organized': 'organised',
  'color': 'colour',
  'colors': 'colours',
  'favorite': 'favourite',
  'favorites': 'favourites',
  'center': 'centre',
  'theater': 'theatre',
  'realize': 'realise',
  'optimize': 'optimise',
  'optimization': 'optimisation',
} as const;

// Utility Functions
export const brandUtils = {
  /**
   * Get consistent brand color with fallback
   */
  getColor: (colorPath: string, fallback: string = BRAND_COLORS.neutral.gray600) => {
    const paths = colorPath.split('.');
    let color: any = BRAND_COLORS;
    
    for (const path of paths) {
      color = color?.[path];
      if (!color) return fallback;
    }
    
    return color;
  },

  /**
   * Convert US spelling to UK spelling
   */
  toUkSpelling: (text: string): string => {
    let result = text;
    Object.entries(UK_SPELLING).forEach(([us, uk]) => {
      const regex = new RegExp(`\\b${us}\\b`, 'gi');
      result = result.replace(regex, uk);
    });
    return result;
  },

  /**
   * Generate consistent CSS classes for components
   */
  getButtonClasses: (variant: keyof typeof BUTTON_VARIANTS = 'primary') => {
    const config = BUTTON_VARIANTS[variant];
    return `${config.base} ${config.hover} ${config.text} px-6 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg`;
  },

  getCardClasses: (variant: keyof typeof CARD_VARIANTS = 'default') => {
    const config = CARD_VARIANTS[variant];
    return `${config.base} ${config.hover} transition-all duration-300 p-6`;
  },

  /**
   * Get loading state configuration
   */
  getLoadingState: (state: keyof typeof LOADING_STATES.messages) => ({
    message: LOADING_STATES.messages[state],
    duration: LOADING_STATES.durations.normal,
  }),
} as const;

// Export commonly used combinations
export const COMMON_CLASSES = {
  // Buttons
  primaryButton: brandUtils.getButtonClasses('primary'),
  secondaryButton: brandUtils.getButtonClasses('secondary'),
  
  // Cards
  defaultCard: brandUtils.getCardClasses('default'),
  elevatedCard: brandUtils.getCardClasses('elevated'),
  successCard: brandUtils.getCardClasses('success'),
  
  // Typography
  heading1: `text-${TYPOGRAPHY.sizes['4xl']} font-${TYPOGRAPHY.weights.black} text-gray-900`,
  heading2: `text-${TYPOGRAPHY.sizes['3xl']} font-${TYPOGRAPHY.weights.bold} text-gray-900`,
  body: `text-${TYPOGRAPHY.sizes.base} text-gray-700`,
  caption: `text-${TYPOGRAPHY.sizes.sm} text-gray-500`,
} as const;

export default {
  BRAND_COLORS,
  TYPOGRAPHY,
  SPACING,
  ANIMATIONS,
  LOADING_STATES,
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  UK_SPELLING,
  brandUtils,
  COMMON_CLASSES,
};