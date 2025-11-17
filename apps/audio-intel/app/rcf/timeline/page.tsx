/**
 * RCF Timeline Page
 * Artist event timeline with heatmap
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RCFTimelinePage() {
  const [artistSlug, setArtistSlug] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="border-b border-slate-800 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
          <Link href="/rcf" className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80">
            ← Back to Feed
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Artist Timeline</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <input
            type="text"
            value={artistSlug}
            onChange={(e) => setArtistSlug(e.target.value)}
            placeholder="Enter artist slug..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-[#3AA9BE] focus:outline-none"
          />

          <div className="mt-8 text-center text-slate-400">
            Enter an artist slug to view their event timeline
          </div>
        </div>
      </main>
    </div>
  );
}
