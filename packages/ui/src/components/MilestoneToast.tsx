'use client';

import * as React from 'react';
import { X, Trophy, Star, Target, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export type MilestoneType =
  | 'contacts_enriched'
  | 'pitches_generated'
  | 'campaigns_created'
  | 'time_saved';

export interface MilestoneToastProps {
  id: string;
  milestone: MilestoneType;
  count: number;
  timeSaved?: string;
  onClose: (id: string) => void;
}

/**
 * Get milestone configuration based on type and count
 */
function getMilestoneConfig(
  milestone: MilestoneType,
  count: number,
  timeSaved?: string
): {
  icon: React.ReactNode;
  title: string;
  message: string;
} {
  switch (milestone) {
    case 'contacts_enriched':
      if (count >= 500) {
        return {
          icon: <Trophy className="h-6 w-6 text-[#3AA9BE]" />,
          title: '500 Contacts Enriched!',
          message: "You've saved approximately 125 hours of research. That's over 3 working weeks!",
        };
      }
      if (count >= 100) {
        return {
          icon: <Trophy className="h-6 w-6 text-[#3AA9BE]" />,
          title: '100 Contacts Enriched!',
          message: "You've saved approximately 25 hours of research.",
        };
      }
      if (count >= 50) {
        return {
          icon: <Star className="h-6 w-6 text-[#3AA9BE]" />,
          title: '50 Contacts Enriched!',
          message: "You've saved approximately 12.5 hours of research.",
        };
      }
      if (count >= 10) {
        return {
          icon: <Target className="h-6 w-6 text-[#3AA9BE]" />,
          title: '10 Contacts Enriched!',
          message: "You've saved approximately 2.5 hours of manual research.",
        };
      }
      return {
        icon: <Target className="h-6 w-6 text-[#3AA9BE]" />,
        title: `${count} Contacts Enriched!`,
        message: 'Building your contact database.',
      };

    case 'pitches_generated':
      if (count >= 100) {
        return {
          icon: <Trophy className="h-6 w-6 text-[#3AA9BE]" />,
          title: '100 Pitches Generated!',
          message: 'Your voice profile is finely tuned. Personalisation at scale.',
        };
      }
      if (count >= 50) {
        return {
          icon: <Star className="h-6 w-6 text-[#3AA9BE]" />,
          title: '50 Pitches Generated!',
          message: 'Your pitch game is strong. Scaling authentic outreach.',
        };
      }
      if (count >= 10) {
        return {
          icon: <Target className="h-6 w-6 text-[#3AA9BE]" />,
          title: '10 Pitches Generated!',
          message: 'Finding your voice. Each pitch gets better.',
        };
      }
      if (count === 1) {
        return {
          icon: <Star className="h-6 w-6 text-[#3AA9BE]" />,
          title: 'First Pitch Generated!',
          message: 'Your voice profile is ready. Time to scale your outreach.',
        };
      }
      return {
        icon: <Target className="h-6 w-6 text-[#3AA9BE]" />,
        title: `${count} Pitches Generated!`,
        message: 'Building your pitch library.',
      };

    case 'campaigns_created':
      if (count >= 10) {
        return {
          icon: <Trophy className="h-6 w-6 text-[#3AA9BE]" />,
          title: '10 Campaigns Tracked!',
          message: "You're building real insight. Track, learn, optimise.",
        };
      }
      if (count >= 5) {
        return {
          icon: <Star className="h-6 w-6 text-[#3AA9BE]" />,
          title: '5 Campaigns Tracked!',
          message: 'Patterns are emerging. Use your data to improve.',
        };
      }
      if (count === 1) {
        return {
          icon: <Target className="h-6 w-6 text-[#3AA9BE]" />,
          title: 'First Campaign Created!',
          message: 'Track your progress, learn from results.',
        };
      }
      return {
        icon: <Target className="h-6 w-6 text-[#3AA9BE]" />,
        title: `${count} Campaigns Created!`,
        message: 'Building your campaign history.',
      };

    case 'time_saved':
      return {
        icon: <Clock className="h-6 w-6 text-[#3AA9BE]" />,
        title: 'Time Saved!',
        message: timeSaved || 'Every minute saved is time for creativity.',
      };

    default:
      return {
        icon: <Star className="h-6 w-6 text-[#3AA9BE]" />,
        title: 'Milestone Reached!',
        message: 'Keep building.',
      };
  }
}

/**
 * MilestoneToast Component
 *
 * Displays celebration toasts when users reach milestones.
 * Uses Slate Cyan (#3AA9BE) brand colour and brutalist aesthetic.
 *
 * Features:
 * - Threshold-based milestone detection
 * - British spelling in all copy
 * - 240ms entrance animation (ease-out)
 * - Hard shadows and bold borders
 * - Time-saved calculations for contacts enriched
 *
 * Milestone Thresholds:
 * - contacts_enriched: 10, 50, 100, 500
 * - pitches_generated: 1, 10, 50, 100
 * - campaigns_created: 1, 5, 10
 *
 * @example
 * ```tsx
 * <MilestoneToast
 *   id="milestone-1"
 *   milestone="contacts_enriched"
 *   count={100}
 *   onClose={(id) => console.log('Closed:', id)}
 * />
 * ```
 */
export function MilestoneToast({ id, milestone, count, timeSaved, onClose }: MilestoneToastProps) {
  const [isClosing, setIsClosing] = React.useState(false);
  const config = getMilestoneConfig(milestone, count, timeSaved);

  // Auto-close after 8 seconds (longer for celebration)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onClose(id);
      }, 240);
    }, 8000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 240);
  };

  return (
    <div
      className={cn(
        'transform transition-all duration-240 ease-out',
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
      style={{
        animationDuration: '240ms',
      }}
    >
      <div
        className={cn(
          'flex items-start gap-4 rounded-xl border-4 border-[#3AA9BE] p-5',
          'bg-[#3AA9BE]/10',
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
          'max-w-md'
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#3AA9BE]/20">
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <p className="font-black text-gray-900 text-lg">{config.title}</p>
          <p className="mt-1 text-sm font-bold text-gray-700">{config.message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 p-1 rounded transition-colors',
            'hover:bg-black/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3AA9BE]',
            'min-w-[44px] min-h-[44px] flex items-center justify-center'
          )}
          aria-label="Close milestone notification"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
