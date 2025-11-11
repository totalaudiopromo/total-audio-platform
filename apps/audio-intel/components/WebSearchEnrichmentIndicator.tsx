/**
 * Web Search Enrichment Indicator
 *
 * Impressive visual component that shows when Google Custom Search + Haiku
 * web enrichment is happening for low-confidence contacts
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Sparkles, Globe, Zap, CheckCircle } from 'lucide-react';

interface WebSearchEnrichmentIndicatorProps {
  isSearching: boolean;
  searchQuota?: {
    used: number;
    limit: number;
    remaining: number;
  };
  recentSearches?: number;
  confidenceImproved?: {
    before: 'Low' | 'Medium' | 'High';
    after: 'Low' | 'Medium' | 'High';
  };
}

export default function WebSearchEnrichmentIndicator({
  isSearching,
  searchQuota,
  recentSearches = 0,
  confidenceImproved,
}: WebSearchEnrichmentIndicatorProps) {
  if (!isSearching && !searchQuota && !recentSearches) return null;

  return (
    <Card className="border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 overflow-hidden">
      <CardContent className="p-6">
        {/* Searching Animation */}
        {isSearching && (
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                <Search className="w-6 h-6 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-blue-900 mb-1 flex items-center gap-2">
                <Globe className="w-5 h-5 animate-pulse" />
                Searching the Web for Contact Intelligence
              </h3>
              <p className="text-sm font-bold text-blue-700">
                Low confidence detected → Searching Google → Re-enriching with Haiku
              </p>
            </div>
          </div>
        )}

        {/* Search Quota Display */}
        {searchQuota && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg border-2 border-blue-300 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Search className="w-4 h-4 text-blue-600" />
                <div className="text-xs font-bold text-gray-600">Searches Used</div>
              </div>
              <div className="text-2xl font-black text-blue-600">{searchQuota.used}</div>
            </div>

            <div className="bg-white rounded-lg border-2 border-green-300 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-green-600" />
                <div className="text-xs font-bold text-gray-600">Remaining (Free)</div>
              </div>
              <div className="text-2xl font-black text-green-600">{searchQuota.remaining}</div>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-300 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-bold text-gray-600">Daily Limit</div>
              </div>
              <div className="text-2xl font-black text-gray-900">{searchQuota.limit}</div>
            </div>
          </div>
        )}

        {/* Quota Progress Bar */}
        {searchQuota && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
              <span>Free tier usage</span>
              <span>{Math.round((searchQuota.used / searchQuota.limit) * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  searchQuota.used >= searchQuota.limit * 0.9
                    ? 'bg-red-500'
                    : searchQuota.used >= searchQuota.limit * 0.7
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((searchQuota.used / searchQuota.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Recent Searches Count */}
        {recentSearches > 0 && !isSearching && (
          <div className="bg-white rounded-lg border-2 border-green-300 p-4 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-lg font-black text-green-900">
                  {recentSearches} contact{recentSearches > 1 ? 's' : ''} enhanced with web search
                </div>
                <p className="text-sm font-bold text-green-700">
                  Unknown contacts researched using Google Custom Search + Haiku AI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confidence Improvement */}
        {confidenceImproved && (
          <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg border-2 border-green-400 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-600" />
                <div className="text-base font-black text-gray-900">Confidence Improved!</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 font-bold px-3 py-1">
                  {confidenceImproved.before}
                </Badge>
                <span className="text-2xl font-black text-gray-600">→</span>
                <Badge className="bg-green-100 text-green-800 font-bold px-3 py-1">
                  {confidenceImproved.after}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-4 bg-blue-100 border-2 border-blue-300 rounded-lg p-4">
          <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            How Web Search Enrichment Works
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 font-medium">
            <li>
              • <strong>Step 1:</strong> Claude Sonnet tries to enrich from existing knowledge
            </li>
            <li>
              • <strong>Step 2:</strong> If confidence is "Low", trigger Google Custom Search (free
              tier: 100/day)
            </li>
            <li>
              • <strong>Step 3:</strong> Re-enrich with Claude Haiku using web search results
            </li>
            <li>
              • <strong>Result:</strong> Better intelligence at minimal cost (~$0.003 extra per
              search)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
