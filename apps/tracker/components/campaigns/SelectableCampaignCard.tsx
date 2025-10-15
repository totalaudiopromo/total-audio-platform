'use client';

import { CampaignCardWithIntel } from './CampaignCardWithIntel';
import { CheckSquare, Square } from 'lucide-react';
import type { Campaign } from '@/lib/types/tracker';

interface SelectableCampaignCardProps {
  campaign: Campaign & { insights?: string[] };
  integrations?: any[];
  isSelected: boolean;
  isSelectionMode: boolean;
  onToggleSelect: (id: string) => void;
}

export function SelectableCampaignCard({
  campaign,
  integrations,
  isSelected,
  isSelectionMode,
  onToggleSelect,
}: SelectableCampaignCardProps) {
  return (
    <div className="relative">
      {/* Selection Checkbox Overlay */}
      {isSelectionMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(campaign.id);
          }}
          className={`absolute top-4 left-4 z-10 p-2 rounded-xl transition-all border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 ${
            isSelected
              ? 'bg-amber-600 border-amber-800'
              : 'bg-white border-gray-300 hover:border-gray-400'
          }`}
          aria-label={isSelected ? 'Deselect campaign' : 'Select campaign'}
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-white" />
          ) : (
            <Square className="h-5 w-5 text-gray-600" />
          )}
        </button>
      )}

      {/* Campaign Card */}
      <div className={`transition-all ${isSelectionMode ? 'pl-16' : ''} ${isSelected ? 'ring-4 ring-amber-500 ring-offset-4' : ''}`}>
        <CampaignCardWithIntel
          campaign={campaign}
          integrations={integrations}
        />
      </div>
    </div>
  );
}
