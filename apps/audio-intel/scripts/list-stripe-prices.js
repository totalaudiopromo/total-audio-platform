/**
 * List All Stripe Prices
 * Find the correct monthly price IDs
 */

require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function listAllPrices() {
  console.log('📋 Listing all Stripe prices...\n');

  try {
    const prices = await stripe.prices.list({
      limit: 20,
      expand: ['data.product'],
    });

    for (const price of prices.data) {
      const product = price.product;
      const amount = (price.unit_amount / 100).toFixed(2);
      const currency = price.currency.toUpperCase();
      const interval = price.recurring?.interval || 'one-time';
      const status = price.active ? '✅ ACTIVE' : '❌ INACTIVE';

      console.log(`${status} ${product.name}`);
      console.log(`   Price ID: ${price.id}`);
      console.log(`   Amount: ${currency} ${amount} / ${interval}`);
      console.log(`   Created: ${new Date(price.created * 1000).toLocaleDateString()}`);
      console.log('');
    }

    console.log(`\nTotal prices found: ${prices.data.length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listAllPrices();
