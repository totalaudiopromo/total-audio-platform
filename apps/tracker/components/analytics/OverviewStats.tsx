import { getOverviewStats } from '@/lib/analytics';
import { AlertCircle } from 'lucide-react';

// ========================================
// Types
// ========================================

interface Metric {
  label: string;
  value: string | number;
  borderColour: string;
  bgColour: string;
  textColour: string;
  showProgress: boolean;
  progress?: number;
  progressColour?: string;
  ariaDescription?: string;
}

// ========================================
// Error Component
// ========================================

function StatsError() {
  return (
    <div
      className="bg-red-50 rounded-2xl p-6 border-4 border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <p className="font-black text-red-900">Unable to load statistics</p>
          <p className="text-sm font-medium text-red-700">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// Component
// ========================================

export default async function OverviewStats() {
  let stats;

  try {
    stats = await getOverviewStats();
  } catch (error) {
    console.error('Failed to load overview stats:', error);
    return <StatsError />;
  }

  const responsePct = Math.round(stats.responseRate * 100);
  const budgetPct =
    stats.budgetAllocated > 0
      ? Math.min(
          100,
          Math.round((stats.budgetSpent / stats.budgetAllocated) * 100)
        )
      : 0;

  const metrics: Metric[] = [
    {
      label: 'Total Campaigns',
      value: stats.totalCampaigns,
      borderColour: 'border-teal-500',
      bgColour: 'bg-gradient-to-br from-teal-50 to-teal-100',
      textColour: 'text-teal-600',
      showProgress: false,
      ariaDescription: `You have ${stats.totalCampaigns} total campaigns`,
    },
    {
      label: 'Active',
      value: stats.activeCampaigns,
      borderColour: 'border-green-500',
      bgColour: 'bg-gradient-to-br from-green-50 to-green-100',
      textColour: 'text-green-600',
      showProgress: false,
      ariaDescription: `${stats.activeCampaigns} campaigns are currently active`,
    },
    {
      label: 'Response Rate',
      value: `${responsePct}%`,
      borderColour:
        responsePct >= 30
          ? 'border-green-500'
          : responsePct >= 10
            ? 'border-yellow-500'
            : 'border-red-500',
      bgColour:
        responsePct >= 30
          ? 'bg-gradient-to-br from-green-50 to-green-100'
          : responsePct >= 10
            ? 'bg-gradient-to-br from-yellow-50 to-yellow-100'
            : 'bg-gradient-to-br from-red-50 to-red-100',
      textColour:
        responsePct >= 30
          ? 'text-green-600'
          : responsePct >= 10
            ? 'text-yellow-600'
            : 'text-red-600',
      showProgress: true,
      progress: responsePct,
      progressColour:
        responsePct >= 30
          ? 'bg-green-500'
          : responsePct >= 10
            ? 'bg-yellow-500'
            : 'bg-red-500',
      ariaDescription: `Response rate is ${responsePct} percent, ${responsePct >= 30 ? 'performing well' : responsePct >= 10 ? 'average performance' : 'needs improvement'}`,
    },
    {
      label: 'Budget Utilisation',
      value: `${budgetPct}%`,
      borderColour: 'border-orange-500',
      bgColour: 'bg-gradient-to-br from-orange-50 to-orange-100',
      textColour: 'text-orange-600',
      showProgress: true,
      progress: budgetPct,
      progressColour: 'bg-orange-500',
      ariaDescription: `Budget utilisation is ${budgetPct} percent`,
    },
  ];

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      role="region"
      aria-label="Campaign overview statistics"
    >
      {metrics.map(metric => (
        <div
          key={metric.label}
          className={`${metric.bgColour} rounded-2xl p-6 border-4 ${metric.borderColour} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
          role="article"
          aria-label={metric.ariaDescription}
        >
          <div className="text-sm font-black text-gray-700 uppercase tracking-wider mb-2">
            {metric.label}
          </div>
          <div className={`text-4xl font-black ${metric.textColour} mb-2`}>
            {metric.value}
          </div>
          {metric.showProgress && metric.progress !== undefined && (
            <div
              className="h-2 bg-white/50 rounded-full overflow-hidden border border-gray-300"
              role="progressbar"
              aria-valuenow={metric.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${metric.label}: ${metric.progress}%`}
            >
              <div
                className={`h-2 rounded-full ${metric.progressColour} transition-all duration-500`}
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
