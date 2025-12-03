'use client';

import { format } from 'date-fns';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { HealthProgressBar } from './HealthProgressBar';
import type {
  Campaign,
  PlatformType,
  CampaignStatus,
} from '@/lib/types/tracker';

interface CampaignTableRowProps {
  campaign: Campaign & { insights?: string[] };
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRowClick: (campaign: Campaign) => void;
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

export function CampaignTableRow({
  campaign,
  index,
  isSelected,
  onToggleSelect,
  onRowClick,
}: CampaignTableRowProps) {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking checkbox or actions
    const target = e.target as HTMLElement;
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('[data-actions]')
    ) {
      return;
    }
    onRowClick(campaign);
  };

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
        isSelected
          ? 'bg-amber-50 ring-2 ring-inset ring-amber-400'
          : index % 2 === 0
            ? 'bg-white'
            : 'bg-gray-50/50'
      }`}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      <td className="px-4 py-3 w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(campaign.id)}
          aria-label={`Select campaign ${campaign.name || campaign.title}`}
          className="h-4 w-4 rounded border-2 border-black text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
        />
      </td>

      {/* Campaign Name + Artist */}
      <td className="px-4 py-3 min-w-[200px]">
        <div className="font-black text-gray-900">{campaign.name}</div>
        {campaign.artist_name && (
          <div className="text-xs font-bold text-gray-500">
            {campaign.artist_name}
          </div>
        )}
      </td>

      {/* Platform */}
      <td className="px-4 py-3 w-28">
        {campaign.platform ? (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-black border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              platformColours[campaign.platform] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {campaign.platform}
          </span>
        ) : (
          <span className="text-gray-400 font-bold">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 w-28">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            statusColours[campaign.status]
          }`}
        >
          {campaign.status}
        </span>
      </td>

      {/* Health Score */}
      <td className="px-4 py-3 w-32">
        <HealthProgressBar score={campaign.performance_score} />
      </td>

      {/* Budget */}
      <td className="px-4 py-3 w-24">
        <span className="font-mono font-bold text-gray-900">
          {formatCurrency(campaign.budget)}
        </span>
      </td>

      {/* Success Rate */}
      <td className="px-4 py-3 w-24">
        <span
          className={`font-mono font-bold ${
            campaign.success_rate >= 70
              ? 'text-green-600'
              : campaign.success_rate >= 40
                ? 'text-amber-600'
                : 'text-gray-500'
          }`}
        >
          {campaign.success_rate}%
        </span>
      </td>

      {/* Open Rate (hidden on tablet) */}
      <td className="px-4 py-3 w-20 hidden xl:table-cell">
        <span className="font-mono font-bold text-gray-700">—</span>
      </td>

      {/* Reply Rate (hidden on tablet) */}
      <td className="px-4 py-3 w-20 hidden xl:table-cell">
        <span className="font-mono font-bold text-gray-700">—</span>
      </td>

      {/* Start Date */}
      <td className="px-4 py-3 w-28">
        <span className="text-sm font-bold text-gray-700">
          {formatDate(campaign.start_date)}
        </span>
      </td>

      {/* Client (hidden on tablet) */}
      <td className="px-4 py-3 w-32 hidden xl:table-cell">
        <span className="text-sm font-bold text-gray-600">
          {(campaign as any).client_name || '—'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 w-16 relative" data-actions>
        <div ref={actionsRef} className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            aria-label="Campaign actions menu"
            aria-expanded={showActions}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border-2 border-black shadow-brutal z-50 py-1 min-w-[140px]">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onRowClick(campaign);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-bold hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  // TODO: Edit functionality
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-bold hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  // TODO: Delete functionality
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-bold hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
