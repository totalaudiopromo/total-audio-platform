/**
 * MIG Scene Pulse Page
 * /mig/pulse
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScenePulseHeatmap } from '../components/ScenePulseHeatmap';

export default function ScenePulsePage() {
  const [country, setCountry] = useState('UK');
  const [pulseData, setPulseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPulse();
  }, [country]);

  async function fetchPulse() {
    setLoading(true);
    try {
      const response = await fetch(`/api/mig/pulse/${country}`);
      const data = await response.json();

      if (data.success) {
        setPulseData(data.data);
      }
    } catch (error) {
      console.error('Error fetching pulse:', error);
    } finally {
      setLoading(false);
    }
  }

  const countries = ['UK', 'US', 'Germany', 'France', 'Netherlands', 'Belgium'];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-400">Scene Pulse</h1>
              <p className="text-sm text-slate-400 mt-1">Track scene momentum and emerging trends</p>
            </div>
            <Link
              href="/mig"
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Country Selector */}
        <div className="mb-8 bg-slate-900/30 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-300">Country:</label>
            <div className="flex gap-2">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`px-4 py-2 border rounded transition-all duration-240 ${
                    country === c
                      ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12 text-slate-400">
            Loading scene pulse data...
          </div>
        )}

        {!loading && pulseData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-400">Total Scenes</div>
                <div className="text-3xl font-bold text-cyan-400">{pulseData.scenes?.length || 0}</div>
              </div>

              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-400">Total Activity</div>
                <div className="text-3xl font-bold text-violet-400">{pulseData.total_activity || 0}</div>
              </div>

              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-400">Trending Scenes</div>
                <div className="text-3xl font-bold text-amber-400">{pulseData.trending_scenes?.length || 0}</div>
              </div>

              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-400">Emerging Genres</div>
                <div className="text-3xl font-bold text-pink-400">{pulseData.emerging_microgenres?.length || 0}</div>
              </div>
            </div>

            {/* Trending Scenes List */}
            {pulseData.trending_scenes && pulseData.trending_scenes.length > 0 && (
              <div className="mb-8 bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-amber-400 mb-4">🔥 Trending Scenes</h2>
                <div className="flex flex-wrap gap-2">
                  {pulseData.trending_scenes.map((scene: string) => (
                    <Link
                      key={scene}
                      href={`/mig/scene/${scene.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-amber-600/20 border border-amber-500/50 rounded text-amber-300 hover:bg-amber-600/30 transition-all duration-240"
                    >
                      {scene}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Emerging Microgenres */}
            {pulseData.emerging_microgenres && pulseData.emerging_microgenres.length > 0 && (
              <div className="mb-8 bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-pink-400 mb-4">✨ Emerging Microgenres</h2>
                <div className="flex flex-wrap gap-2">
                  {pulseData.emerging_microgenres.slice(0, 10).map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-pink-600/20 border border-pink-500/50 rounded text-pink-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Scene Pulse Heatmap */}
            {pulseData.scenes && pulseData.scenes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-300 mb-4">Scene Activity</h2>
                <ScenePulseHeatmap scenes={pulseData.scenes} />
              </div>
            )}
          </>
        )}

        {!loading && !pulseData && (
          <div className="text-center py-12 text-slate-500">
            No pulse data available for {country}
          </div>
        )}
      </main>
    </div>
  );
}
