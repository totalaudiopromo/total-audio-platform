/**
 * Score Delta Pill Component
 * Shows the difference/delta between two metrics with color coding
 */

interface ScoreDeltaPillProps {
  value: number;
  format?: 'number' | 'percent' | 'decimal';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function ScoreDeltaPill({ value, format = 'number', size = 'md' }: ScoreDeltaPillProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const color = isNeutral
    ? 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    : isPositive
    ? 'bg-green-500/10 text-green-400 border-green-500/30'
    : 'bg-red-500/10 text-red-400 border-red-500/30';

  const icon = isNeutral ? '=' : isPositive ? '↑' : '↓';

  const formattedValue =
    format === 'percent'
      ? `${Math.abs(value).toFixed(1)}%`
      : format === 'decimal'
      ? Math.abs(value).toFixed(2)
      : Math.abs(value).toFixed(0);

  return (
    <span
      className={`
        inline-flex items-center space-x-1 rounded border font-medium font-mono
        transition-all duration-240 ease-out
        ${color}
        ${SIZE_STYLES[size]}
      `}
    >
      <span>{icon}</span>
      <span>
        {isPositive && '+'}
        {formattedValue}
      </span>
    </span>
  );
}
