/**
 * Activate Stripe Prices Script
 * Quick script to activate your Stripe price IDs via API
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function activatePrice(priceId, name) {
  try {
    console.log(`\nActivating ${name} (${priceId})...`);

    // Check current price status
    const price = await stripe.prices.retrieve(priceId);
    console.log(`Current status: ${price.active ? 'ACTIVE' : 'INACTIVE'}`);

    if (!price.active) {
      // Prices can't be directly activated - they're immutable
      // Instead, we need to check the product
      const product = await stripe.products.retrieve(price.product);
      console.log(`Product "${product.name}" status: ${product.active ? 'ACTIVE' : 'INACTIVE'}`);

      if (!product.active) {
        await stripe.products.update(price.product, {
          active: true,
        });
        console.log(`✅ Activated product: ${product.name}`);
      }
    } else {
      console.log(`✅ Already active`);
    }

    // Show price details
    console.log(`   Amount: £${(price.unit_amount / 100).toFixed(2)}`);
    console.log(`   Interval: ${price.recurring?.interval || 'one-time'}`);
  } catch (error) {
    console.error(`❌ Error activating ${name}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Activating Stripe Prices...\n');

  // From your .env.local
  const prices = [
    { id: 'price_1Ro9yEPqujcPv5fbZKpcLIFT', name: 'Professional Monthly (£19.99)' },
    { id: 'price_1Ro9zrPqujcPv5fbmjN7bph6', name: 'Agency Monthly (£39.99)' },
  ];

  for (const price of prices) {
    await activatePrice(price.id, price.name);
  }

  console.log('\n✅ Done! Check your Stripe dashboard to verify.');
  console.log('   Dashboard: https://dashboard.stripe.com/test/prices\n');
}

main().catch(console.error);
