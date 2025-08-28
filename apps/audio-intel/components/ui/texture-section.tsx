import React from 'react';
import { cn } from '@/lib/utils';

interface TextureSectionProps {
  children: React.ReactNode;
  className?: string;
  texture?: 'paper' | 'grain' | 'luma' | 'paper-2' | 'grain-2' | 'luma-2' | 'none';
  blendMode?: 'overlay' | 'multiply' | 'soft-light' | 'screen' | 'color-dodge' | 'none';
  opacity?: '02' | '03' | '05' | '08' | '10' | '15' | '20';
  variant?: 'hero' | 'content' | 'footer' | 'nav' | 'pricing' | 'features';
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fullHeight?: boolean;
  overlay?: boolean;
  gradient?: boolean;
}

const textureClasses = {
  paper: 'texture-paper',
  'paper-2': 'texture-paper-2',
  grain: 'texture-grain',
  'grain-2': 'texture-grain-2',
  luma: 'texture-luma',
  'luma-2': 'texture-luma-2',
  none: '',
};

const blendModeClasses = {
  overlay: 'texture-blend-overlay',
  multiply: 'texture-blend-multiply',
  'soft-light': 'texture-blend-soft-light',
  screen: 'texture-blend-screen',
  'color-dodge': 'texture-blend-color-dodge',
  none: '',
};

const opacityClasses = {
  '02': 'texture-opacity-02',
  '03': 'texture-opacity-03',
  '05': 'texture-opacity-05',
  '08': 'texture-opacity-08',
  '10': 'texture-opacity-10',
  '15': 'texture-opacity-15',
  '20': 'texture-opacity-20',
};

const variantClasses = {
  hero: 'texture-hero',
  content: 'texture-section',
  footer: 'texture-footer',
  nav: 'texture-nav',
  pricing: 'texture-section',
  features: 'texture-section',
};

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-gray-50 to-white',
  transparent: 'bg-transparent',
};

const paddingClasses = {
  sm: 'py-8 px-4',
  md: 'py-12 px-4',
  lg: 'py-16 px-4',
  xl: 'py-20 px-4',
  '2xl': 'py-24 px-4',
};

export const TextureSection: React.FC<TextureSectionProps> = ({
  children,
  className,
  texture = 'paper',
  blendMode = 'overlay',
  opacity = '08',
  variant = 'content',
  background = 'white',
  padding = 'lg',
  fullHeight = false,
  overlay = true,
  gradient = false,
}) => {
  const baseClasses = cn(
    'relative',
    variantClasses[variant],
    backgroundClasses[background],
    paddingClasses[padding],
    {
      'min-h-screen': fullHeight,
    },
    className
  );

  return (
    <section className={baseClasses}>
      {/* Background texture */}
      {texture !== 'none' && (
        <div
          className={cn(
            'absolute inset-0',
            textureClasses[texture],
            blendModeClasses[blendMode],
            opacityClasses[opacity],
            'pointer-events-none'
          )}
        />
      )}

      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-yellow/5 pointer-events-none" />
      )}

      {/* Content overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

// Specialized section components
export const TextureHeroSection: React.FC<Omit<TextureSectionProps, 'variant' | 'background' | 'padding'>> = (props) => (
  <TextureSection
    variant="hero"
    background="gradient"
    padding="2xl"
    fullHeight={true}
    gradient={true}
    {...props}
  />
);

export const TextureContentSection: React.FC<Omit<TextureSectionProps, 'variant' | 'background'>> = (props) => (
  <TextureSection
    variant="content"
    background="white"
    {...props}
  />
);

export const TexturePricingSection: React.FC<Omit<TextureSectionProps, 'variant' | 'background'>> = (props) => (
  <TextureSection
    variant="pricing"
    background="gray"
    texture="grain"
    opacity="05"
    {...props}
  />
);

export const TextureFeaturesSection: React.FC<Omit<TextureSectionProps, 'variant' | 'background'>> = (props) => (
  <TextureSection
    variant="features"
    background="white"
    texture="paper-2"
    opacity="03"
    {...props}
  />
);

export const TextureNavSection: React.FC<Omit<TextureSectionProps, 'variant' | 'background' | 'padding'>> = (props) => (
  <TextureSection
    variant="nav"
    background="transparent"
    padding="sm"
    overlay={false}
    {...props}
  />
);

export const TextureFooterSection: React.FC<Omit<TextureSectionProps, 'variant' | 'background'>> = (props) => (
  <TextureSection
    variant="footer"
    background="gray"
    texture="paper"
    opacity="03"
    {...props}
  />
);

// Container component for consistent spacing
interface TextureContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export const TextureContainer: React.FC<TextureContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  centered = true,
}) => {
  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        {
          'mx-auto': centered,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid component for texture layouts
interface TextureGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export const TextureGrid: React.FC<TextureGridProps> = ({
  children,
  className,
  cols = 3,
  gap = 'md',
  responsive = true,
}) => {
  return (
    <div
      className={cn(
        'grid',
        responsive ? colsClasses[cols] : `grid-cols-${cols}`,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}; 