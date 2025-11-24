# @total-audio/automations-engine

**Marketing Automation Layer (MAL)** - Visual workflow builder and runtime engine for music marketing automations in TotalAudio Promo.

## Overview

The Marketing Automation Layer is a standalone, general-purpose workflow engine that enables users to create visual automation workflows for music marketing tasks. It provides:

- **Visual workflow builder** with node-based interface
- **Runtime execution engine** for processing automation flows
- **Event-driven architecture** for triggering automations
- **Safety limits** to prevent runaway executions
- **Complete audit trail** of all executions and steps

## Architecture

MAL is designed as a **consumption layer** that calls into existing TotalAudio systems:

```
┌─────────────────────────────────────┐
│   Marketing Automation Layer (MAL)  │
│   - Workflow Builder                │
│   - Runtime Engine                  │
│   - Event Bus                       │
└──────────────┬──────────────────────┘
               │ Calls INTO ↓
┌──────────────┴──────────────────────┐
│  Existing TAP Systems                │
│  - Email Engine                      │
│  - List Builder                      │
│  - Campaign Tracker                  │
│  - Release Planner                   │
│  - CMG (Success Fingerprints)        │
│  - Fusion Layer                      │
└──────────────────────────────────────┘
```

**Critical**: MAL does NOT reimplement any existing functionality. It orchestrates existing systems via thin client wrappers.

## Core Concepts

### Nodes

Workflows are composed of three types of nodes:

1. **Trigger Nodes** - Start a workflow
   - `email_open`, `email_click`, `email_reply`
   - `campaign_created`, `campaign_status_changed`
   - `asset_uploaded`, `release_approaching`
   - `manual_trigger`

2. **Condition Nodes** - Branch logic
   - `if_field_match`, `if_segment_contains`
   - `if_metric_greater`, `if_tag_present`
   - `if_time_elapsed`, `if_campaign_status`

3. **Action Nodes** - Execute operations
   - `send_email_campaign`, `schedule_followup`
   - `update_segment`, `tag_contact`
   - `create_release_task`, `notify_user`
   - `update_cmg_node`, `log_event`, `delay`

### Workflows (Flows)

A flow is a directed graph of nodes connected by edges. Each flow has:

- A unique trigger node (entry point)
- Zero or more condition and action nodes
- Edges that connect nodes (with optional condition labels)

### Executions

When a flow is triggered, an execution is created that:

- Records the trigger context (event data)
- Executes nodes in graph order
- Creates a step record for each node
- Tracks overall status (running, succeeded, failed, partial)

## Installation

```bash
# Install dependencies
pnpm install

# Build package
pnpm run build

# Run tests
pnpm run test

# Type check
pnpm run typecheck
```

## Usage

### Initialize Flow Store

```typescript
import { initFlowStore } from '@total-audio/automations-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
initFlowStore(supabase);
```

### Create a Flow

```typescript
import { createFlow } from '@total-audio/automations-engine';

const flow = await createFlow({
  userId: 'user_123',
  name: 'Post-Release Follow-Up',
  description: 'Send follow-up after 7 days if no reply',
  triggerType: 'event',
});
```

### Add Nodes and Edges

```typescript
import { saveNode, saveEdge } from '@total-audio/automations-engine';

// Add trigger node
const triggerNode = await saveNode({
  flowId: flow.id,
  type: 'trigger',
  subtype: 'email_open',
  config: { allCampaigns: true },
});

// Add action node
const actionNode = await saveNode({
  flowId: flow.id,
  type: 'action',
  subtype: 'send_email_campaign',
  config: {
    subject: 'Follow-up',
    body: 'Just checking in...',
    fromEmail: 'artist@example.com',
  },
});

// Connect nodes
await saveEdge({
  flowId: flow.id,
  sourceNodeId: triggerNode.id,
  targetNodeId: actionNode.id,
});
```

### Emit Events

```typescript
import { emitAutomationEvent } from '@total-audio/automations-engine';

await emitAutomationEvent({
  type: 'email_open',
  source: 'email_engine',
  payload: {
    emailId: 'email_123',
    campaignId: 'campaign_456',
    contactId: 'contact_789',
    openedAt: new Date(),
  },
  metadata: {
    userId: 'user_123',
  },
});
```

### Manual Trigger

```typescript
import { manualTriggerFlow } from '@total-audio/automations-engine';

await manualTriggerFlow(flow.id, {
  customData: 'any context you need',
});
```

## Database Schema

MAL uses 5 main tables:

- `automation_flows` - Workflow definitions
- `automation_nodes` - Individual nodes (trigger, condition, action)
- `automation_edges` - Connections between nodes
- `automation_executions` - Workflow runs
- `automation_execution_steps` - Individual node executions

See `migrations/TIMESTAMP_automations.sql` for full schema.

## Safety & Limits

MAL enforces execution limits to prevent abuse:

- **Max actions per execution**: 100 (default)
- **Max external writes**: 50 (default)
- **Max contact actions**: 200 (default)

Limits can be customized per user/workspace.

## Examples

See `examples/sample-flows.ts` for complete examples including:

- Simple email follow-up workflow
- Playlist success tracking
- Engagement-based segmentation
- Release date reminders

## API Documentation

### Flow Store

- `getFlow(flowId)` - Get flow by ID
- `listFlowsForUser(userId)` - List user's flows
- `createFlow(data)` - Create new flow
- `updateFlow(flowId, updates)` - Update flow
- `deleteFlow(flowId)` - Delete flow

### Graph Model

- `buildGraph(flowId)` - Build workflow graph
- `validateGraph(graph)` - Validate graph structure
- `detectCycles(graph)` - Detect circular dependencies
- `topologicalSort(graph)` - Get execution order

### Runtime

- `startExecution(flowId, triggerContext)` - Start workflow execution
- `getExecutionProgress(executionId)` - Get execution status

### Event Bus

- `emitAutomationEvent(event)` - Emit event to trigger flows
- `manualTriggerFlow(flowId, context)` - Manually trigger flow
- `onEvent(type, handler)` - Listen for events

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test graphModel.test.ts

# Watch mode
pnpm test --watch
```

## Contributing

When adding new node types:

1. Add type to `src/types.ts`
2. Implement evaluation logic in appropriate file:
   - Triggers: `src/triggers.ts`
   - Conditions: `src/conditions.ts`
   - Actions: `src/actions.ts`
3. Add validation in the same file
4. Update examples and tests

## Future Enhancements

- [ ] Visual node canvas with React Flow
- [ ] Execution pause/resume
- [ ] Scheduled triggers (cron-style)
- [ ] Sub-workflows (nested flows)
- [ ] A/B testing nodes
- [ ] Advanced analytics dashboard
- [ ] Workflow versioning
- [ ] Template marketplace

## License

Proprietary - TotalAudio Promo

## Support

For issues or questions, contact the TotalAudio development team.
