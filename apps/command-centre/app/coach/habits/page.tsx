/**
 * CoachOS Habits Page
 * Track and manage daily/weekly habits with streak tracking
 */

'use client';

import React, { useEffect, useState } from 'react';
import HabitCard from '../components/HabitCard';
import type { Habit } from '@total-audio/coach-os/habits';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'creative' | 'outreach' | 'wellness' | 'admin' | 'learning'>('all');

  // New habit form state
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'daily' as 'daily' | '3x_week' | 'weekly' | 'monthly',
    category: 'creative' as 'creative' | 'outreach' | 'wellness' | 'admin' | 'learning',
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/coach/habits');
      const data = await res.json();
      setHabits(data.habits || []);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newHabit.name.trim()) return;

    try {
      const res = await fetch('/api/coach/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit),
      });

      if (res.ok) {
        const data = await res.json();
        setHabits([data.habit, ...habits]);
        setNewHabit({ name: '', frequency: 'daily', category: 'creative' });
        setCreating(false);
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/coach/habits/${habitId}/complete`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        // Update habit in list
        setHabits(habits.map(h => h.id === habitId ? data.habit : h));
      }
    } catch (error) {
      console.error('Failed to complete habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      // TODO: Implement delete API endpoint
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const filteredHabits = habits.filter(h => filter === 'all' || h.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Habits</h1>
          <p className="text-white/60">
            Build consistency with daily habits. Track your streaks and stay motivated.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white/90">{habits.length}</div>
            <div className="text-sm text-white/50">Total Habits</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white/90">
              {Math.max(...habits.map(h => h.streak), 0)}
            </div>
            <div className="text-sm text-white/50">Longest Streak 🔥</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white/90">
              {habits.filter(h => h.streak > 0).length}
            </div>
            <div className="text-sm text-white/50">Active Streaks</div>
          </div>
        </div>

        {/* Filter and Create */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {(['all', 'creative', 'outreach', 'wellness', 'admin', 'learning'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-4 py-2 rounded-xl transition-all duration-240
                  ${filter === cat
                    ? 'bg-[#3AA9BE] text-white'
                    : 'border border-white/10 text-white/70 hover:border-white/20'
                  }
                `}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCreating(!creating)}
            className="
              bg-[#3AA9BE] text-white px-6 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:bg-[#3AA9BE]/80 hover:shadow-lg hover:shadow-[#3AA9BE]/20
            "
          >
            {creating ? 'Cancel' : '+ New Habit'}
          </button>
        </div>

        {/* Create habit form */}
        {creating && (
          <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Create New Habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="e.g., Write for 30 minutes"
                  className="
                    w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2
                    text-white/90 placeholder:text-white/40
                    focus:border-[#3AA9BE]/40 focus:outline-none
                  "
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Frequency</label>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                    className="
                      w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2
                      text-white/90 focus:border-[#3AA9BE]/40 focus:outline-none
                    "
                  >
                    <option value="daily">Daily</option>
                    <option value="3x_week">3x per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Category</label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as any })}
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
              </div>

              <button
                type="submit"
                className="
                  w-full bg-[#3AA9BE] text-white px-4 py-2 rounded-xl
                  font-medium transition-all duration-240
                  hover:bg-[#3AA9BE]/80
                "
              >
                Create Habit
              </button>
            </form>
          </div>
        )}

        {/* Habits list */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            {filter === 'all'
              ? 'No habits yet. Create your first habit to start building consistency.'
              : `No ${filter} habits yet.`
            }
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
