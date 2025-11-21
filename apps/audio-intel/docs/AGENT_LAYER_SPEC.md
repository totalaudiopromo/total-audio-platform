# Total Audio Agent Layer Specification

## Overview

The Total Audio Agent Layer is a modular, production-ready system that handles business-critical workflows for Audio Intel, Pitch Generator, and Campaign Tracker. Each agent operates independently with clear responsibilities, structured logging, and performance metrics.

## Architecture

```

                       API Layer                             
     /api/agents?name=<agent> | /api/agents/health          

                              
                              

                    Agent Registry                           
        Discovery, Management, Health Checks                 

                              
                
                                          
             
           Intel       Pitch      Tracker  
           Agent       Agent       Agent   
             
                                          
           
                                          
    [Contact] [Label] [Validator] [Pitch] [Tone] [FollowUp]
    [Finder]  [Match]           [Format] [Check] [Writer]
```

## Core Agents

### 1. IntelAgent - Contact Enrichment & Validation

**Purpose**: Discover and validate music industry contacts for campaigns

**Capabilities**:

- Contact discovery (radio, press, labels)
- Label matching based on genre/release
- Enrichment quality validation
- Confidence scoring

**Sub-Agents**:

- **ContactFinder**: Searches contact database and enriches with external APIs
- **LabelMatcher**: Matches releases to appropriate record labels
- **EnrichmentValidator**: Validates enrichment quality and provides recommendations

**Example Usage**:

```typescript
const result = await Agents.intel.execute({
  artist: 'sadact',
  release: 'New Single',
  genre: 'house',
  region: 'UK',
  includeLabels: true,
});

// Returns: contacts, labels, validation, quality score
```

**API Endpoint**:

```bash
POST /api/agents?name=intel
{
  "artist": "Artist Name",
  "release": "Release Title",
  "genre": "electronic"
}
```

---

### 2. PitchAgent - Pitch Drafting & Tone Validation

**Purpose**: Generate personalised pitches and follow-ups with brand voice enforcement

**Capabilities**:

- Professional pitch formatting
- Brand tone validation
- Follow-up generation with timing rules
- Corporate speak detection

**Sub-Agents**:

- **PitchFormatter**: Structures professional pitch emails with personalisation
- **ToneChecker**: Validates "honest maker" brand voice, flags corporate speak
- **FollowUpWriter**: Generates polite follow-ups with appropriate timing

**Example Usage**:

```typescript
// Draft new pitch
const result = await Agents.pitch.execute({
  mode: 'draft',
  artist: 'Artist Name',
  release: 'Release Title',
  contactName: 'John',
  contactOrganisation: 'BBC Radio 6 Music',
  genre: 'electronic',
  strictToneCheck: true,
});

// Generate follow-up
const followUp = await Agents.pitch.execute({
  mode: 'followup',
  artist: 'Artist Name',
  release: 'Release Title',
  originalPitchDate: '2025-01-01',
  followUpNumber: 1,
});
```

**API Endpoint**:

```bash
POST /api/agents?name=pitch
{
  "mode": "draft",
  "artist": "Artist Name",
  "release": "Release Title",
  "contactName": "John"
}
```

---

### 3. TrackerAgent - Campaign Tracking & Analytics

**Purpose**: Log campaign submissions and generate performance analytics

**Capabilities**:

- Submission logging
- Campaign analytics generation
- Follow-up reminders
- Status tracking

**Sub-Agents**:

- **SubmissionLogger**: Records submissions and tracks status changes
- **AnalyticsSummariser**: Generates campaign performance summaries
- **ReminderAgent**: Suggests follow-up timing based on submission age

**Example Usage**:

```typescript
// Log submission
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

// Get analytics
const analytics = await Agents.tracker.execute({
  mode: 'analytics',
  campaignId: 'campaign-123',
});

// Check reminders
const reminders = await Agents.tracker.execute({
  mode: 'reminders',
  campaignId: 'campaign-123',
});
```

**API Endpoint**:

```bash
POST /api/agents?name=tracker
{
  "mode": "analytics",
  "campaignId": "campaign-123"
}
```

---

### 4. InsightAgent - Performance Insights

**Purpose**: Analyse campaign data and provide actionable recommendations

**Capabilities**:

- Performance analysis
- Engagement insights
- Conversion tracking
- Trend detection
- Recommendation generation

**Example Usage**:

```typescript
const insights = await Agents.insight.execute({
  campaignId: 'campaign-123',
  includeComparison: true,
  includeRecommendations: true,
});

// Returns: insights, recommendations, comparison, summary
```

**API Endpoint**:

```bash
POST /api/agents?name=insight
{
  "campaignId": "campaign-123",
  "includeComparison": true
}
```

---

### 5. VoiceGuardAgent - Brand Voice Enforcement

**Purpose**: Ensure all content matches Total Audio's authentic "honest maker" tone

**Capabilities**:

- Tone validation
- Corporate speak detection
- AI buzzword flagging
- Authenticity scoring
- Auto-fix suggestions

**Example Usage**:

```typescript
const result = await Agents.voiceguard.execute({
  text: "I'm sharing my new release with you...",
  contentType: 'pitch',
  strictMode: false,
  autoFix: true,
});

// Returns: passed, score, issues, recommendations, fixedText
```

**API Endpoint**:

```bash
POST /api/agents?name=voiceguard
{
  "text": "Content to validate",
  "contentType": "pitch",
  "autoFix": true
}
```

---

## Agent Registry

The `AgentRegistry` manages all agents and provides discovery, health checks, and metrics.

### Methods

```typescript
// List all agents
AgentRegistry.list(); // ['intel', 'pitch', 'tracker', 'insight', 'voiceguard']

// Get agent instance
const agent = AgentRegistry.get('intel');

// Get agent manifest
const manifest = AgentRegistry.getManifest('intel');

// Get agent stats
const stats = AgentRegistry.getStats('intel');
// Returns: { name, version, runs, success, failures, successRate, avgLatency }

// Health check
const health = await AgentRegistry.healthCheck();
// Returns: { healthy: boolean, agents: {...} }
```

---

## API Endpoints

### 1. List All Agents

```bash
GET /api/agents
```

**Response**:

```json
{
  "agents": [
    {
      "name": "intel",
      "manifest": { ... },
      "stats": { runs: 10, success: 9, ... }
    }
  ],
  "total": 5
}
```

### 2. Invoke Agent

```bash
POST /api/agents?name=<agent_name>
{
  "payload": { ... }
}
```

**Response**:

```json
{
  "success": true,
  "data": { ... },
  "metrics": {
    "latency_ms": 250,
    "timestamp": "2025-10-28T..."
  }
}
```

### 3. Health Check

```bash
GET /api/agents/health
```

**Response**:

```json
{
  "healthy": true,
  "agents": {
    "intel": { "status": "ok" },
    "pitch": { "status": "ok" },
    ...
  }
}
```

### 4. Agent Statistics

```bash
GET /api/agents/stats?name=intel
```

**Response**:

```json
{
  "name": "IntelAgent",
  "version": "1.0.0",
  "runs": 150,
  "success": 145,
  "failures": 5,
  "successRate": 97,
  "avgLatency": 320,
  "lastRun": "2025-10-28T..."
}
```

---

## Database Schema

### agent_logs Table

```sql
create table public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  success boolean not null default true,
  latency_ms integer not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### agent_performance View

```sql
create view public.agent_performance as
select
  agent_name,
  count(*) as total_runs,
  sum(case when success then 1 else 0 end) as successful_runs,
  round(avg(latency_ms)) as avg_latency_ms,
  round(100.0 * sum(case when success then 1 else 0 end) / count(*), 2) as success_rate_percent
from public.agent_logs
group by agent_name;
```

---

## Testing

### Run Test Suite

```bash
npm run test:agents
```

### Test Coverage

- AgentRegistry discovery and management
- All 5 agents with various payloads
- Sub-agent functionality
- Error handling
- Metrics tracking
- Health checks

### Example Test

```typescript
it('should execute IntelAgent successfully', async () => {
  const agent = new IntelAgent();
  const result = await agent.execute({
    artist: 'Test Artist',
    genre: 'electronic',
  });

  expect(result.success).toBe(true);
  expect(result.data.contacts).toBeDefined();
  expect(result.metrics.latency_ms).toBeGreaterThan(0);
});
```

---

## Agent Dependency Map

```
IntelAgent
   ContactFinder → Supabase, Perplexity API
   LabelMatcher → Supabase
   EnrichmentValidator

PitchAgent
   PitchFormatter
   ToneChecker
   FollowUpWriter

TrackerAgent
   SubmissionLogger → Supabase
   AnalyticsSummariser → Supabase
   ReminderAgent → Supabase

InsightAgent → Supabase

VoiceGuardAgent (no dependencies)
```

---

## Extending the Agent Layer

### Adding a New Agent

1. **Create agent directory structure**:

```bash
agents/
 myagent/
     MyAgent.ts
     manifest.json
     subagents/
         SubAgent.ts
```

2. **Extend BaseAgent**:

```typescript
import { BaseAgent } from '../core/BaseAgent'
import type { AgentPayload, AgentResult } from '../core/AgentTypes'

export class MyAgent extends BaseAgent {
  constructor() {
    super('MyAgent', '1.0.0')
  }

  async run(payload: AgentPayload): Promise<AgentResult> {
    // Agent logic here
    return {
      success: true,
      data: { ... }
    }
  }
}
```

3. **Register in AgentRegistry**:

```typescript
// In AgentRegistry.ts
import { MyAgent } from '../myagent/MyAgent'

static init() {
  // ...
  this.register('myagent', new MyAgent())
}
```

4. **Create tests**:

```typescript
describe('MyAgent', () => {
  it('should execute successfully', async () => {
    const agent = new MyAgent()
    const result = await agent.execute({ ... })
    expect(result.success).toBe(true)
  })
})
```

---

## Performance Considerations

### Metrics Tracked

- **Execution latency**: Time taken for agent to complete
- **Success rate**: Percentage of successful executions
- **Run count**: Total number of executions
- **Error frequency**: Number of failures over time

### Optimisation Guidelines

- Keep agent logic focused and modular
- Use sub-agents for independent operations
- Implement caching for expensive operations
- Monitor Supabase query performance
- Log metrics to `agent_logs` table asynchronously

---

## Security & Best Practices

### Authentication

- All API endpoints should require authentication
- Use Supabase RLS policies for data access
- Validate user permissions before agent execution

### Input Validation

- Validate all payload parameters
- Sanitise user input before processing
- Return clear error messages for invalid input

### Error Handling

- All errors are caught and returned in standardised format
- Never expose internal implementation details
- Log errors for debugging without exposing to users

### British Spelling

- All agent content uses British English (organised, realise, colour)
- Brand voice enforced by VoiceGuardAgent

---

## Monitoring & Observability

### Supabase Queries

```sql
-- Agent performance over time
select
  agent_name,
  date_trunc('day', created_at) as day,
  count(*) as runs,
  avg(latency_ms) as avg_latency,
  sum(case when success then 1 else 0 end)::float / count(*) * 100 as success_rate
from agent_logs
where created_at > now() - interval '30 days'
group by agent_name, day
order by day desc;

-- Failed executions
select *
from agent_logs
where success = false
order by created_at desc
limit 100;

-- Slow executions
select *
from agent_logs
where latency_ms > 5000
order by latency_ms desc
limit 50;
```

---

## Roadmap

### Completed

 Core agent framework (BaseAgent, AgentRegistry)
 All 5 production agents (Intel, Pitch, Tracker, Insight, VoiceGuard)
 Sub-agent architecture
 API endpoints
 Supabase logging
 Test suite
 Documentation

### Next Steps

- [ ] WebSocket support for real-time agent updates
- [ ] Agent orchestration (chaining multiple agents)
- [ ] Agent metrics dashboard UI
- [ ] Advanced caching layer
- [ ] Multi-user agent permissions
- [ ] Agent versioning system

---

## Support

For questions or issues with the Agent Layer:

1. Check this documentation first
2. Review test suite for examples
3. Check agent manifests for capabilities
4. Contact: Chris Schofield (Total Audio Platform)

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready
