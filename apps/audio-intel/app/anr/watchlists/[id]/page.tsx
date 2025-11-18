import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TagPill, EmptyState } from '../../components/shared';
import { SectionCard } from '../../components/SectionCard';

async function getWatchlist(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/watchlists/${id}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return null;
  }
}

export default async function WatchlistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getWatchlist(params.id);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Watchlist not found</p>
      </div>
    );
  }

  const members = data.members || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/anr/watchlists" className="text-sm text-slate-400 hover:text-slate-300 mb-2 inline-block">
            ← Back to Watchlists
          </Link>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">{data.watchlist?.name || 'Watchlist'}</h1>
          {data.watchlist?.description && (
            <p className="text-slate-400">{data.watchlist.description}</p>
          )}
        </div>

        <Button>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Artist
        </Button>
      </div>

      {/* Members Table */}
      <SectionCard title="Watched Artists" description={`${members.length} artists being tracked`}>
        {members.length === 0 ? (
          <EmptyState
            title="No Artists Yet"
            description="Add artists to this watchlist to start tracking them"
            action={<Button size="sm">Add Artist</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800">
                <tr className="text-left text-sm text-slate-400">
                  <th className="pb-3 font-medium">Artist</th>
                  <th className="pb-3 font-medium">Reason</th>
                  <th className="pb-3 font-medium">Added</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member: any) => (
                  <tr key={member.id} className="border-b border-slate-800/30 last:border-0">
                    <td className="py-4">
                      <Link
                        href={`/anr/candidates/${member.artist_slug}`}
                        className="text-slate-100 hover:text-[#3AA9BE] font-medium"
                      >
                        {member.artist_slug}
                      </Link>
                    </td>
                    <td className="py-4">
                      {member.reason ? (
                        <span className="text-sm text-slate-400">{member.reason}</span>
                      ) : (
                        <span className="text-sm text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-slate-500 font-mono">
                        {new Date(member.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
