/**
 * Talent Radar - Global Music Pulse Dashboard
 * A&R-grade intelligence for rising artists and breakout opportunities
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talent Radar - Audio Intel',
  description: 'A&R-grade intelligence for detecting rising artists, breakout potential, and music industry momentum',
};

export default async function TalentRadarPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Talent Radar
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            A&R-grade intelligence tracking {' '}
            <span className="text-cyan-400 font-medium">rising artists</span>, {' '}
            <span className="text-cyan-400 font-medium">breakout signals</span>, and {' '}
            <span className="text-cyan-400 font-medium">cultural momentum</span>
          </p>
        </div>
      </div>

      {/* Global Pulse Summary */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Global Pulse
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-black border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Artists Tracked
              </div>
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                1,247
              </div>
              <div className="text-green-400 text-sm flex items-center gap-1">
                <span>↑</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>+18%</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-black border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Avg Momentum
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                67
              </div>
              <div className="text-slate-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                /100
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-black border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Breakout Candidates
              </div>
              <div className="text-3xl font-bold text-amber-400 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                42
              </div>
              <div className="text-slate-400 text-sm">
                High potential
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-black border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-500 text-sm mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Artists at Risk
              </div>
              <div className="text-3xl font-bold text-red-400 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                28
              </div>
              <div className="text-slate-400 text-sm">
                Needs attention
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rising Artists Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Rising Artists
            </h2>
            <button className="text-cyan-400 hover:text-cyan-300 transition-colors duration-240">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Artist Card Example */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-240 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Artist Name
                  </h3>
                  <p className="text-slate-400 text-sm">London UK Garage</p>
                </div>
                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                  Rising
                </span>
              </div>

              {/* Momentum Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Momentum
                  </span>
                  <span className="text-cyan-400 text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    87
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              {/* Breakout Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Breakout Score
                  </span>
                  <span className="text-amber-400 text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    0.78
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              {/* Signals */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-slate-500 mb-1">MIG</div>
                  <div className="text-green-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    0.82
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 mb-1">Press</div>
                  <div className="text-green-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    0.75
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 mb-1">Risk</div>
                  <div className="text-green-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    0.23
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder Card */}
            <div className="bg-slate-950 border border-slate-800 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="text-slate-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">
                Connect to API to load live talent data
              </p>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            About Talent Radar
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed space-y-2">
            <p>
              The Talent Radar is an A&R-grade intelligence engine that monitors the entire music ecosystem.
              It aggregates signals from:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
              <li>Music Industry Graph (MIG) - network connectivity and influence</li>
              <li>Scenes Engine - cultural movement and scene positioning</li>
              <li>Creative Memory Graph (CMG) - artistic evolution and fingerprint</li>
              <li>Fusion Layer - campaign performance and velocity</li>
              <li>Coverage Map - press quality and reach</li>
              <li>Identity Kernel - brand coherence and alignment</li>
            </ul>
            <p className="mt-3">
              Use this dashboard to identify rising talent, breakout opportunities, and strategic timing for A&R decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
