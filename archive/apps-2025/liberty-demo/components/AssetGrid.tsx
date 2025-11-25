'use client';

import React from 'react';
import AssetCard from './AssetCard';
import type { DriveAsset } from '@/lib/types';

interface AssetGridProps {
  assets: DriveAsset[];
  onAssetClick: (asset: DriveAsset) => void;
  loading?: boolean;
}

const AssetGrid: React.FC<AssetGridProps> = ({ assets, onAssetClick, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-tap-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-tap-muted font-heading font-normal tracking-tight italic">
            Loading assets…
          </p>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="font-heading font-normal tracking-tight text-lg text-tap-muted mb-2">
          No assets found
        </p>
        <p className="font-mono text-sm text-tap-muted/70">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map(asset => (
        <AssetCard key={asset.id} asset={asset} onClick={() => onAssetClick(asset)} />
      ))}
    </div>
  );
};

export default AssetGrid;
