'use client';

import { useState } from 'react';
import { PricingTier } from '@/lib/pricing';
import { Button } from '@/components/ui/button';

interface PricingCardsProps {
  tiers: PricingTier[];
  currentSubscription: any;
  userType: 'artist' | 'agency';
}

export function PricingCards({ tiers, currentSubscription, userType }: PricingCardsProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (tierId: string, priceId: string | null) => {
    if (!priceId) {
      // Free tier - just redirect to dashboard
      window.location.href = userType === 'agency' ? '/agency-dashboard' : '/my-campaigns';
      return;
    }

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tierId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              billingPeriod === 'yearly'
                ? 'bg-white text-slate-900 shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-600 font-semibold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tiers.map(tier => {
          const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
          const priceId =
            billingPeriod === 'monthly'
              ? tier.stripe_price_id_monthly
              : tier.stripe_price_id_yearly;
          const isCurrentPlan = false; // TODO: Check if this is the current subscription

          const isPro =
            tier.name === 'Pro' ||
            tier.name === 'Agency Pro' ||
            tier.name === 'Agency Enterprise';

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 p-8 ${
                isPro
                  ? 'border-teal-500 bg-gradient-to-br from-blue-50 to-teal-50 shadow-xl'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">£{price}</span>
                  <span className="text-slate-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingPeriod === 'yearly' && price > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    £{(price / 12).toFixed(2)}/month when billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(tier.id, priceId)}
                disabled={isCurrentPlan}
                className={`w-full ${
                  isPro
                    ? 'bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isCurrentPlan
                  ? 'Current Plan'
                  : price === 0
                  ? 'Get Started Free'
                  : `Subscribe to ${tier.name}`}
              </Button>

              {tier.limits && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-medium mb-2">Limits:</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {tier.limits.max_campaigns !== undefined && (
                      <li>
                        Campaigns:{' '}
                        {tier.limits.max_campaigns === -1 ? 'Unlimited' : tier.limits.max_campaigns}
                      </li>
                    )}
                    {tier.limits.max_clients !== undefined && (
                      <li>
                        Clients: {tier.limits.max_clients === -1 ? 'Unlimited' : tier.limits.max_clients}
                      </li>
                    )}
                    {tier.limits.max_team_members !== undefined && (
                      <li>
                        Team Members:{' '}
                        {tier.limits.max_team_members === -1
                          ? 'Unlimited'
                          : tier.limits.max_team_members}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
