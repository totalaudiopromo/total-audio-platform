'use client';

import React from 'react';
import { AutomationWorkflow, AutomationNode } from '@/lib/types';
import { Play, Filter, Zap, ArrowRight } from 'lucide-react';

interface AutomationGraphCanvasProps {
  workflow: AutomationWorkflow | undefined;
}

const AutomationGraphCanvas: React.FC<AutomationGraphCanvasProps> = ({ workflow }) => {
  if (!workflow) return null;

  const getNodeIcon = (type: AutomationNode['type']) => {
    switch (type) {
      case 'trigger':
        return <Play className="w-4 h-4" />;
      case 'filter':
        return <Filter className="w-4 h-4" />;
      case 'action':
        return <Zap className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getNodeStyles = (type: AutomationNode['type']) => {
    switch (type) {
      case 'trigger':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'filter':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'action':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-tap-line rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-heading font-medium tracking-tight text-tap-text mb-6 pb-4 border-b border-tap-line">
        Workflow Graph
      </h3>

      <div className="relative min-h-[200px] bg-tap-bg/30 rounded-lg p-6">
        {/* Node Flow */}
        <div className="flex flex-wrap items-center gap-4">
          {workflow.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {/* Node */}
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${getNodeStyles(node.type)}`}
              >
                <div className="p-1.5 rounded bg-white/60">{getNodeIcon(node.type)}</div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider opacity-70">
                    {node.type}
                  </p>
                  <p className="font-heading font-medium text-sm">{node.label}</p>
                </div>
              </div>

              {/* Arrow connector */}
              {index < workflow.nodes.length - 1 && (
                <ArrowRight className="w-5 h-5 text-tap-muted flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 pt-4 border-t border-tap-line">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-heading font-medium text-tap-text">
                {workflow.nodes.filter(n => n.type === 'trigger').length}
              </p>
              <p className="text-xs text-tap-muted uppercase tracking-wider">Triggers</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-medium text-tap-text">
                {workflow.nodes.filter(n => n.type === 'filter').length}
              </p>
              <p className="text-xs text-tap-muted uppercase tracking-wider">Filters</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-medium text-tap-text">
                {workflow.nodes.filter(n => n.type === 'action').length}
              </p>
              <p className="text-xs text-tap-muted uppercase tracking-wider">Actions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationGraphCanvas;
