/**
 * OpportunityOverview Component
 * Display identified opportunities
 */

'use client';

interface OpportunityOverviewProps {
  opportunities: string[];
}

export function OpportunityOverview({ opportunities }: OpportunityOverviewProps) {
  if (opportunities.length === 0) {
    return (
      <div className="border rounded-lg p-6 bg-muted">
        <p className="text-sm text-muted-foreground text-center">
          No opportunities identified at this time
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="space-y-3">
        {opportunities.map((opportunity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="text-primary text-xl">💡</div>
            <div className="flex-1">
              <p className="text-sm">{opportunity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
