/**
 * Create New Mission Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  listBlueprints,
  loadBlueprint,
  type MissionBlueprint,
} from '@total-audio/pr-autopilot/blueprints/blueprintEngine';

export default function NewMissionPage() {
  const router = useRouter();
  const [availableBlueprints] = useState<MissionBlueprint[]>(listBlueprints());
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('');
  const [blueprintDetails, setBlueprintDetails] = useState<MissionBlueprint | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mode: 'suggest' as 'suggest' | 'semi_auto' | 'full_auto',
    genres: [] as string[],
    territories: [] as string[],
    maxContacts: 500,
    blueprint: '',
  });

  // Load blueprint details when selected
  useEffect(() => {
    if (selectedBlueprint) {
      const blueprint = loadBlueprint(selectedBlueprint);
      setBlueprintDetails(blueprint);

      // Auto-populate form with blueprint defaults
      if (blueprint) {
        setFormData(prev => ({
          ...prev,
          mode: blueprint.recommendedMode,
          maxContacts: blueprint.constraints.maxContacts,
          description: blueprint.description,
          blueprint: selectedBlueprint,
        }));
      }
    } else {
      setBlueprintDetails(null);
      setFormData(prev => ({
        ...prev,
        blueprint: '',
      }));
    }
  }, [selectedBlueprint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Create the mission
      const response = await fetch('/api/autopilot/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create mission');
      }

      const mission = await response.json();

      // Step 2: Apply blueprint if selected
      if (selectedBlueprint && mission.id) {
        const blueprintResponse = await fetch(`/api/autopilot/missions/${mission.id}/apply-blueprint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blueprintName: selectedBlueprint }),
        });

        if (!blueprintResponse.ok) {
          console.error('Failed to apply blueprint, but mission was created');
        }
      }

      // Step 3: Navigate to mission cockpit
      router.push(`/autopilot/${mission.id}`);
    } catch (error) {
      console.error('Error creating mission:', error);
      alert('Failed to create mission. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Create New Mission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blueprint Selection */}
          <div className="rounded-2xl border-2 border-[#3AA9BE]/30 bg-slate-800/50 p-6">
            <label className="mb-2 block text-sm font-medium text-white">
              Campaign Blueprint (Optional)
            </label>
            <select
              value={selectedBlueprint}
              onChange={(e) => setSelectedBlueprint(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-[#3AA9BE] focus:outline-none"
            >
              <option value="">Custom Mission (No Blueprint)</option>
              {availableBlueprints.map((bp) => (
                <option key={bp.name} value={bp.name.toLowerCase().replace(/\s+/g, '_')}>
                  {bp.name} ({bp.estimatedDuration})
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-slate-400">
              Choose a pre-configured campaign template or create a custom mission
            </p>

            {/* Blueprint Details Preview */}
            {blueprintDetails && (
              <div className="mt-4 space-y-3 rounded-xl border border-[#3AA9BE]/20 bg-slate-900/50 p-4">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[#3AA9BE]">
                    {blueprintDetails.name}
                  </h3>
                  <p className="text-sm text-slate-300">{blueprintDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Duration:</span>{' '}
                    <span className="text-white">{blueprintDetails.estimatedDuration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tasks:</span>{' '}
                    <span className="text-white">{blueprintDetails.tasks.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Max Contacts:</span>{' '}
                    <span className="text-white">{blueprintDetails.constraints.maxContacts}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Mode:</span>{' '}
                    <span className="text-white capitalize">
                      {blueprintDetails.recommendedMode.replace('_', '-')}
                    </span>
                  </div>
                </div>

                {/* Phases */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Campaign Phases
                  </h4>
                  <div className="space-y-2">
                    {blueprintDetails.phases.map((phase, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#3AA9BE]" />
                        <div>
                          <span className="font-medium text-white">{phase.name}</span>
                          <span className="text-slate-400"> ({phase.duration})</span>
                          <p className="text-xs text-slate-400">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {blueprintDetails.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-[#3AA9BE]/10 px-2 py-1 text-xs text-[#3AA9BE]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

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
