'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolMenuOpen, setToolMenuOpen] = useState(false);

  const tools = [
    { name: 'Audio Intel', href: 'https://audio-intel.totalaudiopromo.com', color: 'blue' },
    { name: 'Playlist Pulse', href: 'https://playlist-pulse.totalaudiopromo.com', color: 'green' },
    { name: 'Tracker', href: 'https://tracker.totalaudiopromo.com', color: 'amber', active: true },
    { name: 'Pitch Generator', href: 'https://pitch.totalaudiopromo.com', color: 'purple' },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/total_audio_promo_logo_trans.png"
              alt="Total Audio Promo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Tracker
              </h1>
              <p className="text-xs text-amber-600 font-bold -mt-1">by Total Audio Promo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-600 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Tool Switcher & Auth */}
          <div className="flex items-center gap-4">
            {/* Tool Switcher */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setToolMenuOpen(!toolMenuOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-amber-400 bg-amber-50 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                More Tools
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {toolMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-brutal border-2 border-black z-10 overflow-hidden">
                  {tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.href}
                      className={`block px-4 py-3 text-sm font-bold transition-all ${
                        tool.active
                          ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border-2 border-black bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Sign In
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t-2 border-black bg-white py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Tool Switcher */}
            <div className="px-4 py-2 pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 mb-2">Other Tools</p>
              {tools.filter(t => !t.active).map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tool.name}
                </a>
              ))}
            </div>

            {/* Mobile Sign In */}
            <div className="px-4 pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="block text-center rounded-lg border-2 border-black bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
