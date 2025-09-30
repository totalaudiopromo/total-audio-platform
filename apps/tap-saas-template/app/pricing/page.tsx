"use client";
import { useState } from 'react';

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [tier, setTier] = useState<'professional' | 'agency'>('professional');
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (e: any) {
      alert(e?.message || 'Checkout error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Pricing</h1>
      <div style={{ marginTop: 16 }}>
        <label>
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setBilling('monthly')} disabled={billing==='monthly'}>Monthly</button>
        <button onClick={() => setBilling('annual')} disabled={billing==='annual'} style={{ marginLeft: 8 }}>Annual</button>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setTier('professional')} disabled={tier==='professional'}>Professional</button>
        <button onClick={() => setTier('agency')} disabled={tier==='agency'} style={{ marginLeft: 8 }}>Agency</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={checkout} disabled={loading || !email}>
          {loading ? 'Redirecting...' : 'Proceed to Checkout'}
        </button>
      </div>
    </main>
  );
}


