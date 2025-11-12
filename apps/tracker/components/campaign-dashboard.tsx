'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { Campaign, CampaignActivity } from '@/lib/db/types';

interface CampaignWithStats extends Campaign {
  _stats?: {
    contactsCount: number;
    activitiesCount: number;
    playsCount: number;
    lastActivity?: string;
  };
}

interface CampaignDashboardProps {
  campaigns: CampaignWithStats[];
  onCreateCampaign?: () => void;
}

export function CampaignDashboard({ campaigns, onCreateCampaign }: CampaignDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesFilter = filter === 'all' || campaign.status === filter;
    const matchesSearch =
      !searchQuery ||
      campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.track_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate dashboard stats
  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
    completedCampaigns: campaigns.filter((c) => c.status === 'completed').length,
    totalActivities: campaigns.reduce(
      (sum, c) => sum + (c._stats?.activitiesCount || 0),
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaign Tracker</h1>
          <p className="text-slate-600 mt-1">
            Manage radio promotion campaigns with real-time integrations
          </p>
        </div>
        <button
          onClick={onCreateCampaign}
          className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Campaigns"
          value={stats.totalCampaigns}
          icon={<ChartBarIcon className="h-6 w-6 text-cyan-500" />}
        />
        <StatCard
          label="Active"
          value={stats.activeCampaigns}
          icon={<CalendarIcon className="h-6 w-6 text-green-500" />}
        />
        <StatCard
          label="Completed"
          value={stats.completedCampaigns}
          icon={<ChatBubbleLeftRightIcon className="h-6 w-6 text-slate-500" />}
        />
        <StatCard
          label="Total Activities"
          value={stats.totalActivities}
          icon={<EnvelopeIcon className="h-6 w-6 text-purple-500" />}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <FilterButton
            label="All"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            count={campaigns.length}
          />
          <FilterButton
            label="Active"
            active={filter === 'active'}
            onClick={() => setFilter('active')}
            count={stats.activeCampaigns}
          />
          <FilterButton
            label="Completed"
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
            count={stats.completedCampaigns}
          />
          <FilterButton
            label="Paused"
            active={filter === 'paused'}
            onClick={() => setFilter('paused')}
            count={campaigns.filter((c) => c.status === 'paused').length}
          />
        </div>

        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-2 text-slate-600">
            {searchQuery ? 'No campaigns found matching your search' : 'No campaigns yet'}
          </p>
          {!searchQuery && onCreateCampaign && (
            <button
              onClick={onCreateCampaign}
              className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              Create your first campaign
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${
          active
            ? 'bg-cyan-500 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }
      `}
    >
      {label} {count > 0 && <span className="ml-1">({count})</span>}
    </button>
  );
}

function CampaignCard({ campaign }: { campaign: CampaignWithStats }) {
  // Get integration badges
  const integrations = [
    { name: 'Gmail', active: !!campaign.gmail_label, color: 'bg-red-100 text-red-700' },
    { name: 'Mailchimp', active: !!campaign.mailchimp_campaign_id, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Monday', active: !!campaign.monday_board_id, color: 'bg-purple-100 text-purple-700' },
    { name: 'Airtable', active: !!campaign.airtable_base_id, color: 'bg-orange-100 text-orange-700' },
    { name: 'Drive', active: !!campaign.drive_folder_id, color: 'bg-blue-100 text-blue-700' },
    { name: 'Sheets', active: !!campaign.sheets_report_id, color: 'bg-green-100 text-green-700' },
  ].filter((i) => i.active);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-700',
    paused: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <Link href={`/dashboard/campaigns/${campaign.id}`}>
      <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
              {campaign.title}
            </h3>
            {campaign.artist_name && campaign.track_name && (
              <p className="text-sm text-slate-600 mt-1">
                {campaign.artist_name} - "{campaign.track_name}"
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              statusColors[campaign.status || 'active']
            }`}
          >
            {campaign.status || 'active'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">
              {campaign._stats?.contactsCount || 0}
            </p>
            <p className="text-xs text-slate-600">Contacts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">
              {campaign._stats?.playsCount || 0}
            </p>
            <p className="text-xs text-slate-600">Plays</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">
              {campaign._stats?.activitiesCount || 0}
            </p>
            <p className="text-xs text-slate-600">Activities</p>
          </div>
        </div>

        {/* Integration Badges */}
        {integrations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {integrations.map((integration) => (
              <span
                key={integration.name}
                className={`px-2 py-1 rounded text-xs font-medium ${integration.color}`}
              >
                {integration.name}
              </span>
            ))}
          </div>
        )}

        {/* Last Activity */}
        {campaign._stats?.lastActivity && (
          <p className="text-xs text-slate-500">
            Last activity:{' '}
            {new Date(campaign._stats.lastActivity).toLocaleDateString()}
          </p>
        )}

        {/* Release Date */}
        {campaign.release_date && (
          <p className="text-xs text-slate-500 mt-1">
            Release: {new Date(campaign.release_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
}
