import React from 'react';
import { cn } from '@/lib/utils';

interface TextureCardProps {
  children: React.ReactNode;
  className?: string;
  texture?: 'paper' | 'grain' | 'luma' | 'paper-2' | 'paper-3' | 'paper-4' | 'paper-5' | 'paper-6' | 'paper-7' | 'paper-8' | 'grain-2' | 'grain-3' | 'grain-4' | 'grain-5' | 'grain-6' | 'luma-2' | 'luma-3' | 'luma-4' | 'luma-5' | 'luma-6' | 'luma-7' | 'luma-8';
  animation?: 'entrance' | 'float' | 'hover' | 'stagger' | 'pulse' | 'wave' | 'breathe' | 'shimmer' | 'none';
  rotation?: 'none' | '1' | '2' | '3' | '-1' | '-2' | '-3' | '0.5' | '-0.5';
  delay?: 'none' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800';
  hover?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'pricing' | 'feature' | 'hero' | 'nav' | 'footer';
}

const textureClasses = {
  paper: 'texture-paper',
  'paper-2': 'texture-paper-2',
  'paper-3': 'texture-paper-3',
  'paper-4': 'texture-paper-4',
  'paper-5': 'texture-paper-5',
  'paper-6': 'texture-paper-6',
  'paper-7': 'texture-paper-7',
  'paper-8': 'texture-paper-8',
  grain: 'texture-grain',
  'grain-2': 'texture-grain-2',
  'grain-3': 'texture-grain-3',
  'grain-4': 'texture-grain-4',
  'grain-5': 'texture-grain-5',
  'grain-6': 'texture-grain-6',
  luma: 'texture-luma',
  'luma-2': 'texture-luma-2',
  'luma-3': 'texture-luma-3',
  'luma-4': 'texture-luma-4',
  'luma-5': 'texture-luma-5',
  'luma-6': 'texture-luma-6',
  'luma-7': 'texture-luma-7',
  'luma-8': 'texture-luma-8',
};

const animationClasses = {
  entrance: 'animate-texture-entrance',
  float: 'animate-texture-float',
  hover: 'hover:animate-texture-hover',
  stagger: 'animate-texture-stagger',
  pulse: 'animate-texture-pulse',
  wave: 'animate-texture-wave',
  breathe: 'animate-texture-breathe',
  shimmer: 'animate-texture-shimmer',
  none: '',
};

const rotationClasses = {
  none: '',
  '1': 'texture-rotate-1',
  '2': 'texture-rotate-2',
  '3': 'texture-rotate-3',
  '-1': 'texture-rotate-neg-1',
  '-2': 'texture-rotate-neg-2',
  '-3': 'texture-rotate-neg-3',
  '0.5': 'rotate-0.5',
  '-0.5': '-rotate-0.5',
};

const delayClasses = {
  none: '',
  '100': 'texture-delay-100',
  '200': 'texture-delay-200',
  '300': 'texture-delay-300',
  '400': 'texture-delay-400',
  '500': 'texture-delay-500',
  '600': 'texture-delay-600',
  '700': 'texture-delay-700',
  '800': 'texture-delay-800',
};

const variantClasses = {
  default: 'texture-card',
  pricing: 'texture-pricing-card',
  feature: 'texture-feature-card',
  hero: 'texture-hero',
  nav: 'texture-nav',
  footer: 'texture-footer',
};

export const TextureCard: React.FC<TextureCardProps> = ({
  children,
  className,
  texture = 'paper',
  animation = 'entrance',
  rotation = 'none',
  delay = 'none',
  hover = true,
  interactive = true,
  variant = 'default',
}) => {
  const baseClasses = cn(
    variantClasses[variant],
    textureClasses[texture],
    animationClasses[animation],
    rotationClasses[rotation],
    delayClasses[delay],
    {
      'texture-card-hover': hover && interactive,
      'texture-gpu-accelerated': interactive,
      'texture-will-change': interactive,
    },
    className
  );

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

// Specialized texture card components for common use cases
export const TexturePricingCard: React.FC<Omit<TextureCardProps, 'variant'> & { tier?: 'basic' | 'pro' | 'enterprise' }> = ({
  children,
  tier = 'basic',
  ...props
}) => {
  const tierTextures = {
    basic: 'paper' as const,
    pro: 'paper-2' as const,
    enterprise: 'paper-3' as const,
  };

  return (
    <TextureCard
      variant="pricing"
      texture={tierTextures[tier]}
      animation="stagger"
      rotation={tier === 'basic' ? '-1' : tier === 'pro' ? '1' : '-0.5'}
      {...props}
    >
      {children}
    </TextureCard>
  );
};

export const TextureFeatureCard: React.FC<Omit<TextureCardProps, 'variant'> & { index?: number }> = ({
  children,
  index = 0,
  ...props
}) => {
  const textures = ['grain', 'grain-2', 'grain-3', 'grain-4', 'grain-5', 'grain-6'];
  const texture = textures[index % textures.length];
  const delay = Math.min(index * 100, 500);

  return (
    <TextureCard
      variant="feature"
      texture={texture as any}
      animation="stagger"
      delay={delay.toString() as any}
      {...props}
    >
      {children}
    </TextureCard>
  );
};

export const TextureHeroCard: React.FC<Omit<TextureCardProps, 'variant'>> = (props) => {
  return (
    <TextureCard
      variant="hero"
      texture="paper"
      animation="entrance"
      rotation="none"
      {...props}
    >
      {props.children}
    </TextureCard>
  );
};

export const TextureNavCard: React.FC<Omit<TextureCardProps, 'variant'>> = (props) => {
  return (
    <TextureCard
      variant="nav"
      texture="grain"
      animation="none"
      rotation="none"
      hover={false}
      interactive={false}
      {...props}
    >
      {props.children}
    </TextureCard>
  );
};

export const TextureFooterCard: React.FC<Omit<TextureCardProps, 'variant'>> = (props) => {
  return (
    <TextureCard
      variant="footer"
      texture="paper"
      animation="none"
      rotation="none"
      hover={false}
      interactive={false}
      {...props}
    >
      {props.children}
    </TextureCard>
  );
}; 