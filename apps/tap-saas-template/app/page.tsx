import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>TAP SaaS Template</h1>
      <p style={{ marginTop: 12 }}>Starter shell with auth-ready layout, Stripe checkout route, and dashboard placeholders.</p>
      <ul style={{ marginTop: 16 }}>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href="/settings">Settings</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </main>
  );
}


