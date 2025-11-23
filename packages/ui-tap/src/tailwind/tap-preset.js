/**
 * TAP Design System Tailwind Preset
 *
 * For Total Audio Promo (TAP) apps only.
 * Matte, analytical, understated SaaS design.
 *
 * Core principles:
 * - No pure black (#000000) - use near-black slate tokens
 * - Slate cyan accent (#3AA9BE) for actionable elements only
 * - Matte finish, no harsh gradients
 * - 240ms default transitions for hover/focus
 * - Typography: Inter (sans), JetBrains Mono (mono)
 * - Spacing: 4/8/12/16/24/32 scale
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Near-black backgrounds (never pure #000000)
        'tap-near-black': '#05070A',

        // Slate system (primary backgrounds and surfaces)
        'tap-slate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        // Slate cyan accent (THE TAP brand colour)
        'tap-cyan': {
          DEFAULT: '#3AA9BE',
          50: '#E6F7FA',
          100: '#CCEFF5',
          200: '#99DFEB',
          300: '#66CFE1',
          400: '#3AA9BE', // Primary accent
          500: '#2E8799',
          600: '#236573',
          700: '#17444D',
          800: '#0C2226',
          900: '#010101',
        },

        // Success/error/warning (usable in charts, badges, alerts)
        'tap-success': {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          700: '#047857',
        },
        'tap-error': {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        'tap-warning': {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          700: '#B45309',
        },

        // Neutral greys for borders and subtle UI
        'tap-border': '#334155', // slate-700
        'tap-border-subtle': '#1E293B', // slate-800
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      spacing: {
        // Enforced spacing scale
        1: '0.25rem', // 4px
        2: '0.5rem',  // 8px
        3: '0.75rem', // 12px
        4: '1rem',    // 16px
        6: '1.5rem',  // 24px
        8: '2rem',    // 32px
        12: '3rem',   // 48px
        16: '4rem',   // 64px
        24: '6rem',   // 96px
      },

      borderRadius: {
        // Approved radius values only
        'tap-sm': '0.375rem',  // 6px
        'tap-md': '0.5rem',    // 8px
        'tap-lg': '0.75rem',   // 12px
        'tap-xl': '1rem',      // 16px
        'tap-2xl': '1.5rem',   // 24px
      },

      transitionDuration: {
        // Default 240ms for hover/focus
        DEFAULT: '240ms',
        tap: '240ms',
      },

      transitionTimingFunction: {
        // Subtle ease-out for TAP
        'tap-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      boxShadow: {
        // Minimal shadows for TAP (matte aesthetic)
        'tap-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        'tap-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        'tap-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
