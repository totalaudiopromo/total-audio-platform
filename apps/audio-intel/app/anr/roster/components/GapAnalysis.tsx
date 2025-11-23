import { SectionCard } from '../../components/SectionCard';
import { StatusBadge } from '../../components/shared';

async function getRosterGaps(rosterId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/rosters/${rosterId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.gaps || [];
  } catch (error) {
    console.error('Failed to fetch roster gaps:', error);
    return [];
  }
}

export async function GapAnalysis({ rosterId }: { rosterId: string }) {
  const gaps = await getRosterGaps(rosterId);

  return (
    <SectionCard title="Gap Analysis" description="Opportunities and risks">
      {gaps.length === 0 ? (
        <p className="text-sm text-slate-500">No gaps identified</p>
      ) : (
        <div className="space-y-3">
          {gaps.map((gap: any, idx: number) => (
            <div
              key={idx}
              className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-200">{gap.gap_type}</h4>
                <StatusBadge
                  status={gap.priority || 'medium'}
                  variant={gap.priority === 'high' ? 'error' : gap.priority === 'low' ? 'default' : 'warning'}
                />
              </div>
              <p className="text-xs text-slate-500">{gap.description}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
