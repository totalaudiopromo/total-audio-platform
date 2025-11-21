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
        // Postcraft Neobrutalist Palette
        'postcraft-blue': '#3b82f6',
        'postcraft-purple': '#8b5cf6',
        'postcraft-green': '#10b981',
        'postcraft-orange': '#f59e0b',
        'postcraft-red': '#ef4444',
        'postcraft-yellow': '#eab308',
        'postcraft-cyan': '#06b6d4',
        'postcraft-pink': '#ec4899',
        'postcraft-black': '#000000',
        'postcraft-white': '#ffffff',
        'postcraft-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'brutal': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-xl': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
