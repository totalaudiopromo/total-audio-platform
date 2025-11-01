'use client';

// Force dynamic rendering to ensure middleware auth checks run
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@total-audio/core-db/client';
import Link from 'next/link';
import { UserMenu } from '@/components/auth/UserMenu';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Link
            href="/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header with User Menu */}
      <header className="bg-white border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Audio Intel</h1>
            <p className="text-sm font-bold text-blue-600">Contact Intelligence Dashboard</p>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Welcome back, {displayName}</h2>
          <p className="text-lg font-bold text-gray-600">
            Ready to enrich your contacts and save hours of research time
          </p>
        </div>

        {/* Quick Actions - Neobrutalist Style */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Start Enrichment Card */}
          <Link href="/demo" className="group">
            <div className="bg-white rounded-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-4 border-blue-600 bg-blue-50 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-black uppercase tracking-wider text-blue-600">
                  Start Here
                </span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Enrich Your Contacts</h3>
              <p className="text-gray-700 font-bold mb-6">
                Upload your contact list and watch AI transform hours of research into minutes
              </p>
              <span className="inline-flex items-center gap-2 text-blue-600 font-black group-hover:gap-3 transition-all">
                Start Enriching
                <span>→</span>
              </span>
            </div>
          </Link>

          {/* Upgrade Card */}
          <Link href="/pricing" className="group">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-4 border-blue-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-black uppercase tracking-wider text-blue-600">
                  Upgrade
                </span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Unlock Unlimited Access</h3>
              <p className="text-gray-700 font-bold mb-6">
                Get unlimited enrichments, advanced features, and priority support
              </p>
              <span className="inline-flex items-center gap-2 text-blue-600 font-black group-hover:gap-3 transition-all">
                View Pricing
                <span>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                Your Plan
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">Free</p>
            <p className="text-sm font-bold text-gray-600 mt-1">10 enrichments/month</p>
          </div>

          <div className="bg-white rounded-xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                Used This Month
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">0 / 10</p>
            <p className="text-sm font-bold text-blue-600 mt-1">All available</p>
          </div>

          <div className="bg-white rounded-xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                Member Since
              </span>
            </div>
            <p className="text-xl font-black text-gray-900">
              {new Date(user.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black text-gray-900 mb-6">Account Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
              <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                Email
              </span>
              <p className="font-bold text-gray-900">{user.email}</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
              <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                Subscription
              </span>
              <p className="font-bold text-gray-900">Free Plan</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-black uppercase tracking-wider text-gray-600">
                Single Sign-On
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 border-2 border-green-600 px-4 py-1.5 text-xs font-black uppercase text-green-800">
                ✓ Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
