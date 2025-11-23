/**
 * NegotiationTimeline Component
 * Timeline visualization of negotiations
 */

'use client';

import type { Negotiation } from '@total-audio/meshos';

interface NegotiationTimelineProps {
  negotiations: Negotiation[];
}

export function NegotiationTimeline({ negotiations }: NegotiationTimelineProps) {
  const sortedNegotiations = [...negotiations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="border rounded-lg p-6">
      <div className="space-y-4">
        {sortedNegotiations.map((negotiation, idx) => (
          <div key={negotiation.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  negotiation.status === 'completed'
                    ? 'bg-success'
                    : negotiation.status === 'failed'
                    ? 'bg-destructive'
                    : 'bg-primary'
                }`}
              />
              {idx < sortedNegotiations.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium">
                  {negotiation.context.issue || 'Negotiation'}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(negotiation.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                Strategy: {negotiation.strategy} • Status: {negotiation.status}
              </div>
              <div className="flex gap-2 flex-wrap">
                {negotiation.participants.map((participant) => (
                  <span
                    key={participant}
                    className="text-xs px-2 py-1 bg-muted rounded"
                  >
                    {participant}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
