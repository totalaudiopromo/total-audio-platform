'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Users, 
  Zap, 
  Check, 
  Play, 
  ArrowRight, 
  Clock, 
  Search,
  Download,
  BarChart3,
  Shield,
  Music
} from "lucide-react"
import { AudioCharacter } from "@/components/ui/audio-character"
import { RealTimeMetrics } from "@/components/ui/real-time-metrics"
import LocationTracker from "./components/LocationTracker"
import LiveChatBot from "./components/LiveChatBot"
import Image from "next/image"
import Link from "next/link"


export default function AudioIntelLanding() {
  
  // Instant demo state
  const [demoEmail, setDemoEmail] = useState<string>('john@bbc.co.uk');
  const [demoLoading, setDemoLoading] = useState<boolean>(false);
  const [demoResult, setDemoResult] = useState<string>('');
  const [demoError, setDemoError] = useState<string>('');


  // Beta signup state
  const [betaEmail, setBetaEmail] = useState<string>('');
  const [betaFirstName, setBetaFirstName] = useState<string>('');
  const [betaLastName, setBetaLastName] = useState<string>('');
  const [betaCompany, setBetaCompany] = useState<string>('');
  const [betaRole, setBetaRole] = useState<string>('');
  const [betaExperience, setBetaExperience] = useState<string>('');
  const [betaInterest, setBetaInterest] = useState<string>('');
  const [isBetaSubmitting, setIsBetaSubmitting] = useState<boolean>(false);

  const trackEngagement = (action: string, data: any = {}) => {
    fetch('/api/analytics/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data })
    }).catch(() => {});
  };

  // Track page view on mount
  useEffect(() => {
    trackEngagement('page_view', { page: 'homepage' });
  }, []);

  const handlePricingNavigation = () => {
    trackEngagement('pricing_button_click', { location: 'hero_section' });
    window.location.href = '/pricing';
  };

  async function runInstantDemo() {
    setDemoError('');
    setDemoResult('');
    setDemoLoading(true);
    trackEngagement('demo_run', { email: demoEmail });
    try {
      const res = await fetch('/api/enrich-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts: [{ email: demoEmail }] }),
      });
      const data = await res.json();
      const enriched = data?.enriched?.[0]?.contactIntelligence as string | undefined;
      if (enriched) {
        setDemoResult(enriched);
      } else {
        // Fallback showcase if API key not configured
        setDemoResult('• BBC Radio 1 | National Station \n• UK National Coverage \n• Email: musicteam@bbc.co.uk \n• Focus: New UK artists \n• Tip: Include streaming numbers and radio edit');
      }
    } catch (e: any) {
      setDemoError('Live demo temporarily unavailable. Showing a representative example.');
      setDemoResult('• BBC Radio 1 | National Station \n• UK National Coverage \n• Email: musicteam@bbc.co.uk \n• Focus: New UK artists \n• Tip: Include streaming numbers and radio edit');
    } finally {
      setDemoLoading(false);
    }
  }

  async function handleBetaSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!betaEmail || !betaFirstName) return;
    
    setIsBetaSubmitting(true);
    try {
      const res = await fetch('/api/convertkit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: betaEmail,
          first_name: betaFirstName,
          tags: ['beta-tester', 'audio-intel-beta'],
          fields: {
            last_name: betaLastName,
            company: betaCompany,
            role: betaRole,
            experience: betaExperience,
            interest: betaInterest,
            signup_source: 'landing_page'
          }
        }),
      });
      
      if (res.ok) {
        const result = await res.json();
        setBetaEmail('');
        setBetaFirstName('');
        setBetaLastName('');
        setBetaCompany('');
        setBetaRole('');
        setBetaExperience('');
        setBetaInterest('');
        trackEngagement('beta_signup_success', { email: betaEmail, source: 'landing_page' });
        alert('🎉 Welcome to the Audio Intel beta! Check your email for immediate access instructions and your personalised testing guide.');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Beta signup failed');
      }
    } catch (error: any) {
      console.error('Beta signup error:', error);
      alert(error.message || 'Beta signup failed. Please try again or contact support.');
    } finally {
      setIsBetaSubmitting(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* FAQ JSON-LD for Homepage */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is Audio Intel?", acceptedAnswer: { "@type": "Answer", text: "An AI contact enrichment tool for music promotion that turns emails into pitch-ready intelligence for playlist curators, radio DJs, and music bloggers." } },
              { "@type": "Question", name: "Who is it for?", acceptedAnswer: { "@type": "Answer", text: "Independent artists, small PR agencies, and labels in the UK and beyond." } },
              { "@type": "Question", name: "How much does it cost?", acceptedAnswer: { "@type": "Answer", text: "Free beta; Professional £19.99/mo; Agency £39.99/mo." } }
            ]
          })
        }}
      />
      <LocationTracker page="home" />
      {betaEmail && <LocationTracker email={betaEmail} page="beta-signup" />}
      
      {/* Header */}
      <header className="audio-intel-header sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="audio-intel-container max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="audio-intel-logo-container flex items-center gap-3">
            <Image
              src="/images/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo Logo"
              width={40}
              height={40}
              className="flex-shrink-0"
            />
            <div className="flex items-center gap-2">
              <span className="audio-intel-logo-text text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Audio Intel</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold text-xs">Beta</Badge>
            </div>
          </div>
          
          <nav className="audio-intel-nav hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-not-allowed">
              <Music className="w-4 h-4" />
              <span>Playlist Pulse</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Coming Soon</span>
            </div>
            <a href="#features" className="audio-intel-nav-link text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Features
            </a>
            <a href="#pricing" className="audio-intel-nav-link text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Pricing
            </a>
            <Link href="/progress-dashboard" className="audio-intel-nav-link text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors duration-300">
              Progress Dashboard
            </Link>
            {process.env.NEXT_PUBLIC_ENABLE_SEO_ANALYSIS === 'true' && (
              <Link href="/seo-analysis" className="audio-intel-nav-link text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                SEO Analysis
              </Link>
            )}

            <Link href="/signin">
              <Button variant="outline" size="sm" className="font-bold border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[40px] active:scale-95 transition-transform duration-150">
                Sign In
              </Button>
            </Link>
            <Button
              size="sm"
              className="audio-intel-nav-button bg-blue-600 hover:bg-blue-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[40px] active:scale-95 transition-all duration-150"
              onClick={handlePricingNavigation}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Cross-Promotion Banner */}
      <section className="audio-intel-banner w-full bg-gradient-to-r from-yellow-50 to-yellow-100 border-b-4 border-yellow-300">
        <div className="audio-intel-container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="bg-yellow-400 rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <Music className="w-6 h-6 text-white [animation:none]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight tracking-tight mb-2">Need playlist promotion? Playlist Pulse is coming soon!</h3>
                <p className="text-sm sm:text-base text-gray-700 font-bold leading-relaxed">Get ready for instant access to 50,000+ verified playlist curators with AI-powered pitch generation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <span className="text-sm sm:text-base">Coming Soon</span>
              <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Q2 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="audio-intel-hero w-full">
        <div className="audio-intel-container max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          {/* Total Audio Promo Logo in Hero - TRANSPARENT PNG ONLY - MOBILE RESPONSIVE */}
          <div className="mb-12">
            <Image
              src="/images/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo - Music Industry Intelligence"
              width={200}
              height={200}
              className="mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight px-4">
            <span className="hidden md:block">Don't Let Manual Research</span>
            <span className="block md:hidden">Stop Manual Research</span>
            <span className="block text-blue-600 mt-2">
              <span className="hidden md:inline">Kill Your Music Career</span>
              <span className="md:hidden">Killing Your Career</span>
            </span>
          </h1>

          <div className="max-w-3xl mx-auto mb-12 px-4">
            <p className="text-xl sm:text-2xl text-gray-600 mb-6 leading-relaxed font-medium tracking-tight">
              Built by a Brighton producer who hated wasting weekends researching radio contacts.
            </p>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Audio Intel uses AI to turn email addresses into detailed music industry profiles - submission guidelines, contact preferences, and pitch-ready insights for playlist curators, radio DJs, and music bloggers.
            </p>
          </div>
          
          <div className="audio-intel-hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
            <Link href="/pricing?plan=professional&billing=monthly" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="audio-intel-hero-button w-full bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-8 sm:px-12 font-bold rounded-2xl transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[54px] active:scale-95 leading-tight"
              >
                Drop Your Chaos Here
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="audio-intel-hero-button w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 font-medium border-2 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[54px] active:scale-95 leading-tight"
              onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="hidden sm:inline">See why industry professionals choose Audio Intel</span>
              <span className="sm:hidden">Why Industry Pros Choose Us</span>
            </Button>
          </div>
          
          {/* Instant Product Demo */}
          <div className={`max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg border border-gray-200 relative overflow-hidden`}>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Demo input */}
              <div>
                <div className="text-left mb-4">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Try it now</div>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">Turn an email into actionable intelligence</h3>
                </div>
                <div className="flex gap-3 items-center">
                  <Input
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="e.g. john@bbc.co.uk"
                    className="h-12 text-base"
                    onKeyDown={(e) => e.key === 'Enter' && runInstantDemo()}
                  />
                  <Button size="lg" className="h-12 px-6" onClick={runInstantDemo} disabled={demoLoading}>
                    {demoLoading ? 'Analysing…' : 'Enrich'}
                  </Button>
                </div>
                <p className="mt-3 text-sm text-gray-500">No upload needed. One click demo using real enrichment pipeline.</p>
                <div className="mt-6 text-left">
                  <Link href="/demo">
                    <Button variant="outline" className="font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Upload a sample CSV →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Demo result */}
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-yellow-400/10" />
                <div className="relative bg-blue-50 rounded-2xl p-6 md:p-8 border-2 border-blue-200 min-h-[220px]">
                  {!demoResult && !demoLoading && (
                    <div className="text-gray-600 text-sm">Result appears here. Try the demo to see enriched intel.</div>
                  )}
                  {demoLoading && (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-5 w-2/3 bg-blue-200/60 rounded" />
                      <div className="h-4 w-1/2 bg-blue-200/50 rounded" />
                      <div className="h-4 w-5/6 bg-blue-200/50 rounded" />
                      <div className="h-4 w-3/4 bg-blue-200/50 rounded" />
                    </div>
                  )}
                  {demoResult && (
                    <pre className="whitespace-pre-wrap text-sm md:text-base leading-relaxed text-gray-900">{demoResult}</pre>
                  )}
                  {demoError && (
                    <p className="mt-3 text-xs text-amber-700">{demoError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - MOVED UP for immediate credibility */}
      <section className={`py-16 px-4 relative bg-gradient-to-br from-gray-50 to-blue-50`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Used daily by working music professionals
            </h2>
            <p className="text-xl font-bold text-blue-600 mb-8">
              Live metrics from real campaigns - updated every 30 seconds
            </p>
            
            {/* Dog throwing vinyl - REDUCED PADDING */}
            <div className="mb-8">
              <Image 
                src="/assets/loading-states/vinyl-throw-action.png"
                alt="Audio mascot throwing vinyl records - representing active music promotion in motion"
                width={350}
                height={350}
                className="mx-auto -my-4"
              />
            </div>
          </div>

          <RealTimeMetrics />
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className={`py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Complete Contact Management Platform
            </h2>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              Everything you need to find, validate, enrich, and manage music industry contacts
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Core Features */}
            <div className="space-y-8">
              {/* Email Validation - NEW FEATURE */}
              <div className={`bg-white p-8 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-8 h-8">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Email Validation</h3>
                    <Badge className="bg-green-500 text-white font-black tracking-wide text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">NEW - FREE</Badge>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Professional-grade email validation tested on 500+ real radio promotion campaigns. SMTP testing, spam trap detection, role-based analysis, and reputation scoring that actually works.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-50 text-green-700">SMTP Testing</Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Spam Trap Detection</Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Role-based Analysis</Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Reputation Scoring</Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Catch-all Detection</Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">100+ Disposable Domains</Badge>
                </div>
              </div>

              {/* Contact Enrichment */}
              <div className={`bg-white p-8 rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-8 h-8">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">AI Contact Enrichment</h3>
                    <Badge className="bg-blue-500 text-white font-black tracking-wide text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">CORE FEATURE</Badge>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Contact enrichment tested on 500+ real radio promotion campaigns. Transform basic email lists into detailed music industry intelligence with AI-powered research that stops the 3-hour contact research sessions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Submission Guidelines</Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Contact Preferences</Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Coverage Areas</Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Pitch Tips</Badge>
                </div>
              </div>

              {/* Platform Search */}
              <div className={`bg-white p-8 rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-8 h-8">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Multi-Platform Search</h3>
                    <Badge className="bg-purple-500 text-white font-black tracking-wide text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">DISCOVERY</Badge>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Find music industry contacts across Reddit, Instagram, Spotify, Discord, and more platforms. Built for the messy reality of music industry contact discovery, not perfect lab conditions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">Reddit Discovery</Badge>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">Instagram Search</Badge>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">Spotify Curators</Badge>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">Discord Communities</Badge>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Features */}
            <div className="space-y-8">
              {/* AI Agents */}
              <div className={`bg-white p-8 rounded-2xl border-4 border-yellow-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-8 h-8">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Advanced Analytics</h3>
                    <Badge className="bg-yellow-500 text-white font-black tracking-wide text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">INTELLIGENCE</Badge>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Know exactly how your campaigns perform with real-time success tracking. See which contacts convert, which platforms deliver best results, and where to focus your efforts next.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">Real-time Metrics</Badge>
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">Success Tracking</Badge>
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">Platform Analytics</Badge>
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">Performance Reports</Badge>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className={`bg-white p-8 rounded-2xl border-4 border-red-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-8 h-8">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Analytics Dashboard</h3>
                    <Badge className="bg-red-500 text-white font-black tracking-wide text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">INSIGHTS</Badge>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Stop guessing what works. Get clear insights into which contacts open your emails, which platforms drive the best response rates, and how to improve your pitch success.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-red-50 text-red-700">Performance Metrics</Badge>
                  <Badge variant="secondary" className="bg-red-50 text-red-700">Engagement Tracking</Badge>
                  <Badge variant="secondary" className="bg-red-50 text-red-700">Export Reports</Badge>
                  <Badge variant="secondary" className="bg-red-50 text-red-700">Success Analytics</Badge>
                </div>
              </div>

              {/* Export System */}
              <div className={`bg-white p-8 rounded-2xl border-4 border-indigo-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-8 h-8">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Professional Export System</h3>
                    <Badge className="bg-indigo-500 text-white font-black tracking-wide text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">DELIVERY</Badge>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">
                  Get your enriched contacts exactly how you need them - CSV for spreadsheets, direct email delivery, or seamlessly integrate with your existing CRM. No tech headaches, just the data you need.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">CSV/Excel Export</Badge>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">Email Delivery</Badge>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">CRM Integration</Badge>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">White-label Options</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className={`mt-16 text-center relative`}>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black text-white mb-4">
                Premium Email Validation
              </h3>
              <p className="text-xl font-bold text-white/90 mb-6">
                Professional-grade validation tested on real radio promotion campaigns. SMTP testing, spam trap detection, and reputation scoring. Built by someone who uses it daily on real campaigns.
              </p>
            <Button
              size="lg"
              className="bg-white text-black font-black text-base sm:text-lg px-6 sm:px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all min-h-[56px] whitespace-normal leading-tight"
              onClick={() => window.location.href = '/pricing'}
            >
              <span className="hidden sm:inline">Try Premium Validation FREE</span>
              <span className="sm:hidden">Try FREE</span>
            </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Problem Section */}
      <section id="problem" className={`py-24 px-4 relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              The Problem: Contact Research is Broken
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
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Hours of Manual Research</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Spending 15+ hours weekly digging through websites, social media, and outdated contact lists to
                      find the right people to pitch your music. I've been there - it kills campaign momentum.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Generic Email Lists</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Basic contact lists with just names and emails - no context about what they cover, how they prefer
                      to be contacted, or what they're looking for. This is why most pitches fail.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Low Success Rates</h3>
                    <p className="text-xl font-bold text-gray-700">
                      Poor response rates because you're sending generic pitches to people without understanding their
                      preferences, coverage areas, or submission guidelines. I built this tool to fix exactly that.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-white p-12 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}>
              <div className="text-center">
                {/* ENLARGED chaos overwhelmed PNG as main feature - MOBILE RESPONSIVE */}
                <Image 
                  src="/assets/loading-states/chaos-overwhelmed.png"
                  alt="Artist overwhelmed by chaotic contact research - papers everywhere, disorganised workflow"
                  width={400}
                  height={400}
                  className="mx-auto mb-8 w-96 h-96 sm:w-72 sm:h-72 xs:w-60 xs:h-60"
                />
                <h3 className="text-3xl font-black text-gray-900 mb-6">The Reality</h3>
                <p className="text-xl font-bold text-gray-700 mb-8">
                  Most artists and labels waste countless hours on manual research that could be automated with AI
                  intelligence. I built this tool because I needed it myself.
                </p>
                <div className="text-6xl font-black text-red-500 mb-4">15hrs</div>
                <div className="text-2xl font-black text-gray-700">Average time wasted per week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className={`py-24 px-4 bg-white relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              The Solution: AI-Powered Contact Intelligence
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className={`bg-gradient-to-br from-blue-50 to-blue-100 p-10 text-center rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group relative overflow-hidden`}>
              <Image 
                src="/assets/loading-states/analyzing-data.png"
                alt="AI analyzing contact data - instant enrichment in progress"
                width={200}
                height={200}
                className="mx-auto mb-8 w-50 h-50 sm:w-40 sm:h-40"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-6">Instant Enrichment</h3>
              <p className="text-lg font-bold text-gray-700">
                Turn basic contact lists into pitch-ready intelligence in seconds. Get submission guidelines, contact preferences, and everything you need to land your music in the right hands.
              </p>
            </div>

            <div className={`bg-gradient-to-br from-green-50 to-green-100 p-10 text-center rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group relative overflow-hidden`}>
              <Image 
                src="/assets/loading-states/success-complete.png"
                alt="Success state - verified intelligence complete with high confidence"
                width={200}
                height={200}
                className="mx-auto mb-8 w-50 h-50 sm:w-40 sm:h-40"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-6">Verified Intelligence</h3>
              <p className="text-lg font-bold text-gray-700">
                Never waste time on dead contacts again. 90% accuracy guarantee means you'll actually reach the people who can help your music career, not outdated email addresses.
              </p>
            </div>

            <div className={`bg-gradient-to-br from-purple-50 to-purple-100 p-10 text-center rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group relative overflow-hidden`}>
              <Image 
                src="/assets/loading-states/intelligence-complete.png"
                alt="Industry-focused intelligence complete - music professionals ready"
                width={200}
                height={200}
                className="mx-auto mb-8 w-50 h-50 sm:w-40 sm:h-40"
              />
              <h3 className="text-2xl font-black text-gray-900 mb-6">Industry Focus</h3>
              <p className="text-lg font-bold text-gray-700">
                Stop pitching to the wrong people. Get targeted contacts for playlist curators, radio DJs, music bloggers, and journalists who actually cover your genre and style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className={`py-24 px-4 bg-gradient-to-br from-green-50 to-blue-50 relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Our Guarantees
            </h2>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              We stake our reputation on the quality of our intelligence. Built by someone who uses it daily.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className={`bg-white p-10 text-center rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl font-black text-white">90%</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Data Accuracy Guarantee</h3>
              <p className="text-lg font-bold text-gray-700 mb-6">
                90% minimum accuracy on all contact enrichments. Tested on 500+ real radio promotion campaigns. 
                If we don't hit this mark, we'll refund the difference.
              </p>
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <p className="text-sm font-bold text-green-800">
                  "I use this tool daily on my own campaigns. I won't sell you anything I wouldn't use myself." - Chris
                </p>
              </div>
            </div>

            <div className={`bg-white p-10 text-center rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Processing Time Promise</h3>
              <p className="text-lg font-bold text-gray-700 mb-6">
                Beta: 2-3 minutes maximum. Professional: 60 seconds or less. Agency: Instant processing. 
                If we're slower, your next enrichment is free.
              </p>
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-sm font-bold text-blue-800">
                  No waiting around when you could be pitching your music to the right people.
                </p>
              </div>
            </div>

            <div className={`bg-white p-10 text-center rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative overflow-hidden`}>
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">No Bullsh*t Guarantee</h3>
              <p className="text-lg font-bold text-gray-700 mb-6">
                No hidden fees, no card details during beta, no premium feature lockouts. 
                What you see is what you get. Cancel anytime with one email.
              </p>
              <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
                <p className="text-sm font-bold text-purple-800">
                  Built by someone who hates deceptive pricing as much as you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent Parsing Section */}
      <section className={`py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Intelligent Parsing - Our Secret Weapon
            </h2>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              While other tools require perfectly formatted data, Audio Intel thrives on messy spreadsheets. 
              We turn your real-world data into clean, enriched contacts automatically. Built for the messy reality of music industry contact lists.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <Image 
                  src="/assets/loading-states/processing-contacts.png"
                  alt="Processing contacts - intelligent parsing in action"
                  width={280}
                  height={280}
                  className="mx-auto mb-6 w-70 h-70 sm:w-56 sm:h-56"
                />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-8">What Makes Us Different</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Handles Any Format</h4>
                    <p className="text-lg font-bold text-gray-700">
                      CSV, TXT, Excel files with any separator, headers or no headers, messy formatting - we handle it all. Because real music industry data is messy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Auto-Fix Common Issues</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Missing names? We generate them from emails. Extra spaces? We clean them. Quotes? We normalise them. All the problems I've faced in real campaigns.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Smart Detection</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Automatically detects headers, separators, and data patterns to parse your file correctly every time. No more manual data cleaning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Real-World Ready</h4>
                    <p className="text-lg font-bold text-gray-700">
                      Built for the messy reality of music industry contact lists, not perfect lab conditions. This is the tool I wish I had when I started in radio promotion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-white p-8 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden`}>
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Example: Before & After</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Your Messy Data:</h4>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div>"John Smith", "john@bbc.co.uk"</div>
                    <div>sarah@spotify.com</div>
                    <div>Mike Davis,mike@radio1.com</div>
                    <div>Emma Wilson; emma@musicblog.com</div>
                  </div>
                </div>
                <div className="text-center">
                  <ArrowRight className="w-8 h-8 text-blue-500 mx-auto" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 mb-3">Clean, Enriched Data with Full Intelligence:</h4>
                  <div className="bg-green-100 p-4 rounded-lg font-mono text-xs leading-relaxed">
                    <div className="mb-3 pb-3 border-b border-green-300">
                      <div className="font-bold">• John Smith | john@bbc.co.uk | BBC Radio 2</div>
                      <div className="text-green-700 ml-2">↳ Role: Music Producer | Genres: Pop, Rock | Submission: demos@bbc.co.uk</div>
                      <div className="text-green-700 ml-2">↳ Best Contact: Tuesdays 10-12pm | Prefers: MP3 + Brief | Confidence: 94%</div>
                    </div>
                    <div className="mb-3 pb-3 border-b border-green-300">
                      <div className="font-bold">• Sarah Johnson | sarah@spotify.com | Spotify Editorial</div>
                      <div className="text-green-700 ml-2">↳ Role: Playlist Curator | Focus: Indie Folk, Acoustic | 2.3M followers</div>
                      <div className="text-green-700 ml-2">↳ Submission Guidelines: Via Spotify for Artists only | Confidence: 91%</div>
                    </div>
                    <div className="mb-3 pb-3 border-b border-green-300">
                      <div className="font-bold">• Mike Davis | mike@radio1.com | BBC Radio 1</div>
                      <div className="text-green-700 ml-2">↳ Role: Evening Show DJ | Genres: Electronic, House | Live: 7-10pm</div>
                      <div className="text-green-700 ml-2">↳ Contact Via: PA assistant | Prefers: Email + SoundCloud | Confidence: 96%</div>
                    </div>
                    <div>
                      <div className="font-bold">• Emma Wilson | emma@musicblog.com | The Music Insider</div>
                      <div className="text-green-700 ml-2">↳ Role: Senior Writer | Coverage: Album reviews, interviews | 150k monthly</div>
                      <div className="text-green-700 ml-2">↳ Pitch Style: Personal story angle preferred | Response rate: High | Confidence: 88%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-24 px-4 sm:px-6 relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">Simple, Transparent Pricing</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 max-w-4xl mx-auto mb-8">
              Choose the plan that fits your music promotion needs. All plans include our core AI enrichment features.
            </p>
            
            {/* Risk Reversal / Guarantee */}
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-sm">✓</span>
                  </div>
                  <h3 className="text-xl font-black text-amber-900">90% Data Accuracy Guarantee</h3>
                </div>
                <p className="text-base font-bold text-amber-800">
                  Wrong intel doesn't count towards your monthly limit - we only charge for contacts that actually help your campaigns
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Beta Free */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 sm:p-10 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative mx-auto w-full max-w-md lg:max-w-none">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                TRY THE REAL THING
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">FREE BETA</h3>
                <div className="mb-6">
                  <span className="text-6xl font-black text-gray-900 whitespace-nowrap">FREE</span>
                  <span className="text-2xl text-gray-600">/beta</span>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">No card needed, no tricks</p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">100 contact enrichments</span>
                    <span className="text-sm text-gray-600">Proper campaigns, not just a tease</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">All the AI research features</span>
                    <span className="text-sm text-gray-600">We're not holding anything back</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Email validation included</span>
                    <span className="text-sm text-gray-600">Stops you looking daft with bounced emails</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Results in 2-3 minutes</span>
                    <span className="text-sm text-gray-600">Time for a brew whilst it works</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Help us get it right</span>
                    <span className="text-sm text-gray-600">Your feedback shapes the final product</span>
                  </div>
                </li>
              </ul>
              
              <div className="bg-green-100 p-4 rounded-lg mb-6 border-2 border-green-200">
                <p className="text-sm font-bold text-green-800 text-center italic">
                  "Proper beta access - test everything whilst we polish the rough edges"
                </p>
                <p className="text-xs text-green-700 text-center mt-2">
                  <strong>Support:</strong> Audio chatbot support - standard response times
                </p>
              </div>

              <Link href="/beta">
                <Button
                  className="w-full rounded-2xl font-black text-lg sm:text-xl py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600 hover:to-green-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all min-h-[60px] whitespace-normal leading-tight"
                >
                  Start Free Beta
                </Button>
              </Link>
            </div>

            {/* Professional - Most Popular */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10 rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative transform lg:scale-105 ring-4 ring-blue-200 ring-opacity-50 mx-auto w-full max-w-md lg:max-w-none">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MOST POPULAR
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">PROFESSIONAL</h3>
                <h4 className="text-xl font-bold text-blue-600 mb-4">"Get Ahead of the Queue"</h4>
                <div className="mb-6 flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-gray-900 whitespace-nowrap">£19.99</span>
                  <span className="text-2xl text-gray-600">/mo</span>
                </div>
                <p className="text-sm font-bold text-gray-700">67p/day - what you spend on coffee</p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">200 contact enrichments</span>
                    <span className="text-sm text-gray-600">Scale up without the stress</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Skip the queue</span>
                    <span className="text-sm text-gray-600">60-second processing vs 2-3 minute wait</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Professional exports</span>
                    <span className="text-sm text-gray-600">PDF reports, Excel files, email delivery</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Better analytics</span>
                    <span className="text-sm text-gray-600">See which campaigns actually work</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Batch uploads</span>
                    <span className="text-sm text-gray-600">Chuck multiple files at it simultaneously</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Priority Audio chat</span>
                    <span className="text-sm text-gray-600">Faster responses for urgent questions</span>
                  </div>
                </li>
              </ul>
              
              <div className="bg-blue-100 p-4 rounded-lg mb-6 border-2 border-blue-200">
                <p className="text-sm font-bold text-blue-800 text-center">
                  <strong>Perfect for:</strong> Independent artists and small labels who need results yesterday
                </p>
                <p className="text-xs text-blue-700 text-center mt-2 italic">
                  "Stop waiting around when you could be pitching"
                </p>
                <p className="text-xs text-blue-700 text-center mt-2">
                  <strong>Support:</strong> Priority Audio chat support - faster response times for paid users
                </p>
              </div>

            <Link href="/pricing">
              <Button
                className="w-full rounded-2xl font-black text-lg sm:text-xl py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all min-h-[60px] whitespace-normal leading-tight"
              >
                Skip The Queue Today
              </Button>
            </Link>
            </div>

            {/* Agency */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all mx-auto w-full max-w-md lg:max-w-none">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">AGENCY</h3>
                <h4 className="text-xl font-bold text-purple-600 mb-4">"White-Label Everything"</h4>
                <div className="mb-6 flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-gray-900 whitespace-nowrap">£39.99</span>
                  <span className="text-2xl text-gray-600">/mo</span>
                </div>
                <p className="text-sm font-bold text-gray-700">Pays for itself if you retain one extra client</p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">500 contact enrichments</span>
                    <span className="text-sm text-gray-600">Handle multiple artists without breaking</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Instant processing</span>
                    <span className="text-sm text-gray-600">No waiting around for urgent campaigns</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Your branding on everything</span>
                    <span className="text-sm text-gray-600">Clients think you're the intelligence source</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Client-ready reports</span>
                    <span className="text-sm text-gray-600">They'll actually want to keep these PDFs</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Full analytics dashboard</span>
                    <span className="text-sm text-gray-600">Prove your campaigns work</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-black text-lg block">Priority Audio chatbot support</span>
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
                  <strong>Support:</strong> Premium Audio chatbot support - prioritised responses
                </p>
              </div>

              <Link href="/pricing">
                <Button
                  className="w-full rounded-2xl font-black text-lg sm:text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white hover:bg-gray-50 text-black border-4 border-gray-300 min-h-[60px] whitespace-normal leading-tight"
                >
                  White-Label Your Intelligence
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 px-4 bg-white relative`}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
            Ready to Transform Your Music Promotion?
          </h2>
          <p className="text-2xl font-bold text-gray-700 mb-12 max-w-4xl mx-auto">
            Join hundreds of artists and labels who've already saved 15+ hours per week with AI-powered contact
            intelligence. Built by someone who uses it daily in real campaigns.
          </p>
          <div className="flex justify-center px-4">
             <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-2xl px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-2xl font-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all w-full sm:w-auto min-h-[64px] whitespace-normal leading-tight"
              onClick={() => window.location.href = '/pricing'}
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 flex-shrink-0" />
              <span className="hidden sm:inline">Try the tool I use daily - FREE</span>
              <span className="sm:hidden">Try FREE</span>
            </Button>
          </div>
        </div>
      </section>



      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Join the Audio Intel Beta
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get free access to Audio Intel during the testing phase. No credit card required, 
              no payment requests. Your feedback shapes the final product.
            </p>
            
            <form onSubmit={handleBetaSignup} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-left block mb-2 font-bold">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Chris"
                    className="border-2 border-gray-300 shadow-sm focus:border-blue-500"
                    required
                    value={betaFirstName}
                    onChange={(e) => setBetaFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-left block mb-2 font-bold">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Schofield"
                    className="border-2 border-gray-300 shadow-sm focus:border-blue-500"
                    value={betaLastName}
                    onChange={(e) => setBetaLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-left block mb-2 font-bold">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="chris@example.com"
                  className="border-2 border-gray-300 shadow-sm focus:border-blue-500"
                  required
                  value={betaEmail}
                  onChange={(e) => setBetaEmail(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company" className="text-left block mb-2 font-bold">Company/Label</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Total Audio Promo"
                    className="border-2 border-gray-300 shadow-sm focus:border-blue-500"
                    value={betaCompany}
                    onChange={(e) => setBetaCompany(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-left block mb-2 font-bold">Role</Label>
                  <Input
                    id="role"
                    type="text"
                    placeholder="Producer, Label Manager, Artist..."
                    className="border-2 border-gray-300 shadow-sm focus:border-blue-500"
                    value={betaRole}
                    onChange={(e) => setBetaRole(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience" className="text-left block mb-2 font-bold">Experience Level</Label>
                <select
                  id="experience"
                  className="w-full border-2 border-gray-300 shadow-sm focus:border-blue-500 rounded-md px-3 py-2 bg-white"
                  value={betaExperience}
                  onChange={(e) => setBetaExperience(e.target.value)}
                >
                  <option value="">Select your experience level</option>
                  <option value="beginner">New to music promotion</option>
                  <option value="intermediate">Some promotion experience</option>
                  <option value="experienced">Experienced promoter</option>
                  <option value="professional">Industry professional</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="interest" className="text-left block mb-2 font-bold">What interests you most?</Label>
                <select
                  id="interest"
                  className="w-full border-2 border-gray-300 shadow-sm focus:border-blue-500 rounded-md px-3 py-2 bg-white"
                  value={betaInterest}
                  onChange={(e) => setBetaInterest(e.target.value)}
                >
                  <option value="">Select your main interest</option>
                  <option value="contact-enrichment">Contact enrichment & research</option>
                  <option value="email-validation">Email validation</option>
                  <option value="automation">Campaign automation</option>
                  <option value="analytics">Analytics & reporting</option>
                  <option value="all-features">All features</option>
                </select>
              </div>
              
              <Button 
                type="submit"
                disabled={isBetaSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold px-8 py-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isBetaSubmitting ? 'Joining Beta...' : 'Join Beta - Free Access'}
              </Button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              ✓ Free beta access  ✓ No credit card required  ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Live Chat Bot */}
      <LiveChatBot userTier="free" />
      
      {/* Footer */}
      <footer className={`py-12 px-4 bg-gray-900 text-white relative`}>
        <div className="max-w-7xl mx-auto">
          {/* Cross-Promotion Section */}
          <div className={`mb-8 p-6 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-xl relative overflow-hidden`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Need playlist promotion?</h3>
                  <p className="text-white/80 font-bold">Playlist Pulse is coming soon - our sister tool for AI-powered playlist curator discovery and pitch generation</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span>Coming Soon</span>
                <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Q2 2025</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className={`relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-8">
                  <Image 
                    src="/images/total_audio_promo_logo_trans.png" 
                    alt="Total Audio Promo Logo" 
                    width={64} 
                    height={64}
                    className="bg-white rounded-lg p-2"
                  />
                  <span className="text-2xl font-black">Audio Intel</span>
                </div>
                <p className="text-lg font-bold text-gray-300 mb-8">
                  AI-powered contact intelligence for the music industry. Transform basic email lists into detailed
                  contact insights. Powered by Total Audio Promo.
                </p>
              </div>
            </div>

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
                  <a href="/demo" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    API Access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Support</h3>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="/documentation" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6">Our Ecosystem</h3>
              <ul className="space-y-4">
                <li>
                  <div className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                    <Music className="w-4 h-4" />
                    <span>Playlist Pulse</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Coming Soon</span>
                  </div>
                </li>
                <li>
                  <a href="mailto:info@totalaudiopromo.com" className="text-gray-300 hover:text-white font-bold transition-colors">
                    Contact Support
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

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-bold">
              © 2025 Audio Intel - Powered By <a href="https://totalaudiopromo.com" className="text-gray-300 hover:text-white transition-colors underline">Total Audio Promo</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

