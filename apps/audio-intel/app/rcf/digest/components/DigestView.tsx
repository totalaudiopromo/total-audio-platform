/**
 * Digest View Component
 * Display formatted digest with sections for top events, artists, scenes, and movers
 */

import { DigestSectionHeader } from './DigestSectionHeader';

interface DigestData {
  period_start: string;
  period_end: string;
  period_type: 'daily' | 'weekly';
  top_events?: Array<{ event_type: string; artist_slug: string; weight: number }>;
  top_artists?: Array<{ artist_slug: string; score: number }>;
  top_scenes?: Array<{ scene_slug: string; score: number }>;
  top_sources?: Array<{ source_slug: string; count: number }>;
  biggest_movers?: Array<{ artist_slug: string; change: number }>;
  stats?: {
    total_events?: number;
    unique_artists?: number;
    unique_scenes?: number;
    avg_weight?: number;
  };
}

interface DigestViewProps {
  digest: DigestData;
  format?: 'visual' | 'markdown';
}

export function DigestView({ digest, format = 'visual' }: DigestViewProps) {
  const periodLabel =
    digest.period_type === 'daily'
      ? new Date(digest.period_start).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : `Week of ${new Date(digest.period_start).toLocaleDateString('en-GB')}`;

  if (format === 'markdown') {
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 font-mono text-sm">
        <pre className="whitespace-pre-wrap text-slate-300">{generateMarkdown(digest)}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          {digest.period_type === 'daily' ? 'Daily' : 'Weekly'} Digest
        </h1>
        <p className="text-slate-400">{periodLabel}</p>
        {digest.stats && (
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            {digest.stats.total_events !== undefined && (
              <div>
                <span className="text-slate-500 font-mono">Events:</span>{' '}
                <span className="text-[#3AA9BE] font-semibold">{digest.stats.total_events}</span>
              </div>
            )}
            {digest.stats.unique_artists !== undefined && (
              <div>
                <span className="text-slate-500 font-mono">Artists:</span>{' '}
                <span className="text-purple-400 font-semibold">{digest.stats.unique_artists}</span>
              </div>
            )}
            {digest.stats.unique_scenes !== undefined && (
              <div>
                <span className="text-slate-500 font-mono">Scenes:</span>{' '}
                <span className="text-blue-400 font-semibold">{digest.stats.unique_scenes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top Events */}
      {digest.top_events && digest.top_events.length > 0 && (
        <div>
          <DigestSectionHeader title="Top Events" count={digest.top_events.length} icon="⭐" />
          <div className="space-y-3">
            {digest.top_events.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-slate-700 font-mono">#{idx + 1}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{event.artist_slug}</div>
                    <div className="text-xs text-slate-500 font-mono">{event.event_type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#3AA9BE] font-mono">
                    {event.weight.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">weight</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists */}
      {digest.top_artists && digest.top_artists.length > 0 && (
        <div>
          <DigestSectionHeader title="Top Artists" count={digest.top_artists.length} icon="🎤" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {digest.top_artists.map((artist, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-purple-500/5 rounded-lg border border-purple-500/20"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-purple-700 font-mono">#{idx + 1}</span>
                  <span className="text-sm font-medium text-slate-200">{artist.artist_slug}</span>
                </div>
                <span className="text-lg font-bold text-purple-400 font-mono">
                  {artist.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Scenes */}
      {digest.top_scenes && digest.top_scenes.length > 0 && (
        <div>
          <DigestSectionHeader title="Top Scenes" count={digest.top_scenes.length} icon="🌐" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {digest.top_scenes.map((scene, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-blue-500/5 rounded-lg border border-blue-500/20"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-bold text-blue-700 font-mono">#{idx + 1}</span>
                  <span className="text-sm font-medium text-slate-200">{scene.scene_slug}</span>
                </div>
                <span className="text-lg font-bold text-blue-400 font-mono">
                  {scene.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biggest Movers */}
      {digest.biggest_movers && digest.biggest_movers.length > 0 && (
        <div>
          <DigestSectionHeader
            title="Biggest Movers"
            count={digest.biggest_movers.length}
            icon="📈"
          />
          <div className="space-y-3">
            {digest.biggest_movers.map((mover, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🚀</span>
                  <span className="text-sm font-medium text-slate-200">{mover.artist_slug}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    +{mover.change.toFixed(1)}%
                  </span>
                  <span className="text-emerald-400">↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Sources */}
      {digest.top_sources && digest.top_sources.length > 0 && (
        <div>
          <DigestSectionHeader title="Top Sources" count={digest.top_sources.length} icon="📡" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {digest.top_sources.map((source, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-center"
              >
                <div className="text-xs text-slate-500 font-mono mb-1">{source.source_slug}</div>
                <div className="text-lg font-bold text-slate-200 font-mono">{source.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function generateMarkdown(digest: DigestData): string {
  const lines: string[] = [];

  lines.push(`# RCF ${digest.period_type === 'daily' ? 'Daily' : 'Weekly'} Digest`);
  lines.push('');
  lines.push(
    `**Period**: ${new Date(digest.period_start).toISOString()} - ${new Date(digest.period_end).toISOString()}`
  );
  lines.push('');

  if (digest.stats) {
    lines.push('## Statistics');
    lines.push('');
    if (digest.stats.total_events) lines.push(`- Total Events: ${digest.stats.total_events}`);
    if (digest.stats.unique_artists) lines.push(`- Unique Artists: ${digest.stats.unique_artists}`);
    if (digest.stats.unique_scenes) lines.push(`- Unique Scenes: ${digest.stats.unique_scenes}`);
    if (digest.stats.avg_weight)
      lines.push(`- Average Weight: ${digest.stats.avg_weight.toFixed(2)}`);
    lines.push('');
  }

  if (digest.top_events && digest.top_events.length > 0) {
    lines.push('## Top Events');
    lines.push('');
    digest.top_events.forEach((event, idx) => {
      lines.push(`${idx + 1}. **${event.event_type}**: ${event.artist_slug} (weight: ${event.weight.toFixed(2)})`);
    });
    lines.push('');
  }

  if (digest.top_artists && digest.top_artists.length > 0) {
    lines.push('## Top Artists');
    lines.push('');
    digest.top_artists.forEach((artist, idx) => {
      lines.push(`${idx + 1}. ${artist.artist_slug} (score: ${artist.score.toFixed(1)})`);
    });
    lines.push('');
  }

  if (digest.top_scenes && digest.top_scenes.length > 0) {
    lines.push('## Top Scenes');
    lines.push('');
    digest.top_scenes.forEach((scene, idx) => {
      lines.push(`${idx + 1}. ${scene.scene_slug} (score: ${scene.score.toFixed(1)})`);
    });
    lines.push('');
  }

  if (digest.biggest_movers && digest.biggest_movers.length > 0) {
    lines.push('## Biggest Movers');
    lines.push('');
    digest.biggest_movers.forEach((mover) => {
      lines.push(`- ${mover.artist_slug}: +${mover.change.toFixed(1)}%`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
