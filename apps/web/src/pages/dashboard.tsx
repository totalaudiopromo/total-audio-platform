import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export default function DashboardGateway() {
  const [countdown, setCountdown] = useState(5);
  const dashboardUrl = 'https://dashboard.totalaudiopromo.com';

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = dashboardUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLaunch = () => {
    window.location.href = dashboardUrl;
  };

  return (
    <>
      <Head>
        <title>Unified Intelligence Dashboard | Total Audio Promo</title>
        <meta
          name="description"
          content="Real-time intelligence dashboard powered by 8 AI systems. Track campaigns, analyse patterns, and get actionable insights for your music promotion."
        />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        {/* Navigation */}
        <nav className="bg-white border-b-4 border-black px-4 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden bg-white">
                <Image
                  src="/images/total_audio_promo_logo_trans.png"
                  alt="Total Audio Promo Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">Total Audio Promo</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Unified Intelligence Dashboard
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Campaign Command Centre
              </h1>

              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Real-time intelligence powered by 8 AI systems working together. See what's working,
                spot patterns, and get actionable insights for every campaign.
              </p>

              {/* Launch Button */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleLaunch}
                  className="inline-flex items-center justify-center rounded-xl border-4 border-black bg-blue-600 px-12 py-5 text-lg font-bold text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-blue-700 active:scale-95"
                >
                  Launch Dashboard →
                </button>

                <p className="text-sm text-gray-500">
                  Redirecting automatically in <span className="font-bold">{countdown}</span>{' '}
                  seconds...
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              {/* Feature 1: Intelligence */}
              <div className="rounded-2xl border-4 border-blue-600 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 text-xl">
                  AI
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8 AI Systems</h3>
                <p className="text-gray-700 text-sm">
                  Intelligence Navigator, Pattern Detection, Signal Threads, Coverage Fusion,
                  Identity Kernel, Trajectory Forecasting, Workspace Benchmarking, and Automations
                  Drawer.
                </p>
              </div>

              {/* Feature 2: Real-time */}
              <div className="rounded-2xl border-4 border-purple-600 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Insights</h3>
                <p className="text-gray-700 text-sm">
                  Live campaign monitoring, instant pattern detection, and AI-powered next actions.
                  Know what's working before your competition does.
                </p>
              </div>

              {/* Feature 3: Unified */}
              <div className="rounded-2xl border-4 border-green-600 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white font-bold flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">One Dashboard</h3>
                <p className="text-gray-700 text-sm">
                  All your campaigns, contacts, and intelligence in one place. No more switching
                  between tools. No more data silos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-blue-50 to-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Built for the way you actually work
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          For Radio Promoters
                        </h3>
                        <p className="text-gray-700">
                          Track every submission, monitor response rates, and identify which
                          contacts convert. Built by someone who actually does this job.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-purple-600 mt-2" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          For Independent Artists
                        </h3>
                        <p className="text-gray-700">
                          Stop spending weekends in spreadsheet hell. See which promotion tactics
                          actually work for your music.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-green-600 mt-2" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">For PR Agencies</h3>
                        <p className="text-gray-700">
                          Manage multiple artists from one dashboard. Benchmark performance across
                          your roster. Prove ROI to clients.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-4 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">What you'll see inside:</h3>
                  <ul className="space-y-3 text-gray-700 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">→</span>
                      <span>Campaign overview cards with AI-powered insights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold">→</span>
                      <span>Pattern highlights showing what's working</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold">→</span>
                      <span>Real-time activity feed from all your tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">→</span>
                      <span>AI-suggested next actions for every campaign</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-600 font-bold">→</span>
                      <span>Trajectory forecasting and trend analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">→</span>
                      <span>Cross-campaign benchmarking and performance metrics</span>
                    </li>
                  </ul>

                  <button
                    onClick={handleLaunch}
                    className="w-full inline-flex items-center justify-center rounded-xl border-4 border-black bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-blue-700 active:scale-95"
                  >
                    Launch Dashboard →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t-4 border-black py-8 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-700">
              Part of the{' '}
              <Link href="/" className="font-bold text-blue-600 hover:underline">
                Total Audio Promo
              </Link>{' '}
              ecosystem
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
