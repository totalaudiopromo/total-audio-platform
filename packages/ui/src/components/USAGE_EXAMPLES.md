# EmptyState & MilestoneToast Usage Examples

Complete usage examples for the new shared UI components.

## EmptyState Component

### Basic Usage

```tsx
import { EmptyState } from '@total-audio/ui';
import { FileText } from 'lucide-react';

export function CampaignsPage() {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-blue-600" />}
      title="No campaigns yet"
      description="Create your first campaign to start tracking radio submissions."
      primaryAction={{
        label: 'Create Campaign',
        href: '/campaigns/new',
      }}
    />
  );
}
```

### With Value Reminder & Secondary Action

```tsx
import { EmptyState } from '@total-audio/ui';
import { Users } from 'lucide-react';

export function ContactsPage() {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-blue-600" />}
      title="No contacts enriched yet"
      description="Start enriching contacts to build your database of verified radio contacts."
      valueReminder="Find verified emails, phone numbers, social profiles in seconds"
      primaryAction={{
        label: 'Enrich Contacts',
        href: '/contacts/enrich',
      }}
      secondaryAction={{
        label: 'Watch Demo',
        href: '/demo',
      }}
    />
  );
}
```

### With Custom Styling

```tsx
import { EmptyState } from '@total-audio/ui';
import { Mail } from 'lucide-react';

export function PitchesPage() {
  return (
    <EmptyState
      icon={<Mail className="h-8 w-8 text-blue-600" />}
      title="No pitches generated"
      description="Generate your first personalised pitch to start your outreach campaign."
      valueReminder="Your authentic voice, scaled to hundreds of contacts"
      primaryAction={{
        label: 'Generate Pitch',
        href: '/pitches/new',
      }}
      className="max-w-2xl mx-auto mt-8"
    />
  );
}
```

## MilestoneToast Component

### Basic Usage with ToastContainer

```tsx
'use client';

import { useState } from 'react';
import { MilestoneToast, type MilestoneType } from '@total-audio/ui';

interface MilestoneNotification {
  id: string;
  milestone: MilestoneType;
  count: number;
  timeSaved?: string;
}

export function MyApp() {
  const [milestones, setMilestones] = useState<MilestoneNotification[]>([]);

  const handleClose = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div>
      {/* Your app content */}

      {/* Milestone toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3">
        {milestones.map(milestone => (
          <MilestoneToast
            key={milestone.id}
            id={milestone.id}
            milestone={milestone.milestone}
            count={milestone.count}
            timeSaved={milestone.timeSaved}
            onClose={handleClose}
          />
        ))}
      </div>
    </div>
  );
}
```

### With useMilestones Hook (Complete Example)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useMilestones, MilestoneToast, type MilestoneType } from '@total-audio/ui';

interface MilestoneNotification {
  id: string;
  milestone: MilestoneType;
  count: number;
  timeSaved?: string;
}

export function ContactEnrichmentPage() {
  const [milestones, setMilestones] = useState<MilestoneNotification[]>([]);
  const [totalEnriched, setTotalEnriched] = useState(0);
  const { checkMilestone } = useMilestones();

  const handleEnrichContact = async () => {
    // Your enrichment logic
    await enrichContact();

    const newTotal = totalEnriched + 1;
    setTotalEnriched(newTotal);

    // Check if this count is a new milestone
    if (checkMilestone('contacts_enriched', newTotal)) {
      setMilestones(prev => [
        ...prev,
        {
          id: `milestone-${Date.now()}`,
          milestone: 'contacts_enriched',
          count: newTotal,
        },
      ]);
    }
  };

  const handleCloseMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div>
      <button onClick={handleEnrichContact}>Enrich Contact</button>

      <p>Total Enriched: {totalEnriched}</p>

      {/* Milestone toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3">
        {milestones.map(milestone => (
          <MilestoneToast
            key={milestone.id}
            id={milestone.id}
            milestone={milestone.milestone}
            count={milestone.count}
            onClose={handleCloseMilestone}
          />
        ))}
      </div>
    </div>
  );
}
```

### Complete Integration Pattern (Recommended)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useMilestones, MilestoneToast, type MilestoneType } from '@total-audio/ui';

interface MilestoneNotification {
  id: string;
  milestone: MilestoneType;
  count: number;
  timeSaved?: string;
}

// Custom hook for milestone management
function useMilestoneNotifications() {
  const [milestones, setMilestones] = useState<MilestoneNotification[]>([]);
  const { checkMilestone } = useMilestones();

  const showMilestone = (milestone: MilestoneType, count: number, timeSaved?: string) => {
    if (checkMilestone(milestone, count)) {
      setMilestones(prev => [
        ...prev,
        {
          id: `milestone-${Date.now()}`,
          milestone,
          count,
          timeSaved,
        },
      ]);
    }
  };

  const closeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return { milestones, showMilestone, closeMilestone };
}

// Layout component with milestone container
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { milestones, showMilestone, closeMilestone } = useMilestoneNotifications();

  return (
    <div>
      {/* Pass showMilestone down via context or props */}
      {children}

      {/* Fixed milestone toast container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
        {milestones.map(milestone => (
          <MilestoneToast
            key={milestone.id}
            id={milestone.id}
            milestone={milestone.milestone}
            count={milestone.count}
            timeSaved={milestone.timeSaved}
            onClose={closeMilestone}
          />
        ))}
      </div>
    </div>
  );
}
```

## Milestone Thresholds

### contacts_enriched

- 10 contacts: "You've saved approximately 2.5 hours of manual research."
- 50 contacts: "You've saved approximately 12.5 hours of research."
- 100 contacts: "You've saved approximately 25 hours of research."
- 500 contacts: "You've saved approximately 125 hours of research. That's over 3 working weeks!"

### pitches_generated

- 1 pitch: "Your voice profile is ready. Time to scale your outreach."
- 10 pitches: "Finding your voice. Each pitch gets better."
- 50 pitches: "Your pitch game is strong. Scaling authentic outreach."
- 100 pitches: "Your voice profile is finely tuned. Personalisation at scale."

### campaigns_created

- 1 campaign: "Track your progress, learn from results."
- 5 campaigns: "Patterns are emerging. Use your data to improve."
- 10 campaigns: "You're building real insight. Track, learn, optimise."

## Design Specifications

### EmptyState

- Container: `bg-white rounded-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
- Icon container: `h-16 w-16 bg-blue-100 rounded-full`
- Title: `text-2xl font-black text-gray-900`
- Description: `text-gray-600 font-bold`
- Buttons: `min-h-[44px]` (WCAG 2.2 Level AA compliant)

### MilestoneToast

- Border: `border-4 border-[#3AA9BE]` (Slate Cyan brand colour)
- Background: `bg-[#3AA9BE]/10`
- Shadow: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- Animation: 240ms ease-out entrance
- Auto-close: 8 seconds (longer for celebration)

## Mobile Responsiveness

Both components are fully responsive:

- EmptyState: Buttons stack vertically on mobile (`flex-col sm:flex-row`)
- MilestoneToast: Fixed width with `max-w-md` for consistent sizing
- Both use `min-h-[44px]` for WCAG-compliant touch targets

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus-visible states
- Screen reader friendly
- WCAG 2.2 Level AA compliant touch targets (44px minimum)
