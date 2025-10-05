'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Save, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VoiceProfile {
  voice_background: string;
  voice_style: string;
  voice_achievements: string;
  voice_approach: string;
  voice_differentiator: string;
  voice_typical_opener: string;
  voice_context_notes: string;
}

export default function VoiceProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
      const userId = session?.user?.email || '';
      const { data, error } = await supabase
        .from('user_pitch_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          voice_background: data.voice_background || '',
          voice_style: data.voice_style || '',
          voice_achievements: data.voice_achievements || '',
          voice_approach: data.voice_approach || '',
          voice_differentiator: data.voice_differentiator || '',
          voice_typical_opener: data.voice_typical_opener || '',
          voice_context_notes: data.voice_context_notes || '',
        });
      }
    } catch (error) {
      console.error('Error loading voice profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const userId = session?.user?.email || '';

      const { error } = await supabase
        .from('user_pitch_settings')
        .upsert({
          user_id: userId,
          ...profile,
          voice_profile_completed: true,
        });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
          <Sparkles className="mx-auto h-8 w-8 animate-spin text-brand-iris" />
          <p className="mt-2 text-sm text-gray-600">Loading your voice profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <Link href="/profile" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
      </div>

      <form onSubmit={handleSave} className="glass-panel px-8 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Your Voice Profile</h1>
              <p className="mt-2 text-gray-900/60">
                Help AI write pitches that sound exactly like you - authentic, personal, and effective
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-brand-iris" />
          </div>
        </div>

        {/* Why This Matters */}
        <div className="mb-8 rounded-2xl border border-brand-iris/30 bg-brand-iris/5 p-6">
          <h3 className="font-semibold text-brand-iris">Why This Matters</h3>
          <p className="mt-2 text-sm text-gray-900/70">
            Generic AI pitches get ignored. Pitches that sound like they came from a real person with real
            experience get responses. This profile teaches our AI to write in <strong>your voice</strong> - with your
            energy, your credibility, and your authentic story. Answer honestly and you will get pitches that sound
            like you actually wrote them.
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
              onChange={(e) => setProfile({ ...profile, voice_background: e.target.value })}
              rows={3}
              placeholder="I'm a producer who's been making electronic music for 5 years. I've pitched tracks to BBC Radio 1, 6 Music, and worked with several indie labels on radio campaigns..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              How would you describe your pitching style?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Direct but friendly", "Casual and conversational", "Professional with personality")
              </span>
            </label>
            <textarea
              value={profile.voice_style}
              onChange={(e) => setProfile({ ...profile, voice_style: e.target.value })}
              rows={2}
              placeholder="I keep it direct but friendly. No corporate speak or forced formality. I write like I'm talking to someone at a gig, not sending a press release..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What's your biggest win so far?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Got played on 6 Music three times", "Secured blog coverage on major outlets")
              </span>
            </label>
            <textarea
              value={profile.voice_achievements}
              onChange={(e) => setProfile({ ...profile, voice_achievements: e.target.value })}
              rows={2}
              placeholder="My last track got played on BBC 6 Music three times and featured on several indie blogs. I've built genuine relationships with radio producers over the years..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          </div>

          {/* Approach */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What makes your approach different?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "I focus on relationships over mass emails", "I research every contact personally")
              </span>
            </label>
            <textarea
              value={profile.voice_approach}
              onChange={(e) => setProfile({ ...profile, voice_approach: e.target.value })}
              rows={2}
              placeholder="I don't do mass emails. I research every contact, understand what they actually play, and only pitch tracks that genuinely fit their vibe..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          </div>

          {/* Differentiator */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              What makes you unique as a promoter/artist?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "I'm also a producer so I understand the creative side", "I've worked both sides")
              </span>
            </label>
            <textarea
              value={profile.voice_differentiator}
              onChange={(e) => setProfile({ ...profile, voice_differentiator: e.target.value })}
              rows={2}
              placeholder="I'm a producer myself (sadact), so I understand both the creative and promotion sides. I test everything in my own campaigns before recommending it..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          </div>

          {/* Typical Opener */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              How do you typically open conversations with contacts?
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Hope you have been well...", "Quick one for you...", "Saw you played X recently...")
              </span>
            </label>
            <textarea
              value={profile.voice_typical_opener}
              onChange={(e) => setProfile({ ...profile, voice_typical_opener: e.target.value })}
              rows={2}
              placeholder="I usually start with something personal like 'Hope you have been well' or reference something specific I heard them play recently. Makes it feel less like a pitch..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
            />
          </div>

          {/* Context Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900/80">
              Any additional context about you? (Optional)
              <span className="ml-2 text-xs font-normal text-gray-900/50">
                (e.g., "Dad of two, based in Brighton", "Electronic music focus", "Work full-time so pitch in evenings")
              </span>
            </label>
            <textarea
              value={profile.voice_context_notes}
              onChange={(e) => setProfile({ ...profile, voice_context_notes: e.target.value })}
              rows={2}
              placeholder="Dad of two based in Brighton. I focus on electronic music and run campaigns while working a day job, so I pitch mostly in the evenings..."
              className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-900/30 transition focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/50"
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
      </form>
    </div>
  );
}
