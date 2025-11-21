import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'postcraft-badge',
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3.5 py-1.5 text-sm': size === 'md',
          'bg-postcraft-gray-100 text-postcraft-gray-900': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-900': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-blue-100 text-blue-800': variant === 'info',
        }
      )}
    >
      {children}
    </span>
  );
}
