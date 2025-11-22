'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

const notifications = [
  {
    id: 'changelog',
    label: 'Product changelog',
    description: 'Receive a weekly digest whenever key modules in this tool template change.',
  },
  {
    id: 'billing',
    label: 'Billing events',
    description: 'Email me when a subscription fails or when a customer upgrades their tier.',
  },
  {
    id: 'research',
    label: 'Research drops',
    description: 'Get notified when new Total Audio Promo playbooks are published.',
  },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass-panel px-6 py-12 text-center text-gray-900/70">Loading settings…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass-panel px-6 py-12 text-center">
          <h1 className="text-3xl font-semibold">Protected settings</h1>
          <p className="mt-3 text-sm text-gray-900/70">
            These controls are reserved for signed-in users. Use the demo credentials or connect an
            OAuth provider to explore the experience.
          </p>
          <div className="mt-6">
            <Link href="/auth/signin" className="cta-button">
              Sign in to continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="glass-panel px-6 py-8">
        <span className="badge-postcraft">Session secured</span>
        <h1 className="mt-6 text-3xl font-semibold">Workspace settings</h1>
        <p className="mt-3 text-sm text-gray-900/70">
          Swap these placeholders with the controls your mini tool needs—billing management, API
          keys, or notification preferences.
        </p>
      </header>

      <section className="glass-panel px-6 py-8">
        <h2 className="text-xl font-semibold">Notification preferences</h2>
        <p className="mt-2 text-sm text-gray-900/60">
          Toggle which Total Audio Promo updates should reach this account.
        </p>
        <div className="mt-6 space-y-4">
          {notifications.map(option => (
            <label
              key={option.id}
              className="flex items-start gap-3 rounded-2xl border border-white/15 bg-gray-50 px-5 py-4 text-sm text-gray-900/70 transition hover:border-white/25"
            >
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-white/25 bg-transparent"
              />
              <span>
                <span className="font-medium text-gray-900">{option.label}</span>
                <span className="mt-1 block text-xs text-gray-900/50">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="glass-panel px-6 py-8">
        <h2 className="text-xl font-semibold">Danger zone</h2>
        <p className="mt-2 text-sm text-gray-900/60">
          Use this area for destructive actions—resetting data, revoking API keys, or deleting
          accounts. Stubs show how to style confirmation panels.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="subtle-button">Pause workspace access</button>
          <button className="inline-flex items-center justify-center rounded-full border border-danger/40 bg-danger/15 px-5 py-2.5 text-sm font-semibold text-danger transition hover:border-danger/60 hover:bg-danger/20">
            Delete workspace
          </button>
        </div>
      </section>
    </div>
  );
}
