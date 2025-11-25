'use client';

import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Zap, Filter, Play } from 'lucide-react';
import { AutomationNode } from '@/lib/types';
import { format } from 'date-fns';

export interface ExecutionLogEntry {
  id: string;
  timestamp: Date;
  nodeId: string;
  nodeLabel: string;
  nodeType: 'trigger' | 'filter' | 'action';
  status: 'success' | 'error' | 'warning' | 'skipped';
  message: string;
  duration?: number; // in milliseconds
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
}

interface AutomationExecutionLogProps {
  entries: ExecutionLogEntry[];
  workflowNodes: AutomationNode[];
  isSimulation?: boolean;
}

const AutomationExecutionLog: React.FC<AutomationExecutionLogProps> = ({
  entries,
  workflowNodes,
  isSimulation = false,
}) => {
  const getStatusIcon = (status: ExecutionLogEntry['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-tap-good" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-tap-risk" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-[#F59E0B]" />;
      case 'skipped':
        return <Clock className="w-4 h-4 text-[#737373]" />;
    }
  };

  const getNodeIcon = (type: ExecutionLogEntry['nodeType']) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-tap-accent" />;
      case 'filter':
        return <Filter className="w-4 h-4 text-[#F59E0B]" />;
      case 'action':
        return <Play className="w-4 h-4 text-tap-good" />;
    }
  };

  const getStatusBadge = (status: ExecutionLogEntry['status']) => {
    const styles = {
      success: 'bg-tap-good/10 text-tap-good border border-tap-good/20',
      error: 'bg-tap-risk/10 text-tap-risk border border-tap-risk/20',
      warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
      skipped: 'bg-[#F7F6F2] text-[#737373] border border-[#D9D7D2]',
    };
    return styles[status];
  };

  return (
    <div className="bg-white border border-tap-line rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-tap-line bg-[#FAFAF8]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="liberty-heading text-xl mb-1">
              {isSimulation ? 'Simulation Log' : 'Execution Log'}
            </h3>
            <p className="liberty-body text-sm text-[#737373]">
              {isSimulation
                ? 'Step-by-step execution preview'
                : `Last ${entries.length} executions`}
            </p>
          </div>
          {!isSimulation && entries.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-sm font-mono text-[#737373]">
                {entries.filter(e => e.status === 'success').length}/{entries.length} succeeded
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Entries */}
      <div className="max-h-[500px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-[#D9D7D2] mx-auto mb-4" />
            <p className="text-[#737373]">No execution logs yet.</p>
            {isSimulation && (
              <p className="text-sm text-[#737373] mt-2">
                Click "Run Simulation" to see step-by-step execution.
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#D9D7D2]">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="p-4 hover:bg-[#FAFAF8] transition-colors">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="mt-0.5 flex-shrink-0">{getStatusIcon(entry.status)}</div>

                  {/* Node Icon */}
                  <div className="mt-0.5 flex-shrink-0">{getNodeIcon(entry.nodeType)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-jakarta font-semibold text-[#111]">
                            {entry.nodeLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(entry.status)}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#737373]">{entry.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="liberty-metadata text-[10px]">
                          {format(entry.timestamp, 'HH:mm:ss.SSS')}
                        </span>
                        {entry.duration && (
                          <span className="liberty-metadata text-[10px]">{entry.duration}ms</span>
                        )}
                      </div>
                    </div>

                    {/* Data Preview */}
                    {(entry.inputData || entry.outputData) && (
                      <div className="mt-2 pt-2 border-t border-[#D9D7D2]/50">
                        <div className="grid grid-cols-2 gap-2">
                          {entry.inputData && (
                            <div className="text-xs">
                              <span className="font-medium text-[#737373]">Input:</span>
                              <pre className="font-mono text-[10px] text-[#737373] mt-1 overflow-x-auto">
                                {JSON.stringify(entry.inputData, null, 2).slice(0, 100)}
                                {JSON.stringify(entry.inputData, null, 2).length > 100 && '...'}
                              </pre>
                            </div>
                          )}
                          {entry.outputData && (
                            <div className="text-xs">
                              <span className="font-medium text-[#737373]">Output:</span>
                              <pre className="font-mono text-[10px] text-[#737373] mt-1 overflow-x-auto">
                                {JSON.stringify(entry.outputData, null, 2).slice(0, 100)}
                                {JSON.stringify(entry.outputData, null, 2).length > 100 && '...'}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationExecutionLog;
