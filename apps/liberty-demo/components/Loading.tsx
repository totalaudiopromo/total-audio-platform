import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ message, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Monochrome spinner */}
      <div
        className={`${sizeClasses[size]} border-2 border-[#D9D7D2] border-t-[#111] rounded-full animate-spin`}
      />
      {message && <p className="mt-4 text-sm text-[#737373] font-jakarta">{message}</p>}
    </div>
  );
};

export default Loading;
