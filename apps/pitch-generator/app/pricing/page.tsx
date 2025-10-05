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
      '10 pitches per month',
      'All pitch templates (radio, blog, playlist)',
      'Audio Intel contact sync',
      'Copy-to-clipboard functionality',
      'Email support (48-hour response)',
    ],
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    monthly: 39,
    annual: 390,
    blurb: 'For independent artists and solo promoters running 5-10 campaigns per year.',
    features: [
      'Generate unlimited personalised pitches',
      'Sync contacts from Audio Intel database',
      'All campaign templates (radio, blog, playlist, press)',
      'Copy-to-clipboard for quick sending',
      'Email support within 24 hours',
    ],
  },
  {
    id: 'agency' as const,
    name: 'Agency',
    monthly: 79,
    annual: 790,
    blurb: 'For PR agencies and managers juggling multiple artists simultaneously.',
    features: [
      'Everything in Professional',
      'Team collaboration (up to 5 users)',
      'Custom pitch templates and brand voice',
      'Bulk pitch generation for 50+ contacts at once',
      'Priority email support (4-hour response)',
      'Campaign performance tracking',
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
    </div>
  );
}
