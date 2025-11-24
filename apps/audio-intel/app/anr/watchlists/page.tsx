import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '../components/shared';

async function getWatchlists() {
  try {
    const userId = 'demo-user'; // TODO: Get from session
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/watchlists?user_id=${userId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.watchlists || [];
  } catch (error) {
    console.error('Failed to fetch watchlists:', error);
    return [];
  }
}

export const metadata = {
  title: 'Watchlists | A&R Radar',
  description: 'Track and monitor specific artists',
};

export default async function WatchlistsPage() {
  const watchlists = await getWatchlists();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Watchlists</h1>
          <p className="text-slate-400">Track and monitor specific artists</p>
        </div>

        <Button>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Watchlist
        </Button>
      </div>

      {/* Watchlists Grid */}
      {watchlists.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            title="No Watchlists Yet"
            description="Create watchlists to track specific artists and get momentum alerts"
            action={<Button>Create Watchlist</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlists.map((watchlist: any) => (
            <Link key={watchlist.id} href={`/anr/watchlists/${watchlist.id}`}>
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/50 transition-all duration-200 cursor-pointer">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {watchlist.name}
                </h3>
                {watchlist.description && (
                  <p className="text-sm text-slate-500 mb-4">{watchlist.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Artists: 0</span>
                  <span className="text-slate-600 font-mono">
                    {new Date(watchlist.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
