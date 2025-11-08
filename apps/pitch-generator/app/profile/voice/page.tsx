'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Save, CheckCircle, Zap, FileText, Loader2 } from 'lucide-react';

interface VoiceProfile {
  voice_background: string;
  voice_style: string;
  voice_achievements: string;
  voice_approach: string;
  voice_differentiator: string;
  voice_typical_opener: string;
  voice_context_notes: string;
}

interface VoiceAnalysis {
  voice_background: string;
  voice_style: string;
  voice_achievements: string;
  voice_approach: string;
  voice_differentiator: string;
  voice_typical_opener: string;
  metadata: {
    tone_preference: string;
    formality_score: number;
    personality_traits: string[];
    strengths: string[];
    suggestions: string[];
  };
}

type SetupStep = 'method' | 'quick' | 'guided' | 'results';

export default function VoiceProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<SetupStep>('method');
  const [sampleText, setSampleText] = useState('');
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [profile, setProfile] = useState<VoiceProfile>({
    voice_background: '',
    voice_style: '',
    voice_achievements: '',
    voice_approach: '',
    voice_differentiator: '',
    voice_typical_opener: '',
    voice_context_notes: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      loadVoiceProfile();
    }
  }, [session]);

  async function loadVoiceProfile() {
    try {
      const response = await fetch('/api/voice/profile');
      const result = await response.json();

      // Check if migration is required
      if (result.migrationRequired) {
        console.error('Database migration required:', result.instructions);
        alert(result.instructions.message + '\n\n' + result.instructions.steps.join('\n'));
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load voice profile');
      }

      const { profile: data } = result;

      if (data && data.voice_profile_completed) {
        // User has completed profile, show guided form
        setProfile({
          voice_background: data.voice_background || '',
          voice_style: data.voice_style || '',
          voice_achievements: data.voice_achievements || '',
          voice_approach: data.voice_approach || '',
          voice_differentiator: data.voice_differentiator || '',
          voice_typical_opener: data.voice_typical_opener || '',
          voice_context_notes: data.voice_context_notes || '',
        });
        setCurrentStep('guided');
      }
    } catch (error) {
      console.error('Error loading voice profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyzeText() {
    if (sampleText.trim().length < 50) {
      alert('Please provide at least 50 characters of text to analyse');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyse text');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      // Pre-fill profile with analysis
      setProfile({
        voice_background: data.analysis.voice_background,
        voice_style: data.analysis.voice_style,
        voice_achievements: data.analysis.voice_achievements,
        voice_approach: data.analysis.voice_approach,
        voice_differentiator: data.analysis.voice_differentiator,
        voice_typical_opener: data.analysis.voice_typical_opener,
        voice_context_notes: '',
      });

      setCurrentStep('results');
    } catch (error) {
      console.error('Error analysing text:', error);
      alert('Failed to analyse text. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/voice/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      // Check if migration is required
      if (result.migrationRequired) {
        console.error('Database migration required:', result.instructions);
        alert(
          `❌ ${result.instructions.message}\n\n` +
            result.instructions.steps.join('\n') +
            `\n\n📋 SQL to run:\n${result.instructions.sql}`
        );
        setSaving(false);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save voice profile');
      }

      setSaved(true);
      // Redirect to profile page after successful save
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error saving voice profile:', error);
      alert('Failed to save voice profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 animate-spin text-brand-amber-dark" />
          <p className="mt-2 text-sm text-gray-600">Loading your voice profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Method Selection Screen
  if (currentStep === 'method') {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <Link href="/profile" className="subtle-button inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>

        <div className="glass-panel px-8 py-10">
          <div className="mb-8 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-brand-amber-dark" />
            <h1 className="mt-4 text-3xl font-bold">Create Your Voice Profile</h1>
            <p className="mt-3 text-gray-900/60 max-w-2xl mx-auto">
              Help AI write pitches that sound exactly like you. Choose how you'd like to set up
              your profile:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Quick Setup */}
            <button
              onClick={() => setCurrentStep('quick')}
              className="group rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all text-left"
            >
              <Zap className="h-8 w-8 text-brand-amber-dark" />
              <h3 className="mt-4 text-xl font-bold">Quick Setup</h3>
              <p className="mt-2 text-sm text-gray-900/60">
                Paste a pitch or email you've written. AI analyses your style and auto-fills your
                profile.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-brand-amber-dark">
                <span className="font-semibold">~2 minutes</span>
                <span className="text-gray-900/30">•</span>
                <span>Recommended</span>
              </div>
            </button>

            {/* Guided Setup */}
            <button
              onClick={() => setCurrentStep('guided')}
              className="group rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all text-left"
            >
              <FileText className="h-8 w-8 text-brand-amber-dark" />
              <h3 className="mt-4 text-xl font-bold">Guided Setup</h3>
              <p className="mt-2 text-sm text-gray-900/60">
                Answer 7 strategic questions about your background, style, and approach.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-brand-amber-dark">
                <span className="font-semibold">~5 minutes</span>
                <span className="text-gray-900/30">•</span>
                <span>More detailed</span>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 rounded-xl border border-brand-amber/30 bg-brand-amber/5 p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-brand-amber-dark text-center">
              Why Voice Profiles Matter
            </h4>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 text-center">
              <div>
                <div className="text-2xl font-bold">3-5%</div>
                <p className="mt-1 text-xs text-gray-900/60">
                  Response rate with generic AI pitches
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">15-20%</div>
                <p className="mt-1 text-xs text-gray-900/60">
                  Response rate with personalised voice
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-amber-dark">4x</div>
                <p className="mt-1 text-xs text-gray-900/60">Improvement in engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quick Setup Screen
  if (currentStep === 'quick') {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => setCurrentStep('method')}
            className="subtle-button inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Method Selection
          </button>
        </div>

        <div className="glass-panel px-8 py-10">
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quick Setup</h1>
                <p className="mt-2 text-gray-900/60">
                  Paste a pitch or email you've written - AI will analyse your writing style
                </p>
              </div>
              <Zap className="h-8 w-8 text-brand-amber-dark" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900/80 mb-2">
                Paste Your Writing Sample
                <span className="ml-2 text-xs font-normal text-gray-900/50">
                  (Minimum 50 characters - the more you provide, the better the analysis)
                </span>
              </label>
              <textarea
                value={sampleText}
                onChange={e => setSampleText(e.target.value)}
                rows={12}
                placeholder="Paste a pitch email, promotional message, or any professional communication you've written. For example:

Hi Sarah,

Hope you've been well since we last spoke! I wanted to send you a new track from my project sadact that I think would really suit your show...

The more text you provide, the better I can understand your natural writing style and voice."
                className="w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
              />
              <p className="mt-2 text-xs text-gray-900/50">
                {sampleText.length} characters{' '}
                {sampleText.length < 50 && `(${50 - sampleText.length} more needed)`}
              </p>
            </div>

            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="text-sm font-semibold">What AI Will Analyse:</h4>
              <ul className="mt-2 space-y-1 text-xs text-gray-900/70">
                <li>• Writing style (formal vs casual, sentence structure)</li>
                <li>• Communication patterns (how you open, close, transition)</li>
                <li>• Personality markers (credibility, authenticity, energy)</li>
                <li>• Tone preference and formality level</li>
                <li>• Unique traits that make your voice distinctive</li>
              </ul>
            </div>

            <button
              onClick={handleAnalyzeText}
              disabled={analyzing || sampleText.trim().length < 50}
              className="cta-button flex items-center gap-2 w-full justify-center"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing Your Writing Style...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyse My Writing Style
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen (after AI analysis)
  if (currentStep === 'results' && analysis) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => setCurrentStep('quick')}
            className="subtle-button inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Text Input
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Analysis Results Header */}
          <div className="glass-panel px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Your Voice Analysis</h1>
                <p className="mt-2 text-sm text-gray-900/60">
                  Review and refine the AI's analysis of your writing style
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>

            {/* Voice Insights */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Formality Score */}
              <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-gray-900/60">Formality Level</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-brand-amber transition-all"
                      style={{ width: `${(analysis.metadata.formality_score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{analysis.metadata.formality_score}/10</span>
                </div>
                <p className="mt-1 text-xs text-gray-900/50">
                  {analysis.metadata.formality_score <= 3
                    ? 'Very casual'
                    : analysis.metadata.formality_score <= 6
                    ? 'Balanced'
                    : 'Professional'}
                </p>
              </div>

              {/* Tone Preference */}
              <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-gray-900/60">Tone Preference</p>
                <p className="mt-2 text-lg font-bold capitalize">
                  {analysis.metadata.tone_preference}
                </p>
              </div>

              {/* Personality Traits */}
              <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs text-gray-900/60">Personality Traits</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {analysis.metadata.personality_traits.slice(0, 3).map((trait, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-brand-amber/20 px-2 py-0.5 text-xs text-brand-amber-dark"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Suggestions */}
            {(analysis.metadata.strengths.length > 0 ||
              analysis.metadata.suggestions.length > 0) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {analysis.metadata.strengths.length > 0 && (
                  <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                    <p className="text-xs font-semibold text-success">Your Strengths</p>
                    <ul className="mt-2 space-y-1">
                      {analysis.metadata.strengths.map((strength, i) => (
                        <li key={i} className="text-xs text-gray-900/70">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.metadata.suggestions.length > 0 && (
                  <div className="rounded-xl border border-brand-amber/30 bg-brand-amber/5 p-4">
                    <p className="text-xs font-semibold text-brand-amber-dark">Suggestions</p>
                    <ul className="mt-2 space-y-1">
                      {analysis.metadata.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-xs text-gray-900/70">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Editable Profile Fields */}
          <div className="glass-panel px-8 py-8">
            <h2 className="text-xl font-bold mb-6">Review & Refine Your Profile</h2>

            <div className="space-y-6">
              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Your Background in Music
                </label>
                <textarea
                  value={profile.voice_background}
                  onChange={e => setProfile({ ...profile, voice_background: e.target.value })}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Your Pitching Style
                </label>
                <textarea
                  value={profile.voice_style}
                  onChange={e => setProfile({ ...profile, voice_style: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Your Biggest Wins
                </label>
                <textarea
                  value={profile.voice_achievements}
                  onChange={e => setProfile({ ...profile, voice_achievements: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                />
              </div>

              {/* Approach */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  What Makes Your Approach Different
                </label>
                <textarea
                  value={profile.voice_approach}
                  onChange={e => setProfile({ ...profile, voice_approach: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                />
              </div>

              {/* Differentiator */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  What Makes You Unique
                </label>
                <textarea
                  value={profile.voice_differentiator}
                  onChange={e => setProfile({ ...profile, voice_differentiator: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                />
              </div>

              {/* Typical Opener */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Your Typical Opening Style
                </label>
                <textarea
                  value={profile.voice_typical_opener}
                  onChange={e => setProfile({ ...profile, voice_typical_opener: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                />
              </div>

              {/* Context Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={profile.voice_context_notes}
                  onChange={e => setProfile({ ...profile, voice_context_notes: e.target.value })}
                  rows={2}
                  placeholder="Any other context about you that might help..."
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <p className="text-sm text-gray-900/60">
                This information stays private and is only used to generate your pitches
              </p>
              <button
                type="submit"
                disabled={saving}
                className="cta-button flex items-center gap-2"
              >
                {saved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Saved!
                  </>
                ) : saving ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Voice Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Guided Setup Screen (default/fallback)
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => setCurrentStep('method')}
          className="subtle-button inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Method Selection
        </button>
      </div>

      <form onSubmit={handleSave} className="glass-panel px-8 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Your Voice Profile</h1>
              <p className="mt-2 text-gray-900/60">
                Help AI write pitches that sound exactly like you - authentic, personal, and
                effective
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-brand-amber-dark" />
          </div>
        </div>

        {/* Why This Matters */}
        <div className="mb-8 rounded-2xl border border-brand-amber/30 bg-brand-amber/5 p-6">
          <h3 className="font-semibold text-brand-amber-dark">Why This Matters</h3>
          <p className="mt-2 text-sm text-gray-900/70">
            Generic AI pitches get ignored. Pitches that sound like they came from a real person
            with real experience get responses. This profile teaches our AI to write in{' '}
            <strong>your voice</strong> - with your energy, your credibility, and your authentic
            story. Answer honestly and you will get pitches that sound like you actually wrote them.
          </p>
        </div>

        {/* Voice Profile Questions */}
        <div className="space-y-6">
          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What's your background in music?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Producer for 5 years, pitched to BBC Radio 1, worked with indie labels")
              </span>
            </label>
            <textarea
              value={profile.voice_background}
              onChange={e => setProfile({ ...profile, voice_background: e.target.value })}
              rows={3}
              placeholder="I'm a producer who's been making electronic music for 5 years. I've pitched tracks to BBC Radio 1, 6 Music, and worked with several indie labels on radio campaigns..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              How would you describe your pitching style?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Direct but friendly", "Casual and conversational", "Professional with
                personality")
              </span>
            </label>
            <textarea
              value={profile.voice_style}
              onChange={e => setProfile({ ...profile, voice_style: e.target.value })}
              rows={2}
              placeholder="I keep it direct but friendly. No corporate speak or forced formality. I write like I'm talking to someone at a gig, not sending a press release..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What's your biggest win so far?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Got played on 6 Music three times", "Secured blog coverage on major
                outlets")
              </span>
            </label>
            <textarea
              value={profile.voice_achievements}
              onChange={e => setProfile({ ...profile, voice_achievements: e.target.value })}
              rows={2}
              placeholder="My last track got played on BBC 6 Music three times and featured on several indie blogs. I've built genuine relationships with radio producers over the years..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>

          {/* Approach */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What makes your approach different?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "I focus on relationships over mass emails", "I research every contact
                personally")
              </span>
            </label>
            <textarea
              value={profile.voice_approach}
              onChange={e => setProfile({ ...profile, voice_approach: e.target.value })}
              rows={2}
              placeholder="I don't do mass emails. I research every contact, understand what they actually play, and only pitch tracks that genuinely fit their vibe..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>

          {/* Differentiator */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What makes you unique as a promoter/artist?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "I'm also a producer so I understand the creative side", "I've worked both
                sides")
              </span>
            </label>
            <textarea
              value={profile.voice_differentiator}
              onChange={e => setProfile({ ...profile, voice_differentiator: e.target.value })}
              rows={2}
              placeholder="I'm a producer myself (sadact), so I understand both the creative and promotion sides. I test everything in my own campaigns before recommending it..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>

          {/* Typical Opener */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              How do you typically open conversations with contacts?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Hope you have been well...", "Quick one for you...", "Saw you played X
                recently...")
              </span>
            </label>
            <textarea
              value={profile.voice_typical_opener}
              onChange={e => setProfile({ ...profile, voice_typical_opener: e.target.value })}
              rows={2}
              placeholder="I usually start with something personal like 'Hope you have been well' or reference something specific I heard them play recently. Makes it feel less like a pitch..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>

          {/* Context Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              Any additional context about you? (Optional)
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Dad of two, based in Brighton", "Electronic music focus", "Work full-time so
                pitch in evenings")
              </span>
            </label>
            <textarea
              value={profile.voice_context_notes}
              onChange={e => setProfile({ ...profile, voice_context_notes: e.target.value })}
              rows={2}
              placeholder="Dad of two based in Brighton. I focus on electronic music and run campaigns while working a day job, so I pitch mostly in the evenings..."
              className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-sm text-gray-900/60">
            This information stays private and is only used to generate your pitches
          </p>
          <button type="submit" disabled={saving} className="cta-button flex items-center gap-2">
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Saved!
              </>
            ) : saving ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Voice Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
