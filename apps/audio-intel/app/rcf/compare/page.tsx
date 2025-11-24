/**
 * RCF Compare Page
 * Multi-artist comparison with side-by-side metrics and radar visualization
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { ComparisonRadar } from './components/ComparisonRadar';

interface ArtistComparison {
  artist_slug: string;
  event_count: number;
  total_weight: number;
  avg_weight: number;
  velocity: number;
  event_type_distribution: Record<string, number>;
  coverage_quality_score: number;
}

export default function RCFComparePage() {
  const [artistSlugs, setArtistSlugs] = useState<string[]>(['', '']);
  const [comparisons, setComparisons] = useState<ArtistComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'radar'>('table');

  function updateArtistSlug(index: number, value: string) {
    const updated = [...artistSlugs];
    updated[index] = value;
    setArtistSlugs(updated);
  }

  function addArtistSlot() {
    if (artistSlugs.length < 5) {
      setArtistSlugs([...artistSlugs, '']);
    }
  }

  function removeArtistSlot(index: number) {
    if (artistSlugs.length > 2) {
      const updated = artistSlugs.filter((_, idx) => idx !== index);
      setArtistSlugs(updated);
    }
  }

  async function runComparison() {
    const validSlugs = artistSlugs.filter((slug) => slug.trim() !== '');

    if (validSlugs.length < 2) {
      setError('Please enter at least 2 artist slugs to compare');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/rcf/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artists: validSlugs }),
      });

      const result = await response.json();

      if (result.success) {
        setComparisons(result.data);
      } else {
        setError('Failed to run comparison');
      }
    } catch (err) {
      console.error('Failed to compare artists:', err);
      setError('Failed to run comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Prepare radar data
  const radarMetrics = comparisons.length > 0 ? [
    {
      label: 'Event Count',
      values: comparisons.map((c) => c.event_count),
      max: Math.max(...comparisons.map((c) => c.event_count), 1),
    },
    {
      label: 'Total Weight',
      values: comparisons.map((c) => c.total_weight),
      max: Math.max(...comparisons.map((c) => c.total_weight), 1),
    },
    {
      label: 'Avg Weight',
      values: comparisons.map((c) => c.avg_weight),
      max: 1.0, // Weight is 0-1
    },
    {
      label: 'Velocity (ev/hr)',
      values: comparisons.map((c) => c.velocity),
      max: Math.max(...comparisons.map((c) => c.velocity), 1),
    },
    {
      label: 'Quality Score',
      values: comparisons.map((c) => c.coverage_quality_score),
      max: 100,
    },
  ] : [];

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
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Artist Comparison</h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare coverage metrics for 2-5 artists side-by-side
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Artist input section */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">Select Artists</h2>
              <button
                onClick={addArtistSlot}
                disabled={artistSlugs.length >= 5}
                className="
                  px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium
                  transition-all duration-240 ease-out
                  hover:bg-slate-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                + Add Artist
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artistSlugs.map((slug, idx) => (
                <div key={idx} className="flex space-x-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => updateArtistSlug(idx, e.target.value)}
                    placeholder={`Artist ${idx + 1} slug`}
                    className="
                      flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3
                      text-slate-100 placeholder-slate-500 font-mono text-sm
                      focus:border-[#3AA9BE] focus:outline-none
                      transition-colors duration-240
                    "
                  />
                  {artistSlugs.length > 2 && (
                    <button
                      onClick={() => removeArtistSlot(idx)}
                      className="
                        px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg
                        hover:bg-red-500/20 transition-colors
                      "
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              onClick={runComparison}
              disabled={loading}
              className="
                w-full px-6 py-3 bg-[#3AA9BE] text-white rounded-lg font-medium
                transition-all duration-240 ease-out
                hover:bg-[#3AA9BE]/80
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? 'Comparing...' : 'Compare Artists'}
            </button>
          </div>

          {/* Results section */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse text-[#3AA9BE]">
                Running comparison...
              </div>
            </div>
          )}

          {!loading && comparisons.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-200">
                  Comparison Results ({comparisons.length} artists)
                </h2>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`
                      px-4 py-2 text-sm font-medium font-mono rounded-lg
                      transition-all duration-240 ease-out
                      ${
                        viewMode === 'table'
                          ? 'bg-[#3AA9BE] text-white'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }
                    `}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setViewMode('radar')}
                    className={`
                      px-4 py-2 text-sm font-medium font-mono rounded-lg
                      transition-all duration-240 ease-out
                      ${
                        viewMode === 'radar'
                          ? 'bg-[#3AA9BE] text-white'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }
                    `}
                  >
                    Radar View
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
                {viewMode === 'table' && <ComparisonMatrix comparisons={comparisons} />}
                {viewMode === 'radar' && (
                  <ComparisonRadar
                    metrics={radarMetrics}
                    artistNames={comparisons.map((c) => c.artist_slug)}
                  />
                )}
              </div>
            </div>
          )}

          {!loading && comparisons.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <div className="text-lg mb-2">Ready to compare</div>
              <div className="text-sm">
                Enter 2-5 artist slugs above and click "Compare Artists" to see side-by-side metrics
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
