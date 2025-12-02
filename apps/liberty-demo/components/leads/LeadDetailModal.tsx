'use client';

import React from 'react';
import {
  X,
  Music2,
  MapPin,
  Calendar,
  ExternalLink,
  Instagram,
  Globe,
  Users,
  Headphones,
  PlusCircle,
  XCircle,
  Mail,
  Sparkles,
} from 'lucide-react';
import type { Lead } from '@/lib/leads/types';
import { getScoreCategory } from '@/lib/leads/scoring';
import ScoreBreakdown from './ScoreBreakdown';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToPipeline?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onContact?: (id: string) => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(num: number | null): string {
  if (num === null) return 'N/A';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onAddToPipeline,
  onDismiss,
  onContact,
}: LeadDetailModalProps) {
  if (!isOpen || !lead) return null;

  const scoreCategory = getScoreCategory(lead.score);
  const isNew = lead.status === 'new';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#D9D7D2] px-6 py-4 flex items-start justify-between z-10">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F5F5] flex-shrink-0">
              {lead.imageUrl ? (
                <img
                  src={lead.imageUrl}
                  alt={lead.artistName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 size={28} className="text-[#737373]" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black font-sans">{lead.artistName}</h2>
              <p className="text-sm text-[#737373] font-sans mt-0.5">
                {lead.genre || 'Unknown Genre'}
              </p>
              {lead.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-[#737373]" />
                  <span className="text-xs text-[#737373] font-sans">{lead.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Score */}
            <div className="text-right">
              <span className="text-3xl font-mono font-bold" style={{ color: scoreCategory.color }}>
                {lead.score}
              </span>
              <div className="text-[10px] font-mono uppercase text-[#737373]">
                {scoreCategory.label}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
            >
              <X size={20} className="text-[#737373]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {lead.bio && (
                <div className="bg-[#FAFAF8] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-black font-sans mb-2">About</h3>
                  <p className="text-sm text-[#737373] font-sans leading-relaxed">{lead.bio}</p>
                </div>
              )}

              {/* AI Insight */}
              {lead.aiInsight && (
                <div className="bg-[#3AA9BE]/5 border border-[#3AA9BE]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-[#3AA9BE]" />
                    <h3 className="text-sm font-semibold text-[#3AA9BE] font-sans">AI Insight</h3>
                  </div>
                  <p className="text-sm text-black font-sans leading-relaxed italic">
                    "{lead.aiInsight}"
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Headphones size={16} className="text-[#22C55E]" />
                    <span className="text-[10px] font-mono uppercase text-[#737373]">Spotify</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737373] font-sans">Monthly Listeners</span>
                      <span className="text-sm font-mono font-semibold text-black">
                        {formatNumber(lead.spotifyMonthlyListeners)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737373] font-sans">Followers</span>
                      <span className="text-sm font-mono font-semibold text-black">
                        {formatNumber(lead.spotifyFollowers)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={16} className="text-[#EC4899]" />
                    <span className="text-[10px] font-mono uppercase text-[#737373]">Social</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737373] font-sans">Instagram</span>
                      <span className="text-sm font-mono font-semibold text-black">
                        {formatNumber(lead.instagramFollowers)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#737373] font-sans">Twitter</span>
                      <span className="text-sm font-mono font-semibold text-black">
                        {formatNumber(lead.twitterFollowers)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Release Info */}
              <div className="grid grid-cols-2 gap-4">
                {lead.upcomingReleaseDate && (
                  <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-[#F59E0B]" />
                      <span className="text-[10px] font-mono uppercase text-[#737373]">
                        Upcoming Release
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-black font-sans">
                      {lead.upcomingReleaseTitle}
                    </p>
                    <p className="text-xs text-[#737373] font-sans mt-1">
                      {formatDate(lead.upcomingReleaseDate)}
                    </p>
                  </div>
                )}

                {lead.latestReleaseDate && (
                  <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Music2 size={16} className="text-[#737373]" />
                      <span className="text-[10px] font-mono uppercase text-[#737373]">
                        Latest Release
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-black font-sans">
                      {lead.latestReleaseTitle}
                    </p>
                    <p className="text-xs text-[#737373] font-sans mt-1">
                      {formatDate(lead.latestReleaseDate)}
                    </p>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-black font-sans mb-3">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {lead.spotifyUrl && (
                    <a
                      href={lead.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DB954]/10 text-[#1DB954] rounded-lg text-xs font-medium hover:bg-[#1DB954]/20 transition-colors"
                    >
                      <Headphones size={14} />
                      Spotify
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {lead.instagramUrl && (
                    <a
                      href={lead.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E1306C]/10 text-[#E1306C] rounded-lg text-xs font-medium hover:bg-[#E1306C]/20 transition-colors"
                    >
                      <Instagram size={14} />
                      Instagram
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {lead.bandcampUrl && (
                    <a
                      href={lead.bandcampUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#629AA9]/10 text-[#629AA9] rounded-lg text-xs font-medium hover:bg-[#629AA9]/20 transition-colors"
                    >
                      <Music2 size={14} />
                      Bandcamp
                      <ExternalLink size={10} />
                    </a>
                  )}
                  {lead.websiteUrl && (
                    <a
                      href={lead.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111]/10 text-black rounded-lg text-xs font-medium hover:bg-[#111111]/20 transition-colors"
                    >
                      <Globe size={14} />
                      Website
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Score & PR */}
            <div className="space-y-6">
              {/* Score Breakdown */}
              <ScoreBreakdown breakdown={lead.scoreBreakdown} totalScore={lead.score} />

              {/* PR Status */}
              <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-black font-sans mb-3">PR Status</h3>
                <div
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                    ${
                      lead.prConfidence === 'unlikely' || lead.prConfidence === 'unknown'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : 'bg-[#DC2626]/10 text-[#DC2626]'
                    }
                  `}
                >
                  {lead.prConfidence === 'unlikely' || lead.prConfidence === 'unknown' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                      {lead.prConfidence === 'unlikely' ? 'No PR detected' : 'PR status unknown'}
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      {lead.hasPrAgency
                        ? `Has PR: ${lead.prAgencyName || 'Unknown agency'}`
                        : 'Likely has PR'}
                    </>
                  )}
                </div>
              </div>

              {/* Source */}
              <div className="bg-white border border-[#D9D7D2] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-black font-sans mb-3">
                  Discovery Source
                </h3>
                <div className="text-sm text-black font-sans">{lead.sourceName}</div>
                {lead.sourceRank && (
                  <div className="text-xs text-[#737373] font-sans mt-1">
                    Rank #{lead.sourceRank}
                  </div>
                )}
                <div className="text-xs text-[#737373] font-sans mt-2">
                  Discovered {formatDate(lead.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#D9D7D2] px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-[#737373] font-sans">
            Last updated {formatDate(lead.updatedAt)}
          </div>

          {isNew ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDismiss?.(lead.id)}
                className="liberty-btn-ghost flex items-center gap-1.5 text-[#737373] hover:text-[#DC2626]"
              >
                <XCircle size={16} />
                <span>Dismiss</span>
              </button>
              <button
                onClick={() => onContact?.(lead.id)}
                className="liberty-btn-secondary flex items-center gap-1.5"
              >
                <Mail size={16} />
                <span>Draft Pitch</span>
              </button>
              <button
                onClick={() => onAddToPipeline?.(lead.id)}
                className="liberty-btn-primary flex items-center gap-1.5"
              >
                <PlusCircle size={16} />
                <span>Add to Pipeline</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onContact?.(lead.id)}
                className="liberty-btn-primary flex items-center gap-1.5"
              >
                <Mail size={16} />
                <span>Draft Pitch</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
