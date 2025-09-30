import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OverviewStats from '@/components/analytics/OverviewStats';
import { getSubmissionResponseSeries, getPlatformBreakdown } from '@/lib/analytics';
import CampaignChart from '@/components/analytics/CampaignChart';
import PlatformBreakdown from '@/components/analytics/PlatformBreakdown';
import ActivityTimeline from '@/components/analytics/ActivityTimeline';
import DateRangeFilter from '@/components/analytics/DateRangeFilter';

export default async function AnalyticsPage({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const start = searchParams.start ? new Date(searchParams.start).toISOString() : undefined;
  const end = searchParams.end ? new Date(searchParams.end).toISOString() : undefined;

  const series = await getSubmissionResponseSeries(start, end);
  const platformData = await getPlatformBreakdown(start, end);

  const query = new URLSearchParams();
  if (searchParams.start) query.set('start', searchParams.start);
  if (searchParams.end) query.set('end', searchParams.end);
  const exportUrl = `/api/analytics/export?${query.toString()}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Analytics</h2>
          <p className="text-slate-600 dark:text-slate-400">Real-time insights across all your campaigns</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangeFilter />
          <a
            href={exportUrl}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
          >
            Export CSV
          </a>
        </div>
      </div>

      <OverviewStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignChart data={series} />
        </div>
        <div>
          <PlatformBreakdown data={platformData} />
        </div>
      </div>

      <ActivityTimeline />
    </div>
  );
}




