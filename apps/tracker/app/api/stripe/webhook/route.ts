import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@total-audio/core-db/server'
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const body = await request.text();
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const supabase = await createServerClient(cookies());

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const stripeSubscriptionId = sub.id as string;
        const customerId = sub.customer as string;
        const status = sub.status as string;
        const priceId = sub.items?.data?.[0]?.price?.id as string | undefined;
        const periodStart = sub.current_period_start ? new Date(sub.current_period_start * 1000).toISOString() : null;
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
        const cancelAtPeriodEnd = !!sub.cancel_at_period_end;

        const { data: customerRow } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();
        const userId = customerRow?.user_id as string | undefined;
        if (!userId) break;

        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .maybeSingle();

        if (existing?.id) {
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
          await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              stripe_subscription_id: stripeSubscriptionId,
              status,
              price_id: priceId,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              cancel_at_period_end: cancelAtPeriodEnd,
            });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    return NextResponse.json({ received: true, error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}












