# @total-audio/pr-autopilot

Multi-Agent PR Autopilot orchestration system for Total Audio Platform.

## Overview

The PR Autopilot is an **orchestration layer** that coordinates PR campaigns end-to-end using multiple cooperating agents. It integrates with existing TAP systems (Fusion Layer, CMG, Email Engine, List Builder, etc.) without reimplementing their functionality.

## Architecture

### Core Components

- **9 Specialized Agents**: Strategist, Pitch, Contact, Scheduler, Followup, Analyst, Archivist, Simulator, Coordinator
- **Mission/Task Model**: Structured work breakdown stored in Supabase
- **Policy Engine**: Safety constraints and behaviour rules
- **Run Engine**: Orchestration loop with mode-dependent execution
- **Context Builder**: Unified access to existing TAP subsystems

### Operation Modes

1. **Suggest Mode** (`suggest`): Human-in-the-loop - all actions require approval
2. **Semi-Auto Mode** (`semi_auto`): Safe actions auto-execute, critical actions need approval
3. **Full Auto Mode** (`full_auto`): Trusted operation within policy limits (agency accounts)

## Database Schema

6 new tables in `packages/core-db/supabase/migrations/20251117000001_pr_autopilot.sql`:

- `autopilot_missions` - High-level PR campaigns
- `autopilot_tasks` - Granular agent work items
- `autopilot_runs` - Execution session tracking
- `autopilot_logs` - Audit and debug logging
- `autopilot_policies` - Safety and behaviour policies
- `autopilot_settings` - User/workspace preferences

## Integration Points

The PR Autopilot **does not reimplement** existing systems. Instead, it integrates with:

- **Fusion Layer** (`@total-audio/fusion-layer`) - Unified context and intelligence
- **CMG** (Creative Memory Graph) - Campaign memory and learning
- **Email Engine** - Email campaigns and templates
- **List Builder** - Smart contact segments
- **Intel** - Contact enrichment and intelligence
- **Pitch Generator** - Pitch creation and personalization
- **Tracker** - Campaign tracking and analytics
- **Narrative Engine** - Story and outcome synthesis
- **Success Profiles** - Historical pattern matching

## Usage

```typescript
import { CoordinatorAgent, buildAgentContext } from '@total-audio/pr-autopilot';

// Create a mission
const mission = await createMission({
  userId: 'user-id',
  title: 'Album Launch Campaign',
  mode: 'suggest',
  config: {
    // Strategy config
  }
});

// Build context
const context = await buildAgentContext(mission.id);

// Run the coordinator
const coordinator = new CoordinatorAgent();
await coordinator.kickoffMission(mission.id);
```

## Agent Roles

| Agent | Purpose | Integrates With |
|-------|---------|-----------------|
| **StrategistAgent** | Campaign planning and strategy | Fusion Layer, CMG, Success Profiles |
| **PitchAgent** | Pitch generation orchestration | Pitch Generator, Narrative Engine |
| **ContactAgent** | Contact selection and pooling | Intel, Contact Intelligence, List Builder |
| **SchedulerAgent** | Send timing and scheduling | Success Profiles, Email Engine |
| **FollowupAgent** | Follow-up strategy and execution | Tracker, Reply Intelligence, CMG |
| **AnalystAgent** | Performance analysis and insights | Tracker, Fusion Layer, Narrative Engine |
| **ArchivistAgent** | Long-term memory and learning | CMG, Success Profiles |
| **SimulatorAgent** | What-if scenario simulation | All systems |
| **CoordinatorAgent** | System orchestration | All agents |

## Safety Features

- **RLS Policies**: Row-level security for multi-tenant safety
- **Policy Engine**: Configurable limits and constraints
- **Mode-Based Gating**: Approval gates based on operation mode
- **Audit Logging**: Complete audit trail in `autopilot_logs`
- **Contact Fatigue Protection**: Prevent over-messaging contacts
- **Quiet Hours**: Respect time-zone appropriate sending times

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck

# Run tests
pnpm test
```

## UI Routes

- `/autopilot` - Mission overview
- `/autopilot/new` - Create new mission
- `/autopilot/[missionId]` - Mission cockpit
- `/autopilot/[missionId]/runs` - Run history
- `/autopilot/[missionId]/tasks` - Task graph view

## API Routes

- `POST /api/autopilot/missions` - Create mission
- `GET /api/autopilot/missions` - List missions
- `GET /api/autopilot/missions/[id]` - Get mission detail
- `POST /api/autopilot/missions/[id]/run` - Trigger run
- `POST /api/autopilot/missions/[id]/simulate` - Run simulation
- `POST /api/autopilot/missions/[id]/pause` - Pause mission
- `POST /api/autopilot/tasks/[id]/approve` - Approve task
- `POST /api/autopilot/tasks/[id]/reject` - Reject task

## Design Principles

1. **Orchestration, Not Duplication**: Use existing systems, don't rebuild them
2. **Safety First**: Multiple layers of protection and approval gates
3. **Progressive Automation**: Start with suggestions, scale to full automation
4. **Transparency**: Complete visibility into agent decisions
5. **Modularity**: Each agent is independently testable and upgradable
6. **Learning**: Continuous improvement via CMG and Success Profiles

## License

UNLICENSED - Internal Total Audio Platform use only
