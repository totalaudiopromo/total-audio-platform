// ============================================================================
// INTELLIGENCE BAR - Show personalised patterns prominently
// Audio Intel brutalist design
// ============================================================================

'use client';

import type { Pattern } from '@/lib/types/tracker';

interface IntelligenceBarProps {
  patterns: Pattern[];
}

export function IntelligenceBar({ patterns }: IntelligenceBarProps) {
  if (!patterns || patterns.length === 0) {
    return null;
  }

  // Icon SVG mapping for pattern types
  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'genre_performance':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'platform_effectiveness':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'budget_optimization':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'timing_pattern':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  // Color mapping for pattern types
  const getPatternColor = (type: string) => {
    switch (type) {
      case 'genre_performance':
        return 'bg-purple-50 border-purple-500 text-purple-900';
      case 'platform_effectiveness':
        return 'bg-blue-50 border-blue-500 text-blue-900';
      case 'budget_optimization':
        return 'bg-green-50 border-green-500 text-green-900';
      case 'success':
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'timing_pattern':
        return 'bg-orange-50 border-orange-500 text-orange-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'genre_performance':
        return 'bg-purple-600';
      case 'platform_effectiveness':
        return 'bg-blue-600';
      case 'budget_optimization':
        return 'bg-green-600';
      case 'success':
        return 'bg-yellow-600';
      case 'timing_pattern':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your Campaign Intelligence</h3>
          <p className="text-sm font-bold text-gray-600">Patterns and insights from your data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className={`rounded-xl p-5 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all ${getPatternColor(pattern.type)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 ${getIconBgColor(pattern.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {getPatternIcon(pattern.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black leading-relaxed">{pattern.message}</p>
              </div>
            </div>
            
            {pattern.confidence && (
              <div className="mt-3 pt-3 border-t-2 border-current opacity-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-wider">Confidence</span>
                  <span className="text-xs font-black">{pattern.confidence}%</span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden border-2 border-current">
                  <div
                    className="h-full bg-current rounded-full transition-all"
                    style={{ width: `${pattern.confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {patterns.length === 0 && (
        <div className="text-center py-8">
          <p className="text-base font-bold text-gray-600">
            Complete more campaigns to unlock personalised insights and pattern recognition
          </p>
        </div>
      )}
    </div>
  );
}
