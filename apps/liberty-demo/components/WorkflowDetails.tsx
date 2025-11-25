import React from 'react';
import { AutomationWorkflow } from '@/lib/types';
import { Zap, Filter, Play, Activity } from 'lucide-react';

interface WorkflowDetailsProps {
  workflow: AutomationWorkflow | undefined;
}

const WorkflowDetails: React.FC<WorkflowDetailsProps> = ({ workflow }) => {
  if (!workflow) return null;

  const triggers = workflow.nodes.filter(n => n.type === 'trigger');
  const filters = workflow.nodes.filter(n => n.type === 'filter');
  const actions = workflow.nodes.filter(n => n.type === 'action');

  return (
    <div className="bg-white border border-tap-line rounded-xl p-6 mt-6 shadow-sm">
      <h3 className="text-lg font-heading font-medium tracking-tight text-tap-text mb-6 pb-4 border-b border-tap-line flex items-center gap-2">
        <Activity className="w-5 h-5 text-tap-accent" />
        Workflow Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Triggers */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-1.5 rounded bg-tap-bg">
              <Play size={14} className="text-tap-accent" />
            </div>
            <h4 className="font-mono text-xs font-medium text-tap-muted uppercase tracking-wider">
              Triggers
            </h4>
          </div>
          <div className="space-y-3">
            {triggers.map(trigger => (
              <div
                key={trigger.id}
                className="p-4 bg-tap-bg/50 rounded-lg border border-tap-line hover:border-tap-accent/40 transition-colors"
              >
                <p className="font-heading font-medium text-sm text-tap-text mb-1">
                  {trigger.label}
                </p>
                {trigger.description && (
                  <p className="font-sans text-xs text-tap-muted leading-relaxed">
                    {trigger.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-1.5 rounded bg-amber-50">
              <Filter size={14} className="text-amber-600" />
            </div>
            <h4 className="font-mono text-xs font-medium text-tap-muted uppercase tracking-wider">
              Filters
            </h4>
          </div>
          {filters.length > 0 ? (
            <div className="space-y-3">
              {filters.map(filter => (
                <div
                  key={filter.id}
                  className="p-4 bg-tap-bg/50 rounded-lg border border-tap-line hover:border-amber-500/40 transition-colors"
                >
                  <p className="font-heading font-medium text-sm text-tap-text mb-1">
                    {filter.label}
                  </p>
                  {filter.description && (
                    <p className="font-sans text-xs text-tap-muted leading-relaxed">
                      {filter.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-tap-line rounded-lg text-center">
              <p className="font-sans text-xs text-tap-muted italic">No filters applied</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-1.5 rounded bg-slate-50">
              <Zap size={14} className="text-slate-600" />
            </div>
            <h4 className="font-mono text-xs font-medium text-tap-muted uppercase tracking-wider">
              Actions
            </h4>
          </div>
          <div className="space-y-3">
            {actions.map(action => (
              <div
                key={action.id}
                className="p-4 bg-tap-bg/50 rounded-lg border border-tap-line hover:border-slate-400/40 transition-colors"
              >
                <p className="font-heading font-medium text-sm text-tap-text mb-1">
                  {action.label}
                </p>
                {action.description && (
                  <p className="font-sans text-xs text-tap-muted leading-relaxed">
                    {action.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetails;
