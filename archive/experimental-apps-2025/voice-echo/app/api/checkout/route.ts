import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// TODO: Replace with your real Stripe secret key
// @ts-ignore: Stripe types only allow the latest API version, but we want to use a specific version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_live_xxx', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: NextRequest) {
  const { priceId, email } = await req.json();
  if (!priceId || !email) {
    return NextResponse.json({ error: 'Missing priceId or email' }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: priceId, // TODO: Pass the correct priceId for monthly/annual
          quantity: 1,
        },
      ],
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
