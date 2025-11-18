import { Suspense } from 'react';
import { MetricCard } from '../components/MetricCard';
import { SectionCard } from '../components/SectionCard';
import { LoadingSpinner } from '../components/shared';
import { WorkbenchOverview } from './components/WorkbenchOverview';
import { RosterHealthSnapshot } from './components/RosterHealthSnapshot';
import { DealFlowSnapshot } from './components/DealFlowSnapshot';
import { WatchlistHighlights } from './components/WatchlistHighlights';

export const metadata = {
  title: 'A&R Workbench | Audio Intel',
  description: 'A&R analyst control centre - talent discovery and deal flow management',
};

export default function WorkbenchPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">A&R Workbench</h1>
        <p className="text-slate-400">Your control centre for talent discovery and deal flow management</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Radar Overview */}
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingCard />}>
            <WorkbenchOverview />
          </Suspense>
        </div>

        {/* Roster Health */}
        <Suspense fallback={<LoadingCard />}>
          <RosterHealthSnapshot />
        </Suspense>

        {/* Deal Flow Snapshot */}
        <Suspense fallback={<LoadingCard />}>
          <DealFlowSnapshot />
        </Suspense>

        {/* Watchlist Highlights */}
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingCard />}>
            <WatchlistHighlights />
          </Suspense>
        </div>
      </div>
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
