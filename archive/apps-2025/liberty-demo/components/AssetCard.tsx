import React, { useState, useEffect } from 'react';
import { FileText, Image, FileArchive, Music } from 'lucide-react';
import type { DriveAsset } from '@/lib/types';
import { fetchAssetUsageForCampaign } from '@/lib/api/drive';

interface AssetCardProps {
  asset: DriveAsset;
  onClick: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
  const [usage, setUsage] = useState<string | null>(null);

  useEffect(() => {
    fetchAssetUsageForCampaign(asset.id).then(setUsage);
  }, [asset.id]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-10 h-10 text-red-500" />;
      case 'jpg':
      case 'png':
        return <Image className="w-10 h-10 text-blue-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-10 h-10 text-blue-600" />;
      case 'mp3':
      case 'wav':
        return <Music className="w-10 h-10 text-purple-500" />;
      default:
        return <FileArchive className="w-10 h-10 text-gray-500" />;
    }
  };

  const formatFileSize = (sizeKB: number) => {
    if (sizeKB < 1024) return `${sizeKB} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className="bg-tap-panel border border-tap-line rounded-md p-4 hover:border-tap-accent transition-all cursor-pointer group flex flex-col h-full"
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-shrink-0">{getFileIcon(asset.type)}</div>
        <div className="text-xs text-tap-muted font-mono">{asset.type.toUpperCase()}</div>
      </div>

      {/* Filename */}
      <h3 className="text-sm font-medium text-tap-text mb-2 line-clamp-2 group-hover:text-tap-accent transition-colors flex-1">
        {asset.name}
      </h3>

      {/* Metadata */}
      <div className="space-y-1 mt-auto">
        <p className="font-mono text-xs text-tap-muted">{formatFileSize(asset.sizeKB)}</p>
        <p className="font-mono text-xs text-tap-muted/70">{formatDate(asset.updatedAt)}</p>
        <p className="text-xs text-tap-accent font-medium">{asset.folder}</p>
        {usage && (
          <p className="text-[10px] text-tap-muted italic border-t border-tap-line pt-2 mt-2">
            {usage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
