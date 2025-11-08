'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Mail, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { CampaignActivity } from '@/lib/types/tracker';

type ContactStatus =
  | 'pitched'
  | 'responded'
  | 'coverage_secured'
  | 'follow_up_needed';

interface Contact {
  id: string;
  name: string;
  organisation: string;
  platform?: string;
  status: ContactStatus;
  datePitched?: string;
  lastActivity?: string;
  notes?: string;
}

interface ContactListProps {
  activities: CampaignActivity[];
  campaignId: string;
}

function ContactStatusBadge({ status }: { status: ContactStatus }) {
  const styles: Record<ContactStatus, { bg: string; text: string; icon: any }> =
    {
      pitched: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: Mail,
      },
      responded: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
      },
      coverage_secured: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: CheckCircle,
      },
      follow_up_needed: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: Clock,
      },
    };

  const style = styles[status];
  const Icon = style.icon;
  const labels: Record<ContactStatus, string> = {
    pitched: 'Pitched',
    responded: 'Responded',
    coverage_secured: 'Coverage Secured',
    follow_up_needed: 'Follow-up Needed',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${style.bg} ${style.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {labels[status]}
    </span>
  );
}

export function ContactList({ activities, campaignId }: ContactListProps) {
  // Extract unique contacts from activities
  const contacts = useMemo(() => {
    const contactMap = new Map<string, Contact>();

    activities.forEach(activity => {
      if (!activity.contact_name) return;

      const key = `${activity.contact_name}-${activity.contact_org || ''}`;

      if (!contactMap.has(key)) {
        contactMap.set(key, {
          id: key,
          name: activity.contact_name,
          organisation: activity.contact_org || 'Unknown',
          platform: activity.platform || undefined,
          status: 'pitched' as ContactStatus,
          datePitched: activity.timestamp
            ? format(new Date(activity.timestamp), 'MMM d, yyyy')
            : undefined,
          lastActivity: activity.timestamp
            ? format(new Date(activity.timestamp), 'MMM d, yyyy')
            : undefined,
          notes: activity.description,
        });
      }

      const contact = contactMap.get(key)!;

      // Update status based on activity type
      if (
        activity.activity_type === 'response_received' ||
        activity.activity_type === 'email_reply'
      ) {
        contact.status = 'responded';
      } else if (
        activity.activity_type === 'playlist_add' ||
        activity.activity_type === 'radio_play' ||
        activity.activity_type === 'social_share'
      ) {
        contact.status = 'coverage_secured';
      } else if (activity.activity_type === 'pitch_sent') {
        // If pitched but no response, mark as follow-up needed if it's been more than 7 days
        if (contact.status === 'pitched' && activity.timestamp) {
          const daysSincePitch = Math.floor(
            (new Date().getTime() - new Date(activity.timestamp).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (daysSincePitch > 7) {
            contact.status = 'follow_up_needed';
          }
        }
      }

      // Update last activity date
      if (activity.timestamp) {
        const activityDate = new Date(activity.timestamp);
        const currentLastActivity = contact.lastActivity
          ? new Date(contact.lastActivity)
          : null;
        if (!currentLastActivity || activityDate > currentLastActivity) {
          contact.lastActivity = format(activityDate, 'MMM d, yyyy');
        }
      }
    });

    return Array.from(contactMap.values()).sort((a, b) => {
      // Sort by status priority, then by name
      const statusOrder: Record<ContactStatus, number> = {
        follow_up_needed: 0,
        responded: 1,
        coverage_secured: 2,
        pitched: 3,
      };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return a.name.localeCompare(b.name);
    });
  }, [activities]);

  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border-4 border-black shadow-brutal">
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-black text-gray-900 mb-2">
            No contacts yet
          </p>
          <p className="text-sm font-bold text-gray-600">
            Add activities with contact information to track your outreach
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: contacts.length,
    pitched: contacts.filter(c => c.status === 'pitched').length,
    responded: contacts.filter(c => c.status === 'responded').length,
    coverage: contacts.filter(c => c.status === 'coverage_secured').length,
    followUp: contacts.filter(c => c.status === 'follow_up_needed').length,
  };

  const responseRate =
    stats.total > 0
      ? Math.round(((stats.responded + stats.coverage) / stats.total) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal">
      {/* Header with Stats */}
      <div className="p-6 border-b-4 border-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Campaign Contacts
            </h2>
            <p className="text-sm font-bold text-gray-600">
              {stats.total} contacts • {responseRate}% response rate
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-blue-100 rounded-lg px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black text-blue-800 uppercase tracking-wider">
                Pitched
              </div>
              <div className="text-lg font-black text-blue-900">
                {stats.pitched}
              </div>
            </div>
            <div className="bg-green-100 rounded-lg px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black text-green-800 uppercase tracking-wider">
                Responded
              </div>
              <div className="text-lg font-black text-green-900">
                {stats.responded}
              </div>
            </div>
            <div className="bg-purple-100 rounded-lg px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black text-purple-800 uppercase tracking-wider">
                Coverage
              </div>
              <div className="text-lg font-black text-purple-900">
                {stats.coverage}
              </div>
            </div>
            <div className="bg-orange-100 rounded-lg px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-black text-orange-800 uppercase tracking-wider">
                Follow-up
              </div>
              <div className="text-lg font-black text-orange-900">
                {stats.followUp}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-4 border-black">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Organisation
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Date Pitched
              </th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {contacts.map((contact, index) => (
              <tr
                key={contact.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-black text-gray-900">{contact.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-700">
                    {contact.organisation}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {contact.platform ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-black bg-teal-100 text-teal-800 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {contact.platform}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-bold">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <ContactStatusBadge status={contact.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-700">
                    {contact.datePitched || '—'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-700">
                    {contact.lastActivity || '—'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
