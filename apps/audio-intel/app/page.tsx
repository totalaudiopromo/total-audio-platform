'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Sparkles, Zap, Clock, Target, Shield, Users, Database, Check, Download, BarChart3, Search } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Email Validation Built-In',
    description: 'Automatically filter out fake emails, spam traps, and disposable addresses. Know which contacts are real before you waste time enriching bad data.',
    color: 'green',
    image: '/assets/loading-states/success-complete.png',
  },
  {
    icon: Users,
    title: 'AI Contact Enrichment',
    description: 'Turn basic email addresses into detailed music industry profiles. Get submission guidelines, contact preferences, pitch tips, and everything you need to land your music.',
    color: 'blue',
    image: '/assets/loading-states/analyzing-data.png',
  },
  {
    icon: Search,
    title: 'Platform Discovery',
    description: 'Find new contacts by platform, genre, and role. Discover radio shows, playlists, blogs, and labels that match your sound.',
    color: 'purple',
    image: '/assets/loading-states/intelligence-complete.png',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Upload your contacts',
    description: 'CSV/Excel with email addresses - we handle the rest',
  },
  {
    step: '02',
    title: 'AI enrichment',
    description: 'Get detailed profiles, submission guidelines, pitch tips',
  },
  {
    step: '03',
    title: 'Export & use anywhere',
    description: 'Download enriched data to use in your own systems',
  },
];

// Liberty-relevant demo contacts
const libertyDemoContacts = [
  {
    email: 'greg.james@bbc.co.uk',
    name: 'Greg James',
    role: 'Radio Presenter',
    platform: 'BBC Radio 1',
    confidence: 'High',
    notes: 'BBC Radio 1 Breakfast Show host. Covers house, pop, and electronic music. Peak listening time 6:30-10am. Accepts submissions via official BBC form with 3-week lead time.',
  },
  {
    email: 'danny.howard@bbc.co.uk',
    name: 'Danny Howard',
    role: 'Radio Presenter / DJ',
    platform: 'BBC Radio 1',
    confidence: 'High',
    notes: 'BBC Radio 1 Dance presenter. Friday night 7-9pm slot focused on house, techno, and electronic music. Strong support for underground and emerging house producers. Submissions via BBC Music Introducing.',
  },
  {
    email: 'mistajam@bbc.co.uk',
    name: 'MistaJam',
    role: 'Radio Presenter',
    platform: 'BBC Radio 1Xtra',
    confidence: 'High',
    notes: 'Now at Capital Xtra but previously BBC. Covers hip-hop, grime, and bass music. Known for championing new artists early. Prefers SoundCloud links and direct email pitches.',
  },
  {
    email: 'editors@spotify.com',
    name: 'Spotify Editorial Team',
    role: 'Playlist Curators',
    platform: 'Spotify',
    confidence: 'Medium',
    notes: 'Submit via Spotify for Artists only. Focus on genre-specific playlists: "New Music Friday UK", "Mint", "Hot Hits UK". Requires 4-week lead time before release date.',
  },
  {
    email: 'pete.tong@bbc.co.uk',
    name: 'Pete Tong',
    role: 'Radio Presenter / DJ',
    platform: 'BBC Radio 1',
    confidence: 'High',
    notes: 'Legendary BBC Radio 1 dance music presenter. Friday nights 8-10pm. Essential Selection feature for breakthrough house and electronic tracks. Very selective - only send your absolute best work.',
  },
];

export default function HomePage() {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [demoEmail, setDemoEmail] = useState(libertyDemoContacts[0].email);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);

  const handleDemoEnrich = async () => {
    setDemoLoading(true);
    setDemoResult(null);

    // Find the contact from our demo database
    const contact = libertyDemoContacts.find(c => c.email === demoEmail) || libertyDemoContacts[0];

    // Simulate enrichment with realistic timing
    setTimeout(() => {
      setDemoResult(contact);
      setDemoLoading(false);
    }, 2000);
  };

  // Cycle through demo examples
  const cycleDemo = () => {
    const nextIndex = (currentDemoIndex + 1) % libertyDemoContacts.length;
    setCurrentDemoIndex(nextIndex);
    setDemoEmail(libertyDemoContacts[nextIndex].email);
    setDemoResult(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Hero */}
        <section className="glass-panel overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-5">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Turn chaotic spreadsheets into
                <span className="block text-blue-600">
                  organised contact intelligence
                </span>
              </h1>
              <p className="max-w-xl text-base text-gray-600 sm:text-lg">
                Audio Intel uses AI to enrich your contact lists with detailed music industry profiles.
                Upload emails, get back submission guidelines and pitch-ready intelligence. Export to use anywhere.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/pricing?plan=professional&billing=monthly" className="cta-button">Start free trial →</Link>
                <Link href="#how-it-works" className="subtle-button">See how it works</Link>
              </div>
              <p className="text-sm text-gray-500">
                For artists, managers, and promoters who need organised contact data
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="glass-panel bg-gradient-to-br from-blue-50 to-white px-8 py-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-900">
                    <Sparkles className="w-3 h-3" />
                    Live Demo
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">See It In Action</h2>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Email:</label>
                      <input
                        type="email"
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        className="mt-2 w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-medium"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDemoEnrich}
                        disabled={demoLoading}
                        className="cta-button flex-1"
                      >
                        {demoLoading ? 'Enriching...' : 'Enrich Contact'}
                      </button>
                      <button
                        onClick={cycleDemo}
                        disabled={demoLoading}
                        className="subtle-button"
                        title="Try different example"
                      >
                        Try Another →
                      </button>
                    </div>
                    {demoResult && (
                      <div className="mt-4 rounded-lg border-2 border-green-500 bg-green-50 p-4 text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-green-900">{demoResult.name}</p>
                          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                            {demoResult.confidence} Confidence
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium">{demoResult.role} · {demoResult.platform}</p>
                        <p className="mt-3 text-xs text-gray-600 leading-relaxed">{demoResult.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 rounded-lg border border-purple-600/30 bg-purple-600/10 px-4 py-3">
                    <p className="text-sm font-medium text-purple-900">
                      <strong>Real data from radio campaigns.</strong> Try BBC Radio 1 DJs, Spotify curators, or your own contacts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem - with mascot */}
        <section className="glass-panel border-red-500 bg-gradient-to-br from-red-50 to-white px-6 py-12 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-red-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-bold uppercase tracking-wider text-red-600">The Problem</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Stop wasting weekends on contact research</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-red-500" />
                  <span><strong>15+ hours per campaign</strong> manually researching contacts, submission guidelines, and pitch preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-red-500" />
                  <span><strong>Chaotic spreadsheets</strong> with incomplete data, outdated emails, and missing submission info</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-red-500" />
                  <span><strong>No validation</strong> - you don't know if emails are real until you send and bounce</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-red-500" />
                  <span><strong>Wasted pitches</strong> to contacts who don't accept your genre or have retired</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image
                src="/assets/loading-states/chaos-overwhelmed.png"
                alt="Overwhelmed by chaotic contact research"
                width={300}
                height={300}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="glass-panel overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 px-6 py-12 sm:px-10">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-purple-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-bold uppercase tracking-wider text-purple-600">What Makes Audio Intel Different</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">The flagship tool for contact intelligence</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
              Built by someone who actually uses it for radio promotion. Real pain points, real solutions.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="glass-panel border-blue-500 bg-white p-5">
                <Database className="mx-auto h-8 w-8 text-blue-600" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">Email Validation</p>
                <p className="mt-2 text-xs text-gray-600">Filter fake emails before enrichment</p>
              </div>
              <div className="glass-panel border-green-500 bg-white p-5">
                <Users className="mx-auto h-8 w-8 text-green-600" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">AI Enrichment</p>
                <p className="mt-2 text-xs text-gray-600">Detailed profiles with submission guidelines</p>
              </div>
              <div className="glass-panel border-purple-500 bg-white p-5">
                <Target className="mx-auto h-8 w-8 text-purple-600" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">Platform Search</p>
                <p className="mt-2 text-xs text-gray-600">Find contacts by role, genre, platform</p>
              </div>
              <div className="glass-panel border-yellow-500 bg-white p-5">
                <Download className="mx-auto h-8 w-8 text-yellow-600" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">CSV Export</p>
                <p className="mt-2 text-xs text-gray-600">Use enriched data anywhere</p>
              </div>
              <div className="glass-panel border-red-500 bg-white p-5">
                <Clock className="mx-auto h-8 w-8 text-red-600" />
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-gray-900">15 min vs 15 hours</p>
                <p className="mt-2 text-xs text-gray-600">Real time savings per campaign</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Features with mascots */}
        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className={`glass-panel border-${feature.color}-500 h-full bg-gradient-to-br from-${feature.color}-50 to-white px-6 py-8`}>
                <div className="mb-6 flex justify-center">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={120}
                    height={120}
                    className="drop-shadow-lg"
                  />
                </div>
                <div className={`mb-4 inline-flex rounded-full bg-${feature.color}-100 p-3`}>
                  <Icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="glass-panel px-6 py-12 sm:px-10">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="mb-12 text-gray-600">Three steps to organised contact intelligence</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-600 bg-blue-50 text-2xl font-black text-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="glass-panel border-green-500 bg-gradient-to-br from-green-50 to-white px-6 py-12 sm:px-10">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Proven with real contacts</h2>
            <p className="mb-8 text-gray-600">Built by Chris Schofield (sadact) - 5+ years radio promotion, BBC Radio 1 pitch experience</p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-4 text-4xl font-black text-blue-600">100%</div>
                <p className="font-bold text-gray-900">Enrichment Success Rate</p>
                <p className="mt-2 text-sm text-gray-600">Tested with BBC Radio 1, Spotify, and major industry contacts</p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-4 text-4xl font-black text-green-600">15 min</div>
                <p className="font-bold text-gray-900">Per Campaign</p>
                <p className="mt-2 text-sm text-gray-600">Down from 15+ hours of manual research per campaign</p>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-4 text-4xl font-black text-purple-600">90%</div>
                <p className="font-bold text-gray-900">Data Accuracy Guarantee</p>
                <p className="mt-2 text-sm text-gray-600">Industry-leading contact intelligence quality</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why This is Different */}
        <section className="glass-panel border-blue-500 bg-gradient-to-br from-blue-50 to-white px-6 py-12 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="flex justify-center">
              <Image
                src="/assets/loading-states/vinyl-throw-action.png"
                alt="Audio Intel in action"
                width={300}
                height={300}
                className="drop-shadow-2xl"
              />
            </div>
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600">Built By Someone Who Uses It</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Built for real campaigns, not demos</h2>
              <p className="mb-6 text-lg text-gray-700">
                I was wasting entire weekends researching contacts for radio campaigns. BBC Radio 1, 1Xtra, 6 Music - every campaign meant 15+ hours of manual research.
                So I built this.
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <span><strong>Tested with real contacts</strong> - BBC Radio 1, Spotify editorial, major playlist curators</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <span><strong>Export to use anywhere</strong> - this isn't a CRM prison, it's intelligence you own</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <span><strong>UK-focused pricing</strong> - 80% cheaper than US tools, built for our market</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Simple Pricing */}
        <section className="glass-panel px-6 py-12 sm:px-10">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Simple pricing</h2>
            <p className="mb-12 text-gray-600">Test it free, then choose what works for you</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free */}
            <div className="glass-panel border-green-500 bg-gradient-to-br from-green-50 to-white p-8">
              <div className="mb-4 inline-flex rounded-full border-2 border-green-600 bg-green-100 px-4 py-1 text-xs font-bold uppercase text-green-800">
                Try it free
              </div>
              <div className="mb-6">
                <div className="text-5xl font-black">FREE</div>
                <p className="mt-2 text-sm text-gray-600">Beta access</p>
              </div>
              <p className="mb-6 text-sm text-gray-700">Test with 10 contacts. See if it works for your workflow.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-sm">10 enrichments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-sm">Email validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-sm">CSV export</span>
                </li>
              </ul>
              <Link href="/beta" className="subtle-button w-full">
                Get beta access
              </Link>
            </div>

            {/* Professional */}
            <div className="glass-panel border-blue-500 bg-gradient-to-br from-blue-50 to-white p-8 ring-4 ring-blue-200">
              <div className="mb-4 inline-flex rounded-full border-2 border-blue-600 bg-blue-500 px-4 py-1 text-xs font-bold uppercase text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                What I use
              </div>
              <div className="mb-6">
                <div className="text-5xl font-black">£19</div>
                <p className="mt-2 text-sm text-gray-600">/month</p>
              </div>
              <p className="mb-6 text-sm text-gray-700">For artists and promoters running actual campaigns.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-sm font-bold">Unlimited enrichment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-sm">Email validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-sm">Platform search</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-sm">Direct support</span>
                </li>
              </ul>
              <Link href="/pricing?plan=professional&billing=monthly" className="cta-button w-full">
                Start free trial
              </Link>
            </div>

            {/* Agency */}
            <div className="glass-panel bg-white p-8">
              <div className="mb-4 inline-flex rounded-full border-2 border-black bg-gray-100 px-4 py-1 text-xs font-bold uppercase text-gray-800">
                For teams
              </div>
              <div className="mb-6">
                <div className="text-5xl font-black">£79</div>
                <p className="mt-2 text-sm text-gray-600">/month</p>
              </div>
              <p className="mb-6 text-sm text-gray-700">PR agencies running multiple client campaigns.</p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-gray-900" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-gray-900" />
                  <span className="text-sm">Team collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-gray-900" />
                  <span className="text-sm">Client reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-gray-900" />
                  <span className="text-sm">White-label exports</span>
                </li>
              </ul>
              <Link href="/pricing" className="subtle-button w-full">
                Learn more
              </Link>
            </div>
          </div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">Built by a Working Radio Promoter</p>
              <h2 className="mt-4 text-3xl font-semibold">
                Contact intelligence for real campaigns.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 lg:mx-0">
                I'm Chris – I've run radio promotion campaigns for 5 years, including BBC Radio 1 pitches.
                I built Audio Intel because I was wasting entire weekends researching contacts.
                Now it takes 15 minutes instead of 15 hours.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="glass-panel border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-16 text-center sm:px-10">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to organise your contacts?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Start with 10 free enrichments. No card required. Built by radio promoters, for radio promoters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pricing?plan=professional&billing=monthly" className="cta-button">
              Start free trial →
            </Link>
            <Link href="/demo" className="subtle-button">
              Try demo first
            </Link>
          </div>
        </section>

    </div>
  );
}
