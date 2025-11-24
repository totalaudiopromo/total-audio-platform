/**
 * TrendArrow - Displays trend direction with arrow icon
 */

import React from 'react';

interface TrendArrowProps {
  direction: 'up' | 'down' | 'stable' | 'rising' | 'falling';
  value?: number;
  className?: string;
}

export function TrendArrow({ direction, value, className = '' }: TrendArrowProps) {
  const normalizedDirection = direction === 'rising' ? 'up' : direction === 'falling' ? 'down' : direction;

  const config = {
    up: {
      icon: '↑',
      color: 'text-[#4EC4A0]',
      label: 'Rising',
    },
    down: {
      icon: '↓',
      color: 'text-[#D96A6A]',
      label: 'Falling',
    },
    stable: {
      icon: '→',
      color: 'text-slate-400',
      label: 'Stable',
    },
  };

  const { icon, color, label } = config[normalizedDirection];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`text-lg font-semibold ${color}`}>{icon}</span>
      {value !== undefined && (
        <span className={`text-sm font-medium ${color}`}>
          {value > 0 && '+'}
          {Math.round(value * 10) / 10}%
        </span>
      )}
      <span className="text-xs text-slate-500 ml-1">{label}</span>
    </div>
  );
}
