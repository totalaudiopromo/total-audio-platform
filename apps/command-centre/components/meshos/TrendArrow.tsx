/**
 * TrendArrow Component
 * Displays trend direction (+1, 0, -1)
 */

interface TrendArrowProps {
  trend: 1 | 0 | -1;
  size?: number;
}

export function TrendArrow({ trend, size = 16 }: TrendArrowProps) {
  if (trend === 0) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: `${size}px`,
          color: '#6B7280',
        }}
        title="No change"
      >
        →
      </span>
    );
  }

  const color = trend > 0 ? '#4EC4A0' : '#D96A6A';
  const arrow = trend > 0 ? '↑' : '↓';
  const label = trend > 0 ? 'Improving' : 'Declining';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: `${size}px`,
        color,
        fontWeight: 700,
      }}
      title={label}
    >
      {arrow}
    </span>
  );
}
