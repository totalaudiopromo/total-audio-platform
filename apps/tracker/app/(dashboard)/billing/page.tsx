import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function createCheckout(priceId: string) {
  'use server';
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/billing/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  const json = await res.json();
  if (json.url) return redirect(json.url);
}

async function openPortal() {
  'use server';
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/billing/create-portal-session`, {
    method: 'POST',
  });
  const json = await res.json();
  if (json.url) return redirect(json.url);
}

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const sub = await getSubscription();
  const status = sub?.status || 'none';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Billing</h2>
        <p className="text-slate-600">Fair pricing for independent musicians. Cancel anytime.</p>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-600">Current Plan</div>
            <div className="text-xl font-semibold">{status === 'active' ? 'Pro' : 'Free'}</div>
            <div className="text-sm text-slate-500 mt-1">Status: {status}</div>
          </div>
          <div className="flex gap-3">
            <form action={openPortal}><button className="px-4 py-2 rounded border">Manage Billing</button></form>
            <form action={async () => createCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '')}>
              <button className="px-4 py-2 rounded bg-black text-white">Upgrade to Pro</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}




