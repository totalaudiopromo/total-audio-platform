'use client';

import { useState, useMemo } from 'react';
import type { Campaign } from '@/lib/types';

interface ClientFilterBarProps {
  campaigns: Campaign[];
  onFilterChange: (filteredCampaigns: Campaign[]) => void;
  onClientSelect: (clientName: string | null) => void;
}

export function ClientFilterBar({ campaigns, onFilterChange, onClientSelect }: ClientFilterBarProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique clients from campaigns (Excel-style unique values)
  const clients = useMemo(() => {
    const clientMap = new Map<string, {
      name: string;
      campaignCount: number;
      activeCampaigns: number;
      totalBudget: number;
    }>();

    campaigns.forEach((campaign) => {
      const clientName = campaign.client_name || 'No Client';
      const existing = clientMap.get(clientName);

      if (existing) {
        existing.campaignCount++;
        existing.activeCampaigns += campaign.status === 'active' ? 1 : 0;
        existing.totalBudget += campaign.budget || 0;
      } else {
        clientMap.set(clientName, {
          name: clientName,
          campaignCount: 1,
          activeCampaigns: campaign.status === 'active' ? 1 : 0,
          totalBudget: campaign.budget || 0,
        });
      }
    });

    return Array.from(clientMap.values()).sort((a, b) => b.campaignCount - a.campaignCount);
  }, [campaigns]);

  // Filter campaigns based on selection (Excel-style filter)
  const handleClientSelect = (clientName: string | null) => {
    setSelectedClient(clientName);
    onClientSelect(clientName);

    if (!clientName) {
      onFilterChange(campaigns);
    } else {
      const filtered = campaigns.filter((c) =>
        clientName === 'No Client'
          ? !c.client_name
          : c.client_name === clientName
      );
      onFilterChange(filtered);
    }
  };

  // Search filter (Excel-style find)
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4 mb-6">
      {/* Excel-style filter header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-lg font-black text-gray-900">Filter by Client</h3>
        </div>

        {selectedClient && (
          <button
            onClick={() => handleClientSelect(null)}
            className="px-3 py-1 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Excel-style search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:border-teal-500 focus:outline-none"
        />
      </div>

      {/* Excel-style client list with stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
        {/* "Show All" option (like Excel's "Select All") */}
        <button
          onClick={() => handleClientSelect(null)}
          className={`p-3 rounded-lg border-2 text-left transition-all ${
            !selectedClient
              ? 'border-teal-600 bg-teal-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-black text-gray-900">All Clients</span>
            {!selectedClient && (
              <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="text-xs font-bold text-gray-600">
            {campaigns.length} campaigns
          </div>
        </button>

        {filteredClients.map((client) => (
          <button
            key={client.name}
            onClick={() => handleClientSelect(client.name)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              selectedClient === client.name
                ? 'border-teal-600 bg-teal-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-gray-900 truncate" title={client.name}>
                {client.name}
              </span>
              {selectedClient === client.name && (
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-xs font-bold text-gray-600">
              {client.campaignCount} campaigns ({client.activeCampaigns} active)
            </div>
            <div className="text-xs font-bold text-teal-600 mt-1">
              £{Math.round(client.totalBudget)} budget
            </div>
          </button>
        ))}
      </div>

      {/* Excel-style summary row (like status bar) */}
      {selectedClient && (
        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-black text-gray-700">
              Showing: {selectedClient}
            </span>
            <span className="font-bold text-gray-600">
              {campaigns.filter((c) =>
                selectedClient === 'No Client' ? !c.client_name : c.client_name === selectedClient
              ).length} of {campaigns.length} campaigns
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
