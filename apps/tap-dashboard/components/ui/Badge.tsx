import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'teal'
    | 'amber'
    | 'blue'
    | 'slate';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx('badge-brutal', {
        'px-2 py-0.5 text-xs': size === 'sm',
        'px-3 py-1 text-sm': size === 'md',
        'bg-muted text-foreground': variant === 'default',
        'bg-green-100 text-green-700 border-green-600': variant === 'success',
        'bg-amber-100 text-amber-700 border-amber-600': variant === 'warning',
        'bg-red-100 text-red-700 border-red-600': variant === 'error',
        'bg-blue-100 text-blue-700 border-blue-600': variant === 'info',
        'bg-tracker-50 text-tracker-700 border-tracker': variant === 'teal',
        'bg-pitch-50 text-pitch-700 border-pitch': variant === 'amber',
        'bg-audio-intel-50 text-audio-intel-700 border-audio-intel': variant === 'blue',
        'bg-dashboard-100 text-dashboard-700 border-dashboard': variant === 'slate',
      })}
    >
      {children}
    </span>
  );
}
