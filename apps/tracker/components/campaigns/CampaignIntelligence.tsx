'use client';

import { useState, useEffect } from 'react';

interface CampaignIntelligenceProps {
  campaignId: string;
  campaignName: string;
}

interface AutopsyData {
  autopsy: string;
  nextMove: string;
  brutalHonesty: string;
  quickWins: string;
}

export function CampaignIntelligence({
  campaignId,
  campaignName,
}: CampaignIntelligenceProps) {
  const [autopsy, setAutopsy] = useState<AutopsyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Load existing autopsy on mount
  useEffect(() => {
    loadExistingAutopsy();
  }, [campaignId]);

  const loadExistingAutopsy = async () => {
    setLoadingExisting(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/autopsy`);
      if (response.ok) {
        const data = await response.json();
        if (data.autopsy) {
          setAutopsy(data.autopsy);
        }
      }
    } catch (err) {
      console.error('Failed to load existing autopsy:', err);
    } finally {
      setLoadingExisting(false);
    }
  };

  const generateAutopsy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/autopsy`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate autopsy');
      }

      const data = await response.json();
      setAutopsy(data.autopsy);
    } catch (err: any) {
      setError(
        err.message || 'Failed to generate campaign autopsy. Please try again.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loadingExisting) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-300">
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm font-bold text-gray-600">
            Loading campaign intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 border-4 border-teal-500 shadow-brutal">
        <div className="flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <div>
            <p className="text-lg font-black text-gray-900">
              Analyzing campaign with AI...
            </p>
            <p className="text-sm font-bold text-gray-700">
              AI is reviewing your campaign data and benchmarks
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border-4 border-red-500">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-red-900 mb-2">
              Failed to generate autopsy
            </p>
            <p className="text-sm font-bold text-red-800 mb-4">{error}</p>
            <button
              onClick={generateAutopsy}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!autopsy) {
    return (
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 border-4 border-teal-500 shadow-brutal">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center border-2 border-teal-500">
            <svg
              className="w-8 h-8 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Campaign Intelligence AI
            </h3>
            <p className="text-base font-bold text-gray-700 mb-4">
              Get a comprehensive AI analysis of your campaign with actionable
              insights, brutal honesty, and your exact next steps.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span className="text-sm font-bold text-gray-700">
                  What worked and what didn't (Campaign Autopsy)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span className="text-sm font-bold text-gray-700">
                  Your exact next move with draft pitch email
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span className="text-sm font-bold text-gray-700">
                  Brutal honesty reality check with timeline
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span className="text-sm font-bold text-gray-700">
                  3 quick wins you can do THIS WEEK
                </span>
              </li>
            </ul>
            <button
              onClick={generateAutopsy}
              disabled={loading}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyse This Campaign
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display autopsy sections
  return (
    <div className="space-y-4">
      {/* Campaign Autopsy */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-4 border-teal-500 shadow-brutal">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
            Campaign Autopsy
          </h3>
          <button
            onClick={() => copyToClipboard(autopsy.autopsy, 'autopsy')}
            className="px-3 py-1.5 bg-white/80 hover:bg-white rounded-lg font-bold text-xs transition-colors border-2 border-teal-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
          >
            {copied === 'autopsy' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-base font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
            {autopsy.autopsy}
          </p>
        </div>
      </div>

      {/* Your Next Move */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-4 border-green-500 shadow-brutal">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
            Your Next Move
          </h3>
          <button
            onClick={() => copyToClipboard(autopsy.nextMove, 'nextMove')}
            className="px-3 py-1.5 bg-white/80 hover:bg-white rounded-lg font-bold text-xs transition-colors border-2 border-green-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
          >
            {copied === 'nextMove' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-base font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
            {autopsy.nextMove}
          </p>
        </div>
      </div>

      {/* Brutal Honesty */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-4 border-orange-500 shadow-brutal">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
            Brutal Honesty
          </h3>
          <button
            onClick={() => copyToClipboard(autopsy.brutalHonesty, 'brutal')}
            className="px-3 py-1.5 bg-white/80 hover:bg-white rounded-lg font-bold text-xs transition-colors border-2 border-orange-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
          >
            {copied === 'brutal' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-base font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
            {autopsy.brutalHonesty}
          </p>
        </div>
      </div>

      {/* Quick Wins */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border-4 border-teal-500 shadow-brutal">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
            Quick Wins
          </h3>
          <button
            onClick={() => copyToClipboard(autopsy.quickWins, 'wins')}
            className="px-3 py-1.5 bg-white/80 hover:bg-white rounded-lg font-bold text-xs transition-colors border-2 border-teal-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
          >
            {copied === 'wins' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          <div className="text-base font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
            {autopsy.quickWins}
          </div>
        </div>
      </div>

      {/* Regenerate Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={generateAutopsy}
          className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl font-bold transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Regenerate Autopsy
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
        <p className="text-xs font-bold text-gray-600 text-center">
          This analysis was generated by AI based on your campaign data and UK
          music industry benchmarks. Use it as guidance alongside your own
          experience.
        </p>
      </div>
    </div>
  );
}
