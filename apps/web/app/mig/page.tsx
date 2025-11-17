/**
 * Music Industry Graph (MIG) - Main Dashboard
 * /mig
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MIGDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-cyan">Music Industry Graph</h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore the entire UK/EU/global music ecosystem
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/mig/search"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all duration-240 group"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2 group-hover:text-cyan-300">
              Search Graph
            </h3>
            <p className="text-slate-400 text-sm">
              Search for artists, journalists, scenes, and more
            </p>
          </Link>

          <Link
            href="/mig/console"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all duration-240 group"
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2 group-hover:text-cyan-300">
              AI Console
            </h3>
            <p className="text-slate-400 text-sm">
              Ask questions in natural language
            </p>
          </Link>

          <Link
            href="/mig/pulse"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all duration-240 group"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2 group-hover:text-cyan-300">
              Scene Pulse
            </h3>
            <p className="text-slate-400 text-sm">
              View trending scenes and emerging microgenres
            </p>
          </Link>

          <Link
            href="/mig/search?type=scene"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all duration-240 group"
          >
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2 group-hover:text-cyan-300">
              Explore Scenes
            </h3>
            <p className="text-slate-400 text-sm">
              Browse all music scenes in the graph
            </p>
          </Link>
        </section>

        {/* Overview Stats */}
        <section className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Graph Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-3xl font-bold text-cyan-400">-</div>
              <div className="text-sm text-slate-400 mt-1">Total Nodes</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-3xl font-bold text-violet-400">-</div>
              <div className="text-sm text-slate-400 mt-1">Connections</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-3xl font-bold text-amber-400">-</div>
              <div className="text-sm text-slate-400 mt-1">Scenes</div>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <div className="text-3xl font-bold text-pink-400">-</div>
              <div className="text-sm text-slate-400 mt-1">Microgenres</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Graph statistics will be loaded from the MIG API
          </p>
        </section>

        {/* About */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">What is MIG?</h2>
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 text-slate-300 space-y-3">
            <p>
              The <span className="text-cyan-400 font-semibold">Music Industry Graph (MIG)</span>{' '}
              is a graph-based data intelligence layer that models the entire UK/EU/global music
              ecosystem.
            </p>
            <p>
              It connects artists, journalists, radio hosts, playlists, blogs, DJs, labels, scenes,
              and microgenres in a comprehensive network, enabling:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
              <li>Graph-based recommendations for similar artists and pitch targets</li>
              <li>Scene pulse analytics to track emerging trends</li>
              <li>Influence pathfinding to discover degrees of separation</li>
              <li>Natural language queries across the entire music ecosystem</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
