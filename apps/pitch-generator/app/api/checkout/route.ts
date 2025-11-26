import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-08-27.basil' })
  : null;

type Billing = 'monthly' | 'annual';
type Plan = 'professional' | 'agency';

function getEnv(name: string): string | undefined {
  return process.env[name] || process.env[`NEXT_PUBLIC_${name}`];
}

function resolvePlanPriceId(plan?: Plan, billing?: Billing): string | null {
  if (!plan || !billing) return null;
  const keyBase = `STRIPE_PRICE_${plan.toUpperCase()}`;
  const billKey = billing === 'annual' ? 'ANNUAL' : 'MONTHLY';

  // Try environment variables first
  const envPriceId = getEnv(`${keyBase}_${billKey}`);
  if (envPriceId) return envPriceId;

  // Fallback to hardcoded price IDs if environment variables are not set
  // Pitch Generator: Professional £14/mo, Agency £49/mo
  const fallbackPriceIds: Record<string, Record<string, string>> = {
    PROFESSIONAL: {
      MONTHLY: 'price_1SFCVkPqujcPv5fb4K7vb506', // £14/month
      ANNUAL: 'price_1SFCWWPqujcPv5fb77EVheNd', // £140/year
    },
    AGENCY: {
      MONTHLY: 'price_1SFCaKPqujcPv5fbKkIBcVWa', // £49/month
      ANNUAL: 'price_1SFCakPqujcPv5fb7nXaqVrK', // £490/year
    },
  };

  return fallbackPriceIds[plan.toUpperCase()]?.[billKey] || null;
}

function resolveTrialDays(plan?: Plan): number {
  // Specific per-plan overrides from environment
  const specificKey = plan ? `STRIPE_TRIAL_DAYS_${plan.toUpperCase()}` : null;
  const specific = specificKey ? getEnv(specificKey) : null;
  const generic = getEnv('STRIPE_TRIAL_DAYS');

  const parsedSpecific = specific ? parseInt(specific, 10) : NaN;
  const parsedGeneric = generic ? parseInt(generic, 10) : NaN;

  if (!Number.isNaN(parsedSpecific) && parsedSpecific > 0) return parsedSpecific;
  if (!Number.isNaN(parsedGeneric) && parsedGeneric > 0) return parsedGeneric;

  // Tier-specific defaults: Professional 14 days, Agency 7 days
  if (plan === 'professional') return 14;
  if (plan === 'agency') return 7;
  return 14; // Default fallback
}

function isValidStripePriceId(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith('price_');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, tier, billing }: { email?: string; tier?: Billing | Plan; billing?: Billing } =
      body || {};

    const plan = tier === 'agency' || tier === 'professional' ? (tier as Plan) : 'professional';
    const bill = billing === 'annual' || billing === 'monthly' ? billing : 'monthly';

    const priceId = resolvePlanPriceId(plan, bill);
    if (!isValidStripePriceId(priceId)) {
      // Dev fallback: allow redirect to success locally so template works before Stripe is configured
      if (!stripeSecretKey) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return NextResponse.json({ url: `${baseUrl}/success?session_id=dev_local` });
      }
      return NextResponse.json({ error: 'Invalid Stripe price configuration' }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004';
    const trialDays = resolveTrialDays(plan);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      customer_email: email,
      line_items: [{ price: priceId!, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: trialDays,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
