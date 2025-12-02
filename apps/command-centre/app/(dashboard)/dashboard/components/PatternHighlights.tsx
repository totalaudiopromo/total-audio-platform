import type { Pattern } from '@total-audio/ai-skills';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function PatternHighlights({ patterns }: { patterns: Pattern[] }) {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">Pattern Detection</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.slice(0, 6).map((pattern, idx) => (
          <div key={idx} className="rounded-lg border border-zinc-800 bg-black/20 p-4">
            <div className="flex items-start gap-2">
              {getImpactIcon(pattern.impact)}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{pattern.description}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {Math.round(pattern.confidence * 100)}% confidence • {pattern.dataPoints} data
                  points
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
