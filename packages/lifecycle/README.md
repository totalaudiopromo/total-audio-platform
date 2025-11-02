# @total-audio/lifecycle

User lifecycle tracking and email automation package for Total Audio Platform.

## Features

- **Lifecycle Stage Tracking** - Track users through TRIAL → ACTIVE → AT_RISK → CHURNED → REACTIVATED
- **Engagement Scoring** - Calculate 0-100 engagement scores based on activity, frequency, recency, and adoption
- **Email Automation** - Automated ConvertKit email campaigns based on lifecycle transitions
- **Churn Prevention** - Predict churn risk and trigger win-back campaigns
- **Type-Safe** - Full TypeScript support with strict type checking

## Installation

```bash
pnpm add @total-audio/lifecycle
```

## Quick Start

### Determine Lifecycle Stage

```typescript
import { determineLifecycleStage, LifecycleStage } from '@total-audio/lifecycle';

const stage = determineLifecycleStage({
  hasPayment: true,
  daysSinceLastActivity: 2,
  engagementScore: 75,
  subscriptionStatus: 'active',
  daysSinceSignup: 30,
});

console.log(stage); // LifecycleStage.ACTIVE
```

### Calculate Engagement Score

```typescript
import { calculateEngagementScore, type EngagementMetrics } from '@total-audio/lifecycle';

const metrics: EngagementMetrics = {
  userId: 'user-123',
  periodStart: new Date('2025-10-01'),
  periodEnd: new Date('2025-10-31'),
  loginCount: 15,
  enrichmentCount: 8,
  exportCount: 3,
  spreadsheetUploadCount: 2,
  contactsEnriched: 45,
  daysSinceLastLogin: 1,
  daysSinceLastEnrichment: 2,
  consecutiveDaysActive: 5,
  featuresUsed: ['enrichment', 'export', 'templates'],
  hasCompletedOnboarding: true,
};

const score = calculateEngagementScore(metrics);

console.log(score);
// {
//   userId: 'user-123',
//   score: 78,
//   breakdown: { activity: 35, frequency: 25, recency: 18, adoption: 8 },
//   calculatedAt: 2025-11-02T...
// }
```

### Schedule Email Campaigns

```typescript
import {
  scheduleEmailCampaigns,
  type LifecycleTransition,
  LifecycleStage,
} from '@total-audio/lifecycle';

const transition: LifecycleTransition = {
  from: LifecycleStage.ACTIVE,
  to: LifecycleStage.AT_RISK,
  reason: 'No activity for 7 days',
  timestamp: new Date(),
  triggeredBy: 'system',
};

const user = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
};

const campaigns = scheduleEmailCampaigns(transition, user, engagementScore);

console.log(campaigns);
// [
//   {
//     triggerId: 'at_risk_engagement',
//     scheduledAt: Date (1 day from now),
//     status: 'scheduled',
//     ...
//   },
//   {
//     triggerId: 'at_risk_help_offer',
//     scheduledAt: Date (5 days from now),
//     status: 'scheduled',
//     ...
//   }
// ]
```

### Execute ConvertKit Campaigns

```typescript
import { ConvertKitClient, executeCampaign } from '@total-audio/lifecycle';

const convertKit = new ConvertKitClient(
  process.env.CONVERTKIT_API_KEY,
  process.env.CONVERTKIT_API_SECRET
);

const result = await executeCampaign(campaign, trigger, convertKit);

if (result.success) {
  console.log('Campaign sent successfully');
} else {
  console.error('Campaign failed:', result.error);
}
```

## API Reference

### Lifecycle Stages

```typescript
enum LifecycleStage {
  TRIAL = 'trial',
  ACTIVE = 'active',
  AT_RISK = 'at_risk',
  CHURNED = 'churned',
  REACTIVATED = 'reactivated',
}
```

### Stage Transition Rules

- **TRIAL → ACTIVE**: User makes first payment
- **ACTIVE → AT_RISK**: No activity for 7 days OR engagement score < 40
- **AT_RISK → CHURNED**: No activity for 30 days OR subscription cancelled
- **AT_RISK → ACTIVE**: User re-engages
- **CHURNED → REACTIVATED**: User returns and engages
- **REACTIVATED → ACTIVE**: Sustained engagement for 7 days

### Engagement Score Breakdown

- **Activity (0-40 points)**: Weighted actions (enrichments, exports, logins)
- **Frequency (0-30 points)**: Consistency of usage over time
- **Recency (0-20 points)**: How recently user was active
- **Adoption (0-10 points)**: Feature usage and onboarding completion

### Email Triggers

Automated email campaigns triggered by lifecycle transitions:

- **Trial Stage**:
  - Welcome Email (immediate)
  - Day 3 Getting Started Tips
  - Day 7 Upgrade to Pro

- **Active Stage**:
  - Welcome to Pro (immediate)
  - Power User Tips (day 14)

- **At-Risk Stage**:
  - Re-engagement Email (day 1)
  - Support Offer (day 5)
  - Win-back Offer (day 10)

- **Churned Stage**:
  - Exit Survey (day 2)
  - Quarterly Check-in (day 90)

- **Reactivated Stage**:
  - Welcome Back (immediate)

## Environment Variables

```bash
# ConvertKit API credentials
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_API_SECRET=your_api_secret

# ConvertKit Form IDs
CONVERTKIT_TRIAL_WELCOME_FORM=form_id
CONVERTKIT_TRIAL_TIPS_FORM=form_id
CONVERTKIT_TRIAL_CONVERT_FORM=form_id
CONVERTKIT_ACTIVE_WELCOME_FORM=form_id
CONVERTKIT_POWER_TIPS_FORM=form_id
CONVERTKIT_AT_RISK_FORM=form_id
CONVERTKIT_HELP_OFFER_FORM=form_id
CONVERTKIT_WIN_BACK_FORM=form_id
CONVERTKIT_CHURNED_SURVEY_FORM=form_id
CONVERTKIT_CHURNED_CHECKIN_FORM=form_id
CONVERTKIT_REACTIVATED_FORM=form_id

# ConvertKit Tag IDs
CONVERTKIT_TRIAL_TAG=tag_id
CONVERTKIT_ACTIVE_TAG=tag_id
CONVERTKIT_AT_RISK_TAG=tag_id
CONVERTKIT_CHURNED_TAG=tag_id
CONVERTKIT_REACTIVATED_TAG=tag_id
```

## Development

```bash
# Build package
pnpm build

# Watch mode
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## License

MIT
