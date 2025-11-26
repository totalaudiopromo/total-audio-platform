import { RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataFreshnessProps {
  lastUpdated?: Date | string | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  className?: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return diffMins + 'm ago';
  if (diffHours < 24) return diffHours + 'h ago';
  if (diffDays < 7) return diffDays + 'd ago';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getFreshnessStatus(date: Date): 'fresh' | 'stale' | 'old' {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 15) return 'fresh';
  if (diffMins < 60) return 'stale';
  return 'old';
}

export function DataFreshness({
  lastUpdated,
  isLoading = false,
  onRefresh,
  showRefreshButton = true,
  className = '',
}: DataFreshnessProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [status, setStatus] = useState<'fresh' | 'stale' | 'old'>('fresh');

  useEffect(() => {
    if (!lastUpdated) return;

    const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;

    const updateTime = () => {
      setTimeAgo(formatTimeAgo(date));
      setStatus(getFreshnessStatus(date));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (isLoading) {
    return (
      <div className={'flex items-center gap-1.5 text-xs text-slate-500 ' + className}>
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span>Updating...</span>
      </div>
    );
  }

  if (!lastUpdated) {
    return null;
  }

  const statusConfig = {
    fresh: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    stale: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    old: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };

  const { icon: Icon, color } = statusConfig[status];

  return (
    <div className={'flex items-center gap-2 ' + className}>
      <div className={'flex items-center gap-1.5 text-xs ' + color}>
        <Icon className="w-3 h-3" />
        <span>Updated {timeAgo}</span>
      </div>
      {showRefreshButton && onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Refresh data"
        >
          <RefreshCw className={'w-3.5 h-3.5 ' + (isLoading ? 'animate-spin' : '')} />
        </button>
      )}
    </div>
  );
}
