'use client';

import { type PatternAnalysis } from '@/lib/intelligence';

export function IntelligenceBar({ patterns }: { patterns: PatternAnalysis }) {
  if (patterns.totalCampaigns === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">YOUR INSIGHTS</h3>
        <p className="text-gray-400">Add campaigns to see your performance patterns</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">YOUR PATTERNS</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {patterns.bestGenre && (
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(patterns.bestGenre.successRate)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {patterns.bestGenre.genre} success rate
            </div>
          </div>
        )}

        {patterns.bestPlatform && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(patterns.bestPlatform.successRate)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {patterns.bestPlatform.platform} performs best
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            £{Math.round(patterns.totalSpent / patterns.totalCampaigns)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Avg budget per campaign
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(patterns.avgSuccessRate)}%
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Overall success rate
          </div>
        </div>
      </div>
    </div>
  );
}
