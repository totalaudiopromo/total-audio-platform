import { NextResponse } from 'next/server';
import { stripe, getOrCreateCustomerId } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    const customerId = await getOrCreateCustomerId(user.id, user.email);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create portal session' }, { status: 500 });
  }
}












