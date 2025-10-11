import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

export async function getOrCreateCustomerId(userId: string, email?: string | null): Promise<string> {
  const supabase = await createClient();
  const { data: existing, error: selectErr } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (selectErr) throw selectErr;
  if (existing?.stripe_customer_id) return existing.stripe_customer_id;

  const customer = await stripe.customers.create({ email: email || undefined, metadata: { user_id: userId } });
  const { error: insertErr } = await supabase
    .from('customers')
    .insert({ user_id: userId, stripe_customer_id: customer.id });
  if (insertErr) throw insertErr;
  return customer.id;
}







