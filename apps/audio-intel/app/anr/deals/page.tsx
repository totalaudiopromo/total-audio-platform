import { Suspense } from 'react';
import { DealBoard } from './components/DealBoard';
import { LoadingSpinner } from '../components/shared';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Deal Flow | A&R Radar',
  description: 'Manage your artist deal pipeline',
};

async function getDeals() {
  try {
    const workspaceId = 'demo-workspace';

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/deals?workspace_id=${workspaceId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.deals || [];
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Deal Flow</h1>
          <p className="text-slate-400">Manage your artist deal pipeline</p>
        </div>

        <Link href="/anr/deals/new">
          <Button>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Deal
          </Button>
        </Link>
      </div>

      {/* Kanban Board */}
      <Suspense fallback={<BoardLoading />}>
        <DealBoard initialDeals={deals} />
      </Suspense>
    </div>
  );
}

function BoardLoading() {
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-12 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
