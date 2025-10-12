'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Zap, Send, MessageCircle, TrendingUp, Loader2 } from 'lucide-react';
import { supabase, type Pitch } from '@/lib/supabase';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { OnboardingChecklist } from '@/components/OnboardingChecklist';
import { UsageMeter } from '@/components/UsageMeter';

interface DashboardStats {
  totalPitches: number;
  sentPitches: number;
  replies: number;
  successRate: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPitches: 0,
    sentPitches: 0,
    replies: 0,
    successRate: 0,
  });
  const [recentPitches, setRecentPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      loadDashboardData();
    }
  }, [session]);

  async function loadDashboardData() {
    try {
      // For demo purposes, we'll use email as user_id
      // In production, you'd have a proper user_id from your auth system
      const userId = session?.user?.email || '';

      // Use API route instead of direct Supabase call
      const response = await fetch('/api/stats');
      if (!response.ok) {
        console.warn('Stats API not ready, using defaults');
        setStats({ totalPitches: 0, sentPitches: 0, replies: 0, successRate: 0 });
      } else {
        const data = await response.json();
        setStats(data.stats);
      }

      // Get recent pitches
      const pitchesResponse = await fetch('/api/pitches?limit=5');
      if (!pitchesResponse.ok) {
        console.warn('Pitches API not ready, showing empty state');
        setRecentPitches([]);
      } else {
        const pitchesData = await pitchesResponse.json();
        setRecentPitches(pitchesData.pitches || []);
      }
      return;

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({ totalPitches: 0, sentPitches: 0, replies: 0, successRate: 0 });
      setRecentPitches([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyPitch(pitch: Pitch) {
    const fullPitch = `${pitch.subject_line}\n\n${pitch.pitch_body}`;
    await navigator.clipboard.writeText(fullPitch);
    alert('Pitch copied to clipboard!');
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'sent': return 'bg-brand-iris/20 text-brand-iris';
      case 'replied': return 'bg-success/20 text-success';
      case 'success': return 'bg-success/30 text-success';
      case 'no_reply': return 'bg-gray-50 text-gray-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  function getTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-iris" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <div className="glass-panel px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">Pitch Generator</span>
            <h1 className="mt-3 text-3xl font-bold">
              Welcome back, <span className="text-blue-600">{session.user?.name || 'there'}</span>
            </h1>
            <p className="mt-2 text-gray-900/60">
              Write personalized pitches in seconds, not hours
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pitch/generate" className="cta-button flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate New Pitch
            </Link>
            <Link href="/pitch/batch" className="subtle-button flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Batch Mode
            </Link>
          </div>
        </div>
      </div>

      {/* Onboarding Checklist - Show for new users */}
      {stats.totalPitches === 0 && session?.user?.email && (
        <OnboardingChecklist userId={session.user.email} />
      )}

      {/* Usage Meter - Show for free tier users */}
      {session?.user?.email && (
        <UsageMeter userId={session.user.email} />
      )}

      {/* Empty State - Show when no pitches */}
      {stats.totalPitches === 0 ? (
        <div className="glass-panel px-8 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-iris/10">
              <Zap className="h-8 w-8 text-brand-iris" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Generate Your First Pitch</h2>
            <p className="mt-3 text-gray-900/60">
              Start creating professional, personalised pitches in seconds. Our AI helps you write
              pitches that sound like you, matched to each contact's preferences.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/pitch/generate" className="cta-button flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Your First Pitch
              </Link>
              <Link href="/pitch/templates" className="subtle-button">
                Browse Templates
              </Link>
            </div>
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-gray-50 px-4 py-4">
                <div className="text-2xl font-bold text-brand-iris">6</div>
                <p className="mt-1 text-xs text-gray-900/60">Proven templates from real campaigns</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gray-50 px-4 py-4">
                <div className="text-2xl font-bold text-brand-magenta">3</div>
                <p className="mt-1 text-xs text-gray-900/60">Subject line variations per pitch</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gray-50 px-4 py-4">
                <div className="text-2xl font-bold text-success">2min</div>
                <p className="mt-1 text-xs text-gray-900/60">Average time to generate a pitch</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-panel px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-900/40">Total Pitches</p>
                  <p className="mt-3 text-3xl font-bold">{stats.totalPitches}</p>
                </div>
                <div className="rounded-full bg-brand-iris/20 p-3">
                  <Zap className="h-5 w-5 text-brand-iris" />
                </div>
              </div>
            </div>

            <div className="glass-panel px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-900/40">Sent</p>
                  <p className="mt-3 text-3xl font-bold">{stats.sentPitches}</p>
                </div>
                <div className="rounded-full bg-brand-magenta/20 p-3">
                  <Send className="h-5 w-5 text-brand-magenta" />
                </div>
              </div>
            </div>

            <div className="glass-panel px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-900/40">Replies</p>
                  <p className="mt-3 text-3xl font-bold">{stats.replies}</p>
                </div>
                <div className="rounded-full bg-success/20 p-3">
                  <MessageCircle className="h-5 w-5 text-success" />
                </div>
              </div>
            </div>

            <div className="glass-panel px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-900/40">Response Rate</p>
                  <p className="mt-3 text-3xl font-bold">{(stats.successRate || 0).toFixed(1)}%</p>
                </div>
                <div className="rounded-full bg-brand-amber/20 p-3">
                  <TrendingUp className="h-5 w-5 text-brand-amber" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Pitches */}
      <div className="glass-panel px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Recent Pitches</h2>
            <p className="mt-1 text-sm text-gray-900/60">Your latest pitch activity</p>
          </div>
          <Link href="/pitch/history" className="subtle-button text-sm">
            View All
          </Link>
        </div>

        {recentPitches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-8 py-12 text-center">
            <Zap className="mx-auto h-12 w-12 text-gray-900/30" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900/70">No pitches yet</h3>
            <p className="mt-2 text-sm text-gray-900/50">
              Generate your first pitch to get started
            </p>
            <Link href="/pitch/generate" className="cta-button mt-6 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Pitch
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="group rounded-2xl border border-white/10 bg-gray-50 px-6 py-5 transition hover:border-gray-300 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate font-semibold">{pitch.contact_name}</h3>
                      {pitch.contact_outlet && (
                        <>
                          <span className="text-gray-900/30">•</span>
                          <span className="truncate text-sm text-gray-900/60">{pitch.contact_outlet}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-900/70">
                      "{pitch.track_title}" by {pitch.artist_name}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-900/50">
                      <span className={`rounded-full px-3 py-1 ${getStatusColor(pitch.status)}`}>
                        {pitch.status.replace('_', ' ')}
                      </span>
                      <span>{getTimeAgo(pitch.created_at!)}</span>
                      {pitch.sent_at && <span>• Sent {getTimeAgo(pitch.sent_at)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyPitch(pitch)}
                      className="subtle-button text-xs opacity-0 transition group-hover:opacity-100"
                    >
                      Copy
                    </button>
                    <Link
                      href={`/pitch/${pitch.id}`}
                      className="subtle-button text-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <NewsletterSignup
        variant="card"
        title="Get The Unsigned Advantage Newsletter"
        description="Weekly music industry insights, radio promotion tips, and exclusive tools to help independent artists break through. Join 100+ artists and promoters."
      />

      {/* Quick Links */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/pitch/templates" className="glass-panel group px-8 py-8 transition hover:border-brand-iris/50">
          <h3 className="text-xl font-semibold">Template Library</h3>
          <p className="mt-2 text-sm text-gray-900/60">
            Browse genre-specific templates from 500+ successful campaigns
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-brand-iris transition group-hover:gap-2">
            Browse templates →
          </span>
        </Link>

        <Link href="/pitch/contacts" className="glass-panel group px-8 py-8 transition hover:border-brand-magenta/50">
          <h3 className="text-xl font-semibold">Manage Contacts</h3>
          <p className="mt-2 text-sm text-gray-900/60">
            Add and organize your media contacts for personalized pitches
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-brand-magenta transition group-hover:gap-2">
            View contacts →
          </span>
        </Link>
      </div>
    </div>
  );
}

