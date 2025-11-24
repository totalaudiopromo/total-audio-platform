/**
 * SystemStatusRow Component
 * Displays subsystem health status with indicators
 */

import { SystemTag } from '../../../components/meshos/SystemTag';
import { SeverityDot } from '../../../components/meshos/SeverityDot';
import { TrendArrow } from '../../../components/meshos/TrendArrow';

interface SystemStatusProps {
  system: string;
  status: 'healthy' | 'warning' | 'error';
  trend: 1 | 0 | -1;
  lastUpdate?: string;
}

export function SystemStatusRow({ system, status, trend, lastUpdate }: SystemStatusProps) {
  const statusSeverity: Record<string, 'low' | 'medium' | 'high'> = {
    healthy: 'low',
    warning: 'medium',
    error: 'high',
  };

  const statusLabels: Record<string, string> = {
    healthy: 'Operational',
    warning: 'Warning',
    error: 'Error',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem',
        backgroundColor: '#111418',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        transition: 'all 220ms ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#14171C';
        e.currentTarget.style.borderColor = 'rgba(58, 169, 190, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#111418';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <SystemTag system={system} size="md" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SeverityDot severity={statusSeverity[status]} size="sm" />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              color: '#9CA3AF',
            }}
          >
            {statusLabels[status]}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {lastUpdate && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#6B7280',
            }}
          >
            {new Date(lastUpdate).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
        <TrendArrow trend={trend} size={14} />
      </div>
    </div>
  );
}
