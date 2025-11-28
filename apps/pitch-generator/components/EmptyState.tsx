'use client';

import React from 'react';
import Link from 'next/link';
import { AudioDogMascot, MascotMood } from './AudioDogMascot';

interface EmptyStateProps {
  title: string;
  description: string;
  mood?: MascotMood;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Empty State Component with Audio the Dog
 *
 * Use this for:
 * - No contacts uploaded yet
 * - No enrichment results
 * - Empty search results
 * - First-time user states
 */
export function EmptyState({
  title,
  description,
  mood = 'idle',
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`empty-state flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {/* Audio the Dog with speech bubble */}
      <AudioDogMascot mood={mood} size="lg" message={description} showSpeechBubble />

      {/* Title */}
      <h3 className="mt-6 text-2xl font-black text-gray-900">{title}</h3>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          {action &&
            (action.href ? (
              <Link
                href={action.href}
                className="cta-button inline-flex items-center justify-center rounded-xl border-4 border-black bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-blue-700 active:scale-95 min-h-[44px] w-full sm:w-auto"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="cta-button inline-flex items-center justify-center rounded-xl border-4 border-black bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-blue-700 active:scale-95 min-h-[44px] w-full sm:w-auto"
              >
                {action.label}
              </button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="subtle-button inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 min-h-[44px] w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="subtle-button inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 min-h-[44px] w-full sm:w-auto"
              >
                {secondaryAction.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function NoContactsEmptyState() {
  return (
    <EmptyState
      title="No Contacts Yet"
      description="Upload your spreadsheet and I'll enrich your contacts with industry intelligence!"
      mood="idle"
      action={{
        label: 'Upload Contacts',
        href: '/demo',
      }}
    />
  );
}

export function NoResultsEmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      title="No Results Found"
      description={`I couldn't find any contacts matching "${searchQuery}". Try a different search?`}
      mood="error"
    />
  );
}

export function ProcessingEmptyState({ progress = 0 }: { progress?: number }) {
  return (
    <EmptyState
      title="Enriching Your Contacts"
      description={`Working on it! ${progress}% complete...`}
      mood="processing"
    />
  );
}

export function SuccessEmptyState({ count }: { count: number }) {
  return (
    <EmptyState
      title="Enrichment Complete!"
      description={`Successfully enriched ${count} contacts with industry intelligence.`}
      mood="success"
      action={{
        label: 'View Results',
        href: '#results',
      }}
      secondaryAction={{
        label: 'Export All',
        href: '#export',
      }}
    />
  );
}

export function ErrorEmptyState({ message }: { message: string }) {
  return (
    <EmptyState
      title="Something Went Wrong"
      description={message || "Don't worry, these things happen. Let's try again!"}
      mood="error"
      action={{
        label: 'Try Again',
        onClick: () => window.location.reload(),
      }}
    />
  );
}

export default EmptyState;
