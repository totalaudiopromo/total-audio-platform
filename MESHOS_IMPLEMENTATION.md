# MeshOS Implementation - Phase 12

**Status**: ✅ Complete
**Date**: 2025-11-17
**Implementation**: Universal Multi-Agent Coordination Layer

---

## Overview

**MeshOS** is the orchestration/coordination layer that sits ABOVE all agents and systems in the Total Audio Platform. It provides cross-system messaging, multi-agent negotiation, long-range planning, drift detection, insight routing, policy enforcement, and global context awareness.

### Critical Rule: READ-ONLY Integration

MeshOS **ONLY READS** from existing systems via adapters.
It **ONLY WRITES** to its own `mesh_*` tables.

---

## 1. Database Migration

**File**: `packages/core-db/supabase/migrations/20251117000001_meshos.sql`

### Tables Created (6 tables):

1. **mesh_messages** - Cross-system messaging backbone
   - Routes messages between systems (Autopilot, CoachOS, Talent Radar, etc.)
   - Tracks status: pending → processing → completed/failed

2. **mesh_state** - Global mesh state (key-value store)
   - Workspace-scoped state management
   - Updated timestamps for freshness tracking

3. **mesh_negotiations** - Multi-agent negotiation records
   - Participants, context, strategy, results, confidence
   - Strategies: consensus, weighted, risk-adjusted, opportunity

4. **mesh_plans** - Long-range plans (7d, 30d, 90d)
   - Objectives, actions, milestones, risks, opportunities
   - Confidence scoring and validity tracking

5. **mesh_insight_routes** - Insight routing rules
   - Routes insights to: Dashboard, OperatorOS, Autopilot, CoachOS, etc.
   - Priority-based routing with enable/disable toggles

6. **mesh_drift_reports** - Drift detection reports
   - Detects contradictions between systems
   - Drift score (0-1), recommended corrections
   - Status tracking: detected → acknowledged → correcting → resolved

### Helper Functions:

- `get_latest_mesh_plan(workspace_id, timeframe)` - Get active plan
- `get_active_drift_reports(workspace_id)` - Get unresolved drift
- `upsert_mesh_state(workspace_id, key, value)` - Update state

### RLS Policies:

All tables have workspace-scoped read/write policies.

---

## 2. @total-audio/meshos Package

**Location**: `packages/meshos/`

### Package Structure:

```
packages/meshos/
├── package.json
├── tsconfig.json
├── .gitignore
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── time.ts
│   │   └── math.ts
│   ├── engines/
│   │   ├── policyEngine.ts
│   │   ├── planningEngine.ts
│   │   ├── driftEngine.ts
│   │   ├── negotiationEngine.ts
│   │   ├── messageRouter.ts
│   │   ├── globalContextEngine.ts
│   │   └── insightRouter.ts
│   ├── adapters/
│   │   ├── autopilotAdapter.ts
│   │   ├── malAdapter.ts
│   │   ├── coachAdapter.ts
│   │   ├── talentAdapter.ts
│   │   ├── scenesAdapter.ts
│   │   ├── migAdapter.ts
│   │   ├── cmgAdapter.ts
│   │   ├── fusionAdapter.ts
│   │   ├── identityKernelAdapter.ts
│   │   └── rcfAdapter.ts
│   ├── stores/
│   │   ├── meshMessageStore.ts
│   │   ├── meshStateStore.ts
│   │   ├── meshPlanStore.ts
│   │   ├── meshNegotiationStore.ts
│   │   └── meshInsightRouteStore.ts
│   └── orchestrator/
│       └── meshOrchestrator.ts
└── tests/
    ├── radarIntegration.test.ts
    ├── negotiationEngine.test.ts
    ├── driftEngine.test.ts
    ├── planningEngine.test.ts
    └── messageRouter.test.ts
```

---

## 3. Core Types (types.ts)

### Message Types:
- **MessageSource**: autopilot, mal, coachOS, talentRadar, scenesEngine, etc.
- **MessageTarget**: meshOS, planning, negotiation, insight, policy, drift, context
- **MessageType**: request, response, notification, negotiation, insight, drift, query
- **MessageStatus**: pending, processing, completed, failed

### Negotiation Types:
- **NegotiationStrategy**: consensus, weighted, risk-adjusted, opportunity
- **NegotiationStatus**: pending, in_progress, completed, failed

### Planning Types:
- **PlanTimeframe**: 7d, 30d, 90d
- **MeshPlan**: objectives, actions, milestones, risks, opportunities

### Drift Types:
- **DriftType**: creative_vs_campaign, scene_vs_pitch, segment_vs_autopilot, etc.
- **DriftStatus**: detected, acknowledged, correcting, resolved, ignored

### Insight Types:
- **InsightType**: opportunity, threat, drift, momentum, coverage, talent, scene, performance, risk
- **InsightDestination**: dashboard, autopilot, coachOS, talentRadar, scenesEngine, operatorOS, etc.

### Policy Types:
- **GlobalPolicy**: quiet_hours, contact_fatigue, risk_ceilings, autonomy_caps, token_budgets, rate_limiting, ethical_constraints

### Context Types:
- **SystemState**: health, load, metrics, alerts
- **GlobalContext**: systems, negotiations, plans, drift, opportunities, threats, contradictions

---

## 4. Utilities

### logger.ts
- Log levels: DEBUG, INFO, WARN, ERROR
- Contextual logging with timestamps
- Simple console-based logger

### time.ts
- `now()` - Current ISO timestamp
- `addDays()`, `daysFromNow()`, `isPast()`, `isFuture()`
- `formatDuration()` - Human-readable durations
- `getTimeframeEnd()` - Calculate plan end dates
- `isQuietHours()` - Check if timestamp is in quiet period

### math.ts
- `clamp()`, `normalize()`, `weightedAverage()`
- `calculateConfidence()` - Data quality-based confidence
- `calculateRisk()` - Probability × Impact × Uncertainty
- `calculateOpportunityValue()` - Benefit vs Effort
- `calculateDrift()` - Expected vs Actual drift score
- `calculateConsensus()` - Participant agreement score
- `exponentialDecay()`, `sigmoid()` - Mathematical helpers

---

## 5. Engines

### 5.1 policyEngine.ts

**Purpose**: Global policy enforcement

**Features**:
- `isActionAllowed()` - Check if action passes policy checks
- `requiresApproval()` - Determine if human approval needed
- `getPolicySummary()` - Get current policies
- `simulatePolicyImpact()` - Test policy on proposed actions
- `checkTokenBudget()` - Monitor token usage

**Policy Checks**:
- Quiet hours enforcement
- Contact fatigue limits
- Risk ceilings
- Autonomy caps
- Token budgets (daily/monthly)
- Rate limiting
- Ethical constraints

### 5.2 messageRouter.ts

**Purpose**: Route messages between systems

**Features**:
- `routeMessage()` - Route to appropriate engine
- `sendMessage()` - Send cross-system message
- `getMessagesForSystem()` - Retrieve system messages
- `markProcessed()` / `markFailed()` - Update message status

**Routing Targets**:
- planning, negotiation, drift, insight, policy, context

### 5.3 planningEngine.ts

**Purpose**: Generate long-range plans

**Features**:
- Generate 7-day, 30-day, 90-day plans
- Integrate data from all systems
- Create objectives, actions, milestones
- Identify risks and opportunities
- Calculate plan confidence

**Inputs**:
- Autopilot state
- CoachOS weekly goals
- Talent Radar opportunities
- Scenes momentum
- Campaign calendar
- Creative arcs (CMG)

### 5.4 negotiationEngine.ts

**Purpose**: Multi-agent negotiation

**Strategies**:
- **Consensus**: Equal weight, maximize agreement
- **Weighted**: Priority-based, higher priority wins
- **Risk-Adjusted**: Balance opportunity vs risk
- **Opportunity**: Maximize value, minimize effort

**Features**:
- `negotiate()` - Run negotiation process
- `calculateUtility()` - Utility scoring per participant
- `resolveConflict()` - Tie-breaking logic
- `getConsensusScore()` - Agreement measurement

### 5.5 driftEngine.ts

**Purpose**: Detect system drift/contradictions

**Drift Types Detected**:
- Creative direction vs campaign actions
- Scene momentum vs pitch timing
- Segment updates vs Autopilot plans
- RCF events vs goals
- Coverage patterns vs strategy
- Identity Kernel vs actions
- Timing drift, priority conflicts

**Features**:
- `detectDrift()` - Analyze system states
- `calculateDriftScore()` - Quantify misalignment (0-1)
- `generateCorrections()` - Suggest resolution steps
- `trackDriftHistory()` - Monitor drift trends

### 5.6 globalContextEngine.ts

**Purpose**: Build global system context

**Context Components**:
- System health & load
- Active negotiations
- Active plans (7d, 30d, 90d)
- Drift reports summary
- Opportunities (value, window)
- Threats (severity, mitigation)
- Contradictions (systems, description)

**Features**:
- `buildContext()` - Aggregate all system states
- `getSystemHealth()` - Per-system health check
- `identifyOpportunities()` - Cross-system opportunity detection
- `identifyThreats()` - Risk aggregation
- `detectContradictions()` - Find conflicts

### 5.7 insightRouter.ts

**Purpose**: Route insights to appropriate destinations

**Routing Rules**:
- Priority-based (1-10)
- Condition-based filtering
- Destination mapping:
  - opportunity → Talent Radar, Dashboard
  - threat → Autopilot, OperatorOS
  - drift → Dashboard, CoachOS
  - momentum → Scenes Engine, Dashboard
  - coverage → ANR, Dashboard

**Features**:
- `routeInsight()` - Determine destination(s)
- `createRoute()` - Define new routing rule
- `evaluateRule()` - Check if rule applies
- `transformInsight()` - Format for destination

---

## 6. Adapters (READ-ONLY)

All adapters follow the same pattern:
- **READ-ONLY** - Never write to source systems
- Return `AdapterReadResult<T>` with success/error handling
- Timestamped reads for freshness tracking

### 6.1 autopilotAdapter.ts
- `getAutopilotState()` - Current state, active missions
- `getMissionStatus()` - Per-mission progress
- `getActiveFlows()` - Running MAL flows

### 6.2 malAdapter.ts
- `getActiveFlows()` - Current automation flows
- `getFlowStatus()` - Flow execution state
- `getFlowMetrics()` - Performance metrics

### 6.3 coachAdapter.ts
- `getWeeklyFocus()` - Current week priorities
- `getArtistGoals()` - Artist-level objectives
- `getCoachingInsights()` - Recent recommendations

### 6.4 talentAdapter.ts
- `getOpportunities()` - Active talent opportunities
- `getTalentScores()` - Talent rating data
- `getRadarAlerts()` - High-value alerts

### 6.5 scenesAdapter.ts
- `getSceneMomentum()` - Scene movement metrics
- `getActiveScenes()` - Current scene contexts
- `getSceneInsights()` - Scene-based recommendations

### 6.6 migAdapter.ts
- `getMissionGraph()` - Mission intelligence data
- `getMissionContext()` - Contextual mission info
- `getKnowledgeGraph()` - Knowledge relationships

### 6.7 cmgAdapter.ts
- `getCreativeArcs()` - Artist creative trajectories
- `getIdentityState()` - Artist identity consistency
- `getMusicMarkers()` - Creative milestones

### 6.8 fusionAdapter.ts
- `getFusionState()` - Data layer state
- `getUnifiedData()` - Cross-system data
- `getDataQuality()` - Data quality metrics

### 6.9 identityKernelAdapter.ts
- `getIdentityProfile()` - Artist identity core
- `getConsistencyScore()` - Identity drift measurement
- `getIdentityEvolution()` - Identity changes over time

### 6.10 rcfAdapter.ts
- `getRecentEvents()` - Real Coverage Flow events
- `getCoverageMetrics()` - Coverage analytics
- `getCoveragePatterns()` - Press pattern analysis

---

## 7. Stores (Database Interaction)

All stores use Supabase client for database operations.

### 7.1 meshMessageStore.ts
- `createMessage()` - Insert new message
- `getMessages()` - Query messages with filters
- `updateMessage()` - Update message status
- `deleteMessage()` - Remove message

### 7.2 meshStateStore.ts
- `setState()` - Upsert key-value state
- `getState()` - Retrieve state by key
- `getAllState()` - Get all workspace state
- `deleteState()` - Remove state key

### 7.3 meshPlanStore.ts
- `createPlan()` - Insert new plan
- `getLatestPlan()` - Get active plan for timeframe
- `updatePlan()` - Update plan status
- `archivePlan()` - Mark plan as superseded

### 7.4 meshNegotiationStore.ts
- `createNegotiation()` - Start negotiation
- `getNegotiations()` - Query negotiations
- `updateNegotiation()` - Update negotiation status
- `completeNegotiation()` - Finalize with result

### 7.5 meshInsightRouteStore.ts
- `createRoute()` - Define routing rule
- `getRoutes()` - Get all routes
- `updateRoute()` - Modify route
- `toggleRoute()` - Enable/disable route

---

## 8. Main Orchestrator

### meshOrchestrator.ts

**Purpose**: Main coordination loop that ties everything together

**Initialization**:
```typescript
const orchestrator = new MeshOrchestrator({
  workspace_id: 'workspace-123',
  enable_auto_planning: true,
  enable_auto_drift_detection: true,
  enable_auto_negotiation: true,
  policy: {
    quiet_hours: { start: '22:00', end: '08:00', timezone: 'Europe/London' },
    // ... other policies
  },
});
```

**Main Loop**:
1. **Collect Context** - Read from all adapters
2. **Detect Drift** - Identify contradictions
3. **Route Insights** - Distribute insights
4. **Process Messages** - Handle pending messages
5. **Run Negotiations** - Resolve conflicts
6. **Update Plans** - Refresh long-range plans
7. **Enforce Policy** - Validate actions
8. **Update Global Context** - Refresh mesh state

**Features**:
- `start()` - Begin orchestration loop
- `stop()` - Halt orchestration
- `getStatus()` - Get current status
- `triggerPlanning()` - Manual plan generation
- `triggerNegotiation()` - Manual negotiation
- `getGlobalContext()` - Get mesh context snapshot

---

## 9. Backend API Routes

**Location**: `apps/audio-intel/app/api/meshos/`

### Endpoints:

#### GET `/api/meshos/context`
- **Response**: Global mesh context
- **Use**: Dashboard overview, OperatorOS status

#### GET `/api/meshos/plan/7d`
- **Response**: 7-day tactical plan
- **Use**: Short-term action planning

#### GET `/api/meshos/plan/30d`
- **Response**: 30-day operational plan
- **Use**: Monthly strategy view

#### GET `/api/meshos/plan/90d`
- **Response**: 90-day strategic plan
- **Use**: Quarterly planning

#### GET `/api/meshos/negotiations`
- **Response**: Recent negotiations with results
- **Use**: Multi-agent decision tracking

#### GET `/api/meshos/messages`
- **Response**: Cross-system messages
- **Use**: Message log, debugging

#### POST `/api/meshos/messages`
- **Request**: `{ source, target, type, payload }`
- **Response**: Message ID
- **Use**: Send system message

#### GET `/api/meshos/drift`
- **Response**: Active drift reports
- **Use**: Drift dashboard, alerts

#### GET `/api/meshos/policy`
- **Response**: Current policy summary
- **Use**: Policy overview

#### POST `/api/meshos/policy/simulate`
- **Request**: Array of proposed actions
- **Response**: Simulation results (allowed, blocked, require approval)
- **Use**: Test policy impact

#### GET `/api/meshos/routes`
- **Response**: Insight routing rules
- **Use**: Route management

---

## 10. Frontend UI

**Location**: `apps/audio-intel/app/meshos/`

### Pages:

#### `/meshos` - MeshOS Overview
- Global context panel
- System health grid
- Active negotiations count
- Drift reports summary
- Quick actions

#### `/meshos/context` - Global Context
- System health visualization
- Load metrics per system
- Active negotiations timeline
- Opportunities/threats feed
- Contradiction alerts

#### `/meshos/drift` - Drift Dashboard
- Drift reports table
- Drift score chart (trend over time)
- Systems involved breakdown
- Recommended corrections
- Resolution tracking

#### `/meshos/plans` - Long-Range Plans
- 7d / 30d / 90d tabs
- Objectives grid
- Actions timeline
- Milestones calendar
- Risks & opportunities

#### `/meshos/negotiations` - Negotiation Timeline
- Chronological negotiation history
- Participants visualization
- Strategy used
- Confidence scores
- Outcomes

#### `/meshos/routes` - Insight Routing
- Routing rules table
- Create/edit rules
- Enable/disable toggles
- Priority ordering
- Route testing

### Components:

#### MeshContextPanel.tsx
- System grid with health indicators
- Metric sparklines
- Alert badges

#### NegotiationTimeline.tsx
- Timeline visualization
- Participant bubbles
- Decision outcomes

#### DriftMeter.tsx
- Drift score gauge (0-1)
- Systems involved tags
- Status indicator

#### LongRangePlanGrid.tsx
- Objectives cards
- Action timeline
- Dependency graph

#### PolicySummary.tsx
- Policy rules list
- Token budget meter
- Quiet hours indicator

#### InsightRouteTable.tsx
- Editable route rules
- Priority drag-and-drop
- Filter/condition builder

#### MultiAgentGraph.tsx
- Agent nodes
- Message flows
- Negotiation links

#### OpportunityOverview.tsx
- Opportunity cards
- Value vs effort chart
- Time window indicators

#### ConflictResolutionPanel.tsx
- Active conflicts
- Suggested resolutions
- Resolution actions

---

## 11. Example Outputs

### 11.1 Example 7-Day Plan

```json
{
  "id": "plan-7d-20251117",
  "workspace_id": "workspace-123",
  "timeframe": "7d",
  "plan": {
    "objectives": [
      {
        "id": "obj-1",
        "description": "Complete radio promotion campaign for Artist A - Track B",
        "priority": 10,
        "owner": "autopilot",
        "deadline": "2025-11-24T00:00:00Z",
        "dependencies": []
      },
      {
        "id": "obj-2",
        "description": "Capitalize on Scene X momentum spike",
        "priority": 8,
        "owner": "scenesEngine",
        "deadline": "2025-11-20T00:00:00Z",
        "dependencies": []
      },
      {
        "id": "obj-3",
        "description": "Follow up on 3 high-value talent opportunities",
        "priority": 7,
        "owner": "talentRadar",
        "deadline": "2025-11-22T00:00:00Z",
        "dependencies": []
      }
    ],
    "actions": [
      {
        "id": "action-1",
        "objective_id": "obj-1",
        "description": "Send personalized pitches to 15 BBC Radio 6 Music contacts",
        "system": "autopilot",
        "scheduled_for": "2025-11-18T10:00:00Z",
        "estimated_effort": 30,
        "status": "pending"
      },
      {
        "id": "action-2",
        "objective_id": "obj-2",
        "description": "Notify Artist A of Scene X momentum and suggest timing adjustment",
        "system": "coachOS",
        "scheduled_for": "2025-11-18T14:00:00Z",
        "estimated_effort": 15,
        "status": "pending"
      }
    ],
    "milestones": [
      {
        "date": "2025-11-20",
        "description": "Scene momentum window peak",
        "objectives": ["obj-2"]
      },
      {
        "date": "2025-11-24",
        "description": "Radio campaign completion",
        "objectives": ["obj-1"]
      }
    ],
    "risks": [
      {
        "description": "Scene momentum may fade if not acted on within 48 hours",
        "probability": 0.6,
        "impact": 0.7,
        "mitigation": "Priority boost for Scene X related actions"
      }
    ],
    "opportunities": [
      {
        "description": "Artist A mentioned by influential DJ - leverage for immediate pitch",
        "value": 0.85,
        "effort": 0.2,
        "window": "2025-11-18 to 2025-11-20"
      }
    ]
  },
  "confidence": 0.82,
  "generated_at": "2025-11-17T08:00:00Z",
  "valid_until": "2025-11-24T08:00:00Z",
  "status": "active"
}
```

### 11.2 Example 30-Day Plan

```json
{
  "id": "plan-30d-20251117",
  "workspace_id": "workspace-123",
  "timeframe": "30d",
  "plan": {
    "objectives": [
      {
        "id": "obj-1",
        "description": "Launch Artist B debut EP campaign across radio, press, and scenes",
        "priority": 10,
        "owner": "autopilot",
        "deadline": "2025-12-10T00:00:00Z"
      },
      {
        "id": "obj-2",
        "description": "Build Scene Y momentum ahead of festival season",
        "priority": 8,
        "owner": "scenesEngine",
        "deadline": "2025-12-15T00:00:00Z"
      },
      {
        "id": "obj-3",
        "description": "Develop 5 high-potential talent leads into active relationships",
        "priority": 7,
        "owner": "talentRadar",
        "deadline": "2025-12-17T00:00:00Z"
      }
    ],
    "actions": [
      {
        "id": "action-1",
        "objective_id": "obj-1",
        "description": "Pre-campaign identity audit for Artist B",
        "system": "identityKernel",
        "scheduled_for": "2025-11-19T00:00:00Z"
      },
      {
        "id": "action-2",
        "objective_id": "obj-1",
        "description": "Generate 50+ personalized pitches for EP launch",
        "system": "autopilot",
        "scheduled_for": "2025-11-25T00:00:00Z"
      }
    ],
    "milestones": [
      {
        "date": "2025-11-25",
        "description": "Artist B EP release announcement",
        "objectives": ["obj-1"]
      },
      {
        "date": "2025-12-10",
        "description": "EP launch week complete",
        "objectives": ["obj-1"]
      }
    ],
    "risks": [
      {
        "description": "Festival season booking window closes Dec 20 - urgency for Scene Y momentum",
        "probability": 0.5,
        "impact": 0.8,
        "mitigation": "Front-load Scene Y activities in early December"
      }
    ],
    "opportunities": [
      {
        "description": "3 high-profile festivals actively scouting Scene Y artists",
        "value": 0.9,
        "effort": 0.4,
        "window": "2025-11-20 to 2025-12-20"
      }
    ]
  },
  "confidence": 0.76,
  "generated_at": "2025-11-17T08:00:00Z",
  "valid_until": "2025-12-17T08:00:00Z",
  "status": "active"
}
```

### 11.3 Example Drift Report

```json
{
  "id": "drift-report-001",
  "workspace_id": "workspace-123",
  "drift_type": "creative_vs_campaign",
  "systems_involved": ["cmg", "autopilot", "identityKernel"],
  "drift_score": 0.72,
  "analysis": {
    "description": "Artist A's Identity Kernel shows evolution towards experimental electronic, but Autopilot campaign still targeting indie rock contacts",
    "specifics": {
      "cmg_creative_direction": "experimental electronic, ambient textures",
      "autopilot_target_segments": ["indie rock", "alternative rock"],
      "identity_kernel_drift": 0.68
    },
    "evidence": [
      {
        "system": "cmg",
        "state": { "latest_creative_arc": "experimental-electronic", "confidence": 0.85 },
        "timestamp": "2025-11-15T12:00:00Z"
      },
      {
        "system": "autopilot",
        "state": { "active_segment": "indie-rock-contacts", "contacts_targeted": 42 },
        "timestamp": "2025-11-16T09:00:00Z"
      },
      {
        "system": "identityKernel",
        "state": { "current_identity": "experimental-electronic-artist", "drift_from_baseline": 0.68 },
        "timestamp": "2025-11-17T07:00:00Z"
      }
    ]
  },
  "recommended_corrections": [
    {
      "system": "autopilot",
      "action": "Update target segment to 'experimental-electronic' and 'electronic-ambient'",
      "priority": 10,
      "rationale": "Align campaign with current creative direction"
    },
    {
      "system": "coachOS",
      "action": "Review Artist A's positioning and update weekly focus",
      "priority": 8,
      "rationale": "Ensure strategic alignment with identity evolution"
    },
    {
      "system": "identityKernel",
      "action": "Acknowledge identity evolution and update baseline",
      "priority": 6,
      "rationale": "Prevent future drift detection for intentional evolution"
    }
  ],
  "status": "detected",
  "detected_at": "2025-11-17T08:15:00Z"
}
```

### 11.4 Example Negotiation Document

```json
{
  "id": "negotiation-001",
  "workspace_id": "workspace-123",
  "participants": ["autopilot", "talentRadar", "scenesEngine", "coachOS"],
  "context": {
    "goal": "Determine priority allocation for Artist C - conflicting opportunities",
    "constraints": {
      "time_window": "2025-11-18 to 2025-11-22",
      "max_concurrent_actions": 3
    },
    "data": {
      "autopilot_priority": "Radio campaign for Track D",
      "talentRadar_priority": "High-value label meeting window",
      "scenesEngine_priority": "Scene Z momentum spike (72-hour window)",
      "coachOS_priority": "Focus on mental health and creative development this week"
    },
    "deadline": "2025-11-18T12:00:00Z"
  },
  "strategy": "weighted",
  "result": {
    "decision": "Prioritize Scene Z momentum (48h focus), then label meeting, defer radio campaign by 1 week",
    "rationale": "Scene Z momentum has highest time sensitivity (72h window, 0.85 value). Label meeting is moderate priority but strategic long-term value. Radio campaign has flexibility and can be rescheduled without significant impact.",
    "participants_agreement": {
      "autopilot": 0.65,
      "talentRadar": 0.92,
      "scenesEngine": 0.98,
      "coachOS": 0.78
    },
    "actions": [
      {
        "system": "scenesEngine",
        "action": "Activate Scene Z momentum actions (notify artist, suggest content, connect with scene contacts)",
        "priority": 10
      },
      {
        "system": "talentRadar",
        "action": "Confirm label meeting and prepare materials",
        "priority": 8
      },
      {
        "system": "autopilot",
        "action": "Reschedule Track D radio campaign to 2025-11-25",
        "priority": 5
      },
      {
        "system": "coachOS",
        "action": "Brief Artist C on priorities and ensure creative focus time is protected",
        "priority": 7
      }
    ]
  },
  "confidence": 0.83,
  "status": "completed",
  "created_at": "2025-11-17T10:30:00Z",
  "completed_at": "2025-11-17T10:32:15Z"
}
```

### 11.5 Example Mesh Context Snapshot

```json
{
  "workspace_id": "workspace-123",
  "timestamp": "2025-11-17T08:00:00Z",
  "systems": [
    {
      "system": "autopilot",
      "health": "healthy",
      "load": 0.62,
      "last_activity": "2025-11-17T07:55:00Z",
      "metrics": {
        "active_missions": 3,
        "pending_actions": 12,
        "success_rate_7d": 0.89
      },
      "alerts": []
    },
    {
      "system": "talentRadar",
      "health": "healthy",
      "load": 0.45,
      "last_activity": "2025-11-17T07:50:00Z",
      "metrics": {
        "active_opportunities": 8,
        "high_value_count": 3,
        "avg_talent_score": 0.76
      },
      "alerts": ["3 opportunities expiring within 48 hours"]
    },
    {
      "system": "scenesEngine",
      "health": "healthy",
      "load": 0.78,
      "last_activity": "2025-11-17T07:58:00Z",
      "metrics": {
        "active_scenes": 5,
        "momentum_spikes": 2,
        "avg_scene_health": 0.82
      },
      "alerts": ["Scene Z momentum spike detected - 72h window"]
    },
    {
      "system": "coachOS",
      "health": "healthy",
      "load": 0.33,
      "last_activity": "2025-11-17T07:45:00Z",
      "metrics": {
        "active_artists": 12,
        "weekly_goals_set": 12,
        "goal_completion_rate": 0.71
      },
      "alerts": []
    }
  ],
  "active_negotiations": 1,
  "active_plans": {
    "7d": true,
    "30d": true,
    "90d": true
  },
  "drift_reports": {
    "total": 3,
    "active": 1,
    "avg_score": 0.52
  },
  "opportunities": [
    {
      "type": "scene_momentum",
      "value": 0.85,
      "window": "72 hours"
    },
    {
      "type": "talent_discovery",
      "value": 0.78,
      "window": "48 hours"
    },
    {
      "type": "coverage_spike",
      "value": 0.65,
      "window": "7 days"
    }
  ],
  "threats": [
    {
      "type": "contact_fatigue",
      "severity": 0.42,
      "mitigation": "Rate limiting active, monitoring contact frequency"
    },
    {
      "type": "scene_momentum_decay",
      "severity": 0.38,
      "mitigation": "72-hour action window for Scene Z"
    }
  ],
  "contradictions": [
    {
      "systems": ["cmg", "autopilot", "identityKernel"],
      "description": "Creative direction drift from campaign targeting",
      "severity": 0.72
    }
  ]
}
```

### 11.6 Example Insight Routing Table

```json
[
  {
    "id": "route-001",
    "workspace_id": "workspace-123",
    "insight_type": "opportunity",
    "destination": "talentRadar",
    "rule": {
      "conditions": { "value": { "min": 0.7 } },
      "filters": { "type": ["talent_discovery", "label_interest"] }
    },
    "priority": 9,
    "enabled": true
  },
  {
    "id": "route-002",
    "workspace_id": "workspace-123",
    "insight_type": "threat",
    "destination": "operatorOS",
    "rule": {
      "conditions": { "severity": { "min": 0.6 } },
      "transformations": ["add_urgency_flag", "format_for_notification"]
    },
    "priority": 10,
    "enabled": true
  },
  {
    "id": "route-003",
    "workspace_id": "workspace-123",
    "insight_type": "drift",
    "destination": "dashboard",
    "rule": {
      "conditions": { "drift_score": { "min": 0.5 } }
    },
    "priority": 8,
    "enabled": true
  },
  {
    "id": "route-004",
    "workspace_id": "workspace-123",
    "insight_type": "momentum",
    "destination": "scenesEngine",
    "rule": {
      "conditions": { "type": "scene_spike" },
      "filters": { "window": ["72h", "48h"] }
    },
    "priority": 9,
    "enabled": true
  },
  {
    "id": "route-005",
    "workspace_id": "workspace-123",
    "insight_type": "performance",
    "destination": "anr",
    "rule": {
      "conditions": {},
      "transformations": ["aggregate_metrics", "generate_charts"]
    },
    "priority": 5,
    "enabled": true
  }
]
```

### 11.7 Example Message Exchange Transcript

```json
[
  {
    "id": "msg-001",
    "workspace_id": "workspace-123",
    "source": "scenesEngine",
    "target": "meshOS",
    "type": "notification",
    "payload": {
      "event": "momentum_spike",
      "scene_id": "scene-z",
      "momentum_score": 0.92,
      "window": "72h",
      "artist_ids": ["artist-c", "artist-d"]
    },
    "status": "completed",
    "result": {
      "negotiation_triggered": true,
      "negotiation_id": "negotiation-001",
      "insight_routed_to": ["dashboard", "coachOS", "talentRadar"]
    },
    "created_at": "2025-11-17T07:58:00Z",
    "processed_at": "2025-11-17T07:58:15Z"
  },
  {
    "id": "msg-002",
    "workspace_id": "workspace-123",
    "source": "autopilot",
    "target": "policy",
    "type": "request",
    "payload": {
      "action_type": "bulk_email_send",
      "contact_count": 45,
      "risk_score": 0.35,
      "timestamp": "2025-11-17T10:00:00Z"
    },
    "status": "completed",
    "result": {
      "allowed": true,
      "reason": "Within policy limits"
    },
    "created_at": "2025-11-17T09:55:00Z",
    "processed_at": "2025-11-17T09:55:02Z"
  },
  {
    "id": "msg-003",
    "workspace_id": "workspace-123",
    "source": "talentRadar",
    "target": "negotiation",
    "type": "request",
    "payload": {
      "opportunity_id": "opp-123",
      "opportunity_value": 0.88,
      "time_window": "48h",
      "conflicts_with": ["autopilot_mission_5", "scene_z_momentum"]
    },
    "status": "completed",
    "result": {
      "negotiation_id": "negotiation-001",
      "priority_assigned": 8,
      "scheduled_for": "2025-11-19T14:00:00Z"
    },
    "created_at": "2025-11-17T10:15:00Z",
    "processed_at": "2025-11-17T10:32:15Z"
  },
  {
    "id": "msg-004",
    "workspace_id": "workspace-123",
    "source": "identityKernel",
    "target": "drift",
    "type": "notification",
    "payload": {
      "artist_id": "artist-a",
      "drift_detected": true,
      "drift_type": "creative_evolution",
      "from_identity": "indie-rock-artist",
      "to_identity": "experimental-electronic-artist",
      "confidence": 0.85
    },
    "status": "completed",
    "result": {
      "drift_report_id": "drift-report-001",
      "systems_to_notify": ["autopilot", "coachOS", "cmg"],
      "recommended_corrections_generated": true
    },
    "created_at": "2025-11-17T07:30:00Z",
    "processed_at": "2025-11-17T08:15:00Z"
  }
]
```

---

## 12. Git Commit Summary

When ready to commit:

```bash
git add packages/core-db/supabase/migrations/20251117000001_meshos.sql
git add packages/meshos/
git add apps/audio-intel/app/api/meshos/
git add apps/audio-intel/app/meshos/
git add MESHOS_IMPLEMENTATION.md

git commit -m "feat(meshos): Implement Phase 12 - MeshOS universal coordination layer

COMPLETE IMPLEMENTATION - MeshOS Universal Multi-Agent Coordination Layer

Database Migration:
- 6 new tables: mesh_messages, mesh_state, mesh_negotiations, mesh_plans, mesh_insight_routes, mesh_drift_reports
- Helper functions for common operations
- Full RLS policies and indexes

New Package @total-audio/meshos:
- Core types and utilities (logger, time, math)
- 7 engines: policy, planning, drift, negotiation, messageRouter, globalContext, insightRouter
- 10 READ-ONLY adapters: autopilot, mal, coach, talent, scenes, mig, cmg, fusion, identityKernel, rcf
- 5 database stores: messages, state, plans, negotiations, insightRoutes
- Main MeshOrchestrator for coordination loop

Backend APIs:
- GET/POST /api/meshos/context, /plan/{7d,30d,90d}, /negotiations, /messages, /drift, /policy, /routes
- Policy simulation endpoint

Frontend UI:
- Pages: overview, context, drift, plans, negotiations, routes
- Components: context panel, negotiation timeline, drift meter, plan grid, policy summary, route table

Features:
✅ Cross-system messaging backbone
✅ Multi-agent negotiation (consensus, weighted, risk-adjusted, opportunity strategies)
✅ Long-range planning (7d, 30d, 90d with objectives, actions, milestones, risks, opportunities)
✅ Drift detection (creative vs campaign, scene vs pitch, segment vs autopilot, etc.)
✅ Insight routing (priority-based, condition-filtered)
✅ Global policy enforcement (quiet hours, contact fatigue, risk ceilings, autonomy caps, token budgets)
✅ Global context awareness (system health, load, opportunities, threats, contradictions)
✅ READ-ONLY adapters (no writes to other systems)

Examples included:
- 7d and 30d plans
- Drift reports with corrections
- Multi-agent negotiation documents
- Global context snapshots
- Insight routing tables
- Message exchange transcripts

MeshOS is the orchestration layer that sits ABOVE all systems.
It coordinates, reasons, plans, and maintains coherence WITHOUT replacing anything.

Flow State design compliance maintained throughout."
```

---

## 13. Final Notes

### What MeshOS IS:
- **Orchestration layer** - Coordinates systems
- **Reasoning engine** - Multi-agent negotiation
- **Planning system** - Long-range strategic plans
- **Drift detector** - Finds contradictions
- **Insight router** - Distributes insights
- **Policy enforcer** - Global rules
- **Context aggregator** - System-wide awareness

### What MeshOS IS NOT:
- **NOT a replacement** for any existing system
- **NOT writing** to other systems (READ-ONLY adapters)
- **NOT executing** campaigns (Autopilot/MAL handle execution)
- **NOT duplicating** existing logic

### Integration Points:
- **Adapters** read from systems
- **Insights** route to dashboards/systems
- **Negotiations** suggest actions (systems decide)
- **Plans** provide roadmaps (systems execute)
- **Drift reports** highlight issues (systems correct)

### Next Steps:
1. Run migration: `pnpm --filter @total-audio/core-db deploy-workspace-migrations`
2. Install dependencies: `pnpm install`
3. Build package: `cd packages/meshos && pnpm build`
4. Test APIs: Visit `/api/meshos/context`
5. Access UI: Visit `/meshos`

---

**Implementation Date**: 2025-11-17
**Status**: ✅ Complete
**Phase**: 12 - MeshOS
**Architecture**: Universal Multi-Agent Coordination Layer
