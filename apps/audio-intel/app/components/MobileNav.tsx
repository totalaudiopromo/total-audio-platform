'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ToolSwitcher } from '@/components/shared/ToolSwitcher';

const navLinks = [
  { href: 'features', label: 'Features' },
  { href: '/blog', label: 'Blog', isRoute: true },
  { href: 'pricing', label: 'Pricing' },
  { href: 'demo', label: 'Live Demo' },
  { href: 'signup', label: 'Start Free Trial' },
];

// Smooth scroll helper with offset for fixed nav
function scrollToSection(id: string) {
  const yOffset = -72; // Offset for fixed nav (adjust as needed)
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-hide header on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up, hide when scrolling down
      // Always show at top of page
      if (currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Prevent background scroll when menu is open
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

  // Close on link click
  const handleNavClick = (id: string, isRoute?: boolean) => {
    if (id === 'signup') {
      // Special handling for beta signup
      window.location.href = '/beta';
    } else if (!isRoute) {
      scrollToSection(id);
    }
    setOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/images/total_audio_promo_logo_trans.png"
            alt="Total Audio Promo Mascot"
            width={36}
            height={36}
            className="w-9 h-9 flex-shrink-0"
            priority
          />
          <span className="font-black text-gray-900 text-lg tracking-tight whitespace-nowrap">
            Audio Intel
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ToolSwitcher currentTool="Audio Intel" accentColor="blue" />
          </div>
          <button
            aria-label="Open menu"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center justify-center border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(false);
            }
          }}
        />
      )}

      {/* Slide-in menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[min(200px,75vw)] bg-white border-l-4 border-black shadow-[-8px_0_16px_rgba(0,0,0,0.2)] z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ willChange: 'transform' }}
        aria-modal={open}
        role="dialog"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b-4 border-black bg-gradient-to-r from-blue-50 to-white">
          <span className="font-black text-xl text-gray-900 tracking-tight">Menu</span>
          <button
            aria-label="Close menu"
            className="text-white bg-red-500 hover:bg-red-600 focus:outline-none flex items-center justify-center border-2 border-black rounded-xl p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-black"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-4 py-6 flex-1 overflow-y-auto">
          {navLinks.slice(0, 4).map(link =>
            link.isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                className="py-4 px-4 rounded-xl text-base font-bold hover:bg-blue-50 transition-all duration-200 text-left w-full focus:outline-none text-gray-900 min-h-[56px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 flex items-center"
                style={{ minHeight: 56 }}
                onClick={() => setOpen(false)}
                aria-label={link.label}
              >
                <span className="block w-full">{link.label}</span>
              </Link>
            ) : (
              <button
                key={link.href}
                className="py-4 px-4 rounded-xl text-base font-bold hover:bg-blue-50 transition-all duration-200 text-left w-full focus:outline-none text-gray-900 min-h-[56px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 flex items-center"
                style={{ minHeight: 56 }}
                onClick={() => handleNavClick(link.href, link.isRoute)}
                aria-label={link.label}
              >
                <span className="block w-full">{link.label}</span>
              </button>
            )
          )}
        </div>

        <div className="px-4 pb-6 border-t-2 border-black pt-4 bg-gradient-to-r from-green-50 to-white">
          <button
            className="flex items-center justify-center w-full text-center py-4 rounded-xl font-black text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200 focus:outline-none min-h-[56px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ minHeight: 56 }}
            onClick={() => handleNavClick('signup')}
            aria-label="Start Free Trial"
          >
            <span>Start Free Beta</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
