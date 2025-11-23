/**
 * Metric Pill Component
 * Display metric values with optional color coding
 */

interface MetricPillProps {
  label: string;
  value: string | number;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const COLOR_STYLES = {
  default: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  primary: 'bg-[#3AA9BE]/20 text-[#3AA9BE] border-[#3AA9BE]/30',
  success: 'bg-green-500/10 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export function MetricPill({ label, value, color = 'default', size = 'md' }: MetricPillProps) {
  return (
    <div
      className={`
        inline-flex items-center space-x-2 rounded border font-mono
        transition-all duration-240 ease-out
        ${COLOR_STYLES[color]}
        ${SIZE_STYLES[size]}
      `}
    >
      <span className="opacity-70">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
