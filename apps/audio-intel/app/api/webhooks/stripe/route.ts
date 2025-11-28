import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy Stripe client initialization to avoid build-time errors
function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  });
}

// Lazy webhook secret access to avoid build-time errors
function getWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET!;
}

// Lazy Supabase client initialization to avoid build-time errors
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

/**
 * Stripe webhook handler for payment events
 * Ingests payment data into payments table with idempotency
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize clients and secrets at runtime (inside handler)
    const supabase = getSupabaseAdmin();
    const stripe = getStripeClient();
    const webhookSecret = getWebhookSecret();

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    console.log(`✅ Stripe webhook received: ${event.type} (${event.id})`);

    // Handle payment-related events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event, stripe, supabase);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event, stripe, supabase);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event, stripe, supabase);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event, stripe, supabase);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event, stripe, supabase);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event, supabase);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event, stripe, supabase);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, eventId: event.id });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const session = event.data.object as Stripe.Checkout.Session;

  console.log('💳 Processing checkout session:', session.id);

  // Get payment intent details
  const paymentIntent = session.payment_intent
    ? await stripe.paymentIntents.retrieve(session.payment_intent as string)
    : null;

  // Get subscription details if present
  const subscription = session.subscription
    ? await stripe.subscriptions.retrieve(session.subscription as string)
    : null;

  // Get customer details
  const customer = session.customer
    ? await stripe.customers.retrieve(session.customer as string)
    : null;

  // Find user by email or Stripe customer ID
  const userEmail =
    session.customer_details?.email || (customer && !customer.deleted ? customer.email : null);

  if (!userEmail) {
    console.warn('⚠️ No email found for checkout session:', session.id);
    return;
  }

  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    console.warn('⚠️ User not found for email:', userEmail);
    return;
  }

  // Insert payment record (idempotent with event_id constraint)
  const paymentData = {
    event_id: event.id,
    user_id: user.id,
    payment_id: paymentIntent?.id || session.payment_intent,
    subscription_id: subscription?.id || null,
    invoice_id: null,
    customer_id: session.customer as string,
    amount_cents: session.amount_total || 0,
    currency: session.currency || 'gbp',
    status: 'succeeded' as const,
    plan_name: subscription?.items.data[0]?.price.nickname || 'One-time payment',
    billing_period: subscription ? subscription.items.data[0]?.price.recurring?.interval : null,
    paid_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    console.error('❌ Failed to insert payment:', error);
  } else {
    console.log('✅ Payment recorded:', paymentData.payment_id);
  }
}

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentIntentSucceeded(
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.log('💳 Processing payment intent:', paymentIntent.id);

  // Get customer email from metadata or customer object
  const customer = paymentIntent.customer
    ? await stripe.customers.retrieve(paymentIntent.customer as string)
    : null;

  const userEmail =
    paymentIntent.metadata.user_email || (customer && !customer.deleted ? customer.email : null);

  if (!userEmail) {
    console.warn('⚠️ No email found for payment intent:', paymentIntent.id);
    return;
  }

  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    console.warn('⚠️ User not found for email:', userEmail);
    return;
  }

  const paymentData = {
    event_id: event.id,
    user_id: user.id,
    payment_id: paymentIntent.id,
    subscription_id: null,
    invoice_id: null, // One-time payments don't have invoice IDs
    customer_id: paymentIntent.customer as string,
    amount_cents: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'succeeded' as const,
    plan_name: paymentIntent.metadata.plan_name || 'One-time payment',
    billing_period: null,
    paid_at: new Date(paymentIntent.created * 1000).toISOString(),
  };

  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    console.error('❌ Failed to insert payment:', error);
  } else {
    console.log('✅ Payment recorded:', paymentData.payment_id);
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentIntentFailed(
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.log('❌ Payment intent failed:', paymentIntent.id);

  const customer = paymentIntent.customer
    ? await stripe.customers.retrieve(paymentIntent.customer as string)
    : null;

  const userEmail =
    paymentIntent.metadata.user_email || (customer && !customer.deleted ? customer.email : null);

  if (!userEmail) {
    return;
  }

  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    return;
  }

  const paymentData = {
    event_id: event.id,
    user_id: user.id,
    payment_id: paymentIntent.id,
    subscription_id: null,
    invoice_id: null, // Failed one-time payments don't have invoice IDs
    customer_id: paymentIntent.customer as string,
    amount_cents: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'failed' as const,
    plan_name: paymentIntent.metadata.plan_name || 'One-time payment',
    billing_period: null,
    paid_at: null,
  };

  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    console.error('❌ Failed to record failed payment:', error);
  }
}

/**
 * Handle invoice.paid event (recurring subscriptions)
 */
async function handleInvoicePaid(
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const invoice = event.data.object as Stripe.Invoice;

  console.log('📄 Processing paid invoice:', invoice.id);

  const customer =
    typeof invoice.customer === 'string'
      ? await stripe.customers.retrieve(invoice.customer)
      : invoice.customer;

  const userEmail = customer && !customer.deleted ? customer.email : null;

  if (!userEmail) {
    return;
  }

  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    return;
  }

  // Type assertion for Stripe webhook data (TypeScript types don't match runtime structure)
  const invoiceAny = invoice as any;
  const subscription =
    typeof invoiceAny.subscription === 'string'
      ? await stripe.subscriptions.retrieve(invoiceAny.subscription)
      : invoiceAny.subscription;

  const paymentData = {
    event_id: event.id,
    user_id: user.id,
    payment_id: invoiceAny.payment_intent as string,
    subscription_id: typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : null,
    invoice_id: invoice.id,
    customer_id: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id,
    amount_cents: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded' as const,
    plan_name:
      subscription && !subscription.deleted
        ? subscription.items.data[0]?.price.nickname || 'Subscription'
        : 'Subscription',
    billing_period:
      subscription && !subscription.deleted
        ? subscription.items.data[0]?.price.recurring?.interval || null
        : null,
    paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
  };

  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    console.error('❌ Failed to record invoice payment:', error);
  } else {
    console.log('✅ Invoice payment recorded:', invoice.id);
  }
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const invoice = event.data.object as Stripe.Invoice;

  console.log('❌ Invoice payment failed:', invoice.id);

  const customer =
    typeof invoice.customer === 'string'
      ? await stripe.customers.retrieve(invoice.customer)
      : invoice.customer;

  const userEmail = customer && !customer.deleted ? customer.email : null;

  if (!userEmail) {
    return;
  }

  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    return;
  }

  // Type assertion for Stripe webhook data
  const invoiceAny = invoice as any;

  const paymentData = {
    event_id: event.id,
    user_id: user.id,
    payment_id: invoiceAny.payment_intent as string | null,
    subscription_id: typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : null,
    invoice_id: invoice.id,
    customer_id: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id,
    amount_cents: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed' as const,
    plan_name: 'Subscription',
    billing_period: null,
    paid_at: null,
  };

  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    console.error('❌ Failed to record failed invoice:', error);
  }
}

/**
 * Handle subscription change events - sync to subscriptions table with app_source
 */
async function handleSubscriptionChange(
  event: Stripe.Event,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  // Type assertion for subscription webhook data
  const sub = event.data.object as any;

  console.log('🔄 Subscription change:', sub.id, sub.status);

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
    return;
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
      app_source: 'audio-intel',
    });

    if (error) {
      console.error('❌ Failed to insert subscription:', error);
    } else {
      console.log('✅ Subscription created:', stripeSubscriptionId);
    }
  }
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(
  event: Stripe.Event,
  stripe: Stripe,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const charge = event.data.object as Stripe.Charge;

  console.log('💸 Charge refunded:', charge.id);

  // Find the original payment record
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('payment_id', charge.payment_intent)
    .single();

  if (!payment) {
    console.warn('⚠️ Payment not found for refund:', charge.payment_intent);
    return;
  }

  // Update payment record with refund information
  // Note: charge.refunds is an array, not a single object
  const chargeAny = charge as any;
  const { error } = await supabase
    .from('payments')
    .update({
      refunded_at: new Date().toISOString(),
      refund_amount_cents: charge.amount_refunded,
      refund_reason: chargeAny.refund?.reason || 'requested_by_customer',
    })
    .eq('id', payment.id);

  if (error) {
    console.error('❌ Failed to record refund:', error);
  } else {
    console.log('✅ Refund recorded for payment:', payment.payment_id);
  }
}
