"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [voiceProfileComplete, setVoiceProfileComplete] = useState(false);
  const [loadingVoiceStatus, setLoadingVoiceStatus] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      checkVoiceProfileStatus();
    }
  }, [session]);

  async function checkVoiceProfileStatus() {
    try {
      const response = await fetch('/api/voice/profile');
      const result = await response.json();
      if (result.success && result.profile?.voice_profile_completed) {
        setVoiceProfileComplete(true);
      }
    } catch (error) {
      console.error('Error checking voice profile:', error);
    } finally {
      setLoadingVoiceStatus(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-panel px-6 py-12 text-center text-gray-900/70">Loading your workspace…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="glass-panel px-6 py-12 text-center">
          <h1 className="text-3xl font-semibold">Sign in to access profile details</h1>
          <p className="mt-3 text-sm text-gray-900/70">
            The profile section is protected by NextAuth. Use the demo credentials or an OAuth provider to sign in and explore the authenticated dashboard shell.
          </p>
          <div className="mt-6 flex justify-center">
            <button onClick={() => signIn()} className="cta-button">Continue to sign in</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="glass-panel px-6 py-8">
        <span className="badge-postcraft">Signed in</span>
        <h1 className="mt-6 text-3xl font-semibold">Your Profile</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          Manage your account settings, voice profile, and subscription
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel px-6 py-8">
          <h2 className="text-xl font-semibold">Account</h2>
          <dl className="mt-4 space-y-3 text-sm text-gray-900/70">
            <div>
              <dt className="font-medium uppercase tracking-[0.35em] text-gray-900/40">Name</dt>
              <dd className="mt-1 text-gray-900">{session.user?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-medium uppercase tracking-[0.35em] text-gray-900/40">Email</dt>
              <dd className="mt-1 text-gray-900">{session.user?.email ?? '—'}</dd>
            </div>
          </dl>
        </div>
        <div className="glass-panel px-6 py-8">
          <h2 className="text-xl font-semibold">Voice Profile</h2>
          {loadingVoiceStatus ? (
            <div className="mt-4 animate-pulse text-sm text-gray-900/50">
              Checking voice profile status...
            </div>
          ) : voiceProfileComplete ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Voice profile active</span>
              </div>
              <p className="text-sm text-gray-900/70">
                Your pitches will now be written in your authentic voice
              </p>
              <a href="/profile/voice" className="block rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-900/70 transition hover:bg-gray-100">
                <span className="font-semibold text-gray-900">Edit voice profile</span> · Update your writing style and preferences
              </a>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-brand-iris">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Voice profile not set up</span>
              </div>
              <p className="text-sm text-gray-900/70">
                Set up your voice profile to make AI pitches sound like you wrote them
              </p>
              <a href="/profile/voice" className="block rounded-2xl bg-brand-iris/10 px-4 py-3 text-sm transition hover:bg-brand-iris/20 border-2 border-brand-iris/30">
                <span className="font-semibold text-brand-iris">Set up voice profile</span> · Takes 2-5 minutes
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="glass-panel px-6 py-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <a href="/pitch/generate" className="block rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-900/70 transition hover:bg-gray-100">
            <span className="font-semibold text-gray-900">Generate a pitch</span> · Create personalised pitches in seconds
          </a>
          <a href="/pitch/contacts" className="block rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-900/70 transition hover:bg-gray-100">
            <span className="font-semibold text-gray-900">Manage contacts</span> · Build your database of radio, press, and playlist contacts
          </a>
        </div>
      </section>

      <div className="glass-panel flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-900/40">Session details</p>
          <p className="mt-1 text-xs text-gray-900/60">Authenticated via NextAuth · Secure session active</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="subtle-button">
          Sign out
        </button>
      </div>
    </div>
  );
}
