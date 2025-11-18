/**
 * SystemTag Component
 * Color-coded system identifier tags
 */

interface SystemTagProps {
  system: string;
  size?: 'sm' | 'md';
}

const systemColors: Record<string, string> = {
  Autopilot: '#3B82F6',    // Blue
  MAL: '#8B5CF6',          // Purple
  CoachOS: '#10B981',      // Green
  CIS: '#A855F7',          // Purple
  Scenes: '#EC4899',       // Pink
  Talent: '#F59E0B',       // Orange
  MIG: '#14B8A6',          // Teal
  CMG: '#F97316',          // Orange
  Identity: '#6366F1',     // Indigo
  RCF: '#EF4444',          // Red
  Fusion: '#06B6D4',       // Cyan
};

export function SystemTag({ system, size = 'md' }: SystemTagProps) {
  const color = systemColors[system] || '#6B7280'; // Default gray
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';
  const padding = size === 'sm' ? '0.15rem 0.4rem' : '0.25rem 0.5rem';

  return (
    <span
      className="system-tag"
      style={{
        display: 'inline-block',
        padding,
        fontSize,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}40`,
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {system}
    </span>
  );
}
