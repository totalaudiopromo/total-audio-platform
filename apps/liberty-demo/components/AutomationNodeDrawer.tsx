import React from 'react';
import { AutomationNode } from '@/lib/types';
import { X, Activity, CheckCircle, AlertCircle, Clock, Zap, Filter, Play } from 'lucide-react';

interface AutomationNodeDrawerProps {
  node: AutomationNode | null;
  onClose: () => void;
}

const AutomationNodeDrawer: React.FC<AutomationNodeDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  const getIcon = () => {
    switch (node.type) {
      case 'trigger':
        return <Zap className="w-5 h-5 text-tap-accent" />;
      case 'filter':
        return <Filter className="w-5 h-5 text-yellow-600" />;
      case 'action':
        return <Play className="w-5 h-5 text-tap-good" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-tap-accent text-white';
      case 'success':
        return 'bg-tap-good text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-tap-muted text-white';
    }
  };

  return (
    <div className="absolute top-4 right-4 bottom-4 w-96 bg-white/95 backdrop-blur-xl border border-tap-line rounded-xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="p-6 border-b border-tap-line flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-tap-bg border border-tap-line`}>{getIcon()}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase tracking-wider text-tap-muted">
                {node.type}
              </span>
              {node.status && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${getStatusColor(node.status)}`}
                >
                  {node.status}
                </span>
              )}
            </div>
            <h3 className="font-heading text-xl text-tap-text leading-none">{node.label}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-tap-bg rounded-full transition-colors text-tap-muted hover:text-tap-text"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Description */}
        <div>
          <h4 className="font-sans text-sm font-medium text-tap-text mb-2">Description</h4>
          <p className="text-tap-muted text-sm leading-relaxed">{node.description}</p>
        </div>

        {/* Stats Grid */}
        {node.stats && (
          <div>
            <h4 className="font-sans text-sm font-medium text-tap-text mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-tap-accent" />
              Performance
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-tap-bg border border-tap-line">
                <div className="text-xs text-tap-muted mb-1">Executions</div>
                <div className="font-mono text-lg text-tap-text">{node.stats.executions}</div>
              </div>
              <div className="p-3 rounded-lg bg-tap-bg border border-tap-line">
                <div className="text-xs text-tap-muted mb-1">Success Rate</div>
                <div className="font-mono text-lg text-tap-good">{node.stats.successRate}%</div>
              </div>
              <div className="col-span-2 p-3 rounded-lg bg-tap-bg border border-tap-line flex items-center justify-between">
                <div className="text-xs text-tap-muted">Last Executed</div>
                <div className="font-mono text-sm text-tap-text">
                  {node.stats.lastExecuted || 'Never'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mock Activity Log */}
        <div>
          <h4 className="font-sans text-sm font-medium text-tap-text mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-tap-accent" />
            Recent Activity
          </h4>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm pb-3 border-b border-tap-line/50 last:border-0"
              >
                <CheckCircle className="w-4 h-4 text-tap-good mt-0.5 shrink-0" />
                <div>
                  <div className="text-tap-text font-medium">Successfully executed</div>
                  <div className="text-xs text-tap-muted mt-0.5">
                    Triggered by campaign update • {i * 15}m ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Preview (Mock) */}
        <div>
          <h4 className="font-sans text-sm font-medium text-tap-text mb-3">Configuration</h4>
          <div className="bg-tap-bg rounded-lg border border-tap-line p-3 font-mono text-xs text-tap-muted overflow-x-auto">
            <pre>
              {JSON.stringify(
                { kind: node.kind, id: node.id, timeout: '5000ms', retry: 3 },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-tap-line bg-tap-bg/50">
        <button className="w-full py-2 px-4 bg-white border border-tap-line rounded-lg text-sm font-medium text-tap-text hover:border-tap-accent hover:text-tap-accent transition-colors shadow-sm">
          Edit Configuration
        </button>
      </div>
    </div>
  );
};

export default AutomationNodeDrawer;
