'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { FileText, Copy, Send, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface DemoPitch {
  id: number;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  contactPlatform: string;
  trackTitle: string;
  artistName: string;
  pitch: string;
  status: 'draft' | 'ready' | 'sent';
  generatedAt: string;
}

const demoPitches: DemoPitch[] = [
  {
    id: 1,
    contactName: 'Jack Saunders',
    contactEmail: 'jack.saunders@bbc.co.uk',
    contactRole: 'Presenter',
    contactPlatform: 'BBC Radio 1',
    trackTitle: 'Maybe (i)',
    artistName: 'sadact',
    pitch: `Hi Jack,

Hope you're well! I'm reaching out about "Maybe (i)" by sadact - a track I think would fit perfectly with your New Music show.

sadact is a producer I've been working with for a while, and this track has that alternative electronic sound you champion. It's got that early evening energy - moody but still accessible, with production that's clean but not over-polished.

The track's already getting support from BBC 6 Music and has been added to a few Spotify editorial playlists. I've attached the stream below - would love to know what you think.

Best,
Chris`,
    status: 'ready',
    generatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: 2,
    contactName: 'Annie Mac',
    contactEmail: 'annie.mac@bbc.co.uk',
    contactRole: 'Presenter',
    contactPlatform: 'BBC Radio 1',
    trackTitle: 'Maybe (i)',
    artistName: 'sadact',
    pitch: `Hi Annie,

Quick one - "Maybe (i)" by sadact. I know you're always looking for tracks that bridge electronic and indie, and this hits that sweet spot.

sadact's been building momentum with BBC 6 Music support, and this track has that late-night Radio 1 energy. It's got depth but still feels immediate - exactly the kind of thing that works on Future Sounds.

Stream below. Let me know if you want the full EP.

Cheers,
Chris`,
    status: 'ready',
    generatedAt: '2025-01-15T10:32:00Z',
  },
  {
    id: 3,
    contactName: 'Spotify Editorial',
    contactEmail: 'editorial@spotify.com',
    contactRole: 'Playlist Curators',
    contactPlatform: 'Spotify',
    trackTitle: 'Maybe (i)',
    artistName: 'sadact',
    pitch: `Hi Spotify Editorial Team,

Submitting "Maybe (i)" by sadact for your consideration. This track sits in that alternative electronic space - think Four Tet meets Caribou, but with its own UK identity.

The track's already getting BBC 6 Music support and has been performing well on independent playlists. It's got that crossover appeal that works across multiple genres.

Streaming link and press assets attached. Would love to see this on New Music Friday UK or any of your electronic-focused playlists.

Thanks,
Chris`,
    status: 'draft',
    generatedAt: '2025-01-15T10:35:00Z',
  },
];

export default function PitchGeneratorDemo() {
  const [selectedPitch, setSelectedPitch] = useState<DemoPitch | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyPitch = async (pitch: DemoPitch) => {
    try {
      await navigator.clipboard.writeText(pitch.pitch);
      setCopiedId(pitch.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleGenerateDemo = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedPitch(demoPitches[0]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Navigation Header */}
      <SiteHeader />

      {/* Demo Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-100 border-2 border-amber-600 rounded-full">
            <span className="text-sm font-bold text-amber-800">DEMO DATA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Pitch Generator in Action
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            See how Pitch Generator writes personalised music PR pitches in seconds. No more
            copy-pasting templates or staring at blank emails.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Click any pitch below to see the full personalised email, or generate a new one
          </p>
        </div>

        {/* Quick Generate Demo */}
        {!selectedPitch && (
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  🎯 Quick Demo: Generate a Pitch
                </h3>
                <p className="text-sm text-gray-700 font-bold">
                  Generate a personalised pitch for BBC Radio 1's Jack Saunders instantly. Real
                  contact, real AI-generated pitch.
                </p>
              </div>
              <button
                onClick={handleGenerateDemo}
                disabled={isGenerating}
                className="bg-amber-500 hover:bg-amber-600 text-black font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Demo Pitch
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Pitches Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {demoPitches.map(pitch => (
            <button
              key={pitch.id}
              onClick={() => setSelectedPitch(pitch)}
              className={`text-left bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all ${
                selectedPitch?.id === pitch.id ? 'ring-4 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{pitch.contactName}</h3>
                  <p className="text-sm text-gray-600">{pitch.contactPlatform}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    pitch.status === 'ready'
                      ? 'bg-green-500 text-white'
                      : pitch.status === 'sent'
                        ? 'bg-blue-500 text-white'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {pitch.status}
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium border border-amber-300">
                  {pitch.trackTitle} by {pitch.artistName}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                <p className="font-medium">Generated: {new Date(pitch.generatedAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{pitch.pitch.length} characters</span>
              </div>
            </button>
          ))}
        </div>

        {/* Pitch Detail View */}
        {selectedPitch && (
          <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                  {selectedPitch.contactName}
                </h2>
                <p className="text-lg text-gray-600 mb-1">{selectedPitch.contactPlatform}</p>
                <p className="text-sm text-gray-500">{selectedPitch.contactEmail}</p>
              </div>
              <button
                onClick={() => setSelectedPitch(null)}
                className="text-gray-500 hover:text-gray-700 font-bold text-sm"
              >
                Close ✕
              </button>
            </div>

            {/* Track Info */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-amber-700 font-bold mb-1">TRACK</p>
                  <p className="text-lg font-black text-gray-900">{selectedPitch.trackTitle}</p>
                  <p className="text-sm text-gray-600">by {selectedPitch.artistName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-amber-700 font-bold mb-1">STATUS</p>
                  <span
                    className={`px-3 py-1 rounded text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      selectedPitch.status === 'ready'
                        ? 'bg-green-500 text-white'
                        : selectedPitch.status === 'sent'
                          ? 'bg-blue-500 text-white'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedPitch.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Pitch */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-gray-900">Generated Pitch</h3>
                <button
                  onClick={() => handleCopyPitch(selectedPitch)}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-black px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-sm"
                >
                  {copiedId === selectedPitch.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Pitch
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {selectedPitch.pitch}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                <Send className="w-5 h-5" />
                Open in Gmail
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                <FileText className="w-5 h-5" />
                Regenerate Pitch
              </button>
            </div>
          </div>
        )}

        {/* Features Showcase */}
        <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">What You're Seeing</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered Personalisation</h3>
              <p className="text-sm text-gray-600">
                Each pitch is tailored to the specific contact using their platform, role, and
                preferences. No generic templates - every email sounds like you wrote it personally.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Contact Intelligence Integration</h3>
              <p className="text-sm text-gray-600">
                Pitch Generator uses enriched contact data from Audio Intel to write pitches that
                reference the contact's actual preferences and submission guidelines.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Batch Generation</h3>
              <p className="text-sm text-gray-600">
                Generate 10-50 personalised pitches in 2 minutes instead of spending hours
                copy-pasting and editing templates.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">One-Click Copy</h3>
              <p className="text-sm text-gray-600">
                Copy individual pitches or entire batches ready to paste into Gmail. No formatting
                issues, no manual cleanup needed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            Ready to stop wasting hours on pitches?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            This demo shows example pitches. Start generating personalised pitches for your real
            campaigns, save 5+ hours per campaign, and get better response rates.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-amber-500 text-black px-8 py-4 rounded-xl font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            Start Generating Pitches →
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required. 10 free pitches per month.
          </p>
        </div>
      </main>
    </div>
  );
}
