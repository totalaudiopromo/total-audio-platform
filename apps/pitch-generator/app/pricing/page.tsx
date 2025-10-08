"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    monthly: 0,
    annual: 0,
    blurb: 'Try Pitch Generator with your first campaign. Perfect for testing the quality.',
    features: [
      '5 pitches per month',
      'All pitch templates (radio, blog, playlist)',
      'Contact database integration',
      'Voice profile customisation',
      'Email support (48-hour response)',
    ],
  },
  {
    id: 'bundle' as const,
    name: 'Complete Workflow Bundle',
    monthly: 19,
    annual: 190,
    blurb: 'Intel + Pitch Generator + Tracker — Complete promotion workflow at one low price.',
    badge: 'BEST VALUE',
    highlighted: true,
    saveAmount: 'Save £27/month',
    features: [
      'Audio Intel: Unlimited contact enrichment',
      'Pitch Generator: Unlimited AI pitches',
      'Tracker: Unlimited campaign tracking',
      'Full AI intelligence suite',
      'Save 45+ hours per campaign',
      'Priority support across all tools',
    ],
  },
  {
    id: 'professional' as const,
    name: 'PRO',
    monthly: 12,
    annual: 120,
    blurb: 'Pitch Generator only — For artists who only need pitch generation.',
    features: [
      'Unlimited pitch generation',
      '3 subject line variations per pitch',
      'Voice profile customisation',
      'Contact database integration',
      'Priority support (24-hour response)',
    ],
  },
  {
    id: 'agency' as const,
    name: 'Agency',
    monthly: 79,
    annual: 790,
    blurb: 'Complete Bundle + agency features for PR firms and managers.',
    features: [
      'Everything in Complete Bundle',
      'Bulk pitch generation',
      'Multi-artist tracking',
      'White-label branding',
      'Team collaboration',
      'Priority support (4-hour response)',
    ],
  },
];

const formatPrice = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);

type BillingCycle = 'monthly' | 'annual';

type CheckoutState = 'idle' | 'loading' | 'error';

export default function PricingPage() {
  const { data: session } = useSession();
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[number]['id']>('free');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<CheckoutState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);


  const handleCheckout = async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier: selectedPlan, billing }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? 'Checkout failed');
      }

      const payload = await response.json();
      if (payload?.url) {
        window.location.href = payload.url as string;
        return;
      }

      throw new Error('Checkout URL missing from response');
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Checkout failed');
      setStatus('error');
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="glass-panel px-6 py-10 sm:px-10">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">Simple Pricing · No Hidden Fees</span>
        <h1 className="mt-6 text-3xl font-semibold">Stop spending hours on pitches. Start at £0.</h1>
        <p className="mt-4 max-w-2xl text-sm text-gray-600">
          Choose a plan based on your campaign volume. All plans include AI-powered pitch generation,
          Audio Intel integration, and proven templates from real music PR campaigns.
        </p>
        <div className="mt-6 inline-flex items-center rounded-full border border-gray-300 p-1 text-xs text-gray-600">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              billing === 'monthly' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={`rounded-full px-4 py-2 font-semibold transition ${
              billing === 'annual' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Annual billing (save 2 months)
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map(plan => {
          const isActive = plan.id === selectedPlan;
          const price = billing === 'monthly' ? plan.monthly : plan.annual;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`glass-panel text-left transition focus-visible:outline-none ${
                isActive ? 'ring-2 ring-offset-0 ring-primary/70' : 'hover:border-white/25'
              }`}
            >
              <div className="flex flex-col gap-4 px-6 py-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{plan.name}</h2>
                  <span className="text-sm font-medium text-gray-500">{billing === 'monthly' ? 'Monthly' : 'Annual'} plan</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(price)}</span>
                  <span className="text-sm text-gray-500">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.blurb}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-iris" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {isActive && (
                  <span className="self-start rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                    Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <form
        className="glass-panel flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8"
        onSubmit={event => {
          event.preventDefault();
          void handleCheckout();
        }}
      >
        <div className="w-full max-w-md space-y-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-600">
            Checkout email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <p className="text-xs text-gray-500">Prefilled with the signed-in account when available.</p>
        </div>
        <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="cta-button min-w-[190px] justify-center"
          >
            {status === 'loading' ? 'Redirecting…' : 'Proceed to checkout'}
          </button>
          <span className="text-xs text-gray-500">Stripe session will redirect to the success screen.</span>
        </div>
      </form>

      {status === 'error' && errorMessage && (
        <div className="glass-panel border-danger/40 bg-danger/10 px-6 py-4 text-sm text-danger">
          {errorMessage}
        </div>
      )}

      {/* FAQ Section */}
      <div className="glass-panel px-6 py-10 sm:px-10">
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">How is this different from ChatGPT?</h3>
            <p className="text-sm text-gray-600">
              ChatGPT doesn't know your contacts or industry benchmarks. Pitch Generator pulls from your contact database (via Audio Intel)
              and uses proven templates with real success rates from BBC Radio 1, Spotify, and blog campaigns. It's like ChatGPT but trained
              on 5 years of actual pitch data.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">How is this different from hiring a radio plugger?</h3>
            <p className="text-sm text-gray-600">
              Radio pluggers charge £400-£1,500 per campaign and still write pitches manually. Pitch Generator gives you the same personalised
              pitch quality for £14/month. You still need to send them yourself, but you save 15 hours and hundreds of pounds per campaign.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Can I cancel anytime?</h3>
            <p className="text-sm text-gray-600">
              Yes. Cancel anytime from your account settings. No questions asked, no cancellation fees. Your subscription ends at the end of
              your billing period and you keep access until then.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">What if the pitches don't sound good?</h3>
            <p className="text-sm text-gray-600">
              Try the free tier first (5 pitches/month). Generate a few pitches and see the quality before paying. Every pitch includes 3 subject
              line variations and you can regenerate unlimited times until it sounds right. If you're not happy after trying PRO, we'll refund
              your first month.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Do I need Audio Intel to use this?</h3>
            <p className="text-sm text-gray-600">
              No. You can add contacts directly in Pitch Generator. Audio Intel just makes it faster by auto-enriching contact details
              (outlet type, preferred tone, last contact date). But you can absolutely use Pitch Generator standalone.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">What response rates should I expect?</h3>
            <p className="text-sm text-gray-600">
              BBC Radio 1 specialist shows: 14-18% (vs 2% for generic pitches). Spotify playlists: 18-28% with good genre fit. Music blogs: 12-18%
              with story angle. These are real benchmarks from 500+ pitches over 5 years. Your results depend on your music quality and targeting.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Is there a free trial?</h3>
            <p className="text-sm text-gray-600">
              Yes - the free tier gives you 5 pitches per month forever. No credit card required. Test the quality, try different contacts,
              and upgrade to PRO when you need more volume.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Can I get a refund if I don't like it?</h3>
            <p className="text-sm text-gray-600">
              Yes. If you're not happy with PRO or Agency within your first month, email us and we'll refund you. No hassle, no questions.
              We'd rather you try it risk-free than not try it at all.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">Still have questions?</p>
          <a href="mailto:info@totalaudiopromo.com" className="subtle-button inline-flex">
            Email us: info@totalaudiopromo.com
          </a>
        </div>
      </div>
    </div>
  );
}
