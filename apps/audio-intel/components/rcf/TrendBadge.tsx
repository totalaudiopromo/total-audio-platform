/**
 * Trend Badge Component
 * Show trend direction and magnitude
 */

interface TrendBadgeProps {
  change: number;
  format?: 'percent' | 'number';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function TrendBadge({ change, format = 'percent', size = 'md', showIcon = true }: TrendBadgeProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const color = isNeutral
    ? 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    : isPositive
    ? 'bg-green-500/10 text-green-400 border-green-500/30'
    : 'bg-red-500/10 text-red-400 border-red-500/30';

  const icon = isNeutral ? '→' : isPositive ? '↑' : '↓';

  const formattedValue =
    format === 'percent'
      ? `${Math.abs(change).toFixed(1)}%`
      : Math.abs(change).toFixed(1);

  return (
    <span
      className={`
        inline-flex items-center space-x-1 rounded border font-mono font-medium
        transition-all duration-240 ease-out
        ${color}
        ${SIZE_STYLES[size]}
      `}
    >
      {showIcon && <span>{icon}</span>}
      <span>
        {isPositive && '+'}
        {formattedValue}
      </span>
    </span>
  );
}
