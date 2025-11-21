/**
 * AI Insights Panel - Pattern Detection Results
 */

import type { PatternDetectionOutput } from '@total-audio/ai-skills';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  patterns?: PatternDetectionOutput;
}

export function AIInsightsPanel({ patterns }: Props) {
  if (!patterns) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
        <p className="mt-2 text-sm text-zinc-400">Loading patterns...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#3AA9BE]" />
        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
      </div>

      {/* Insights */}
      {patterns.insights.length > 0 && (
        <div className="mt-4 space-y-2">
          {patterns.insights.slice(0, 3).map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <TrendingUp className="mt-1 h-4 w-4 shrink-0 text-[#3AA9BE]" />
              <p className="text-sm text-zinc-300">{insight}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {patterns.recommendations.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Recommendations
          </p>
          {patterns.recommendations.slice(0, 2).map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-sm text-zinc-400">{rec}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500">{patterns.patterns.length} patterns detected</p>
      </div>
    </div>
  );
}
