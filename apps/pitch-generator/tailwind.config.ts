import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
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
        brand: {
          amber: '#F59E0B', // Primary brand colour - Pitch Generator (from live site)
          'amber-dark': '#D97706', // amber-600 - Darker amber for text/borders
          iris: '#2563EB', // Secondary - Audio Intel integration (from live site)
          magenta: '#14B8A6', // Accent - Tracker integration (from live site)
          charcoal: '#181C2F',
        },
        success: '#3DD68C',
        warning: '#F6BD60',
        danger: '#F25F5C',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Postcraft-style hard offset shadows (defined in globals.css)
        // Keep soft shadows available for edge cases only
        elevated: '0 24px 60px -30px rgba(76, 92, 246, 0.55)',
        panel: '0 18px 42px -22px rgba(24, 28, 47, 0.65)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Mascot animations
        'mascot-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'mascot-focus': {
          '0%, 100%': { transform: 'translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '75%': { transform: 'translateX(2px) rotate(1deg)' },
        },
        'mascot-celebrate': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.05)' },
        },
        'mascot-confused': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        'mascot-action': {
          '0%': { transform: 'translateX(0) rotate(0deg) scale(1)' },
          '20%': { transform: 'translateX(-8px) rotate(-10deg) scale(1.1)' },
          '40%': { transform: 'translateX(16px) rotate(15deg) scale(0.95)' },
          '60%, 100%': { transform: 'translateX(0) rotate(0deg) scale(1)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        // Mascot animations
        'mascot-float': 'mascot-float 3s ease-in-out infinite',
        'mascot-focus': 'mascot-focus 0.8s ease-in-out infinite',
        'mascot-celebrate': 'mascot-celebrate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
        'mascot-confused': 'mascot-confused 0.5s ease-in-out infinite',
        'mascot-action': 'mascot-action 1.2s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
