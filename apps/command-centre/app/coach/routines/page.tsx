/**
 * CoachOS Routines Page
 * Create and manage reusable routine templates
 */

'use client';

import React, { useEffect, useState } from 'react';
import RoutineCard from '../components/RoutineCard';
import type { Routine, RoutineStep } from '@total-audio/coach-os/routines';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [presetRoutines, setPresetRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // New routine form state
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    category: 'creative' as 'creative' | 'outreach' | 'wellness' | 'admin' | 'learning',
    steps: [] as RoutineStep[],
  });

  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    duration_minutes: 30,
  });

  useEffect(() => {
    fetchRoutines();
    fetchPresets();
  }, []);

  const fetchRoutines = async () => {
    try {
      const res = await fetch('/api/coach/routines');
      const data = await res.json();
      setRoutines(data.routines || []);
    } catch (error) {
      console.error('Failed to fetch routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresets = async () => {
    try {
      const res = await fetch('/api/coach/routines?presets=true');
      const data = await res.json();
      setPresetRoutines(data.routines || []);
    } catch (error) {
      console.error('Failed to fetch preset routines:', error);
    }
  };

  const handleAddStep = () => {
    if (!newStep.title.trim()) return;

    setNewRoutine({
      ...newRoutine,
      steps: [...newRoutine.steps, { ...newStep }],
    });

    setNewStep({ title: '', description: '', duration_minutes: 30 });
  };

  const handleRemoveStep = (index: number) => {
    setNewRoutine({
      ...newRoutine,
      steps: newRoutine.steps.filter((_, i) => i !== index),
    });
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoutine.name.trim() || newRoutine.steps.length === 0) {
      alert('Routine must have a name and at least one step');
      return;
    }

    try {
      const res = await fetch('/api/coach/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoutine),
      });

      if (res.ok) {
        const data = await res.json();
        setRoutines([data.routine, ...routines]);
        setNewRoutine({ name: '', description: '', category: 'creative', steps: [] });
        setCreating(false);
      }
    } catch (error) {
      console.error('Failed to create routine:', error);
    }
  };

  const handleApplyPreset = async (preset: any) => {
    try {
      const res = await fetch('/api/coach/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset),
      });

      if (res.ok) {
        const data = await res.json();
        setRoutines([data.routine, ...routines]);
      }
    } catch (error) {
      console.error('Failed to apply preset:', error);
    }
  };

  const handleApplyToWeeklyPlan = async (routineId: string) => {
    // TODO: Implement weekly plan integration
    alert('Weekly plan integration coming soon!');
  };

  const handleDeleteRoutine = async (routineId: string) => {
    if (!confirm('Are you sure you want to delete this routine?')) return;

    try {
      // TODO: Implement delete API endpoint
      setRoutines(routines.filter(r => r.id !== routineId));
    } catch (error) {
      console.error('Failed to delete routine:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading routines...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Routines</h1>
          <p className="text-white/60">
            Create reusable workflows to streamline your creative and promotional work.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setCreating(!creating)}
            className="
              bg-[#3AA9BE] text-white px-6 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:bg-[#3AA9BE]/80 hover:shadow-lg hover:shadow-[#3AA9BE]/20
            "
          >
            {creating ? 'Cancel' : '+ New Routine'}
          </button>

          <button
            onClick={() => setShowPresets(!showPresets)}
            className="
              border border-white/10 text-white/70 px-6 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:border-white/20 hover:text-white/90
            "
          >
            {showPresets ? 'Hide Presets' : '📋 Browse Presets'}
          </button>
        </div>

        {/* Preset routines */}
        {showPresets && presetRoutines.length > 0 && (
          <div className="mb-8 bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Preset Routines</h3>
            <div className="space-y-4">
              {presetRoutines.map((preset, index) => (
                <div
                  key={index}
                  className="bg-black/20 border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white/90 font-medium">{preset.name}</h4>
                      <p className="text-sm text-white/60 mt-1">{preset.description}</p>
                      <div className="text-xs text-white/50 mt-2">
                        {preset.steps.length} steps • {preset.category}
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyPreset(preset)}
                      className="
                        bg-[#3AA9BE]/20 text-[#3AA9BE] px-4 py-2 rounded-lg
                        text-sm font-medium transition-all duration-240
                        hover:bg-[#3AA9BE]/30 border border-[#3AA9BE]/20
                      "
                    >
                      Use This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create routine form */}
        {creating && (
          <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Create New Routine</h3>
            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Routine Name</label>
                <input
                  type="text"
                  value={newRoutine.name}
                  onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                  placeholder="e.g., Morning Creative Session"
                  className="
                    w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2
                    text-white/90 placeholder:text-white/40
                    focus:border-[#3AA9BE]/40 focus:outline-none
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Description (optional)</label>
                <textarea
                  value={newRoutine.description}
                  onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                  placeholder="Describe what this routine is for..."
                  rows={2}
                  className="
                    w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2
                    text-white/90 placeholder:text-white/40
                    focus:border-[#3AA9BE]/40 focus:outline-none
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Category</label>
                <select
                  value={newRoutine.category}
                  onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value as any })}
                  className="
                    w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2
                    text-white/90 focus:border-[#3AA9BE]/40 focus:outline-none
                  "
                >
                  <option value="creative">Creative</option>
                  <option value="outreach">Outreach</option>
                  <option value="wellness">Wellness</option>
                  <option value="admin">Admin</option>
                  <option value="learning">Learning</option>
                </select>
              </div>

              {/* Steps */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Steps ({newRoutine.steps.length})
                </label>

                {newRoutine.steps.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {newRoutine.steps.map((step, index) => (
                      <div
                        key={index}
                        className="bg-black/20 border border-white/5 rounded-lg p-3 flex items-start gap-3"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white/90">{step.title}</div>
                          {step.description && (
                            <div className="text-xs text-white/60 mt-1">{step.description}</div>
                          )}
                          {step.duration_minutes && (
                            <div className="text-xs text-white/50 mt-1">{step.duration_minutes} min</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add step form */}
                <div className="bg-black/20 border border-white/5 rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    value={newStep.title}
                    onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                    placeholder="Step title"
                    className="
                      w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm
                      text-white/90 placeholder:text-white/40
                      focus:border-[#3AA9BE]/40 focus:outline-none
                    "
                  />
                  <input
                    type="text"
                    value={newStep.description}
                    onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    placeholder="Step description (optional)"
                    className="
                      w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm
                      text-white/90 placeholder:text-white/40
                      focus:border-[#3AA9BE]/40 focus:outline-none
                    "
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={newStep.duration_minutes}
                      onChange={(e) => setNewStep({ ...newStep, duration_minutes: parseInt(e.target.value) })}
                      placeholder="Duration (minutes)"
                      min="1"
                      className="
                        flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm
                        text-white/90 placeholder:text-white/40
                        focus:border-[#3AA9BE]/40 focus:outline-none
                      "
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="
                        bg-[#3AA9BE]/20 text-[#3AA9BE] px-4 py-2 rounded-lg text-sm
                        font-medium transition-all duration-240 hover:bg-[#3AA9BE]/30
                      "
                    >
                      + Add Step
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="
                  w-full bg-[#3AA9BE] text-white px-4 py-2 rounded-xl
                  font-medium transition-all duration-240
                  hover:bg-[#3AA9BE]/80
                "
                disabled={newRoutine.steps.length === 0}
              >
                Create Routine
              </button>
            </form>
          </div>
        )}

        {/* Routines list */}
        {routines.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            No routines yet. Create your first routine or browse presets to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onApplyToWeeklyPlan={handleApplyToWeeklyPlan}
                onDelete={handleDeleteRoutine}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
