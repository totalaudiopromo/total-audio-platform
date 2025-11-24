/**
 * Trend List Card Component
 * Individual card showing trend details for an entity
 */

import type { TrendSnapshot } from '@total-audio/rcf/trends';
import { VelocityBar } from './VelocityBar';

interface TrendListCardProps {
  trend: TrendSnapshot;
  rank?: number;
}

export function TrendListCard({ trend, rank }: TrendListCardProps) {
  const changeColor =
    trend.change > 0 ? 'text-green-400' : trend.change < 0 ? 'text-red-400' : 'text-slate-400';

  const entityTypeColors: Record<string, string> = {
    artist: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    scene: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    playlist: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    publication: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div
      className="
        rounded-lg border border-slate-800 bg-slate-900/50 p-6
        transition-all duration-240 ease-out
        hover:border-[#3AA9BE]/30 hover:bg-slate-900/70
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {rank !== undefined && (
              <span className="text-2xl font-bold text-slate-700 font-mono">#{rank}</span>
            )}
            <div>
              <span
                className={`
                  inline-block px-2 py-0.5 text-xs font-medium font-mono rounded border
                  ${entityTypeColors[trend.entity_type] || entityTypeColors.artist}
                `}
              >
                {trend.entity_type.toUpperCase()}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">{trend.entity_slug}</h3>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-[#3AA9BE] font-mono">
            {trend.score.toFixed(0)}
          </div>
          <div className="text-xs text-slate-500 font-mono">Trend Score</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-500 font-mono">Events</div>
          <div className="text-lg font-semibold text-slate-200 font-mono">{trend.event_count}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-mono">Change</div>
          <div className={`text-lg font-semibold font-mono ${changeColor}`}>
            {trend.change > 0 ? '+' : ''}
            {trend.change.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-mono">Window</div>
          <div className="text-lg font-semibold text-slate-200 font-mono">{trend.window}</div>
        </div>
      </div>

      <div className="mt-4">
        <VelocityBar velocity={trend.velocity} acceleration={trend.acceleration} />
      </div>

      {trend.metadata && Object.keys(trend.metadata).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 font-mono mb-2">Metadata</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(trend.metadata).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-1 text-xs bg-slate-800/50 text-slate-400 rounded border border-slate-700 font-mono"
              >
                {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
