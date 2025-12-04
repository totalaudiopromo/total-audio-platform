'use client';

import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import {
  X,
  ExternalLink,
  Sparkles,
  Calendar,
  Target,
  TrendingUp,
  PoundSterling,
  Users,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { HealthProgressBar } from './HealthProgressBar';
import type {
  Campaign,
  PlatformType,
  CampaignStatus,
} from '@/lib/types/tracker';

interface CampaignSlideoverProps {
  campaign: (Campaign & { insights?: string[] }) | null;
  isOpen: boolean;
  onClose: () => void;
}

// Platform badge colours
const platformColours: Record<PlatformType, string> = {
  'BBC Radio': 'bg-red-100 text-red-800 border-red-300',
  'Commercial Radio': 'bg-orange-100 text-orange-800 border-orange-300',
  Playlists: 'bg-green-100 text-green-800 border-green-300',
  Blogs: 'bg-blue-100 text-blue-800 border-blue-300',
  Social: 'bg-purple-100 text-purple-800 border-purple-300',
  PR: 'bg-pink-100 text-pink-800 border-pink-300',
};

// Status badge colours
const statusColours: Record<CampaignStatus, string> = {
  planning: 'bg-teal-100 text-teal-800 border-teal-300',
  active: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-gray-100 text-gray-800 border-gray-300',
  archived: 'bg-slate-100 text-slate-600 border-slate-300',
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'd MMM yyyy');
  } catch {
    return '—';
  }
};

export function CampaignSlideover({
  campaign,
  isOpen,
  onClose,
}: CampaignSlideoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Add slight delay to prevent immediate close from row click
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!campaign) return null;

  const handleViewDetails = () => {
    window.location.href = `/campaigns/${campaign.id}`;
  };

  const handleGeneratePitch = () => {
    const pitchUrl = new URL('https://pitch.totalaudiopromo.com');
    pitchUrl.searchParams.set('campaign', campaign.id);
    pitchUrl.searchParams.set('campaignName', campaign.name || '');
    const campaignName = campaign.name || '';
    pitchUrl.searchParams.set(
      'artist',
      campaignName.split(' - ')[0] || campaignName || ''
    );
    pitchUrl.searchParams.set('platform', campaign.platform || '');
    pitchUrl.searchParams.set('genre', campaign.genre || '');
    window.open(pitchUrl.toString(), '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slideover Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l-4 border-black shadow-brutal z-50 overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-4 border-black px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2
              id="slideover-title"
              className="text-xl font-black text-gray-900 truncate pr-4"
            >
              {campaign.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Artist Name */}
          {campaign.artist_name && (
            <p className="text-sm font-bold text-gray-600 mt-1">
              {campaign.artist_name}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {campaign.platform && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  platformColours[campaign.platform] ||
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {campaign.platform}
              </span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                statusColours[campaign.status]
              }`}
            >
              {campaign.status}
            </span>
            {campaign.genre && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-gray-100 text-gray-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {campaign.genre}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Health Score */}
          <div className="bg-gray-50 rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Campaign Health
              </span>
              <span className="text-2xl font-black text-gray-900">
                {campaign.performance_score}%
              </span>
            </div>
            <HealthProgressBar score={campaign.performance_score} size="lg" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-1">
                <PoundSterling className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-black text-gray-600 uppercase">
                  Budget
                </span>
              </div>
              <p className="text-xl font-black text-gray-900 font-mono">
                {formatCurrency(campaign.budget)}
              </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-black text-gray-600 uppercase">
                  Success Rate
                </span>
              </div>
              <p
                className={`text-xl font-black font-mono ${
                  campaign.success_rate >= 70
                    ? 'text-green-600'
                    : campaign.success_rate >= 40
                      ? 'text-amber-600'
                      : 'text-gray-500'
                }`}
              >
                {campaign.success_rate}%
              </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-black text-gray-600 uppercase">
                  Target
                </span>
              </div>
              <p className="text-xl font-black text-gray-900">
                {campaign.target_reach}
              </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-black text-gray-600 uppercase">
                  Reached
                </span>
              </div>
              <p className="text-xl font-black text-teal-600">
                {campaign.actual_reach}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Timeline
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Start Date
                </p>
                <p className="text-sm font-black text-gray-900">
                  {formatDate(campaign.start_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">End Date</p>
                <p className="text-sm font-black text-gray-900">
                  {formatDate(campaign.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Cost Metrics */}
          <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-black text-gray-700 uppercase tracking-wider">
              Cost Efficiency
            </span>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Cost Per Result
                </p>
                <p className="text-lg font-black text-gray-900 font-mono">
                  {formatCurrency(campaign.cost_per_result)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Percentile
                </p>
                <p
                  className={`text-lg font-black font-mono ${
                    campaign.percentile_rank >= 75
                      ? 'text-green-600'
                      : campaign.percentile_rank >= 50
                        ? 'text-amber-600'
                        : 'text-gray-600'
                  }`}
                >
                  Top {100 - campaign.percentile_rank}%
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {campaign.insights && campaign.insights.length > 0 && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  AI Insights
                </span>
              </div>
              <ul className="space-y-2">
                {campaign.insights.slice(0, 3).map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-bold text-gray-700">
                      {insight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {campaign.notes && (
            <div className="bg-white rounded-xl border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Notes
              </span>
              <p className="mt-2 text-sm font-bold text-gray-600 whitespace-pre-wrap">
                {campaign.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t-4 border-black px-6 py-4 flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 rounded-xl font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <ExternalLink className="h-4 w-4" />
            Full Details
          </button>
          <button
            onClick={handleGeneratePitch}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Sparkles className="h-4 w-4" />
            Generate Pitch
          </button>
        </div>
      </div>
    </>
  );
}
