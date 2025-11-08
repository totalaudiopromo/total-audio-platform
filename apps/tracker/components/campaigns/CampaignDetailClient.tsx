'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Mail,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { AddActivityModal } from './AddActivityModal';
import { ContactList } from './ContactList';
import type { CampaignActivity } from '@/lib/types/tracker';

type Campaign = {
  id: string;
  name: string;
  platform: string;
  genre: string;
  status: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  target_reach?: number;
  actual_reach?: number;
  notes?: string;
  created_at: string;
};

type Activity = {
  id: string;
  campaign_id: string;
  activity_type: string;
  description: string;
  activity_date: string;
  contact_name?: string;
  contact_org?: string;
  platform?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
};

interface CampaignDetailClientProps {
  campaign: Campaign;
  activities: Activity[];
  userId: string;
}

const ACTIVITY_ICONS: Record<string, any> = {
  email_sent: Mail,
  pitch_sent: Mail,
  response_received: MessageSquare,
  email_reply: MessageSquare,
  response: MessageSquare,
  milestone: TrendingUp,
  planning: Calendar,
  completed: CheckCircle,
  playlist_add: CheckCircle,
  radio_play: CheckCircle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  email_sent: 'bg-blue-100 border-black text-blue-900',
  pitch_sent: 'bg-blue-100 border-black text-blue-900',
  response_received: 'bg-green-100 border-black text-green-900',
  email_reply: 'bg-green-100 border-black text-green-900',
  response: 'bg-green-100 border-black text-green-900',
  milestone: 'bg-teal-100 border-black text-teal-900',
  planning: 'bg-teal-100 border-black text-teal-900',
  completed: 'bg-emerald-100 border-black text-emerald-900',
  playlist_add: 'bg-purple-100 border-black text-purple-900',
  radio_play: 'bg-purple-100 border-black text-purple-900',
};

export function CampaignDetailClient({
  campaign,
  activities,
  userId,
}: CampaignDetailClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const successRate =
    campaign.target_reach && campaign.actual_reach
      ? Math.round((campaign.actual_reach / campaign.target_reach) * 100)
      : 0;

  // Convert activities to CampaignActivity format for ContactList
  const campaignActivities: CampaignActivity[] = activities.map(a => ({
    id: a.id,
    campaign_id: a.campaign_id,
    timestamp: a.activity_date,
    activity_type: a.activity_type as any,
    description: a.description,
    contact_name: a.contact_name,
    contact_org: a.contact_org,
    platform: a.platform,
    importance: 'medium' as const,
    created_at: a.created_at,
  }));

  const handleGeneratePitch = () => {
    // Link to Pitch Generator with campaign context
    const pitchUrl = new URL('https://pitch.totalaudiopromo.com');
    pitchUrl.searchParams.set('campaign', campaign.id);
    pitchUrl.searchParams.set('campaignName', campaign.name || '');
    const campaignName = campaign.name || '';
    pitchUrl.searchParams.set(
      'artist',
      campaignName.split(' - ')[0] || campaignName || ''
    );
    pitchUrl.searchParams.set('platform', campaign.platform || '');
    pitchUrl.searchParams.set('genre', campaign.genre || '');
    window.open(pitchUrl.toString(), '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-black px-4 py-6 shadow-brutal">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm font-black text-gray-700 hover:text-teal-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {campaign.name || campaign.artist_name || 'Untitled Campaign'}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black bg-teal-100 text-teal-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {campaign.platform}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black bg-gray-100 text-gray-800 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {campaign.genre}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : campaign.status === 'completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGeneratePitch}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Generate Pitch
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
            <p className="text-sm font-black text-gray-600 uppercase tracking-wider">
              Target Reach
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {campaign.target_reach || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
            <p className="text-sm font-black text-gray-600 uppercase tracking-wider">
              Actual Reach
            </p>
            <p className="text-2xl font-black text-teal-600 mt-1">
              {campaign.actual_reach || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
            <p className="text-sm font-black text-gray-600 uppercase tracking-wider">
              Success Rate
            </p>
            <p className="text-2xl font-black text-green-600 mt-1">
              {successRate}%
            </p>
          </div>
          <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
            <p className="text-sm font-black text-gray-600 uppercase tracking-wider">
              Budget
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              £{campaign.budget || 0}
            </p>
          </div>
        </div>

        {/* Contact List */}
        <div className="mb-8">
          <ContactList
            activities={campaignActivities}
            campaignId={campaign.id}
          />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-6 mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Campaign Timeline
          </h2>

          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 font-black">No activities yet</p>
              <p className="text-sm text-gray-600 mt-1 font-bold">
                Click "Add Activity" to start tracking your campaign progress
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => {
                const Icon = ACTIVITY_ICONS[activity.activity_type] || Calendar;
                const colorClass =
                  ACTIVITY_COLORS[activity.activity_type] ||
                  'bg-gray-100 border-black text-gray-900';

                return (
                  <div
                    key={activity.id}
                    className={`border-4 rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${colorClass}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black uppercase tracking-wider">
                            {activity.activity_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-bold opacity-75">
                            {format(
                              new Date(activity.activity_date),
                              'MMM d, yyyy'
                            )}
                          </span>
                        </div>
                        <p className="font-black text-sm mb-1">
                          {activity.description}
                        </p>
                        {activity.notes && (
                          <p className="text-sm font-bold opacity-90">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notes */}
        {campaign.notes && (
          <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              Campaign Notes
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap font-bold">
              {campaign.notes}
            </p>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        campaignId={campaign.id}
        userId={userId}
        onActivityAdded={() => {
          setIsAddModalOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
