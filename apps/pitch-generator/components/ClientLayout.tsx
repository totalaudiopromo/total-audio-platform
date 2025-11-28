'use client';

import React from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import { WorkspaceProvider } from '@total-audio/core-db/contexts/workspace-context';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { ExitIntentPopup, CookieBanner } from '@/components/ClientOnlyComponents';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <div className="flex min-h-screen flex-col bg-white">
          <ConditionalLayout>{children}</ConditionalLayout>
          <ExitIntentPopup />
          <CookieBanner />
        </div>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
