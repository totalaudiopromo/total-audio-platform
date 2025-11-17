/**
 * ScenePulseHeatmap Component
 * Visualizes scene activity and growth rates
 */

'use client';

import type { ScenePulse } from '@total-audio/music-industry-graph';

interface ScenePulseHeatmapProps {
  scenes: ScenePulse[];
}

export function ScenePulseHeatmap({ scenes }: ScenePulseHeatmapProps) {
  if (!scenes || scenes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No scene data available
      </div>
    );
  }

  // Sort scenes by growth rate
  const sortedScenes = [...scenes].sort((a, b) => b.growth_rate_30d - a.growth_rate_30d);

  const getGrowthColor = (growthRate: number): string => {
    if (growthRate > 50) return 'bg-green-500/80';
    if (growthRate > 20) return 'bg-cyan-500/80';
    if (growthRate > 10) return 'bg-blue-500/80';
    if (growthRate > 0) return 'bg-slate-500/80';
    return 'bg-red-500/80';
  };

  const getGrowthText = (growthRate: number): string => {
    if (growthRate > 50) return 'text-green-400';
    if (growthRate > 20) return 'text-cyan-400';
    if (growthRate > 10) return 'text-blue-400';
    if (growthRate > 0) return 'text-slate-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-3">
      {sortedScenes.map((scene) => (
        <div
          key={scene.scene_slug}
          className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-240 group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {scene.scene_name}
            </h3>
            <div className={`text-sm font-semibold ${getGrowthText(scene.growth_rate_30d)}`}>
              {scene.growth_rate_30d > 0 ? '+' : ''}
              {scene.growth_rate_30d.toFixed(1)}%
            </div>
          </div>

          {/* Growth Bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full ${getGrowthColor(scene.growth_rate_30d)} transition-all duration-500`}
              style={{
                width: `${Math.min(Math.abs(scene.growth_rate_30d), 100)}%`,
              }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-slate-500">Nodes</div>
              <div className="text-slate-300 font-semibold">{scene.total_nodes}</div>
            </div>
            <div>
              <div className="text-slate-500">Connections</div>
              <div className="text-slate-300 font-semibold">{scene.total_edges}</div>
            </div>
            <div>
              <div className="text-slate-500">New (30d)</div>
              <div className="text-slate-300 font-semibold">{scene.new_nodes_30d}</div>
            </div>
          </div>

          {/* Trending Microgenres */}
          {scene.trending_microgenres.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-500 mb-2">Trending Microgenres:</div>
              <div className="flex flex-wrap gap-1">
                {scene.trending_microgenres.slice(0, 5).map((mg) => (
                  <span
                    key={mg}
                    className="px-2 py-1 bg-pink-600/20 border border-pink-500/30 rounded text-xs text-pink-300"
                  >
                    {mg}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
