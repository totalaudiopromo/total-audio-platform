import React from 'react';
import { cn } from '@/lib/utils';

interface TextureButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'texture';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  texture?: 'paper' | 'grain' | 'luma' | 'paper-2' | 'grain-2' | 'luma-2' | 'none';
  animation?: 'none' | 'pulse' | 'wave' | 'breathe' | 'shimmer';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'texture-btn bg-brand-blue text-white hover:bg-brand-blue/90',
  secondary: 'texture-btn bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'texture-btn bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
  ghost: 'texture-btn bg-transparent text-gray-700 hover:bg-gray-100',
  texture: 'texture-btn bg-gradient-to-r from-brand-blue to-brand-yellow text-white hover:from-brand-blue/90 hover:to-brand-yellow/90',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const textureClasses = {
  paper: 'texture-paper',
  'paper-2': 'texture-paper-2',
  grain: 'texture-grain',
  'grain-2': 'texture-grain-2',
  luma: 'texture-luma',
  'luma-2': 'texture-luma-2',
  none: '',
};

const animationClasses = {
  none: '',
  pulse: 'animate-texture-pulse',
  wave: 'animate-texture-wave',
  breathe: 'animate-texture-breathe',
  shimmer: 'animate-texture-shimmer',
};

export const TextureButton: React.FC<TextureButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  texture = 'grain',
  animation = 'none',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
}) => {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden',
    variantClasses[variant],
    sizeClasses[size],
    textureClasses[texture],
    animationClasses[animation],
    {
      'w-full': fullWidth,
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-not-allowed': loading,
      'texture-gpu-accelerated': !disabled,
      'texture-will-change': !disabled,
    },
    className
  );

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {/* Texture overlay */}
      {texture !== 'none' && (
        <div className="absolute inset-0 texture-overlay opacity-10" />
      )}
      
      {/* Gradient overlay for texture variant */}
      {variant === 'texture' && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-brand-yellow/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={cn('relative z-10', { 'opacity-0': loading })}>
        {children}
      </span>
    </button>
  );
};

// Specialized button variants
export const TexturePrimaryButton: React.FC<Omit<TextureButtonProps, 'variant'>> = (props) => (
  <TextureButton variant="primary" {...props} />
);

export const TextureSecondaryButton: React.FC<Omit<TextureButtonProps, 'variant'>> = (props) => (
  <TextureButton variant="secondary" {...props} />
);

export const TextureOutlineButton: React.FC<Omit<TextureButtonProps, 'variant'>> = (props) => (
  <TextureButton variant="outline" {...props} />
);

export const TextureGradientButton: React.FC<Omit<TextureButtonProps, 'variant'>> = (props) => (
  <TextureButton variant="texture" {...props} />
);

// Button group component
interface TextureButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export const TextureButtonGroup: React.FC<TextureButtonGroupProps> = ({
  children,
  className,
  vertical = false,
}) => {
  return (
    <div
      className={cn(
        'inline-flex',
        {
          'flex-col': vertical,
          'flex-row': !vertical,
        },
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as any;
          const newClassName = cn(
            childProps.className,
            {
              'rounded-r-none border-r-0': !vertical && index === 0,
              'rounded-l-none border-l-0': !vertical && index === React.Children.count(children) - 1,
              'rounded-b-none border-b-0': vertical && index === 0,
              'rounded-t-none border-t-0': vertical && index === React.Children.count(children) - 1,
              'rounded-none border-l-0 border-r-0': !vertical && index > 0 && index < React.Children.count(children) - 1,
              'rounded-none border-t-0 border-b-0': vertical && index > 0 && index < React.Children.count(children) - 1,
            }
          );
          return React.cloneElement(child, { className: newClassName } as any);
        }
        return child;
      })}
    </div>
  );
}; 