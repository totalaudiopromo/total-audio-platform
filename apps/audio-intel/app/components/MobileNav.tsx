"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: 'features', label: 'Features' },
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
  const menuRef = useRef<HTMLDivElement>(null);

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
  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 md:hidden" aria-label="Mobile Navigation">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/total_audio_promo_logo_trans.png" alt="Total Audio Promo Mascot" width={40} height={40} className="w-10 h-10" priority />
          <span className="font-bold text-gray-900 text-lg">Audio Intel</span>
        </Link>
        <button
          aria-label="Open menu"
          className="text-gray-700 focus:outline-none flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg p-2 hover:bg-gray-200 transition-colors"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
          aria-hidden 
          onClick={() => setOpen(false)} 
        />
      )}
      
      {/* Slide-in menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white border-l border-gray-200 text-gray-900 shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col overflow-hidden`}
        style={{ willChange: 'transform' }}
        aria-modal={open}
        role="dialog"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <span className="font-bold text-lg">Menu</span>
          <button
            aria-label="Close menu"
            className="text-gray-700 focus:outline-none flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg p-2 hover:bg-gray-200 transition-colors"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col gap-3 px-4 py-6 flex-1 overflow-y-auto">
          {navLinks.slice(0, 3).map(link => (
            <button
              key={link.href}
              className="py-4 px-4 rounded-xl text-base font-semibold hover:bg-gray-100 transition-all duration-300 text-left w-full focus:outline-none text-gray-900 min-h-[56px] bg-gray-50 border border-gray-200 flex items-center"
              style={{ minHeight: 56, wordWrap: 'break-word', whiteSpace: 'normal' }}
              onClick={() => handleNavClick(link.href)}
              aria-label={link.label}
            >
              <span className="block w-full">{link.label}</span>
            </button>
          ))}
        </div>
        
        <div className="px-4 pb-6">
          <button
            className="flex items-center justify-center w-full text-center py-4 rounded-xl font-bold text-white bg-[#1E88E5] hover:bg-blue-600 transition-all duration-300 focus:outline-none min-h-[56px]"
            style={{ minHeight: 56 }}
            onClick={() => handleNavClick('signup')}
            aria-label="Start Free Trial"
          >
            <span>Start Free Trial</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 