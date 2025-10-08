'use client'

import React from 'react';
import { SiteHeader } from './SiteHeader';
import MobileLayout from './MobileLayout';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1 px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">{children}</main>
        <ExitIntentPopup />
      </div>
    </MobileLayout>
  );
} 