# Agent Layer Quick Start Guide

## Installation

The Agent Layer is already integrated into Audio Intel. No additional installation required.

## Basic Usage

### 1. Import Agents

```typescript
import { Agents } from '@/agents';
```

### 2. Execute an Agent

```typescript
// Contact enrichment
const result = await Agents.intel.execute({
  artist: 'sadact',
  release: 'New Single',
  genre: 'house',
  region: 'UK',
});

console.log(result.data.contacts); // Enriched contacts
console.log(result.data.validation); // Quality validation
console.log(result.metrics.latency_ms); // Performance metrics
```

## Common Use Cases

### Contact Enrichment

```typescript
// Enrich artist contacts
const enrichment = await Agents.intel.execute({
  artist: 'Artist Name',
  genre: 'electronic',
  region: 'UK',
  includeLabels: true,
});

if (enrichment.success) {
  const { contacts, labels, validation } = enrichment.data;
  console.log(`Found ${contacts.length} contacts`);
  console.log(`Quality score: ${validation.score}`);
}
```

### Pitch Generation

```typescript
// Draft a pitch
const pitch = await Agents.pitch.execute({
  mode: 'draft',
  artist: 'Your Artist Name',
  release: 'Release Title',
  contactName: 'John',
  contactOrganisation: 'BBC Radio 6 Music',
  genre: 'house',
  releaseDate: '2025-11-15',
  streamingLinks: {
    Spotify: 'https://spotify.com/...',
    Bandcamp: 'https://bandcamp.com/...',
  },
});

if (pitch.success) {
  console.log(pitch.data.pitch.fullText); // Full pitch email
  console.log(pitch.data.toneCheck); // Brand voice validation
  console.log(pitch.data.readyToSend); // Ready to send?
}
```

### Follow-Up Generation

```typescript
// Generate follow-up
const followUp = await Agents.pitch.execute({
  mode: 'followup',
  artist: 'Your Artist Name',
  release: 'Release Title',
  contactName: 'John',
  originalPitchDate: '2025-10-15',
  followUpNumber: 1,
});

if (followUp.success && followUp.data.shouldSend) {
  console.log(followUp.data.followUp.body); // Follow-up text
  console.log(followUp.data.daysSinceOriginal); // Days waited
}
```

### Campaign Tracking

```typescript
// Log a submission
await Agents.tracker.execute({
  mode: 'log',
  campaignId: 'campaign-123',
  submission: {
    contactId: 'contact-1',
    contactName: 'John Smith',
    contactOrganisation: 'BBC Radio 6 Music',
    submissionDate: new Date().toISOString(),
    pitchType: 'initial',
  },
});

// Get campaign analytics
const analytics = await Agents.tracker.execute({
  mode: 'analytics',
  campaignId: 'campaign-123',
});

console.log(analytics.data.metrics); // Open/reply rates
console.log(analytics.data.insights); // Performance insights
```

### Brand Voice Checking

```typescript
// Validate content tone
const voiceCheck = await Agents.voiceguard.execute({
  text: "I'm sharing my new release with you...",
  contentType: 'pitch',
  autoFix: true,
});

if (!voiceCheck.data.passed) {
  console.log(voiceCheck.data.issues); // Tone issues found
  console.log(voiceCheck.data.fixedText); // Auto-fixed version
}
```

## API Usage

### Via REST API

```bash
# List all agents
curl http://localhost:3000/api/agents

# Execute IntelAgent
curl -X POST http://localhost:3000/api/agents?name=intel \
  -H "Content-Type: application/json" \
  -d '{
    "artist": "Artist Name",
    "genre": "electronic"
  }'

# Check agent health
curl http://localhost:3000/api/agents/health

# Get agent statistics
curl http://localhost:3000/api/agents/stats?name=intel
```

## Agent Registry

### List Available Agents

```typescript
import { AgentRegistry } from '@/agents';

const agents = AgentRegistry.list();
// ['intel', 'pitch', 'tracker', 'insight', 'voiceguard']
```

### Get Agent Stats

```typescript
const stats = AgentRegistry.getStats('intel');
console.log(stats.runs); // Total executions
console.log(stats.successRate); // Success percentage
console.log(stats.avgLatency); // Average latency (ms)
```

### Health Check

```typescript
const health = await AgentRegistry.healthCheck();
console.log(health.healthy); // true/false
console.log(health.agents); // Status of each agent
```

## Error Handling

```typescript
const result = await Agents.intel.execute({ artist: 'Test' });

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}

// Always check metrics
console.log(`Execution took ${result.metrics?.latency_ms}ms`);
```

## TypeScript Support

All agents are fully typed:

```typescript
import type {
  IntelAgentPayload,
  PitchAgentPayload,
  VoiceGuardPayload,
  AgentResult,
} from '@/agents';

const payload: IntelAgentPayload = {
  artist: 'Artist Name',
  genre: 'electronic',
};

const result: AgentResult = await Agents.intel.execute(payload);
```

## Next Steps

- Read [AGENT_LAYER_SPEC.md](./AGENT_LAYER_SPEC.md) for full documentation
- Check [agents/](../agents/) for agent source code
- Run tests: `npm run test:agents`
- View API endpoints: http://localhost:3000/api/agents

## Support

Questions? Check:

1. [AGENT_LAYER_SPEC.md](./AGENT_LAYER_SPEC.md) - Full specification
2. Test suite: `tests/agents/agents.spec.ts`
3. Agent manifests: `agents/*/manifest.json`
