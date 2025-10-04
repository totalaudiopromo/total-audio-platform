'use client';

import { type Campaign, type CampaignIntelligence } from '@/lib/intelligence';

interface CampaignWithIntel extends Campaign {
  intelligence?: CampaignIntelligence;
}

export function CampaignCardWithIntel({ campaign }: { campaign: CampaignWithIntel }) {
  const hasResults = campaign.actual_reach > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Campaign Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {campaign.platform}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {campaign.genre}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Budget</div>
          <div className="text-lg font-semibold text-gray-900">£{campaign.budget}</div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <div className="text-xs text-gray-500">Target Reach</div>
          <div className="text-xl font-bold text-gray-900">{campaign.target_reach}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Actual Reach</div>
          <div className="text-xl font-bold text-gray-900">{campaign.actual_reach}</div>
        </div>
        {campaign.intelligence && (
          <div>
            <div className="text-xs text-gray-500">Success Rate</div>
            <div className="text-xl font-bold text-green-600">
              {campaign.intelligence.successRate}%
            </div>
          </div>
        )}
      </div>

      {/* Intelligence Section */}
      {hasResults && campaign.intelligence && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Performance vs Average</span>
              <span className={`text-lg font-bold ${
                campaign.intelligence.performanceVsAvg > 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {campaign.intelligence.performanceLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Cost Efficiency</span>
              <span className={`text-lg font-bold ${
                campaign.intelligence.costEfficiency < 0 ? 'text-green-600' : 'text-orange-600'
              }`}>
                £{campaign.intelligence.costPerResult.toFixed(2)} per result
              </span>
            </div>
          </div>

          {/* Insights */}
          {campaign.intelligence.insights.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase">Insights</div>
              {campaign.intelligence.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-sm text-gray-700">{insight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {campaign.intelligence.recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase">Recommendations</div>
              {campaign.intelligence.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">→</span>
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          )}

          {/* Percentile Badge */}
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <span className="text-sm text-purple-700">
              Top <strong>{100 - campaign.intelligence.percentile}%</strong> performance
            </span>
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">
            Add results to see intelligent insights and benchmarks
          </p>
        </div>
      )}
    </div>
  );
}
