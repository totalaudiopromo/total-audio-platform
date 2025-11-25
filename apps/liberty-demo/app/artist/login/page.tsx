'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Mail, ArrowRight } from 'lucide-react';

export default function ArtistLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock magic link send
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setSent(true);

    // For demo purposes, redirect to kyara portal after 2 seconds
    setTimeout(() => {
      router.push('/artist/kyara');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-semibold text-gray-900 mb-2">
            Liberty Music PR
          </h1>
          <p className="text-gray-600">Artist Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#111] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a magic link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Click the link in the email to access your portal.
              </p>
              <p className="text-xs text-gray-400 mt-4">(Demo: Redirecting you now...)</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600 mb-6">Enter your email to receive a secure login link.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="artist@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="liberty-btn-primary w-full liberty-touch-target disabled:opacity-50 gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send magic link</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Don't have access?{' '}
                  <a
                    href="mailto:hello@libertymusic.co.uk"
                    className="text-black hover:underline font-medium"
                  >
                    Contact your campaign manager
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Demo Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Demo Mode: Use any email to access the portal</p>
        </div>
      </div>
    </div>
  );
}
