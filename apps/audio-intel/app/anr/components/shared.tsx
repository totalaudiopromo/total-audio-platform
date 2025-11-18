import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// TagPill - for genres, scenes, etc.
export function TagPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
        "bg-slate-800/50 text-slate-300 border border-slate-700/50",
        className
      )}
    >
      {children}
    </span>
  );
}

// EmptyState - for empty lists
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-800/50 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

// LoadingSpinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-slate-700 border-t-[#3AA9BE]",
        size === 'sm' && "w-4 h-4",
        size === 'md' && "w-6 h-6",
        size === 'lg' && "w-8 h-8"
      )}
    />
  );
}

// StatusBadge - for deal stages, etc.
interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const colors = {
    default: 'bg-slate-800/50 text-slate-300 border-slate-700/50',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-[#3AA9BE]/10 text-[#3AA9BE] border-[#3AA9BE]/20',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
        colors[variant],
        className
      )}
    >
      {status}
    </span>
  );
}
