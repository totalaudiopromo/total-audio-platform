import { listRecentActivities } from '@/lib/activities';
import { AlertCircle, Clock } from 'lucide-react';
import type { CampaignActivity } from '@/lib/types';

// ========================================
// Helper Functions
// ========================================

/**
 * Formats activity type for display
 * Replaces all underscores with spaces and capitalises first letter
 */
function formatActivityType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Gets the appropriate status badge colour
 */
function getStatusColour(status: string): string {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'completed' || lowerStatus === 'success') {
    return 'bg-green-100 border-green-300 text-green-800';
  }
  if (lowerStatus === 'pending' || lowerStatus === 'in_progress') {
    return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  }
  if (lowerStatus === 'failed' || lowerStatus === 'error') {
    return 'bg-red-100 border-red-300 text-red-800';
  }
  return 'bg-gray-100 border-gray-300 text-gray-800';
}

// ========================================
// Error Component
// ========================================

function TimelineError() {
  return (
    <div
      className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="alert"
    >
      <h3 className="text-lg font-black text-gray-900 mb-4">Recent Activity</h3>
      <div className="flex items-center gap-3 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <p className="font-medium text-sm">Unable to load recent activity</p>
      </div>
    </div>
  );
}

// ========================================
// Component
// ========================================

export default async function ActivityTimeline() {
  let activities: CampaignActivity[];

  try {
    activities = await listRecentActivities(10);
  } catch (error) {
    console.error('Failed to load activities:', error);
    return <TimelineError />;
  }

  return (
    <div
      className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="region"
      aria-label="Recent campaign activity"
    >
      <h3 className="text-lg font-black text-gray-900 mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <div className="flex items-center gap-3 text-gray-500">
          <Clock className="w-5 h-5" />
          <p className="font-medium text-sm">No recent activity</p>
        </div>
      ) : (
        <ul className="space-y-3" role="list" aria-label="Activity list">
          {activities.map(a => {
            const activityType = a.type || a.activity_type || 'Unknown';
            const activityStatus = a.status || 'pending';
            return (
              <li
                key={a.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200"
                role="listitem"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900">
                    {formatActivityType(activityType)}
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {a.platform || 'Unknown'}
                    {a.contact_name ? ` - ${a.contact_name}` : ''}
                  </div>
                  {a.notes && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {a.notes}
                    </div>
                  )}
                </div>
                <div
                  className={`text-xs font-bold px-3 py-1 rounded-lg border-2 min-w-20 text-center flex-shrink-0 ${getStatusColour(activityStatus)}`}
                  role="status"
                  aria-label={`Status: ${activityStatus}`}
                >
                  {activityStatus}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
