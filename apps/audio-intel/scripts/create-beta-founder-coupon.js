#!/usr/bin/env node

/**
 * Create Stripe coupon code for Beta Founder discount
 * 50% off for first 12 months
 */

const Stripe = require('stripe');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createBetaFounderCoupon() {
  try {
    console.log('🎯 Creating Beta Founder 50% discount coupon...');

    // Create the coupon
    const coupon = await stripe.coupons.create({
      name: 'Beta Founder - 50% Off First Year',
      percent_off: 50,
      duration: 'repeating',
      duration_in_months: 12,
      metadata: {
        description: 'Beta founder exclusive - 50% off for first 12 months',
        campaign: 'beta-launch-2025',
        applies_to: 'all-plans',
      },
    });

    console.log('✅ Coupon created successfully!');
    console.log(`   Coupon ID: ${coupon.id}`);
    console.log(`   Name: ${coupon.name}`);
    console.log(`   Discount: ${coupon.percent_off}% off for ${coupon.duration_in_months} months`);

    // Create a promotion code with a memorable code
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'BETAFOUNDER50',
      active: true,
      max_redemptions: 1000, // Limit to first 1000 beta users
      metadata: {
        campaign: 'beta-launch-2025',
        description: 'Beta founder early access discount',
      },
    });

    console.log('\n✅ Promotion code created!');
    console.log(`   Code: ${promoCode.code}`);
    console.log(`   Max redemptions: ${promoCode.max_redemptions}`);
    console.log(`   Active: ${promoCode.active}`);

    console.log('\n🎉 Setup complete!');
    console.log('\nTo use this discount:');
    console.log('1. Users can enter "BETAFOUNDER50" at checkout');
    console.log(`2. Or auto-apply in code using coupon ID: ${coupon.id}`);
    console.log(`3. Or auto-apply in code using promo code ID: ${promoCode.id}`);

    return { coupon, promoCode };
  } catch (error) {
    console.error('❌ Error creating coupon:', error.message);

    // Check if coupon already exists
    if (error.code === 'resource_already_exists') {
      console.log('\n⚠️  Coupon might already exist. Listing existing coupons...');
      const coupons = await stripe.coupons.list({ limit: 10 });
      console.log('\nExisting coupons:');
      coupons.data.forEach(c => {
        console.log(`   ${c.id}: ${c.name} - ${c.percent_off}% off`);
      });
    }

    throw error;
  }
}

// Run the script
if (require.main === module) {
  createBetaFounderCoupon()
    .then(() => {
      console.log('\n✨ All done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createBetaFounderCoupon };
