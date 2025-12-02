import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const ActivityStream: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      user: 'WARM',
      action: 'detected spin',
      target: 'Concerta on Kiss FM',
      time: '1h ago',
      icon: CheckCircle2,
      color: 'text-tap-good',
    },
    {
      id: 2,
      type: 'success',
      user: 'Sarah M.',
      action: 'confirmed playlist add',
      target: 'BBC Radio 1 Dance',
      time: '3h ago',
      icon: CheckCircle2,
      color: 'text-tap-good',
    },
    {
      id: 3,
      type: 'neutral',
      user: 'Tom R.',
      action: 'sent follow-up to',
      target: 'Danny Howard',
      time: '4h ago',
      icon: Clock,
      color: 'text-tap-accent',
    },
    {
      id: 4,
      type: 'success',
      user: 'James C.',
      action: 'closed campaign',
      target: 'KYARA - Bloodshot',
      time: '1d ago',
      icon: CheckCircle2,
      color: 'text-tap-good',
    },
    {
      id: 5,
      type: 'warning',
      user: 'System',
      action: 'low response rate on',
      target: 'Concerta press outreach',
      time: '2d ago',
      icon: AlertTriangle,
      color: 'text-tap-risk',
    },
  ];

  return (
    <div className="bg-tap-panel rounded-lg border border-tap-line p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-normal tracking-tight text-tap-text flex items-center">
          <Activity size={18} className="mr-2 text-tap-accent" />
          Activity Stream
        </h3>
        <span className="text-xs text-tap-muted bg-tap-bg px-2 py-1 rounded border border-tap-line">
          Today
        </span>
      </div>

      <div className="space-y-0">
        {activities.map((item, index) => (
          <div key={item.id} className="relative pl-6 pb-6 last:pb-0">
            {/* Connector Line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-px bg-tap-line" />
            )}

            <div className="flex items-start gap-4 mb-5">
              <div
                className={`absolute left-0 top-1 flex items-center justify-center h-6 w-6 bg-tap-bg border border-tap-line rounded-full z-10 ${item.color}`}
              >
                <item.icon size={12} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-tap-text leading-snug">
                    <span className="font-semibold">{item.user}</span> {item.action}{' '}
                    <span className="font-medium italic border-b border-tap-line/50">
                      {item.target}
                    </span>
                  </p>
                  <span className="text-xs text-tap-muted font-mono whitespace-nowrap ml-2">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-2 py-2 text-xs font-medium text-tap-muted hover:text-tap-text border border-dashed border-tap-line rounded hover:bg-tap-bg transition-colors">
        View All Activity
      </button>
    </div>
  );
};

export default ActivityStream;
