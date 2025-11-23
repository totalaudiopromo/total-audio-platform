import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionCard } from '../../components/SectionCard';
import { ScorePill } from '../../components/ScorePill';
import { TagPill, EmptyState } from '../../components/shared';
import { ShowcaseExportButtons } from '../components/ShowcaseExportButtons';

async function getShowcase(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/api/anr/showcases/${id}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.showcase;
  } catch (error) {
    console.error('Failed to fetch showcase:', error);
    return null;
  }
}

export default async function ShowcaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const showcase = await getShowcase(params.id);

  if (!showcase) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Showcase not found</p>
      </div>
    );
  }

  const artists = showcase.artists || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/anr/showcases" className="text-sm text-slate-400 hover:text-slate-300 mb-2 inline-block">
            ← Back to Showcases
          </Link>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">{showcase.name}</h1>
          {showcase.description && (
            <p className="text-slate-400">{showcase.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ShowcaseExportButtons showcaseId={params.id} />
          <Button>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Artist
          </Button>
        </div>
      </div>

      {/* Stats */}
      {showcase.avg_composite_score !== undefined && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Total Artists</p>
            <p className="text-2xl font-bold text-slate-100">{showcase.total_artists || 0}</p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Avg Score</p>
            <ScorePill score={showcase.avg_composite_score} />
          </div>
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Scenes</p>
            <p className="text-lg font-semibold text-slate-100">{showcase.scenes_represented?.length || 0}</p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Countries</p>
            <p className="text-lg font-semibold text-slate-100">{showcase.countries_represented?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Artists */}
      <SectionCard title="Artists in Showcase">
        {artists.length === 0 ? (
          <EmptyState
            title="No Artists Yet"
            description="Add artists to build your showcase"
            action={<Button size="sm">Add Artist</Button>}
          />
        ) : (
          <div className="space-y-4">
            {artists.map((artist: any) => (
              <div
                key={artist.artist_slug}
                className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1">
                      {artist.name || artist.artist_slug}
                    </h3>
                    {artist.one_line_pitch && (
                      <p className="text-sm text-[#3AA9BE] italic">{artist.one_line_pitch}</p>
                    )}
                  </div>
                  {artist.composite_score !== undefined && (
                    <ScorePill score={artist.composite_score} />
                  )}
                </div>

                {/* Highlights */}
                {artist.campaign_highlights && artist.campaign_highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {artist.campaign_highlights.map((highlight: string, idx: number) => (
                      <TagPill key={idx}>{highlight}</TagPill>
                    ))}
                  </div>
                )}

                {/* Scene Fit */}
                {artist.scene_fit_summary && (
                  <p className="text-sm text-slate-400">{artist.scene_fit_summary}</p>
                )}

                {/* Notes */}
                {artist.notes && (
                  <p className="text-xs text-slate-600 mt-3 italic">{artist.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
