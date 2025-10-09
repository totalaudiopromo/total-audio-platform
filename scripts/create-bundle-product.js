#!/usr/bin/env node
/**
 * Create Stripe Bundle Product
 * Creates the "Total Audio Bundle" product with £29/month pricing
 */

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createBundleProduct() {
  try {
    console.log('Creating Total Audio Bundle product in Stripe...\n');

    // Create the product
    const product = await stripe.products.create({
      name: 'Total Audio Bundle',
      description: 'Audio Intel + Pitch Generator - Complete music promotion workflow. Save £5/month compared to buying separately.',
      metadata: {
        bundle: 'true',
        includes: 'audio-intel,pitch-generator',
        type: 'bundle',
      },
    });

    console.log('✓ Product created:', product.id);
    console.log('  Name:', product.name);

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 2900, // £29.00 in pence
      currency: 'gbp',
      recurring: {
        interval: 'month',
      },
      metadata: {
        billing_period: 'monthly',
        bundle: 'true',
      },
    });

    console.log('\n✓ Monthly price created:', monthlyPrice.id);
    console.log('  Amount: £29.00/month\n');

    // Create annual price (£29 * 12 = £348, give 2 months free = £290)
    const annualPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 29000, // £290.00 in pence (2 months free)
      currency: 'gbp',
      recurring: {
        interval: 'year',
      },
      metadata: {
        billing_period: 'annual',
        bundle: 'true',
        savings: '2 months free',
      },
    });

    console.log('✓ Annual price created:', annualPrice.id);
    console.log('  Amount: £290.00/year (2 months free)\n');

    console.log('─────────────────────────────────────────────────');
    console.log('Add these to your .env.local files:\n');
    console.log('STRIPE_PRICE_BUNDLE_MONTHLY=' + monthlyPrice.id);
    console.log('STRIPE_PRICE_BUNDLE_ANNUAL=' + annualPrice.id);
    console.log('NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_MONTHLY=' + monthlyPrice.id);
    console.log('NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_ANNUAL=' + annualPrice.id);
    console.log('─────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('Error creating bundle product:', error.message);
    process.exit(1);
  }
}

createBundleProduct();
