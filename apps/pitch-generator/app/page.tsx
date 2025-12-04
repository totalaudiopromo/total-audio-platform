import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, Clock, Target, TrendingUp, Copy, Star, Brain, Check } from 'lucide-react';
import {
  JsonLd,
  generateWebsiteJsonLd,
  generateSoftwareApplicationJsonLd,
  generateOrganizationJsonLd,
} from '@/lib/json-ld';

const features = [
  {
    icon: Sparkles,
    title: 'AI That Sounds Human',
    description:
      'No robotic pitches. Our AI writes natural, conversational emails that get responses.',
    color: 'brand-amber',
  },
  {
    icon: Target,
    title: 'Contact-Powered Personalisation',
    description:
      "Import enriched contacts from Audio Intel or add manually. AI tailors each pitch to the contact's preferences.",
    color: 'brand-amber',
  },
  {
    icon: Clock,
    title: 'Save 5+ Hours Per Campaign',
    description:
      'Generate 50 personalised pitches in 20 minutes instead of spending hours on each one.',
    color: 'brand-amber',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Select a contact',
    description: 'Add contacts manually or sync from Audio Intel (optional)',
  },
  {
    step: '02',
    title: 'Add track details',
    description: 'Artist name, track title, and what makes it special',
  },
  {
    step: '03',
    title: 'Generate & send',
    description: 'AI creates a personalised pitch in 30 seconds. Copy and send.',
  },
];

const websiteJsonLd = generateWebsiteJsonLd();
const softwareJsonLd = generateSoftwareApplicationJsonLd();
const organizationJsonLd = generateOrganizationJsonLd({
  name: 'Total Audio Promo',
  url: 'https://totalaudiopromo.com',
  logo: 'https://pitch.totalaudiopromo.com/total_audio_promo_logo_trans.png',
  description:
    'AI-powered tools for music industry professionals including contact enrichment, pitch generation, and campaign tracking',
  sameAs: ['https://twitter.com/totalaudiopromo', 'https://linkedin.com/company/total-audio-promo'],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Hero */}
        <section className="glass-panel overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Pitch Generator · Total Audio Promo
              </span>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Write 50 personalised pitches in
                <span className="block text-brand-amber-dark font-black">20 minutes</span>
              </h1>
              <p className="max-w-xl text-base text-gray-600 sm:text-lg">
                Pitch Generator uses AI + your contact data to write professional music PR pitches
                that actually get responses. No more staring at blank emails.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/auth/signin" className="cta-button">
                  Generate my first 50 pitches
                </Link>
                <Link href="#how-it-works" className="subtle-button">
                  Show me how it works
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                For artists, managers, and promoters who hate writing the same pitch 50 times
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="glass-panel px-8 py-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gray-500">
                    The Problem
                  </p>
                  <h2 className="mt-4 text-2xl font-bold">Stop wasting time on pitches</h2>
                  <ul className="mt-6 space-y-4 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                      <span>5+ hours per campaign writing personalised pitches</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                      <span>ChatGPT doesn't know your contacts, so pitches feel generic</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                      <span>You're copy-pasting templates and they feel impersonal</span>
                    </li>
                  </ul>
                  <div className="mt-6 rounded-lg border border-brand-amber/30 bg-brand-amber/10 px-4 py-3">
                    <p className="text-sm font-medium text-brand-amber-dark">
                      Pitch Generator fixes all of this in 30 seconds per pitch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Hero Section */}
        <section className="glass-panel overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 px-6 py-12 sm:px-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-amber-800 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="h-5 w-5 text-amber-800" />
              <span className="text-sm font-bold uppercase tracking-wider text-amber-800">
                The Features That Actually Matter
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              The tools that actually save you time
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
              Five features built to make pitching faster and less painful. Each one solves a real
              problem from 5 years of running radio campaigns.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="mx-auto h-8 w-8 text-brand-amber-dark" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">
                  Batch Generation
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  Select 10-50 contacts, generate all pitches in 2 minutes
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="mx-auto h-8 w-8 text-brand-amber-dark" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">
                  Smart Timing
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  Recommends send times: BBC 10am-2pm, blogs 9am-11am, etc.
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Copy className="mx-auto h-8 w-8 text-brand-amber-dark" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">
                  Copy All
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  One click to copy all batch pitches ready for Gmail
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Star className="mx-auto h-8 w-8 text-success" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">
                  Pitch History
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  See all pitches, track responses, refine what works
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Brain className="mx-auto h-8 w-8 text-amber-800" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">
                  CSV Import
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  Bulk import contacts from Audio Intel or any spreadsheet
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3">
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="glass-panel h-full px-6 py-8">
                <div className={`inline-flex rounded-full bg-${feature.color}/20 p-3`}>
                  <Icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="glass-panel px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">
                How It Works
              </p>
              <h2 className="text-3xl font-semibold">Three steps to perfect pitches</h2>
              <p className="text-sm text-gray-600">
                No learning curve. No complicated setup. Just pick a contact, add your track info,
                and let AI do the heavy lifting.
              </p>
            </div>
            <div className="flex-1">
              <ol className="space-y-4">
                {howItWorks.map(step => (
                  <li
                    key={step.step}
                    className="glass-panel flex items-start gap-4 px-5 py-5 sm:px-6"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-brand-amber text-sm font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {step.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="glass-panel overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 px-6 py-12 sm:px-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-amber-800 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">📈</span>
              <span className="text-sm font-bold uppercase tracking-wider text-amber-800">
                Real Results from Real Campaigns
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Proven with BBC Radio 1, Spotify, and major blogs
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
              These aren't theoretical numbers. These are real response rates from 300+ pitches sent
              across 15 campaigns (2020-2025).
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black text-amber-800">15 hours → 15 min</div>
                <p className="mt-2 text-sm font-semibold text-gray-900">Time saved per campaign</p>
                <p className="mt-2 text-xs text-gray-600">
                  Measured: 50 personalised pitches, 6 campaigns avg
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black text-amber-800">14-18%</div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  BBC Radio 1 response rate
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  Sample: 120 specialist show pitches (vs 2% for bulk emails)
                </p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black text-amber-800">18-28%</div>
                <p className="mt-2 text-sm font-semibold text-gray-900">Playlist placement rate</p>
                <p className="mt-2 text-xs text-gray-600">
                  Sample: 85 Spotify curator pitches (electronic/indie focus)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="glass-panel px-6 py-10 sm:px-10">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">
                The Real Problem
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                You know how to write ONE great pitch. Writing 50 identical ones breaks your brain.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 lg:mx-0">
                After sending 300+ manual pitches to BBC Radio 1, Spotify curators, and blog
                editors, the pattern was clear: personalised pitches got 14-18% responses. Generic
                bulk emails got 2%. The difference? 15 hours of copy-paste hell per campaign. Pitch
                Generator automates the personalisation while keeping the quality that actually gets
                responses.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <strong>Tested on real campaigns:</strong> 300+ pitches, 15 campaigns, 5 years
                    of data
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <strong>Built for UK market:</strong> BBC Radio 1/6 Music benchmarks, playlist
                    curator language
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <strong>No learning curve:</strong> If you can write one good pitch, you can use
                    this tool
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Story / Social Proof */}
        <section className="glass-panel px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-shrink-0">
              <Image
                src="/images/chris-schofield-founder.jpg"
                alt="Chris Schofield, Founder of Total Audio Promo"
                width={200}
                height={200}
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gray-500">
                Built by someone who actually does this
              </p>
              <h2 className="mt-4 text-2xl font-bold">Why I built Pitch Generator</h2>
              <p className="mt-4 text-gray-600">
                I'm Chris Schofield, a producer (sadact) and radio promoter with 5+ years pitching
                to BBC Radio 1, 6 Music, and indie labels. I was spending 5+ hours per campaign
                writing personalised pitches, and ChatGPT couldn't help because it didn't know my
                contacts.
              </p>
              <p className="mt-3 text-gray-600">
                So I built Pitch Generator to solve my own problem: AI that actually knows who
                you're pitching to, writes in your voice, and saves hours of copy-pasting. I use it
                for every campaign I run.
              </p>
              <div className="mt-6 rounded-lg border border-brand-amber/30 bg-brand-amber/10 px-4 py-3">
                <p className="text-sm font-medium text-brand-amber-dark">
                  If you hate writing pitches as much as I did, this tool will save you hours every
                  week.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="glass-panel px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Ready to stop wasting hours on pitches?</h2>
              <p className="mt-2 max-w-xl text-sm text-gray-600">
                Start free with 10 pitches per month. Upgrade when you need more. No credit card
                required.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth/signin" className="cta-button">
                Start my free pitches
              </Link>
              <Link href="/pricing" className="subtle-button">
                Show me pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
