import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ActivityList from '@/components/activities/ActivityList';
import ActivityForm from '@/components/activities/ActivityForm';
import QuickActions from '@/components/activities/QuickActions';
import { getSubmissionResponseSeries, getPlatformBreakdown } from '@/lib/analytics';
import CampaignChart from '@/components/analytics/CampaignChart';
import PlatformBreakdown from '@/components/analytics/PlatformBreakdown';

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const series = await getSubmissionResponseSeries();
  const platformData = await getPlatformBreakdown();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Campaign {params.id}</h2>
        <p className="text-slate-600">Overview, activity and performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><CampaignChart data={series} /></div>
        <div><PlatformBreakdown data={platformData} /></div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Activity Timeline</h3>
          <QuickActions campaignId={params.id} />
        </div>
        <ActivityForm campaignId={params.id} />
        <ActivityList campaignId={params.id} />
      </div>
    </div>
  );
}
