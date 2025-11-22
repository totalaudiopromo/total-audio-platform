/**
 * Next Actions Widget - Priority Action Suggestions
 */

import type { Action } from '@total-audio/ai-skills';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  actions: Action[];
}

export function NextActionsWidget({ actions }: Props) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-zinc-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/20 bg-red-500/5';
      case 'medium':
        return 'border-amber-500/20 bg-amber-500/5';
      default:
        return 'border-zinc-800 bg-zinc-900/30';
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">Next Actions</h2>
      <p className="mt-1 text-sm text-zinc-400">
        {actions.filter((a) => a.priority === 'high').length} urgent
      </p>

      <div className="mt-4 space-y-3">
        {actions.length === 0 ? (
          <p className="text-sm text-zinc-500">No actions needed right now</p>
        ) : (
          actions.slice(0, 5).map((action) => (
            <div
              key={action.id}
              className={`rounded-lg border p-3 ${getPriorityColor(action.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getPriorityIcon(action.priority)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{action.title}</p>
                  <p className="mt-1 text-xs text-zinc-400">{action.description}</p>
                  {action.relatedEntity && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                        {action.relatedEntity.type}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {action.relatedEntity.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {actions.length > 5 && (
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <a
            href="/dashboard/actions"
            className="text-sm text-[#3AA9BE] hover:underline"
          >
            View all {actions.length} actions →
          </a>
        </div>
      )}
    </div>
  );
}
