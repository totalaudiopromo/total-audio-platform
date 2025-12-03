# EmptyState & MilestoneToast Integration Guide

Quick start guide for integrating these components into Audio Intel, Pitch Generator, and Campaign Tracker.

## Installation (Already Complete)

Components are available in `@total-audio/ui` package:

```tsx
import { EmptyState, MilestoneToast, useMilestones } from '@total-audio/ui';
import type { EmptyStateProps, MilestoneToastProps, MilestoneType } from '@total-audio/ui';
```

## Quick Start: Empty States

Replace existing empty state implementations with the shared component:

### Before (Custom Implementation)

```tsx
<div className="text-centre p-8">
  <p>No contacts yet</p>
  <Link href="/contacts/new">Add Contact</Link>
</div>
```

### After (Shared Component)

```tsx
<EmptyState
  icon={<Users className="h-8 w-8 text-blue-600" />}
  title="No contacts yet"
  description="Start enriching contacts to build your database."
  primaryAction={{ label: 'Enrich Contacts', href: '/contacts/enrich' }}
/>
```

## Quick Start: Milestone Tracking

### Step 1: Add Milestone Container to Layout

```tsx
// app/layout.tsx or root layout component
'use client';

import { useState } from 'react';
import { MilestoneToast, type MilestoneType } from '@total-audio/ui';

interface MilestoneNotification {
  id: string;
  milestone: MilestoneType;
  count: number;
}

export default function RootLayout({ children }) {
  const [milestones, setMilestones] = useState<MilestoneNotification[]>([]);

  return (
    <html>
      <body>
        {children}

        {/* Milestone toast container */}
        <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
          {milestones.map(m => (
            <MilestoneToast
              key={m.id}
              id={m.id}
              milestone={m.milestone}
              count={m.count}
              onClose={id => setMilestones(prev => prev.filter(x => x.id !== id))}
            />
          ))}
        </div>
      </body>
    </html>
  );
}
```

### Step 2: Track Milestones in Feature Components

```tsx
// components/ContactEnrichment.tsx
'use client';

import { useMilestones } from '@total-audio/ui';

export function ContactEnrichment() {
  const { checkMilestone } = useMilestones();
  const [totalEnriched, setTotalEnriched] = useState(0);

  const handleEnrich = async () => {
    await enrichContact();
    const newTotal = totalEnriched + 1;
    setTotalEnriched(newTotal);

    // Check and trigger milestone if reached
    if (checkMilestone('contacts_enriched', newTotal)) {
      // Show milestone toast (via context, props, or global state)
      showMilestone('contacts_enriched', newTotal);
    }
  };

  return <button onClick={handleEnrich}>Enrich</button>;
}
```

## App-Specific Integration Examples

### Audio Intel: Contact Enrichment Milestones

```tsx
// apps/audio-intel/app/contacts/page.tsx
'use client';

import { EmptyState, useMilestones } from '@total-audio/ui';
import { Users } from 'lucide-react';

export default function ContactsPage() {
  const contacts = useContacts();
  const { checkMilestone } = useMilestones();

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8 text-blue-600" />}
        title="No contacts enriched yet"
        description="Start enriching contacts to build your verified database."
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

  return (
    <div>
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
```

### Pitch Generator: First Pitch Milestone

```tsx
// apps/pitch-generator/app/pitches/page.tsx
'use client';

import { EmptyState, useMilestones } from '@total-audio/ui';
import { Mail } from 'lucide-react';

export default function PitchesPage() {
  const pitches = usePitches();
  const { checkMilestone } = useMilestones();

  // Check for first pitch milestone
  useEffect(() => {
    if (pitches.length === 1) {
      if (checkMilestone('pitches_generated', 1)) {
        showMilestone('pitches_generated', 1);
      }
    }
  }, [pitches.length]);

  if (pitches.length === 0) {
    return (
      <EmptyState
        icon={<Mail className="h-8 w-8 text-blue-600" />}
        title="No pitches generated"
        description="Generate your first personalised pitch to start your outreach."
        valueReminder="Your authentic voice, scaled to hundreds of contacts"
        primaryAction={{
          label: 'Generate Pitch',
          href: '/pitches/new',
        }}
      />
    );
  }

  return <PitchList pitches={pitches} />;
}
```

### Campaign Tracker: Campaign Milestones

```tsx
// apps/tracker/app/campaigns/page.tsx
'use client';

import { EmptyState, useMilestones } from '@total-audio/ui';
import { Target } from 'lucide-react';

export default function CampaignsPage() {
  const campaigns = useCampaigns();
  const { checkMilestone } = useMilestones();

  // Check for campaign milestones
  useEffect(() => {
    const milestones = [1, 5, 10];
    milestones.forEach(threshold => {
      if (campaigns.length === threshold) {
        if (checkMilestone('campaigns_created', threshold)) {
          showMilestone('campaigns_created', threshold);
        }
      }
    });
  }, [campaigns.length]);

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={<Target className="h-8 w-8 text-blue-600" />}
        title="No campaigns yet"
        description="Create your first campaign to start tracking submissions."
        valueReminder="Track submissions, automate follow-ups, measure results"
        primaryAction={{
          label: 'Create Campaign',
          href: '/campaigns/new',
        }}
      />
    );
  }

  return <CampaignList campaigns={campaigns} />;
}
```

## Global Milestone Management Pattern (Recommended)

Create a context provider for global milestone management:

```tsx
// contexts/MilestoneContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MilestoneToast, useMilestones, type MilestoneType } from '@total-audio/ui';

interface MilestoneNotification {
  id: string;
  milestone: MilestoneType;
  count: number;
}

interface MilestoneContextType {
  showMilestone: (milestone: MilestoneType, count: number) => void;
}

const MilestoneContext = createContext<MilestoneContextType | null>(null);

export function MilestoneProvider({ children }: { children: ReactNode }) {
  const [milestones, setMilestones] = useState<MilestoneNotification[]>([]);
  const { checkMilestone } = useMilestones();

  const showMilestone = (milestone: MilestoneType, count: number) => {
    if (checkMilestone(milestone, count)) {
      setMilestones(prev => [
        ...prev,
        {
          id: `milestone-${Date.now()}`,
          milestone,
          count,
        },
      ]);
    }
  };

  const closeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return (
    <MilestoneContext.Provider value={{ showMilestone }}>
      {children}

      {/* Fixed milestone container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
        {milestones.map(m => (
          <MilestoneToast
            key={m.id}
            id={m.id}
            milestone={m.milestone}
            count={m.count}
            onClose={closeMilestone}
          />
        ))}
      </div>
    </MilestoneContext.Provider>
  );
}

export function useMilestoneNotifications() {
  const context = useContext(MilestoneContext);
  if (!context) {
    throw new Error('useMilestoneNotifications must be used within MilestoneProvider');
  }
  return context;
}
```

Then use it in your app:

```tsx
// app/layout.tsx
import { MilestoneProvider } from '@/contexts/MilestoneContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MilestoneProvider>{children}</MilestoneProvider>
      </body>
    </html>
  );
}

// Any component
import { useMilestoneNotifications } from '@/contexts/MilestoneContext';

function MyComponent() {
  const { showMilestone } = useMilestoneNotifications();

  const handleAction = () => {
    // ... your logic
    showMilestone('contacts_enriched', newTotal);
  };
}
```

## Testing

Both components include:

- SSR-safe localStorage access
- Proper TypeScript types
- WCAG 2.2 Level AA compliance (44px touch targets)
- Mobile-responsive design
- Keyboard navigation support

## Design Consistency

All components follow the Total Audio brutalist design system:

- Bold black borders (`border-4 border-black`)
- Hard shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`)
- Slate Cyan brand colour (`#3AA9BE`)
- 240ms transitions (ease-out)
- Black font weights (`font-black`)
- No gradients, no soft shadows, no glassmorphism

## Next Steps

1. Replace existing empty state implementations with `EmptyState`
2. Add `MilestoneProvider` to root layout
3. Track milestones at key user actions (enrich, generate, create)
4. Test milestone thresholds with real user data
5. Monitor localStorage usage (milestones are stored client-side)

## Support

For complete usage examples, see: `packages/ui/src/components/USAGE_EXAMPLES.md`
