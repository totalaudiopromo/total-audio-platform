import React from 'react';
import { ARTISTS } from '@/lib/constants';
import { Activity, Users, Radio } from 'lucide-react';
import StatusChip from './StatusChip';
import Slideover from './Slideover';
import MermaidChart from './MermaidChart';
import AssetSlideover from './AssetSlideover';
import { fetchCampaignDetail } from '@/lib/api/tracker';
import { fetchPitchEventsForCampaign } from '@/lib/api/pitch';
import { fetchWarmSpinsForCampaign } from '@/lib/api/warm';
import { fetchAssetsByCampaign } from '@/lib/api/drive';
import type {
  TrackerCampaignSummary,
  TrackerCampaignDetail,
  PitchEvent,
  WarmSpin,
  DriveAsset,
} from '@/lib/types';

interface CampaignCardProps {
  campaign: TrackerCampaignSummary;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const [isSlideoverOpen, setIsSlideoverOpen] = React.useState(false);

  // Try to find artist by name match (since API returns artistName not artistId)
  const artist = Object.values(ARTISTS).find(a => a.name === campaign.artistName) || {
    name: campaign.artistName,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.artistName)}&background=8F9BA6&color=fff&size=128&bold=true`,
  };

  const getHealthColor = (score: number) => {
    if (score > 80) return 'bg-[#16A34A]'; // Green - Good health
    if (score > 50) return 'bg-[#CA9A06]'; // Amber - Medium health
    return 'bg-[#737373]'; // Grey - Low health
  };

  return (
    <>
      <div
        className="liberty-card cursor-pointer group hover:border-[#111]"
        onClick={() => setIsSlideoverOpen(true)}
      >
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center space-x-3">
            {artist?.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover border-2 border-[#D9D7D2] grayscale"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#F7F6F2] border-2 border-[#D9D7D2] flex items-center justify-center text-[#111] font-bold font-jakarta text-lg">
                {artist?.name?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <h3 className="liberty-heading text-lg mb-1">{campaign.campaignName}</h3>
              <p className="liberty-metadata normal-case">{artist?.name}</p>
            </div>
          </div>
          <StatusChip status={campaign.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="liberty-card-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="liberty-label text-[10px]">Momentum</span>
              <Activity size={14} className="text-[#111]" />
            </div>
            <div className="text-2xl font-mono font-bold leading-none text-[#111]">
              {campaign.momentum}
            </div>
          </div>
          <div className="liberty-card-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="liberty-label text-[10px]">Health</span>
              <div className={`w-2.5 h-2.5 rounded-full ${getHealthColor(campaign.health)}`}></div>
            </div>
            <div className="text-2xl font-mono font-bold leading-none text-[#111]">
              {campaign.health}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm pt-3 border-t border-[#D9D7D2]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-[#737373]">
              <Users size={14} />
              <span className="font-mono font-medium">{campaign.pitchCount}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-jakarta font-medium text-[#737373]">Open:</span>
              <span className="font-mono font-bold tap-accent-crm">{campaign.openRate}%</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-jakarta font-medium text-[#737373]">Reply:</span>
              <span className="font-mono font-bold tap-accent-pitch">{campaign.replyRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <Slideover
        isOpen={isSlideoverOpen}
        onClose={() => setIsSlideoverOpen(false)}
        title={campaign.campaignName}
      >
        <SlideoverContent campaignId={campaign.id} artistName={campaign.artistName} />
      </Slideover>
    </>
  );
};

// Separate component for slideover content to handle data fetching
const SlideoverContent: React.FC<{ campaignId: string; artistName: string }> = ({
  campaignId,
  artistName,
}) => {
  const [detail, setDetail] = React.useState<TrackerCampaignDetail | null>(null);
  const [pitchEvents, setPitchEvents] = React.useState<PitchEvent[]>([]);
  const [driveAssets, setDriveAssets] = React.useState<DriveAsset[]>([]);
  const [warmSpins, setWarmSpins] = React.useState<WarmSpin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAsset, setSelectedAsset] = React.useState<DriveAsset | null>(null);
  const [isAssetSlideoverOpen, setIsAssetSlideoverOpen] = React.useState(false);

  const artist = Object.values(ARTISTS).find(a => a.name === artistName) || {
    name: artistName,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=8F9BA6&color=fff&size=128&bold=true`,
  };

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [campaignDetail, pitches, spins, assets] = await Promise.all([
          fetchCampaignDetail(campaignId),
          fetchPitchEventsForCampaign(campaignId),
          fetchWarmSpinsForCampaign(campaignId),
          fetchAssetsByCampaign(campaignId),
        ]);
        if (active) {
          setDetail(campaignDetail);
          setPitchEvents(pitches);
          setWarmSpins(spins);
          setDriveAssets(assets);
        }
      } catch (err) {
        console.warn('[TAP API] Failed to load campaign detail, using mocks', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [campaignId]);

  if (loading || !detail) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-tap-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-tap-muted font-heading italic">Loading campaign details…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-tap-line">
        <div className="flex items-center space-x-3">
          {artist?.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border border-tap-line"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-tap-bg border border-tap-line flex items-center justify-center text-tap-muted font-medium">
              {artist?.name?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-tap-muted">{artist?.name}</p>
            <p className="text-xs text-tap-muted/70">{(artist as any)?.genre || 'Artist'}</p>
          </div>
        </div>
        <StatusChip status={detail.status} />
      </div>

      {/* Momentum & Health Bars */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-tap-muted mb-2">
            <span className="font-medium uppercase tracking-wide">Momentum</span>
            <span className="font-mono">{detail.momentum}%</span>
          </div>
          <div className="h-2 bg-tap-bg rounded overflow-hidden border border-tap-line">
            <div
              className="h-full bg-tap-good transition-all"
              style={{ width: `${detail.momentum}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-tap-muted mb-2">
            <span className="font-medium uppercase tracking-wide">Health Score</span>
            <span className="font-mono">{detail.health}%</span>
          </div>
          <div className="h-2 bg-tap-bg rounded overflow-hidden border border-tap-line">
            <div
              className="h-full bg-tap-accent transition-all"
              style={{ width: `${detail.health}%` }}
            />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-tap-bg p-3 rounded-md border border-tap-line text-center">
          <div className="text-xs text-tap-muted uppercase tracking-wide mb-1">Pitches</div>
          <div className="text-xl font-mono leading-none text-tap-text">{detail.pitchCount}</div>
        </div>
        <div className="bg-tap-bg p-3 rounded-md border border-tap-line text-center">
          <div className="text-xs text-tap-muted uppercase tracking-wide mb-1">Open Rate</div>
          <div className="text-xl font-mono leading-none text-tap-text">{detail.openRate}%</div>
        </div>
        <div className="bg-tap-bg p-3 rounded-md border border-tap-line text-center">
          <div className="text-xs text-tap-muted uppercase tracking-wide mb-1">Reply Rate</div>
          <div className="text-xl font-mono leading-none text-tap-text">{detail.replyRate}%</div>
        </div>
      </section>

      {/* Campaign Timeline */}
      {detail.timelineMermaid && (
        <section>
          <h3 className="text-sm font-heading font-normal tracking-tight mb-3 pb-2 border-b border-tap-line uppercase tracking-wide text-tap-text">
            Campaign Timeline
          </h3>
          <MermaidChart code={detail.timelineMermaid} />
        </section>
      )}

      {/* Pitch History */}
      {pitchEvents.length > 0 && (
        <section>
          <h3 className="text-sm font-heading font-normal tracking-tight mb-3 pb-2 border-b border-tap-line uppercase tracking-wide text-tap-text">
            Pitch History
          </h3>
          <div className="space-y-2">
            {pitchEvents.slice(0, 10).map(pitch => (
              <div
                key={pitch.id}
                className="p-3 bg-tap-bg rounded-md border border-tap-line hover:border-tap-accent transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-tap-text">{pitch.subject}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      pitch.status === 'replied'
                        ? 'bg-tap-good/10 text-tap-good border border-tap-good/20'
                        : pitch.status === 'opened'
                          ? 'bg-tap-accent/10 text-tap-accent border border-tap-accent/20'
                          : pitch.status === 'bounced'
                            ? 'bg-tap-risk/10 text-tap-risk border border-tap-risk/20'
                            : 'bg-tap-muted/10 text-tap-muted border border-tap-muted/20'
                    }`}
                  >
                    {pitch.status}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-tap-muted">
                  <span className="font-mono text-xs text-tap-muted tracking-normal">
                    {new Date(pitch.sentAt).toLocaleDateString()}
                  </span>
                  {pitch.openedAt && (
                    <span>• Opened {new Date(pitch.openedAt).toLocaleDateString()}</span>
                  )}
                  {pitch.repliedAt && (
                    <span>• Replied {new Date(pitch.repliedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Radio Performance */}
      {warmSpins.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-tap-line">
            <Radio size={16} className="text-tap-accent" />
            <h3 className="text-sm font-heading font-normal tracking-tight uppercase tracking-wide text-tap-text">
              Radio Performance
            </h3>
          </div>

          {/* Summary line */}
          <div className="mb-4 p-3 bg-tap-bg rounded-md border border-tap-line">
            <p className="text-sm text-tap-text leading-relaxed">
              Rotation is building in <span className="font-medium">{warmSpins[0]?.country}</span>{' '}
              and surrounding territories, with{' '}
              <span className="font-medium">{warmSpins[0]?.station}</span> leading the charge.
            </p>
          </div>

          <div className="space-y-2">
            {warmSpins.slice(0, 5).map(spin => {
              const getCountryFlag = (code: string) => {
                const flags: Record<string, string> = {
                  UK: '🇬🇧',
                  IE: '🇮🇪',
                  US: '🇺🇸',
                  DE: '🇩🇪',
                  AU: '🇦🇺',
                };
                return flags[code] || '🌍';
              };

              const getRotationColor = (level: string) => {
                if (level === 'heavy') return 'bg-tap-good/10 text-tap-good border-tap-good/20';
                if (level === 'medium')
                  return 'bg-tap-accent/10 text-tap-accent border-tap-accent/20';
                return 'bg-tap-muted/10 text-tap-muted border-tap-muted/20';
              };

              const formatTimeAgo = (dateString: string) => {
                const now = new Date();
                const then = new Date(dateString);
                const diffMs = now.getTime() - then.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                if (diffHours < 1) return 'Just now';
                if (diffHours < 24) return `${diffHours}h ago`;
                const diffDays = Math.floor(diffHours / 24);
                return `${diffDays}d ago`;
              };

              return (
                <div
                  key={spin.id}
                  className="p-3 bg-tap-bg rounded-md border border-tap-line hover:border-tap-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCountryFlag(spin.country)}</span>
                      <div>
                        <p className="font-medium text-tap-text text-sm">{spin.station}</p>
                        <p className="text-xs text-tap-muted">
                          {spin.city}, {spin.country}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getRotationColor(spin.rotationLevel)}`}
                    >
                      {spin.rotationLevel}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-tap-muted tracking-normal">
                    {formatTimeAgo(spin.spinTime)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Coverage Log */}
      {detail.coverageLog && detail.coverageLog.length > 0 && (
        <section>
          <h3 className="text-sm font-heading font-normal tracking-tight mb-3 pb-2 border-b border-tap-line uppercase tracking-wide text-tap-text">
            Coverage Log
          </h3>
          <div className="space-y-2">
            {detail.coverageLog.map(coverage => (
              <div key={coverage.id} className="p-3 bg-tap-bg rounded-md border border-tap-line">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {coverage.type === 'Press' ? '📰' : coverage.type === 'Radio' ? '📻' : '🎵'}
                    </span>
                    <div>
                      <p className="font-medium text-tap-text text-sm">{coverage.outlet}</p>
                      <p className="text-xs text-tap-muted uppercase tracking-wide">
                        {coverage.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-tap-muted">{coverage.date}</span>
                </div>
                <p className="text-sm text-tap-muted">{coverage.highlight}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tasks */}
      {detail.tasks && detail.tasks.length > 0 && (
        <section>
          <h3 className="text-sm font-heading font-normal tracking-tight mb-3 pb-2 border-b border-tap-line uppercase tracking-wide text-tap-text">
            Next Steps
          </h3>
          <div className="space-y-2">
            {detail.tasks
              .filter(t => !t.completed)
              .map(task => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 bg-tap-bg rounded-md border border-tap-line"
                >
                  <div className="w-4 h-4 rounded border border-tap-accent mt-0.5 shrink-0"></div>
                  <p className="text-sm text-tap-text">{task.title}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* AI Summary */}
      {detail.aiSummary && (
        <section className="bg-gradient-to-br from-tap-bg to-white p-5 rounded-md border border-tap-line">
          <h3 className="text-sm font-heading font-normal tracking-tight mb-3 uppercase tracking-wide text-tap-accent">
            Campaign Summary
          </h3>
          <p className="text-sm leading-relaxed text-tap-text/80 font-heading italic">
            "{detail.aiSummary}"
          </p>
        </section>
      )}

      {/* Press Kit Preview Link */}
      {driveAssets.some(
        a => a.folder === 'Press Releases' && (a.type === 'pdf' || a.type === 'other')
      ) && (
        <section>
          <a
            href={`/dashboard/press-kit/${campaignId}`}
            className="block p-4 bg-gradient-to-br from-tap-accent/5 to-tap-accent/10 border border-tap-accent/20 rounded-md hover:border-tap-accent/40 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-heading font-normal tracking-tight mb-1 text-tap-accent">
                  Press Kit Preview
                </h3>
                <p className="text-xs text-tap-muted">
                  View complete press kit with profiles, quotes, and assets
                </p>
              </div>
              <span className="text-tap-accent group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Pitch Builder Link */}
      {driveAssets.some(
        a => a.folder === 'Press Releases' && (a.type === 'pdf' || a.type === 'other')
      ) && (
        <section>
          <a
            href={`/dashboard/pitch-builder/${campaignId}`}
            className="block p-4 bg-gradient-to-br from-tap-accent/5 to-tap-accent/10 border border-tap-accent/20 rounded-md hover:border-tap-accent/40 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-heading font-normal tracking-tight mb-1 text-tap-accent">
                  Open Pitch Builder
                </h3>
                <p className="text-xs text-tap-muted">
                  Generate multi-segment pitches for radio, editorial, blogs, and more
                </p>
              </div>
              <span className="text-tap-accent group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Ops Hub Link */}
      <section>
        <a
          href={`/dashboard/ops-hub/${campaignId}`}
          className="block p-4 bg-gradient-to-br from-tap-accent/5 to-tap-accent/10 border border-tap-accent/20 rounded-md hover:border-tap-accent/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-heading font-normal tracking-tight mb-1 text-tap-accent">
                Open Ops Hub
              </h3>
              <p className="text-xs text-tap-muted">
                View complete campaign operations with live signals and KPIs
              </p>
            </div>
            <span className="text-tap-accent group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </a>
      </section>

      {/* Assets */}
      {driveAssets.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-tap-line">
            <h3 className="text-sm font-heading font-normal tracking-tight uppercase tracking-wide text-tap-text">
              Campaign Assets
            </h3>
            <a
              href="/dashboard/assets"
              className="text-xs text-tap-accent hover:underline font-medium"
            >
              Open Asset Hub →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {driveAssets.slice(0, 3).map(asset => {
              const getFileIcon = (type: string) => {
                switch (type) {
                  case 'pdf':
                    return '📄';
                  case 'jpg':
                  case 'png':
                    return '🖼️';
                  case 'doc':
                  case 'docx':
                    return '📝';
                  default:
                    return '📦';
                }
              };

              const formatSize = (sizeKB: number) => {
                if (sizeKB < 1024) return `${sizeKB} KB`;
                return `${(sizeKB / 1024).toFixed(1)} MB`;
              };

              const isPressRelease =
                asset.folder === 'Press Releases' &&
                (asset.type === 'pdf' || asset.type === 'other');

              return (
                <div
                  key={asset.id}
                  className="p-3 bg-tap-bg rounded-md border border-tap-line hover:border-tap-accent transition-colors"
                >
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl">{getFileIcon(asset.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-tap-text truncate group-hover:text-tap-accent transition-colors">
                          {asset.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-tap-muted font-mono">
                      <span>{formatSize(asset.sizeKB)}</span>
                      <span>{asset.folder}</span>
                    </div>
                  </a>
                  {isPressRelease && (
                    <button
                      onClick={e => {
                        e.preventDefault();
                        setSelectedAsset(asset);
                        setIsAssetSlideoverOpen(true);
                      }}
                      className="mt-2 w-full text-[10px] text-tap-accent hover:text-tap-text transition-colors font-medium text-center py-1 border-t border-tap-line"
                    >
                      View AI Press Summary →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {driveAssets.length > 3 && (
            <div className="mt-3 text-center">
              <a
                href="/dashboard/assets"
                className="font-mono text-xs text-tap-muted tracking-normal hover:text-tap-accent transition-colors"
              >
                + {driveAssets.length - 3} more assets
              </a>
            </div>
          )}
        </section>
      )}

      {/* Asset Slideover */}
      <AssetSlideover
        asset={selectedAsset}
        isOpen={isAssetSlideoverOpen}
        onClose={() => {
          setIsAssetSlideoverOpen(false);
          setSelectedAsset(null);
        }}
      />
    </>
  );
};

export default CampaignCard;
