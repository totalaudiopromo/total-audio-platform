'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Campaign } from '@/lib/types/tracker';
import { CampaignModal } from './CampaignModal';

interface CampaignWithInsights extends Campaign {
  insights?: string[];
}

export function CampaignCardWithIntel({ campaign }: { campaign: CampaignWithInsights }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasResults = campaign.actual_reach > 0;
  const hasInsights = campaign.insights && campaign.insights.length > 0;

  // Calculate if campaign is performing well
  const isPerformingWell = campaign.success_rate > 25 || campaign.performance_score > 60;

  return (
    <>
      <div className="bg-white border-4 border-black rounded-2xl p-6 md:p-8 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
        {/* Campaign Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 mb-3">{campaign.name}</h3>
            <div className="flex flex-wrap items-center gap-3">
              {campaign.platform && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border-2 border-blue-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {campaign.platform}
                </span>
              )}
              {campaign.genre && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border-2 border-purple-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {campaign.genre}
                </span>
              )}
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                campaign.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-800' 
                  : campaign.status === 'completed'
                  ? 'bg-gray-100 text-gray-800 border-gray-800'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-800'
              }`}>
                {campaign.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-black text-gray-500 uppercase tracking-wider mb-1">Budget</div>
            <div className="text-3xl font-black text-gray-900">£{campaign.budget}</div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b-2 border-gray-200">
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Target</div>
            <div className="text-2xl font-black text-gray-900">{campaign.target_reach}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Actual</div>
            <div className="text-2xl font-black text-gray-900">{campaign.actual_reach}</div>
          </div>
          {hasResults && (
            <>
              <div className={`rounded-xl p-4 border-2 ${
                campaign.success_rate > 25 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-orange-50 border-orange-500'
              }`}>
                <div className="text-xs font-black uppercase tracking-wider mb-2 text-gray-700">Success Rate</div>
                <div className={`text-2xl font-black ${
                  campaign.success_rate > 25 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {Math.round(campaign.success_rate)}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Cost/Result</div>
                <div className="text-2xl font-black text-gray-900">£{Math.round(campaign.cost_per_result)}</div>
              </div>
            </>
          )}
        </div>

        {/* Intelligence Section */}
        {hasResults ? (
          <div className="space-y-4">
            {/* Performance Badge */}
            {campaign.performance_score > 0 && (
              <div className={`rounded-xl p-4 border-4 ${
                isPerformingWell 
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500' 
                  : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-gray-700 uppercase tracking-wider">Performance Score</span>
                  <span className={`text-2xl font-black ${
                    isPerformingWell ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {campaign.performance_score}/100
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className={isPerformingWell ? 'text-green-700' : 'text-orange-700'}>
                    {campaign.percentile_rank > 0 ? `Top ${100 - campaign.percentile_rank}% performance` : 'Building comparison data...'}
                  </span>
                </div>
              </div>
            )}

            {/* Insights */}
            {hasInsights && (
              <div className="bg-blue-50 rounded-xl p-6 border-4 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-black text-gray-900 uppercase tracking-wider">Campaign Insights</h4>
                </div>
                <div className="space-y-3">
                  {campaign.insights!.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 font-black mt-0.5">→</span>
                      <span className="text-sm font-bold text-gray-800 leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-black text-gray-900 mb-1">Add Results to Unlock Intelligence</p>
            <p className="text-xs font-bold text-gray-600">
              Update actual reach to see performance insights and benchmarks
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t-2 border-gray-200">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
          >
            Edit Campaign
          </button>
          <button 
            onClick={() => router.push(`/campaigns/${campaign.id}`)}
            className="flex-1 px-4 py-2.5 bg-white text-gray-900 rounded-xl font-bold border-2 border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <CampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        campaign={campaign}
      />
    </>
  );
}
