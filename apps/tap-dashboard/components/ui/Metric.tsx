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
    <div className="space-y-2">
      <p className="postcraft-metric-label">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="postcraft-metric-value">
          {formattedValue()}
        </p>
        {change && (
          <span
            className={clsx('text-sm font-bold', {
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
