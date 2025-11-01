import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
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
        brand: {
          blue: '#3B4AC6',
          yellow: '#FFD700',
        },
        // Tool-specific colors for Audio brand system
        'audio-intel': {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1E88E5',
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A3D91',
        },
        'playlist-pulse': {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#43A047',
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#0F4C14',
        },
        'release-radar': {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#F57C00',
          700: '#EF6C00',
          800: '#E65100',
          900: '#BF360C',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backdropBlur: {
        xs: '2px',
      },
      // Enhanced Texture-specific utilities
      backgroundImage: {
        // Paper Textures
        'texture-paper-1': "url('/textures/DRS_MagazineTexture_8K_81.jpg')",
        'texture-paper-2': "url('/textures/DRS_MagazineTexture_8K_82.jpg')",
        'texture-paper-3': "url('/textures/DRS_MagazineTexture_8K_83.jpg')",
        'texture-paper-4': "url('/textures/DRS_MagazineTexture_8K_84.jpg')",
        'texture-paper-5': "url('/textures/DRS_MagazineTexture_8K_85.jpg')",
        'texture-paper-6': "url('/textures/DRS_MagazineTexture_8K_71.jpg')",
        'texture-paper-7': "url('/textures/DRS_MagazineTexture_8K_66.jpg')",
        'texture-paper-8': "url('/textures/DRS_MagazineTexture_8K_63.jpg')",
        'texture-paper-9': "url('/textures/DRS_MagazineTexture_8K_62.jpg')",
        'texture-paper-10': "url('/textures/DRS_MagazineTexture_8K_60.jpg')",
        'texture-paper-11': "url('/textures/DRS_MagazineTexture_8K_55.jpg')",
        'texture-paper-12': "url('/textures/DRS_MagazineTexture_8K_54.jpg')",
        'texture-paper-13': "url('/textures/DRS_MagazineTexture_8K_53.jpg')",
        'texture-paper-14': "url('/textures/DRS_MagazineTexture_8K_52.jpg')",

        // Grain Textures (subset of paper textures for variety)
        'texture-grain-1': "url('/textures/DRS_MagazineTexture_8K_52.jpg')",
        'texture-grain-2': "url('/textures/DRS_MagazineTexture_8K_53.jpg')",
        'texture-grain-3': "url('/textures/DRS_MagazineTexture_8K_54.jpg')",
        'texture-grain-4': "url('/textures/DRS_MagazineTexture_8K_55.jpg')",
        'texture-grain-5': "url('/textures/DRS_MagazineTexture_8K_60.jpg')",
        'texture-grain-6': "url('/textures/DRS_MagazineTexture_8K_62.jpg')",

        // Luma Gradients
        'texture-luma-1': "url('/textures/DRS_4K_Luma Gradient_01.jpg')",
        'texture-luma-2': "url('/textures/DRS_4K_Luma Gradient_02.jpg')",
        'texture-luma-3': "url('/textures/DRS_4K_Luma Gradient_03.jpg')",
        'texture-luma-4': "url('/textures/DRS_4K_Luma Gradient_04.jpg')",
        'texture-luma-5': "url('/textures/DRS_4K_Luma Gradient_05.jpg')",
        'texture-luma-6': "url('/textures/DRS_4K_Luma Gradient_06.jpg')",
        'texture-luma-7': "url('/textures/DRS_4K_Luma Gradient_07.jpg')",
        'texture-luma-8': "url('/textures/DRS_4K_Luma Gradient_08.jpg')",
        'texture-luma-9': "url('/textures/DRS_4K_Luma Gradient_09.jpg')",
        'texture-luma-10': "url('/textures/DRS_4K_Luma Gradient_10.jpg')",
        'texture-luma-11': "url('/textures/DRS_4K_Luma Gradient_11.jpg')",
        'texture-luma-12': "url('/textures/DRS_4K_Luma Gradient_12.jpg')",
        'texture-luma-13': "url('/textures/DRS_4K_Luma Gradient_13.jpg')",
        'texture-luma-14': "url('/textures/DRS_4K_Luma Gradient_14.jpg')",
        'texture-luma-15': "url('/textures/DRS_4K_Luma Gradient_15.jpg')",
        'texture-luma-16': "url('/textures/DRS_4K_Luma Gradient_16.jpg')",
        'texture-luma-17': "url('/textures/DRS_4K_Luma Gradient_17.jpg')",
        'texture-luma-18': "url('/textures/DRS_4K_Luma Gradient_18.jpg')",
        'texture-luma-19': "url('/textures/DRS_4K_Luma Gradient_19.jpg')",
        'texture-luma-20': "url('/textures/DRS_4K_Luma Gradient_20.jpg')",
        'texture-luma-22': "url('/textures/DRS_4K_Luma Gradient_22.jpg')",
        'texture-luma-23': "url('/textures/DRS_4K_Luma Gradient_23.jpg')",
        'texture-luma-24': "url('/textures/DRS_4K_Luma Gradient_24.jpg')",
        'texture-luma-25': "url('/textures/DRS_4K_Luma Gradient_25.jpg')",
        'texture-luma-26': "url('/textures/DRS_4K_Luma Gradient_26.jpg')",
        'texture-luma-27': "url('/textures/DRS_4K_Luma Gradient_27.jpg')",
        'texture-luma-28': "url('/textures/DRS_4K_Luma Gradient_28.jpg')",
        'texture-luma-29': "url('/textures/DRS_4K_Luma Gradient_29.jpg')",
        'texture-luma-30': "url('/textures/DRS_4K_Luma Gradient_30.jpg')",
        'texture-luma-31': "url('/textures/DRS_4K_Luma Gradient_31.jpg')",
        'texture-luma-32': "url('/textures/DRS_4K_Luma Gradient_32.jpg')",
        'texture-luma-33': "url('/textures/DRS_4K_Luma Gradient_33.jpg')",
        'texture-luma-34': "url('/textures/DRS_4K_Luma Gradient_34.jpg')",
        'texture-luma-35': "url('/textures/DRS_4K_Luma Gradient_35.jpg')",
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '-1': '-1deg',
        '-2': '-2deg',
        '-3': '-3deg',
        '0.5': '0.5deg',
        '-0.5': '-0.5deg',
      },
      boxShadow: {
        'texture-soft': '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'texture-elevated': '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
        'texture-floating': '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
        'texture-paper': '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'texture-glow': '0 0 20px rgba(59, 74, 198, 0.15), 0 4px 20px rgba(0, 0, 0, 0.08)',
        'texture-glow-yellow': '0 0 20px rgba(255, 215, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.08)',
        'texture-depth': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'texture-organic':
          '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'texture-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(0.5deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0deg)' },
          '75%': { transform: 'translateY(-5px) rotate(-0.5deg)' },
        },
        'texture-entrance': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px) rotate(2deg) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px) rotate(0deg) scale(1)',
          },
        },
        'texture-hover': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.02) rotate(0.5deg)' },
          '100%': { transform: 'scale(1.05) rotate(1deg)' },
        },
        'texture-stagger': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) rotate(1deg) scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0px) rotate(0deg) scale(1)',
          },
        },
        'texture-pulse': {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          },
          '50%': {
            transform: 'scale(1.02) rotate(0.5deg)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
          },
        },
        'texture-wave': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(0.3deg)' },
          '50%': { transform: 'translateY(-6px) rotate(0deg)' },
          '75%': { transform: 'translateY(-3px) rotate(-0.3deg)' },
        },
        'texture-breathe': {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scale(1.01) rotate(0.2deg)',
            opacity: '1',
          },
        },
        'texture-shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
            opacity: '0.8',
          },
          '100%': {
            backgroundPosition: '200% 0',
            opacity: '1',
          },
        },
        // Audio character animations
        'color-activate': {
          '0%': { filter: 'grayscale(1)' },
          '100%': { filter: 'grayscale(0)' },
        },
        'audio-bounce': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'success-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        'celebration-sparkle': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.2s ease',
        'spin-slow': 'spin-slow 2s linear infinite',
        blob: 'blob 7s infinite',
        float: 'float 6s ease-in-out infinite',
        'texture-float': 'texture-float 8s ease-in-out infinite',
        'texture-entrance': 'texture-entrance 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'texture-hover': 'texture-hover 0.3s ease-out',
        'texture-stagger': 'texture-stagger 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'texture-pulse': 'texture-pulse 3s ease-in-out infinite',
        'texture-wave': 'texture-wave 4s ease-in-out infinite',
        'texture-breathe': 'texture-breathe 5s ease-in-out infinite',
        'texture-shimmer': 'texture-shimmer 2s ease-in-out infinite',
        // Audio character animations
        'color-activate': 'color-activate 0.8s ease-in-out',
        'audio-bounce': 'audio-bounce 0.6s ease-in-out',
        'success-pulse': 'success-pulse 1.2s ease-in-out',
        'celebration-sparkle': 'celebration-sparkle 1.5s ease-in-out',
      },
      // Enhanced responsive breakpoints for textures
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        'texture-mobile': '480px',
        'texture-tablet': '768px',
        'texture-desktop': '1024px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
