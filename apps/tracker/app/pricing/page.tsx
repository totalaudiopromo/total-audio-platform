import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Tracker | Standalone Campaign Tracking',
  description: 'Simple pricing for standalone campaign tracking. Free for 3 campaigns, £19/month for unlimited. Beta access available.',
  keywords: 'music campaign tracking pricing, radio promotion analytics cost, playlist tracking price, music PR tracking software',
  openGraph: {
    title: 'Tracker Pricing - Standalone Campaign Tracking',
    description: 'Free plan includes 3 campaigns. Professional plan £19/month for unlimited. Agency plan £79/month.',
    url: 'https://tracker.totalaudiopromo.com/pricing',
    siteName: 'Tracker',
    locale: 'en_GB',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tracker.totalaudiopromo.com/pricing',
    languages: {
      'en-GB': 'https://tracker.totalaudiopromo.com/pricing',
    }
  },
};

const plans: Array<{
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  badge: string;
  badgeColor: string;
  saveAmount?: string;
}> = [
  {
    name: 'Free',
    price: 'FREE',
    period: '',
    description: 'Perfect for testing Tracker with your first campaigns',
    features: [
      '3 campaigns included',
      'All AI intelligence features',
      'Industry benchmarks',
      'Campaign Intelligence AI',
      'Standard support',
    ],
    cta: 'Start Free',
    href: '/signup',
    highlighted: false,
    badge: 'BETA',
    badgeColor: 'green',
  },
  {
    name: 'Professional',
    price: '£19',
    period: '/month',
    description: 'For working promoters who need unlimited campaign tracking',
    features: [
      'Unlimited campaigns',
      'All AI intelligence features',
      'Industry benchmarks',
      'Campaign Intelligence AI',
      'Professional exports (PDF/CSV)',
      'Priority support',
    ],
    cta: 'Get Professional',
    href: '/signup',
    highlighted: true,
    badge: 'MOST POPULAR',
    badgeColor: 'purple',
  },
  {
    name: 'Agency',
    price: '£79',
    period: '/month',
    description: 'For agencies managing multiple artists and client campaigns',
    features: [
      'Everything in Professional',
      'Multi-artist tracking',
      'White-label branding',
      'Client-ready reports',
      'Team collaboration',
      'Premium support',
    ],
    cta: 'Contact Sales',
    href: 'mailto:info@totalaudiopromo.com',
    highlighted: false,
    badge: 'AGENCY',
    badgeColor: 'black',
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
          Standalone campaign tracking with AI-powered insights and industry benchmarks.
          Start free, upgrade when you need unlimited campaigns.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-panel relative px-6 py-10 ${
              plan.highlighted
                ? 'ring-4 ring-amber-200 ring-opacity-50 lg:scale-105'
                : ''
            }`}
          >
            {/* Badge */}
            <div className="mb-6">
              <span
                className={`inline-block rounded-full border-2 border-black px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  plan.badgeColor === 'green'
                    ? 'bg-green-500 text-white'
                    : plan.badgeColor === 'purple'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-900 text-white'
                }`}
              >
                {plan.badge}
              </span>
            </div>

            {/* Plan Name */}
            <h2 className="mb-2 text-2xl font-bold">{plan.name}</h2>

            {/* Price */}
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-black">{plan.price}</span>
              {plan.period && (
                <span className="text-xl text-gray-600">{plan.period}</span>
              )}
            </div>

            {/* Save Amount */}
            {plan.saveAmount && (
              <p className="mb-2 text-sm font-bold text-green-600">
                {plan.saveAmount}
              </p>
            )}

            {/* Description */}
            <p className="mb-8 text-sm text-gray-600">{plan.description}</p>

            {/* Features */}
            <ul className="mb-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full border-2 border-black bg-green-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <svg
                      className="h-full w-full text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={plan.href}
              className={`block w-full rounded-xl border-4 border-black px-6 py-4 text-center text-lg font-bold transition-all ${
                plan.highlighted
                  ? 'bg-amber-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1'
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel px-6 py-6">
            <h3 className="mb-3 text-lg font-bold">Can I switch plans?</h3>
            <p className="text-sm text-gray-600">
              Yes! Upgrade or downgrade anytime. Changes take effect immediately.
            </p>
          </div>
          <div className="glass-panel px-6 py-6">
            <h3 className="mb-3 text-lg font-bold">What payment methods do you accept?</h3>
            <p className="text-sm text-gray-600">
              We accept all major credit and debit cards via Stripe.
            </p>
          </div>
          <div className="glass-panel px-6 py-6">
            <h3 className="mb-3 text-lg font-bold">Can I cancel anytime?</h3>
            <p className="text-sm text-gray-600">
              Absolutely. Cancel anytime with no questions asked. Your data stays available.
            </p>
          </div>
          <div className="glass-panel px-6 py-6">
            <h3 className="mb-3 text-lg font-bold">Do you offer refunds?</h3>
            <p className="text-sm text-gray-600">
              Yes. If you're not happy within the first 14 days, we'll refund you in full.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <div className="glass-panel px-8 py-12">
          <h2 className="mb-4 text-3xl font-bold">Ready to start tracking?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Start free with 3 campaigns. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-xl border-4 border-black bg-amber-600 px-12 py-4 text-lg font-bold text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
          >
            Start Free Trial →
          </Link>
        </div>
      </div>
    </div>
  );
}
