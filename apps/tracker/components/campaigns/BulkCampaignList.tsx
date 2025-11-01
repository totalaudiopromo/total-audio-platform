'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SelectableCampaignCard } from './SelectableCampaignCard';
import { BulkActionsBar } from './BulkActionsBar';
import { CheckSquare } from 'lucide-react';
import type { Campaign } from '@/lib/types/tracker';

interface BulkCampaignListProps {
  campaigns: (Campaign & { insights?: string[] })[];
  integrations?: any[];
}

export function BulkCampaignList({
  campaigns,
  integrations = [],
}: BulkCampaignListProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(campaigns.map(c => c.id));
  }, [campaigns]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, []);

  const handleBulkComplete = useCallback(async () => {
    const response = await fetch('/api/campaigns/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignIds: selectedIds,
        updates: { status: 'completed' },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update campaigns');
    }

    return Promise.resolve();
  }, [selectedIds]);

  const handleEnableSelection = () => {
    setIsSelectionMode(true);
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16">
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
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Click the "+ New Campaign" button above to create your first campaign
          and start tracking your radio, playlist, or press outreach.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Enable Selection Button */}
      {!isSelectionMode && campaigns.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleEnableSelection}
            className="px-4 py-2 bg-white text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all border-2 border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            Select Multiple
          </button>
        </div>
      )}

      {/* Campaign Cards */}
      <div className="space-y-6">
        {campaigns.map(campaign => (
          <SelectableCampaignCard
            key={campaign.id}
            campaign={campaign}
            integrations={integrations}
            isSelected={selectedIds.includes(campaign.id)}
            isSelectionMode={isSelectionMode}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedIds={selectedIds}
        totalCount={campaigns.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkComplete={handleBulkComplete}
      />
    </>
  );
}
