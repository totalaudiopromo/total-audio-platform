'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/campaigns',
    label: 'Campaigns',
    icon: Target,
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="h-16 flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/tracker-icon.svg"
              alt="Tracker"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-black text-lg text-gray-900">Tracker</span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setOpen(o => !o)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-gray-50 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu */}
      <nav
        className={`fixed top-16 right-0 bottom-0 w-72 bg-white border-l-4 border-black z-50 transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Nav Items */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-black min-h-[44px] transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t-2 border-black">
            <Link
              href="/logout"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-black bg-white text-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-50 hover:text-red-600 hover:border-red-600 min-h-[44px] transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="font-bold">Log Out</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
