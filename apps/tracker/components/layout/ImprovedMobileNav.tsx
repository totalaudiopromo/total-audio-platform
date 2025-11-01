'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface MobileNavProps {
  userName?: string;
  onSignOut?: () => void;
}

export function ImprovedMobileNav({ userName, onSignOut }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/integrations', icon: Settings, label: 'Integrations' },
    { href: '/docs', icon: FileText, label: 'Documentation' },
    { href: '/pricing', icon: HelpCircle, label: 'Pricing' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors border-2 border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-900" />
        ) : (
          <Menu className="h-6 w-6 text-gray-900" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-out border-l-4 border-black shadow-brutal-lg ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-4 border-black bg-gradient-to-r from-teal-50 to-blue-50">
            <div>
              <h2 className="text-xl font-black text-gray-900">Menu</h2>
              {userName && (
                <p className="text-sm font-bold text-gray-600 mt-1">
                  {userName}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/50 transition-colors border-2 border-gray-300"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-900" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-base transition-all border-2 ${
                        isActive
                          ? 'bg-teal-600 text-white border-teal-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon
                        className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600'}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t-4 border-black bg-gray-50 space-y-3">
            {/* Sign Out Button */}
            {onSignOut && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSignOut();
                }}
                className="w-full px-4 py-4 bg-red-600 text-white rounded-xl font-black text-base hover:bg-red-700 transition-all border-2 border-red-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            )}

            {/* Legal Links */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-600">
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Privacy
              </Link>
              <span className="text-gray-400">·</span>
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
