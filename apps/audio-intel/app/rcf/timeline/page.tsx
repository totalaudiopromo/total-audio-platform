/**
 * RCF Timeline Page
 * Comprehensive artist event timeline with chronological visualization
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TimelineChart } from './components/TimelineChart';

interface TimelineDay {
  date: string;
  events: any[];
  event_count: number;
  total_weight: number;
}

export default function RCFTimelinePage() {
  const [artistSlug, setArtistSlug] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTimeline() {
    if (!inputValue.trim()) {
      setError('Please enter an artist slug');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setArtistSlug(inputValue.trim());

      const response = await fetch(`/api/rcf/timeline/${encodeURIComponent(inputValue.trim())}`);
      const result = await response.json();

      if (result.success) {
        setTimeline(result.data);
      } else {
        setError('Failed to load timeline');
      }
    } catch (err) {
      console.error('Failed to fetch timeline:', err);
      setError('Failed to load timeline. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      loadTimeline();
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/rcf"
            className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors duration-240"
          >
            ← Back to Feed
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Artist Timeline</h1>
          <p className="text-sm text-slate-400 mt-1">
            Visualize coverage events chronologically for any artist
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Search input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300 font-mono">
              Artist Slug
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., rising-artist, breakout-band, new-voice"
                className="
                  flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3
                  text-slate-100 placeholder-slate-500 font-mono
                  focus:border-[#3AA9BE] focus:outline-none
                  transition-colors duration-240
                "
              />
              <button
                onClick={loadTimeline}
                disabled={loading}
                className="
                  px-6 py-3 bg-[#3AA9BE] text-white rounded-lg font-medium
                  transition-all duration-240 ease-out
                  hover:bg-[#3AA9BE]/80
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {loading ? 'Loading...' : 'Load Timeline'}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Timeline display */}
          {!loading && !artistSlug && (
            <div className="text-center py-12 text-slate-400">
              <div className="text-lg mb-2">Ready to explore</div>
              <div className="text-sm">Enter an artist slug above to view their coverage timeline</div>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse text-[#3AA9BE]">
                Loading timeline for {inputValue}...
              </div>
            </div>
          )}

          {!loading && artistSlug && (
            <TimelineChart timeline={timeline} artistSlug={artistSlug} />
          )}
        </div>
      </main>
    </div>
  );
}
