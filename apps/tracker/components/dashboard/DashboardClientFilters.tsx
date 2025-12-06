'use client';

import { useState } from 'react';
import type { Campaign } from '@/lib/types/tracker';
import { ClientFilterBar } from '@/components/campaigns/ClientFilterBar';
import { AICommandBar } from '@/components/campaigns/AICommandBar';
import { BulkCampaignList } from '@/components/campaigns/BulkCampaignList';

interface DashboardClientFiltersProps {
  initialCampaigns: Campaign[];
  integrations: any[];
}

type CommandResult = {
  type: 'filter' | 'create' | 'search' | 'export' | 'report';
  data: any;
  message: string;
};

export function DashboardClientFilters({
  initialCampaigns,
  integrations,
}: DashboardClientFiltersProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [commandMessage, setCommandMessage] = useState<string | null>(null);

  const handleFilterChange = (filteredCampaigns: Campaign[]) => {
    setCampaigns(filteredCampaigns);
  };

  const handleClientSelect = (clientName: string | null) => {
    setSelectedClient(clientName);
  };

  const handleCommand = (result: CommandResult) => {
    setCommandMessage(result.message);

    // Execute command based on type
    switch (result.type) {
      case 'filter':
        if (result.data.client_name) {
          const filtered = initialCampaigns.filter(
            c => c.client_name === result.data.client_name
          );
          setCampaigns(filtered);
          setSelectedClient(result.data.client_name);
        }
        if (result.data.platform) {
          const filtered = initialCampaigns.filter(
            c => c.platform === result.data.platform
          );
          setCampaigns(filtered);
        }
        if (result.data.status) {
          const filtered = initialCampaigns.filter(
            c => c.status === result.data.status
          );
          setCampaigns(filtered);
        }
        break;

      case 'create':
        // Open campaign creation modal with pre-filled client
        document.getElementById('new-campaign-trigger')?.click();
        break;

      case 'export':
        // Trigger export functionality
        console.log('Export:', result.data);
        break;

      case 'report':
        // Generate report
        console.log('Report:', result.data);
        break;

      case 'search':
        // Perform search
        const searchFiltered = initialCampaigns.filter(
          c =>
            (c.name || '')
              .toLowerCase()
              .includes(result.data.query.toLowerCase()) ||
            c.artist_name
              ?.toLowerCase()
              .includes(result.data.query.toLowerCase()) ||
            c.client_name
              ?.toLowerCase()
              .includes(result.data.query.toLowerCase())
        );
        setCampaigns(searchFiltered);
        break;
    }

    // Clear message after 5 seconds
    setTimeout(() => setCommandMessage(null), 5000);
  };

  return (
    <>
      {/* AI Command Success Message */}
      {commandMessage && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-brutal">
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="font-bold text-green-900">{commandMessage}</p>
        </div>
      )}

      {/* AI Command Bar (Airtable-style) */}
      <div className="mb-6 flex items-center gap-3">
        <AICommandBar campaigns={initialCampaigns} onCommand={handleCommand} />
        <p className="text-sm font-medium text-gray-600 hidden md:block">
          or use filters below for quick access
        </p>
      </div>

      {/* Client Filter Bar (Excel-style) */}
      <ClientFilterBar
        campaigns={initialCampaigns}
        onFilterChange={handleFilterChange}
        onClientSelect={handleClientSelect}
      />

      {/* Campaign List */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              {selectedClient
                ? `${selectedClient} Campaigns`
                : 'Your Campaigns'}
            </h2>
            <p className="text-sm font-bold text-gray-600">
              {campaigns.length === initialCampaigns.length
                ? 'Showing all campaigns'
                : `Showing ${campaigns.length} of ${initialCampaigns.length} campaigns`}
            </p>
          </div>
        </div>

        <BulkCampaignList campaigns={campaigns} integrations={integrations} />
      </div>
    </>
  );
}
