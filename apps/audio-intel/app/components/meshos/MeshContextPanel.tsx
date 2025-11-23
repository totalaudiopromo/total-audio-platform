/**
 * MeshContextPanel Component
 * Displays global mesh context overview
 */

'use client';

import type { GlobalContext } from '@total-audio/meshos';

interface MeshContextPanelProps {
  context?: GlobalContext;
}

export function MeshContextPanel({ context }: MeshContextPanelProps) {
  if (!context) {
    return (
      <div className="border rounded-lg p-6 bg-muted">
        <p className="text-sm text-muted-foreground">Loading context...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 space-y-6">
      {/* Systems Overview */}
      <div>
        <h3 className="font-semibold mb-3">Active Systems</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(context.systems).map(([system, state]) => (
            <div key={system} className="border rounded p-3 bg-muted/50">
              <div className="text-sm font-medium capitalize">
                {system.replace(/_/g, ' ')}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Status:{' '}
                <span className={state.healthy ? 'text-success' : 'text-destructive'}>
                  {state.healthy ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Score */}
      <div>
        <h3 className="font-semibold mb-2">Overall Confidence</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${context.confidence_score * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {Math.round(context.confidence_score * 100)}%
          </span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(context.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
