'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Mail, MessageCircle } from 'lucide-react';

interface ContactIntelligenceProps {
  contactId: string;
  contactName: string;
  outlet?: string | null;
  role?: string | null;
  preferredTone?: string;
  lastContact?: string | null;
  totalInteractions?: number;
  responseRate?: number;
  notes?: string | null;
}

export function ContactIntelligence({
  contactName,
  outlet,
  role,
  preferredTone = 'professional',
  lastContact,
  totalInteractions = 0,
  responseRate = 0,
  notes,
}: ContactIntelligenceProps) {
  const [timesSinceLastContact, setTimesSinceLastContact] = useState<string>('');

  useEffect(() => {
    if (lastContact) {
      const lastContactDate = new Date(lastContact);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastContactDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        setTimesSinceLastContact('Today');
      } else if (diffDays === 1) {
        setTimesSinceLastContact('Yesterday');
      } else if (diffDays < 7) {
        setTimesSinceLastContact(`${diffDays} days ago`);
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        setTimesSinceLastContact(`${weeks} week${weeks > 1 ? 's' : ''} ago`);
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        setTimesSinceLastContact(`${months} month${months > 1 ? 's' : ''} ago`);
      } else {
        const years = Math.floor(diffDays / 365);
        setTimesSinceLastContact(`${years} year${years > 1 ? 's' : ''} ago`);
      }
    }
  }, [lastContact]);

  const getResponseRateColor = (rate: number) => {
    if (rate >= 70) return 'text-success';
    if (rate >= 40) return 'text-brand-amber';
    if (rate >= 20) return 'text-brand-amber';
    return 'text-gray-900/60';
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'casual':
        return 'bg-brand-amber/20 text-brand-amber';
      case 'professional':
        return 'bg-brand-amber/20 text-brand-amber';
      case 'enthusiastic':
        return 'bg-brand-amber/20 text-brand-amber';
      default:
        return 'bg-gray-200 text-gray-900/70';
    }
  };

  return (
    <div className="rounded-2xl border border-brand-amber/30 bg-brand-amber/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Contact Intelligence</h4>
          <p className="mt-1 text-sm text-gray-900/60">
            Insights for <span className="font-medium">{contactName}</span>
            {outlet && ` at ${outlet}`}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Last Contacted */}
        {lastContact && (
          <div className="flex items-start gap-3 rounded-lg bg-white/50 px-3 py-2.5">
            <Clock className="mt-0.5 h-4 w-4 text-brand-amber" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900/60">Last Contacted</p>
              <p className="mt-0.5 text-sm font-semibold">{timesSinceLastContact}</p>
            </div>
          </div>
        )}

        {/* Response Rate */}
        {totalInteractions > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-white/50 px-3 py-2.5">
            <TrendingUp className="mt-0.5 h-4 w-4 text-brand-amber" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900/60">Response Rate</p>
              <p className={`mt-0.5 text-sm font-semibold ${getResponseRateColor(responseRate)}`}>
                {responseRate.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Total Interactions */}
        {totalInteractions > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-white/50 px-3 py-2.5">
            <Mail className="mt-0.5 h-4 w-4 text-brand-amber" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900/60">Total Pitches Sent</p>
              <p className="mt-0.5 text-sm font-semibold">{totalInteractions}</p>
            </div>
          </div>
        )}

        {/* Preferred Tone */}
        <div className="flex items-start gap-3 rounded-lg bg-white/50 px-3 py-2.5">
          <MessageCircle className="mt-0.5 h-4 w-4 text-brand-amber" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900/60">Preferred Tone</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getToneColor(
                preferredTone
              )}`}
            >
              {preferredTone.charAt(0).toUpperCase() + preferredTone.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mt-3 rounded-lg bg-white/50 px-3 py-2.5">
          <p className="text-xs font-medium text-gray-900/60">Notes</p>
          <p className="mt-1 text-sm italic text-gray-900/70">{notes}</p>
        </div>
      )}

      {/* First Contact Indicator */}
      {!lastContact && totalInteractions === 0 && (
        <div className="mt-3 rounded-lg border border-dashed border-brand-amber/30 bg-white/30 px-3 py-2.5 text-center">
          <p className="text-xs font-medium text-brand-amber">
            First time pitching to this contact
          </p>
        </div>
      )}
    </div>
  );
}
