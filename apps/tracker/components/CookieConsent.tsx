'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented (with SSR safety check)
    const hasConsented =
      typeof window !== 'undefined'
        ? localStorage.getItem('cookieConsent')
        : null;
    if (!hasConsented) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'declined');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }
    setIsVisible(false);
    // Disable analytics if user declines
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="bg-white rounded-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center border-2 border-black">
              <Cookie className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
                We use essential cookies for authentication and analytics to
                understand usage. No tracking or data selling.{' '}
                <Link
                  href="/privacy"
                  className="text-teal-600 hover:underline whitespace-nowrap"
                >
                  Learn more
                </Link>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAccept}
                  className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-black text-xs hover:bg-teal-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 border-2 border-black"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-1.5 bg-white text-gray-700 rounded-lg font-bold text-xs border-2 border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  Essential Only
                </button>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="flex-shrink-0 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-300"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
