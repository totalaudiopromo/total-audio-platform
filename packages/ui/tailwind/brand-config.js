/**
 * Shared Tailwind brand configuration for Total Audio Promo platform
 *
 * Brutalist design system with tool-specific accent colors:
 * - Audio Intel: Blue (#3B82F6) - intelligence/data
 * - Tracker: Amber (#F59E0B) - activity/tracking
 * - Pitch Generator: Purple (#9333EA) - creativity/writing
 */

/**
 * Get brand configuration for a specific tool
 * @param {'audio-intel' | 'tracker' | 'pitch-generator'} tool - The tool name
 * @returns Tailwind extend configuration object
 */
export function getBrandConfig(tool = 'audio-intel') {
  const brandColors = {
    'audio-intel': {
      primary: '#3B82F6', // blue-500
      primaryHover: '#2563EB', // blue-600
      primaryLight: '#DBEAFE', // blue-50
      gradient: 'rgba(59, 130, 246, 0.06)', // blue radial gradient
    },
    tracker: {
      primary: '#F59E0B', // amber-500
      primaryHover: '#D97706', // amber-600
      primaryLight: '#FEF3C7', // amber-50
      gradient: 'rgba(245, 158, 11, 0.06)', // amber radial gradient
    },
    'pitch-generator': {
      primary: '#9333EA', // purple-600
      primaryHover: '#7C3AED', // purple-700
      primaryLight: '#F3E8FF', // purple-50
      gradient: 'rgba(147, 51, 234, 0.06)', // purple radial gradient
    },
  };

  const colors = brandColors[tool] || brandColors['audio-intel'];

  return {
    colors: {
      brand: {
        primary: colors.primary,
        'primary-hover': colors.primaryHover,
        'primary-light': colors.primaryLight,
      },
    },
    // Shared brutalist utilities
    extend: {
      borderRadius: {
        DEFAULT: '0.85rem',
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-xl': '12px 12px 0px 0px rgba(0, 0, 0, 1)',
      },
    },
  };
}

/**
 * Shared component classes (use with @layer components in your globals.css)
 */
export const sharedComponents = `
  /* Brutalist glass panel with glow */
  .glass-panel {
    @apply rounded-2xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1;
    position: relative;
  }

  .glass-panel::before {
    content: '';
    position: absolute;
    inset: -40px;
    background: radial-gradient(circle 400px at center, var(--glow-color, rgba(147, 51, 234, 0.06)), transparent 70%);
    border-radius: 2rem;
    z-index: -1;
    filter: blur(40px);
    pointer-events: none;
  }

  /* CTA button */
  .cta-button {
    @apply inline-flex items-center justify-center rounded-xl border-4 border-black px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:scale-95;
  }

  /* Subtle button */
  .subtle-button {
    @apply inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5;
  }

  /* Badge */
  .badge-postcraft {
    @apply inline-flex items-center gap-2 rounded-full border-2 border-black px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
  }
`;

/**
 * Tool-specific CSS custom properties
 * Add these to your :root in globals.css
 */
export function getToolCustomProperties(tool = 'audio-intel') {
  const brandColors = {
    'audio-intel': {
      '--glow-color': 'rgba(59, 130, 246, 0.06)',
      '--accent-color': '#3B82F6',
      '--accent-hover': '#2563EB',
    },
    tracker: {
      '--glow-color': 'rgba(245, 158, 11, 0.06)',
      '--accent-color': '#F59E0B',
      '--accent-hover': '#D97706',
    },
    'pitch-generator': {
      '--glow-color': 'rgba(147, 51, 234, 0.06)',
      '--accent-color': '#9333EA',
      '--accent-hover': '#7C3AED',
    },
  };

  return brandColors[tool] || brandColors['audio-intel'];
}
