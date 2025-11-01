'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const PLATFORMS = [
  { value: 'radio', label: 'Radio' },
  { value: 'playlist', label: 'Playlists' },
  { value: 'blog', label: 'Blog' },
  { value: 'pr', label: 'PR' },
];
const GENRES = [
  'Electronic',
  'Indie',
  'Jazz',
  'Pop',
  'Rock',
  'Hip-Hop',
  'R&B',
  'Country',
  'Other',
];

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
  // Agency/Multi-client fields
  client_name?: string;
  client_company?: string;
  client_email?: string;
  client_billing_code?: string;
}

export function SimpleCampaignForm({
  onSubmit,
  onCancel,
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
      {/* Agency Client Fields (Airtable-style collapsible section) */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-black text-blue-900 uppercase tracking-wide">
            Agency Client Info (Optional)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-blue-900 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.client_name || ''}
              onChange={e =>
                setFormData({ ...formData, client_name: e.target.value })
              }
              placeholder="e.g., Royal Blood"
              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-900 mb-1">
              Company/Label
            </label>
            <input
              type="text"
              value={formData.client_company || ''}
              onChange={e =>
                setFormData({ ...formData, client_company: e.target.value })
              }
              placeholder="e.g., Warner Records"
              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-900 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={formData.client_email || ''}
              onChange={e =>
                setFormData({ ...formData, client_email: e.target.value })
              }
              placeholder="e.g., manager@artistemail.com"
              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-900 mb-1">
              Billing Code
            </label>
            <input
              type="text"
              value={formData.client_billing_code || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  client_billing_code: e.target.value,
                })
              }
              placeholder="e.g., RB-2024-Q4"
              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <p className="text-xs text-blue-700 mt-2 font-medium italic">
          💡 Add client info to track multiple artists separately and generate
          client-specific reports
        </p>
      </div>

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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
            onChange={e =>
              setFormData({ ...formData, platform: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
          >
            <option value="">Select platform</option>
            {PLATFORMS.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
          >
            <option value="">Select genre</option>
            {GENRES.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
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
          onChange={e =>
            setFormData({
              ...formData,
              budget: parseFloat(e.target.value) || 0,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
            onChange={e =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date (optional)
          </label>
          <input
            type="date"
            value={formData.end_date || ''}
            onChange={e =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
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
            onChange={e =>
              setFormData({
                ...formData,
                target_reach: parseInt(e.target.value) || 0,
              })
            }
            placeholder="e.g., 20 stations"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
          />
          <p className="text-xs text-gray-500 mt-1">
            How many contacts you're pitching to
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual Reach
          </label>
          <input
            type="number"
            min="0"
            value={formData.actual_reach}
            onChange={e =>
              setFormData({
                ...formData,
                actual_reach: parseInt(e.target.value) || 0,
              })
            }
            placeholder="e.g., 6 stations"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-[#14B8A6]"
          />
          <p className="text-xs text-gray-500 mt-1">
            How many actually responded/played it
          </p>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
          className="bg-[#14B8A6] hover:bg-[#0F9488] text-white"
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
}
