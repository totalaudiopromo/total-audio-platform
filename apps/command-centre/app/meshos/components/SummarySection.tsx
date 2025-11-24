/**
 * SummarySection Component
 * Displays high-level metrics banner
 */

import { MeshCard } from '../../../components/meshos/MeshCard';

interface SummarySectionProps {
  metrics: {
    totalOpportunities: number;
    totalConflicts: number;
    totalPlans: number;
    totalDrifts: number;
    criticalIssues: number;
  };
  lastCycle?: string;
}

export function SummarySection({ metrics, lastCycle }: SummarySectionProps) {
  return (
    <MeshCard glow>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <MetricBox
          value={metrics.totalOpportunities}
          label="Opportunities"
          color="#3AA9BE"
          trend={1}
        />
        <MetricBox
          value={metrics.totalConflicts}
          label="Conflicts"
          color="#E4B75F"
          trend={0}
        />
        <MetricBox
          value={metrics.totalPlans}
          label="Active Plans"
          color="#8B5CF6"
          trend={1}
        />
        <MetricBox
          value={metrics.totalDrifts}
          label="Drift Reports"
          color="#F97316"
          trend={-1}
        />
        <MetricBox
          value={metrics.criticalIssues}
          label="Critical Issues"
          color="#D96A6A"
          trend={metrics.criticalIssues > 0 ? -1 : 0}
          highlight={metrics.criticalIssues > 0}
        />
      </div>

      {lastCycle && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#6B7280',
            }}
          >
            Last reasoning cycle
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#9CA3AF',
            }}
          >
            {new Date(lastCycle).toLocaleString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      )}
    </MeshCard>
  );
}

interface MetricBoxProps {
  value: number;
  label: string;
  color: string;
  trend?: 1 | 0 | -1;
  highlight?: boolean;
}

function MetricBox({ value, label, color, trend = 0, highlight = false }: MetricBoxProps) {
  const trendSymbols = { 1: '↑', 0: '→', '-1': '↓' };
  const trendColors = { 1: '#4EC4A0', 0: '#6B7280', '-1': '#D96A6A' };

  return (
    <div
      style={{
        textAlign: 'center',
        ...(highlight && {
          backgroundColor: 'rgba(217, 106, 106, 0.1)',
          padding: '0.75rem',
          borderRadius: '6px',
          border: '1px solid rgba(217, 106, 106, 0.3)',
        }),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '2rem',
            fontWeight: 700,
            color,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: '1.25rem',
            color: trendColors[trend],
          }}
        >
          {trendSymbols[trend]}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          color: '#9CA3AF',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
    </div>
  );
}
