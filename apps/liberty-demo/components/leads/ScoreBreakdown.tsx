'use client';

import React from 'react';
import { Calendar, TrendingUp, Music2, UserCheck } from 'lucide-react';
import type { ScoreBreakdown as ScoreBreakdownType } from '@/lib/leads/types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
  totalScore: number;
}

const CATEGORIES = [
  {
    key: 'timing' as const,
    label: 'Timing',
    icon: Calendar,
    description: 'Release date proximity',
    color: '#F59E0B',
  },
  {
    key: 'momentum' as const,
    label: 'Momentum',
    icon: TrendingUp,
    description: 'Growth & streaming',
    color: '#22C55E',
  },
  {
    key: 'fit' as const,
    label: 'Fit',
    icon: Music2,
    description: 'Genre & location',
    color: '#3AA9BE',
  },
  {
    key: 'availability' as const,
    label: 'Availability',
    icon: UserCheck,
    description: 'PR representation',
    color: '#A855F7',
  },
];

export default function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  return (
    <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-black font-sans">Score Breakdown</h4>
        <div className="text-right">
          <span className="text-2xl font-mono font-bold text-black">{totalScore}</span>
          <span className="text-sm font-mono text-[#737373]">/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(category => {
          const value = breakdown[category.key];
          const percentage = (value / 25) * 100;
          const Icon = category.icon;

          return (
            <div key={category.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded" style={{ backgroundColor: `${category.color}15` }}>
                    <Icon size={14} style={{ color: category.color }} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-black font-sans">
                      {category.label}
                    </span>
                    <span className="text-[10px] text-[#737373] font-sans ml-2">
                      {category.description}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-mono font-semibold" style={{ color: category.color }}>
                  {value}/25
                </span>
              </div>
              <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
