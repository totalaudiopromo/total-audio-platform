'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show on dashboard, signup, or login pages
    if (
      pathname.startsWith('/dashboard') ||
      pathname === '/signup' ||
      pathname === '/login'
    ) {
      return;
    }

    const hasSeenPopup = sessionStorage.getItem('exitIntentShown');
    const lastShown = sessionStorage.getItem('exitIntentLastShown');
    const now = Date.now();

    // Reset if more than 24 hours since last shown
    if (lastShown && now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem('exitIntentShown');
      sessionStorage.removeItem('exitIntentLastShown');
    }

    if (
      hasSeenPopup &&
      lastShown &&
      now - parseInt(lastShown) < 24 * 60 * 60 * 1000
    ) {
      setHasShown(true);
      return;
    }

    // Desktop: mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        showPopup();
      }
    };

    // Mobile: time-based trigger (30 seconds idle)
    let idleTimer: NodeJS.Timeout;
    const handleActivity = () => {
      clearTimeout(idleTimer);
      if (!hasShown) {
        idleTimer = setTimeout(() => {
          if (!hasShown) showPopup();
        }, 30000); // 30 seconds
      }
    };

    const showPopup = () => {
      setIsVisible(true);
      setHasShown(true);
      sessionStorage.setItem('exitIntentShown', 'true');
      sessionStorage.setItem('exitIntentLastShown', Date.now().toString());

      // Track event in GTM
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'exit_intent_popup_shown',
          page_path: pathname,
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('touchstart', handleActivity);

    // Initial idle timer for mobile
    if (!hasShown) {
      idleTimer = setTimeout(() => {
        if (!hasShown) showPopup();
      }, 30000);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      clearTimeout(idleTimer);
    };
  }, [hasShown, pathname]);

  const handleClose = () => {
    setIsVisible(false);

    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'exit_intent_popup_dismissed',
        page_path: pathname,
      });
    }
  };

  const handleCTAClick = () => {
    // Track conversion
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'exit_intent_popup_converted',
        page_path: pathname,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border-4 border-black shadow-brutal relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 text-gray-900 font-black" />
          </button>

          <div className="px-8 py-10 sm:px-12 sm:py-14">
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-4 border-teal-600 bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-teal-600">
                Wait! Try Free Campaign Tracking
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              Track Your Campaigns Free Before You Go
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">Free forever</span> - Track
                  unlimited campaigns, no credit card required
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">AI insights</span> - See which
                  contacts respond (14-18% BBC Radio 1 benchmarks)
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-xl p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-md border-2 border-black flex items-center justify-center">
                  <span className="text-white text-sm font-black">✓</span>
                </div>
                <p className="text-gray-900 font-bold">
                  <span className="font-black">Real benchmarks</span> - Compare
                  your response rates to industry standards
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                onClick={() => {
                  handleCTAClick();
                  handleClose();
                }}
                className="flex-1 bg-teal-600 text-white px-8 py-4 rounded-xl font-black hover:bg-teal-700 transition-all text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                Start Free Tracking Now
              </Link>
              <button
                onClick={handleClose}
                className="bg-white text-gray-900 border-2 border-black px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                No thanks, I'll keep guessing
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-700 font-bold text-center">
              Join radio promoters tracking 500+ campaigns with proven
              benchmarks
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
