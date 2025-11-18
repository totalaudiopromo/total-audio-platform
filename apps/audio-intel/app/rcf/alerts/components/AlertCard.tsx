/**
 * Alert Card Component
 * Individual alert display with severity, details, and actions
 */

import type { RCFAlert } from '@total-audio/rcf/alerts';
import { SeverityBadge } from './SeverityBadge';

interface AlertCardProps {
  alert: RCFAlert;
  onAcknowledge?: (alertId: string) => void;
  showActions?: boolean;
}

const ALERT_TYPE_LABELS: Record<string, string> = {
  spike: 'Coverage Spike',
  threshold: 'Threshold Breach',
  anomaly: 'Statistical Anomaly',
  first_event: 'First Event',
  high_cred: 'High Credibility',
};

const ALERT_TYPE_ICONS: Record<string, string> = {
  spike: '📈',
  threshold: '🎯',
  anomaly: '⚡',
  first_event: '🎉',
  high_cred: '⭐',
};

export function AlertCard({ alert, onAcknowledge, showActions = true }: AlertCardProps) {
  const typeLabel = ALERT_TYPE_LABELS[alert.alert_type] || alert.alert_type;
  const typeIcon = ALERT_TYPE_ICONS[alert.alert_type] || '📊';

  return (
    <div
      className={`
        rounded-lg border bg-slate-900/50 p-5
        transition-all duration-240 ease-out
        hover:bg-slate-900/70
        ${
          alert.acknowledged
            ? 'border-slate-800 opacity-60'
            : 'border-slate-700 hover:border-[#3AA9BE]/30'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <SeverityBadge severity={alert.severity} />
            <span className="text-xs text-slate-500 font-mono flex items-center space-x-1">
              <span>{typeIcon}</span>
              <span>{typeLabel}</span>
            </span>
            {alert.acknowledged && (
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Acknowledged
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-slate-100 mb-2">{alert.title}</h3>
          <p className="text-sm text-slate-400">{alert.message}</p>

          {alert.artist_slug && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-mono">Artist:</span>
              <span className="text-sm text-[#3AA9BE] font-medium">{alert.artist_slug}</span>
            </div>
          )}

          {alert.scene_slug && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-mono">Scene:</span>
              <span className="text-sm text-blue-400 font-medium">{alert.scene_slug}</span>
            </div>
          )}

          {alert.payload && Object.keys(alert.payload).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-500 font-mono mb-2">Details</div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(alert.payload).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-xs text-slate-500 font-mono">{key}</div>
                    <div className="text-sm text-slate-200 font-medium">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alert.created_at && (
            <div className="mt-3 text-xs text-slate-500 font-mono">
              {new Date(alert.created_at).toLocaleString()}
            </div>
          )}
        </div>

        {showActions && alert.id && !alert.acknowledged && (
          <button
            onClick={() => onAcknowledge?.(alert.id!)}
            className="
              ml-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-300
              text-sm font-medium font-mono
              transition-all duration-240 ease-out
              hover:bg-[#3AA9BE] hover:text-white
              border border-slate-700 hover:border-[#3AA9BE]
            "
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
