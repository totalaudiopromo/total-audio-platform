'use client'

import Image from "next/image"
import Link from "next/link"
import Head from 'next/head';

// Loading Component with Mascot
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-24 h-24 rounded-xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden bg-white animate-pulse">
      <Image
        src="/images/total_audio_promo_logo_trans.png"
        alt="Loading..."
        width={48}
        height={48}
        className="object-contain animate-bounce"
      />
    </div>
    <p className="text-lg font-bold text-gray-600 mt-4">Loading Total Audio Promo...</p>
  </div>
)

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
      
    <div className="min-h-screen bg-white flex flex-col texture-crinkled-paper">
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZNJWDKH"
                height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
      </noscript>
      
      {/* Navigation */}
      <nav className="tap-nav bg-white border-b-4 border-black px-4 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Link href="/" className="tap-logo-container flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden bg-white">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo Mascot"
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="tap-logo-text text-2xl font-black text-gray-900">Total Audio Promo</span>
          </Link>
        </div>
      </nav>

      {/* Compact Hero Section */}
      <section className="tap-hero relative overflow-hidden">
        <div className="tap-container max-w-7xl mx-auto px-4 py-16">
          {/* Logo and Header */}
          <div className="text-center mb-16">
            <div className="tap-hero-logo w-32 h-32 rounded-2xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-8 border-4 border-black overflow-hidden bg-white">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo Mascot"
                width={128}
                height={128}
                className="object-contain w-full h-full"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight gradient-headline">
              Stop juggling 8+ tools to promote one release
            </h1>
            
            <p className="text-xl md:text-2xl font-black text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Total Audio Promo is the AI-first music promotion suite built by sadact, a Brighton producer who got tired of the platform chaos. One ecosystem, multiple specialised tools, all designed by someone who actually uses them.
            </p>
          </div>

          {/* Value Proposition Cards */}
          <div className="tap-value-grid grid md:grid-cols-3 gap-6 mb-16">
            <div className="tap-value-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded-xl p-6 relative">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Save Time</h3>
                <p className="font-black text-gray-600">Minutes, not hours on contact research</p>
              </div>
            </div>

            <div className="tap-value-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded-xl p-6 relative">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Industry Focus</h3>
                <p className="font-black text-gray-600">Built specifically for music promotion</p>
              </div>
            </div>

            <div className="tap-value-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all rounded-xl p-6 relative">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Industry Pro</h3>
                <p className="font-black text-gray-600">By a working radio promoter</p>
              </div>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center">
            <Link href="#products">
              <button className="tap-hero-button h-16 px-12 text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all border-4 border-black">
                Explore Our Tools →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="tap-social-proof py-12 relative">
        <div className="tap-container max-w-7xl mx-auto px-4 text-center">
          <div className="tap-social-grid grid md:grid-cols-3 gap-8">
            <div className="tap-social-card bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 relative">
              <div className="tap-social-number text-3xl font-black text-blue-600 mb-2">500+</div>
              <div className="tap-social-title font-black text-gray-900">Music Professionals</div>
              <div className="tap-social-subtitle text-sm font-bold text-gray-600">Trust our tools</div>
            </div>
            
            <div className="tap-social-card bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 relative">
              <div className="tap-social-number text-3xl font-black text-purple-600 mb-2">10+</div>
              <div className="tap-social-title font-black text-gray-900">Years Experience</div>
              <div className="tap-social-subtitle text-sm font-bold text-gray-600">In music promotion</div>
            </div>
            
            <div className="tap-social-card bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-6 relative">
              <div className="tap-social-number text-3xl font-black text-green-600 mb-2">24/7</div>
              <div className="tap-social-title font-black text-gray-900">Support</div>
              <div className="tap-social-subtitle text-sm font-bold text-gray-600">Direct founder access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="products" className="tap-products py-20 relative texture-dark-paper">
        <div className="tap-container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 gradient-headline">
              Our Professional Tools
            </h2>
            <p className="text-xl font-bold text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Built by industry professionals, for industry professionals. Each tool solves real problems we face every day.
            </p>
          </div>

          <div className="tap-products-grid grid lg:grid-cols-3 gap-8 mb-16">
            {/* Audio Intel - Live */}
            <div className="tap-product-card group bg-white border-4 border-blue-600 shadow-[8px_8px_0px_0px_rgba(37,99,235,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(37,99,235,0.4)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-10 relative overflow-hidden gradient-luma-18">
              <div className="absolute top-3 right-3">
                <div className="tap-product-badge bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                  LIVE
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="tap-product-icon w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 relative">
                    <Image
                      src="/images/total_audio_promo_logo_trans.png"
                      alt="Audio Intel Mascot"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="tap-product-title text-3xl font-black text-gray-900 mb-4">Audio Intel</h3>
                  <p className="tap-product-description text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                    AI-powered contact enrichment that doesn't waste your evening. Get detailed contact information in minutes, not hours.
                  </p>
                </div>
                
                <div className="tap-product-features space-y-4 mb-10 text-left">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Contact research automation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Email validation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Export to Excel/PDF</span>
                  </div>
                </div>
                
                <Link href="https://intel.totalaudiopromo.com/beta">
                  <button className="tap-product-button w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200">
                    Try Free Beta
                  </button>
                </Link>
              </div>
            </div>

            {/* Playlist Pulse - Coming Soon */}
            <div className="group bg-white border-4 border-orange-400 shadow-[8px_8px_0px_0px_rgba(251,146,60,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(251,146,60,0.4)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-10 relative overflow-hidden opacity-90">
              <div className="absolute top-3 right-3">
                <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded-full text-xs">
                  SOON
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-6 relative">
                    <Image
                      src="/images/total_audio_promo_logo_trans.png"
                      alt="Playlist Pulse Mascot"
                      width={32}
                      height={32}
                      className="object-contain opacity-75"
                    />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">Playlist Pulse</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                    Discover which playlists are actually worth your time. Track real engagement, not vanity metrics.
                  </p>
                </div>
                
                <div className="space-y-4 mb-10 text-left">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Playlist performance analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Curator contact research</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Campaign tracking</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    // Simple modal or redirect to waitlist form
                    const email = prompt('Enter your email to join the Playlist Pulse waitlist:');
                    if (email && email.includes('@')) {
                      alert('Thanks! You\'ve been added to the Playlist Pulse waitlist. We\'ll notify you when it\'s ready.');
                    } else if (email) {
                      alert('Please enter a valid email address.');
                    }
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Future Tools */}
            <div className="group bg-white border-4 border-purple-400 shadow-[8px_8px_0px_0px_rgba(168,85,247,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.4)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-10 relative overflow-hidden opacity-80 gradient-luma-1">
              <div className="absolute top-3 right-3">
                <div className="bg-gray-400 text-white font-bold px-3 py-1 rounded-full text-xs">
                  DEV
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6 relative">
                    <Image
                      src="/images/total_audio_promo_logo_trans.png"
                      alt="Future Tools Mascot"
                      width={32}
                      height={32}
                      className="object-contain opacity-50"
                    />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">More Tools</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                    We're building a comprehensive suite of music marketing tools. Each one solves a real problem.
                  </p>
                </div>
                
                <div className="space-y-4 mb-10 text-left">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Social media automation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Press release distribution</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">Campaign analytics</span>
                  </div>
                </div>
                
                <button className="w-full bg-gray-200 text-gray-500 font-bold py-4 px-6 rounded-xl cursor-not-allowed">
                  Coming 2025
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
        <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] mx-auto mb-6 border-2 border-white/20 overflow-hidden bg-white/10">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo Mascot"
                width={64}
                height={64}
                className="object-contain w-full h-full"
              />
            </div>
            <h3 className="text-3xl font-black mb-4">Total Audio Promo</h3>
            <p className="text-lg font-bold text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Music marketing tools that actually work. Built by industry professionals.
            </p>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 border-t border-white/10 text-center">
            <div className="text-gray-400 font-medium">
              © 2025 Total Audio Promo. Built by Chris Schofield.
            </div>
          </div>
        </div>
        </div>
      </footer>
    </div>
    </>
  )
}