'use client';

import React from 'react';
import PortalHeader from './PortalHeader';
import PortalNav from './PortalNav';
import Loading from '@/components/Loading';
import type { PortalArtist } from '@/lib/api/portal';

interface PortalLayoutProps {
  children: React.ReactNode;
  artist: PortalArtist | null;
  artistSlug: string;
  currentCampaign?: string;
  loading?: boolean;
  loadingMessage?: string;
}

/**
 * Shared layout wrapper for all Artist Portal pages
 * Ensures consistent Liberty brand styling across the portal
 */
const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  artist,
  artistSlug,
  currentCampaign,
  loading = false,
  loadingMessage = 'Loading...',
}) => {
  if (loading || !artist) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <Loading message={loadingMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <PortalHeader artist={artist} currentCampaign={currentCampaign} />
      <PortalNav artistSlug={artistSlug} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default PortalLayout;
