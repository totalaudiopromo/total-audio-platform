/**
 * RCF Settings Page
 *
 * Configure RCF subscription preferences
 */

'use client';

import { useState, useEffect } from 'react';
import type { RCFSubscription, RCFEventType } from '@total-audio/rcf/types';
import Link from 'next/link';

const ALL_EVENT_TYPES: { value: RCFEventType; label: string; description: string }[] = [
  {
    value: 'playlist_add',
    label: 'Playlist Adds',
    description: 'New playlist features and curator activity',
  },
  {
    value: 'press_feature',
    label: 'Press Features',
    description: 'Magazine and online publication coverage',
  },
  { value: 'radio_spin', label: 'Radio Spins', description: 'Radio plays and show features' },
  { value: 'blog_post', label: 'Blog Posts', description: 'Blog coverage and mentions' },
  {
    value: 'scene_pulse_change',
    label: 'Scene Pulse Changes',
    description: 'Shifts in scene momentum and activity',
  },
  {
    value: 'scene_trend_spike',
    label: 'Scene Trend Spikes',
    description: 'Rapid growth in scene metrics',
  },
  {
    value: 'mig_connection',
    label: 'MIG Connections',
    description: 'New network relationships detected',
  },
  {
    value: 'campaign_event',
    label: 'Campaign Events',
    description: 'Campaign milestones and progress',
  },
  {
    value: 'tracker_event',
    label: 'Tracker Events',
    description: 'Campaign tracking activities',
  },
  {
    value: 'autopilot_event',
    label: 'Autopilot Events',
    description: 'Automated campaign actions',
  },
  {
    value: 'coverage_spike',
    label: 'Coverage Spikes',
    description: 'Sudden increases in media attention',
  },
  {
    value: 'creative_breakthrough',
    label: 'Creative Breakthroughs',
    description: 'Significant creative discoveries',
  },
  {
    value: 'community_activity',
    label: 'Community Activity',
    description: 'Engagement and community signals',
  },
];

export default function RCFSettingsPage() {
  const [subscription, setSubscription] = useState<RCFSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<RCFEventType[]>([]);

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    try {
      const response = await fetch('/api/rcf/subscriptions');
      const result = await response.json();

      if (result.success) {
        setSubscription(result.data);
        setSelectedTypes(result.data.subscribed_types);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSubscription() {
    try {
      setSaving(true);

      const response = await fetch('/api/rcf/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscribed_types: selectedTypes,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscription(result.data);
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save subscription:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  function toggleType(type: RCFEventType) {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  }

  function selectAll() {
    setSelectedTypes(ALL_EVENT_TYPES.map((t) => t.value));
  }

  function clearAll() {
    setSelectedTypes([]);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-slate-100">
        <div className="text-slate-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/rcf"
                className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80"
              >
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">RCF Settings</h1>
            </div>

            <button
              onClick={saveSubscription}
              disabled={saving}
              className="rounded-lg bg-[#3AA9BE] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3AA9BE]/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl space-y-8">
          {/* Event Types */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Event Types</h2>
                <p className="text-sm text-slate-400">
                  Choose which types of events to include in your feed
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80"
                >
                  Select All
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={clearAll}
                  className="text-sm text-slate-400 hover:text-slate-300"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {ALL_EVENT_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[#3AA9BE]/50 bg-[#3AA9BE]/10'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">{type.label}</div>
                        <div className="mt-1 text-sm text-slate-400">{type.description}</div>
                      </div>
                      <div
                        className={`mt-1 h-5 w-5 flex-shrink-0 rounded border-2 transition-colors ${
                          isSelected
                            ? 'border-[#3AA9BE] bg-[#3AA9BE]'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="h-full w-full text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Future: Artist and Scene subscriptions */}
          <section className="rounded-lg border border-slate-800 bg-slate-900/30 p-6">
            <h2 className="text-lg font-semibold">Coming Soon</h2>
            <p className="mt-2 text-sm text-slate-400">
              Filter by specific artists and scenes to create a personalized feed
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
