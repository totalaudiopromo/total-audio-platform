'use client';

import { useState } from 'react';
import { PitchVariationsViewer } from '@/components/features/PitchVariationsViewer';
import Link from 'next/link';
import { ArrowLeft, Zap, Terminal, Eye } from 'lucide-react';

export default function TestPitchVariations() {
  const [artistName, setArtistName] = useState('The XX');
  const [trackTitle, setTrackTitle] = useState('On Hold');
  const [genre, setGenre] = useState('Indie Electronic');
  const [targetContactType, setTargetContactType] = useState('radio');

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/test-features"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border-4 border-black bg-purple-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Feature 3</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Pitch Variations Generator</h1>
          <p className="mt-2 text-gray-600">5 AI-powered pitch styles using Claude 3.5 Sonnet</p>
        </div>

        {/* Controls */}
        <div className="glass-panel mb-6 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Configure Test Data</h2>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Track Title
                </label>
                <input
                  type="text"
                  value={trackTitle}
                  onChange={e => setTrackTitle(e.target.value)}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Target Contact Type
                </label>
                <select
                  value={targetContactType}
                  onChange={e => setTargetContactType(e.target.value)}
                  className="w-full rounded-lg border-2 border-black px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="radio">Radio</option>
                  <option value="playlist">Playlist Curator</option>
                  <option value="blog">Music Blog</option>
                  <option value="press">Press</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* UI Component Testing Section */}
        <div className="glass-panel border-purple-500 bg-gradient-to-br from-purple-50 to-white">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-purple-600 p-2">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Pitch Variations Viewer</h2>
          </div>

          <PitchVariationsViewer
            artistName={artistName}
            trackTitle={trackTitle}
            genre={genre}
            targetContactType={targetContactType}
          />

          <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Test Checklist:</strong>
              <br />
              ✓ Tabbed interface renders (5 tabs: formal, casual, concise, detailed, follow-up)
              <br />
              ✓ Generate button works for each type
              <br />
              ✓ Copy-to-clipboard functionality
              <br />
              ✓ Subject line + body preview displays correctly
              <br />
              ✓ Loading states during generation
              <br />✓ UK English enforcement (check generated text for British spelling)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
