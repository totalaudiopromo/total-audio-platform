import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  // @ts-ignore We intentionally pin API version for stability
  apiVersion: '2023-10-16',
});

type Billing = 'monthly' | 'annual';
type Plan = 'starter' | 'professional' | 'agency';

function getEnv(name: string): string | null {
  return process.env[name] || null;
}

function resolvePlanPriceId(plan?: Plan, billing?: Billing): string | null {
  if (!plan || !billing) return null;
  const keyBase = `${plan}`.toUpperCase();
  const billKey = billing === 'annual' ? 'ANNUAL' : 'MONTHLY';

  // Try environment variables first
  const envPriceId =
    getEnv(`STRIPE_PRICE_${keyBase}_${billKey}`) ||
    getEnv(`NEXT_PUBLIC_STRIPE_PRICE_${keyBase}_${billKey}`);

  if (envPriceId) return envPriceId;

  // Fallback to hardcoded price IDs if environment variables are not set
  const fallbackPriceIds: Record<string, Record<string, string>> = {
    STARTER: {
      MONTHLY: 'price_1Ro9x2PqujcPv5fbMFNSIqq1',
      ANNUAL: 'price_1Ro9x2PqujcPv5fbjvdTBDvE',
    },
    PROFESSIONAL: {
      MONTHLY: 'price_1Ro9xiPqujcPv5fbutj97L7C',
      ANNUAL: 'price_1Ro9xiPqujcPv5fbutj97L7C',
    },
    AGENCY: {
      MONTHLY: 'price_1Ro9zrPqujcPv5fbmjN7bph6',
      ANNUAL: 'price_1Ro9yePqujcPv5fb4PBXlwVb',
    },
  };

  return fallbackPriceIds[keyBase]?.[billKey] || null;
}

function resolveLegacyPriceId(billing?: Billing): string | null {
  if (!billing) return null;

  // Try environment variables first
  if (billing === 'annual') {
    const envPriceId =
      process.env.STRIPE_PRICE_ANNUAL || process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL;
    if (envPriceId) return envPriceId;

    // Fallback to Professional Annual (most common annual plan)
    return 'price_1Ro9xiPqujcPv5fbutj97L7C';
  }

  const envPriceId =
    process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
  if (envPriceId) return envPriceId;

  // Fallback to Professional Monthly (most common monthly plan)
  return 'price_1Ro9xiPqujcPv5fbutj97L7C';
}

function resolveTrialDays(plan?: Plan): number | undefined {
  // Specific per-plan overrides
  const specificKey = plan ? `STRIPE_TRIAL_DAYS_${`${plan}`.toUpperCase()}` : null;
  const specific = specificKey ? getEnv(specificKey) : null;
  const generic = getEnv('STRIPE_TRIAL_DAYS');
  const parsedSpecific = specific ? parseInt(specific, 10) : NaN;
  const parsedGeneric = generic ? parseInt(generic, 10) : NaN;
  if (!Number.isNaN(parsedSpecific) && parsedSpecific > 0) return parsedSpecific;
  if (!Number.isNaN(parsedGeneric) && parsedGeneric > 0) return parsedGeneric;
  // Sensible defaults by plan
  if (plan === 'starter') return 7;
  if (plan === 'professional' || plan === 'agency') return 14;
  return undefined;
}

function isValidStripePriceId(value: string | null | undefined): boolean {
  return !!value && /^price_[A-Za-z0-9]+/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const {
      priceId,
      email,
      tier,
      plan,
    }: { priceId?: string; email?: string; tier?: Billing; plan?: Plan } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // CRITICAL FIX: Subscribe to ConvertKit BEFORE creating Stripe session
    try {
      console.log(`Subscribing ${email} to ConvertKit before checkout...`);

      const { getEnv } = await import('@/lib/env');
      const CONVERTKIT_API_KEY =
        getEnv('KIT_API_KEY', { requiredInProd: false }) ||
        getEnv('CONVERTKIT_API_KEY', { requiredInProd: false });
      const formId = '8440957'; // Enterprise trial form ID for 'hero' form type

      // Determine user type (beta users get special tagging)
      const isBetaUser = true; // All users are currently beta users during beta phase
      const userRole = isBetaUser ? 'beta_trial_user' : 'trial_user';

      // Direct ConvertKit API call instead of internal HTTP request
      if (CONVERTKIT_API_KEY) {
        const convertkitResponse = await fetch(
          `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: CONVERTKIT_API_KEY,
              email: email,
              first_name: '',
              fields: {
                company_name: '',
                industry_role: userRole,
                lead_source: 'checkout',
                signup_date: new Date().toISOString(),
                trial_start_date: new Date().toISOString(),
                trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                plan: plan || 'professional',
                billing: tier || 'monthly',
                is_beta: isBetaUser ? 'true' : 'false',
              },
            }),
          }
        );

        if (convertkitResponse.ok) {
          const result = await convertkitResponse.json();
          console.log(`Successfully subscribed ${email} to ConvertKit before checkout`, result);

          // Subscribe to the email sequence (ID: 2453581)
          const sequenceResponse = await fetch(
            `https://api.convertkit.com/v3/courses/2453581/subscribe`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                api_key: CONVERTKIT_API_KEY,
                email: email,
              }),
            }
          );

          if (sequenceResponse.ok) {
            console.log(`Successfully subscribed ${email} to sequence 2453581`);
          } else {
            console.warn(`Failed to subscribe ${email} to sequence`);
          }
        } else {
          const errorText = await convertkitResponse.text();
          console.warn(`ConvertKit subscription failed for ${email}:`, errorText);
        }
      } else {
        console.warn('ConvertKit API key not set; skipping pre-checkout subscription');
      }
    } catch (convertkitError) {
      console.error('ConvertKit subscription error:', convertkitError);
      // Continue with checkout even if ConvertKit fails
    }
    const resolvedPriceId = priceId || resolvePlanPriceId(plan, tier) || resolveLegacyPriceId(tier);

    // Check if we have a valid price ID
    if (!resolvedPriceId) {
      return NextResponse.json(
        {
          error: 'Missing priceId (provide priceId or tier with configured envs)',
        },
        { status: 400 }
      );
    }

    if (!isValidStripePriceId(resolvedPriceId)) {
      const msg = `Invalid priceId configured (received "${resolvedPriceId}"). Expected a Stripe Price ID starting with 'price_'.`;
      console.warn(msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Check if Stripe is configured
    if (!stripeSecretKey) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Checkout dev fallback: redirecting to success without Stripe.');
        return NextResponse.json({ url: `${baseUrl}/success?session_id=dev_local` });
      }

      // In production, if Stripe is not configured, provide a helpful error
      console.error('Stripe not configured in production');
      return NextResponse.json(
        {
          error: 'Payments not configured. Please contact support.',
        },
        { status: 503 }
      );
    }

    const trialDays = resolveTrialDays(plan);

    // Check if user is beta founder (tagged in ConvertKit during beta signup)
    const isBetaUser = true; // All current users are beta users during beta phase
    const isBetaFounder = isBetaUser; // All current beta users get founder discount
    const betaFounderCouponId = 'qa5J5GRN'; // 50% off for 12 months

    try {
      const sessionConfig: any = {
        mode: 'subscription',
        customer_email: email,
        line_items: [{ price: resolvedPriceId, quantity: 1 }],
        allow_promotion_codes: true,
        // Apple Pay off for now: only 'card'
        payment_method_types: ['card'],
        subscription_data:
          trialDays && trialDays > 0 ? { trial_period_days: trialDays } : undefined,
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
      };

      // Auto-apply beta founder discount for beta users
      if (isBetaFounder) {
        sessionConfig.discounts = [{ coupon: betaFounderCouponId }];
        console.log(`Applied beta founder discount (50% off first year) for ${email}`);
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      return NextResponse.json({ url: session.url });
    } catch (stripeError: any) {
      console.error('Stripe API error:', stripeError);

      // Provide specific error messages for common Stripe errors
      if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          {
            error: 'Invalid payment configuration. Please contact support.',
          },
          { status: 400 }
        );
      }

      if (stripeError.type === 'StripeAuthenticationError') {
        return NextResponse.json(
          {
            error: 'Payment service authentication failed. Please contact support.',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: 'Payment processing failed. Please try again or contact support.',
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Checkout route error:', err);
    return NextResponse.json(
      {
        error: 'Checkout failed. Please try again or contact support.',
      },
      { status: 500 }
    );
  }
}
