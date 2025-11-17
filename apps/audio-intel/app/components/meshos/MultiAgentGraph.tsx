/**
 * MultiAgentGraph Component
 * Visual graph of agent network
 */

'use client';

import type { SystemState } from '@total-audio/meshos';

interface MultiAgentGraphProps {
  systems: Record<string, SystemState>;
}

export function MultiAgentGraph({ systems }: MultiAgentGraphProps) {
  const systemList = Object.entries(systems);

  return (
    <div className="border rounded-lg p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemList.map(([systemName, state]) => (
          <div
            key={systemName}
            className="border rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  state.healthy ? 'bg-success' : 'bg-destructive'
                }`}
              />
              <h4 className="font-medium text-sm capitalize">
                {systemName.replace(/_/g, ' ')}
              </h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Status: {state.status || 'active'}</div>
              {state.last_active && (
                <div>Active: {new Date(state.last_active).toLocaleString()}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {systemList.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No active systems detected
        </p>
      )}
    </div>
  );
}
