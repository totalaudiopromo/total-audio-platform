
# Skills System - Total Audio Platform

The Skills System is a modular, versioned AI capability framework that enables Total Audio's agents (Audio Intel, Pitch Generator, Campaign Tracker) to leverage reusable, composable skills for intelligent automation.

## 🎯 What Are Skills?

Skills are **self-contained, AI-powered capabilities** that can be:
- **Composed**: Chain multiple skills together (e.g., VoiceGuard → PitchDraft)
- **Versioned**: Manage multiple versions with semantic versioning
- **Configured**: Customize behavior per organization or user
- **Audited**: Complete execution history with performance metrics
- **Permissioned**: Control which orgs/users can use which skills

Think of skills as "AI microservices" – each one does one thing really well and can be combined with others.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Pitch Generator, Audio Intel, Campaign Tracker)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Skills Engine                             │
│  • Loading & Versioning                                     │
│  • Validation & Permissions                                 │
│  • Execution & Audit                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Skill Registry  │    │   Supabase DB    │
│  (In-Memory)     │    │  (Persistence)   │
└──────────────────┘    └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│           Built-in Skills                │
│  • VoiceGuardSkill                      │
│  • PitchDraftSkill                      │
│  • ContactMatcherSkill                  │
│  • FollowUpSkill                        │
│  • InsightSkill                         │
└─────────────────────────────────────────┘
```

## 📦 Database Schema

The Skills System uses 4 core tables in Supabase:

### `skill`
Registry of all available skills.

```sql
- id: UUID (PK)
- key: TEXT (unique) - e.g., "pitch_draft", "voice_guard"
- name: TEXT - Display name
- description: TEXT - What the skill does
- category: TEXT - Grouping (pitch_generation, contact_enrichment, etc.)
- tags: TEXT[] - Searchable tags
```

### `skill_version`
Version history for each skill (semantic versioning).

```sql
- id: UUID (PK)
- skill_id: UUID (FK to skill)
- version: TEXT - Semantic version (e.g., "1.0.0")
- status: TEXT - "draft" | "active" | "deprecated"
- manifest: JSONB - Skill definition (IO schema, rules, prompts)
- created_at: TIMESTAMP
```

### `skill_binding`
Per-org and per-user skill enablement.

```sql
- id: UUID (PK)
- org_id: UUID - Organization ID
- user_id: UUID (nullable) - User ID (null = org-wide)
- skill_id: UUID (FK to skill)
- version: TEXT - Which version to use
- enabled: BOOLEAN - Is skill active?
- config: JSONB - Custom configuration overrides
```

### `skill_invocation`
Complete audit trail of every skill execution.

```sql
- id: UUID (PK)
- org_id: UUID
- user_id: UUID (nullable)
- skill_key: TEXT - Which skill was invoked
- version: TEXT - Which version was used
- inputs: JSONB - Input payload
- outputs: JSONB - Result payload
- error: TEXT (nullable) - Error message if failed
- duration_ms: INTEGER - Execution time
- tokens_used: INTEGER - LLM tokens consumed
- confidence: NUMERIC(3,2) - Result confidence score
- created_at: TIMESTAMP
```

## 🚀 Quick Start

### 1. Run Database Migration

```bash
npx supabase migration up
# Or if using local Supabase:
npx supabase db push
```

This creates all skill tables and seeds the initial 5 skills.

### 2. Initialize Skills Engine

```typescript
import { SkillEngine } from '@/core/skills/SkillEngine';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize skills engine
const skillEngine = new SkillEngine(
  supabase,
  process.env.ANTHROPIC_API_KEY
);

await skillEngine.initialize();
```

### 3. Invoke a Skill

```typescript
// Generate pitch drafts
const result = await skillEngine.invokeSkill({
  orgId: 'org_123',
  userId: 'user_456',
  skillKey: 'pitch_draft',
  version: 'latest', // or specific version like "1.0.0"
  payload: {
    contact: {
      name: 'Sarah Jones',
      role: 'Producer',
      outlet: 'BBC Radio 6 Music',
      genre_focus: ['electronic', 'ambient'],
    },
    track: {
      title: 'Midnight Drive',
      artist: 'sadact',
      genre: 'electronic/ambient',
      key_facts: ['BBC Introducing featured', '50k Spotify streams'],
    },
  },
});

if (result.success) {
  console.log('Pitch drafts:', result.outputs.drafts);
  console.log('Confidence:', result.metadata.confidence);
} else {
  console.error('Errors:', result.errors);
}
```

## 🧩 Built-in Skills

### 1. VoiceGuardSkill
**Purpose**: Ensures Total Audio's authentic UK music industry voice
**Category**: Brand Voice
**Use Case**: Validate and correct all customer-facing content

**Input**:
```typescript
{
  text: string;
  contentType: 'email_pitch' | 'newsletter' | 'website_copy' | 'social_media' | 'documentation';
  targetAudience: 'radio_promoters' | 'independent_artists' | 'pr_agencies' | 'industry_contacts' | 'general';
  brandVoiceId?: string; // Optional custom voice profile
}
```

**Output**:
```typescript
{
  text: string; // Corrected text
  changes: Array<{
    from: string;
    to: string;
    reason: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  compliance_score: number; // 0-1
  warnings: string[];
  suggestions: string[];
}
```

**Example**:
```typescript
const result = await VoiceGuardSkill.execute({
  text: 'Leverage our innovative solution to organize your music.',
  contentType: 'website_copy',
  targetAudience: 'independent_artists'
}, context);

// Result:
// compliance_score: 0.45
// changes: [{ from: 'organize', to: 'organise', reason: 'UK spelling', severity: 'critical' }]
// warnings: ['Corporate speak: "leverage"', 'Marketing hype: "innovative"', ...]
```

### 2. PitchDraftSkill
**Purpose**: Generate high-quality music PR pitches
**Category**: Pitch Generation
**Use Case**: Create personalized email pitches for contacts

**Input**:
```typescript
{
  contact: {
    name: string;
    role?: string;
    outlet?: string;
    recent_activity?: string[];
    genre_focus?: string[];
    submission_preferences?: string;
  };
  track: {
    title: string;
    artist: string;
    genre: string;
    key_facts?: string[];
    streaming_links?: {
      spotify?: string;
      apple_music?: string;
    };
  };
  brandVoiceId?: string;
  constraints?: {
    max_length?: number; // Default: 150 words
    tone?: 'casual' | 'professional' | 'enthusiastic';
    mode?: 'full' | 'subject_only';
  };
  context?: string; // Additional context for the pitch
}
```

**Output**:
```typescript
{
  drafts: Array<{
    subject: string;
    body: string;
    rationale: string; // Why this angle works
    angle: 'story' | 'data' | 'emotion' | 'industry';
    voice_compliance: number; // 0-1
  }>;
  confidence: number; // 0-1
  warnings?: string[];
}
```

**Example**:
```typescript
const result = await skillEngine.invokeSkill({
  orgId: 'org_123',
  skillKey: 'pitch_draft',
  payload: {
    contact: {
      name: 'Sarah Jones',
      outlet: 'BBC Radio 6 Music',
      genre_focus: ['electronic', 'ambient'],
      recent_activity: ['Featured UK producer spotlight']
    },
    track: {
      title: 'Midnight Drive',
      artist: 'sadact',
      genre: 'electronic/ambient',
      key_facts: ['BBC Introducing featured', '50k Spotify streams']
    }
  }
});

// Returns 3 drafts with different angles:
// 1. Story: "BBC Introducing graduate releases ambient piece"
// 2. Data: "50k streams - new ambient track for 6 Music"
// 3. Emotion: "Late-night electronic atmosphere for your show"
```

### 3. ContactMatcherSkill
**Purpose**: Match tracks with relevant industry contacts
**Category**: Contact Intelligence
**Use Case**: Audio Intel contact recommendations

**Input**:
```typescript
{
  track: {
    title: string;
    artist: string;
    genre: string;
    subgenres?: string[];
    description?: string;
    mood?: string[];
    influences?: string[];
    key_facts?: string[];
  };
  artistProfile?: {
    bio?: string;
    previous_coverage?: string[];
    target_audience?: string;
    similar_artists?: string[];
  };
  contacts: Array<{
    id: string;
    name: string;
    role?: string;
    outlet?: string;
    genre_focus?: string[];
    recent_activity?: string[];
    submission_preferences?: string;
  }>;
  limit?: number; // Default: 10
  minScore?: number; // Default: 0.6
}
```

**Output**:
```typescript
{
  matches: Array<{
    contactId: string;
    contactName: string;
    score: number; // 0-1
    why: string; // Explanation of match
    angle: string; // Best pitch angle
    confidence: 'high' | 'medium' | 'low';
    personalisation_hooks: string[]; // What to reference in pitch
  }>;
  unmatchedCount: number;
  analysis: {
    totalContacts: number;
    matchedContacts: number;
    averageScore: number;
    topGenres: string[];
  };
}
```

**Example**:
```typescript
const result = await skillEngine.invokeSkill({
  orgId: 'org_123',
  skillKey: 'contact_matcher',
  payload: {
    track: {
      title: 'Midnight Drive',
      genre: 'electronic/ambient',
      subgenres: ['downtempo', 'atmospheric'],
      mood: ['late-night', 'introspective']
    },
    contacts: [
      {
        id: 'c1',
        name: 'Sarah Jones',
        outlet: 'BBC Radio 6 Music',
        genre_focus: ['electronic', 'ambient'],
        recent_activity: ['Featured UK ambient showcase']
      },
      // ... more contacts
    ],
    limit: 5
  }
});

// Returns top 5 matched contacts with personalization hooks
```

## 🔧 Creating New Skills

### 1. Define Skill Manifest (YAML)

Create a new file in `skills/definitions/`:

```yaml
# skills/definitions/my_new_skill.yml
metadata:
  name: my_new_skill
  version: 1.0.0
  description: What this skill does
  author: Your Name
  created: 2025-10-17
  updated: 2025-10-17
  tags:
    - tag1
    - tag2
  category: your_category

inputs:
  - name: input1
    type: string
    description: What this input is for
    required: true
    validation:
      minLength: 10
      maxLength: 500

  - name: input2
    type: object
    description: Complex input object
    required: false

outputs:
  - name: output1
    type: object
    description: What this returns

  - name: confidence
    type: number
    description: Confidence score

rules:
  - id: rule1
    description: Critical rule to follow
    priority: critical
    type: constraint

  - id: rule2
    description: Best practice guideline
    priority: high
    type: best_practice

prompt:
  system: |
    System prompt that sets context and rules for the AI.

    CRITICAL RULES:
    - Rule 1
    - Rule 2

  user: |
    User prompt template with {{input1}} placeholders.

    Input data:
    {{input2}}

    Return JSON:
    {
      "output1": { ... },
      "confidence": 0.0-1.0
    }

config:
  model: claude-3-5-sonnet-20241022
  temperature: 0.7
  maxTokens: 1000
  timeout: 10000
```

### 2. Implement Skill Class (TypeScript)

Create `src/core/skills/implementations/MyNewSkill.ts`:

```typescript
import { SkillContext } from '../SkillEngine';

export interface MyNewSkillInput {
  input1: string;
  input2?: {
    field1: string;
    field2: number;
  };
}

export interface MyNewSkillOutput {
  output1: {
    result: string;
    metadata: any;
  };
  confidence: number;
  warnings?: string[];
}

export class MyNewSkill {
  /**
   * Execute the skill
   */
  static async execute(
    input: MyNewSkillInput,
    context: SkillContext
  ): Promise<MyNewSkillOutput> {
    if (!context.tools.llm) {
      throw new Error('LLM client required');
    }

    // Your skill logic here
    // 1. Validate inputs
    // 2. Build prompts
    // 3. Call LLM
    // 4. Process results
    // 5. Return output

    const message = await context.tools.llm.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      system: 'Your system prompt',
      messages: [{ role: 'user', content: 'Your user prompt' }],
    });

    // Parse and return result
    const result = JSON.parse(message.content[0].text);

    return {
      output1: result.output1,
      confidence: result.confidence,
      warnings: result.warnings,
    };
  }

  /**
   * Convenience methods
   */
  static async quickRun(input: string, context: SkillContext): Promise<string> {
    const result = await this.execute({ input1: input }, context);
    return result.output1.result;
  }
}
```

### 3. Register Skill in Database

```sql
-- Insert new skill
INSERT INTO skill (key, name, description, category, tags)
VALUES (
  'my_new_skill',
  'My New Skill',
  'Description of what it does',
  'your_category',
  ARRAY['tag1', 'tag2']
);

-- Insert initial version
INSERT INTO skill_version (skill_id, version, status, manifest)
SELECT
  id,
  '1.0.0',
  'active',
  '... manifest JSON ...'::jsonb
FROM skill
WHERE key = 'my_new_skill';
```

### 4. Write Tests

Create `src/core/skills/tests/MyNewSkill.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';
import { MyNewSkill } from '../implementations/MyNewSkill';

describe('MyNewSkill', () => {
  it('should handle valid input', async () => {
    const result = await MyNewSkill.execute({
      input1: 'test input',
    }, mockContext);

    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.output1).toBeDefined();
  });

  it('should validate input constraints', async () => {
    await expect(
      MyNewSkill.execute({ input1: 'short' }, mockContext)
    ).rejects.toThrow();
  });
});
```

## 📡 API Usage

### List Available Skills
```bash
GET /api/skills
```

**Response**:
```json
{
  "success": true,
  "skills": [
    {
      "key": "pitch_draft",
      "name": "Pitch Draft Generator",
      "versions": ["1.0.0", "1.1.0"]
    }
  ],
  "count": 5
}
```

### Invoke a Skill
```bash
POST /api/skills/pitch_draft/invoke
Content-Type: application/json

{
  "orgId": "org_123",
  "userId": "user_456",
  "version": "latest",
  "inputs": {
    "contact": { ... },
    "track": { ... }
  }
}
```

**Response**:
```json
{
  "success": true,
  "outputs": {
    "drafts": [ ... ]
  },
  "metadata": {
    "executionTime": 1234,
    "tokensUsed": 456,
    "confidence": 0.92
  }
}
```

### Get Invocation History
```bash
GET /api/skills/invocations?orgId=org_123&skillKey=pitch_draft&limit=50
```

### Manage Skill Bindings
```bash
# Enable skill for org
POST /api/skills/bindings
{
  "orgId": "org_123",
  "skillKey": "voice_guard",
  "enabled": true,
  "config": {
    "strictMode": true
  }
}

# Get org bindings
GET /api/skills/bindings?orgId=org_123
```

### Get Usage Stats
```bash
GET /api/skills/stats?orgId=org_123&period=7d
```

## 🎨 Frontend Integration

### React Hook Example

```typescript
// hooks/useSkill.ts
import { useState } from 'react';

export function useSkill<I, O>(skillKey: string) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<O | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invoke = async (inputs: I) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/skills/${skillKey}/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: currentOrgId,
          userId: currentUserId,
          inputs,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.outputs);
      } else {
        setError(data.errors?.[0]?.message || 'Skill execution failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { invoke, loading, result, error };
}
```

### Usage in Component

```typescript
// components/PitchEditor.tsx
import { useSkill } from '@/hooks/useSkill';
import { PitchDraftOutput, PitchDraftInput } from '@/core/skills/implementations/PitchDraftSkill';

export function PitchEditor() {
  const { invoke, loading, result } = useSkill<PitchDraftInput, PitchDraftOutput>('pitch_draft');

  const handleGeneratePitch = async () => {
    await invoke({
      contact: selectedContact,
      track: currentTrack,
    });
  };

  return (
    <div>
      <button onClick={handleGeneratePitch} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Pitch Drafts'}
      </button>

      {result && (
        <div>
          {result.drafts.map((draft, i) => (
            <div key={i}>
              <h3>{draft.subject}</h3>
              <p>{draft.body}</p>
              <span>Confidence: {(draft.voice_compliance * 100).toFixed(0)}%</span>
              <span>Angle: {draft.angle}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🔐 Permissions & Security

### Org-Level Control

```typescript
// Enable skill for entire org
await skillEngine.db.from('skill_binding').insert({
  org_id: 'org_123',
  user_id: null, // null = org-wide
  skill_id: 'skill_uuid',
  enabled: true,
  config: {
    max_invocations_per_day: 100,
  },
});
```

### User-Level Override

```typescript
// Disable for specific user
await skillEngine.db.from('skill_binding').insert({
  org_id: 'org_123',
  user_id: 'user_456', // User-specific override
  skill_id: 'skill_uuid',
  enabled: false, // This user can't use this skill
});
```

### Rate Limiting

Implement in API middleware:

```typescript
app.post('/api/skills/:key/invoke', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  keyGenerator: (req) => `${req.body.orgId}:${req.params.key}`,
}), skillInvokeHandler);
```

## 📊 Monitoring & Analytics

### Performance Metrics

```typescript
// Get skill performance stats
const { data } = await supabase
  .from('skill_invocation')
  .select('duration_ms, tokens_used, error')
  .eq('org_id', 'org_123')
  .eq('skill_key', 'pitch_draft')
  .gte('created_at', '2025-10-01');

const avgDuration = data.reduce((sum, inv) => sum + inv.duration_ms, 0) / data.length;
const successRate = data.filter(inv => !inv.error).length / data.length;
const totalTokens = data.reduce((sum, inv) => sum + inv.tokens_used, 0);
```

### Cost Tracking

```typescript
// Calculate cost per skill
const COST_PER_1K_TOKENS = 0.003; // Claude 3.5 Sonnet pricing

const cost = (totalTokens / 1000) * COST_PER_1K_TOKENS;
console.log(`Total cost for period: $${cost.toFixed(2)}`);
```

## 🚦 Best Practices

### 1. Skill Composition

Chain skills together for complex workflows:

```typescript
// 1. Generate pitch drafts
const pitchResult = await skillEngine.invokeSkill({
  orgId, userId,
  skillKey: 'pitch_draft',
  payload: { contact, track }
});

// 2. Apply voice guard to each draft
const validatedDrafts = await Promise.all(
  pitchResult.outputs.drafts.map(draft =>
    skillEngine.invokeSkill({
      orgId, userId,
      skillKey: 'voice_guard',
      payload: { text: draft.body, contentType: 'email_pitch' }
    })
  )
);

// 3. Select best draft and schedule follow-up
const bestDraft = validatedDrafts.reduce((best, current) =>
  current.outputs.compliance_score > best.outputs.compliance_score ? current : best
);
```

### 2. Error Handling

Always check `success` and handle errors:

```typescript
const result = await skillEngine.invokeSkill({ ... });

if (!result.success) {
  // Log error
  console.error('Skill failed:', result.errors);

  // Show user-friendly message
  showToast({
    type: 'error',
    message: result.errors[0]?.message || 'Skill execution failed',
  });

  // Fall back to manual flow
  showManualEditor();
  return;
}

// Success - use result
processResult(result.outputs);
```

### 3. Caching Results

Cache expensive skill results:

```typescript
import { Redis } from 'ioredis';

const cacheKey = `skill:${skillKey}:${hashInputs(payload)}`;

// Check cache first
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

// Execute skill
const result = await skillEngine.invokeSkill({ ... });

// Cache for 1 hour
await redis.setex(cacheKey, 3600, JSON.stringify(result));

return result;
```

### 4. Versioning Strategy

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes to input/output schema
- MINOR: New features, backward compatible
- PATCH: Bug fixes, improvements

```typescript
// Pin to specific version for production
const result = await skillEngine.invokeSkill({
  skillKey: 'pitch_draft',
  version: '1.2.0', // Specific version
  // ...
});

// Use 'latest' for development
const devResult = await skillEngine.invokeSkill({
  skillKey: 'pitch_draft',
  version: 'latest',
  // ...
});
```

## 🧪 Testing

### Run All Skill Tests

```bash
npm run test:skills
# or
npx jest src/core/skills/tests
```

### Test Individual Skill

```bash
npx jest src/core/skills/tests/VoiceGuardSkill.test.ts
```

### Integration Testing

```typescript
// tests/integration/skills-flow.test.ts
describe('Skills Integration', () => {
  it('should complete full pitch generation flow', async () => {
    // 1. Match contacts
    const matches = await skillEngine.invokeSkill({
      skillKey: 'contact_matcher',
      payload: { track, contacts },
    });

    expect(matches.success).toBe(true);
    expect(matches.outputs.matches.length).toBeGreaterThan(0);

    // 2. Generate pitch for top match
    const topContact = matches.outputs.matches[0];
    const pitch = await skillEngine.invokeSkill({
      skillKey: 'pitch_draft',
      payload: { contact: topContact, track },
    });

    expect(pitch.success).toBe(true);
    expect(pitch.outputs.drafts[0].voice_compliance).toBeGreaterThan(0.8);
  });
});
```

## 📈 Roadmap

### Planned Skills

- **FollowUpSkill**: Generate contextual follow-up emails
- **InsightSkill**: Campaign analytics and recommendations
- **SubjectLineSkill**: A/B test subject line generation
- **TimingSkill**: Optimal send time prediction
- **PersonaSkill**: Contact persona analysis

### Future Features

- **Skill Marketplace**: Community-contributed skills
- **Visual Skill Builder**: No-code skill creation
- **Real-time Monitoring**: Live execution dashboard
- **A/B Testing**: Compare skill versions automatically
- **Custom Models**: Support for fine-tuned models

## 🤝 Contributing

### Adding a New Skill

1. Create skill manifest in `skills/definitions/`
2. Implement skill class in `src/core/skills/implementations/`
3. Write comprehensive tests
4. Add to database via migration
5. Update this README with usage examples
6. Submit PR with description and test results

### Reporting Issues

Open an issue with:
- Skill name and version
- Input payload (sanitized)
- Expected vs actual output
- Error messages and stack trace

## 📚 Additional Resources

- [Claude API Documentation](https://docs.anthropic.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Total Audio Platform Architecture](./ARCHITECTURE.md)

---

**Built with ❤️ by Total Audio Platform**
For questions or support, reach out to the team or open an issue.
