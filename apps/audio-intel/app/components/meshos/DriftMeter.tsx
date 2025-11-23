/**
 * DriftMeter Component
 * Visual indicator for drift severity and score
 */

'use client';

interface DriftMeterProps {
  severity: 'low' | 'medium' | 'high';
  score: number;
}

export function DriftMeter({ severity, score }: DriftMeterProps) {
  const severityColors = {
    low: 'bg-success text-success-foreground',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-destructive text-destructive-foreground',
  };

  const color = severityColors[severity];

  return (
    <div className="flex flex-col items-end gap-1">
      <span className={`px-3 py-1 rounded text-xs font-medium ${color}`}>
        {severity.toUpperCase()}
      </span>
      <span className="text-xs text-muted-foreground">
        Score: {score.toFixed(2)}
      </span>
    </div>
  );
}
