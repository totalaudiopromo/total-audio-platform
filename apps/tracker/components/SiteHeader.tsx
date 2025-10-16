'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { AuthButton } from './AuthButton';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolMenuOpen, setToolMenuOpen] = useState(false);

  const tools = [
    { name: 'Audio Intel', href: 'https://audio-intel.totalaudiopromo.com', color: 'blue' },
    { name: 'Playlist Pulse', href: 'https://playlist-pulse.totalaudiopromo.com', color: 'green' },
    { name: 'Tracker', href: 'https://tracker.totalaudiopromo.com', color: 'teal', active: true },
    { name: 'Pitch Generator', href: 'https://pitch.totalaudiopromo.com', color: 'purple' },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
              <h1 className="text-lg font-black text-black">
                Tracker
              </h1>
              <p className="text-xs text-gray-500 font-bold -mt-1">by Total Audio Promo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all hover:after:w-full"
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-teal-400 bg-teal-50 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors"
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
                          ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button */}
            <div className="hidden sm:block">
              <AuthButton variant="desktop" />
            </div>

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
                className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
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

            {/* Mobile Auth Button */}
            <AuthButton variant="mobile" />
          </nav>
        )}
      </div>
    </header>
  );
}
