'use client';

import React from 'react';
import { Users, TrendingUp, CheckCircle, XCircle, Sparkles, BarChart3 } from 'lucide-react';
import type { LeadStats as LeadStatsType } from '@/lib/leads/types';

interface LeadStatsProps {
  stats: LeadStatsType;
  compact?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext?: string;
  color?: string;
}

function StatCard({ icon, label, value, subtext, color = '#111111' }: StatCardProps) {
  return (
    <div className="bg-white border border-[#D9D7D2] rounded-xl p-4 hover:border-[#3AA9BE] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-[#FAFAF8] rounded-lg">{icon}</div>
        {subtext && (
          <span className="text-[10px] font-mono text-[#737373] uppercase">{subtext}</span>
        )}
      </div>
      <div className="text-2xl font-mono font-bold" style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs text-[#737373] font-sans mt-1">{label}</div>
    </div>
  );
}

export default function LeadStats({ stats, compact = false }: LeadStatsProps) {
  if (compact) {
    return (
      <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#3AA9BE]" />
          <span className="text-sm font-semibold text-black font-sans">AI Lead Gen</span>
          <span className="text-[10px] font-mono bg-[#F5F5F5] px-2 py-0.5 rounded text-[#737373]">
            BETA
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xl font-mono font-bold text-black">{stats.totalLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans">Total Leads</div>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-[#22C55E]">{stats.highScoreLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans">High Score (80+)</div>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-[#3AA9BE]">{stats.pipelineLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans">In Pipeline</div>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-black">{stats.leadsThisWeek}</div>
            <div className="text-[10px] text-[#737373] font-sans">This Week</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#D9D7D2]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#737373] font-sans">Avg Score</span>
            <span className="text-sm font-mono font-semibold text-black">
              {stats.averageScore}/100
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} className="text-[#3AA9BE]" />}
          label="Total Leads"
          value={stats.totalLeads}
          subtext="All time"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-[#22C55E]" />}
          label="High Score Leads"
          value={stats.highScoreLeads}
          subtext="Score 80+"
          color="#22C55E"
        />
        <StatCard
          icon={<CheckCircle size={20} className="text-[#3AA9BE]" />}
          label="In Pipeline"
          value={stats.pipelineLeads}
          color="#3AA9BE"
        />
        <StatCard
          icon={<BarChart3 size={20} className="text-[#F59E0B]" />}
          label="Average Score"
          value={`${stats.averageScore}/100`}
          color="#F59E0B"
        />
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
        <h4 className="text-sm font-semibold text-black font-sans mb-4">Status Breakdown</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-black">{stats.newLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans uppercase">New</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-[#3AA9BE]">{stats.pipelineLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans uppercase">Pipeline</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-[#22C55E]">{stats.contactedLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans uppercase">Contacted</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-[#737373]">{stats.dismissedLeads}</div>
            <div className="text-[10px] text-[#737373] font-sans uppercase">Dismissed</div>
          </div>
        </div>
      </div>

      {/* Source Distribution */}
      <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
        <h4 className="text-sm font-semibold text-black font-sans mb-4">Leads by Source</h4>
        <div className="space-y-3">
          {Object.entries(stats.leadsBySource).map(([source, count]) => {
            const percentage = Math.round((count / stats.totalLeads) * 100);
            const displayName = source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return (
              <div key={source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-sans text-black">{displayName}</span>
                  <span className="text-xs font-mono text-[#737373]">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3AA9BE] rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
