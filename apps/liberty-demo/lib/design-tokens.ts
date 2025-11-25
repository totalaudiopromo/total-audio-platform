/**
 * Liberty Demo Design Tokens
 * Semantic colour and spacing system for consistent UI
 */

export const colors = {
  // Text colours - semantic naming
  text: {
    primary: 'text-tap-text', // #111 - primary text
    secondary: 'text-tap-muted', // #737373 - secondary/muted text
    tertiary: 'text-[#A1A1A1]', // lighter muted for subtle elements
    inverse: 'text-white', // text on dark backgrounds
    placeholder: 'text-[#9CA3AF]', // input placeholders
  },

  // Background colours
  bg: {
    page: 'bg-tap-bg', // #F7F6F2 - warm off-white page background
    card: 'bg-tap-panel', // white - card/panel backgrounds
    cardHover: 'bg-tap-panel-hover', // #FAFAF8 - subtle hover state
    subtle: 'bg-[#F5F5F5]', // subtle backgrounds (badges, pills)
    muted: 'bg-[#E5E5E5]', // muted backgrounds
    input: 'bg-[#FAFAF8]', // input field backgrounds
  },

  // Border colours
  border: {
    default: 'border-tap-line', // #D9D7D2 - standard borders
    subtle: 'border-[#E8E6E1]', // lighter borders
    strong: 'border-[#C5C3BE]', // stronger borders for emphasis
    focus: 'border-black', // focus state borders
  },

  // Status colours (semantic)
  status: {
    success: {
      bg: 'bg-tap-good', // green background
      text: 'text-tap-good', // green text
      bgSubtle: 'bg-tap-good/10', // subtle green bg
    },
    warning: {
      bg: 'bg-tap-pitch', // amber background
      text: 'text-[#DC7B09]', // amber text (WCAG compliant)
      bgSubtle: 'bg-tap-pitch/10', // subtle amber bg
    },
    error: {
      bg: 'bg-tap-risk', // red background
      text: 'text-tap-risk', // red text
      bgSubtle: 'bg-tap-risk/10', // subtle red bg
    },
    neutral: {
      bg: 'bg-[#F5F5F5]',
      text: 'text-tap-text',
      border: 'border-tap-line',
    },
  },

  // Intelligence accent colours (data visualization only)
  accent: {
    crm: 'tap-accent-crm', // #3AA9BE - CRM/contacts
    radio: 'tap-accent-radio', // #22C55E - radio support
    press: 'tap-accent-press', // #EC4899 - press coverage
    playlist: 'tap-accent-playlist', // #A855F7 - playlists
    pitch: 'tap-accent-pitch', // #F59E0B - pitches
    momentum: 'tap-accent-momentum', // #EAB308 - momentum/trends
  },
} as const;

export const spacing = {
  // Card internal padding
  card: 'p-6',
  cardCompact: 'p-4',
  cardTight: 'p-3',

  // Section spacing
  sectionGap: 'gap-8',
  cardGap: 'gap-6',
  itemGap: 'gap-4',
  tightGap: 'gap-2',

  // Page layout
  pageX: 'px-6',
  pageY: 'py-8',
} as const;

export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  default: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
  colors: 'transition-colors duration-150 ease-out',
  shadow: 'transition-shadow duration-200 ease-out',
} as const;

export const typography = {
  // Headings (use with liberty-heading class)
  pageTitle: 'text-2xl font-semibold tracking-tight text-tap-text',
  sectionTitle: 'text-xl font-semibold tracking-tight text-tap-text',
  cardTitle: 'text-lg font-semibold text-tap-text',

  // Body text
  body: 'text-base text-tap-text',
  bodySmall: 'text-sm text-tap-text',

  // Labels and metadata
  label: 'text-sm font-medium text-tap-muted uppercase tracking-wide',
  metadata: 'font-mono text-xs text-tap-muted',
  metadataMicro: 'font-mono text-[10px] text-tap-muted uppercase tracking-wide',
} as const;

export const accessibility = {
  // WCAG 2.2 AA minimum touch target (44x44px)
  touchTarget: 'min-h-[44px] min-w-[44px]',

  // Focus ring for keyboard navigation
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2',

  // Focus visible (only show on keyboard, not mouse)
  focusVisible:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2',
} as const;

// Utility type for accessing nested token values
export type ColorToken = typeof colors;
export type SpacingToken = typeof spacing;
export type TransitionToken = typeof transitions;
export type TypographyToken = typeof typography;
export type AccessibilityToken = typeof accessibility;
