'use client';

import React from 'react';
import {
  Music2,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  PlusCircle,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type { Lead, LeadSignal } from '@/lib/leads/types';
import { getScoreCategory } from '@/lib/leads/scoring';

interface LeadCardProps {
  lead: Lead;
  onAddToPipeline?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onViewProfile?: (id: string) => void;
  compact?: boolean;
}

function SignalIcon({ type, positive }: { type: string; positive: boolean }) {
  const iconClass = positive ? 'text-[#22C55E]' : 'text-[#DC2626]';

  switch (type) {
    case 'release':
      return <Calendar size={12} className={iconClass} />;
    case 'momentum':
      return <TrendingUp size={12} className={iconClass} />;
    case 'availability':
      return positive ? (
        <CheckCircle size={12} className={iconClass} />
      ) : (
        <AlertCircle size={12} className={iconClass} />
      );
    case 'fit':
      return <Music2 size={12} className={iconClass} />;
    case 'source':
      return <Sparkles size={12} className={iconClass} />;
    default:
      return positive ? (
        <CheckCircle size={12} className={iconClass} />
      ) : (
        <XCircle size={12} className={iconClass} />
      );
  }
}

function SignalBadge({ signal }: { signal: LeadSignal }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <SignalIcon type={signal.type} positive={signal.positive} />
      <span className={signal.positive ? 'text-black' : 'text-[#737373]'}>{signal.label}</span>
    </div>
  );
}

export default function LeadCard({
  lead,
  onAddToPipeline,
  onDismiss,
  onViewProfile,
  compact = false,
}: LeadCardProps) {
  const scoreCategory = getScoreCategory(lead.score);
  const isPipeline = lead.status === 'pipeline';
  const isDismissed = lead.status === 'dismissed';
  const isContacted = lead.status === 'contacted';

  return (
    <div
      className={`
        bg-white border rounded-xl overflow-hidden transition-all duration-200
        ${isDismissed ? 'border-[#D9D7D2] opacity-60' : 'border-[#D9D7D2] hover:border-[#3AA9BE] hover:shadow-md'}
        ${compact ? 'p-0' : ''}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#D9D7D2] flex justify-between items-start">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0">
            {lead.imageUrl ? (
              <img
                src={lead.imageUrl}
                alt={lead.artistName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 size={20} className="text-[#737373]" />
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div>
            <h4 className="text-black text-sm font-sans font-semibold">{lead.artistName}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#737373] font-sans">
                {lead.genre || 'Unknown Genre'}
              </span>
            </div>
            {lead.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} className="text-[#737373]" />
                <span className="text-[10px] text-[#737373] font-sans">{lead.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <span
            className="text-2xl font-mono font-bold leading-none block"
            style={{ color: scoreCategory.color }}
          >
            {lead.score}
          </span>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] mt-0.5">
            {scoreCategory.label}
          </div>
        </div>
      </div>

      {/* Source Badge */}
      <div className="px-4 py-2 bg-[#FAFAF8] border-b border-[#D9D7D2]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">
              SOURCE
            </span>
            <span className="text-xs font-medium text-black font-sans">
              {lead.sourceName}
              {lead.sourceRank && ` #${lead.sourceRank}`}
            </span>
          </div>
          {lead.spotifyMonthlyListeners && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-[#737373]">
                {(lead.spotifyMonthlyListeners / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] font-mono uppercase text-[#737373]">listeners</span>
            </div>
          )}
        </div>
      </div>

      {/* Signals */}
      {!compact && lead.signals.length > 0 && (
        <div className="p-4 border-b border-[#D9D7D2]">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-[#737373]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">
              SIGNALS
            </span>
          </div>
          <div className="space-y-1.5">
            {lead.signals.slice(0, 4).map((signal, idx) => (
              <SignalBadge key={idx} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* AI Insight */}
      {!compact && lead.aiInsight && (
        <div className="p-4 border-b border-[#D9D7D2]">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-[#3AA9BE]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">
              AI INSIGHT
            </span>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed font-sans italic">
            "{lead.aiInsight}"
          </p>
        </div>
      )}

      {/* Status Banner (for pipeline/dismissed/contacted) */}
      {(isPipeline || isDismissed || isContacted) && (
        <div
          className={`
            px-4 py-2 border-b border-[#D9D7D2]
            ${isPipeline ? 'bg-[#22C55E]/10' : isDismissed ? 'bg-[#DC2626]/10' : 'bg-[#3AA9BE]/10'}
          `}
        >
          <div className="flex items-center gap-2">
            {isPipeline && <CheckCircle size={14} className="text-[#22C55E]" />}
            {isDismissed && <XCircle size={14} className="text-[#DC2626]" />}
            {isContacted && <CheckCircle size={14} className="text-[#3AA9BE]" />}
            <span
              className={`
                text-xs font-medium font-sans
                ${isPipeline ? 'text-[#22C55E]' : isDismissed ? 'text-[#DC2626]' : 'text-[#3AA9BE]'}
              `}
            >
              {isPipeline ? 'Added to Pipeline' : isDismissed ? 'Dismissed' : 'Contacted'}
            </span>
            {lead.statusUpdatedBy && (
              <span className="text-[10px] text-[#737373] font-sans ml-auto">
                by {lead.statusUpdatedBy}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 bg-[#FAFAF8] flex items-center justify-between gap-2">
        {lead.status === 'new' ? (
          <>
            <button
              onClick={() => onAddToPipeline?.(lead.id)}
              className="liberty-btn-primary flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Add to Pipeline</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDismiss?.(lead.id)}
                className="liberty-btn-ghost flex items-center gap-1.5 text-[#737373] hover:text-[#DC2626]"
              >
                <XCircle size={14} />
                <span>Dismiss</span>
              </button>
              <button
                onClick={() => onViewProfile?.(lead.id)}
                className="liberty-btn-secondary flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                <span>View Profile</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onViewProfile?.(lead.id)}
              className="liberty-btn-secondary flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>View Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
