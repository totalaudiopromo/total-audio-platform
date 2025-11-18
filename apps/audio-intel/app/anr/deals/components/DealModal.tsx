'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../../components/shared';
import { ScorePill } from '../../components/ScorePill';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DealModalProps {
  dealId: string;
  onClose: () => void;
}

export function DealModal({ dealId, onClose }: DealModalProps) {
  const [deal, setDeal] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeal() {
      try {
        const res = await fetch(`/api/anr/deals/${dealId}`);
        if (res.ok) {
          const data = await res.json();
          setDeal(data.deal);
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Failed to load deal:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDeal();
  }, [dealId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-slate-100">
            {deal ? deal.artist_slug : 'Loading...'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : deal ? (
            <div className="space-y-6">
              {/* Deal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Stage</p>
                  <p className="text-base font-medium text-slate-100 capitalize">
                    {deal.stage.replace('_', ' ')}
                  </p>
                </div>

                {deal.probability !== undefined && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Probability</p>
                    <ScorePill score={deal.probability} />
                  </div>
                )}

                {deal.priority && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Priority</p>
                    <p className="text-base font-medium text-slate-100 capitalize">{deal.priority}</p>
                  </div>
                )}

                {deal.last_update && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Last Update</p>
                    <p className="text-base font-medium text-slate-100 font-mono">
                      {new Date(deal.last_update).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {deal.notes && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Notes</p>
                  <p className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    {deal.notes}
                  </p>
                </div>
              )}

              {/* Event Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Event Timeline</h3>
                {events.length === 0 ? (
                  <p className="text-sm text-slate-500">No events yet</p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30"
                      >
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#3AA9BE]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-200 mb-1">{event.event_type}</p>
                          <p className="text-xs text-slate-500 font-mono">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">Failed to load deal</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
