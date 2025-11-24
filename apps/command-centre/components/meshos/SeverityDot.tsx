/**
 * SeverityDot Component
 * Color-coded severity indicator
 */

interface SeverityDotProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}

const severityColors = {
  low: '#4EC4A0',     // Success green
  medium: '#E4B75F',   // Warning yellow
  high: '#D96A6A',     // Danger red
  critical: '#DC2626', // Critical red
};

const sizeMap = {
  sm: '6px',
  md: '8px',
  lg: '10px',
};

export function SeverityDot({ severity, size = 'md' }: SeverityDotProps) {
  return (
    <span
      className="severity-dot"
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        backgroundColor: severityColors[severity],
        boxShadow: `0 0 8px ${severityColors[severity]}40`,
      }}
      title={severity}
    />
  );
}
