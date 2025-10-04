'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: any;
}

const PLATFORMS = ['BBC Radio', 'Commercial Radio', 'Playlists', 'Blogs', 'Social', 'PR'];
const GENRES = ['Electronic', 'Indie', 'Jazz', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Folk', 'Classical', 'Other'];

export function CampaignModal({ isOpen, onClose, campaign }: CampaignModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    artist_name: campaign?.artist_name || '',
    platform: campaign?.platform || 'BBC Radio',
    genre: campaign?.genre || 'Electronic',
    start_date: campaign?.start_date || new Date().toISOString().split('T')[0],
    budget: campaign?.budget || '',
    target_reach: campaign?.target_reach || '',
    target_type: campaign?.target_type || '',
    actual_reach: campaign?.actual_reach || '',
    status: campaign?.status || 'active',
    notes: campaign?.notes || '',
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (!campaign) {
        setFormData({
          name: '',
          artist_name: '',
          platform: 'BBC Radio',
          genre: 'Electronic',
          start_date: new Date().toISOString().split('T')[0],
          budget: '',
          target_reach: '',
          target_type: '',
          actual_reach: '',
          status: 'active',
          notes: '',
        });
      }
    }
  }, [isOpen, campaign]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = campaign ? `/api/campaigns/${campaign.id}` : '/api/campaigns';
      const method = campaign ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to save campaign';
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.error === 'string') {
            errorMessage = errorBody.error;
          }
        } catch (jsonError) {
          console.error('Non-JSON error response');
        }
        throw new Error(errorMessage);
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error saving campaign:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to save campaign');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border-4 border-black shadow-brutal-xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-blue-600 px-6 md:px-8 py-6 border-b-4 border-black rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {campaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <p className="text-sm font-bold text-blue-100 mt-1">
                {campaign ? 'Update your campaign details' : 'Track your music promotion campaign'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors text-2xl font-black leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              placeholder="Summer Radio Push"
            />
          </div>

          {/* Artist Name */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
              Artist/Band Name
            </label>
            <input
              type="text"
              value={formData.artist_name}
              onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
              className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              placeholder="The Audio Dogs"
            />
          </div>

          {/* Platform & Genre Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Platform *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Genre *
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
              >
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget & Start Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Budget (£) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {/* Target Type & Target Reach Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Target Type
              </label>
              <input
                type="text"
                value={formData.target_type}
                onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                placeholder="Radio Stations / Playlists / Blogs"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
                Target Reach *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.target_reach}
                onChange={(e) => setFormData({ ...formData, target_reach: e.target.value })}
                className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                placeholder="20"
              />
              <p className="text-xs font-bold text-gray-600 mt-1">How many contacts will you pitch to?</p>
            </div>
          </div>

          {/* Actual Reach (for updates) */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
              Actual Reach (Results)
            </label>
            <input
              type="number"
              min="0"
              value={formData.actual_reach}
              onChange={(e) => setFormData({ ...formData, actual_reach: e.target.value })}
              className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              placeholder="0"
            />
            <p className="text-xs font-bold text-gray-600 mt-1">
              How many positive responses did you get? Update this as results come in.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
              Campaign Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-4 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
              placeholder="Track progress, contacts pitched, special notes..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t-4 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border-4 border-black text-gray-900 rounded-xl font-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? 'Saving...' : campaign ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
