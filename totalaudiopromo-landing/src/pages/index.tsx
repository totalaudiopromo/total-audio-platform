import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { NewsletterSignup } from '../components/NewsletterSignup';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Total Audio Promo - Stop juggling 8+ tools to promote one release</title>
        <meta
          name="description"
          content="AI-first music promotion suite built by a Brighton producer. One ecosystem, multiple specialized tools."
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WZNJWDKH');
            `,
          }}
        />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

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

            {/* Tool Switcher */}
            <div className="flex items-center gap-3">
              <a
                href="https://intel.totalaudiopromo.com"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              >
                Audio Intel
              </a>
              <a
                href="https://pitch.totalaudiopromo.com"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 transition"
              >
                Pitch Generator
              </a>
              <a
                href="https://track.totalaudiopromo.com"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 transition"
              >
                Tracker
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section - Founder-Led */}
        <section className="relative overflow-hidden bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="glass-panel px-6 py-12 sm:px-10 sm:py-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Founder Photo & Story */}
                <div>
                  <div className="flex items-start gap-6 mb-8">
                    <Image
                      src="/images/chris-schofield-founder-photo.jpg"
                      alt="Chris Schofield - Founder"
                      width={120}
                      height={120}
                      className="rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500 mb-2">
                        Built by a Working Radio Promoter
                      </p>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                        I got tired of juggling 8 tools that didn't talk to each other
                      </h1>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-700 mb-8">
                    <p className="text-lg">
                      I'm Chris – I've been promoting music to BBC Radio 1, 6 Music, and Spotify
                      playlists for 5+ years. Every campaign meant switching between SubmitHub,
                      Groover, ChatGPT, Excel spreadsheets... you know the drill.
                    </p>
                    <p className="text-base">
                      So I built Total Audio Promo: an ecosystem of tools that actually work
                      together. Each one solves a specific problem I was facing. No bloat, no
                      features I don't use, just the workflow that actually works.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a href="#ecosystem" className="cta-button text-base px-8 py-3">
                      Show me how it works →
                    </a>
                    <a
                      href="https://intel.totalaudiopromo.com/beta"
                      className="subtle-button text-base px-8 py-3"
                    >
                      Get my free trial
                    </a>
                  </div>
                </div>

                {/* Right: The Problem Illustration */}
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/images/chaos-overwhelmed.png"
                    alt="Overwhelmed by tool chaos"
                    width={350}
                    height={350}
                    className="drop-shadow-2xl mb-6"
                  />
                  <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 max-w-md">
                    <p className="text-sm font-bold text-red-900 mb-2">The old way:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• SubmitHub/Groover for submissions (£3+ per pitch)</li>
                      <li>• ChatGPT for writing pitches (£16/month)</li>
                      <li>• Excel/Google Sheets for tracking (chaotic mess)</li>
                      <li>• Manual contact research (15+ hours per campaign)</li>
                      <li>• No way to track what actually works</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </section>

        {/* The Ecosystem - How It Works */}
        <section id="ecosystem" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  The Workflow That Actually Works
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Three tools that talk to each other
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built the way I actually run campaigns. Each tool solves one problem really well,
                then hands off to the next.
              </p>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-10">
              {/* Step 1: Audio Intel */}
              <div className="glass-panel px-6 py-10 sm:px-10">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Audio Intel</h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Find and verify contacts in 15 minutes</strong> instead of wasting
                      your evening on Google.
                    </p>
                    <ul className="space-y-2 text-gray-600 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          Upload emails from any source (spreadsheets, Muck Rack exports, scraped
                          from blogs)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          AI enriches each contact with role, platform, submission guidelines, pitch
                          preferences
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          Email validation filters out dead addresses before you waste time pitching
                        </span>
                      </li>
                    </ul>
                    <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
                      <p className="text-sm font-bold text-blue-900">
                        Real result: Enriched 47 BBC Radio contacts in 12 minutes. Used to take me
                        an entire afternoon.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src="/images/success-complete.png"
                      alt="Audio Intel enrichment complete"
                      width={300}
                      height={300}
                      className="drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-4xl text-gray-400">↓</div>
              </div>

              {/* Step 2: Pitch Generator */}
              <div className="glass-panel px-6 py-10 sm:px-10 bg-gradient-to-br from-purple-50 to-white">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center lg:order-1">
                    <Image
                      src="/images/vinyl-throw-action.png"
                      alt="Pitch Generator in action"
                      width={300}
                      height={300}
                      className="drop-shadow-2xl"
                    />
                  </div>
                  <div className="lg:order-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Pitch Generator</h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Write 50 personalised pitches in 20 minutes</strong> using the contact
                      intelligence from Audio Intel.
                    </p>
                    <ul className="space-y-2 text-gray-600 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          Import enriched contacts directly from Audio Intel (or add manually)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          AI generates pitches that reference each contact's specific submission
                          guidelines
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          Batch generate 10-50 pitches at once, copy all to Gmail with one click
                        </span>
                      </li>
                    </ul>
                    <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-4">
                      <p className="text-sm font-bold text-purple-900">
                        Real result: 14-18% response rate from BBC Radio 1 specialist shows (vs 2%
                        for bulk emails).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-4xl text-gray-400">↓</div>
              </div>

              {/* Step 3: Tracker (Beta) */}
              <div className="glass-panel px-6 py-10 sm:px-10 bg-gradient-to-br from-amber-50 to-white relative">
                <div className="absolute top-4 right-4">
                  <div className="inline-flex items-center rounded-full border-2 border-amber-600 bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                    Beta Access
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Campaign Tracker</h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Know exactly what's working</strong> with AI-powered campaign
                      intelligence and industry benchmarks.
                    </p>
                    <ul className="space-y-2 text-gray-600 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>AI campaign autopsy - what worked, what didn't, what to do next</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>
                          Compare your results against BBC Radio 1, Spotify, blog benchmarks
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Track responses across all platforms - radio, playlists, press</span>
                      </li>
                    </ul>
                    <div className="bg-amber-50 border-2 border-amber-600 rounded-lg p-4">
                      <p className="text-sm font-bold text-amber-900">
                        Real result: "14% response rate - above industry average. Focus on 6 Music
                        next."
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src="/images/analyzing-data.png"
                      alt="Campaign Intelligence - analyzing data"
                      width={300}
                      height={300}
                      className="drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="glass-panel px-6 py-10 sm:px-10 bg-gradient-to-br from-green-50 to-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Proven with real campaigns
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  These aren't theoretical numbers. These are real metrics from 300+ pitches sent
                  across 15 campaigns (2020-2025).
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-4xl font-black text-blue-600 mb-2">100%</div>
                  <p className="font-bold text-gray-900 mb-2">Enrichment Success Rate</p>
                  <p className="text-sm text-gray-600">
                    Tested with BBC Radio 1, Spotify, major playlist curators
                  </p>
                </div>
                <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-4xl font-black text-green-600 mb-2">15 hours → 15 min</div>
                  <p className="font-bold text-gray-900 mb-2">Time Saved Per Campaign</p>
                  <p className="text-sm text-gray-600">
                    Average across 6 campaigns with 50+ contacts each
                  </p>
                </div>
                <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-4xl font-black text-purple-600 mb-2">14-18%</div>
                  <p className="font-bold text-gray-900 mb-2">BBC Radio 1 Response Rate</p>
                  <p className="text-sm text-gray-600">
                    120 specialist show pitches (vs 2% for bulk emails)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Choose your starting point
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each tool works standalone. But the Pro Bundle gives you the complete workflow for
                the price of Intel alone.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Audio Intel */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded-2xl p-8 relative">
                <div className="w-32 h-32 bg-blue-100 rounded-xl flex items-center justify-center mb-6 p-2 mx-auto">
                  <Image
                    src="/images/total_audio_promo_logo_trans.png"
                    alt="Audio Intel"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Audio Intel</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">£19</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  AI-powered contact enrichment that doesn't waste your evening.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Contact research automation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Email validation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Export to Excel/PDF</span>
                  </div>
                </div>

                <a
                  href="https://intel.totalaudiopromo.com/beta"
                  className="cta-button w-full text-center bg-blue-600 hover:bg-blue-700"
                >
                  Start my free trial
                </a>
              </div>

              {/* Pitch Generator */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded-2xl p-8 relative">
                <div className="w-32 h-32 bg-purple-100 rounded-xl flex items-center justify-center mb-6 p-2 mx-auto">
                  <Image
                    src="/images/total_audio_promo_logo_trans.png"
                    alt="Pitch Generator"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Pitch Generator
                </h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-600">£12</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Write 50 personalised pitches in 20 minutes with AI.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">AI pitch generation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Contact intelligence</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Batch generation</span>
                  </div>
                </div>

                <a
                  href="https://pitch.totalaudiopromo.com"
                  className="cta-button w-full text-center bg-purple-600 hover:bg-purple-700"
                >
                  Start my free trial
                </a>
              </div>

              {/* Tracker */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded-2xl p-8 relative">
                <div className="w-32 h-32 bg-amber-100 rounded-xl flex items-center justify-center mb-6 p-2 mx-auto">
                  <Image
                    src="/images/total_audio_promo_logo_trans.png"
                    alt="Tracker"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Tracker</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-amber-600">£15</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Campaign tracking and analytics for data-driven decisions.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Campaign analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Response tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">Performance reports</span>
                  </div>
                </div>

                <a
                  href="https://track.totalaudiopromo.com"
                  className="cta-button w-full text-center bg-amber-600 hover:bg-amber-700"
                >
                  Start my free trial
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] mb-6 border-4 border-white/20 overflow-hidden bg-white">
                  <Image
                    src="/images/total_audio_promo_logo_trans.png"
                    alt="Total Audio Promo Logo"
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Total Audio Promo</h3>
                <p className="text-sm text-gray-400">
                  Music marketing tools that actually work. Built by industry professionals.
                </p>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Products</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://intel.totalaudiopromo.com"
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Audio Intel
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://pitch.totalaudiopromo.com"
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Pitch Generator
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://track.totalaudiopromo.com"
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Tracker
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://intel.totalaudiopromo.com/blog"
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://pitch.totalaudiopromo.com/pricing"
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#newsletter"
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Newsletter
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Stay Updated</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Get The Unsigned Advantage newsletter - weekly music industry insights.
                </p>
                <a href="#newsletter" className="subtle-button text-sm">
                  Subscribe Now
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-center">
              <div className="text-sm text-gray-400">
                © 2025 Total Audio Promo. Built by Chris Schofield.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
