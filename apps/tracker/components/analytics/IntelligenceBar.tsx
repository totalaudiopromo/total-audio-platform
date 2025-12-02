'use client';

import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap,
  Target,
  Clock,
} from 'lucide-react';

// ========================================
// Types
// ========================================

export interface Pattern {
  id: string;
  type: 'timing' | 'platform' | 'response' | 'budget' | 'trend';
  title: string;
  description: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  metric?: number;
  metricLabel?: string;
}

export interface IntelligenceBarProps {
  patterns: Pattern[];
}

// ========================================
// Helper Functions
// ========================================

const getIcon = (type: Pattern['type'], sentiment: Pattern['sentiment']) => {
  const iconClass = 'w-5 h-5 text-white';
  switch (type) {
    case 'timing':
      return <Clock className={iconClass} />;
    case 'platform':
      return <Target className={iconClass} />;
    case 'response':
      return sentiment === 'positive' ? (
        <TrendingUp className={iconClass} />
      ) : (
        <TrendingDown className={iconClass} />
      );
    case 'budget':
      return <Zap className={iconClass} />;
    case 'trend':
      return sentiment === 'positive' ? (
        <TrendingUp className={iconClass} />
      ) : (
        <TrendingDown className={iconClass} />
      );
    default:
      return <AlertCircle className={iconClass} />;
  }
};

const getSentimentStyles = (sentiment: Pattern['sentiment']) => {
  switch (sentiment) {
    case 'positive':
      return {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        iconBg: 'bg-teal-600',
      };
    case 'negative':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-600',
      };
    case 'neutral':
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        iconBg: 'bg-gray-600',
      };
  }
};

// ========================================
// Component
// ========================================

export function IntelligenceBar({ patterns }: IntelligenceBarProps) {
  if (!patterns || patterns.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        role="region"
        aria-label="Campaign insights"
      >
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">
          Your Insights
        </h3>
        <p className="text-gray-500 font-medium">
          Add campaigns to see your performance patterns
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      role="region"
      aria-label="Campaign insights"
    >
      <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">
        Your Insights ({patterns.length})
      </h3>
      <div className="space-y-3" role="list" aria-label="Performance patterns">
        {patterns.map(pattern => {
          const styles = getSentimentStyles(pattern.sentiment);
          return (
            <div
              key={pattern.id}
              className={`flex items-center gap-4 p-4 ${styles.bg} rounded-xl border-2 ${styles.border}`}
              role="listitem"
            >
              <div
                className={`w-10 h-10 ${styles.iconBg} rounded-xl flex items-center justify-center border-2 border-black flex-shrink-0`}
                aria-hidden="true"
              >
                {getIcon(pattern.type, pattern.sentiment)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900">
                  {pattern.title}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  {pattern.description}
                </p>
              </div>
              {pattern.metric !== undefined && pattern.metricLabel && (
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-gray-900">
                    {pattern.metric}%
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {pattern.metricLabel}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
