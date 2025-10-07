'use client'

import React from 'react';
import MobileNav from './MobileNav';
import MobileLayout from './MobileLayout';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileLayout>
      <MobileNav />
      <div className="pt-16 md:pt-0">
        {children}
      </div>
      <ExitIntentPopup />
    </MobileLayout>
  );
} 