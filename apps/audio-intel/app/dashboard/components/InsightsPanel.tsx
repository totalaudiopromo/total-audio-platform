'use client';

import { Clock, TrendingUp, Lightbulb, Award } from 'lucide-react';

export interface InsightsPanelProps {
  totalContacts: number;
  enrichmentsUsed: number;
  lastActivityDate?: string;
}

function formatTimeSaved(contacts: number): string {
  const totalMinutes = contacts * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
}

function getSuggestedAction(
  enrichmentsUsed: number,
  lastActivityDate?: string
): { title: string; description: string } {
  // No activity
  if (enrichmentsUsed === 0) {
    return {
      title: 'Get started',
      description: 'Upload your first contacts to see the magic happen',
    };
  }

  // Check for stale activity (more than 7 days)
  if (lastActivityDate) {
    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince > 7) {
      return {
        title: 'Time to reconnect',
        description: `You haven't enriched contacts in ${daysSince} days. Got a new campaign coming up?`,
      };
    }
  }

  // Low usage suggestion
  if (enrichmentsUsed < 10) {
    return {
      title: 'Try batch enrichment',
      description: 'Upload multiple contacts at once to save even more time',
    };
  }

  // Default for active users
  return {
    title: 'Keep the momentum',
    description: 'Export your contacts to Pitch Generator for personalised outreach',
  };
}

export function InsightsPanel({
  totalContacts,
  enrichmentsUsed,
  lastActivityDate,
}: InsightsPanelProps) {
  const timeSaved = formatTimeSaved(totalContacts);
  const suggestion = getSuggestedAction(enrichmentsUsed, lastActivityDate);

  // Don't show if no activity yet
  if (enrichmentsUsed === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
        <Award className="h-5 w-5 text-blue-600" />
        Your Impact
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Time Saved */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-gray-500">Time Saved</p>
            <p className="text-xl font-black text-gray-900">{timeSaved}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Based on {totalContacts} contact{totalContacts !== 1 ? 's' : ''} enriched
            </p>
          </div>
        </div>

        {/* Success Rate */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-gray-500">
              Success Rate
            </p>
            <p className="text-xl font-black text-gray-900">100%</p>
            <p className="text-xs font-medium text-gray-500 mt-1">Enrichment accuracy</p>
          </div>
        </div>

        {/* Suggested Action */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-gray-500">
              {suggestion.title}
            </p>
            <p className="text-sm font-medium text-gray-700 mt-1">{suggestion.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
