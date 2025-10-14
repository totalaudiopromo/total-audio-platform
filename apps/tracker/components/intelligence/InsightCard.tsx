// ============================================================================
// INSIGHT CARD - Display single campaign insight
// Audio Intel brutalist design
// ============================================================================

import type { Pattern } from '@/lib/types/tracker';

interface InsightCardProps {
  insight: string | Pattern;
  className?: string;
}

export function InsightCard({ insight, className = '' }: InsightCardProps) {
  const message = typeof insight === 'string' ? insight : insight.message;
  const confidence = typeof insight === 'object' ? insight.confidence : undefined;

  return (
    <div className={`bg-white rounded-xl border-4 border-black p-5 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all ${className}`}>
      <p className="text-sm font-bold text-gray-800 leading-relaxed">{message}</p>
      {confidence !== undefined && (
        <div className="mt-3 pt-3 border-t-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Confidence</span>
            <span className="text-xs font-black text-purple-600">{confidence}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-300">
            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
