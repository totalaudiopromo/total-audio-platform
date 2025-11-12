'use client';

import { useState } from 'react';
import { WarmReportUploader } from './warm-report-uploader';
import {
  ClockIcon,
  EnvelopeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import type {
  Campaign,
  CampaignContact,
  CampaignActivity,
  CampaignMetric,
} from '@/lib/db/types';

interface CampaignDetailProps {
  campaign: Campaign;
  contacts: CampaignContact[];
  activities: CampaignActivity[];
  metrics: CampaignMetric[];
}

export function CampaignDetail({
  campaign,
  contacts,
  activities,
  metrics,
}: CampaignDetailProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'contacts' | 'metrics' | 'upload'>(
    'timeline'
  );

  // Calculate stats
  const stats = {
    totalContacts: contacts.length,
    contacted: contacts.filter((c) => c.status === 'contacted' || c.status === 'responded').length,
    responded: contacts.filter((c) => c.status === 'responded' || c.status === 'confirmed').length,
    confirmed: contacts.filter((c) => c.status === 'confirmed').length,
    totalPlays: metrics.find((m) => m.metric_type === 'plays')?.value || 0,
    emailsSent: metrics.find((m) => m.metric_type === 'emails_sent')?.value || 0,
    emailOpens: metrics.find((m) => m.metric_type === 'email_opens')?.value || 0,
  };

  const openRate = stats.emailsSent > 0
    ? ((stats.emailOpens / stats.emailsSent) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{campaign.title}</h1>
            {campaign.artist_name && campaign.track_name && (
              <p className="text-lg text-slate-600 mt-2">
                {campaign.artist_name} - "{campaign.track_name}"
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4 text-sm text-slate-600">
              {campaign.genre && <span>Genre: {campaign.genre}</span>}
              {campaign.region && <span>• Region: {campaign.region}</span>}
              {campaign.release_date && (
                <span>
                  • Release: {new Date(campaign.release_date).toLocaleDateString()}
                </span>
              )}
              {campaign.budget && <span>• Budget: {campaign.budget}</span>}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              campaign.status === 'active'
                ? 'bg-green-100 text-green-700'
                : campaign.status === 'completed'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {campaign.status || 'active'}
          </span>
        </div>

        {/* Integration Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {campaign.gmail_label && (
            <IntegrationBadge icon="📧" label="Gmail" detail={campaign.gmail_label} color="red" />
          )}
          {campaign.mailchimp_campaign_id && (
            <IntegrationBadge
              icon="📬"
              label="Mailchimp"
              detail={campaign.mailchimp_campaign_id.slice(0, 8)}
              color="yellow"
            />
          )}
          {campaign.monday_board_id && (
            <IntegrationBadge icon="📋" label="Monday" detail="Linked" color="purple" />
          )}
          {campaign.airtable_base_id && (
            <IntegrationBadge icon="📊" label="Airtable" detail="Synced" color="orange" />
          )}
          {campaign.drive_folder_id && (
            <IntegrationBadge icon="📁" label="Drive" detail="Linked" color="blue" />
          )}
          {campaign.sheets_report_id && (
            <IntegrationBadge icon="📈" label="Sheets" detail="Live" color="green" />
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Contacts"
          value={stats.totalContacts}
          icon={<UserGroupIcon className="h-6 w-6 text-cyan-500" />}
        />
        <StatCard
          label="Radio Plays"
          value={stats.totalPlays}
          icon={<ChartBarIcon className="h-6 w-6 text-green-500" />}
        />
        <StatCard
          label="Responded"
          value={stats.responded}
          subValue={`${stats.totalContacts > 0 ? ((stats.responded / stats.totalContacts) * 100).toFixed(0) : 0}%`}
          icon={<ChatBubbleLeftIcon className="h-6 w-6 text-purple-500" />}
        />
        <StatCard
          label="Email Open Rate"
          value={`${openRate}%`}
          subValue={`${stats.emailOpens}/${stats.emailsSent}`}
          icon={<EnvelopeIcon className="h-6 w-6 text-orange-500" />}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex">
            <TabButton
              label="Timeline"
              active={activeTab === 'timeline'}
              onClick={() => setActiveTab('timeline')}
              icon={<ClockIcon className="h-5 w-5" />}
              count={activities.length}
            />
            <TabButton
              label="Contacts"
              active={activeTab === 'contacts'}
              onClick={() => setActiveTab('contacts')}
              icon={<UserGroupIcon className="h-5 w-5" />}
              count={contacts.length}
            />
            <TabButton
              label="Metrics"
              active={activeTab === 'metrics'}
              onClick={() => setActiveTab('metrics')}
              icon={<ChartBarIcon className="h-5 w-5" />}
              count={metrics.length}
            />
            <TabButton
              label="Upload WARM Report"
              active={activeTab === 'upload'}
              onClick={() => setActiveTab('upload')}
              icon={<CloudArrowUpIcon className="h-5 w-5" />}
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'timeline' && (
            <ActivityTimeline activities={activities} />
          )}
          {activeTab === 'contacts' && (
            <ContactsList contacts={contacts} />
          )}
          {activeTab === 'metrics' && (
            <MetricsList metrics={metrics} />
          )}
          {activeTab === 'upload' && (
            <WarmReportUploader
              campaignId={campaign.id}
              onUploadComplete={() => {
                // Refresh page to show new activities
                window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationBadge({
  icon,
  label,
  detail,
  color,
}: {
  icon: string;
  label: string;
  detail: string;
  color: string;
}) {
  const colors = {
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <span
      className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${colors[color as keyof typeof colors]}`}
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
      <span className="text-xs opacity-75">• {detail}</span>
    </span>
  );
}

function StatCard({
  label,
  value,
  subValue,
  icon,
}: {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-600">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  icon,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-6 py-3 font-medium transition-colors
        ${
          active
            ? 'border-b-2 border-cyan-500 text-cyan-600'
            : 'text-slate-600 hover:text-slate-900'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            active ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ActivityTimeline({ activities }: { activities: CampaignActivity[] }) {
  // Sort activities by timestamp (most recent first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <ClockIcon className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-slate-600">No activities yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity, index) => (
        <ActivityItem key={activity.id} activity={activity} isLast={index === sortedActivities.length - 1} />
      ))}
    </div>
  );
}

function ActivityItem({ activity, isLast }: { activity: CampaignActivity; isLast: boolean }) {
  const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    gmail_sent: { icon: <EnvelopeIcon className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
    gmail_received: { icon: <EnvelopeIcon className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
    mailchimp_sent: { icon: <EnvelopeIcon className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-600' },
    warm_play: { icon: <ChartBarIcon className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' },
    milestone: { icon: <CheckCircleIcon className="h-5 w-5" />, color: 'bg-cyan-100 text-cyan-600' },
    contacted: { icon: <ChatBubbleLeftIcon className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
    got_response: { icon: <ChatBubbleLeftIcon className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
    play_confirmed: { icon: <CheckCircleIcon className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
    declined: { icon: <XCircleIcon className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
  };

  const activityStyle = activityIcons[activity.activity_type] || {
    icon: <ClockIcon className="h-5 w-5" />,
    color: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="flex gap-4">
      {/* Timeline Icon */}
      <div className="relative flex flex-col items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activityStyle.color}`}>
          {activityStyle.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 mt-2" style={{ minHeight: '20px' }} />}
      </div>

      {/* Activity Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{activity.description}</p>
            {activity.notes && (
              <p className="text-sm text-slate-600 mt-1">{activity.notes}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span>{new Date(activity.timestamp).toLocaleString()}</span>
              {activity.integration_source && (
                <>
                  <span>•</span>
                  <span className="capitalize">{activity.integration_source}</span>
                </>
              )}
              {activity.user_name && (
                <>
                  <span>•</span>
                  <span>{activity.user_name}</span>
                </>
              )}
              {activity.user_location && (
                <>
                  <span>•</span>
                  <span>{activity.user_location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactsList({ contacts }: { contacts: CampaignContact[] }) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-slate-600">No contacts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
        >
          <div className="flex-1">
            <p className="font-medium text-slate-900">{contact.contact_name}</p>
            {contact.outlet && (
              <p className="text-sm text-slate-600">{contact.outlet}</p>
            )}
            {contact.contact_email && (
              <p className="text-xs text-slate-500 mt-1">{contact.contact_email}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {contact.contact_type && (
              <span className="px-2 py-1 bg-white rounded text-xs text-slate-600">
                {contact.contact_type}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                contact.status === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : contact.status === 'responded'
                    ? 'bg-blue-100 text-blue-700'
                    : contact.status === 'contacted'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-slate-100 text-slate-600'
              }`}
            >
              {contact.status || 'pending'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricsList({ metrics }: { metrics: CampaignMetric[] }) {
  if (metrics.length === 0) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-slate-600">No metrics yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
        >
          <div>
            <p className="font-medium text-slate-900 capitalize">
              {metric.metric_type.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Source: {metric.source.replace(/_/g, ' ')}
            </p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
