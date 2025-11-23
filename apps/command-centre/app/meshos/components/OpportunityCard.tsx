/**
 * OpportunityCard Component
 * Displays cross-system opportunities with cyan accents
 */

import { MeshCard } from '../../../components/meshos/MeshCard';
import { SystemTag } from '../../../components/meshos/SystemTag';
import { InsightBadge } from '../../../components/meshos/InsightBadge';

interface OpportunityCardProps {
  id: string;
  systems: string[];
  opportunityType: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
  recommendedActions?: string[];
}

export function OpportunityCard({
  systems,
  opportunityType,
  impact,
  description,
  recommendedActions,
}: OpportunityCardProps) {
  return (
    <MeshCard hover glow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          {systems.map((system) => (
            <SystemTag key={system} system={system} size="sm" />
          ))}
        </div>
        <InsightBadge type="opportunity" label={impact} impact={impact} />
      </div>

      <h3
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#3AA9BE',
          margin: '0 0 0.5rem 0',
          textTransform: 'capitalize',
        }}
      >
        {opportunityType.replace(/_/g, ' ')}
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

      {recommendedActions && recommendedActions.length > 0 && (
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
            Recommended Actions
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.25rem',
              listStyle: 'disc',
            }}
          >
            {recommendedActions.map((action, idx) => (
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
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </MeshCard>
  );
}
