/**
 * Trend Heatmap Component
 * Visual heatmap grid showing trending entities by score intensity
 */

'use client';

import type { TrendSnapshot } from '@total-audio/rcf/trends';

interface TrendHeatmapProps {
  trends: TrendSnapshot[];
  onSelectTrend?: (trend: TrendSnapshot) => void;
}

export function TrendHeatmap({ trends, onSelectTrend }: TrendHeatmapProps) {
  if (trends.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No trend data available for heatmap visualization
      </div>
    );
  }

  const maxScore = Math.max(...trends.map((t) => t.score), 1);
  const getHeatColor = (score: number): string => {
    const intensity = score / maxScore;
    if (intensity > 0.8) return 'bg-[#3AA9BE] text-white';
    if (intensity > 0.6) return 'bg-[#3AA9BE]/70 text-white';
    if (intensity > 0.4) return 'bg-[#3AA9BE]/50 text-slate-100';
    if (intensity > 0.2) return 'bg-[#3AA9BE]/30 text-slate-200';
    return 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300 font-mono">Trend Heatmap</h3>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-mono">Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-slate-800 rounded" />
            <div className="w-4 h-4 bg-[#3AA9BE]/30 rounded" />
            <div className="w-4 h-4 bg-[#3AA9BE]/50 rounded" />
            <div className="w-4 h-4 bg-[#3AA9BE]/70 rounded" />
            <div className="w-4 h-4 bg-[#3AA9BE] rounded" />
          </div>
          <span className="font-mono">High</span>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {trends.slice(0, 50).map((trend, idx) => (
          <button
            key={`${trend.entity_type}-${trend.entity_slug}-${idx}`}
            onClick={() => onSelectTrend?.(trend)}
            className={`
              aspect-square rounded-lg p-2
              transition-all duration-240 ease-out
              hover:scale-110 hover:z-10 hover:shadow-lg
              ${getHeatColor(trend.score)}
            `}
            title={`${trend.entity_slug}: ${trend.score.toFixed(0)}`}
          >
            <div className="text-xs font-mono font-bold">{trend.score.toFixed(0)}</div>
            <div className="text-[0.5rem] truncate mt-1 opacity-70">{trend.entity_slug}</div>
          </button>
        ))}
      </div>

      {trends.length > 50 && (
        <div className="text-center text-xs text-slate-500 font-mono">
          Showing top 50 of {trends.length} trends
        </div>
      )}
    </div>
  );
}
