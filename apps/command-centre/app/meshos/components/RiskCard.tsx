/**
 * RiskCard Component
 * Displays system conflicts and risks with severity indicators
 */

import { MeshCard } from '../../../components/meshos/MeshCard';
import { SystemTag } from '../../../components/meshos/SystemTag';
import { SeverityDot } from '../../../components/meshos/SeverityDot';
import { InsightBadge } from '../../../components/meshos/InsightBadge';

interface RiskCardProps {
  id: string;
  systems: string[];
  conflictType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolutionSuggestions?: string[];
}

export function RiskCard({
  systems,
  conflictType,
  severity,
  description,
  resolutionSuggestions,
}: RiskCardProps) {
  return (
    <MeshCard hover>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          {systems.map((system) => (
            <SystemTag key={system} system={system} size="sm" />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SeverityDot severity={severity} size="md" />
          <InsightBadge type="risk" label={severity} />
        </div>
      </div>

      <h3
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: severity === 'critical' || severity === 'high' ? '#D96A6A' : '#E4B75F',
          margin: '0 0 0.5rem 0',
          textTransform: 'capitalize',
        }}
      >
        {conflictType.replace(/_/g, ' ')}
      </h3>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          color: '#D1D5DB',
          margin: '0 0 1rem 0',
        }}
      >
        {description}
      </p>

      {resolutionSuggestions && resolutionSuggestions.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 0.5rem 0',
            }}
          >
            Resolution Suggestions
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.25rem',
              listStyle: 'disc',
            }}
          >
            {resolutionSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  lineHeight: '1.6',
                  color: '#9CA3AF',
                  marginBottom: '0.25rem',
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </MeshCard>
  );
}
