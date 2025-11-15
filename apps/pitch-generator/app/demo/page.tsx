'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import {
  FileText,
  Copy,
  Send,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  Shield,
  Zap,
} from 'lucide-react';

interface VoiceGuardAnalysis {
  complianceScore: number;
  changes: Array<{
    from: string;
    to: string;
    reason: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  warnings: string[];
  suggestions: string[];
}

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
  voiceGuardAnalysis?: VoiceGuardAnalysis;
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
    voiceGuardAnalysis: {
      complianceScore: 98,
      changes: [],
      warnings: [],
      suggestions: ['Consider mentioning specific radio show dates if available'],
    },
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
    voiceGuardAnalysis: {
      complianceScore: 95,
      changes: [],
      warnings: [],
      suggestions: ['Add a one-sentence summary of what makes this track unique to Annie'],
    },
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
    voiceGuardAnalysis: {
      complianceScore: 92,
      changes: [],
      warnings: [],
      suggestions: ['Add specific comparisons to artists on the target playlists'],
    },
  },
];

function VoiceGuardBadge({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 95) return 'bg-green-50 border-green-300 text-green-700';
    if (score >= 85) return 'bg-blue-50 border-blue-300 text-blue-700';
    if (score >= 75) return 'bg-amber-50 border-amber-300 text-amber-700';
    return 'bg-red-50 border-red-300 text-red-700';
  };

  const getIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="w-4 h-4" />;
    if (score >= 85) return <Shield className="w-4 h-4" />;
    if (score >= 75) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-xs font-bold ${getColor(score)}`}
    >
      {getIcon(score)}
      <span>VoiceGuard™: {score}%</span>
    </div>
  );
}

function VoiceGuardAnalysisPanel({ analysis }: { analysis: VoiceGuardAnalysis }) {
  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-amber-600" />
        <h3 className="text-lg font-black text-gray-900">VoiceGuard™ Analysis</h3>
      </div>

      {/* Compliance Score */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              Voice Compliance Score
            </p>
            <p className="text-3xl font-black text-amber-900">{analysis.complianceScore}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Status</p>
            <div className="flex items-center gap-2">
              {analysis.complianceScore >= 90 ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-black text-green-700">Passed</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <span className="font-black text-amber-700">Review</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Changes */}
      {analysis.changes.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            Corrections Made
          </p>
          <div className="space-y-2">
            {analysis.changes.map((change, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-l-4 ${
                  change.severity === 'critical'
                    ? 'bg-red-50 border-red-400'
                    : change.severity === 'high'
                      ? 'bg-amber-50 border-amber-400'
                      : change.severity === 'medium'
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-gray-50 border-gray-400'
                }`}
              >
                <p className="text-xs font-bold uppercase text-gray-700 mb-1">
                  {change.severity} Issue
                </p>
                <p className="text-sm text-gray-700 font-mono">
                  <span className="text-red-600 font-bold">"{change.from}"</span> →{' '}
                  <span className="text-green-600 font-bold">"{change.to}"</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">{change.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Issues Flagged
          </p>
          <div className="space-y-2">
            {analysis.warnings.map((warning, idx) => (
              <div key={idx} className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                <p className="text-sm text-amber-900">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Improvements
          </p>
          <div className="space-y-2">
            {analysis.suggestions.map((suggestion, idx) => (
              <div key={idx} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                <p className="text-sm text-blue-900">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-100 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Shield className="w-4 h-4 text-amber-800" />
            <span className="text-sm font-bold text-amber-800">VOICEGUARD™ POWERED</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
            Pitch Generator Demo
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mb-4 font-semibold">
            Authentic, personalised pitches at scale. Every pitch checked by VoiceGuard™ for UK
            voice compliance and industry authenticity.
          </p>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-8">
            Liberty Music PR integration • BBC Radio verified • Real contact data
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {demoPitches.map(pitch => (
            <button
              key={pitch.id}
              onClick={() => setSelectedPitch(pitch)}
              className={`text-left bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col ${
                selectedPitch?.id === pitch.id ? 'ring-4 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{pitch.contactName}</h3>
                  <p className="text-sm text-gray-600">{pitch.contactPlatform}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap ml-2 ${
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
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium border-2 border-amber-300">
                  {pitch.trackTitle} by {pitch.artistName}
                </span>
              </div>

              {/* VoiceGuard Score */}
              {pitch.voiceGuardAnalysis && (
                <div className="mb-4">
                  <VoiceGuardBadge score={pitch.voiceGuardAnalysis.complianceScore} />
                </div>
              )}

              <div className="text-xs text-gray-500 mb-3 mt-auto">
                <p className="font-medium">
                  Generated: {new Date(pitch.generatedAt).toLocaleDateString()}
                </p>
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
          <div className="space-y-6 mb-12">
            {/* Main Detail Panel */}
            <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                    {selectedPitch.contactName}
                  </h2>
                  <p className="text-lg text-gray-600 mb-1">{selectedPitch.contactPlatform}</p>
                  <p className="text-sm text-gray-500">{selectedPitch.contactEmail}</p>
                </div>
                <button
                  onClick={() => setSelectedPitch(null)}
                  className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all"
                >
                  Close ✕
                </button>
              </div>

              {/* Track Info */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
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

            {/* VoiceGuard™ Analysis Panel */}
            {selectedPitch.voiceGuardAnalysis && (
              <VoiceGuardAnalysisPanel analysis={selectedPitch.voiceGuardAnalysis} />
            )}
          </div>
        )}

        {/* VoiceGuard™ Features */}
        <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-black text-gray-900">VoiceGuard™ Features</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                UK Voice Compliance
              </h3>
              <p className="text-sm text-gray-700">
                Every pitch is checked for UK spelling (organise, not organize), authentic British
                tone, and industry credibility markers. No corporate speak allowed.
              </p>
            </div>
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI-Powered Personalisation
              </h3>
              <p className="text-sm text-gray-700">
                Each pitch is tailored to the specific contact using their platform, role, and
                preferences. No generic templates — every email sounds personally written.
              </p>
            </div>
            <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Real Contact Data
              </h3>
              <p className="text-sm text-gray-700">
                Integrated with Audio Intel for enriched contact information. Pitches reference
                actual contact preferences and submission requirements.
              </p>
            </div>
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Copy className="w-5 h-5 text-purple-600" />
                One-Click Copy
              </h3>
              <p className="text-sm text-gray-700">
                Copy pitches ready for Gmail. No formatting issues, no manual cleanup. VoiceGuard™
                compliance score displayed with every pitch.
              </p>
            </div>
          </div>
        </div>

        {/* Pitch Generation Features */}
        <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Pitch Generation at Scale</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Fast Generation
              </h3>
              <p className="text-sm text-gray-600">
                Generate 10-50 personalised pitches in 2 minutes instead of spending hours
                copy-pasting templates manually.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Quality Assurance
              </h3>
              <p className="text-sm text-gray-600">
                Every generated pitch passes VoiceGuard™ compliance checks before you see it.
                Authenticity guaranteed.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Liberty Integration
              </h3>
              <p className="text-sm text-gray-600">
                Built for Liberty Music PR contacts and BBC Radio research. Real contacts, real
                results, real compliance.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Batch Processing
              </h3>
              <p className="text-sm text-gray-600">
                Submit multiple contacts and get back a batch of VoiceGuard™ approved pitches ready
                to send immediately.
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
