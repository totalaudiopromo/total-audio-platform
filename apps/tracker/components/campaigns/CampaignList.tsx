'use client';

import { useState } from 'react';
import { CampaignModal } from './CampaignModal';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  genre: string;
  start_date: string;
  budget: number;
  target_reach: number;
  actual_reach: number;
  status: string;
  notes?: string;
}

export function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      router.refresh();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    } finally {
      setDeletingId(null);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg mb-4">No campaigns yet</p>
        <p className="text-slate-400">Create your first campaign to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const roi = campaign.actual_reach > 0 && campaign.target_reach > 0
            ? ((campaign.actual_reach - campaign.target_reach) / campaign.target_reach) * 100
            : 0;

          return (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-900">{campaign.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold uppercase">
                    {campaign.platform}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-slate-600">
                  <span>Started: {format(new Date(campaign.start_date), 'MMM d, yyyy')}</span>
                  <span>Budget: £{campaign.budget}</span>
                  <span>Target: {campaign.target_reach.toLocaleString()}</span>
                  {campaign.actual_reach > 0 && (
                    <span className={roi >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      ROI: {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCampaign(campaign)}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  disabled={deletingId === campaign.id}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === campaign.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingCampaign && (
        <CampaignModal
          isOpen={true}
          onClose={() => setEditingCampaign(null)}
          campaign={editingCampaign}
        />
      )}
    </>
  );
}
