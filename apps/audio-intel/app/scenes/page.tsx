/**
 * Scenes Index Page
 * Global overview of music scenes
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music Scenes - Audio Intel',
  description: 'Explore music scenes, microgenres, and cultural movements across the industry',
};

export default async function ScenesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Music Scenes
          </h1>
          <p className="text-slate-400 text-lg">
            Explore scenes, microgenres, and cultural movements across the music industry
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search scenes..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors duration-240"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors duration-240"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <option value="">All Regions</option>
              <option value="london">London, UK</option>
              <option value="berlin">Berlin, DE</option>
              <option value="manchester">Manchester, UK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scenes Grid - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Scene Card Example */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-240 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  London UK Garage
                </h3>
                <p className="text-slate-400 text-sm">London, UK</p>
              </div>
              <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium">
                Hot
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-slate-500 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Hotness:
              </span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-cyan-400 text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                85
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                dark-garage
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                2-step
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                bass-driven
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Members</div>
                <div className="text-white font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  247
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Trend</div>
                <div className="text-green-400 font-medium flex items-center gap-1">
                  <span>↑</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>+12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* More scene cards would be rendered here from API data */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-240 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Berlin Techno
                </h3>
                <p className="text-slate-400 text-sm">Berlin, DE</p>
              </div>
              <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                Stable
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-slate-500 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Hotness:
              </span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <span className="text-cyan-400 text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                72
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                minimal-techno
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                industrial
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Members</div>
                <div className="text-white font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  412
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Trend</div>
                <div className="text-slate-400 font-medium flex items-center gap-1">
                  <span>→</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>+2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading state or "Connect API" message */}
          <div className="bg-slate-950 border border-slate-800 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="text-slate-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">
              Connect to API to load more scenes
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            About Scenes Engine
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The Scenes Engine analyzes music scenes, microgenres, and cultural movements across the industry.
            It combines data from the Music Industry Graph (MIG), Creative Memory Graph (CMG), and campaign performance
            to provide real-time insights into scene vitality, growth trends, and crossover potential.
          </p>
        </div>
      </div>
    </div>
  );
}
