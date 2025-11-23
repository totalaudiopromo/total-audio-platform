/**
 * CISButton - Standard button component
 */

import React from 'react';

export interface CISButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const CISButton: React.FC<CISButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'rounded-xl font-medium transition-all duration-240 inline-flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-[#3AA9BE] text-white hover:bg-[#2d8a9e]',
    secondary: 'bg-[#374151] text-white hover:bg-[#4B5563]',
    ghost: 'text-[#3AA9BE] hover:bg-[#1F2937]',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};
