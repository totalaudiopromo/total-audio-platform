'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ToolSwitcher } from './ToolSwitcher';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
  { href: '/pitch/history', label: 'History', requiresAuth: true },
  { href: '/pitch/contacts', label: 'Contacts', requiresAuth: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignIn = () => signIn(undefined, { callbackUrl: '/dashboard' });
  const handleSignOut = () => signOut({ callbackUrl: '/' });

  const availableLinks = links.filter(link => !link.requiresAuth || session);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-lg border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-black">Pitch Generator</span>
              <span className="text-xs text-gray-500">by Total Audio Promo</span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {availableLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ToolSwitcher />
          </div>
          {status === 'loading' ? (
            <div className="h-8 w-16 animate-pulse rounded-full bg-white/10" />
          ) : session ? (
            <>
              <span className="hidden text-sm font-medium text-gray-700 sm:inline">{session.user?.name ?? session.user?.email}</span>
              <button onClick={handleSignOut} className="subtle-button text-xs">Sign out</button>
            </>
          ) : (
            <button onClick={handleSignIn} className="cta-button">Sign in</button>
          )}
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-b-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:hidden">
          <div className="flex flex-col gap-2">
            {availableLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
