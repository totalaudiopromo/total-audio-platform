import { AlertCircle, Inbox, FileQuestion, Users, Calendar, Mail, Database } from 'lucide-react';

type EmptyStateVariant =
  | 'default'
  | 'campaigns'
  | 'submissions'
  | 'timelines'
  | 'team'
  | 'emails'
  | 'data';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: React.ElementType; defaultTitle: string; defaultDescription: string }
> = {
  default: {
    icon: Inbox,
    defaultTitle: 'No data available',
    defaultDescription: "There's nothing to display at the moment.",
  },
  campaigns: {
    icon: FileQuestion,
    defaultTitle: 'No campaigns yet',
    defaultDescription: 'Create your first campaign to start tracking progress.',
  },
  submissions: {
    icon: Inbox,
    defaultTitle: 'No submissions',
    defaultDescription: 'Artist intake submissions will appear here once received.',
  },
  timelines: {
    icon: Calendar,
    defaultTitle: 'No active timelines',
    defaultDescription: 'Campaign timelines from Monday.com will appear here.',
  },
  team: {
    icon: Users,
    defaultTitle: 'No team members',
    defaultDescription: 'Staff allocations will appear once synced from Monday.com.',
  },
  emails: {
    icon: Mail,
    defaultTitle: 'No messages',
    defaultDescription: 'Email threads will appear here once connected.',
  },
  data: {
    icon: Database,
    defaultTitle: 'No data found',
    defaultDescription: 'Try adjusting your filters or check back later.',
  },
};

export function EmptyState({
  variant = 'default',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-medium text-slate-900 mb-1">{title || config.defaultTitle}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-4">
        {description || config.defaultDescription}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors min-h-[44px]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
