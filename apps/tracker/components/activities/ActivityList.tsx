import { listActivitiesForCampaign } from '@/lib/activities';
import ActivityCard from './ActivityCard';

export default async function ActivityList({ campaignId }: { campaignId: string }) {
  const activities = await listActivitiesForCampaign(campaignId);
  if (!activities.length) return <div className="text-sm text-slate-600">No activities yet.</div>;
  return (
    <div className="space-y-3">
      {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
    </div>
  );
}




