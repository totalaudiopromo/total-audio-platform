'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchOpsHubDataForCampaign } from '@/lib/api/opsHub';
import type { OpsHubData, OpsHubEvent } from '@/lib/opsHubModel';
import Loading from '@/components/Loading';
import StatusChip from '@/components/StatusChip';
import {
  Activity,
  Calendar,
  Radio,
  Mail,
  FileText,
  CheckSquare,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const OpsHubPage: React.FC = () => {
  const params = useParams();
  const campaignId = params.campaignId as string;

  const [opsData, setOpsData] = useState<OpsHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchOpsHubDataForCampaign(campaignId);
        if (active) {
          setOpsData(data);
        }
      } catch (error) {
        console.error('[TAP API] Failed to load Ops Hub data:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [campaignId]);

  if (loading || !opsData) {
    return <Loading message="Loading campaign operations…" />;
  }

  const getEventIcon = (type: OpsHubEvent['type']) => {
    switch (type) {
      case 'press':
        return <FileText className="w-4 h-4 text-tap-accent" />;
      case 'radio':
        return <Radio className="w-4 h-4 text-tap-good" />;
      case 'pitch':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'intake':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-tap-muted" />;
    }
  };

  const getEventTypeLabel = (type: OpsHubEvent['type']) => {
    const labels: Record<OpsHubEvent['type'], string> = {
      press: 'Press',
      radio: 'Radio',
      pitch: 'Pitch',
      intake: 'Intake',
      task: 'Task',
    };
    return labels[type];
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getPhaseStatusColor = (status: OpsHubData['phases'][0]['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-tap-good border-tap-good';
      case 'active':
        return 'bg-tap-accent border-tap-accent';
      case 'not-started':
        return 'bg-tap-muted/20 border-tap-muted';
      default:
        return 'bg-tap-muted/20 border-tap-muted';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-tap-line">
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-xs text-tap-muted font-mono">
            <a href="/dashboard" className="hover:text-tap-accent transition-colors">
              Dashboard
            </a>
            <span>→</span>
            <a href="/dashboard/overview" className="hover:text-tap-accent transition-colors">
              Ops Hub
            </a>
            <span>→</span>
            <span className="text-tap-text">{opsData.campaignName}</span>
          </nav>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading font-normal text-4xl tracking-tight text-tap-text mb-2">
              Campaign Operations Hub
            </h1>
            <p className="text-sm text-tap-muted">
              <span className="font-medium">{opsData.artistName}</span> — {opsData.campaignName}
            </p>
          </div>
        </div>
      </div>

      {/* Top Row: KPIs, Phases, Intake & Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPIs Card */}
        <div className="bg-tap-panel border border-tap-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-tap-line">
            <TrendingUp className="w-5 h-5 text-tap-accent" />
            <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text">
              Key Metrics
            </h2>
          </div>
          <div className="space-y-4">
            {opsData.kpis.map((kpi, idx) => (
              <div key={idx} className="pb-4 last:pb-0 last:border-0 border-b border-tap-line">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-tap-muted uppercase tracking-wide font-medium">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-2xl font-mono leading-none text-tap-text">{kpi.value}</div>
                {kpi.hint && <p className="text-xs text-tap-muted mt-1">{kpi.hint}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Phase Progress Card */}
        <div className="bg-tap-panel border border-tap-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-tap-line">
            <Calendar className="w-5 h-5 text-tap-accent" />
            <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text">
              Campaign Phases
            </h2>
          </div>
          <div className="space-y-3">
            {opsData.phases.map(phase => (
              <div key={phase.id} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${getPhaseStatusColor(phase.status)}`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-tap-text">{phase.label}</p>
                  <p className="text-xs text-tap-muted capitalize">
                    {phase.status.replace('-', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intake & Assets Card */}
        <div className="bg-tap-panel border border-tap-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-tap-line">
            <FileText className="w-5 h-5 text-tap-accent" />
            <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text">
              Intake & Assets
            </h2>
          </div>
          <div className="space-y-4">
            {/* Missing Intake Fields */}
            {opsData.missingIntakeFields.length > 0 ? (
              <div>
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-2">
                  Missing Fields
                </p>
                <div className="flex flex-wrap gap-2">
                  {opsData.missingIntakeFields.slice(0, 5).map((field, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded font-medium"
                    >
                      {field}
                    </span>
                  ))}
                  {opsData.missingIntakeFields.length > 5 && (
                    <span className="text-xs text-tap-muted">
                      +{opsData.missingIntakeFields.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-tap-good/10 border border-tap-good/20 rounded">
                <p className="text-sm text-tap-good font-medium">✓ All intake fields complete</p>
              </div>
            )}

            {/* Asset Status */}
            {opsData.assetStatusLabel && (
              <div className="pt-4 border-t border-tap-line">
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-2">Asset Status</p>
                <p className="text-sm text-tap-text font-mono">{opsData.assetStatusLabel}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Live Signals & Momentum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Signals (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-tap-panel border border-tap-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-tap-line">
            <Activity className="w-5 h-5 text-tap-accent" />
            <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text">
              Live Signals
            </h2>
          </div>

          {opsData.events.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {opsData.events.map(event => (
                <div
                  key={event.id}
                  className="p-4 bg-tap-bg border border-tap-line rounded-md hover:border-tap-accent transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-tap-text truncate">
                          {event.title}
                        </h3>
                        <span className="text-xs text-tap-muted font-mono whitespace-nowrap">
                          {formatEventDate(event.occurredAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-tap-muted">
                        <span className="px-2 py-0.5 bg-tap-muted/10 border border-tap-muted/20 rounded font-medium">
                          {getEventTypeLabel(event.type)}
                        </span>
                        <span>•</span>
                        <span>{event.source}</span>
                      </div>
                      {event.detail && (
                        <p className="text-xs text-tap-muted mt-2 line-clamp-2">{event.detail}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-tap-muted font-heading font-normal tracking-tight italic">
                No recent activity
              </p>
            </div>
          )}
        </div>

        {/* Momentum & Reach (1/3 width on desktop) */}
        <div className="bg-tap-panel border border-tap-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-tap-line">
            <TrendingUp className="w-5 h-5 text-tap-accent" />
            <h2 className="font-heading font-normal text-3xl tracking-tight text-tap-text">
              Momentum & Reach
            </h2>
          </div>

          <div className="space-y-6">
            {/* Coverage Summary */}
            {opsData.coverageSummaryLabel && (
              <div>
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-2">Coverage</p>
                <p className="text-sm text-tap-text leading-relaxed">
                  {opsData.coverageSummaryLabel}
                </p>
                <div className="mt-3 h-2 bg-tap-bg rounded-full overflow-hidden border border-tap-line">
                  <div className="h-full bg-tap-accent transition-all" style={{ width: '75%' }} />
                </div>
              </div>
            )}

            {/* WARM Summary */}
            {opsData.warmSummaryLabel && (
              <div className="pt-6 border-t border-tap-line">
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-2">
                  Radio Performance
                </p>
                <p className="text-sm text-tap-text leading-relaxed">{opsData.warmSummaryLabel}</p>
                <div className="mt-3 h-2 bg-tap-bg rounded-full overflow-hidden border border-tap-line">
                  <div className="h-full bg-tap-good transition-all" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* Monday Tasks Summary */}
            {opsData.mondayTasksSummary && (
              <div className="pt-6 border-t border-tap-line">
                <p className="text-xs text-tap-muted uppercase tracking-wide mb-3">Task Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-tap-text">Total tasks</span>
                    <span className="font-mono text-sm leading-none text-tap-text">
                      {opsData.mondayTasksSummary.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-tap-text">Open</span>
                    <span className="font-mono text-sm leading-none text-tap-accent">
                      {opsData.mondayTasksSummary.open}
                    </span>
                  </div>
                  {opsData.mondayTasksSummary.atRisk > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tap-text">At risk</span>
                      <span className="font-mono text-sm leading-none text-tap-risk">
                        {opsData.mondayTasksSummary.atRisk}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Links & Ops Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Press Kit Preview Link */}
        <a
          href={`/dashboard/press-kit/${campaignId}`}
          className="block p-6 bg-gradient-to-br from-tap-accent/5 to-tap-accent/10 border border-tap-accent/20 rounded-lg hover:border-tap-accent/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-normal text-2xl tracking-tight mb-1 text-tap-accent">
                Press Kit Preview
              </h3>
              <p className="text-xs text-tap-muted">
                View complete press kit with profiles and assets
              </p>
            </div>
            <span className="text-tap-accent group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </a>

        {/* Pitch Builder Link */}
        <a
          href={`/dashboard/pitch-builder/${campaignId}`}
          className="block p-6 bg-gradient-to-br from-tap-accent/5 to-tap-accent/10 border border-tap-accent/20 rounded-lg hover:border-tap-accent/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-normal text-2xl tracking-tight mb-1 text-tap-accent">
                Open Pitch Builder
              </h3>
              <p className="text-xs text-tap-muted">
                Generate multi-segment pitches for radio and press
              </p>
            </div>
            <span className="text-tap-accent group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </a>

        {/* Full Ops Dashboard Link */}
        <a
          href="/dashboard/ops"
          className="block p-6 bg-gradient-to-br from-tap-muted/5 to-tap-muted/10 border border-tap-line rounded-lg hover:border-tap-accent transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-normal text-2xl tracking-tight mb-1 text-tap-text">
                Full Operations Dashboard
              </h3>
              <p className="text-xs text-tap-muted">
                View agency-wide timelines and team allocations
              </p>
            </div>
            <span className="text-tap-muted group-hover:text-tap-accent group-hover:translate-x-1 transition-all">
              →
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default OpsHubPage;
