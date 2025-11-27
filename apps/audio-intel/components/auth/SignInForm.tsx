/**
 * Sign In Form Component - Neobrutalist Design System
 * Matches Pitch Generator and Tracker styling
 */

'use client';

import { useState } from 'react';
import { createClient } from '@total-audio/core-db/client';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect will happen via middleware
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage('Check your email for a magic link!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
      {error && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-2xl border-2 border-green-500 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-[0.35em] text-gray-500"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-bold uppercase tracking-[0.35em] text-gray-500"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="cta-button w-full justify-center">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white font-bold text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={loading || !email}
        className="subtle-button w-full justify-center"
      >
        Send Magic Link
      </button>
    </form>
  );
}
