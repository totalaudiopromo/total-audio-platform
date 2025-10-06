import Image from "next/image"
import Link from "next/link"
import Head from 'next/head';
import { NewsletterSignup } from '../components/NewsletterSignup';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Total Audio Promo - Stop juggling 8+ tools to promote one release</title>
        <meta name="description" content="AI-first music promotion suite built by a Brighton producer. One ecosystem, multiple specialized tools." />

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
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
                height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-8 border-4 border-black overflow-hidden bg-white">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo Logo"
                width={96}
                height={96}
                className="object-contain w-full h-full"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Stop juggling 8+ tools to promote one release
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Total Audio Promo is the AI-first music promotion suite built by sadact, a Brighton producer who got tired of the platform chaos. One ecosystem, multiple specialised tools, all designed by someone who actually uses them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Save Time</h3>
                <p className="text-sm text-gray-600">Minutes, not hours on contact research</p>
              </div>
            </div>

            <div className="glass-panel">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Focus</h3>
                <p className="text-sm text-gray-600">Built specifically for music promotion</p>
              </div>
            </div>

            <div className="glass-panel">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Pro</h3>
                <p className="text-sm text-gray-600">By a working radio promoter</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="/#products" className="cta-button text-lg px-12 py-4">
              Explore Our Tools →
            </a>
          </div>
        </div>
      </section>

      {/* Pro Bundle CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="glass-panel p-10 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Illustration */}
              <div className="flex items-center justify-center">
                <Image
                  src="/images/success-complete.png"
                  alt="Complete Workflow Success"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>

              {/* Right: Content */}
              <div>
                <div className="mb-8">
                  <div className="inline-flex items-center rounded-full border-2 border-black bg-amber-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black mb-6">
                    Launch Offer
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    Complete Workflow Bundle
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Audio Intel + Pitch Generator + Tracker Pro features
                  </p>
                </div>

                <div className="bg-white rounded-xl border-4 border-black p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Individual pricing</div>
                      <div className="text-2xl text-gray-400 line-through">£46/month</div>
                    </div>
                    <div className="text-4xl text-gray-300">→</div>
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-1">Bundle pricing</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-5xl font-bold text-blue-600">£19</div>
                        <div className="text-lg text-gray-600">/mo</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t-2 border-gray-200">
                    <p className="text-base text-gray-900 font-semibold">
                      Save £27/month — Same price as Intel alone
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 bg-blue-50 border-2 border-black rounded-lg p-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">Audio Intel Pro</div>
                      <div className="text-xs text-gray-600">Unlimited contact enrichment</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-50 border-2 border-black rounded-lg p-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">Pitch Generator Pro</div>
                      <div className="text-xs text-gray-600">Unlimited AI pitches</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-amber-50 border-2 border-black rounded-lg p-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">Tracker Pro</div>
                      <div className="text-xs text-gray-600">Advanced campaign analytics</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <a href="https://intel.totalaudiopromo.com/beta" className="cta-button text-base px-8 py-4 w-full">
                    Start Pro Bundle Free Trial →
                  </a>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Limited time offer • No credit card required • Cancel anytime
                </p>
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

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Or Choose Individual Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each tool works standalone. But the Pro Bundle gives you everything for the price of Intel alone.
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

              <a href="https://intel.totalaudiopromo.com/beta" className="cta-button w-full text-center bg-blue-600 hover:bg-blue-700">
                Start Free Trial
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

              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Pitch Generator</h3>
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

              <a href="https://pitch.totalaudiopromo.com" className="cta-button w-full text-center bg-purple-600 hover:bg-purple-700">
                Start Free Trial
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

              <a href="https://track.totalaudiopromo.com" className="cta-button w-full text-center bg-amber-600 hover:bg-amber-700">
                Start Free Trial
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
                  <a href="https://intel.totalaudiopromo.com" className="text-sm text-gray-400 hover:text-white transition">
                    Audio Intel
                  </a>
                </li>
                <li>
                  <a href="https://pitch.totalaudiopromo.com" className="text-sm text-gray-400 hover:text-white transition">
                    Pitch Generator
                  </a>
                </li>
                <li>
                  <a href="https://track.totalaudiopromo.com" className="text-sm text-gray-400 hover:text-white transition">
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
                  <a href="https://intel.totalaudiopromo.com/blog" className="text-sm text-gray-400 hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="https://pitch.totalaudiopromo.com/pricing" className="text-sm text-gray-400 hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#newsletter" className="text-sm text-gray-400 hover:text-white transition">
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
  )
}
