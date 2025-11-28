/**
 * Audio Intel Sign Up Form
 * Neobrutalist design with Audio the Dog mascot and Google OAuth
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@total-audio/core-db/client';
import { User, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center animate-slide-up">
            <div className="w-20 h-20 md:w-24 md:h-24 relative mx-auto animate-float">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-500 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-black text-green-700">Account Created!</span>
            </div>

            <h2 className="mt-4 text-2xl font-black text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-gray-600 font-bold">
              We've sent you a confirmation email. Click the link to activate your account.
            </p>

            <Link
              href="/signin"
              className="mt-6 inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Auth Card - Neobrutalist Style */}
        <div className="rounded-2xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up">
          {/* Logo Hero */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 relative animate-float">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <h1 className="mt-4 text-2xl md:text-3xl font-black text-gray-900 text-center">
              Join Audio Intel
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-600 font-bold text-center">
              Start enriching contacts in minutes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          )}

          {/* Google Sign-Up - Primary CTA */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-900 font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-bold">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/40 focus:border-blue-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 font-bold">Must be at least 8 characters</p>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600 font-bold">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-700 font-black underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Powered by <span className="font-black text-blue-600">Total Audio Promo</span>
        </p>
      </div>
    </div>
  );
}
