/**
 * ColorSwatch - Display individual color swatches
 */

import React from 'react';

export interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (color: string) => void;
  selected?: boolean;
  showHex?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  size = 'md',
  onClick,
  selected = false,
  showHex = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => onClick?.(color)}
        className={`${sizeClasses[size]} rounded-xl transition-all duration-240 ${
          selected ? 'ring-2 ring-[#3AA9BE] ring-offset-2' : ''
        } ${onClick ? 'hover:scale-110 cursor-pointer' : ''}`}
        style={{ backgroundColor: color }}
        aria-label={`Color ${color}`}
      />
      {showHex && (
        <span className="text-xs font-mono text-gray-400">{color}</span>
      )}
    </div>
  );
};
