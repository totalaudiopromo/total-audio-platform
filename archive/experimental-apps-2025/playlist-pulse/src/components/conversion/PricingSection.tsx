'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConversionOptimizer, useSession } from '@/lib/conversion-optimizer';
import { cn } from '@/lib/utils';
import { Check, Star, Zap, Crown, Users } from 'lucide-react';

interface PricingSectionProps {
  className?: string;
}

interface PricingPlan {
  id: 'starter' | 'professional' | 'agency';
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  icon: React.ReactNode;
  highlighted?: boolean;
}

const basePlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for new UK producers getting started',
    monthlyPrice: 15,
    annualPrice: 12, // 20% discount
    features: [
      '100 playlist submissions per month',
      'Basic UK curator database',
      'Email support',
      'Basic analytics dashboard',
      'Genre matching algorithm',
    ],
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For serious producers building their career',
    monthlyPrice: 30,
    annualPrice: 22.5, // 25% discount
    features: [
      '500 playlist submissions per month',
      'Premium UK curator database',
      'Priority support + phone calls',
      'Advanced analytics & insights',
      'A&R contact database',
      'Automated follow-up sequences',
      'Performance tracking tools',
    ],
    icon: <Zap className="w-6 h-6" />,
    highlighted: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'For labels and agencies managing multiple artists',
    monthlyPrice: 99,
    annualPrice: 69.3, // 30% discount
    features: [
      'Unlimited playlist submissions',
      'Full UK curator database + international',
      'Dedicated account manager',
      'White-label dashboard',
      'Multi-artist management',
      'API access',
      'Custom integrations',
      'Priority playlist placement',
      'Industry networking events',
    ],
    icon: <Crown className="w-6 h-6" />,
  },
];

export default function PricingSection({ className }: PricingSectionProps) {
  const { sessionId } = useSession();
  const { assignVariant, getVariantConfig, trackEvent } = useConversionOptimizer();

  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState(basePlans);
  const [badges, setBadges] = useState<any>(null);
  const [urgency, setUrgency] = useState<any>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    // Track pricing section view
    if (!hasTrackedView) {
      trackEvent({
        eventType: 'pricing_view',
        variantId: 'control',
        testId: 'pricing-psychology-2025-01',
        sessionId,
      });
      setHasTrackedView(true);
    }

    // Initialize A/B test variants
    const pricingVariant = assignVariant(sessionId, 'pricing-psychology-2025-01');
    const badgeVariant = assignVariant(sessionId, 'most-popular-badge-2025-01');
    const urgencyVariant = assignVariant(sessionId, 'ethical-urgency-2025-01');

    // Apply pricing configuration
    const pricingConfig = getVariantConfig(sessionId, 'pricing-psychology-2025-01');
    if (pricingConfig?.pricing) {
      const { displayFormat, monthlyPrices, annualDiscounts } = pricingConfig.pricing;

      // Set default toggle state based on variant
      if (displayFormat === 'toggle-default-annual') {
        setIsAnnual(true);
      }

      // Update pricing if custom prices are defined
      const updatedPlans = basePlans.map(plan => ({
        ...plan,
        monthlyPrice: monthlyPrices[plan.id] || plan.monthlyPrice,
        annualPrice:
          monthlyPrices[plan.id] * (1 - annualDiscounts[plan.id] / 100) || plan.annualPrice,
      }));
      setPlans(updatedPlans);
    }

    // Apply badge configuration
    const badgeConfig = getVariantConfig(sessionId, 'most-popular-badge-2025-01');
    if (badgeConfig?.badges) {
      setBadges(badgeConfig.badges);
    }

    // Apply urgency configuration
    const urgencyConfig = getVariantConfig(sessionId, 'ethical-urgency-2025-01');
    if (urgencyConfig?.urgency) {
      setUrgency(urgencyConfig.urgency);
    }
  }, [sessionId, assignVariant, getVariantConfig, trackEvent, hasTrackedView]);

  const handlePlanHover = (planId: string) => {
    trackEvent({
      eventType: 'plan_hover',
      variantId: 'pricing-variant',
      testId: 'pricing-psychology-2025-01',
      sessionId,
      metadata: { planId },
    });
  };

  const handleCtaClick = (planId: string, price: number) => {
    trackEvent({
      eventType: 'cta_click',
      variantId: 'pricing-variant',
      testId: 'pricing-psychology-2025-01',
      sessionId,
      metadata: { planId, price, isAnnual },
    });
  };

  const getBadgeForPlan = (planId: string) => {
    if (!badges) return null;

    if (badges.mostPopular?.enabled && badges.mostPopular.plan === planId) {
      return (
        <Badge
          className={cn(
            'absolute font-semibold',
            badges.mostPopular.position === 'top-right' && '-top-2 -right-2',
            badges.mostPopular.position === 'top-center' &&
              '-top-2 left-1/2 transform -translate-x-1/2',
            badges.mostPopular.position === 'header' && 'relative top-0 mb-2',
            badges.mostPopular.color === 'yellow' && 'bg-yellow-400 text-black',
            badges.mostPopular.color === 'blue' && 'bg-blue-500 text-white',
            badges.mostPopular.color === 'gradient' &&
              'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          )}
        >
          {badges.mostPopular.text}
        </Badge>
      );
    }

    return null;
  };

  const formatPrice = (plan: PricingPlan) => {
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const savings = isAnnual
      ? Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100)
      : 0;

    return (
      <div className="text-center">
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-white">£{price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
        {isAnnual && savings > 0 && (
          <div className="text-green-400 text-sm font-medium mt-1">Save {savings}% annually</div>
        )}
        {!isAnnual && plan.annualPrice < plan.monthlyPrice && (
          <div className="text-gray-400 text-sm mt-1">
            or £{plan.annualPrice}/month billed annually
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={cn('py-20 px-4 sm:px-6 lg:px-8', className)}>
      <div className="max-w-7xl mx-auto">
        {/* Urgency Message */}
        {urgency && urgency.type !== 'none' && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-full px-4 py-2 text-yellow-300">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{urgency.message}</span>
              {urgency.limitMessage && (
                <Badge variant="secondary" className="bg-yellow-400 text-black text-xs">
                  {urgency.limitMessage}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start free, scale as you grow. All plans include our core playlist submission platform.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <div className="flex items-center gap-4 px-6 py-2">
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  !isAnnual ? 'text-white' : 'text-gray-400'
                )}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  isAnnual ? 'bg-blue-500' : 'bg-gray-600'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                    isAnnual ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </button>
              <span
                className={cn(
                  'text-sm font-medium transition-colors flex items-center gap-1',
                  isAnnual ? 'text-white' : 'text-gray-400'
                )}
              >
                Annual
                <Badge className="bg-green-500 text-white text-xs">Save 30%</Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={cn(
                'relative p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10',
                plan.highlighted && 'ring-2 ring-blue-500 scale-105'
              )}
              onMouseEnter={() => handlePlanHover(plan.id)}
            >
              {/* Badge */}
              {getBadgeForPlan(plan.id)}

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="mb-8">{formatPrice(plan)}</div>

              {/* CTA Button */}
              <Button
                className={cn(
                  'w-full mb-8 h-12 text-base font-semibold',
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                )}
                onClick={() =>
                  handleCtaClick(plan.id, isAnnual ? plan.annualPrice : plan.monthlyPrice)
                }
              >
                {plan.id === 'starter'
                  ? 'Start Free Trial'
                  : plan.id === 'professional'
                    ? 'Get Professional'
                    : 'Contact Sales'}
              </Button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Value Props */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">No Setup Fees</h4>
              <p className="text-gray-400 text-sm">
                Start immediately with no hidden costs or setup charges
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Cancel Anytime</h4>
              <p className="text-gray-400 text-sm">
                No long-term commitments. Cancel or change plans anytime
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">UK Support Team</h4>
              <p className="text-gray-400 text-sm">
                Get help from our UK-based music industry experts
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm mb-4">Trusted by over 5,000 UK music producers</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-gray-500 font-semibold">PRS for Music</div>
            <div className="text-gray-500 font-semibold">UK Music</div>
            <div className="text-gray-500 font-semibold">BASCA</div>
            <div className="text-gray-500 font-semibold">MMF</div>
          </div>
        </div>
      </div>
    </section>
  );
}
