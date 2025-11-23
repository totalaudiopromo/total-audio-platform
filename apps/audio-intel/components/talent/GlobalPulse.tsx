/**
 * GlobalPulse - Summary stats from talent radar pulse
 */

import React from 'react';
import { TrendArrow } from '../ui/TrendArrow';

interface GlobalPulseProps {
  summary: {
    totalArtistsTracked: number;
    avgMomentum: number;
    highBreakoutCount: number;
    highRiskCount: number;
  };
}

export function GlobalPulse({ summary }: GlobalPulseProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#161A21] border border-white/[0.06] rounded-2xl p-6">
        <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Artists Tracked
        </div>
        <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {summary.totalArtistsTracked.toLocaleString()}
        </div>
        <TrendArrow direction="up" value={18} />
      </div>

      <div className="bg-[#161A21] border border-white/[0.06] rounded-2xl p-6">
        <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Avg Momentum
        </div>
        <div className="text-3xl font-bold text-[#3AA9BE] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {Math.round(summary.avgMomentum)}
        </div>
        <div className="text-slate-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          /100
        </div>
      </div>

      <div className="bg-[#161A21] border border-white/[0.06] rounded-2xl p-6">
        <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Breakout Candidates
        </div>
        <div className="text-3xl font-bold text-[#E4B75F] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {summary.highBreakoutCount}
        </div>
        <div className="text-slate-400 text-sm">
          High potential
        </div>
      </div>

      <div className="bg-[#161A21] border border-white/[0.06] rounded-2xl p-6">
        <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Artists at Risk
        </div>
        <div className="text-3xl font-bold text-[#D96A6A] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {summary.highRiskCount}
        </div>
        <div className="text-slate-400 text-sm">
          Needs attention
        </div>
      </div>
    </div>
  );
}
