'use client';

import * as React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../lib/utils';

export interface FeedbackButtonProps {
  /**
   * The app identifier (e.g., 'audio-intel', 'tracker', 'pitch-generator')
   */
  app: string;

  /**
   * Optional agent identifier for agent-specific feedback
   */
  agentId?: string;

  /**
   * API endpoint for feedback submission
   * @default '/api/feedback'
   */
  apiEndpoint?: string;

  /**
   * Custom class name for the container
   */
  className?: string;

  /**
   * Callback fired when feedback is submitted successfully
   */
  onFeedbackSubmitted?: (rating: number) => void;

  /**
   * Callback fired when feedback submission fails
   */
  onError?: (error: Error) => void;
}

type FeedbackState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * FeedbackButton Component
 *
 * A simple thumbs up/down feedback widget that submits user feedback
 * to the feedback_events table via the API.
 *
 * @example
 * ```tsx
 * <FeedbackButton
 *   app="audio-intel"
 *   agentId="contact-enrichment"
 *   onFeedbackSubmitted={(rating) => console.log('Feedback:', rating)}
 * />
 * ```
 */
export function FeedbackButton({
  app,
  agentId,
  apiEndpoint = '/api/feedback',
  className,
  onFeedbackSubmitted,
  onError,
}: FeedbackButtonProps) {
  const [state, setState] = React.useState<FeedbackState>('idle');
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleFeedback = async (isPositive: boolean) => {
    const rating = isPositive ? 5 : 1; // 5 for thumbs up, 1 for thumbs down

    setState('submitting');
    setSelectedRating(rating);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app,
          agentId,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to submit feedback' }));
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setState('success');
      onFeedbackSubmitted?.(rating);

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setState('idle');
        setSelectedRating(null);
      }, 2000);
    } catch (error) {
      setState('error');
      onError?.(error as Error);

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setState('idle');
        setSelectedRating(null);
      }, 2000);
    }
  };

  const isDisabled = state === 'submitting' || state === 'success';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => handleFeedback(true)}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors',
          'hover:bg-green-100 dark:hover:bg-green-900/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
          'disabled:pointer-events-none disabled:opacity-50',
          selectedRating === 5 && state === 'success' && 'bg-green-100 dark:bg-green-900/20'
        )}
        aria-label="Positive feedback"
      >
        <ThumbsUp
          className={cn(
            'h-5 w-5 text-green-600 dark:text-green-400',
            state === 'submitting' && selectedRating === 5 && 'animate-pulse'
          )}
        />
      </button>

      <button
        onClick={() => handleFeedback(false)}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors',
          'hover:bg-red-100 dark:hover:bg-red-900/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
          'disabled:pointer-events-none disabled:opacity-50',
          selectedRating === 1 && state === 'success' && 'bg-red-100 dark:bg-red-900/20'
        )}
        aria-label="Negative feedback"
      >
        <ThumbsDown
          className={cn(
            'h-5 w-5 text-red-600 dark:text-red-400',
            state === 'submitting' && selectedRating === 1 && 'animate-pulse'
          )}
        />
      </button>

      {state === 'success' && (
        <span className="text-xs text-green-600 dark:text-green-400">
          Thanks for your feedback!
        </span>
      )}

      {state === 'error' && (
        <span className="text-xs text-red-600 dark:text-red-400">Failed to submit</span>
      )}
    </div>
  );
}
