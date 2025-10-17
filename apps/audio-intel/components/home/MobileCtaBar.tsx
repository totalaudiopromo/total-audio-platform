'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Mobile Sticky CTA Bar - Thumb Zone Optimization
 *
 * Appears after user scrolls past hero section on mobile
 * Stays in natural thumb rest area (bottom of viewport)
 * Dismissible to avoid annoyance
 */
export function MobileCtaBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (past hero section)
      const scrolled = window.scrollY > 400;
      setIsVisible(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-black p-4 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3">
        <Link
          href="/pricing?plan=professional&billing=monthly"
          className="flex-1 cta-button text-center"
        >
          Get my free trial →
        </Link>
        <button
          onClick={() => setIsDismissed(true)}
          className="subtle-button px-4 flex-shrink-0"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
