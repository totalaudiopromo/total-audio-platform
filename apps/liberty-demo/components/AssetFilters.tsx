'use client';

import React from 'react';
import { CAMPAIGNS } from '@/lib/constants';
import type { DriveAsset } from '@/lib/types';

interface AssetFiltersProps {
  selectedCampaignId: string | null;
  selectedFileType: string | null;
  onCampaignChange: (campaignId: string | null) => void;
  onFileTypeChange: (fileType: string | null) => void;
  assets: DriveAsset[];
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  selectedCampaignId,
  selectedFileType,
  onCampaignChange,
  onFileTypeChange,
  assets,
}) => {
  // Get unique file types from assets
  const fileTypes = React.useMemo(() => {
    const types = new Set(assets.map(asset => asset.type));
    return Array.from(types).sort();
  }, [assets]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      {/* Campaign Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-tap-muted uppercase tracking-wider font-medium font-mono">
          Campaign:
        </label>
        <select
          value={selectedCampaignId || ''}
          onChange={e => onCampaignChange(e.target.value || null)}
          className="px-3 py-2 bg-tap-panel border border-tap-line rounded-md text-sm text-tap-text focus:outline-none focus:border-tap-accent transition-colors font-mono"
        >
          <option value="">All Campaigns</option>
          {CAMPAIGNS.map(campaign => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.title}
            </option>
          ))}
        </select>
      </div>

      {/* File Type Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-tap-muted uppercase tracking-wider font-medium font-mono">
          Type:
        </label>
        <select
          value={selectedFileType || ''}
          onChange={e => onFileTypeChange(e.target.value || null)}
          className="px-3 py-2 bg-tap-panel border border-tap-line rounded-md text-sm text-tap-text focus:outline-none focus:border-tap-accent transition-colors font-mono"
        >
          <option value="">All Types</option>
          {fileTypes.map(type => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AssetFilters;
