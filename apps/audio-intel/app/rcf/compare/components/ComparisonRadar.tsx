/**
 * Comparison Radar Component
 * Simplified radar/spider chart visualization for comparison metrics
 */

interface RadarMetric {
  label: string;
  values: number[]; // One value per artist
  max: number;
}

interface ComparisonRadarProps {
  metrics: RadarMetric[];
  artistNames: string[];
}

const ARTIST_COLORS = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-pink-500',
];

export function ComparisonRadar({ metrics, artistNames }: ComparisonRadarProps) {
  if (metrics.length === 0 || artistNames.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        No data available for radar visualization
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-4">
        {artistNames.map((name, idx) => (
          <div key={name} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${ARTIST_COLORS[idx % ARTIST_COLORS.length]}`} />
            <span className="text-sm text-slate-300 font-mono">{name}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="text-sm font-medium text-slate-300 font-mono">{metric.label}</div>

            <div className="space-y-1">
              {metric.values.map((value, artistIdx) => {
                const percentage = metric.max > 0 ? (value / metric.max) * 100 : 0;

                return (
                  <div key={artistIdx} className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ARTIST_COLORS[artistIdx % ARTIST_COLORS.length]
                      }`}
                    />
                    <div className="flex-1 bg-slate-900 rounded-full h-6 border border-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${
                          ARTIST_COLORS[artistIdx % ARTIST_COLORS.length]
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400 font-mono w-16 text-right">
                      {value.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
