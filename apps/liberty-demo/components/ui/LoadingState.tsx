import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { spinner: 'w-4 h-4', text: 'text-xs', padding: 'py-4' },
  md: { spinner: 'w-6 h-6', text: 'text-sm', padding: 'py-8' },
  lg: { spinner: 'w-8 h-8', text: 'text-base', padding: 'py-12' },
};

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  className = '',
}: LoadingStateProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={'flex flex-col items-center justify-center ' + config.padding + ' ' + className}
    >
      <Loader2 className={config.spinner + ' text-cyan-600 animate-spin mb-2'} />
      <p className={config.text + ' text-slate-500'}>{message}</p>
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={'animate-pulse rounded-xl border border-slate-200 bg-white p-4 ' + className}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  );
}

// Skeleton loader for table rows
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton loader for stats
export function StatSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={'animate-pulse p-4 rounded-xl border border-slate-200 bg-white ' + className}>
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-8 bg-slate-200 rounded w-3/4" />
    </div>
  );
}
