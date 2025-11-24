import Link from 'next/link';
import { SectionCard } from '../../components/SectionCard';
import { ScorePill } from '../../components/ScorePill';
import { EmptyState, StatusBadge } from '../../components/shared';
import { Button } from '@/components/ui/button';

async function getWatchlistHighlights() {
  try {
    const userId = 'demo-user'; // TODO: Get from session

    const watchlistsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/watchlists?user_id=${userId}`,
      { cache: 'no-store' }
    );

    if (!watchlistsRes.ok) {
      return [];
    }

    const data = await watchlistsRes.json();
    const watchlists = data.watchlists || [];

    // Get members for each watchlist (limit to first 3 watchlists)
    const highlights = [];
    for (const watchlist of watchlists.slice(0, 3)) {
      const membersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/watchlists/${watchlist.id}`,
        { cache: 'no-store' }
      );

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        const members = membersData.members || [];

        // Add members with watchlist info
        members.slice(0, 3).forEach((member: any) => {
          highlights.push({
            ...member,
            watchlist_name: watchlist.name,
          });
        });
      }
    }

    return highlights.slice(0, 10); // Limit to 10 total
  } catch (error) {
    console.error('Failed to fetch watchlist highlights:', error);
    return [];
  }
}

export async function WatchlistHighlights() {
  const highlights = await getWatchlistHighlights();

  return (
    <SectionCard
      title="Watchlist Activity"
      description="Recent additions and changes"
      action={
        <Link href="/anr/watchlists">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      }
    >
      {highlights.length === 0 ? (
        <EmptyState
          title="No Watchlists Yet"
          description="Create watchlists to track specific artists and get alerts"
          action={
            <Link href="/anr/watchlists">
              <Button size="sm">Create Watchlist</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {highlights.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-800/20 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-medium text-slate-200">{item.artist_slug}</h4>
                  <StatusBadge status={item.watchlist_name} variant="info" />
                </div>
                {item.reason && (
                  <p className="text-xs text-slate-500">{item.reason}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Momentum indicator */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="font-mono">7d</span>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
