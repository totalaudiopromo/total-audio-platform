import { NextResponse } from 'next/server';
import { stripe, getOrCreateCustomerId } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { priceId, success_url, cancel_url } = await request.json();
    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const customerId = await getOrCreateCustomerId(user.id, user.email);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create checkout session' }, { status: 500 });
  }
}












