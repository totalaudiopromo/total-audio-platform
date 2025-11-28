import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy Supabase admin client initialisation
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const body = await request.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  console.log(`✅ Stripe webhook received: ${event.type} (${event.id})`);

  const supabase = getSupabaseAdmin();

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
        const periodStart = sub.current_period_start
          ? new Date(sub.current_period_start * 1000).toISOString()
          : null;
        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        const cancelAtPeriodEnd = !!sub.cancel_at_period_end;

        // Find user by customer ID
        const { data: customerRow } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        const userId = customerRow?.user_id;
        if (!userId) {
          console.warn('⚠️ No user found for customer:', customerId);
          break;
        }

        // Check if subscription exists
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .maybeSingle();

        if (existing?.id) {
          // Update existing subscription
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status,
              price_id: priceId,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              cancel_at_period_end: cancelAtPeriodEnd,
            })
            .eq('id', existing.id);

          if (error) {
            console.error('❌ Failed to update subscription:', error);
          } else {
            console.log('✅ Subscription updated:', stripeSubscriptionId);
          }
        } else {
          // Insert new subscription with app_source
          const { error } = await supabase.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: stripeSubscriptionId,
            status,
            price_id: priceId,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            cancel_at_period_end: cancelAtPeriodEnd,
            app_source: 'pitch-generator',
          });

          if (error) {
            console.error('❌ Failed to insert subscription:', error);
          } else {
            console.log('✅ Subscription created:', stripeSubscriptionId);
          }
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('💳 Checkout completed:', session.id);
        // Subscription handling is done via subscription events
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        console.log('📄 Invoice paid:', invoice.id);
        // Could record payment history here if needed
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('❌ Invoice payment failed:', invoice.id);
        // Could notify user or handle failed payment
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ received: true, error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
