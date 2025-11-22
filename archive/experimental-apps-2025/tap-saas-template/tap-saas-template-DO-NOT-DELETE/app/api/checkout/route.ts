import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' }) : null;

type Billing = 'monthly' | 'annual';
type Plan = 'professional' | 'agency';

function getEnv(name: string): string | undefined {
  return process.env[name] || process.env[`NEXT_PUBLIC_${name}`];
}

function resolvePlanPriceId(plan?: Plan, billing?: Billing): string | null {
  if (!plan || !billing) return null;
  const keyBase = `STRIPE_PRICE_${plan.toUpperCase()}`;
  const billKey = billing === 'annual' ? 'ANNUAL' : 'MONTHLY';
  return getEnv(`${keyBase}_${billKey}`) || null;
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      customer_email: email,
      line_items: [{ price: priceId!, quantity: 1 }],
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
