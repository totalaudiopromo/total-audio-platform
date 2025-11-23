/**
 * ConflictResolutionPanel Component
 * Display individual negotiation details
 */

'use client';

import type { Negotiation } from '@total-audio/meshos';

interface ConflictResolutionPanelProps {
  negotiation: Negotiation;
}

export function ConflictResolutionPanel({
  negotiation,
}: ConflictResolutionPanelProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold mb-1">
            {negotiation.context.issue || 'Negotiation'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Strategy: {negotiation.strategy} • Status: {negotiation.status}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Confidence</div>
          <div className="text-lg font-semibold">
            {Math.round(negotiation.confidence_score * 100)}%
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Participants</h4>
        <div className="flex gap-2 flex-wrap">
          {negotiation.participants.map((participant) => (
            <span key={participant} className="px-3 py-1 bg-muted rounded text-sm">
              {participant}
            </span>
          ))}
        </div>
      </div>

      {/* Result */}
      {negotiation.result && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Resolution</h4>
          <div className="bg-muted p-4 rounded">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(negotiation.result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Participants Agreement */}
      {negotiation.participants_agreement && (
        <div>
          <h4 className="text-sm font-medium mb-2">Agreement Scores</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(negotiation.participants_agreement).map(
              ([participant, score]) => (
                <div key={participant} className="flex items-center gap-2">
                  <span className="text-sm">{participant}:</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{Math.round(score * 100)}%</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-4">
        {new Date(negotiation.created_at).toLocaleString()}
      </div>
    </div>
  );
}
