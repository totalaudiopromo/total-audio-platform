'use client';

import React from 'react';
import { ConditionalTrackerLayout } from '@/components/ConditionalTrackerLayout';
import {
  ExitIntentPopup,
  CookieConsent,
} from '@/components/ClientOnlyComponents';
import { WorkspaceProvider } from '@total-audio/core-db/contexts/workspace-context';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <ConditionalTrackerLayout>{children}</ConditionalTrackerLayout>
        <ExitIntentPopup />
        <CookieConsent />
      </div>
    </WorkspaceProvider>
  );
}
