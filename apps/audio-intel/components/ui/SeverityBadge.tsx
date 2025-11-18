/**
 * SeverityBadge - Displays severity level with color coding
 */

import React from 'react';

interface SeverityBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  label?: string;
  className?: string;
}

export function SeverityBadge({ level, label, className = '' }: SeverityBadgeProps) {
  const config = {
    low: {
      bg: 'bg-slate-800',
      text: 'text-slate-400',
      dot: 'bg-slate-500',
      label: label || 'Low',
    },
    medium: {
      bg: 'bg-yellow-900/20',
      text: 'text-[#E4B75F]',
      dot: 'bg-[#E4B75F]',
      label: label || 'Medium',
    },
    high: {
      bg: 'bg-orange-900/20',
      text: 'text-orange-400',
      dot: 'bg-orange-400',
      label: label || 'High',
    },
    critical: {
      bg: 'bg-red-900/20',
      text: 'text-[#D96A6A]',
      dot: 'bg-[#D96A6A]',
      label: label || 'Critical',
    },
  };

  const { bg, text, dot, label: displayLabel } = config[level];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${bg} ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className={`text-xs font-medium ${text}`}>{displayLabel}</span>
    </div>
  );
}
