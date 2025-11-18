import Link from 'next/link';
import { SectionCard } from '../../components/SectionCard';
import { TagPill, EmptyState } from '../../components/shared';
import { Button } from '@/components/ui/button';

async function getRosterHealth() {
  try {
    const workspaceId = 'demo-workspace';

    const rostersRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/rosters?workspace_id=${workspaceId}`,
      { cache: 'no-store' }
    );

    if (!rostersRes.ok) {
      return { rosters: [], sceneDistribution: {}, gaps: [] };
    }

    const data = await rostersRes.json();
    const rosters = data.rosters || [];

    // If we have rosters, get profile for the first one
    if (rosters.length > 0) {
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/rosters/${rosters[0].id}`,
        { cache: 'no-store' }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        return {
          rosters,
          sceneDistribution: profileData.profile?.scene_distribution || {},
          gaps: profileData.gaps || [],
        };
      }
    }

    return { rosters, sceneDistribution: {}, gaps: [] };
  } catch (error) {
    console.error('Failed to fetch roster health:', error);
    return { rosters: [], sceneDistribution: {}, gaps: [] };
  }
}

export async function RosterHealthSnapshot() {
  const { rosters, sceneDistribution, gaps } = await getRosterHealth();

  return (
    <SectionCard
      title="Roster Health"
      description="Scene distribution and opportunity gaps"
      action={
        <Link href="/anr/roster">
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      }
    >
      {rosters.length === 0 ? (
        <EmptyState
          title="No Roster Yet"
          description="Create a roster to start tracking scene distribution and gaps"
          action={
            <Link href="/anr/roster">
              <Button size="sm">Create Roster</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Scene Distribution */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">Scenes Represented</h3>
            {Object.keys(sceneDistribution).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(sceneDistribution)
                  .slice(0, 10)
                  .map(([scene, count]) => (
                    <TagPill key={scene}>
                      {scene} ({count})
                    </TagPill>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No scene data available</p>
            )}
          </div>

          {/* Top Gaps */}
          {gaps.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Top Opportunities</h3>
              <div className="space-y-2">
                {gaps.slice(0, 3).map((gap: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">{gap.gap_type}</p>
                      <p className="text-xs text-slate-500 mt-1">{gap.description}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-400">{gap.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
