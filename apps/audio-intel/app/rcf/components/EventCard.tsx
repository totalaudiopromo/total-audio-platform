/**
 * Event Card Component
 *
 * Individual event display in the RCF feed
 */

'use client';

import type { RCFUserFeedEntry } from '@total-audio/rcf/types';
import { formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  event: RCFUserFeedEntry;
}

export function EventCard({ event }: EventCardProps) {
  const categoryColors: Record<string, string> = {
    Coverage: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Scenes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Network: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Campaigns: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Signals: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Creative: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    Community: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    External: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const categoryColor = event.displayCategory
    ? categoryColors[event.displayCategory] || categoryColors.External
    : categoryColors.External;

  // Format metadata for display
  const displayMetadata = formatMetadata(event);

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-slate-900/50 p-4 transition-all hover:bg-slate-900/70 ${
        event.isNew ? 'border-[#3AA9BE]/50' : 'border-slate-800'
      } ${event.isHighlighted ? 'ring-1 ring-[#3AA9BE]/30' : ''}`}
    >
      {/* New indicator */}
      {event.isNew && (
        <div className="absolute right-0 top-0 h-2 w-2 rounded-bl-lg bg-[#3AA9BE]" />
      )}

      <div className="flex items-start justify-between">
        {/* Left: Icon + Content */}
        <div className="flex flex-1 space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 text-2xl">{event.icon || '📌'}</div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <span className={`rounded border px-2 py-0.5 text-xs font-medium ${categoryColor}`}>
                {event.displayCategory || 'Event'}
              </span>

              <span className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </span>

              {event.isHighlighted && (
                <span className="rounded bg-[#3AA9BE]/10 px-2 py-0.5 text-xs font-medium text-[#3AA9BE]">
                  High Impact
                </span>
              )}
            </div>

            {/* Main content */}
            <div className="space-y-1">
              <div className="font-medium text-slate-200">{displayMetadata.title}</div>
              {displayMetadata.subtitle && (
                <div className="text-sm text-slate-400">{displayMetadata.subtitle}</div>
              )}
            </div>

            {/* Metadata tags */}
            {displayMetadata.tags && displayMetadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayMetadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded bg-slate-800/50 px-2 py-0.5 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Weight indicator */}
        <div className="ml-4 flex-shrink-0">
          <div className="flex flex-col items-end space-y-1">
            <div className="text-xs font-medium text-slate-500">Weight</div>
            <div className="relative h-12 w-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="absolute bottom-0 w-full rounded-full bg-[#3AA9BE] transition-all"
                style={{ height: `${event.weight * 100}%` }}
              />
            </div>
            <div className="text-xs font-mono text-slate-400">{event.weight.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format event metadata for display
 */
function formatMetadata(event: RCFUserFeedEntry): {
  title: string;
  subtitle?: string;
  tags: string[];
} {
  const metadata = event.metadata as any;
  const tags: string[] = [];

  if (event.artist_slug) {
    tags.push(`Artist: ${event.artist_slug}`);
  }

  if (event.scene_slug) {
    tags.push(`Scene: ${event.scene_slug}`);
  }

  switch (event.event_type) {
    case 'playlist_add':
      return {
        title: metadata.playlistName || 'Playlist Add',
        subtitle: metadata.curator ? `Curated by ${metadata.curator}` : undefined,
        tags: [...tags, ...(metadata.followerCount ? [`${metadata.followerCount} followers`] : [])],
      };

    case 'press_feature':
      return {
        title: metadata.articleTitle || metadata.publication || 'Press Feature',
        subtitle: metadata.publication && metadata.writer ? `${metadata.publication} · ${metadata.writer}` : metadata.publication,
        tags: [...tags, ...(metadata.publicationTier ? [metadata.publicationTier.toUpperCase()] : [])],
      };

    case 'radio_spin':
      return {
        title: metadata.stationName || 'Radio Spin',
        subtitle: metadata.showName || undefined,
        tags: [...tags, ...(metadata.stationType ? [metadata.stationType.toUpperCase()] : [])],
      };

    case 'scene_pulse_change':
      return {
        title: `${metadata.sceneName || 'Scene'} Pulse ${metadata.direction === 'up' ? '↑' : '↓'}`,
        subtitle: `${metadata.oldPulse} → ${metadata.newPulse} (Δ ${metadata.delta > 0 ? '+' : ''}${metadata.delta})`,
        tags,
      };

    case 'creative_breakthrough':
      return {
        title: `Creative Breakthrough: ${metadata.breakthroughType || 'Unknown'}`,
        subtitle: metadata.description || undefined,
        tags: [...tags, ...(metadata.cmgScore ? [`Score: ${metadata.cmgScore.toFixed(2)}`] : [])],
      };

    case 'campaign_event':
      return {
        title: metadata.campaignName || 'Campaign Event',
        subtitle: `${metadata.stage || ''} · ${metadata.action || ''}`,
        tags: [...tags, ...(metadata.result ? [metadata.result.toUpperCase()] : [])],
      };

    default:
      return {
        title: event.event_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        subtitle: event.entity_slug || undefined,
        tags,
      };
  }
}
