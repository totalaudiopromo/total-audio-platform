'use client';

import { useState, useMemo } from 'react';
import {
  CampaignTableHeader,
  SortConfig,
  SortField,
} from './CampaignTableHeader';
import { CampaignTableRow } from './CampaignTableRow';
import type { Campaign } from '@/lib/types/tracker';

interface CampaignTableProps {
  campaigns: (Campaign & { insights?: string[] })[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCampaignClick: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onCampaignClick,
}: CampaignTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Sort campaigns
  const sortedCampaigns = useMemo(() => {
    if (!sortConfig) return campaigns;

    return [...campaigns].sort((a, b) => {
      const { field, direction } = sortConfig;
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'artist_name':
          aValue = (a.artist_name || '').toLowerCase();
          bValue = (b.artist_name || '').toLowerCase();
          break;
        case 'platform':
          aValue = a.platform || '';
          bValue = b.platform || '';
          break;
        case 'status':
          const statusOrder = {
            planning: 0,
            active: 1,
            completed: 2,
            archived: 3,
          };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        case 'performance_score':
          aValue = a.performance_score;
          bValue = b.performance_score;
          break;
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'success_rate':
          aValue = a.success_rate;
          bValue = b.success_rate;
          break;
        case 'start_date':
          aValue = a.start_date ? new Date(a.start_date).getTime() : 0;
          bValue = b.start_date ? new Date(b.start_date).getTime() : 0;
          break;
        case 'client_name':
          aValue = ((a as any).client_name || '').toLowerCase();
          bValue = ((b as any).client_name || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [campaigns, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => {
      if (current?.field === field) {
        // Toggle direction or clear
        if (current.direction === 'asc') {
          return { field, direction: 'desc' };
        }
        return null; // Clear sort
      }
      return { field, direction: 'asc' };
    });
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === campaigns.length) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const allSelected =
    selectedIds.length === campaigns.length && campaigns.length > 0;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < campaigns.length;

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-12 text-center">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No campaigns yet
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Click the "+ New Campaign" button above to create your first campaign
          and start tracking your radio, playlist, or press outreach.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <CampaignTableHeader
            sortConfig={sortConfig}
            onSort={handleSort}
            onSelectAll={handleSelectAllToggle}
            allSelected={allSelected}
            someSelected={someSelected}
          />
          <tbody className="divide-y-2 divide-black">
            {sortedCampaigns.map((campaign, index) => (
              <CampaignTableRow
                key={campaign.id}
                campaign={campaign}
                index={index}
                isSelected={selectedIds.includes(campaign.id)}
                onToggleSelect={onToggleSelect}
                onRowClick={onCampaignClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table footer with count */}
      <div className="px-4 py-3 bg-gray-50 border-t-2 border-black">
        <p className="text-sm font-bold text-gray-600">
          {selectedIds.length > 0 ? (
            <>
              {selectedIds.length} of {campaigns.length} campaigns selected
            </>
          ) : (
            <>
              {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
