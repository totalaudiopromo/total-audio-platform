import Link from 'next/link';
import { SectionCard } from '../../components/SectionCard';
import { EmptyState } from '../../components/shared';
import { Button } from '@/components/ui/button';

const DEAL_STAGES = [
  'none',
  'light_interest',
  'serious',
  'offer_made',
  'negotiation',
  'signed',
  'lost',
] as const;

const STAGE_LABELS: Record<string, string> = {
  none: 'None',
  light_interest: 'Light Interest',
  serious: 'Serious',
  offer_made: 'Offer Made',
  negotiation: 'Negotiation',
  signed: 'Signed',
  lost: 'Lost',
};

async function getDealFlowStats() {
  try {
    const workspaceId = 'demo-workspace';

    const dealsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/deals?workspace_id=${workspaceId}`,
      { cache: 'no-store' }
    );

    if (!dealsRes.ok) {
      return { stageDistribution: {}, total: 0 };
    }

    const data = await dealsRes.json();
    const deals = data.deals || [];

    // Count deals by stage
    const stageDistribution: Record<string, number> = {};
    DEAL_STAGES.forEach((stage) => {
      stageDistribution[stage] = deals.filter((d: any) => d.stage === stage).length;
    });

    return {
      stageDistribution,
      total: deals.length,
    };
  } catch (error) {
    console.error('Failed to fetch deal flow stats:', error);
    return { stageDistribution: {}, total: 0 };
  }
}

export async function DealFlowSnapshot() {
  const { stageDistribution, total } = await getDealFlowStats();

  return (
    <SectionCard
      title="Deal Flow"
      description="Pipeline snapshot by stage"
      action={
        <Link href="/anr/deals">
          <Button variant="outline" size="sm">
            View Board
          </Button>
        </Link>
      }
    >
      {total === 0 ? (
        <EmptyState
          title="No Deals Yet"
          description="Start tracking artist deals in your pipeline"
          action={
            <Link href="/anr/deals">
              <Button size="sm">Go to Deals</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Stage Distribution Bars */}
          {DEAL_STAGES.filter((stage) => stage !== 'none').map((stage) => {
            const count = stageDistribution[stage] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">{STAGE_LABELS[stage]}</span>
                  <span className="text-slate-500 font-mono">{count}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3AA9BE] transition-all duration-300 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Deals</span>
            <span className="text-lg font-bold text-slate-100">{total}</span>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
