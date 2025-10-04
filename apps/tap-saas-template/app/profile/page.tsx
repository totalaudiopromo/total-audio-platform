"use client";

import { signIn, signOut, useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-panel px-6 py-12 text-center text-gray-900/70">Loading your workspace…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="glass-panel px-6 py-12 text-center">
          <h1 className="text-3xl font-semibold">Sign in to access profile details</h1>
          <p className="mt-3 text-sm text-gray-900/70">
            The profile section is protected by NextAuth. Use the demo credentials or an OAuth provider to sign in and explore the authenticated dashboard shell.
          </p>
          <div className="mt-6 flex justify-center">
            <button onClick={() => signIn()} className="cta-button">Continue to sign in</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="glass-panel px-6 py-8">
        <span className="badge-postcraft">Signed in</span>
        <h1 className="mt-6 text-3xl font-semibold">Founder workspace</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          This area is intentionally lightweight so you can inject tool-specific modules. The layout, typography, and guard logic are provided—you decide what data or insights belong here.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel px-6 py-8">
          <h2 className="text-xl font-semibold">Account</h2>
          <dl className="mt-4 space-y-3 text-sm text-gray-900/70">
            <div>
              <dt className="font-medium uppercase tracking-[0.35em] text-gray-900/40">Name</dt>
              <dd className="mt-1 text-gray-900">{session.user?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-medium uppercase tracking-[0.35em] text-gray-900/40">Email</dt>
              <dd className="mt-1 text-gray-900">{session.user?.email ?? '—'}</dd>
            </div>
          </dl>
        </div>
        <div className="glass-panel px-6 py-8">
          <h2 className="text-xl font-semibold">Next steps</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-900/70">
            <li className="rounded-2xl bg-gray-50 px-4 py-3">Replace this copy with your tool’s onboarding checklist.</li>
            <li className="rounded-2xl bg-gray-50 px-4 py-3">Drop cards, charts, or tables here with your product data.</li>
            <li className="rounded-2xl bg-gray-50 px-4 py-3">Hook into your API routes using the authenticated session.</li>
          </ul>
        </div>
      </section>

      <div className="glass-panel flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-900/40">Session details</p>
          <p className="mt-1 text-xs text-gray-900/60">Token strategy: JWT · Provider: {session.user?.name ? 'OAuth / credentials hybrid' : 'Credentials'}</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="subtle-button">
          Sign out
        </button>
      </div>
    </div>
  );
}
