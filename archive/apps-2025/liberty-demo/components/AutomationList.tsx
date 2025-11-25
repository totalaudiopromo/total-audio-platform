import React from 'react';
import { AutomationWorkflow } from '@/lib/types';
import { Plus } from 'lucide-react';

interface AutomationListProps {
  workflows: AutomationWorkflow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const AutomationList: React.FC<AutomationListProps> = ({ workflows, selectedId, onSelect }) => {
  const getStatusColor = (status: AutomationWorkflow['status']) => {
    switch (status) {
      case 'active':
        return 'bg-tap-good/10 text-tap-good border-tap-good/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'draft':
        return 'bg-tap-muted/10 text-tap-muted border-tap-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-medium tracking-tight text-tap-text">
          Active Automations
        </h2>
        <button className="flex items-center space-x-1 text-xs font-medium text-tap-accent hover:text-tap-text transition-colors px-3 py-1.5 rounded-full bg-tap-bg hover:bg-tap-line/50">
          <Plus size={14} />
          <span>New</span>
        </button>
      </div>

      <div className="space-y-3">
        {workflows.map(workflow => (
          <button
            key={workflow.id}
            onClick={() => onSelect(workflow.id)}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group ${
              selectedId === workflow.id
                ? 'bg-white border-tap-accent shadow-md ring-1 ring-tap-accent/20'
                : 'bg-white border-tap-line hover:border-tap-accent/60 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3
                className={`font-heading font-medium text-sm pr-2 transition-colors ${selectedId === workflow.id ? 'text-tap-accent' : 'text-tap-text group-hover:text-tap-text'}`}
              >
                {workflow.name}
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide border shrink-0 ${getStatusColor(workflow.status)}`}
              >
                {workflow.status}
              </span>
            </div>
            <p className="font-sans text-xs text-tap-muted mb-4 line-clamp-2 leading-relaxed">
              {workflow.description}
            </p>
            <div className="flex items-center justify-between text-[10px] pt-3 border-t border-tap-line/50">
              <span className="text-tap-muted font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tap-line"></span>
                {workflow.lastRun}
              </span>
              <span className="text-tap-muted font-mono bg-tap-bg px-1.5 py-0.5 rounded-md">
                {workflow.runCount} runs
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AutomationList;
