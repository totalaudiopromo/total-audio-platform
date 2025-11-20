'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import MobileLayout from './MobileLayout';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { CookieConsent } from '@/components/CookieConsent';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Demo page has its own custom header and footer, so exclude it from the global header/footer
  const isDemoPage = pathname === '/demo';

  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col bg-white">
        {!isDemoPage && <SiteHeader />}
        <main
          className={isDemoPage ? 'flex-1' : 'flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16'}
        >
          {children}
        </main>
        {!isDemoPage && <SiteFooter />}
        <ExitIntentPopup />
        <CookieConsent />
      </div>
    </MobileLayout>
  );
}
