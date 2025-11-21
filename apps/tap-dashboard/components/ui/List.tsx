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
      className={clsx('space-y-2', {
        'divide-y-2 divide-postcraft-gray-200': variant === 'bordered',
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
      className={clsx(
        'w-full text-left p-3 rounded-lg transition-all duration-150 border-2',
        {
          'hover:bg-postcraft-gray-50 hover:border-postcraft-black cursor-pointer border-transparent': onClick && !active,
          'bg-postcraft-blue text-postcraft-white border-postcraft-black shadow-brutal-sm font-bold': active,
          'border-transparent': !onClick && !active,
        }
      )}
    >
      {children}
    </Component>
  );
}
