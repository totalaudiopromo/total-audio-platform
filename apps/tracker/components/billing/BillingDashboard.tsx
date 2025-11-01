'use client';

import { useState } from 'react';
import { SubscriptionDetails, SubscriptionLimits } from '@/lib/subscription';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  user_type: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  features: string[];
  limits: {
    max_campaigns?: number;
    max_clients?: number;
    max_team_members?: number;
  };
  is_active: boolean;
}

interface BillingDashboardProps {
  subscriptionDetails: SubscriptionDetails | null;
  limits: SubscriptionLimits | null;
  pricingTiers: PricingTier[];
  userType: 'artist' | 'agency';
}

export function BillingDashboard({
  subscriptionDetails,
  limits,
  pricingTiers,
  userType,
}: BillingDashboardProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const currentTier = subscriptionDetails?.subscription_tier || 'free';
  const isActive =
    subscriptionDetails?.subscription_status === 'active' ||
    subscriptionDetails?.subscription_status === 'trialing';

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Your active subscription plan and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {currentTier.replace('_', ' ')} Plan
              </h3>
              <p className="text-sm text-gray-600">
                {isActive ? 'Active subscription' : 'Free plan'}
              </p>
            </div>
            <Badge
              variant={isActive ? 'default' : 'secondary'}
              className={isActive ? 'bg-green-600' : ''}
            >
              {subscriptionDetails?.subscription_status || 'free'}
            </Badge>
          </div>

          {limits?.isBetaUser && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-teal-600" />
              <p className="text-sm text-teal-800">
                You&apos;re a beta user with unlimited access to all features!
              </p>
            </div>
          )}

          {/* Campaign Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Campaigns</span>
              <span className="font-semibold">
                {limits?.campaignsUsed || 0} /{' '}
                {limits?.isUnlimited ? '∞' : limits?.campaignsLimit || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  limits?.requiresUpgrade ? 'bg-red-600' : 'bg-green-600'
                }`}
                style={{
                  width: limits?.isUnlimited
                    ? '100%'
                    : `${Math.min(
                        ((limits?.campaignsUsed || 0) /
                          (limits?.campaignsLimit || 1)) *
                          100,
                        100
                      )}%`,
                }}
              />
            </div>
            {limits?.requiresUpgrade && (
              <p className="text-sm text-red-600">
                You&apos;ve reached your campaign limit. Upgrade to create more
                campaigns.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Interval Toggle */}
      {!limits?.isBetaUser && currentTier === 'free' && (
        <>
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm ${billingInterval === 'monthly' ? 'font-semibold' : 'text-gray-600'}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingInterval(
                  billingInterval === 'monthly' ? 'yearly' : 'monthly'
                )
              }
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              role="switch"
              aria-checked={billingInterval === 'yearly'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingInterval === 'yearly'
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm ${billingInterval === 'yearly' ? 'font-semibold' : 'text-gray-600'}`}
            >
              Yearly <span className="text-green-600">(Save 20%)</span>
            </span>
          </div>

          {/* Pricing Tiers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingTiers.map(tier => {
              const price =
                billingInterval === 'monthly'
                  ? tier.price_monthly
                  : tier.price_yearly;
              const monthlyPrice =
                billingInterval === 'yearly'
                  ? (tier.price_yearly / 12).toFixed(2)
                  : price;
              const isCurrent =
                tier.name.toLowerCase().replace(' ', '_') === currentTier;

              return (
                <Card
                  key={tier.id}
                  className={`relative ${isCurrent ? 'border-2 border-black' : ''}`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-black text-white">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-black">
                        £{monthlyPrice}
                      </span>
                      <span className="text-gray-600">/month</span>
                      {billingInterval === 'yearly' && (
                        <div className="text-sm mt-1">
                          Billed yearly at £{tier.price_yearly}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {!isCurrent && price > 0 && (
                      <Button
                        onClick={async () => {
                          const priceId =
                            billingInterval === 'monthly'
                              ? tier.stripe_price_id_monthly
                              : tier.stripe_price_id_yearly;

                          if (!priceId) {
                            alert('Price ID not configured for this tier');
                            return;
                          }

                          try {
                            const res = await fetch(
                              '/api/billing/create-checkout-session',
                              {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ priceId }),
                              }
                            );

                            const data = await res.json();

                            if (data.url) {
                              window.location.href = data.url;
                            } else {
                              alert('Failed to create checkout session');
                            }
                          } catch (error) {
                            console.error('Checkout error:', error);
                            alert('Failed to start checkout');
                          }
                        }}
                        className="w-full"
                        variant="default"
                      >
                        Upgrade to {tier.name}
                      </Button>
                    )}

                    {isCurrent && (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    )}

                    {price === 0 && (
                      <Button variant="outline" className="w-full" disabled>
                        Free Forever
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Manage Subscription */}
      {isActive && !limits?.isBetaUser && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Update payment method or cancel subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={async () => {
                try {
                  const res = await fetch(
                    '/api/billing/create-portal-session',
                    {
                      method: 'POST',
                    }
                  );

                  const data = await res.json();

                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    alert('Failed to open billing portal');
                  }
                } catch (error) {
                  console.error('Portal error:', error);
                  alert('Failed to open billing portal');
                }
              }}
              variant="outline"
            >
              Manage Billing in Stripe
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
