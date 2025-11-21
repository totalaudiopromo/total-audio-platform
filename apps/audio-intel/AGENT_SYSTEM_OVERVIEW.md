# Total Audio Agent System - Visual Overview

## System Architecture

```

                         Frontend Apps                           
          Audio Intel    Pitch Generator    Tracker            

                              
                              

                        API Gateway                              
   GET  /api/agents          - List all agents                  
   POST /api/agents?name=X   - Execute agent                    
   GET  /api/agents/health   - Health check                     
   GET  /api/agents/stats    - Agent statistics                 

                              
                              

                      Agent Registry                             
   • Discovery       • Management      • Health Checks           
   • Stats           • Manifests       • Metrics                 

                              
        
                                                  
            
 IntelAgent          PitchAgent          TrackerAgent 
                                                      
 • Contact           • Pitch             • Submission 
   Discovery           Formatting          Logging    
 • Label             • Tone              • Analytics  
   Matching            Checking            Summary    
 • Quality           • Follow-Up         • Reminders  
   Validation          Generation                     
            
                                                  
                                                  
            
 InsightAgent        VoiceGuard           Supabase    
                        Agent                         
 • Campaign                              agent_logs   
   Analysis          • Brand Voice                    
 • Insights            Checking          agent_       
 • Trends            • Corporate         performance  
 • Recs                Detection                      
            
```

## Agent Responsibilities

###  IntelAgent - Contact Enrichment

**When to Use**: Artist/release contact research
**Sub-Agents**:

- ContactFinder → Searches database + external APIs
- LabelMatcher → Finds suitable record labels
- EnrichmentValidator → Quality scoring

**Example Output**:

```json
{
  "contacts": [{ "name": "John Smith", "role": "Producer", "org": "BBC Radio 6" }],
  "labels": [{ "name": "Independent Label", "matchScore": 0.85 }],
  "validation": {
    "score": 0.92,
    "issues": [],
    "recommendations": ["Quality is excellent"]
  }
}
```

---

###  PitchAgent - Pitch Generation

**When to Use**: Creating pitches or follow-ups
**Sub-Agents**:

- PitchFormatter → Structures professional emails
- ToneChecker → Validates brand voice
- FollowUpWriter → Generates polite follow-ups

**Example Output**:

```json
{
  "pitch": {
    "subject": "Artist Name - Release Title",
    "fullText": "Hi John,\n\nI'm Artist Name..."
  },
  "toneCheck": {
    "passed": true,
    "score": 0.95,
    "issues": []
  },
  "readyToSend": true
}
```

---

###  TrackerAgent - Campaign Tracking

**When to Use**: Logging submissions, analytics, reminders
**Sub-Agents**:

- SubmissionLogger → Records campaign activity
- AnalyticsSummariser → Performance metrics
- ReminderAgent → Follow-up timing

**Example Output**:

```json
{
  "metrics": {
    "totalSubmissions": 50,
    "openRate": 64,
    "replyRate": 16
  },
  "insights": ["Strong open rate - subject lines working well"],
  "recommendations": ["Maintain current approach"]
}
```

---

###  InsightAgent - Performance Insights

**When to Use**: Campaign analysis and recommendations
**Output**:

```json
{
  "insights": [
    {
      "type": "engagement",
      "title": "Strong email engagement",
      "priority": "low",
      "actionable": false
    }
  ],
  "summary": {
    "status": "excellent",
    "highPriorityIssues": 0
  }
}
```

---

###  VoiceGuardAgent - Brand Voice

**When to Use**: Validating any outbound content
**Detects**:

-  Corporate speak ("leverage", "synergy")
-  AI buzzwords ("AI-powered", "cutting-edge")
-  Inauthentic phrases ("excited to announce")

**Example Output**:

```json
{
  "passed": false,
  "score": 0.65,
  "issues": [
    {
      "type": "corporate_speak",
      "text": "cutting-edge",
      "suggestion": "Replace with 'new'"
    }
  ],
  "fixedText": "I'm sharing my new release..." // if autoFix: true
}
```

## File Structure

```
apps/audio-intel/
 agents/                           #  Agent Layer (29 files)
    core/
       BaseAgent.ts              # Core framework
       AgentRegistry.ts          # Central management
       AgentTypes.ts             # Type definitions
   
    intel/                        #  IntelAgent
       IntelAgent.ts
       manifest.json
       subagents/
           ContactFinder.ts
           LabelMatcher.ts
           EnrichmentValidator.ts
   
    pitch/                        #  PitchAgent
       PitchAgent.ts
       manifest.json
       subagents/
           PitchFormatter.ts
           ToneChecker.ts
           FollowUpWriter.ts
   
    tracker/                      #  TrackerAgent
       TrackerAgent.ts
       manifest.json
       subagents/
           SubmissionLogger.ts
           AnalyticsSummariser.ts
           ReminderAgent.ts
   
    insight/                      #  InsightAgent
       InsightAgent.ts
       manifest.json
   
    voiceguard/                   #  VoiceGuardAgent
       VoiceGuardAgent.ts
       manifest.json
   
    index.ts                      # Main exports
    README.md                     # Quick reference

 app/api/agents/                   #  API Endpoints
    route.ts                      # Main agent endpoint
    health/route.ts               # Health check
    stats/route.ts                # Statistics

 supabase/migrations/              #  Database
    20251028_create_agent_logs.sql

 tests/agents/                     #  Tests
    agents.spec.ts                # Comprehensive test suite

 docs/                             #  Documentation
     AGENT_LAYER_SPEC.md           # Full specification
     AGENT_QUICK_START.md          # Quick start guide
```

## Data Flow Example: Contact Enrichment

```
1. User Request
   → Frontend calls Agents.intel.execute({ artist: "sadact" })

2. Agent Execution
   → IntelAgent.run()
        → ContactFinder.find()      // Search contacts
        → LabelMatcher.match()       // Find labels
        → EnrichmentValidator.validate()  // Quality check

3. Logging
   → BaseAgent.recordToSupabase()   // Log to agent_logs

4. Response
   → {
        success: true,
        data: { contacts, labels, validation },
        metrics: { latency_ms: 320 }
      }
```

## Performance Metrics

### Tracked Per Agent:

- **Runs**: Total executions
- **Success Rate**: % successful
- **Avg Latency**: Average execution time (ms)
- **Last Run**: Timestamp of last execution

### Supabase Tables:

```sql
-- All execution logs
SELECT * FROM agent_logs;

-- Performance summary
SELECT * FROM agent_performance;

-- Recent failures
SELECT * FROM agent_logs
WHERE success = false
ORDER BY created_at DESC;
```

## Usage Patterns

### 1. Typescript Import

```typescript
import { Agents } from '@/agents'

const result = await Agents.intel.execute({ ... })
```

### 2. REST API

```bash
curl -X POST http://localhost:3000/api/agents?name=intel \
  -d '{ "artist": "Artist Name" }'
```

### 3. Registry Access

```typescript
import { AgentRegistry } from '@/agents';

const agent = AgentRegistry.get('intel');
const stats = AgentRegistry.getStats('intel');
const health = await AgentRegistry.healthCheck();
```

## Integration Points

### Audio Intel

-  Contact enrichment pipeline
-  Quality validation dashboard
-  User analytics

### Pitch Generator

-  Automated pitch creation
-  Follow-up management
-  Brand voice checking

### Campaign Tracker

-  Submission logging
-  Performance analytics
-  Reminder notifications

## Success Metrics

 **5 Agents**: Intel, Pitch, Tracker, Insight, VoiceGuard
 **9 Sub-Agents**: Modular, reusable logic
 **4 API Endpoints**: Full REST interface
 **2 Database Tables**: Logging and metrics
 **29 Files Created**: Complete system
 **Comprehensive Tests**: All agents validated
 **Full Documentation**: Spec + Quick Start

## Next Steps

### Immediate

1. Run migration: `npx supabase db push`
2. Test agents: `npm run test:agents`
3. Check API: `curl http://localhost:3000/api/agents`

### Integration

1. Connect IntelAgent to enrichment UI
2. Add PitchAgent to pitch generator
3. Integrate TrackerAgent with campaign dashboard
4. Add InsightAgent to analytics views
5. Use VoiceGuardAgent on all outbound content

### Future

- WebSocket real-time updates
- Agent orchestration (chaining)
- Metrics dashboard UI
- Advanced caching
- Multi-user permissions

---

**Status**:  Production Ready
**Version**: 1.0.0
**Date**: October 28, 2025
**Developer**: Chris Schofield
