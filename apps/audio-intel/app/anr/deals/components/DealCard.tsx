'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScorePill } from '../../components/ScorePill';
import { StatusBadge } from '../../components/shared';
import { DealModal } from './DealModal';

interface Deal {
  id: string;
  artist_slug: string;
  stage: string;
  probability?: number;
  priority?: string;
  notes?: string;
  last_update?: string;
}

interface DealCardProps {
  deal: Deal;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function DealCard({ deal, isDragging, onDragStart, onDragEnd }: DealCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "group bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 cursor-move hover:border-slate-600/50 transition-all duration-200",
          isDragging && "opacity-50 scale-95",
          !isDragging && "hover:scale-[1.02] hover:shadow-lg"
        )}
      >
        {/* Artist Name */}
        <h4 className="font-medium text-slate-100 mb-2 group-hover:text-[#3AA9BE] transition-colors">
          {deal.artist_slug}
        </h4>

        {/* Probability */}
        {deal.probability !== undefined && (
          <div className="mb-3">
            <ScorePill score={deal.probability} size="sm" />
          </div>
        )}

        {/* Priority */}
        {deal.priority && (
          <div className="mb-2">
            <StatusBadge
              status={deal.priority}
              variant={
                deal.priority === 'high' ? 'error' :
                deal.priority === 'medium' ? 'warning' :
                'default'
              }
            />
          </div>
        )}

        {/* Notes Preview */}
        {deal.notes && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-2">{deal.notes}</p>
        )}

        {/* Last Update */}
        {deal.last_update && (
          <p className="text-xs text-slate-600 font-mono mt-3">
            {new Date(deal.last_update).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && (
        <DealModal
          dealId={deal.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
