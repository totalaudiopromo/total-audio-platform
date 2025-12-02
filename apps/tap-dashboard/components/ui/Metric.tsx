import clsx from 'clsx';

interface MetricProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  format?: 'number' | 'percentage' | 'currency';
}

export function Metric({ label, value, change, format = 'number' }: MetricProps) {
  const formattedValue = () => {
    if (format === 'percentage') return `${value}%`;
    if (format === 'currency') return `£${value}`;
    return value;
  };

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-mono font-bold text-foreground">{formattedValue()}</p>
        {change && (
          <span
            className={clsx('text-xs font-mono font-semibold', {
              'text-green-600': change.direction === 'up',
              'text-red-600': change.direction === 'down',
            })}
          >
            {change.direction === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
