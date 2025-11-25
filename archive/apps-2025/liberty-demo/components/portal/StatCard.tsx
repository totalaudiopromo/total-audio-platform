'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  suffix?: string;
  accentColor?: 'crm' | 'radio' | 'press' | 'playlist' | 'pitch' | 'momentum';
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  trend,
  suffix,
  accentColor,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} className="tap-accent-momentum" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-[#737373]" />;
    return <Minus size={14} className="text-[#D9D7D2]" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'tap-accent-momentum';
    if (trend === 'down') return 'text-[#737373]';
    return 'text-[#737373]';
  };

  const getAccentClass = () => {
    if (!accentColor) return '';
    return `tap-accent-${accentColor}`;
  };

  return (
    <div className="liberty-card">
      <div className="liberty-label text-[11px] mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className={`text-3xl font-mono font-bold text-[#111] ${getAccentClass()}`}>
          {value}
          {suffix && <span className="text-lg text-[#737373] ml-1 font-jakarta">{suffix}</span>}
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-mono">
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          <span className="text-[#737373] text-xs font-jakarta">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
