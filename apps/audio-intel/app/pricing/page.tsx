"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Play, ArrowLeft, Music, ExternalLink, X, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

// Track analytics events
function trackAnalyticsEvent(event: string, data: any) {
  if (typeof window !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    }).catch(error => console.warn('Analytics tracking failed:', error));
  }
}

function PricingContent() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState<{tier: string, billing: string} | null>(null);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Trial lengths surfaced in UI (mirrors server defaults; can be overridden with public envs)
  const trialDays = {
    starter: Number(process.env.NEXT_PUBLIC_TRIAL_DAYS_STARTER) || Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 7,
    professional: Number(process.env.NEXT_PUBLIC_TRIAL_DAYS_PROFESSIONAL) || Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14,
    agency: Number(process.env.NEXT_PUBLIC_TRIAL_DAYS_AGENCY) || Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14,
    enterprise: Number(process.env.NEXT_PUBLIC_TRIAL_DAYS_ENTERPRISE) || Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14,
  } as const;

  // Auto-open modal when linked with query params (e.g., /pricing?plan=starter&billing=monthly)
  useEffect(() => {
    const plan = (searchParams.get('plan') || '').toLowerCase();
    const billing = (searchParams.get('billing') || '').toLowerCase();
    const validPlan = ['starter','professional','agency','enterprise'].includes(plan);
    const validBilling = ['monthly','annual'].includes(billing);
    if (validPlan && validBilling) {
      setShowEmailForm({ tier: plan, billing });
    }
  }, [searchParams?.toString()]);
  
  const handleCheckout = async (tier: 'starter' | 'professional' | 'agency' | 'enterprise', billing: 'monthly' | 'annual' = 'monthly') => {
    setShowEmailForm({ tier, billing });
    // Also reflect in URL so deep-linking reliably opens the modal even if click handlers are blocked
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('plan', tier);
    params.set('billing', billing);
    router.replace(`/pricing?${params.toString()}`, { scroll: false });
  };
  
  const proceedToCheckout = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    if (!showEmailForm) return;
    
    const { tier, billing } = showEmailForm;
    setIsLoading(tier);
    
    // Track pricing click
    trackAnalyticsEvent('pricing_click', {
      tier,
      billing,
      email,
      timestamp: new Date().toISOString(),
      page: 'pricing_page'
    });
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: tier,
          tier: billing,
          email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
        setIsLoading(null);
        setShowEmailForm(null);
      }
    } catch (e: any) {
      alert(e.message || 'Checkout failed');
      setIsLoading(null);
      setShowEmailForm(null);
    }
  };
  
  const closeEmailForm = () => {
    setShowEmailForm(null);
    setEmail('');
    setIsLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Image 
                  src="/images/total_audio_promo_logo_trans.png" 
                  alt="Total Audio Promo Logo" 
                  width={32} 
                  height={32}
                  className="rounded-lg bg-white p-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-black text-gray-900">Audio Intel</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">Beta</Badge>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Home
            </Link>
            <Link 
              href="https://pulse.totalaudiopromo.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-yellow-600 transition-colors"
            >
              <Music className="w-4 h-4" />
              <span>Playlist Pulse</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Cross-Promotion Banner */}
      <section className="w-full px-4 py-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b-4 border-yellow-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Music className="w-6 h-6 text-white [animation:none]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Need playlist promotion? Try Playlist Pulse</h3>
                <p className="text-gray-700 font-bold">Get instant access to 50,000+ verified playlist curators</p>
              </div>
            </div>
            <Link 
              href="https://pulse.totalaudiopromo.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
            >
              <span>Try Playlist Pulse</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="max-w-none mx-auto px-4">
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">Simple, Transparent Pricing</h1>
            <p className="text-2xl font-bold text-gray-700 max-w-4xl mx-auto">
              Choose the plan that fits your music promotion needs. All plans include our core AI enrichment features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch justify-items-center max-w-none mx-auto">
            {/* Free Beta */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative flex flex-col h-full w-full max-w-sm">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 rounded-full px-6 py-2 font-black text-sm text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                FREE BETA
              </Badge>

              <div className="text-center mb-8 mt-6">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Free Beta</h3>
                <div className="text-5xl font-black text-gray-900 mb-4">
                  £0<span className="text-xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">25 contact enrichments</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">All AI research features</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Export to CSV</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Beta testing access</span>
                </li>
              </ul>

              <Link href="/demo">
                <Button className="w-full rounded-xl font-black text-lg py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600 hover:to-green-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  Start Free Beta
                </Button>
              </Link>
            </div>
            {/* Starter */}
            <div className="bg-white p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col h-full w-full max-w-sm">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Starter</h3>
                <Badge className="mb-4 bg-green-500 text-white font-black tracking-wide">
                  {trialDays.starter}-DAY FREE TRIAL
                </Badge>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £9.99<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">50 contact enrichments per month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">✅ FREE Email Validation</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">All AI research features</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Export to CSV, Excel</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Email support</span>
                </li>
              </ul>

              <Button 
                className="w-full rounded-2xl font-black text-lg py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white hover:bg-gray-50 text-black border-4 border-gray-300"
                onClick={() => handleCheckout('starter', 'monthly')}
                disabled={isLoading === 'starter'}
                type="button"
                data-testid="btn-start-starter"
              >
                {isLoading === 'starter' ? 'Loading...' : `${trialDays.starter}-Day Free Trial`}
              </Button>
            </div>

            {/* Professional - Most Popular */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative flex flex-col h-full w-full max-w-sm">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MOST POPULAR
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Professional</h3>
                <Badge className="mb-4 bg-green-500 text-white font-black tracking-wide">
                  {trialDays.professional}-DAY FREE TRIAL
                </Badge>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £19.99<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">200 contact enrichments per month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">✅ FREE Email Validation</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Priority processing</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Advanced export options</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">CRM integrations</span>
                </li>
              </ul>

              <Button 
                className="w-full rounded-2xl font-black text-lg py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                onClick={() => handleCheckout('professional', 'monthly')}
                disabled={isLoading === 'professional'}
                type="button"
                data-testid="btn-start-professional"
              >
                {isLoading === 'professional' ? 'Loading...' : `${trialDays.professional}-Day Free Trial`}
              </Button>
            </div>

            {/* Agency */}
            <div className="bg-white p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col h-full w-full max-w-sm">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Agency</h3>
                <Badge className="mb-4 bg-green-500 text-white font-black tracking-wide">
                  {trialDays.agency}-DAY FREE TRIAL
                </Badge>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £39.99<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">1000 contact enrichments per month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">✅ FREE Email Validation</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Fastest processing (priority queue)</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">White-label exports</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Team seats (up to 5)</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">API access + CRM integrations</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Dedicated success manager</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Phone + email support</span>
                </li>
              </ul>

              <Button 
                className="w-full rounded-2xl font-black text-lg py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all bg-white hover:bg-gray-50 text-black border-4 border-gray-300"
                onClick={() => handleCheckout('agency', 'monthly')}
                disabled={isLoading === 'agency'}
                type="button"
                data-testid="btn-start-agency"
              >
                {isLoading === 'agency' ? 'Loading...' : `${trialDays.agency}-Day Free Trial`}
              </Button>
            </div>

            {/* Enterprise */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative flex flex-col h-full w-full max-w-sm">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                FOR AGENCIES MANAGING 10+ ARTISTS
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Enterprise</h3>
                <Badge className="mb-4 bg-green-500 text-white font-black tracking-wide">
                  {trialDays.enterprise}-DAY FREE TRIAL
                </Badge>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £150<span className="text-2xl text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">2500 contact enrichments/month</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Unlimited email validation</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Multi-client dashboard (10+ artists)</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">White-label reporting and exports</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Unlimited team seats</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">API access + CRM integrations</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Dedicated success manager</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg">Phone + email support</span>
                </li>
              </ul>

              <Button 
                className="w-full rounded-2xl font-black text-lg py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-600 hover:to-purple-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                onClick={() => handleCheckout('enterprise', 'monthly')}
                disabled={isLoading === 'enterprise'}
                type="button"
                data-testid="btn-start-enterprise"
              >
                {isLoading === 'enterprise' ? 'Loading...' : `${trialDays.enterprise}-Day Free Trial`}
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Email Collection Modal */}
      {showEmailForm && (
        <div role="dialog" aria-modal="true" data-testid="pricing-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-2xl font-black text-gray-900">
                 Start Your {showEmailForm?.tier === 'starter' ? trialDays.starter : showEmailForm?.tier === 'professional' ? trialDays.professional : showEmailForm?.tier === 'agency' ? trialDays.agency : trialDays.enterprise}-Day Free Trial
               </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={closeEmailForm}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-gray-900">
                    {showEmailForm.tier.charAt(0).toUpperCase() + showEmailForm.tier.slice(1)} Plan
                  </h4>
                  <p className="text-gray-600 font-bold">
                    {showEmailForm.tier === 'starter' && '£9.99/month'}
                    {showEmailForm.tier === 'professional' && '£19.99/month'}
                    {showEmailForm.tier === 'agency' && '£39.99/month'}
                    {showEmailForm.tier === 'enterprise' && '£150/month'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-bold text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border-2 border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  onKeyPress={(e) => e.key === 'Enter' && proceedToCheckout()}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={closeEmailForm}
                  className="flex-1 font-bold border-2"
                  disabled={isLoading !== null}
                >
                  Cancel
                </Button>
                <Button
                  onClick={proceedToCheckout}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                  disabled={isLoading !== null || !email}
                >
                  {isLoading ? 'Loading...' : 'Continue to Payment'}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to Stripe. No charge until the trial ends. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}


