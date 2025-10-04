// Campaign Card with Intelligence - Intel-matching design

'use client';

import type { Campaign } from '@/lib/types/tracker';
import Link from 'next/link';

interface CampaignCardIntelProps {
  campaign: Campaign & { insights?: string[] };
}

export function CampaignCardIntel({ campaign }: CampaignCardIntelProps) {
  const statusColors = {
    planning: 'bg-gray-100 text-gray-700',
    active: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  const performanceColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-purple-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {campaign.name}
            </h3>
            {campaign.artist_name && (
              <p className="text-sm text-gray-500">{campaign.artist_name}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
            {campaign.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {campaign.platform && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
              {campaign.platform}
            </span>
          )}
          {campaign.genre && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {campaign.genre}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Success Rate</p>
            <p className={`text-lg font-bold ${performanceColor(campaign.success_rate)}`}>
              {Math.round(campaign.success_rate)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Cost/Result</p>
            <p className="text-lg font-bold text-gray-900">
              {campaign.cost_per_result > 0 ? `£${Math.round(campaign.cost_per_result)}` : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Performance</p>
            <p className={`text-lg font-bold ${performanceColor(campaign.performance_score)}`}>
              {campaign.performance_score}/100
            </p>
          </div>
        </div>

        {campaign.target_reach > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{campaign.actual_reach} / {campaign.target_reach}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${Math.min(100, (campaign.actual_reach / campaign.target_reach) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {campaign.insights && campaign.insights.length > 0 && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <p className="text-sm text-gray-700">{campaign.insights[0]}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget</span>
            <span className="font-medium text-gray-900">£{campaign.budget}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
