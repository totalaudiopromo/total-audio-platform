import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden",
        "hover:border-slate-700/50 transition-all duration-200",
        className
      )}
    >
      <div className="border-b border-slate-800/50 px-6 py-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          {description && (
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
