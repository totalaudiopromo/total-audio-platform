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
    professional: Number(process.env.NEXT_PUBLIC_TRIAL_DAYS_PROFESSIONAL) || Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14,
    agency: Number(process.env.NEXT_PUBLIC_TRIAL_DAYS_AGENCY) || Number(process.env.NEXT_PUBLIC_TRIAL_DAYS) || 14,
  } as const;

  // Auto-open modal when linked with query params (e.g., /pricing?plan=professional&billing=monthly)
  useEffect(() => {
    const plan = (searchParams.get('plan') || '').toLowerCase();
    const billing = (searchParams.get('billing') || '').toLowerCase();
    const validPlan = ['professional','agency'].includes(plan);
    const validBilling = ['monthly','annual'].includes(billing);
    if (validPlan && validBilling) {
      setShowEmailForm({ tier: plan, billing });
    }
  }, [searchParams?.toString()]);
  
  const handleCheckout = async (tier: 'professional' | 'agency', billing: 'monthly' | 'annual' = 'monthly') => {
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

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Free Beta */}
            <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative flex flex-col h-full">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                TRY THE REAL THING
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Free Beta</h3>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  FREE<span className="text-2xl text-gray-600">/beta</span>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-4">No card needed, no tricks</p>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
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
                    <span className="font-black text-lg block">All AI research features</span>
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
                    <span className="font-black text-lg block">Audio chatbot support</span>
                    <span className="text-sm text-gray-600">Our mascot knows the product inside out</span>
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
              </div>

              <Link href="/beta">
                <Button className="w-full rounded-2xl font-black text-xl py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600 hover:to-green-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  Start Free Beta
                </Button>
              </Link>
            </div>

            {/* Professional - Most Popular */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all relative flex flex-col h-full transform scale-105 ring-4 ring-blue-200 ring-opacity-50 shadow-blue-400/20">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full px-8 py-3 font-black text-lg text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MOST POPULAR
              </Badge>

              <div className="text-center mb-10 mt-6">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Professional</h3>
                <h4 className="text-xl font-bold text-blue-600 mb-4">\"Get Ahead of the Queue\"</h4>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £19.99<span className="text-2xl text-gray-600">/mo</span>
                </div>
                <p className="text-sm font-bold text-gray-700">67p/day - what you spend on coffee</p>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
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
                  \"Stop waiting around when you could be pitching\"
                </p>
              </div>

              <Button 
                className="w-full rounded-2xl font-black text-xl py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                onClick={() => handleCheckout('professional', 'monthly')}
                disabled={isLoading === 'professional'}
                type="button"
                data-testid="btn-start-professional"
              >
                {isLoading === 'professional' ? 'Loading...' : 'Skip The Queue Today'}
              </Button>
            </div>

            {/* Agency */}
            <div className="bg-white p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col h-full">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-900 mb-6">Agency</h3>
                <h4 className="text-xl font-bold text-gray-600 mb-4">"White-Label Everything"</h4>
                <div className="text-6xl font-black text-gray-900 mb-6">
                  £39.99<span className="text-2xl text-gray-600">/mo</span>
                </div>
                <p className="text-sm font-bold text-gray-700">Pays for itself if you retain one extra client</p>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
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
                    <span className="font-black text-lg block">Priority Audio support</span>
                    <span className="text-sm text-gray-600">Fastest responses when you need answers quickly</span>
                  </div>
                </li>
              </ul>

              <div className="bg-gray-100 p-4 rounded-lg mb-6 border-2 border-gray-200">
                <p className="text-sm font-bold text-gray-800 text-center">
                  <strong>Perfect for:</strong> PR agencies and labels juggling multiple artists
                </p>
                <p className="text-xs text-gray-700 text-center mt-2 italic">
                  "Clients pay you premium rates for 'insider knowledge' - we won't tell them it's just better tools"
                </p>
              </div>

              <Button 
                className="w-full rounded-2xl font-black text-xl py-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                onClick={() => handleCheckout('agency', 'monthly')}
                disabled={isLoading === 'agency'}
                type="button"
                data-testid="btn-start-agency"
              >
                {isLoading === 'agency' ? 'Loading...' : 'White-Label Your Intelligence'}
              </Button>
            </div>
          </div>

          {/* Guarantees Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-8">Our Guarantees</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-4 border-green-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-3xl font-black text-white">90%</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">Data Accuracy Guarantee</h3>
                <p className="text-lg font-bold text-gray-700 text-center">
                  90% data accuracy guaranteed - wrong intel doesn't count towards your monthly limit. We only charge for contacts that actually help your campaigns.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-4 border-blue-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-2xl font-black text-white">β</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">Honest Beta Service</h3>
                <p className="text-lg font-bold text-gray-700 text-center">
                  We're in beta, so if something breaks, we'll fix it fast. No corporate runaround - just honest service from people who use this tool daily.
                </p>
              </div>
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
                 Start Your {showEmailForm?.tier === 'professional' ? trialDays.professional : trialDays.agency}-Day Free Trial
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
                    {showEmailForm.tier === 'professional' && '£19.99/month'}
                    {showEmailForm.tier === 'agency' && '£39.99/month'}
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
      
      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-lg font-bold text-gray-700 max-w-3xl mx-auto">Straight answers in plain English. No corporate waffle.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border-4 border-blue-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black text-gray-900 mb-3">Do you offer a free trial?</h3>
              <p className="text-lg font-bold text-gray-700">Yes. Professional and Agency plans include a free trial. You won't be charged until the trial ends and you can cancel any time.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black text-gray-900 mb-3">What currency do you charge in?</h3>
              <p className="text-lg font-bold text-gray-700">All prices are in £GBP. VAT may apply depending on your location.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-4 border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black text-gray-900 mb-3">Can I cancel any time?</h3>
              <p className="text-lg font-bold text-gray-700">Yes. There are no contracts. Cancel any time from your account or by emailing support.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-4 border-yellow-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black text-gray-900 mb-3">What does the 90% data accuracy guarantee mean?</h3>
              <p className="text-lg font-bold text-gray-700">We only count accurate enrichments towards your monthly limit. If something is wrong, it doesn't count.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-4 border-indigo-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
              <h3 className="text-2xl font-black text-gray-900 mb-3">Who is Audio Intel for?</h3>
              <p className="text-lg font-bold text-gray-700">Independent artists, small PR agencies, and labels who need reliable music industry contact intelligence without the £500+/mo enterprise nonsense.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Metadata for Pricing page */}
      <head>
        <title>Pricing | Audio Intel – Contact Enrichment for Music Promotion</title>
        <meta name="description" content="Simple pricing in £GBP for independent artists, PR agencies, and labels. Free beta, Professional £19.99/mo, Agency £39.99/mo." />
        <meta property="og:url" content="https://intel.totalaudiopromo.com/pricing" />
      </head>
      {/* JSON-LD: SoftwareApplication/Product for Audio Intel */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Audio Intel",
            operatingSystem: "Web",
            applicationCategory: "BusinessApplication",
            offers: [
              {
                "@type": "Offer",
                priceCurrency: "GBP",
                price: "19.99",
                category: "professional",
                url: "https://intel.totalaudiopromo.com/pricing"
              },
              {
                "@type": "Offer",
                priceCurrency: "GBP",
                price: "39.99",
                category: "agency",
                url: "https://intel.totalaudiopromo.com/pricing"
              }
            ],
            publisher: { "@type": "Organization", name: "Total Audio Promo" },
            inLanguage: "en-GB"
          })
        }}
      />
      {/* JSON-LD: FAQPage for Pricing */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Do you offer a free trial?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Professional and Agency plans include a free trial. You won't be charged until the trial ends and you can cancel any time."
                }
              },
              {
                "@type": "Question",
                name: "What currency do you charge in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "All prices are in £GBP. VAT may apply depending on your location."
                }
              },
              {
                "@type": "Question",
                name: "Can I cancel any time?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. There are no contracts. Cancel any time from your account or by emailing support."
                }
              },
              {
                "@type": "Question",
                name: "What does the 90% data accuracy guarantee mean?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We only count accurate enrichments towards your monthly limit. If something is wrong, it doesn't count."
                }
              },
              {
                "@type": "Question",
                name: "Who is Audio Intel for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Independent artists, small PR agencies, and labels who need reliable music industry contact intelligence."
                }
              }
            ]
          })
        }}
      />
      <PricingContent />
    </Suspense>
  );
}


