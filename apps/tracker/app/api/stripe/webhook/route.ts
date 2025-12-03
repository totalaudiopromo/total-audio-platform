import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Type for database client with any table access
type SupabaseAny =
  ReturnType<typeof createServerClient> extends Promise<infer T>
    ? T & { from: (table: string) => any }
    : never;

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = (await createServerClient(cookies())) as SupabaseAny;

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Use any to access Stripe fields that may vary by API version
        const sub = event.data.object as Stripe.Subscription & {
          current_period_start?: number;
          current_period_end?: number;
        };
        const stripeSubscriptionId = sub.id;
        const customerId =
          typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        const status = sub.status;
        const priceId = sub.items?.data?.[0]?.price?.id;
        const periodStart = sub.current_period_start
          ? new Date(sub.current_period_start * 1000).toISOString()
          : null;
        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        const cancelAtPeriodEnd = sub.cancel_at_period_end;

        // Look up user by Stripe customer ID
        const { data: customerRow } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        const userId = customerRow?.user_id as string | undefined;
        if (!userId) {
          console.warn(
            `No user found for Stripe customer ${customerId}, skipping subscription sync`
          );
          break;
        }

        // Check if subscription already exists
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .maybeSingle();

        if (existing?.id) {
          // Update existing subscription
          await supabase
            .from('subscriptions')
            .update({
              status,
              price_id: priceId,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              cancel_at_period_end: cancelAtPeriodEnd,
            })
            .eq('id', existing.id);
        } else {
          // Create new subscription record
          await supabase.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: stripeSubscriptionId,
            status,
            price_id: priceId,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: cancelAtPeriodEnd,
            app_source: 'tracker',
          });
        }
        break;
      }
      default:
        // Unhandled event type - just acknowledge receipt
        break;
    }
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json(
      { received: true, error: String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
