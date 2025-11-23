'use client';

import { useState, useTransition } from 'react';
import { DealCard } from './DealCard';
import { EmptyState } from '../../components/shared';
import { updateDealStage } from '../actions';
import { cn } from '@/lib/utils';

const DEAL_STAGES = [
  { key: 'light_interest', label: 'Light Interest' },
  { key: 'serious', label: 'Serious' },
  { key: 'offer_made', label: 'Offer Made' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'signed', label: 'Signed' },
  { key: 'lost', label: 'Lost' },
] as const;

interface Deal {
  id: string;
  artist_slug: string;
  stage: string;
  probability?: number;
  priority?: string;
  notes?: string;
  last_update?: string;
}

interface DealBoardProps {
  initialDeals: Deal[];
}

export function DealBoard({ initialDeals }: DealBoardProps) {
  const [deals, setDeals] = useState(initialDeals);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedDeals = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage.key] = deals.filter((deal) => deal.stage === stage.key);
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedDealId) return;

    const deal = deals.find((d) => d.id === draggedDealId);
    if (!deal || deal.stage === newStage) return;

    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d.id === draggedDealId ? { ...d, stage: newStage } : d))
    );

    // Server update
    startTransition(async () => {
      const result = await updateDealStage(draggedDealId, newStage);

      if (!result.success) {
        // Revert on error
        setDeals((prev) =>
          prev.map((d) => (d.id === draggedDealId ? { ...d, stage: deal.stage } : d))
        );
        alert('Failed to update deal stage');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
      {DEAL_STAGES.map((stage) => (
        <div
          key={stage.key}
          className={cn(
            "min-w-[280px] bg-slate-900/30 border border-slate-800/50 rounded-xl p-4",
            dragOverColumn === stage.key && "ring-2 ring-[#3AA9BE]/50 border-[#3AA9BE]/50"
          )}
          onDragOver={(e) => handleDragOver(e, stage.key)}
          onDrop={(e) => handleDrop(e, stage.key)}
        >
          {/* Column Header */}
          <div className="mb-4">
            <h3 className="font-semibold text-slate-100 mb-1">{stage.label}</h3>
            <p className="text-xs text-slate-500 font-mono">
              {groupedDeals[stage.key].length} {groupedDeals[stage.key].length === 1 ? 'deal' : 'deals'}
            </p>
          </div>

          {/* Deal Cards */}
          <div className="space-y-3">
            {groupedDeals[stage.key].length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-600">No deals</p>
              </div>
            ) : (
              groupedDeals[stage.key].map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  isDragging={draggedDealId === deal.id}
                  onDragStart={() => handleDragStart(deal.id)}
                  onDragEnd={handleDragEnd}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
