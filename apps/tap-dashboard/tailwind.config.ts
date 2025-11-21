import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tap-black': '#0B0D0E',
        'tap-panel': '#161A1D',
        'tap-cyan': '#3AA9BE',
        'tap-white': '#E9EDEF',
        'tap-grey': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'tap': '12px',
      },
      transitionDuration: {
        '180': '180ms',
      },
      boxShadow: {
        'tap': '0 4px 6px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
