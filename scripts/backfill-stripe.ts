/**
 * Stripe Payment Backfill Script
 * Fetches historical payment data from Stripe and inserts into payments table
 *
 * Usage:
 *   npx tsx scripts/backfill-stripe.ts
 *   npx tsx scripts/backfill-stripe.ts --days 90
 *   npx tsx scripts/backfill-stripe.ts --dry-run
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface BackfillOptions {
  days: number;
  dryRun: boolean;
}

async function backfillStripePayments(options: BackfillOptions) {
  console.log(`🔄 Starting Stripe payment backfill...`);
  console.log(`📅 Period: Last ${options.days} days`);
  console.log(`🧪 Dry run: ${options.dryRun ? 'YES' : 'NO'}`);
  console.log('');

  const startTimestamp = Math.floor((Date.now() - options.days * 24 * 60 * 60 * 1000) / 1000);

  try {
    // Fetch payment intents from Stripe
    console.log('📡 Fetching payment intents from Stripe...');
    const paymentIntents = await fetchPaymentIntents(startTimestamp);
    console.log(`✅ Found ${paymentIntents.length} payment intents`);

    // Fetch invoices (for subscriptions)
    console.log('📡 Fetching invoices from Stripe...');
    const invoices = await fetchInvoices(startTimestamp);
    console.log(`✅ Found ${invoices.length} invoices`);

    // Process payment intents
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    console.log('');
    console.log('💳 Processing payment intents...');
    for (const paymentIntent of paymentIntents) {
      try {
        const result = await processPaymentIntent(paymentIntent, options.dryRun);
        if (result === 'success') successCount++;
        if (result === 'skipped') skipCount++;
      } catch (error: any) {
        console.error(`❌ Error processing ${paymentIntent.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('');
    console.log('📄 Processing invoices...');
    for (const invoice of invoices) {
      try {
        const result = await processInvoice(invoice, options.dryRun);
        if (result === 'success') successCount++;
        if (result === 'skipped') skipCount++;
      } catch (error: any) {
        console.error(`❌ Error processing ${invoice.id}:`, error.message);
        errorCount++;
      }
    }

    // Summary
    console.log('');
    console.log('═'.repeat(60));
    console.log('📊 BACKFILL SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Successfully processed: ${successCount}`);
    console.log(`⏭️  Skipped (already exists): ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📦 Total records: ${paymentIntents.length + invoices.length}`);
    console.log('');

    if (options.dryRun) {
      console.log('🧪 DRY RUN - No data was actually inserted');
    } else {
      console.log('✅ Backfill complete!');
    }
  } catch (error) {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  }
}

async function fetchPaymentIntents(createdAfter: number): Promise<Stripe.PaymentIntent[]> {
  const paymentIntents: Stripe.PaymentIntent[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.paymentIntents.list({
      created: { gte: createdAfter },
      limit: 100,
      starting_after: startingAfter,
    });

    paymentIntents.push(...response.data);
    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return paymentIntents;
}

async function fetchInvoices(createdAfter: number): Promise<Stripe.Invoice[]> {
  const invoices: Stripe.Invoice[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const response = await stripe.invoices.list({
      created: { gte: createdAfter },
      limit: 100,
      starting_after: startingAfter,
      status: 'paid',
    });

    invoices.push(...response.data);
    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return invoices;
}

async function processPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
  dryRun: boolean
): Promise<'success' | 'skipped'> {
  // Get customer details
  const customer =
    typeof paymentIntent.customer === 'string'
      ? await stripe.customers.retrieve(paymentIntent.customer)
      : paymentIntent.customer;

  const userEmail =
    paymentIntent.metadata.user_email || (customer && !customer.deleted ? customer.email : null);

  if (!userEmail) {
    console.log(`⚠️  Skipping ${paymentIntent.id} - no email found`);
    return 'skipped';
  }

  // Find user by email
  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    console.log(`⚠️  Skipping ${paymentIntent.id} - user not found for ${userEmail}`);
    return 'skipped';
  }

  // Create payment data
  const paymentData = {
    event_id: `backfill_${paymentIntent.id}`, // Use backfill prefix to avoid conflicts
    user_id: user.id,
    payment_id: paymentIntent.id,
    subscription_id: null,
    invoice_id: paymentIntent.invoice as string | null,
    customer_id: paymentIntent.customer as string,
    amount_cents: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status === 'succeeded' ? ('succeeded' as const) : ('failed' as const),
    plan_name: paymentIntent.metadata.plan_name || 'Historical payment',
    billing_period: null,
    paid_at:
      paymentIntent.status === 'succeeded'
        ? new Date(paymentIntent.created * 1000).toISOString()
        : null,
  };

  if (dryRun) {
    console.log(
      `🧪 Would insert: ${paymentIntent.id} for ${userEmail} (£${(paymentIntent.amount / 100).toFixed(2)})`
    );
    return 'success';
  }

  // Insert into database
  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(
    `✅ Inserted: ${paymentIntent.id} for ${userEmail} (£${(paymentIntent.amount / 100).toFixed(2)})`
  );
  return 'success';
}

async function processInvoice(
  invoice: Stripe.Invoice,
  dryRun: boolean
): Promise<'success' | 'skipped'> {
  const customer =
    typeof invoice.customer === 'string'
      ? await stripe.customers.retrieve(invoice.customer)
      : invoice.customer;

  const userEmail = customer && !customer.deleted ? customer.email : null;

  if (!userEmail) {
    console.log(`⚠️  Skipping invoice ${invoice.id} - no email found`);
    return 'skipped';
  }

  const { data: user } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!user) {
    console.log(`⚠️  Skipping invoice ${invoice.id} - user not found for ${userEmail}`);
    return 'skipped';
  }

  const subscription =
    typeof invoice.subscription === 'string'
      ? await stripe.subscriptions.retrieve(invoice.subscription)
      : invoice.subscription;

  const paymentData = {
    event_id: `backfill_invoice_${invoice.id}`,
    user_id: user.id,
    payment_id: invoice.payment_intent as string,
    subscription_id: typeof invoice.subscription === 'string' ? invoice.subscription : null,
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

  if (dryRun) {
    console.log(
      `🧪 Would insert invoice: ${invoice.id} for ${userEmail} (£${(invoice.amount_paid / 100).toFixed(2)})`
    );
    return 'success';
  }

  const { error } = await supabase.from('payments').upsert(paymentData, {
    onConflict: 'event_id',
    ignoreDuplicates: true,
  });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(
    `✅ Inserted invoice: ${invoice.id} for ${userEmail} (£${(invoice.amount_paid / 100).toFixed(2)})`
  );
  return 'success';
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const daysIndex = args.indexOf('--days');
  const days = daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : 90;
  const dryRun = args.includes('--dry-run');

  await backfillStripePayments({ days, dryRun });
}

if (require.main === module) {
  main();
}
