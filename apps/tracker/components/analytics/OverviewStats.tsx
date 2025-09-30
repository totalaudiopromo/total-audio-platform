import { getOverviewStats } from '@/lib/analytics';

export default async function OverviewStats() {
  const stats = await getOverviewStats();
  const responsePct = Math.round(stats.responseRate * 100);
  const budgetPct = stats.budgetAllocated > 0 ? Math.min(100, Math.round((stats.budgetSpent / stats.budgetAllocated) * 100)) : 0;

  const metrics = [
    {
      label: 'Total Campaigns',
      value: stats.totalCampaigns,
      gradient: 'from-blue-500 to-blue-600',
      showProgress: false,
    },
    {
      label: 'Active',
      value: stats.activeCampaigns,
      gradient: 'from-green-500 to-green-600',
      showProgress: false,
    },
    {
      label: 'Response Rate',
      value: `${responsePct}%`,
      gradient: responsePct >= 30 ? 'from-green-500 to-green-600' : responsePct >= 10 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600',
      showProgress: true,
      progress: responsePct,
      progressColor: responsePct >= 30 ? 'bg-green-500' : responsePct >= 10 ? 'bg-yellow-500' : 'bg-red-500',
    },
    {
      label: 'Budget Utilisation',
      value: `${budgetPct}%`,
      gradient: 'from-purple-500 to-purple-600',
      showProgress: true,
      progress: budgetPct,
      progressColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
        >
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{metric.label}</div>
          <div className={`text-4xl font-black bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent mb-3`}>
            {metric.value}
          </div>
          {metric.showProgress && (
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${metric.progressColor} transition-all duration-500`}
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}




