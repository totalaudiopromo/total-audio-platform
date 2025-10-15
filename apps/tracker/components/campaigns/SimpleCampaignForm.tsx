'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const PLATFORMS = [
  { value: 'radio', label: 'Radio' },
  { value: 'playlist', label: 'Playlists' },
  { value: 'blog', label: 'Blog' },
  { value: 'pr', label: 'PR' }
];
const GENRES = ['Electronic', 'Indie', 'Jazz', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Other'];

interface FormData {
  name: string;
  platform: string;
  genre: string;
  budget: number;
  start_date: string;
  end_date?: string;
  target_reach: number;
  actual_reach: number;
  notes?: string;
}

export function SimpleCampaignForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    platform: '',
    genre: '',
    budget: 0,
    start_date: new Date().toISOString().split('T')[0],
    target_reach: 0,
    actual_reach: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Campaign Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Bloodshot - Radio Push"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform *
          </label>
          <select
            required
            value={formData.platform}
            onChange={e => setFormData({ ...formData, platform: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Select platform</option>
            {PLATFORMS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre *
          </label>
          <select
            required
            value={formData.genre}
            onChange={e => setFormData({ ...formData, genre: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Select genre</option>
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget (£) *
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date (optional)
          </label>
          <input
            type="date"
            value={formData.end_date || ''}
            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Reach *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.target_reach}
            onChange={e => setFormData({ ...formData, target_reach: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 20 stations"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">How many contacts you're pitching to</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual Reach
          </label>
          <input
            type="number"
            min="0"
            value={formData.actual_reach}
            onChange={e => setFormData({ ...formData, actual_reach: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 6 stations"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">How many actually responded/played it</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Any additional details about this campaign"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
}
