'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/success', label: 'Success Page' },
  { href: '/profile', label: 'Profile', requiresAuth: true },
  { href: '/settings', label: 'Settings', requiresAuth: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignIn = () => signIn(undefined, { callbackUrl: '/profile' });
  const handleSignOut = () => signOut({ callbackUrl: '/' });

  const availableLinks = links.filter(link => !link.requiresAuth || session);

  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-8 lg:px-0">
      <div className="glass-panel flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full border border-white/15 p-2 text-white/70 transition hover:border-white/40 hover:text-white sm:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-white/60">Total Audio Promo</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
              TAP Studio
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {availableLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <div className="h-8 w-16 animate-pulse rounded-full bg-white/10" />
          ) : session ? (
            <>
              <span className="hidden text-sm font-medium text-white/60 sm:inline">{session.user?.name ?? session.user?.email}</span>
              <button onClick={handleSignOut} className="subtle-button">Sign out</button>
            </>
          ) : (
            <button onClick={handleSignIn} className="cta-button">Sign in</button>
          )}
        </div>
      </div>

      {mobileOpen && (
        <nav className="glass-panel mt-3 flex flex-col gap-1 p-3 sm:hidden">
          {availableLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
