'use client';

import { useState } from 'react';
import { CampaignModal } from './CampaignModal';

export function AddCampaignButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 shadow-lg transition-all"
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
