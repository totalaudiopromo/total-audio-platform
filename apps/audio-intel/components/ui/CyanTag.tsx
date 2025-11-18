/**
 * CyanTag - Slate cyan tag for scenes, microgenres, etc.
 */

import React from 'react';

interface CyanTagProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'subtle';
  className?: string;
  onClick?: () => void;
}

export function CyanTag({ children, variant = 'default', className = '', onClick }: CyanTagProps) {
  const variants = {
    default: 'bg-[#3AA9BE]/10 text-[#3AA9BE] border border-[#3AA9BE]/30',
    outlined: 'bg-transparent text-[#3AA9BE] border border-[#3AA9BE]/50',
    subtle: 'bg-slate-800/50 text-[#3AA9BE] border border-slate-700',
  };

  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-all duration-200';
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-[#3AA9BE]/20' : '';

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}
