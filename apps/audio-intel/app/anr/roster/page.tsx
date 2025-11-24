import { Suspense } from 'react';
import { RosterSelector } from './components/RosterSelector';
import { RosterProfile } from './components/RosterProfile';
import { GapAnalysis } from './components/GapAnalysis';
import { FitChecker } from './components/FitChecker';
import { LoadingSpinner } from '../components/shared';

export const metadata = {
  title: 'Roster Analytics | A&R Radar',
  description: 'Roster gap analysis and candidate fit assessment',
};

async function getRosters() {
  try {
    const workspaceId = 'demo-workspace';
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/rosters?workspace_id=${workspaceId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.rosters || [];
  } catch (error) {
    console.error('Failed to fetch rosters:', error);
    return [];
  }
}

export default async function RosterPage({
  searchParams,
}: {
  searchParams: { roster?: string };
}) {
  const rosters = await getRosters();
  const selectedRosterId = searchParams.roster || rosters[0]?.id;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Roster Analytics</h1>
        <p className="text-slate-400">Gap analysis and candidate fit assessment</p>
      </div>

      {/* Roster Selector */}
      <RosterSelector rosters={rosters} selectedId={selectedRosterId} />

      {selectedRosterId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roster Profile */}
          <div className="lg:col-span-2">
            <Suspense fallback={<LoadingCard />}>
              <RosterProfile rosterId={selectedRosterId} />
            </Suspense>
          </div>

          {/* Gap Analysis */}
          <Suspense fallback={<LoadingCard />}>
            <GapAnalysis rosterId={selectedRosterId} />
          </Suspense>

          {/* Fit Checker */}
          <Suspense fallback={<LoadingCard />}>
            <FitChecker rosterId={selectedRosterId} />
          </Suspense>
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-12 text-center">
          <p className="text-slate-400">No roster selected. Create a roster to get started.</p>
        </div>
      )}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-12 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
