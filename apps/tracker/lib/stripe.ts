import Stripe from 'stripe';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

// Lazy initialize Stripe to avoid build-time errors when STRIPE_SECRET_KEY is missing
function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey || apiKey === '') {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured. Cannot process payments.'
    );
  }
  return new Stripe(apiKey, {
    apiVersion: '2025-08-27.basil',
  });
}

// Export a getter instead of the client directly
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    return getStripeClient()[prop as keyof Stripe];
  },
});

export async function getOrCreateCustomerId(
  userId: string,
  email?: string | null
): Promise<string> {
  const supabase = await createServerClient(cookies());
  const { data: existing, error: selectErr } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (selectErr) throw selectErr;
  if (existing?.stripe_customer_id) return existing.stripe_customer_id;

  const customer = await stripe.customers.create({
    email: email || undefined,
    metadata: { user_id: userId },
  });
  const { error: insertErr } = await supabase
    .from('customers')
    .insert({ user_id: userId, stripe_customer_id: customer.id });
  if (insertErr) throw insertErr;
  return customer.id;
}
