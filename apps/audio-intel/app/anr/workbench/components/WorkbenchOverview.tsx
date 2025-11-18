import { MetricCard } from '../../components/MetricCard';

async function getWorkbenchStats() {
  try {
    // In production, get workspace_id from auth context
    const workspaceId = 'demo-workspace'; // TODO: Get from session

    // Fetch candidates count
    const candidatesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/candidates?workspace_id=${workspaceId}`,
      { cache: 'no-store' }
    );
    const candidatesData = candidatesRes.ok ? await candidatesRes.json() : { candidates: [] };

    // Count breakout candidates (score > 0.7)
    const breakoutCount = candidatesData.candidates?.filter(
      (c: any) => c.breakout_probability > 0.7
    ).length || 0;

    // Count at-risk artists (score < 0.3 or declining momentum)
    const atRiskCount = candidatesData.candidates?.filter(
      (c: any) => c.composite_score < 0.3 || c.momentum?.trend === 'declining'
    ).length || 0;

    return {
      totalArtists: candidatesData.candidates?.length || 0,
      breakoutCandidates: breakoutCount,
      atRisk: atRiskCount,
    };
  } catch (error) {
    console.error('Failed to fetch workbench stats:', error);
    return {
      totalArtists: 0,
      breakoutCandidates: 0,
      atRisk: 0,
    };
  }
}

export async function WorkbenchOverview() {
  const stats = await getWorkbenchStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        label="Tracked Artists"
        value={stats.totalArtists}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      <MetricCard
        label="Breakout Candidates"
        value={stats.breakoutCandidates}
        trend="up"
        trendValue={`${stats.totalArtists > 0 ? Math.round((stats.breakoutCandidates / stats.totalArtists) * 100) : 0}% of total`}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />

      <MetricCard
        label="At-Risk Artists"
        value={stats.atRisk}
        trend={stats.atRisk > 0 ? "down" : "neutral"}
        trendValue={stats.atRisk > 0 ? "Needs attention" : "All clear"}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
    </div>
  );
}
