'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/upload', label: 'Dashboard' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-xl">
              Audio Intel
            </h1>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(link => {
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
          <Link href="/beta" className="cta-button">Sign in</Link>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-b-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:hidden">
          <div className="flex flex-col gap-3">
            {/* Tool Switcher on Mobile */}
            <div className="border-b border-gray-200 pb-3">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Switch Tool</p>
              <ToolSwitcher />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2">
              {links.map(link => {
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
          </div>
        </nav>
      )}
    </header>
  );
}
