'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, Download, Settings } from 'lucide-react';
import { LeadGrid, LeadStats, LeadDetailModal } from '@/components/leads';
import type { Lead, LeadStats as LeadStatsType } from '@/lib/leads/types';
import { MOCK_LEADS, getMockLeadStats } from '@/lib/leads/mock-data';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch leads from API
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads?pageSize=50');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
      } else {
        // Fallback to mock data
        setLeads(MOCK_LEADS);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      // Fallback to mock data
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/leads/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to mock stats
        setStats(getMockLeadStats());
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Fallback to mock stats
      setStats(getMockLeadStats());
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [fetchLeads, fetchStats]);

  // Handle add to pipeline
  const handleAddToPipeline = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pipeline', updatedBy: 'Demo User' }),
      });

      if (response.ok) {
        // Update local state
        setLeads(prev =>
          prev.map(l =>
            l.id === id
              ? {
                  ...l,
                  status: 'pipeline',
                  statusUpdatedAt: new Date().toISOString(),
                  statusUpdatedBy: 'Demo User',
                }
              : l
          )
        );
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  // Handle dismiss
  const handleDismiss = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'dismissed', updatedBy: 'Demo User' }),
      });

      if (response.ok) {
        // Update local state
        setLeads(prev =>
          prev.map(l =>
            l.id === id
              ? {
                  ...l,
                  status: 'dismissed',
                  statusUpdatedAt: new Date().toISOString(),
                  statusUpdatedBy: 'Demo User',
                }
              : l
          )
        );
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  // Handle view profile
  const handleViewProfile = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (lead) {
      setSelectedLead(lead);
      setIsModalOpen(true);
    }
  };

  // Handle contact (from modal)
  const handleContact = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted', updatedBy: 'Demo User' }),
      });

      if (response.ok) {
        // Update local state
        setLeads(prev =>
          prev.map(l =>
            l.id === id
              ? {
                  ...l,
                  status: 'contacted',
                  statusUpdatedAt: new Date().toISOString(),
                  statusUpdatedBy: 'Demo User',
                }
              : l
          )
        );
        fetchStats();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchLeads();
    fetchStats();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#D9D7D2] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3AA9BE]/10 rounded-lg">
            <Sparkles size={24} className="text-[#3AA9BE]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-black font-sans">Artist Discovery</h1>
            <p className="text-sm text-[#737373] font-sans mt-0.5">
              AI-powered discovery of emerging artists who need PR representation
            </p>
          </div>
          <span className="ml-4 text-[10px] font-mono bg-[#3AA9BE]/10 text-[#3AA9BE] px-2 py-1 rounded">
            BETA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="liberty-btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="liberty-btn-secondary flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="liberty-btn-ghost flex items-center gap-2">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && <LeadStats stats={stats} />}

      {/* Lead Grid */}
      <LeadGrid
        leads={leads}
        onAddToPipeline={handleAddToPipeline}
        onDismiss={handleDismiss}
        onViewProfile={handleViewProfile}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToPipeline={handleAddToPipeline}
        onDismiss={handleDismiss}
        onContact={handleContact}
      />
    </div>
  );
}
