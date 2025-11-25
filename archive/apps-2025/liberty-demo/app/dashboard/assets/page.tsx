'use client';

import { useState, useEffect } from 'react';
import { Search, Tag } from 'lucide-react';
import {
  fetchAllAssets,
  fetchAssetsForCampaign,
  searchAssets,
  fetchAssetTags,
} from '@/lib/api/drive';
import AssetFilters from '@/components/AssetFilters';
import AssetGrid from '@/components/AssetGrid';
import AssetSlideover from '@/components/AssetSlideover';
import type { DriveAsset } from '@/lib/types';

export default function AssetsPage() {
  const [assets, setAssets] = useState<DriveAsset[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewAsset, setPreviewAsset] = useState<DriveAsset | null>(null);

  // Load assets based on filters
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        let results: DriveAsset[] = [];

        if (searchQuery.trim()) {
          results = await searchAssets(searchQuery);
        } else if (selectedCampaignId) {
          results = await fetchAssetsForCampaign(selectedCampaignId);
        } else {
          results = await fetchAllAssets();
        }

        // Apply file type filter
        if (selectedFileType) {
          results = results.filter(asset => asset.type === selectedFileType);
        }

        // Apply tag filter (mock logic - matching fetchAssetTags logic)
        if (selectedTag) {
          results = results.filter(asset => {
            const name = asset.name.toLowerCase();
            const folder = asset.folder.toLowerCase();

            if (
              selectedTag === 'Press Shot' &&
              (folder.includes('press') || name.includes('press'))
            )
              return true;
            if (selectedTag === 'Logo' && (folder.includes('logo') || name.includes('logo')))
              return true;
            if (selectedTag === 'Artwork' && (folder.includes('artwork') || name.includes('cover')))
              return true;
            if (selectedTag === 'Live' && name.includes('live')) return true;
            if (selectedTag === 'Bio' && (name.includes('bio') || name.includes('one-sheet')))
              return true;
            if (selectedTag === 'Lyrics' && name.includes('lyric')) return true;
            if (selectedTag === 'EPK' && name.includes('epk')) return true;
            return false;
          });
        }

        setAssets(results);
      } catch (err) {
        console.error('Failed to load assets:', err);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [selectedCampaignId, selectedFileType, searchQuery, selectedTag]);

  // Load tags
  useEffect(() => {
    fetchAssetTags().then(setAvailableTags);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-normal text-4xl tracking-tight text-tap-text mb-2">
          Asset Hub
        </h1>
        <p className="text-tap-muted text-sm">
          Browse and manage campaign assets across all folders
        </p>
      </div>

      {/* Filters */}
      <AssetFilters
        selectedCampaignId={selectedCampaignId}
        selectedFileType={selectedFileType}
        onCampaignChange={setSelectedCampaignId}
        onFileTypeChange={setSelectedFileType}
        assets={assets}
      />

      {/* Tag Filter Bar */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1 text-tap-muted text-xs uppercase tracking-wide mr-2">
            <Tag size={12} />
            <span>Filter by Tag:</span>
          </div>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              selectedTag === null
                ? 'bg-tap-text text-white border-tap-text'
                : 'bg-white text-tap-muted border-tap-line hover:border-tap-accent'
            }`}
          >
            All
          </button>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                selectedTag === tag
                  ? 'bg-tap-text text-white border-tap-text'
                  : 'bg-white text-tap-muted border-tap-line hover:border-tap-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tap-muted" />
        <input
          type="text"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-tap-panel border border-tap-line rounded-md font-mono text-sm focus:outline-none focus:border-tap-accent transition-all text-tap-text"
        />
      </div>

      {/* Assets Grid */}
      <AssetGrid assets={assets} onAssetClick={setPreviewAsset} loading={loading} />

      {/* Asset Slideover */}
      <AssetSlideover
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
      />
    </div>
  );
}
