import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function MetricCard({ label, value, icon, trend, trendValue, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6",
        "hover:border-slate-700/50 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-mono text-slate-500 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>

          {trend && trendValue && (
            <div className="mt-3 flex items-center gap-2">
              <TrendIndicator trend={trend} />
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' && "text-emerald-400",
                trend === 'down' && "text-rose-400",
                trend === 'neutral' && "text-slate-400"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className="p-3 bg-[#3AA9BE]/10 rounded-xl text-[#3AA9BE]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function TrendIndicator({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') {
    return (
      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    );
  }

  if (trend === 'down') {
    return (
      <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  );
}
