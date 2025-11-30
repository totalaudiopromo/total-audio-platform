'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup permanently (only on client-side)
    const hasDismissedPermanently =
      typeof window !== 'undefined' ? localStorage.getItem('exitIntentDismissed') : null;
    if (hasDismissedPermanently === 'true') {
      setHasShown(true);
      setIsInitialized(true);
      return;
    }

    // Check if user has already seen the popup in this session (client-side only)
    const hasSeenPopup =
      typeof window !== 'undefined' ? sessionStorage.getItem('exitIntentShown') : null;
    if (hasSeenPopup === 'true') {
      setHasShown(true);
      setIsInitialized(true);
      return;
    }

    setIsInitialized(true);

    // Only show popup after user has been on page for 30 seconds
    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger if mouse is leaving from the top of the page (to address bar/tabs)
        if (e.clientY <= 0 && !hasShown && isInitialized) {
          setIsVisible(true);
          setHasShown(true);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('exitIntentShown', 'true');
          }
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, 30000); // 30 second delay

    return () => clearTimeout(timer);
  }, [hasShown, isInitialized]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDismissPermanently = () => {
    setIsVisible(false);
    setHasShown(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('exitIntentDismissed', 'true');
      sessionStorage.setItem('exitIntentShown', 'true');
    }
  };

  // Don't render anything if user has permanently dismissed or already seen the popup
  if (!isInitialized || hasShown || !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-2xl border-4 border-black shadow-brutal relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 text-gray-900 font-black" />
          </button>

          <div className="px-8 py-10 sm:px-12 sm:py-14">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-4 border-amber-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-amber-600">
                Wait! Before You Go...
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              Try 5 Free Pitches Before You Leave
            </h2>

            {/* Value props */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">No credit card required</span> - Start generating
                  pitches immediately
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">BBC Radio 1 templates</span> - 14-18% response rates
                  vs 2% generic pitches
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">5 pitches/month forever free</span> - Test with real
                  contacts
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signin"
                onClick={handleClose}
                className="flex-1 bg-amber-600 text-white px-8 py-4 rounded-xl font-black hover:bg-amber-700 transition-all text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                Start Free Trial (5 pitches)
              </Link>
              <button
                onClick={handleDismissPermanently}
                className="bg-white text-gray-900 border-2 border-black px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                No thanks
              </button>
            </div>

            {/* Social proof */}
            <p className="mt-6 text-sm text-gray-700 font-bold text-center">
              Join 100+ radio promoters and artists saving 15 hours per campaign
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
