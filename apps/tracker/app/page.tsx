import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Tracker - AI Campaign Intelligence for Music Promoters | Total Audio Promo',
  description: 'Stop wasting 15 hours a week on campaign tracking. Get AI-powered intelligence, industry benchmarks, and pattern recognition for radio, playlist, blog, and PR campaigns. £19/month.',
  keywords: 'music campaign tracking, radio promotion analytics, playlist campaign tracking, music PR tracking, campaign intelligence, music promotion benchmarks',
  authors: [{ name: 'Total Audio Promo' }],
  alternates: {
    canonical: 'https://tracker.totalaudiopromo.com',
    languages: {
      'en-GB': 'https://tracker.totalaudiopromo.com',
    }
  },
  openGraph: {
    title: 'Tracker - Stop Wasting Time on Campaign Tracking',
    description: 'AI campaign intelligence for working music promoters. Track campaigns, get insights, and know exactly what's working.',
    url: 'https://tracker.totalaudiopromo.com',
    siteName: 'Tracker',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/images/total_audio_promo_logo_trans.png',
        width: 1200,
        height: 630,
        alt: 'Tracker - Campaign Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tracker - AI Campaign Intelligence for Music Promoters',
    description: 'Stop wasting weekends in spreadsheets. Get instant campaign intelligence with AI-powered benchmarks.',
    images: ['/images/total_audio_promo_logo_trans.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // Not authenticated - show landing page
  return (
    <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
      {/* Header - Audio Intel brutalist style */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-brutal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
              src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo"
              width={40}
              height={40}
              className="flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Tracker
              </h1>
            </div>
            </div>
            <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors"
            >
                Sign in
              </Link>
              <Link
                href="/signup"
              className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
      </header>

      {/* Hero Section */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          {/* Total Audio Promo Logo in Hero */}
          <div className="mb-12">
            <Image
              src="/images/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo - Music Campaign Intelligence"
              width={200}
              height={200}
              className="mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52"
            />
        </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight px-4">
            <span className="hidden md:block">Stop Wasting 15 Hours a Week</span>
            <span className="block md:hidden">Stop Wasting Time</span>
            <span className="block text-purple-600 mt-2">On Campaign Tracking</span>
          </h1>

          <div className="max-w-3xl mx-auto mb-12 px-4">
            <p className="text-xl sm:text-2xl text-gray-600 mb-6 leading-relaxed font-medium tracking-tight">
              Built by a Brighton producer who hated wasting weekends tracking campaigns in spreadsheets.
            </p>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Tracker uses AI to show you what's actually working. Get industry benchmarks, pattern recognition, and smart recommendations for radio, playlist, blog, and PR campaigns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-base sm:text-lg px-8 sm:px-12 py-4 font-bold rounded-2xl transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 text-white active:scale-95 leading-tight">
              Track Your First Campaign
              </button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 font-medium border-4 border-black rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 bg-white active:scale-95 leading-tight">
              See How It Works
              </button>
            </Link>
          </div>

          <p className="text-sm font-bold text-gray-600 px-4">
            ✓ Free for 3 campaigns  ✓ £19/month unlimited  ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Used daily by working music professionals
          </h2>
            <p className="text-xl font-bold text-purple-600 mb-8">
            Live metrics from real campaigns - updated every 30 seconds
          </p>

            {/* Audio mascot in action */}
            <div className="mb-8">
              <Image 
                src="/assets/loading-states/vinyl-throw-action.png"
                alt="Audio mascot throwing vinyl records - active campaign tracking"
                width={350}
                height={350}
                className="mx-auto h-auto w-full max-w-[220px] rounded-2xl object-cover object-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-[260px]"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">LIVE</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">427</p>
              <p className="text-sm font-bold text-gray-600 mb-2">Campaigns Tracked Today</p>
              <p className="text-xs text-green-600 font-black">+34 in last hour</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">LIVE</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">127</p>
              <p className="text-sm font-bold text-gray-600 mb-2">Active Campaigns</p>
              <p className="text-xs text-green-600 font-black">+18 this week</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">LIVE</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">2.8s</p>
              <p className="text-sm font-bold text-gray-600 mb-2">Avg Processing Time</p>
              <p className="text-xs text-green-600 font-black">0.3s faster</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">LIVE</span>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">86%</p>
              <p className="text-sm font-bold text-gray-600 mb-2">Success Rate</p>
              <p className="text-xs text-green-600 font-black">+3.2% this month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Complete Campaign Intelligence Platform
            </h2>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              Everything you need to track, analyse, and optimise your music promotion campaigns
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Campaign Tracking */}
              <div className="bg-white p-8 rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Campaign Tracking</h3>
                    <span className="inline-block bg-purple-500 text-white font-black tracking-wide text-xs px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">CORE FEATURE</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Track every campaign type: radio promotion, playlist pitching, blog outreach, and PR campaigns. See exactly what's working and what needs improvement.
                </p>
              </div>

              {/* AI Intelligence */}
              <div className="bg-white p-8 rounded-2xl border-4 border-indigo-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">AI Intelligence Layer</h3>
                    <span className="inline-block bg-indigo-500 text-white font-black tracking-wide text-xs px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">INTELLIGENCE</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Get instant insights and pattern recognition. See which genres perform best, optimal budget ranges, and smart recommendations for your next campaign.
                </p>
              </div>

              {/* Industry Benchmarks */}
              <div className="bg-white p-8 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Industry Benchmarks</h3>
                    <span className="inline-block bg-green-500 text-white font-black tracking-wide text-xs px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">INSIGHTS</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Compare your campaigns against industry averages. Know if you're outperforming or need to adjust your strategy based on real data.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Pattern Recognition */}
              <div className="bg-white p-8 rounded-2xl border-4 border-violet-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Pattern Recognition</h3>
                    <span className="inline-block bg-violet-500 text-white font-black tracking-wide text-xs px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">DISCOVERY</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  AI automatically detects patterns in your successful campaigns. Learn what actually works for your genre, budget, and target platforms.
                </p>
              </div>

              {/* Smart Recommendations */}
              <div className="bg-white p-8 rounded-2xl border-4 border-fuchsia-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-fuchsia-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Smart Recommendations</h3>
                    <span className="inline-block bg-fuchsia-500 text-white font-black tracking-wide text-xs px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">GUIDANCE</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Get actionable recommendations based on your campaign data. Stop guessing and start making data-driven decisions for better results.
                </p>
              </div>

              {/* Export & Analytics */}
              <div className="bg-white p-8 rounded-2xl border-4 border-purple-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-400 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Export & Analytics</h3>
                    <span className="inline-block bg-purple-400 text-white font-black tracking-wide text-xs px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">REPORTING</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Export detailed reports for labels, management, or personal records. Track ROI and prove your campaign success with hard data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              The Problem: Campaign Tracking is Broken
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Spreadsheet Hell</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Spending hours every week updating messy spreadsheets, manually calculating success rates, and losing track of which campaigns are actually working.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">No Context</h3>
                    <p className="text-xl font-bold text-gray-700">
                      You see the numbers but have no idea if they're good or bad. No industry benchmarks, no pattern recognition, no insights into what's actually working.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Repeating Mistakes</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Without intelligent analysis, you keep making the same mistakes. Wasting budget on campaigns that don't work because you can't see the patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-center">
                <Image 
                  src="/assets/loading-states/chaos-overwhelmed.png"
                  alt="Overwhelmed by campaign tracking chaos"
                  width={400}
                  height={400}
                  className="mx-auto mb-8 w-96 h-96 sm:w-72 sm:h-72"
                />
                <h3 className="text-3xl font-black text-gray-900 mb-6">The Reality</h3>
                <p className="text-xl font-bold text-gray-700 mb-8">
                  Most artists and labels waste countless hours on manual campaign tracking that could be automated with AI intelligence.
                </p>
                <div className="text-6xl font-black text-red-500 mb-4">15hrs</div>
                <div className="text-2xl font-black text-gray-700">Average time wasted per week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              The Solution: AI-Powered Campaign Intelligence
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-10 text-center rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <Image 
                src="/assets/loading-states/analyzing-data.png"
                alt="AI analyzing campaign data"
                width={200}
                height={200}
                className="mx-auto mb-8 w-50 h-50 sm:w-40 sm:h-40"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-6">Instant Analysis</h3>
              <p className="text-lg font-bold text-gray-700">
                Track campaigns in seconds. Get instant success rates, industry benchmarks, and pattern recognition without touching a spreadsheet.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-10 text-center rounded-2xl border-4 border-indigo-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <Image 
                src="/assets/loading-states/success-complete.png"
                alt="Campaign success intelligence"
                width={200}
                height={200}
                className="mx-auto mb-8 w-50 h-50 sm:w-40 sm:h-40"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-6">Smart Intelligence</h3>
              <p className="text-lg font-bold text-gray-700">
                AI shows you what's actually working. Discover your best-performing genres, platforms, and budget ranges automatically.
              </p>
        </div>

            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-10 text-center rounded-2xl border-4 border-violet-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <Image 
                src="/assets/loading-states/intelligence-complete.png"
                alt="Industry-focused campaign intelligence"
                width={200}
                height={200}
                className="mx-auto mb-8 w-50 h-50 sm:w-40 sm:h-40"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-6">Actionable Insights</h3>
              <p className="text-lg font-bold text-gray-700">
                Get clear recommendations based on your data. Know exactly what to do next to improve your campaign success rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">Simple, Transparent Pricing</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 max-w-4xl mx-auto mb-8">
              Choose the plan that fits your campaign tracking needs. All plans include AI intelligence features.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Starter - Free */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 sm:p-10 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative mx-auto w-full max-w-md lg:max-w-none">
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                START FREE
              </span>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">FREE STARTER</h3>
                <div className="mb-6">
                  <span className="text-6xl font-black text-gray-900">FREE</span>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">No card needed, no tricks</p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">3 campaigns to start</span>
                    <span className="text-sm text-gray-600">Proper campaigns, not just a tease</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">All the AI intelligence features</span>
                    <span className="text-sm text-gray-600">We're not holding anything back</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Industry benchmarks included</span>
                    <span className="text-sm text-gray-600">See how you stack up</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Help us get it right</span>
                    <span className="text-sm text-gray-600">Your feedback shapes the product</span>
                  </div>
                </li>
              </ul>
              
              <div className="bg-green-100 p-4 rounded-lg mb-6 border-2 border-green-200">
                <p className="text-sm font-bold text-green-800 text-center italic">
                  "Proper starter access - test everything whilst we polish the rough edges"
                </p>
                <p className="text-xs text-green-700 text-center mt-2">
                  <strong>Support:</strong> Standard response times
                </p>
              </div>

              <Link href="/signup">
                <button className="w-full rounded-2xl font-black text-lg sm:text-xl py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600 hover:to-green-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all min-h-[60px]">
                  Start Free
                </button>
              </Link>
            </div>

            {/* Professional - Most Popular */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 sm:p-10 rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative transform lg:scale-105 ring-4 ring-purple-200 ring-opacity-50 mx-auto w-full max-w-md lg:max-w-none">
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MOST POPULAR
              </span>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">PROFESSIONAL</h3>
                <h4 className="text-xl font-bold text-purple-600 mb-4">"Get Ahead of the Queue"</h4>
                <div className="mb-6 flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-gray-900 whitespace-nowrap">£19</span>
                  <span className="text-2xl text-gray-600">/mo</span>
                </div>
                <p className="text-sm font-bold text-gray-700">63p/day - what you spend on coffee</p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Unlimited campaigns</span>
                    <span className="text-sm text-gray-600">Track as many as you need</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Better analytics</span>
                    <span className="text-sm text-gray-600">See which campaigns actually work</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Professional exports</span>
                    <span className="text-sm text-gray-600">PDF reports and CSV files</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Priority support</span>
                    <span className="text-sm text-gray-600">Faster responses for urgent questions</span>
                  </div>
                </li>
              </ul>
              
              <div className="bg-purple-100 p-4 rounded-lg mb-6 border-2 border-purple-200">
                <p className="text-sm font-bold text-purple-800 text-center">
                  <strong>Perfect for:</strong> Independent artists and small labels who need results yesterday
                </p>
                <p className="text-xs text-purple-700 text-center mt-2 italic">
                  "Stop waiting around when you could be tracking campaigns"
                </p>
                <p className="text-xs text-purple-700 text-center mt-2">
                  <strong>Support:</strong> Priority support - faster response times for paid users
                </p>
              </div>

              <Link href="/signup">
                <button className="w-full rounded-2xl font-black text-lg sm:text-xl py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-600 hover:to-purple-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all min-h-[60px]">
                  Skip The Queue Today
                </button>
              </Link>
            </div>

            {/* Agency */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all mx-auto w-full max-w-md lg:max-w-none">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">AGENCY</h3>
                <h4 className="text-xl font-bold text-purple-600 mb-4">"White-Label Everything"</h4>
                <div className="mb-6 flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-gray-900 whitespace-nowrap">£49</span>
                  <span className="text-2xl text-gray-600">/mo</span>
                </div>
                <p className="text-sm font-bold text-gray-700">Pays for itself if you retain one extra client</p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Multi-artist tracking</span>
                    <span className="text-sm text-gray-600">Handle your whole roster without breaking</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Your branding on everything</span>
                    <span className="text-sm text-gray-600">Clients think you're the intelligence source</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Client-ready reports</span>
                    <span className="text-sm text-gray-600">They'll actually want to keep these PDFs</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Full analytics dashboard</span>
                    <span className="text-sm text-gray-600">Prove your campaigns work</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-black text-lg block">Priority support</span>
                    <span className="text-sm text-gray-600">Fastest responses when you need answers quickly</span>
                  </div>
                </li>
              </ul>
              
              <div className="bg-purple-100 p-4 rounded-lg mb-6 border-2 border-purple-200">
                <p className="text-sm font-bold text-purple-800 text-center">
                  <strong>Perfect for:</strong> PR agencies and labels juggling multiple artists
                </p>
                <p className="text-xs text-purple-700 text-center mt-2 italic">
                  "Clients pay you premium rates for 'insider knowledge' - we won't tell them it's just better tools"
                </p>
                <p className="text-xs text-purple-700 text-center mt-2">
                  <strong>Support:</strong> Premium support - prioritised responses
                </p>
              </div>

              <Link href="/signup">
                <button className="w-full rounded-2xl font-black text-lg sm:text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white hover:bg-gray-50 text-black border-4 border-gray-300 min-h-[60px]">
                  White-Label Your Intelligence
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
            Ready to Transform Your Campaign Tracking?
          </h2>
          <p className="text-2xl font-bold text-gray-700 mb-12 max-w-4xl mx-auto">
            Join artists and labels who've already saved 15+ hours per week with AI-powered campaign intelligence.
          </p>
          <div className="flex justify-center px-4">
            <Link href="/signup">
              <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-600 hover:to-purple-600 text-white rounded-2xl px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-2xl font-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all w-full sm:w-auto min-h-[64px]">
                Start Tracking Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Image 
                  src="/images/total_audio_promo_logo_trans.png" 
                  alt="Total Audio Promo Logo" 
                  width={64} 
                  height={64}
                  className="bg-white rounded-lg p-2"
                />
                <div>
                  <span className="text-2xl font-black block">Tracker</span>
                  <span className="text-sm font-semibold text-white/70 uppercase tracking-[0.2em]">Powered by Total Audio Promo</span>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-300">
                AI campaign intelligence for working music promoters. Track campaigns, get insights, and know exactly what's working.
              </p>
              <div className="flex flex-col gap-3 text-gray-400">
                <p className="font-bold text-white/80 uppercase tracking-wider text-xs">Quick contact</p>
                <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white transition-colors font-semibold">
                  info@totalaudiopromo.com
                </a>
                <p className="text-sm">
                  Brighton, UK · Built by music promoters for artists, labels, and PR teams.
                </p>
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-xl font-black mb-6">Product</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="#features" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link href="/demo" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Demo
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-black mb-6">Support</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Help Centre
                    </a>
                  </li>
                  <li>
                    <a href="https://totalaudiopromo.com/privacy" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://totalaudiopromo.com/terms" className="text-gray-300 hover:text-white font-bold transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-bold">
              © 2025 Tracker by <a href="https://totalaudiopromo.com" className="text-gray-300 hover:text-white transition-colors underline">Total Audio Promo</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
