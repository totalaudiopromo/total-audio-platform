'use client'

import React from 'react';
import { SiteHeader } from './SiteHeader';
import MobileLayout from './MobileLayout';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileLayout>
      <SiteHeader />
      {children}
      <ExitIntentPopup />
    </MobileLayout>
  );
} 