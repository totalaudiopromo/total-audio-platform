'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Calendar, Mail, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { AddActivityModal } from './AddActivityModal';

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
  response: MessageSquare,
  milestone: TrendingUp,
  planning: Calendar,
  completed: CheckCircle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  email_sent: 'bg-blue-50 border-blue-200 text-blue-700',
  response: 'bg-green-50 border-green-200 text-green-700',
  milestone: 'bg-purple-50 border-purple-200 text-purple-700',
  planning: 'bg-amber-50 border-amber-200 text-amber-700',
  completed: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

export function CampaignDetailClient({ campaign, activities, userId }: CampaignDetailClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const successRate = campaign.target_reach && campaign.actual_reach
    ? Math.round((campaign.actual_reach / campaign.target_reach) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {campaign.platform}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {campaign.genre}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {campaign.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600">Target Reach</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{campaign.target_reach || 0}</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600">Actual Reach</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{campaign.actual_reach || 0}</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600">Success Rate</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{successRate}%</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600">Budget</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">£{campaign.budget || 0}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Timeline</h2>

          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No activities yet</p>
              <p className="text-sm text-slate-500 mt-1">Click "Add Activity" to start tracking your campaign progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.activity_type] || Calendar;
                const colorClass = ACTIVITY_COLORS[activity.activity_type] || 'bg-slate-50 border-slate-200 text-slate-700';

                return (
                  <div
                    key={activity.id}
                    className={`border-2 rounded-lg p-4 ${colorClass}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-white border-2 border-current flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {activity.activity_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-medium opacity-75">
                            {format(new Date(activity.activity_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="font-semibold text-sm mb-1">{activity.description}</p>
                        {activity.notes && (
                          <p className="text-sm opacity-90">{activity.notes}</p>
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
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Campaign Notes</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{campaign.notes}</p>
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
