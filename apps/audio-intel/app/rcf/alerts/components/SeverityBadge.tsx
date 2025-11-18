/**
 * Severity Badge Component
 * Visual badge indicating alert severity level
 */

type Severity = 'info' | 'warning' | 'critical';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
}

const SEVERITY_STYLES: Record<Severity, string> = {
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const SEVERITY_ICONS: Record<Severity, string> = {
  info: 'ℹ',
  warning: '⚠',
  critical: '🔥',
};

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center space-x-1 rounded border font-medium font-mono
        transition-all duration-240 ease-out
        ${SEVERITY_STYLES[severity]}
        ${SIZE_STYLES[size]}
      `}
    >
      <span>{SEVERITY_ICONS[severity]}</span>
      <span>{severity.toUpperCase()}</span>
    </span>
  );
}
