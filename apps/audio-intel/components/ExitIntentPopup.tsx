'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Check } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [engagementTime, setEngagementTime] = useState(0);

  useEffect(() => {
    // Check if user has already signed up (client-side only)
    const hasSignedUp =
      typeof window !== 'undefined' ? sessionStorage.getItem('userSignedUp') : null;
    const hasSeenPopup =
      typeof window !== 'undefined' ? sessionStorage.getItem('exitIntentShown') : null;

    if (hasSeenPopup || hasSignedUp) {
      setHasShown(true);
      return;
    }

    // Track engagement time
    const engagementTimer = setInterval(() => {
      setEngagementTime(prev => prev + 1);
    }, 1000);

    // Detect mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Don't show exit intent on mobile (doesn't work well)
    if (isMobile) {
      setHasShown(true);
      clearInterval(engagementTimer);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only show if:
      // 1. Mouse leaving from top (not sides/bottom)
      // 2. User has been engaged for at least 30 seconds
      // 3. Haven't shown before
      if (e.clientY <= 0 && !hasShown && engagementTime >= 30) {
        setIsVisible(true);
        setHasShown(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }
    };

    // ESC key handler
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleEscKey);
      clearInterval(engagementTimer);
    };
  }, [hasShown, engagementTime, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={handleClose}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleClose();
        }}
        aria-label="Close popup overlay"
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-4 border-black shadow-brutal relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 text-gray-900 font-black" />
          </button>

          <div className="px-8 py-10 sm:px-12 sm:py-14">
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-4 border-blue-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                Try 10 Free Contact Enrichments
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              Stop Researching Contacts Manually
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">10 free enrichments/month</span> - No credit card
                  required
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">100% success rate</span> - Proven with BBC Radio 1,
                  Spotify contacts
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">15 hours → 15 minutes</span> - Per campaign contact
                  research time saved
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/beta"
                onClick={handleClose}
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-black hover:bg-blue-700 transition-all text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                Try 10 Free Enrichments Now
              </Link>
              <button
                onClick={handleClose}
                className="bg-white text-gray-900 border-2 border-black px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                No thanks, I'll keep using Excel
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-700 font-bold text-center">
              Join UK radio promoters saving 15+ hours per campaign
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
