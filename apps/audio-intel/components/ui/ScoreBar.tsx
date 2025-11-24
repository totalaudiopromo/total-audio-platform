/**
 * ScoreBar - Horizontal progress bar for scores/metrics
 */

import React from 'react';

interface ScoreBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'cyan' | 'green' | 'yellow' | 'red' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'cyan',
  size = 'md',
  className = '',
}: ScoreBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    cyan: 'bg-[#3AA9BE]',
    green: 'bg-[#4EC4A0]',
    yellow: 'bg-[#E4B75F]',
    red: 'bg-[#D96A6A]',
    slate: 'bg-slate-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs text-slate-400 min-w-[80px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {label}
        </span>
      )}
      <div className={`flex-1 bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span
          className={`text-xs font-medium min-w-[40px] text-right ${
            color === 'cyan' ? 'text-[#3AA9BE]' :
            color === 'green' ? 'text-[#4EC4A0]' :
            color === 'yellow' ? 'text-[#E4B75F]' :
            color === 'red' ? 'text-[#D96A6A]' :
            'text-slate-400'
          }`}
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {Math.round(value)}
        </span>
      )}
    </div>
  );
}
