'use client';

import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or dismissed cookies
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
        setIsLoaded(true);
      }, 1500);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  // Don't render anything until loaded to prevent flash
  if (!isLoaded || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] animate-in fade-in duration-300" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
          <div className="glass-panel border-4 border-black shadow-brutal bg-white">
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              {/* Icon and Text */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 rounded-xl bg-amber-100 p-3 border-2 border-black">
                  <Cookie className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-gray-900 mb-1">
                    We respect your privacy
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    We use <strong>Plausible Analytics</strong>, a privacy-friendly analytics tool that doesn't use cookies or track you across the web.
                    We only store essential cookies for authentication and preferences.
                    <a
                      href="/privacy"
                      className="ml-1 text-amber-600 hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition border-2 border-gray-300 bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-xl px-6 py-2 text-sm font-black text-white bg-amber-600 hover:bg-amber-700 transition border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  Accept
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleDecline}
              className="absolute top-3 right-3 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Dismiss cookie banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
