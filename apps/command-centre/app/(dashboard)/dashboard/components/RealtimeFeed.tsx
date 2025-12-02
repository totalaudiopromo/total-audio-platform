import type { FusionContext } from '@total-audio/fusion-layer';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

export function RealtimeFeed({ context }: { context: FusionContext }) {
  const events = context.campaigns.recentEvents.slice(0, 10);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-[#3AA9BE]" />
        <h2 className="text-lg font-semibold text-white">Real-Time Feed</h2>
      </div>
      <div className="mt-4 space-y-3">
        {events.length === 0 ? (
          <p className="text-sm text-zinc-500">No recent activity</p>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="flex items-start gap-3 border-l-2 border-[#3AA9BE]/30 pl-3"
            >
              <div className="flex-1">
                <p className="text-sm text-white">{event.eventType.replace(/_/g, ' ')}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
