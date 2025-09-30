import { listRecentActivities } from '@/lib/activities';

export default async function ActivityTimeline() {
  const activities = await listRecentActivities(10);
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-2">Recent Activities</h3>
      <ul className="space-y-3">
        {activities.map(a => (
          <li key={a.id} className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">{a.type.replace('_', ' ')}</div>
              <div className="text-xs text-slate-600">{a.platform || 'Unknown'}{a.contact_name ? ` · ${a.contact_name}` : ''}</div>
              {a.notes ? <div className="text-xs text-slate-700 mt-1">{a.notes}</div> : null}
            </div>
            <div className="text-xs px-2 py-1 rounded border min-w-24 text-center">{a.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}




