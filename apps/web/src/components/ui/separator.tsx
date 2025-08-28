import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Separator = ({ orientation = 'horizontal', className = '' }: SeparatorProps) => {
  const orientationClasses = {
    horizontal: 'h-px w-full',
    vertical: 'h-full w-px'
  };
  
  const classes = `shrink-0 bg-gray-200 ${orientationClasses[orientation]} ${className}`;
  
  return (
    <div className={classes} />
  );
};

export { Separator }; 