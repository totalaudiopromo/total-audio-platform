'use client';

/**
 * InsightCard Component
 * Displays coaching insights
 */

import React from 'react';

interface InsightCardProps {
  insight: {
    id: string;
    insight_type: string;
    content: {
      summary: string;
      detail: string;
      actionable_steps?: string[];
      priority?: 'low' | 'medium' | 'high';
    };
    created_at: string;
  };
}

const PRIORITY_STYLES = {
  low: 'border-blue-500/30 bg-blue-500/10',
  medium: 'border-yellow-500/30 bg-yellow-500/10',
  high: 'border-red-500/30 bg-red-500/10',
};

const TYPE_ICONS: Record<string, string> = {
  career: '🎯',
  creative: '🎨',
  industry: '📊',
  branding: '✨',
  growth: '📈',
  scene: '🌐',
  relationship: '🤝',
  release: '🚀',
  promotional: '📣',
};

export function InsightCard({ insight }: InsightCardProps) {
  const priority = insight.content.priority || 'medium';

  return (
    <div
      className={`
        border rounded-xl p-4
        transition-all duration-240 ease-out
        ${PRIORITY_STYLES[priority]}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {TYPE_ICONS[insight.insight_type] || '💡'}
          </span>
          <div>
            <span className="text-xs text-[#3AA9BE] uppercase tracking-wide block">
              {insight.insight_type}
            </span>
            <span className="text-xs text-white/40">
              {new Date(insight.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {priority === 'high' && (
          <span className="text-xs text-red-400 font-medium">● HIGH</span>
        )}
      </div>

      {/* Summary */}
      <h4 className="text-white/90 font-medium mb-2">{insight.content.summary}</h4>

      {/* Detail */}
      <p className="text-sm text-white/70 leading-relaxed mb-3">
        {insight.content.detail}
      </p>

      {/* Actionable Steps */}
      {insight.content.actionable_steps && insight.content.actionable_steps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/50 mb-2">Actionable steps:</p>
          <ul className="space-y-1">
            {insight.content.actionable_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-[#3AA9BE] mt-0.5">→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
