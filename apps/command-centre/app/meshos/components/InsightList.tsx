/**
 * InsightList Component
 * Displays a list of key insights
 */

interface InsightListProps {
  insights: string[];
}

export function InsightList({ insights }: InsightListProps) {
  if (!insights || insights.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6B7280',
          fontStyle: 'italic',
        }}
      >
        No insights available
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '0.5rem',
      }}
    >
      {insights.map((insight, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(58, 169, 190, 0.05)',
            border: '1px solid rgba(58, 169, 190, 0.15)',
            borderRadius: '6px',
            transition: 'all 220ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(58, 169, 190, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(58, 169, 190, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(58, 169, 190, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(58, 169, 190, 0.15)';
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(58, 169, 190, 0.2)',
              borderRadius: '50%',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#3AA9BE',
            }}
          >
            {idx + 1}
          </span>
          <p
            style={{
              flex: 1,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: '#D1D5DB',
              margin: 0,
            }}
          >
            {insight}
          </p>
        </div>
      ))}
    </div>
  );
}
