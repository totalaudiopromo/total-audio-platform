import type { CampaignActivity } from '@/lib/types';

export default function ActivityCard({ activity }: { activity: CampaignActivity }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium">{activity.type.replace('_', ' ')}</div>
          <div className="text-xs text-slate-600">{activity.platform || 'Unknown'}{activity.contact_name ? ` · ${activity.contact_name}` : ''}</div>
          {activity.notes ? <div className="text-xs text-slate-700 mt-1">{activity.notes}</div> : null}
        </div>
        <div className="text-xs px-2 py-1 rounded border min-w-24 text-center">{activity.status}</div>
      </div>
      <div className="text-[10px] text-slate-500 mt-2">
        {activity.submitted_at ? `Submitted ${new Date(activity.submitted_at).toLocaleString()}` : ''}
        {activity.response_at ? ` · Responded ${new Date(activity.response_at).toLocaleString()}` : ''}
      </div>
    </div>
  );
}




