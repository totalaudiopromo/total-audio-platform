/**
 * LoadingState - Minimal loading indicator
 */

import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ message = 'Loading...', size = 'md', className = '' }: LoadingStateProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-2 border-slate-700 rounded-full" />
        <div className="absolute inset-0 border-2 border-[#3AA9BE] rounded-full border-t-transparent animate-spin" />
      </div>
      {message && (
        <p className="mt-4 text-sm text-slate-400">{message}</p>
      )}
    </div>
  );
}
