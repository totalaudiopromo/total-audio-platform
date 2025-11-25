'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Download,
  FileText,
  Image as ImageIcon,
  Music,
  ArrowLeft,
  Monitor,
  Smartphone,
  Check,
} from 'lucide-react';
import { generatePressKitForCampaign, exportPressKitPdf } from '@/lib/api/pressKit';
import { fetchAssetById } from '@/lib/api/drive';
import { ARTISTS } from '@/lib/constants';
import type { PressKit } from '@/lib/pressKitModel';
import type { DriveAsset } from '@/lib/types';
import Loading from '@/components/Loading';

export default function PressKitPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.campaignId as string | undefined;

  const [pressKit, setPressKit] = useState<PressKit | null>(null);
  const [assets, setAssets] = useState<DriveAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    let active = true;
    (async () => {
      if (!campaignId) return;

      try {
        const kit = await generatePressKitForCampaign(campaignId);
        if (active) {
          setPressKit(kit);

          // Fetch all assets referenced in the kit
          const assetIds = [
            kit.primaryPressReleaseAssetId,
            ...(kit.artworkAssetIds || []),
            ...(kit.photoAssetIds || []),
          ].filter(Boolean) as string[];

          const assetPromises = assetIds.map(id => fetchAssetById(id));
          const fetchedAssets = await Promise.all(assetPromises);
          setAssets(fetchedAssets.filter(a => a !== null) as DriveAsset[]);
        }
      } catch (err) {
        console.warn('[Press Kit] Failed to load press kit', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [campaignId]);

  const handleExportClick = async (type: string) => {
    if (!pressKit) return;

    if (type === 'pdf') {
      setExporting(true);
      try {
        // In a real app, we'd wait for the URL. For the demo, we'll simulate the delay then print.
        await exportPressKitPdf(pressKit.id);
        window.print();
      } catch (e) {
        console.error(e);
      } finally {
        setExporting(false);
      }
    } else {
      // Zip export simulation
      setExporting(true);
      setTimeout(() => setExporting(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tap-bg flex items-center justify-center">
        <Loading message="Loading press kit…" />
      </div>
    );
  }

  if (!pressKit || pressKit.sections.length === 0) {
    return (
      <div className="min-h-screen bg-tap-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text mb-3">
            No Press Kit Available
          </h2>
          <p className="text-sm text-tap-muted mb-6">
            Press kit will appear once a press release and assets are added to the campaign.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-tap-accent text-white rounded-md hover:bg-tap-accent/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const artist = ARTISTS[pressKit.artistId];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'jpg':
      case 'png':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (sizeKB: number) => {
    if (sizeKB < 1024) return `${sizeKB} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-tap-bg print:bg-white">
      {/* Header - Hidden in print */}
      <header className="bg-tap-panel border-b border-tap-line px-6 py-4 sticky top-0 z-20 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-tap-bg rounded-md transition-colors"
            >
              <ArrowLeft size={20} className="text-tap-muted" />
            </button>
            <div>
              <h1 className="font-heading font-normal text-4xl tracking-tight text-tap-text">
                Press Kit
              </h1>
              <p className="text-xs text-tap-muted font-mono">Campaign {campaignId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-tap-bg rounded-lg p-1 border border-tap-line">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-tap-accent' : 'text-tap-muted hover:text-tap-text'}`}
                title="Desktop View"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-tap-accent' : 'text-tap-muted hover:text-tap-text'}`}
                title="Mobile View"
              >
                <Smartphone size={16} />
              </button>
            </div>

            {/* Export buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportClick('pdf')}
                disabled={exporting}
                className="px-3 py-2 bg-tap-bg border border-tap-line text-tap-text rounded-md hover:bg-tap-panel transition-colors flex items-center space-x-2 text-sm disabled:opacity-50"
              >
                {exporting ? <Loading size="sm" /> : <Download size={16} />}
                <span>{exporting ? 'Generating...' : 'Export PDF'}</span>
              </button>
              <button
                onClick={() => handleExportClick('zip')}
                className="px-3 py-2 bg-tap-accent text-white rounded-md hover:bg-tap-accent/90 transition-colors flex items-center space-x-2 text-sm"
              >
                <Download size={16} />
                <span>Download Assets ZIP</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div
        className={`mx-auto p-6 md:p-8 transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-7xl'}`}
      >
        <div
          className={`grid gap-8 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}
        >
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <section className="bg-tap-panel rounded-lg border border-tap-line p-8 print:border-none print:p-0">
              <h1 className="text-4xl font-heading font-normal tracking-tight text-tap-text mb-2 leading-tight">
                {pressKit.title}
              </h1>
              {pressKit.tagline && (
                <p className="text-lg text-tap-muted font-medium mb-4">{pressKit.tagline}</p>
              )}
              <p className="text-xs text-tap-muted font-mono">
                Generated{' '}
                {new Date(pressKit.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </section>

            {/* Render all sections */}
            {pressKit.sections.map(section => (
              <section
                key={section.id}
                className="bg-tap-panel rounded-lg border border-tap-line p-6 print:break-inside-avoid print:border-none print:p-0 print:mb-8"
              >
                <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text mb-4 pb-2 border-b border-tap-line">
                  {section.title}
                </h2>

                {section.body && (
                  <p className="text-sm leading-relaxed text-tap-text/90 font-heading font-normal tracking-tight mb-4">
                    {section.body}
                  </p>
                )}

                {section.id === 'campaign-momentum' &&
                section.bullets &&
                section.bullets.length > 0 ? (
                  // Special rendering for Momentum
                  <div className="grid grid-cols-1 gap-3">
                    {section.bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-tap-bg/50 rounded-lg border border-tap-line/50"
                      >
                        <div className="mt-0.5 p-1 bg-tap-accent/10 rounded-full">
                          <Check className="w-3 h-3 text-tap-accent" />
                        </div>
                        <span className="text-sm font-medium text-tap-text">{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  section.bullets &&
                  section.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {section.id === 'suggested-quotes' ? (
                        // Render quotes as blockquotes
                        section.bullets.map((bullet, idx) => (
                          <li key={idx}>
                            <blockquote className="pl-4 border-l-2 border-tap-accent/30 text-sm italic text-tap-text/80 font-heading font-normal tracking-tight">
                              {bullet}
                            </blockquote>
                          </li>
                        ))
                      ) : section.id === 'target-press' ? (
                        // Render press outlets as badges
                        <div className="flex flex-wrap gap-2">
                          {section.bullets.map((outlet, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-tap-bg/50 border border-tap-line rounded text-xs text-tap-text font-medium"
                            >
                              {outlet}
                            </span>
                          ))}
                        </div>
                      ) : (
                        // Render as regular bullets
                        section.bullets.map((bullet, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2 text-sm text-tap-text/90"
                          >
                            <span className="text-tap-accent mt-1">•</span>
                            <span className="flex-1">{bullet}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  )
                )}

                {section.assets && section.assets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {assets
                      .filter(a => section.assets!.includes(a.id))
                      .map(asset => (
                        <a
                          key={asset.id}
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-tap-bg rounded-md border border-tap-line hover:border-tap-accent transition-colors group print:hidden"
                        >
                          {getFileIcon(asset.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-tap-text truncate group-hover:text-tap-accent transition-colors">
                              {asset.name}
                            </p>
                            <p className="text-xs text-tap-muted font-mono">
                              {formatFileSize(asset.sizeKB)} • {asset.folder}
                            </p>
                          </div>
                          <Download size={16} className="text-tap-muted" />
                        </a>
                      ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Campaign metadata */}
            <section className="bg-tap-panel rounded-lg border border-tap-line p-5 print:hidden">
              <h3 className="font-heading font-normal text-2xl tracking-tight text-tap-text mb-3 uppercase">
                Campaign Details
              </h3>
              <div className="space-y-2">
                {artist && (
                  <div>
                    <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">Artist</p>
                    <p className="text-sm text-tap-text font-medium">{artist.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">Campaign ID</p>
                  <p className="text-sm text-tap-text font-mono">{campaignId}</p>
                </div>
                <div>
                  <p className="text-xs text-tap-muted uppercase tracking-wide mb-1">Generated</p>
                  <p className="text-sm text-tap-text font-mono">
                    {new Date(pressKit.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </section>

            {/* Quick downloads */}
            {assets.length > 0 && (
              <section className="bg-tap-panel rounded-lg border border-tap-line p-5 print:hidden">
                <h3 className="font-heading font-normal text-2xl tracking-tight text-tap-text mb-3 uppercase">
                  Quick Downloads
                </h3>
                <div className="space-y-2">
                  {assets.slice(0, 5).map(asset => (
                    <a
                      key={asset.id}
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 bg-tap-bg rounded-md border border-tap-line hover:border-tap-accent transition-colors group text-xs"
                    >
                      {getFileIcon(asset.type)}
                      <span className="flex-1 truncate text-tap-text group-hover:text-tap-accent transition-colors">
                        {asset.name}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
