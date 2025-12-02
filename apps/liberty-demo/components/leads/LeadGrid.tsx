'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Grid3X3, List, RefreshCw } from 'lucide-react';
import LeadCard from './LeadCard';
import LeadFilters from './LeadFilters';
import type { Lead, LeadStatus, LeadSourceType } from '@/lib/leads/types';

interface LeadGridProps {
  leads: Lead[];
  onAddToPipeline: (id: string) => void;
  onDismiss: (id: string) => void;
  onViewProfile: (id: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

type SortOption = 'score' | 'createdAt' | 'upcomingReleaseDate' | 'spotifyMonthlyListeners';
type ViewMode = 'grid' | 'list';

export default function LeadGrid({
  leads,
  onAddToPipeline,
  onDismiss,
  onViewProfile,
  onRefresh,
  loading = false,
}: LeadGridProps) {
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [sourceType, setSourceType] = useState<LeadSourceType | 'all'>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Apply filters
    if (status !== 'all') {
      result = result.filter(l => l.status === status);
    }
    if (sourceType !== 'all') {
      result = result.filter(l => l.sourceType === sourceType);
    }
    if (minScore > 0) {
      result = result.filter(l => l.score >= minScore);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'score':
          comparison = (b.score ?? 0) - (a.score ?? 0);
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'upcomingReleaseDate':
          const dateA = a.upcomingReleaseDate
            ? new Date(a.upcomingReleaseDate).getTime()
            : Infinity;
          const dateB = b.upcomingReleaseDate
            ? new Date(b.upcomingReleaseDate).getTime()
            : Infinity;
          comparison = dateA - dateB;
          break;
        case 'spotifyMonthlyListeners':
          comparison = (b.spotifyMonthlyListeners ?? 0) - (a.spotifyMonthlyListeners ?? 0);
          break;
      }

      return sortAsc ? -comparison : comparison;
    });

    return result;
  }, [leads, status, sourceType, minScore, sortBy, sortAsc]);

  const handleClearFilters = () => {
    setStatus('all');
    setSourceType('all');
    setMinScore(0);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(false);
    }
  };

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'score', label: 'Score' },
    { value: 'createdAt', label: 'Date Added' },
    { value: 'upcomingReleaseDate', label: 'Release Date' },
    { value: 'spotifyMonthlyListeners', label: 'Listeners' },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <LeadFilters
        status={status}
        sourceType={sourceType}
        minScore={minScore}
        onStatusChange={setStatus}
        onSourceTypeChange={setSourceType}
        onMinScoreChange={setMinScore}
        onClearFilters={handleClearFilters}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#737373] font-sans">
            {filteredAndSortedLeads.length} lead{filteredAndSortedLeads.length !== 1 ? 's' : ''}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={`text-[#737373] ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#737373]">Sort</span>
            <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleSort(opt.value)}
                  className={`
                    px-3 py-1 text-xs font-sans rounded transition-colors flex items-center gap-1
                    ${
                      sortBy === opt.value
                        ? 'bg-white text-black shadow-sm'
                        : 'text-[#737373] hover:text-black'
                    }
                  `}
                >
                  {opt.label}
                  {sortBy === opt.value && (
                    <ArrowUpDown size={12} className={sortAsc ? 'rotate-180' : ''} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-1.5 rounded transition-colors
                ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-[#737373] hover:text-black'}
              `}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-1.5 rounded transition-colors
                ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-[#737373] hover:text-black'}
              `}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Lead Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#D9D7D2] border-t-[#3AA9BE] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#737373] font-sans">Loading leads...</p>
          </div>
        </div>
      ) : filteredAndSortedLeads.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-[#737373] font-sans mb-2">No leads match your filters</p>
            <button
              onClick={handleClearFilters}
              className="text-sm text-[#3AA9BE] hover:underline font-sans"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredAndSortedLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onAddToPipeline={onAddToPipeline}
              onDismiss={onDismiss}
              onViewProfile={onViewProfile}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
