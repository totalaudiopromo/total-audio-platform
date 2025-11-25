/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'], // Jakarta Sans everywhere
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        // Liberty Brand System - Warm Editorial Base
        'tap-bg': '#F7F6F2', // Warm off-white base
        'tap-panel': '#FFFFFF', // Pure white for cards
        'tap-panel-hover': '#FAFAF8', // Subtle hover state
        'tap-line': '#D9D7D2', // Stronger border contrast
        'tap-text': '#111111', // Near-black text
        'tap-muted': '#737373', // Neutral gray for metadata

        // TAP Intelligence Accents (data visualization only)
        'tap-crm': '#3AA9BE',
        'tap-radio': '#22C55E',
        'tap-press': '#EC4899',
        'tap-playlist': '#A855F7',
        'tap-pitch': '#F59E0B',
        'tap-momentum': '#EAB308',

        // Monochrome base
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        240: '240ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
