'use client';

import { useState } from 'react';
import { CampaignModal } from './CampaignModal';

export function AddCampaignButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-700 shadow-lg transition-all"
      >
        + New Campaign
      </button>
      <CampaignModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
