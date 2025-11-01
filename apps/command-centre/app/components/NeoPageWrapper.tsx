/**
 * Performance-optimized page wrapper with consistent neobrutalist styling
 */

import React from 'react';

interface NeoPageWrapperProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export const NeoPageWrapper: React.FC<NeoPageWrapperProps> = ({ children, maxWidth = '7xl' }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-8`}>{children}</div>
    </div>
  );
};

export default NeoPageWrapper;
