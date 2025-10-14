'use client';

import dynamic from 'next/dynamic';

// Client-only components with SSR disabled
export const ExitIntentPopup = dynamic(
  () => import('@/components/ExitIntentPopup').then(mod => ({ default: mod.ExitIntentPopup })),
  { ssr: false }
);

export const CookieBanner = dynamic(
  () => import('@/components/CookieBanner').then(mod => ({ default: mod.CookieBanner })),
  { ssr: false }
);
