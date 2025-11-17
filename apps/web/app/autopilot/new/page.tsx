/**
 * Create New Mission Page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMissionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mode: 'suggest' as 'suggest' | 'semi_auto' | 'full_auto',
    genres: [] as string[],
    territories: [] as string[],
    maxContacts: 500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Submit to API
    // const response = await fetch('/api/autopilot/missions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
    // const mission = await response.json();
    // router.push(`/autopilot/${mission.id}`);

    router.push('/autopilot');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Create New Mission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Mission Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none"
              placeholder="e.g., Album Launch Campaign"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none"
              placeholder="Campaign objectives and notes"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Operation Mode *
            </label>
            <select
              value={formData.mode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mode: e.target.value as 'suggest' | 'semi_auto' | 'full_auto',
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none"
            >
              <option value="suggest">Suggest (human approval required)</option>
              <option value="semi_auto">Semi-auto (safe actions auto-run)</option>
              <option value="full_auto">Full-auto (trusted automation)</option>
            </select>
            <p className="mt-2 text-sm text-slate-400">
              Suggest mode requires approval for all external actions
            </p>
          </div>

          {/* Max Contacts */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Max Contacts
            </label>
            <input
              type="number"
              value={formData.maxContacts}
              onChange={(e) =>
                setFormData({ ...formData, maxContacts: parseInt(e.target.value) })
              }
              min={1}
              max={1000}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-slate-700 px-6 py-3 text-white transition-all duration-240 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#3AA9BE] px-6 py-3 font-semibold text-white transition-all duration-240 hover:bg-[#3AA9BE]/90"
            >
              Create Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
