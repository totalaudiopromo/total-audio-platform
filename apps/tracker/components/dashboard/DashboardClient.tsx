'use client';

import { useState } from 'react';
import { CampaignModal } from '@/components/campaigns/CampaignModal';

interface DashboardClientProps {
  children: React.ReactNode;
}

export function DashboardClient({ children }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={e => {
          const target = e.target as HTMLElement;
          if (
            target.id === 'new-campaign-trigger' ||
            target.closest('#new-campaign-trigger')
          ) {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        {children}
      </div>

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
