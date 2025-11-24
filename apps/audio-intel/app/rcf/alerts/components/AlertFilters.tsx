/**
 * Alert Filters Component
 * Filter controls for alert list (severity, type, acknowledged status)
 */

'use client';

type Severity = 'info' | 'warning' | 'critical' | 'all';
type AlertType = 'spike' | 'threshold' | 'anomaly' | 'first_event' | 'high_cred' | 'all';

interface AlertFiltersProps {
  selectedSeverity: Severity;
  selectedType: AlertType;
  showAcknowledged: boolean;
  onSeverityChange: (severity: Severity) => void;
  onTypeChange: (type: AlertType) => void;
  onShowAcknowledgedChange: (show: boolean) => void;
}

export function AlertFilters({
  selectedSeverity,
  selectedType,
  showAcknowledged,
  onSeverityChange,
  onTypeChange,
  onShowAcknowledgedChange,
}: AlertFiltersProps) {
  const severityOptions: Severity[] = ['all', 'info', 'warning', 'critical'];
  const typeOptions: { value: AlertType; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'spike', label: 'Coverage Spike' },
    { value: 'threshold', label: 'Threshold' },
    { value: 'anomaly', label: 'Anomaly' },
    { value: 'first_event', label: 'First Event' },
    { value: 'high_cred', label: 'High Credibility' },
  ];

  return (
    <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 font-mono">
          Severity
        </label>
        <div className="flex flex-wrap gap-2">
          {severityOptions.map((severity) => (
            <button
              key={severity}
              onClick={() => onSeverityChange(severity)}
              className={`
                px-3 py-1.5 text-sm font-medium font-mono rounded-lg
                transition-all duration-240 ease-out
                ${
                  selectedSeverity === severity
                    ? 'bg-[#3AA9BE] text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }
              `}
            >
              {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 font-mono">
          Alert Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as AlertType)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:border-[#3AA9BE] focus:outline-none transition-colors duration-240"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAcknowledged}
            onChange={(e) => onShowAcknowledgedChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-[#3AA9BE] focus:ring-[#3AA9BE] focus:ring-offset-0"
          />
          <span className="text-sm text-slate-300 font-mono">Show acknowledged alerts</span>
        </label>
      </div>
    </div>
  );
}
