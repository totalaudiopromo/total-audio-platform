'use client';

import dynamic from 'next/dynamic';

// Client-only components with SSR disabled
export const ExitIntentPopup = dynamic(
  () =>
    import('@/components/ExitIntentPopup').then(mod => ({
      default: mod.ExitIntentPopup,
    })),
  { ssr: false }
);

export const CookieConsent = dynamic(
  () =>
    import('@/components/CookieConsent').then(mod => ({
      default: mod.CookieConsent,
    })),
  { ssr: false }
);
