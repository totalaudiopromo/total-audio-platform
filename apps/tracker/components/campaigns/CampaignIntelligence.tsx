'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface CampaignIntelligenceProps {
  campaignId: string;
  campaignName: string;
}

export function CampaignIntelligence({ campaignId, campaignName }: CampaignIntelligenceProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCompaign = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/analyze`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze campaign');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!analysis ? (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-4 border-purple-500 shadow-brutal">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-purple-500">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-2">🤖 Campaign Intelligence AI</h3>
              <p className="text-base font-bold text-gray-700 mb-4">
                Get a comprehensive AI analysis of your campaign with actionable insights, brutal honesty, and your exact next steps.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-black">✓</span>
                  <span className="text-sm font-bold text-gray-700">What worked and what didn't (Campaign Autopsy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-black">✓</span>
                  <span className="text-sm font-bold text-gray-700">Your exact next move with draft pitch email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-black">✓</span>
                  <span className="text-sm font-bold text-gray-700">Brutal honesty reality check with timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-black">✓</span>
                  <span className="text-sm font-bold text-gray-700">3 quick wins you can do THIS WEEK</span>
                </li>
              </ul>
              <button
                onClick={analyzeCompaign}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Campaign...
                  </span>
                ) : (
                  '🚀 Analyze This Campaign'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border-4 border-black shadow-brutal">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-gray-900">🤖 Campaign Intelligence Report</h3>
            <button
              onClick={() => setAnalysis(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm"
            >
              ← Back
            </button>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="campaign-intelligence-content space-y-6">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4 pb-3 border-b-4 border-purple-200">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-xl font-black text-gray-900 mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-lg font-black text-gray-800 mt-4 mb-2">
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 my-4">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-black mt-1">•</span>
                      <span className="flex-1 font-medium text-gray-700">{children}</span>
                    </li>
                  ),
                  p: ({ children }) => (
                    <p className="text-base font-medium text-gray-700 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-black text-gray-900">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm border border-gray-300">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic bg-purple-50 py-3 px-4 rounded-r-lg my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-sm font-bold text-gray-600 text-center">
              💡 This analysis was generated by AI based on your campaign data and UK music industry knowledge.
              Use it as guidance alongside your own experience.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
          <p className="text-sm font-bold text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
