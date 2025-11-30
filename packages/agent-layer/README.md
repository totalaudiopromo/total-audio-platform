# @total-audio/agent-layer

Agent Layer & Skills Registry for Total Audio Platform

## Overview

This package provides the core infrastructure for building and managing AI-powered agent skills across the Total Audio Platform ecosystem.

## Features

- **Skills Architecture**: Manifest-based, reusable agent skills
- **Skill Registry**: Central registry for managing available skills
- **Type Safety**: Full TypeScript support with exported types
- **JSON Interface**: Consistent JSON-in/JSON-out pattern

## Installation

```bash
pnpm install @total-audio/agent-layer
```

## Usage

### Using a Skill

```typescript
import { runPitchVariation } from '@total-audio/agent-layer/skills';

const result = await runPitchVariation(
  {
    artistName: 'The XX',
    trackTitle: 'On Hold',
    genre: 'Indie Electronic',
    variationType: 'formal',
  },
  {
    userId: 'user-123',
  }
);

if (result.success) {
  console.log('Generated pitch:', result.data);
}
```

### Available Skills

#### Pitch Variation Skill

Generate AI-powered pitch variations for music PR campaigns.

**Variation Types:**
- `formal` - Professional, respectful pitch
- `casual` - Friendly, conversational pitch
- `concise` - Brief, punchy pitch (3 paragraphs max)
- `detailed` - Comprehensive pitch with full context
- `follow-up` - Polite follow-up email

**Input:**
```typescript
{
  artistName: string;
  trackTitle: string;
  genre?: string;
  targetContactType?: 'radio' | 'playlist' | 'press' | 'blog';
  variationType?: 'formal' | 'casual' | 'concise' | 'detailed' | 'follow-up';
  contextInfo?: string;
  streamingLinks?: { spotify?: string; apple?: string; ... };
  previousCoverage?: string[];
}
```

**Output:**
```typescript
{
  success: boolean;
  data?: {
    subjectLine: string;
    body: string;
    variationType: string;
    generatedBy: string;
  };
  error?: string;
  metadata?: {
    duration: number;
    tokensUsed: number;
    model: string;
  };
}
```

## Creating a New Skill

### 1. Create Skill Directory

```bash
mkdir -p skills/my-skill
```

### 2. Create Manifest

```json
{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "What this skill does",
  "inputs": [
    {
      "name": "inputName",
      "type": "string",
      "required": true,
      "description": "Input description"
    }
  ],
  "outputs": [
    {
      "name": "outputName",
      "type": "string",
      "description": "Output description"
    }
  ],
  "permissions": ["anthropic_api"],
  "rateLimit": {
    "requests": 100,
    "windowMs": 3600000
  }
}
```

### 3. Implement Skill

```typescript
import { z } from 'zod';
import type { SkillResult, SkillContext } from '@total-audio/agent-layer/types';

const MySkillInput = z.object({
  inputName: z.string(),
});

type MySkillInputType = z.infer<typeof MySkillInput>;

export async function run(
  input: MySkillInputType,
  context: SkillContext
): Promise<SkillResult> {
  const startTime = Date.now();

  try {
    const validatedInput = MySkillInput.parse(input);

    // Implement skill logic here

    return {
      success: true,
      data: {
        outputName: 'result',
      },
      metadata: {
        duration: Date.now() - startTime,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      metadata: {
        duration: Date.now() - startTime,
      },
    };
  }
}

export function validate(input: any): boolean {
  try {
    MySkillInput.parse(input);
    return true;
  } catch {
    return false;
  }
}
```

### 4. Export Skill

Add to `src/skills/index.ts`:

```typescript
export { run as runMySkill, validate as validateMySkill } from '../../skills/my-skill/run';
```

## Environment Variables

Skills may require API keys:

```bash
# Required for Pitch Variation skill
ANTHROPIC_API_KEY=sk-ant-...
```

## TypeScript Support

All types are exported from the main package:

```typescript
import type {
  SkillManifest,
  SkillContext,
  SkillResult,
  AgentInvocation,
  AgentResponse,
} from '@total-audio/agent-layer';
```

## Development

```bash
# Install dependencies
pnpm install

# Type check
pnpm run typecheck

# Lint
pnpm run lint
```

## Architecture

```
@total-audio/agent-layer/
├── src/
│   ├── index.ts          # Main entry point
│   ├── types/            # TypeScript type definitions
│   ├── skills/           # Skill exports
│   └── registry/         # Skill registry implementation
├── skills/
│   └── pitch-variation/  # Individual skills
│       ├── manifest.json
│       └── run.ts
└── package.json
```

## License

UNLICENSED - Total Audio Promo
