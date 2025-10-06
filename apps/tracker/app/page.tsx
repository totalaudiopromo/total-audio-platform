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
    description: 'AI campaign intelligence for working music promoters. Track campaigns, get insights, and know exactly what is working.',
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

const features = [
  {
    title: 'AI Campaign Intelligence',
    description: 'Get instant campaign autopsy, brutal honesty, and actionable next steps powered by AI.',
    color: 'brand-iris',
  },
  {
    title: 'Industry Benchmarks',
    description: 'Compare your campaigns against real data. Know if you\'re outperforming or need to adjust.',
    color: 'brand-magenta',
  },
  {
    title: 'Save 15+ Hours Per Week',
    description: 'Track campaigns in seconds instead of spending weekends in spreadsheets.',
    color: 'brand-amber',
  },
];

export default async function HomePage() {
  // Not authenticated - show landing page
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      {/* Hero */}
      <section className="glass-panel overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/tracker-mascot.png"
                alt="Tracker Detective Mascot"
                width={64}
                height={64}
                className="flex-shrink-0"
              />
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">Campaign Tracker · Total Audio Promo</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Stop wasting 15 hours a week
              <span className="block text-purple-600">
                on campaign tracking
              </span>
            </h1>
            <p className="max-w-xl text-base text-gray-600 sm:text-lg">
              Tracker gives you AI-powered campaign intelligence, industry benchmarks, and pattern recognition.
              Built by a Brighton producer who hated spreadsheet hell.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="cta-button">Start free trial →</Link>
              <Link href="#how-it-works" className="subtle-button">See how it works</Link>
            </div>
            <p className="text-sm text-gray-500">
              For artists, labels, and promoters tracking radio, playlist, blog, and PR campaigns
            </p>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="glass-panel px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gray-500">The Problem</p>
                <h2 className="mt-4 text-2xl font-bold">Campaign tracking is broken</h2>
                <ul className="mt-6 space-y-4 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                    <span>15+ hours per week updating messy spreadsheets manually</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                    <span>No idea if your results are good or terrible - no benchmarks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                    <span>Repeating the same mistakes because you can't see patterns</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-lg border border-purple-600/30 bg-purple-600/10 px-4 py-3">
                  <p className="text-sm font-medium text-purple-600">
                    Tracker fixes all of this with AI-powered campaign intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Intelligence AI - Hero Feature */}
      <section className="glass-panel overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 px-6 py-12 sm:px-10">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-purple-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-bold uppercase tracking-wider text-purple-600">New AI Feature</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Campaign Intelligence AI</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
            Get instant campaign autopsy, brutally honest feedback, and actionable next steps.
            Our AI analyses your campaigns and tells you exactly what to do next.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Campaign Autopsy</p>
              <p className="mt-2 text-xs text-gray-600">What worked, what didn't</p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Your Next Move</p>
              <p className="mt-2 text-xs text-gray-600">Exact action + draft email</p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Brutal Honesty</p>
              <p className="mt-2 text-xs text-gray-600">Reality check + timeline</p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Quick Wins</p>
              <p className="mt-2 text-xs text-gray-600">3 actions for this week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="glass-panel h-full px-6 py-8">
            <div className={`badge-postcraft mb-4`} style={{
              backgroundColor: feature.color === 'brand-iris' ? '#8b5cf6' :
                             feature.color === 'brand-magenta' ? '#ec4899' : '#fbbf24'
            }}>
              {feature.color === 'brand-iris' ? 'AI' :
               feature.color === 'brand-magenta' ? 'DATA' : 'SPEED'}
            </div>
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-3 text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Founder */}
      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
          <div className="flex-shrink-0">
            <Image
              src="/images/chris-schofield-founder.jpg"
              alt="Chris Schofield - Founder"
              width={200}
              height={200}
              className="rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">Built by Someone Who Actually Does This</p>
            <h2 className="mt-4 text-3xl font-semibold">
              Tracking campaigns shouldn't feel like a punishment.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 lg:mx-0">
              I'm Chris – producer (sadact) and I've run radio campaigns for 5 years.
              Spending 15+ hours a week in spreadsheets tracking results was soul-destroying.
              Tracker is what I wish I'd had from day one.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Ready to stop wasting 15 hours a week?</h2>
          <p className="mt-2 max-w-xl text-sm text-gray-600">
            Start free with 3 campaigns. Upgrade when you need more. No credit card required.
          </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup" className="cta-button">Start free trial →</Link>
            <Link href="/pricing" className="subtle-button">View pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
