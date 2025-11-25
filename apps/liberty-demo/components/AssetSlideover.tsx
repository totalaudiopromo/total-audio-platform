'use client';

import React from 'react';
import { X, Download, FileText, Image, FileArchive } from 'lucide-react';
import { fetchPressProfileForAsset } from '@/lib/api/drive';
import type { DriveAsset } from '@/lib/types';
import type { PressProfile } from '@/lib/constants/pressProfiles';

interface AssetSlideoverProps {
  asset: DriveAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

const AssetSlideover: React.FC<AssetSlideoverProps> = ({ asset, isOpen, onClose }) => {
  // Hooks must be called unconditionally at the top level
  const [pressProfile, setPressProfile] = React.useState<PressProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  React.useEffect(() => {
    let active = true;
    if (!asset) {
      setPressProfile(null);
      return;
    }
    (async () => {
      setLoadingProfile(true);
      try {
        const profile = await fetchPressProfileForAsset(asset.id);
        if (active) setPressProfile(profile);
      } catch (err) {
        console.warn('[AssetSlideover] Failed to fetch press profile', err);
      } finally {
        if (active) setLoadingProfile(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [asset]);

  // Early return after all hooks
  if (!isOpen || !asset) return null;

  const getFileIcon = (type: DriveAsset['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'jpg':
      case 'png':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'doc':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'other':
      default:
        return <FileArchive className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (sizeKB: number) => {
    if (sizeKB < 1024) return `${sizeKB} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-tap-text/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-3xl h-full bg-tap-panel shadow-2xl border-l border-tap-line flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tap-line bg-tap-bg/50">
          <div className="flex items-center space-x-3">
            {getFileIcon(asset.type)}
            <div>
              <h2 className="text-xl font-heading font-normal tracking-tight text-tap-text">
                {asset.name}
              </h2>
              <p className="text-xs text-tap-muted font-mono mt-1">
                {formatFileSize(asset.sizeKB)} • {formatDate(asset.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={asset.url}
              download
              className="px-4 py-2 bg-tap-accent text-white rounded-md hover:bg-tap-accent/90 transition-colors flex items-center space-x-2 text-sm font-medium"
            >
              <Download size={16} />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-tap-muted hover:text-tap-text hover:bg-tap-line/50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Press Profile */}
          {loadingProfile && (
            <section className="bg-gradient-to-br from-tap-bg to-white p-5 rounded-md border border-tap-line">
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-tap-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-sm text-tap-muted font-heading font-normal tracking-tight italic">
                  Loading press profile…
                </p>
              </div>
            </section>
          )}

          {!loadingProfile && pressProfile && (
            <section className="bg-gradient-to-br from-tap-bg to-white p-6 rounded-md border border-tap-line space-y-5">
              <div>
                <h3 className="text-xs font-medium text-tap-accent mb-2 uppercase tracking-wider">
                  AI Press Profile Summary
                </h3>
                <h2 className="text-2xl font-heading font-normal tracking-tight text-tap-text mb-3 leading-tight">
                  {pressProfile.headline}
                </h2>
                <p className="text-sm leading-relaxed text-tap-text/90 font-heading font-normal tracking-tight">
                  {pressProfile.shortSummary}
                </p>
              </div>

              {/* Key Angles */}
              {pressProfile.keyAngles && pressProfile.keyAngles.length > 0 && (
                <div>
                  <h4 className="text-xs font-heading font-normal tracking-tight text-tap-text mb-2 uppercase tracking-wide">
                    Key Angles
                  </h4>
                  <ul className="space-y-1.5">
                    {pressProfile.keyAngles.map((angle, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-tap-text/80">
                        <span className="text-tap-accent mt-1">•</span>
                        <span className="flex-1">{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Press Cluster */}
              {pressProfile.suggestedOutlets && pressProfile.suggestedOutlets.length > 0 && (
                <div>
                  <h4 className="text-xs font-heading font-normal tracking-tight text-tap-text mb-2 uppercase tracking-wide">
                    Target Press Cluster
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pressProfile.suggestedOutlets.map((outlet, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-tap-bg/50 border border-tap-line rounded text-xs text-tap-text font-medium"
                      >
                        {outlet}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Quotes */}
              {pressProfile.suggestedPullQuotes && pressProfile.suggestedPullQuotes.length > 0 && (
                <div>
                  <h4 className="text-xs font-heading font-normal tracking-tight text-tap-text mb-2 uppercase tracking-wide">
                    Suggested Quotes
                  </h4>
                  <div className="space-y-2">
                    {pressProfile.suggestedPullQuotes.map((quote, idx) => (
                      <blockquote
                        key={idx}
                        className="pl-4 border-l-2 border-tap-accent/30 text-sm italic text-tap-text/80 font-heading font-normal tracking-tight"
                      >
                        {quote}
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {pressProfile.tags && pressProfile.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-heading font-normal tracking-tight text-tap-text mb-2 uppercase tracking-wide">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {pressProfile.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-tap-accent/10 border border-tap-accent/20 rounded-full text-xs text-tap-accent font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Summary (Expandable) */}
              {pressProfile.longSummary && pressProfile.longSummary.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer text-xs font-semibold text-tap-accent uppercase tracking-wide hover:text-tap-text transition-colors">
                    Read Full Context →
                  </summary>
                  <div className="mt-3 space-y-3">
                    {pressProfile.longSummary.map((para, idx) => (
                      <p
                        key={idx}
                        className="text-sm leading-relaxed text-tap-text/80 font-heading font-normal tracking-tight"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </section>
          )}

          {/* Preview */}
          <section>
            <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text mb-3 uppercase tracking-wide">
              Preview
            </h3>
            <div className="bg-tap-bg rounded-md border border-tap-line p-4">
              {asset.type === 'pdf' ? (
                <embed
                  src={asset.url}
                  type="application/pdf"
                  className="w-full h-[600px] rounded-md border border-tap-line"
                />
              ) : asset.type === 'jpg' || asset.type === 'png' ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-auto rounded-md border border-tap-line"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <FileArchive className="w-16 h-16 text-tap-muted/30 mb-4" />
                  <p className="font-heading font-normal tracking-tight text-lg text-tap-muted mb-2">
                    Preview not available
                  </p>
                  <p className="font-mono text-sm text-tap-muted/70">
                    Download the file to view its contents
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Metadata */}
          <section>
            <h3 className="text-sm font-heading font-normal tracking-tight text-tap-text mb-3 uppercase tracking-wide">
              Details
            </h3>
            <div className="bg-tap-bg rounded-md border border-tap-line p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-tap-muted font-medium">Folder:</span>
                <span className="text-sm text-tap-text font-mono">{asset.folder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-tap-muted font-medium">File Type:</span>
                <span className="text-sm text-tap-text font-mono uppercase">{asset.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-tap-muted font-medium">Size:</span>
                <span className="text-sm text-tap-text font-mono">
                  {formatFileSize(asset.sizeKB)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-tap-muted font-medium">Last Updated:</span>
                <span className="text-sm text-tap-text font-mono">
                  {formatDate(asset.updatedAt)}
                </span>
              </div>
              {asset.campaignId && (
                <div className="flex justify-between">
                  <span className="text-sm text-tap-muted font-medium">Campaign ID:</span>
                  <span className="text-sm text-tap-text font-mono">{asset.campaignId}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AssetSlideover;
