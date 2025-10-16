'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    // Enable Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center border-2 border-black">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900">Cookie & Privacy Notice</h3>
              </div>

              <p className="text-sm font-bold text-gray-700 leading-relaxed mb-4">
                We use essential cookies to keep you signed in and analytics cookies to understand how you use Audio Intel.
                We don't sell your data or use intrusive tracking. You can change your preferences anytime in settings.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-2.5 bg-white text-gray-900 rounded-xl font-bold border-2 border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm"
                >
                  Essential Only
                </button>
                <Link
                  href="/privacy"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            <button
              onClick={handleDecline}
              className="flex-shrink-0 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-300"
              aria-label="Close cookie notice"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

