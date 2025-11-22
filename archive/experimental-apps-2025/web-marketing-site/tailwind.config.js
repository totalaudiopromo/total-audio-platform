/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f6ab00',
          50: '#fef9e7',
          100: '#fdf2cc',
          200: '#fce399',
          300: '#fad066',
          400: '#f8be33',
          500: '#f6ab00',
          600: '#c48900',
          700: '#936700',
          800: '#624400',
          900: '#312200',
        },
        secondary: {
          DEFAULT: '#2538c7',
          50: '#eef1fd',
          100: '#dce3fb',
          200: '#b9c7f7',
          300: '#96abf3',
          400: '#738fef',
          500: '#2538c7',
          600: '#1e2ca0',
          700: '#172178',
          800: '#0f1650',
          900: '#080b28',
        },
        gray: {
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
        campaign: {
          radio: '#4285F4', // blue
          playlisting: '#A259FF', // purple
          press: '#34A853', // green
          influencer: '#FBBC05', // yellow
          promo: '#4285F4', // blue
          positive: '#34A853', // green
          negative: '#EA4335', // red
        },
        white: '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
