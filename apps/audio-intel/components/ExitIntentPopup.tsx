'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('exitIntentShown');
    if (hasSeenPopup) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-2xl border-4 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <div className="px-8 py-10 sm:px-12 sm:py-14">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-purple-600 bg-purple-50 px-4 py-2">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-bold uppercase tracking-wider text-purple-600">Try 10 Free Contact Enrichments</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Stop Researching Contacts Manually
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-700"><strong>10 free enrichments/month</strong> - No credit card required</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-700"><strong>100% success rate</strong> - Proven with BBC Radio 1, Spotify contacts</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-700"><strong>15 hours → 15 minutes</strong> - Per campaign contact research time saved</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                onClick={handleClose}
                className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                Try 10 Free Enrichments →
              </Link>
              <button
                onClick={handleClose}
                className="bg-white text-gray-600 border-2 border-gray-300 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                No thanks, I'll keep using Excel
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Join UK radio promoters saving 15+ hours per campaign
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
