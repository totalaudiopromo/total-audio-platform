'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FolderOpen, Download, Eye } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import PortalNav from '@/components/portal/PortalNav';
import Loading from '@/components/Loading';
import AssetSlideover from '@/components/AssetSlideover';
import { fetchArtistBySlug, fetchArtistCampaigns, type PortalArtist } from '@/lib/api/portal';
import { fetchAssetsForCampaign } from '@/lib/api/drive';
import type { DriveAsset } from '@/lib/types';

export default function AssetsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artist, setArtist] = useState<PortalArtist | null>(null);
  const [assets, setAssets] = useState<DriveAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<DriveAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const artistData = await fetchArtistBySlug(slug);
        if (!artistData) {
          window.location.href = '/artist/login';
          return;
        }
        if (active) setArtist(artistData);

        const campaigns = await fetchArtistCampaigns(artistData.name);
        if (campaigns.length > 0) {
          const campaignAssets = await fetchAssetsForCampaign(campaigns[0].id);
          if (active) setAssets(campaignAssets);
        }
      } catch (err) {
        console.error('[Portal] Failed to load assets', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading || !artist) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <Loading message="Loading assets…" />
      </div>
    );
  }

  const getFileIcon = (type: string) => {
    const iconClass = 'w-8 h-8';
    switch (type) {
      case 'pdf':
        return <div className={`${iconClass} text-red-500`}>📄</div>;
      case 'jpg':
      case 'png':
        return <div className={`${iconClass} text-blue-500`}>🖼️</div>;
      case 'doc':
      case 'docx':
        return <div className={`${iconClass} text-blue-600`}>📝</div>;
      default:
        return <div className={`${iconClass} text-[#737373]`}>📁</div>;
    }
  };

  const getStatusBadge = (assetId: string) => {
    // Mock status logic
    const num = parseInt(assetId.replace(/\D/g, '') || '0');
    if (num % 3 === 0)
      return {
        label: 'Used in Press Kit',
        color: 'bg-tap-good/10 text-tap-good border border-tap-good/20',
      };
    if (num % 5 === 0)
      return { label: 'Reviewed ✓', color: 'bg-tap-crm/10 text-tap-crm border border-tap-crm/20' };
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} />
      <PortalNav artistSlug={slug} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="liberty-heading text-4xl mb-3">Campaign Assets</h1>
          <p className="liberty-body text-lg text-[#737373]">
            Browse and download all assets related to your campaign.
          </p>
        </div>

        {/* Assets Grid */}
        {assets.length === 0 ? (
          <div className="liberty-card p-12 text-center">
            <FolderOpen className="w-12 h-12 text-[#D9D7D2] mx-auto mb-4" />
            <p className="text-[#737373]">No assets available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map(asset => {
              const status = getStatusBadge(asset.id);
              return (
                <div
                  key={asset.id}
                  className="liberty-card cursor-pointer group hover:border-[#111] transition-all"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex items-start justify-between mb-4">
                    {getFileIcon(asset.type)}
                    <span className="liberty-metadata text-[10px] normal-case uppercase">
                      {asset.type}
                    </span>
                  </div>

                  <h3 className="text-base font-jakarta font-semibold text-[#111] mb-2 line-clamp-2 group-hover:text-tap-accent-radio transition-colors">
                    {asset.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="liberty-metadata text-[11px] normal-case">{asset.folder}</p>
                    <p className="liberty-metadata text-[11px]">
                      {asset.sizeKB < 1024
                        ? `${asset.sizeKB} KB`
                        : `${(asset.sizeKB / 1024).toFixed(1)} MB`}
                    </p>
                  </div>

                  {status && (
                    <div className="mb-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-[#D9D7D2]">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#111] text-white rounded-md hover:bg-black transition-colors text-sm font-medium">
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                    <button className="px-3 py-2 bg-[#F7F6F2] text-[#111] rounded-md hover:bg-[#FAFAF8] transition-colors border border-[#D9D7D2]">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Asset Detail Slideover */}
      {selectedAsset && (
        <AssetSlideover
          asset={selectedAsset}
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
}
