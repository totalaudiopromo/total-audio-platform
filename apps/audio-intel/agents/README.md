# Total Audio Agent Layer

Production-ready agent system for Audio Intel, Pitch Generator, and Campaign Tracker.

## Quick Start

```typescript
import { Agents } from '@/agents'

// Contact enrichment
const result = await Agents.intel.execute({
  artist: 'Artist Name',
  genre: 'electronic'
})

// Pitch generation
const pitch = await Agents.pitch.execute({
  mode: 'draft',
  artist: 'Artist Name',
  release: 'Release Title'
})

// Brand voice checking
const voiceCheck = await Agents.voiceguard.execute({
  text: 'Your content here',
  autoFix: true
})
```

## Available Agents

### 🎯 IntelAgent
Contact enrichment and validation
- ContactFinder, LabelMatcher, EnrichmentValidator

### ✉️ PitchAgent
Pitch drafting and tone validation
- PitchFormatter, ToneChecker, FollowUpWriter

### 📊 TrackerAgent
Campaign tracking and analytics
- SubmissionLogger, AnalyticsSummariser, ReminderAgent

### 💡 InsightAgent
Performance insights and recommendations

### 🛡️ VoiceGuardAgent
Brand voice enforcement ("honest maker" tone)

## Documentation

- **Quick Start**: [docs/AGENT_QUICK_START.md](../docs/AGENT_QUICK_START.md)
- **Full Specification**: [docs/AGENT_LAYER_SPEC.md](../docs/AGENT_LAYER_SPEC.md)
- **Tests**: [tests/agents/agents.spec.ts](../tests/agents/agents.spec.ts)

## API Endpoints

```bash
GET  /api/agents          # List all agents
POST /api/agents?name=X   # Execute agent
GET  /api/agents/health   # Health check
GET  /api/agents/stats    # Agent statistics
```

## Structure

```
agents/
├── core/
│   ├── BaseAgent.ts       # Core agent framework
│   ├── AgentRegistry.ts   # Agent management
│   └── AgentTypes.ts      # Type definitions
│
├── intel/                 # Contact enrichment
├── pitch/                 # Pitch generation
├── tracker/               # Campaign tracking
├── insight/               # Performance insights
├── voiceguard/            # Brand voice enforcement
│
└── index.ts               # Main exports
```

## Testing

```bash
npm run test:agents
```

## British Spelling

All agents use British English (organised, realise, colour, etc.) as enforced by VoiceGuardAgent.

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: October 2025
