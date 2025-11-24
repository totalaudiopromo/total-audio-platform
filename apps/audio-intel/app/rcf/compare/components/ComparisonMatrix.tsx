/**
 * Comparison Matrix Component
 * Side-by-side table comparison of multiple artists
 */

import { ScoreDeltaPill } from './ScoreDeltaPill';

interface ArtistComparison {
  artist_slug: string;
  event_count: number;
  total_weight: number;
  avg_weight: number;
  velocity: number;
  event_type_distribution: Record<string, number>;
  coverage_quality_score: number;
}

interface ComparisonMatrixProps {
  comparisons: ArtistComparison[];
}

export function ComparisonMatrix({ comparisons }: ComparisonMatrixProps) {
  if (comparisons.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        No comparison data available
      </div>
    );
  }

  // Find baseline (first artist) for delta calculations
  const baseline = comparisons[0];

  // Get all event types across all artists
  const allEventTypes = new Set<string>();
  comparisons.forEach((comp) => {
    Object.keys(comp.event_type_distribution).forEach((type) => allEventTypes.add(type));
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left py-3 px-4 text-slate-400 font-mono text-xs uppercase">
              Metric
            </th>
            {comparisons.map((comp, idx) => (
              <th
                key={comp.artist_slug}
                className="text-right py-3 px-4 text-slate-200 font-semibold"
              >
                <div className="flex flex-col items-end">
                  <span>{comp.artist_slug}</span>
                  {idx === 0 && (
                    <span className="text-xs text-slate-500 font-normal mt-1">(Baseline)</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {/* Event Count */}
          <tr className="hover:bg-slate-900/30 transition-colors">
            <td className="py-3 px-4 text-slate-300 font-mono">Total Events</td>
            {comparisons.map((comp, idx) => (
              <td key={comp.artist_slug} className="py-3 px-4 text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-slate-200 font-semibold font-mono">
                    {comp.event_count}
                  </span>
                  {idx > 0 && (
                    <ScoreDeltaPill
                      value={comp.event_count - baseline.event_count}
                      format="number"
                      size="sm"
                    />
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Total Weight */}
          <tr className="hover:bg-slate-900/30 transition-colors">
            <td className="py-3 px-4 text-slate-300 font-mono">Total Weight</td>
            {comparisons.map((comp, idx) => (
              <td key={comp.artist_slug} className="py-3 px-4 text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-slate-200 font-semibold font-mono">
                    {comp.total_weight.toFixed(2)}
                  </span>
                  {idx > 0 && (
                    <ScoreDeltaPill
                      value={comp.total_weight - baseline.total_weight}
                      format="decimal"
                      size="sm"
                    />
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Average Weight */}
          <tr className="hover:bg-slate-900/30 transition-colors">
            <td className="py-3 px-4 text-slate-300 font-mono">Avg Weight</td>
            {comparisons.map((comp, idx) => (
              <td key={comp.artist_slug} className="py-3 px-4 text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-slate-200 font-semibold font-mono">
                    {comp.avg_weight.toFixed(2)}
                  </span>
                  {idx > 0 && (
                    <ScoreDeltaPill
                      value={comp.avg_weight - baseline.avg_weight}
                      format="decimal"
                      size="sm"
                    />
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Velocity */}
          <tr className="hover:bg-slate-900/30 transition-colors">
            <td className="py-3 px-4 text-slate-300 font-mono">Velocity (ev/hr)</td>
            {comparisons.map((comp, idx) => (
              <td key={comp.artist_slug} className="py-3 px-4 text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-slate-200 font-semibold font-mono">
                    {comp.velocity.toFixed(2)}
                  </span>
                  {idx > 0 && (
                    <ScoreDeltaPill
                      value={comp.velocity - baseline.velocity}
                      format="decimal"
                      size="sm"
                    />
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Quality Score */}
          <tr className="hover:bg-slate-900/30 transition-colors">
            <td className="py-3 px-4 text-slate-300 font-mono">Quality Score</td>
            {comparisons.map((comp, idx) => (
              <td key={comp.artist_slug} className="py-3 px-4 text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-[#3AA9BE] font-bold font-mono text-lg">
                    {comp.coverage_quality_score.toFixed(1)}
                  </span>
                  {idx > 0 && (
                    <ScoreDeltaPill
                      value={comp.coverage_quality_score - baseline.coverage_quality_score}
                      format="decimal"
                      size="sm"
                    />
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Event Type Distribution */}
          {Array.from(allEventTypes).map((eventType) => (
            <tr key={eventType} className="hover:bg-slate-900/30 transition-colors">
              <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                <span className="ml-4">↳ {eventType}</span>
              </td>
              {comparisons.map((comp, idx) => {
                const count = comp.event_type_distribution[eventType] || 0;
                const baselineCount = baseline.event_type_distribution[eventType] || 0;

                return (
                  <td key={comp.artist_slug} className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-slate-400 font-mono text-xs">{count}</span>
                      {idx > 0 && count !== baselineCount && (
                        <ScoreDeltaPill value={count - baselineCount} format="number" size="sm" />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
