'use client';

import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { LeadStatus, LeadSourceType } from '@/lib/leads/types';

interface LeadFiltersProps {
  status: LeadStatus | 'all';
  sourceType: LeadSourceType | 'all';
  minScore: number;
  onStatusChange: (status: LeadStatus | 'all') => void;
  onSourceTypeChange: (sourceType: LeadSourceType | 'all') => void;
  onMinScoreChange: (minScore: number) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'dismissed', label: 'Dismissed' },
];

const SOURCE_OPTIONS: { value: LeadSourceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'hype_machine', label: 'Hype Machine' },
  { value: 'bandcamp', label: 'Bandcamp' },
  { value: 'spotify_playlist', label: 'Spotify Playlist' },
  { value: 'submithub', label: 'SubmitHub' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'youtube_music', label: 'YouTube Music' },
];

const SCORE_OPTIONS = [
  { value: 0, label: 'All Scores' },
  { value: 50, label: '50+ Fair' },
  { value: 70, label: '70+ Good' },
  { value: 85, label: '85+ Excellent' },
];

export default function LeadFilters({
  status,
  sourceType,
  minScore,
  onStatusChange,
  onSourceTypeChange,
  onMinScoreChange,
  onClearFilters,
}: LeadFiltersProps) {
  const hasActiveFilters = status !== 'all' || sourceType !== 'all' || minScore > 0;

  return (
    <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#737373]" />
          <span className="text-sm font-semibold text-black font-sans">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-[#737373] hover:text-[#DC2626] transition-colors"
          >
            <X size={12} />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block mb-1.5">
            Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={e => onStatusChange(e.target.value as LeadStatus | 'all')}
              className="w-full appearance-none bg-[#FAFAF8] border border-[#D9D7D2] rounded-lg px-3 py-2 text-sm font-sans text-black focus:outline-none focus:border-[#3AA9BE] cursor-pointer"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            />
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block mb-1.5">
            Source
          </label>
          <div className="relative">
            <select
              value={sourceType}
              onChange={e => onSourceTypeChange(e.target.value as LeadSourceType | 'all')}
              className="w-full appearance-none bg-[#FAFAF8] border border-[#D9D7D2] rounded-lg px-3 py-2 text-sm font-sans text-black focus:outline-none focus:border-[#3AA9BE] cursor-pointer"
            >
              {SOURCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            />
          </div>
        </div>

        {/* Score Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block mb-1.5">
            Min Score
          </label>
          <div className="relative">
            <select
              value={minScore}
              onChange={e => onMinScoreChange(Number(e.target.value))}
              className="w-full appearance-none bg-[#FAFAF8] border border-[#D9D7D2] rounded-lg px-3 py-2 text-sm font-sans text-black focus:outline-none focus:border-[#3AA9BE] cursor-pointer"
            >
              {SCORE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
