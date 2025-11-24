'use client';

/**
 * CoachSettingsForm Component
 * Configure coaching profile and preferences
 */

import React, { useState } from 'react';
import { CoachCard } from './CoachCard';

interface CoachSettingsFormProps {
  initialValues?: {
    role?: string;
    experienceLevel?: string;
    genre?: string;
    preferences?: any;
  };
  onSave?: (values: any) => Promise<void>;
}

export function CoachSettingsForm({
  initialValues,
  onSave,
}: CoachSettingsFormProps) {
  const [role, setRole] = useState(initialValues?.role || 'artist');
  const [experienceLevel, setExperienceLevel] = useState(
    initialValues?.experienceLevel || 'beginner'
  );
  const [genre, setGenre] = useState(initialValues?.genre || '');
  const [pacing, setPacing] = useState(
    initialValues?.preferences?.pacing || 'moderate'
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave({
        role,
        experienceLevel,
        genre,
        preferences: {
          pacing,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CoachCard title="Coaching Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Your Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-black/60 border border-white/10
              text-white/90
              focus:border-[#3AA9BE] focus:outline-none
              transition-colors duration-240
            "
          >
            <option value="artist">Artist</option>
            <option value="pr_agency">PR Agency</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Experience Level
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-black/60 border border-white/10
              text-white/90
              focus:border-[#3AA9BE] focus:outline-none
              transition-colors duration-240
            "
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Genre (if artist) */}
        {role === 'artist' && (
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Genre (optional)
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Electronic, Hip Hop, Indie"
              className="
                w-full px-4 py-3 rounded-xl
                bg-black/60 border border-white/10
                text-white/90 placeholder-white/30
                focus:border-[#3AA9BE] focus:outline-none
                transition-colors duration-240
              "
            />
          </div>
        )}

        {/* Pacing */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Coaching Pace
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['relaxed', 'moderate', 'intensive'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPacing(p)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-240
                  ${
                    pacing === p
                      ? 'bg-[#3AA9BE] text-black'
                      : 'bg-black/60 text-white/70 border border-white/10 hover:border-[#3AA9BE]/50'
                  }
                `}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/50">
            {pacing === 'relaxed' && '~4 hours/week, 5 tasks'}
            {pacing === 'moderate' && '~8 hours/week, 8 tasks'}
            {pacing === 'intensive' && '~12 hours/week, 10+ tasks'}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="
            w-full px-6 py-3 rounded-xl
            bg-[#3AA9BE] text-black font-medium
            hover:bg-[#3AA9BE]/90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-240 ease-out
            hover:shadow-lg hover:shadow-[#3AA9BE]/30
          "
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </CoachCard>
  );
}
