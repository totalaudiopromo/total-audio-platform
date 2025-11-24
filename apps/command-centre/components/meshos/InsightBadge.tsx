/**
 * InsightBadge Component
 * Badge for insight types and impacts
 */

interface InsightBadgeProps {
  type: 'opportunity' | 'risk' | 'conflict' | 'drift' | 'plan' | 'info';
  label: string;
  impact?: 'low' | 'medium' | 'high';
}

const typeColors = {
  opportunity: '#3AA9BE', // Cyan
  risk: '#E4B75F',        // Warning yellow
  conflict: '#D96A6A',    // Danger red
  drift: '#F97316',       // Orange
  plan: '#8B5CF6',        // Purple
  info: '#6B7280',        // Gray
};

const impactIntensity = {
  low: '30',
  medium: '50',
  high: '80',
};

export function InsightBadge({ type, label, impact }: InsightBadgeProps) {
  const color = typeColors[type];
  const intensity = impact ? impactIntensity[impact] : '50';

  return (
    <span
      className="insight-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.6rem',
        fontSize: '0.7rem',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        color: '#FFF',
        backgroundColor: `${color}${intensity}`,
        border: `1px solid ${color}`,
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
