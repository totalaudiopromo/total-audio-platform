import { ReactNode } from 'react';
import clsx from 'clsx';

interface ListProps {
  children: ReactNode;
  variant?: 'default' | 'bordered';
}

interface ListItemProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export function List({ children, variant = 'default' }: ListProps) {
  return (
    <ul
      className={clsx('space-y-1', {
        'divide-y divide-border': variant === 'bordered',
      })}
    >
      {children}
    </ul>
  );
}

export function ListItem({ children, onClick, active }: ListItemProps) {
  const Component = onClick ? 'button' : 'li';

  return (
    <Component
      onClick={onClick}
      className={clsx('w-full text-left p-3 rounded-xl transition-all duration-180 min-h-[44px]', {
        'hover:bg-muted cursor-pointer': onClick,
        'bg-muted border-2 border-black shadow-brutal-sm': active,
      })}
    >
      {children}
    </Component>
  );
}
