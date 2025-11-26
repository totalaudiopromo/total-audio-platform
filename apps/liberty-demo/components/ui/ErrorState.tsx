import { AlertTriangle, RefreshCw, WifiOff, Lock, ServerCrash } from 'lucide-react';

type ErrorVariant = 'default' | 'network' | 'auth' | 'server' | 'timeout';

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const variantConfig: Record<
  ErrorVariant,
  { icon: React.ElementType; defaultTitle: string; defaultDescription: string }
> = {
  default: {
    icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    defaultDescription: "We couldn't load this data. Please try again.",
  },
  network: {
    icon: WifiOff,
    defaultTitle: 'Connection issue',
    defaultDescription: 'Check your internet connection and try again.',
  },
  auth: {
    icon: Lock,
    defaultTitle: 'Authentication required',
    defaultDescription: 'Please reconnect your account to access this data.',
  },
  server: {
    icon: ServerCrash,
    defaultTitle: 'Service unavailable',
    defaultDescription: 'The service is temporarily unavailable. Try again shortly.',
  },
  timeout: {
    icon: RefreshCw,
    defaultTitle: 'Request timed out',
    defaultDescription: 'The request took too long. Please try again.',
  },
};

export function ErrorState({
  variant = 'default',
  title,
  description,
  onRetry,
  className = '',
}: ErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-sm font-medium text-slate-900 mb-1">{title || config.defaultTitle}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-4">
        {description || config.defaultDescription}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
