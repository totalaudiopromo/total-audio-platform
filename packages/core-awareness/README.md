# Core Awareness Layer (CAL)

**Top-level meta-intelligence system for Total Audio**

> MISSION: Observe, reason, predict, and recommend across ALL major subsystems
> CONSTRAINT: NEVER execute - only observe and suggest

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Components](#core-components)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

The Core Awareness Layer is a top-level meta-intelligence system that monitors, analyzes, and provides insights across all Total Audio subsystems. It operates as a **READ-ONLY** observer, never directly executing actions but instead generating recommendations and signals for downstream systems.

### Key Capabilities

- **Event Ingestion**: Collect events from all subsystems
- **Cross-System Correlation**: Detect patterns and relationships
- **Predictive Forecasting**: Short-term (7d) and medium-term (30-45d) trajectories
- **Risk & Opportunity Detection**: Identify strategic insights
- **Recommendation Generation**: Actionable suggestions for each subsystem
- **Signal Communication**: Push-based interface for downstream consumption

### Integration Points (READ-ONLY)

- **Fusion Layer**: Contextual awareness
- **CMG (Creative Metadata Graph)**: Creative fingerprints and quality scores
- **MIG (Microgenre Intelligence Graph)**: Scene momentum and clustering
- **Identity Kernel**: Artist identity and narrative cohesion
- **Dashboard**: Current system state
- **Scenes Engine**: Active scenes and positioning
- **PR Autopilot**: Mission states and phases
- **MAL (Marketing Automation Layer)**: Workflow states
- **CIS (Creative Intelligence System)**: Creative assets
- **Email Engine**: Campaign metrics
- **Tracker**: Campaign tracking data
- **RCF (Recommendation & Choice Framework)**: Recommendation patterns

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CORE AWARENESS LAYER                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Observer │→ │ Reasoner │→ │ Predictor │→ │ Recommender  │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────────┘  │
│       ↓             ↓              ↓                ↓          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Awareness Store (Database + Cache)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│       ↓                                                   ↓     │
│  ┌──────────┐                                       ┌─────────┐│
│  │ Signals  │  (Push to downstream)                 │ Metrics ││
│  └──────────┘                                       └─────────┘│
└─────────────────────────────────────────────────────────────────┘
         ↑                                                   ↓
┌────────────────────┐                           ┌──────────────────┐
│  Integrations      │  (READ-ONLY)              │  Target Systems  │
│  - Fusion Layer    │                           │  - Autopilot     │
│  - CMG             │                           │  - MAL           │
│  - MIG             │                           │  - Dashboard     │
│  - Identity Kernel │                           │  - CIS           │
│  - ...etc          │                           │  - ...etc        │
└────────────────────┘                           └──────────────────┘
```

### Data Flow

1. **Observation**: Events ingested from all subsystems
2. **Reasoning**: Cross-system correlation, mismatch, opportunity, and risk detection
3. **Prediction**: Trajectory forecasting (short-term and medium-term)
4. **Recommendation**: Generate actionable suggestions for each target system
5. **Communication**: Push signals and persist recommendations
6. **Snapshot**: Periodic system-wide state captures

## Installation

```bash
# Install the package
pnpm add @total-audio/core-awareness

# Or from the monorepo root
pnpm install
```

### Database Setup

Run the Core Awareness migration:

```bash
# From monorepo root
pnpm db:migrate

# Or manually apply the migration
psql -d your_database -f packages/db/migrations/20251117225651_core_awareness.sql
```

## Quick Start

### 1. Start the Background Observer

```typescript
import { startObserver } from '@total-audio/core-awareness';

// Start observer with 10-minute snapshot intervals
startObserver('user-123', 'workspace-456', 10);

// Observer will:
// - Run watchers every 30 minutes
// - Create snapshots every 10 minutes
// - Automatically ingest watcher-generated events
```

### 2. Ingest Events

```typescript
import { ingest } from '@total-audio/core-awareness';

await ingest({
  workspaceId: 'workspace-456',
  userId: 'user-123',
  eventType: 'campaign_sent',
  sourceSystem: 'email_engine',
  payload: {
    campaignId: 'campaign-789',
    sent: 150,
  },
  metadata: {},
});
```

### 3. Run Complete Awareness Cycle

```typescript
import { runAwarenessCycle } from '@total-audio/core-awareness';

const result = await runAwarenessCycle('user-123', 'workspace-456');

console.log(`Snapshot ID: ${result.snapshot.id}`);
console.log(`Recommendations: ${result.recommendations.length}`);
console.log(`Alerts: ${result.alerts.length}`);
console.log(`Signals: ${result.signals.length}`);
```

### 4. Retrieve Data for UI

```typescript
import { getRecentSnapshots, getPendingRecommendations } from '@total-audio/core-awareness';

// Get last 10 snapshots
const snapshots = await getRecentSnapshots('workspace-456', 'user-123', 10);

// Get pending recommendations
const recommendations = await getPendingRecommendations('workspace-456', 'user-123', 20);
```

## Core Components

### Observer

Event ingestion and background monitoring.

```typescript
import {
  ingest,
  ingestBatch,
  runWatchers,
  createPeriodicSnapshot,
  startObserver,
  stopObserver
} from '@total-audio/core-awareness';

// Ingest single event
await ingest(event);

// Ingest batch
await ingestBatch([event1, event2, event3]);

// Manually run watchers
const results = await runWatchers('user-123', 'workspace-456');

// Create snapshot
await createPeriodicSnapshot('user-123', 'workspace-456');
```

**Watchers:**
- `stalledCampaigns`: Detect low-performing campaigns
- `creativeStagnation`: Monitor creative quality decline
- `sceneMovement`: Track scene momentum spikes
- `replySurges`: Detect reply rate surges
- `pressDrought`: Alert on coverage droughts
- `contactFatigue`: Monitor declining engagement

### Reasoner

Cross-system correlation and pattern detection.

```typescript
import { reason } from '@total-audio/core-awareness';

const result = await reason({
  fusionContext,
  cmgFingerprints,
  migClusters,
  identityProfile,
  autopilotStates,
  malStates,
  campaignMetrics,
  creativeAssets,
  recentEvents,
});

console.log(result.correlations); // Cross-system patterns
console.log(result.mismatches);   // Strategic misalignments
console.log(result.opportunities); // Time-sensitive opportunities
console.log(result.risks);        // Potential risks
```

### Predictor

Trajectory forecasting and inflection point detection.

```typescript
import { predict } from '@total-audio/core-awareness';

const result = await predict({
  campaignMetrics,
  migClusters,
  cmgFingerprints,
  autopilotStates,
  malStates,
});

console.log(result.shortTermTrajectory);  // 7-day forecast
console.log(result.mediumTermTrajectory); // 30-45 day forecast
console.log(result.scores);               // Predictive scores
```

### Recommender

Generate actionable recommendations for each target system.

```typescript
import { recommend } from '@total-audio/core-awareness';

const result = await recommend({
  reasoning: reasoningResult,
  predictions: predictionResult,
  integrationData,
});

console.log(result.recommendations); // Persisted recommendations
console.log(result.signals);         // Signals for downstream systems
```

### Metrics

Performance scoring across all dimensions.

```typescript
import { calculateAllScores } from '@total-audio/core-awareness';

const scores = calculateAllScores({
  cmgFingerprints,
  migClusters,
  identityProfile,
  autopilotStates,
  malStates,
  campaignMetrics,
});

// All scores are 0-1 range
console.log(scores.momentum);           // Overall system momentum
console.log(scores.identity_cohesion);  // Identity alignment
console.log(scores.scene_alignment);    // Scene positioning
console.log(scores.creative_quality);   // Creative output quality
console.log(scores.press_effectiveness); // PR campaign success
console.log(scores.burnout_risk);       // Creative burnout risk
console.log(scores.fatigue_risk);       // Contact fatigue risk
console.log(scores.lift_potential);     // PR breakthrough potential
console.log(scores.freshness);          // Creative freshness
```

### Alerts

Risk and opportunity alert generation.

```typescript
import {
  generateRiskAlerts,
  generateOpportunityAlerts,
  generateMismatchAlerts,
  filterAlerts,
  prioritizeAlerts,
  persistAlerts
} from '@total-audio/core-awareness';

// Generate alerts
const riskAlerts = generateRiskAlerts(risks);
const opportunityAlerts = generateOpportunityAlerts(opportunities);
const mismatchAlerts = generateMismatchAlerts(mismatches);

// Filter and prioritize
const allAlerts = [...riskAlerts, ...opportunityAlerts, ...mismatchAlerts];
const filtered = filterAlerts(allAlerts, { minSeverity: 'high' });
const prioritized = prioritizeAlerts(filtered);

// Persist as recommendations
await persistAlerts(prioritized, 'workspace-456', 'user-123');
```

### Signals

Push signals to downstream systems.

```typescript
import {
  pushToAutopilot,
  pushToMAL,
  pushToDashboard,
  pushToCIS,
  pushToIdentityKernel
} from '@total-audio/core-awareness';

// Push to Autopilot
await pushToAutopilot({
  workspaceId: 'workspace-456',
  userId: 'user-123',
  signalType: 'recommend_escalation',
  payload: { campaignId: 'campaign-789', reason: 'High reply rate' },
  confidence: 0.85,
  status: 'pending',
});

// Push to Dashboard
await pushToDashboard({
  workspaceId: 'workspace-456',
  userId: 'user-123',
  signalType: 'scene_momentum_alert',
  payload: { scene: 'UK-Indie-Electronic', momentum: 0.85 },
  confidence: 0.78,
  status: 'pending',
});
```

## API Reference

### REST API Endpoints

All API routes are available under `/api/awareness/`:

#### GET `/api/awareness/snapshots`

Get recent awareness snapshots.

**Query Parameters:**
- `workspaceId` (optional): Filter by workspace
- `userId` (optional): Filter by user
- `limit` (optional): Number of snapshots (default: 10)
- `latest` (optional): If "true", returns only the latest snapshot

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

#### GET `/api/awareness/recommendations`

Get pending recommendations.

**Query Parameters:**
- `workspaceId` (optional): Filter by workspace
- `userId` (optional): Filter by user
- `targetSystem` (optional): Filter by target system
- `limit` (optional): Number of recommendations (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 15
}
```

#### POST `/api/awareness/recommendations`

Mark a recommendation as resolved.

**Request Body:**
```json
{
  "recommendationId": "uuid"
}
```

#### GET `/api/awareness/signals`

Get signals by target system.

**Query Parameters:**
- `workspaceId` (optional): Filter by workspace
- `userId` (optional): Filter by user
- `targetSystem` (optional): Filter by target system
- `limit` (optional): Number of signals (default: 50)

#### POST `/api/awareness/signals`

Mark a signal as actioned.

**Request Body:**
```json
{
  "signalId": "uuid"
}
```

#### GET `/api/awareness/events`

Get recent events.

**Query Parameters:**
- `workspaceId` (optional): Filter by workspace
- `userId` (optional): Filter by user
- `timeRange` (optional): Time range (default: "24h")

#### POST `/api/awareness/events`

Ingest events.

**Request Body (single event):**
```json
{
  "workspaceId": "uuid",
  "userId": "uuid",
  "eventType": "campaign_sent",
  "sourceSystem": "email_engine",
  "payload": { ... },
  "metadata": { ... }
}
```

**Request Body (batch):**
```json
{
  "events": [
    { ... },
    { ... }
  ]
}
```

#### POST `/api/awareness/run-cycle`

Manually trigger awareness cycle.

**Request Body:**
```json
{
  "userId": "uuid",
  "workspaceId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "snapshotId": "uuid",
    "recommendationCount": 12,
    "alertCount": 8,
    "signalCount": 5,
    "snapshot": { ... },
    "recommendations": [ ... ],
    "alerts": [ ... ],
    "signals": [ ... ]
  }
}
```

## Usage Examples

See [`examples/usage-examples.ts`](./examples/usage-examples.ts) for comprehensive usage examples including:

- Starting the background observer
- Ingesting events from downstream systems
- Running manual awareness cycles
- Using individual components (reasoner, predictor, recommender)
- Pushing signals to downstream systems
- Retrieving data for UI components
- Complete integration examples

## Database Schema

### Tables

1. **`awareness_snapshots`**: System-wide state captures
2. **`awareness_events`**: Ingested events from all subsystems
3. **`awareness_signals`**: Signals pushed to downstream systems
4. **`awareness_recommendations`**: Generated recommendations

All tables include Row-Level Security (RLS) policies for multi-tenant isolation.

### Indexes

- Snapshots: `workspace_id`, `user_id`, `created_at`
- Events: `workspace_id`, `user_id`, `source_system`, `event_type`, `created_at`
- Signals: `workspace_id`, `user_id`, `target_system`, `status`, `created_at`
- Recommendations: `workspace_id`, `user_id`, `target_system`, `status`, `priority`, `created_at`

## Testing

```bash
# Run unit tests
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Run specific test file
pnpm test tests/end_to_end.test.ts
```

**Test Coverage:**
- Event ingestion
- Watcher execution
- Reasoning engine (correlations, mismatches, opportunities, risks)
- Prediction engine (trajectories, inflection points)
- Metrics calculation
- Alert generation
- Complete awareness cycle

## Configuration

### Observer Configuration

Customize watcher thresholds in `src/observer.ts`:

```typescript
const watcherConfigs: Record<string, WatcherConfig> = {
  stalledCampaigns: {
    enabled: true,
    intervalMinutes: 30,
    thresholds: {
      daysWithoutActivity: 7,
      minOpenRate: 0.15,
    },
  },
  // ... more watchers
};
```

### Cache TTLs

Customize integration cache TTLs in `src/integrations.ts`:

```typescript
const CACHE_TTL = {
  FUSION_CONTEXT: 2 * 60 * 1000,     // 2 minutes
  CMG_FINGERPRINTS: 5 * 60 * 1000,   // 5 minutes
  MIG_CLUSTERS: 10 * 60 * 1000,      // 10 minutes
  // ... more TTLs
};
```

## Contributing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/totalaudiopromo/total-audio-platform.git
cd total-audio-platform

# Install dependencies
pnpm install

# Build the core-awareness package
pnpm --filter @total-audio/core-awareness build

# Run tests
pnpm --filter @total-audio/core-awareness test
```

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Explicit types for all public functions
- Comprehensive JSDoc comments

### Testing Requirements

- All new features must include tests
- Maintain >80% code coverage
- E2E tests for complete workflows

## License

Proprietary - Total Audio Platform

---

## Architecture Principles

1. **READ-ONLY**: Never execute actions directly, only observe and recommend
2. **NO OVERLAP**: Must not duplicate logic from existing systems
3. **SIGNAL-BASED**: Downstream systems pull signals, Core Awareness pushes
4. **MULTI-TENANT**: Workspace and user isolation at database level
5. **PREDICTIVE**: Always look ahead, identify inflection points
6. **ACTIONABLE**: Every recommendation must be implementable

## System Boundaries

**Core Awareness MUST:**
- ✅ Observe system state
- ✅ Detect patterns and correlations
- ✅ Generate recommendations
- ✅ Push signals to downstream systems
- ✅ Track trends and trajectories
- ✅ Alert on risks and opportunities

**Core Awareness MUST NOT:**
- ❌ Send emails
- ❌ Create tasks or campaigns
- ❌ Modify contacts or creative assets
- ❌ Execute PR Autopilot or MAL actions
- ❌ Directly trigger Fusion Layer loading
- ❌ Duplicate existing system logic

---

For questions or support, contact the Total Audio development team.
