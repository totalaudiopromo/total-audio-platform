# @total-audio/meshos

**MeshOS** - Universal Multi-Agent Coordination Layer for Total Audio Platform

## Overview

MeshOS is the orchestration/coordination layer that sits ABOVE all agents and systems. It provides:

- **Cross-system messaging** - Message routing between systems
- **Multi-agent negotiation** - Conflict resolution and priority allocation
- **Long-range planning** - 7-day, 30-day, 90-day plans
- **Drift detection** - Identify contradictions between systems
- **Insight routing** - Distribute insights to appropriate destinations
- **Policy enforcement** - Global rules and constraints
- **Global context** - System-wide awareness

## Critical Rule: READ-ONLY Integration

MeshOS **ONLY READS** from existing systems via adapters.
It **ONLY WRITES** to its own `mesh_*` tables.

## Installation

```bash
pnpm install @total-audio/meshos
```

## Usage

```typescript
import { MeshOrchestrator } from '@total-audio/meshos';

// Initialize orchestrator
const orchestrator = new MeshOrchestrator({
  workspace_id: 'workspace-123',
  enable_auto_planning: true,
  enable_auto_drift_detection: true,
  enable_auto_negotiation: true,
  policy: {
    quiet_hours: { start: '22:00', end: '08:00', timezone: 'Europe/London' },
    contact_fatigue: {
      max_contacts_per_day: 50,
      max_contacts_per_week: 200,
      min_days_between_contacts: 2,
    },
  },
});

// Start orchestration
await orchestrator.start();

// Get global context
const context = await orchestrator.getGlobalContext();

// Generate plan
const plan = await orchestrator.triggerPlanning('7d');
```

## Features

### 7 Core Engines

1. **PolicyEngine** - Global policy enforcement
2. **MessageRouter** - Cross-system messaging
3. **PlanningEngine** - Long-range plan generation
4. **NegotiationEngine** - Multi-agent negotiation
5. **DriftEngine** - Drift/contradiction detection
6. **GlobalContextEngine** - System-wide context
7. **InsightRouter** - Insight distribution

### 10 READ-ONLY Adapters

- AutopilotAdapter
- MalAdapter
- CoachAdapter
- TalentAdapter
- ScenesAdapter
- MigAdapter
- CmgAdapter
- FusionAdapter
- IdentityKernelAdapter
- RcfAdapter

### 5 Database Stores

- MeshMessageStore
- MeshStateStore
- MeshPlanStore
- MeshNegotiationStore
- MeshInsightRouteStore

## Documentation

See `MESHOS_IMPLEMENTATION.md` for complete implementation details, examples, and architecture documentation.

## License

Private - Total Audio Platform
