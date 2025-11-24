# A&R Radar - Talent Discovery System

A comprehensive talent discovery and breakout probability system for PR agencies, labels, managers, and advanced artists.

## Overview

A&R Radar is a scouting and breakout probability system that analyzes artists across multiple dimensions to identify promising talent early. It provides:

- Multi-dimensional scoring engine (breakout, momentum, scene alignment, creative uniqueness, etc.)
- Momentum analysis and breakout probability prediction
- Automated shortlist generation based on criteria
- AI-generated insights and opportunities
- Scene-focused talent discovery

## Architecture

### Read-Only Integration

A&R Radar is designed as a **read-heavy analytical layer** that integrates with existing systems:

- **Fusion Layer** - Campaign history and engagement metrics
- **Music Industry Graph (MIG)** - Artist relationships and network connectivity
- **Scenes Engine** - Scene context, pulse, and trends
- **Creative Memory Graph (CMG)** - Creative fingerprints and uniqueness signals
- **Campaign Tracker** - Campaign performance data

**Important**: A&R Radar does NOT modify these systems - it only reads from them via adapters.

## Package Structure

```
packages/anr-radar/
├── src/
│   ├── types.ts                 # Core types and interfaces
│   ├── anrStore.ts              # Database access helpers
│   ├── scoringEngine.ts         # Multi-dimensional scoring logic
│   ├── momentumEngine.ts        # Momentum and breakout probability
│   ├── shortlistEngine.ts       # Shortlist generation
│   ├── insightEngine.ts         # AI-generated insights
│   ├── eventIngestion.ts        # Event ingestion from other systems
│   ├── contextAdapters/         # Read-only adapters
│   │   ├── fusionAdapter.ts
│   │   ├── migAdapter.ts
│   │   ├── scenesAdapter.ts
│   │   └── cmgAdapter.ts
│   ├── utils/                   # Utilities
│   │   ├── math.ts
│   │   ├── logger.ts
│   │   └── dates.ts
│   └── tests/                   # Test suite
└── package.json
```

## Database Schema

A&R Radar creates its own dedicated tables:

- `anr_candidates` - Artist candidates in the radar
- `anr_scores` - Time-series score snapshots
- `anr_events` - Important events (playlists, radio, campaigns, etc.)
- `anr_shortlists` - Saved scouting shortlists
- `anr_shortlist_members` - Shortlist membership
- `anr_insights` - AI-generated insights

See `packages/core-db/supabase/migrations/20251117000001_anr_radar.sql` for full schema.

## Scoring Model v1.0

### Dimension Scores (0.0-1.0)

1. **Breakout Score**: Coverage growth + scene pulse + MIG connectivity
2. **Momentum Score**: Velocity of score changes over time
3. **Scene Alignment Score**: Fit between artist sound and booming scenes
4. **Creative Uniqueness Score**: Distance from genre/scene norms
5. **Campaign Efficiency Score**: Campaign outcome vs input ratio
6. **Engagement Quality Score**: Reply rates and engagement metrics
7. **Risk Score**: Volatility, overexposure, low diversity

### Composite Score

Weighted combination of dimension scores, adjusted for risk:

```
composite = weighted_sum(dimensions) * (1 - risk_penalty * risk_score)
```

Default weights:
- Breakout: 30%
- Momentum: 20%
- Creative Uniqueness: 15%
- Scene Alignment: 15%
- Engagement Quality: 10%
- Campaign Efficiency: 10%
- Risk Penalty: 30%

## Usage

### Installation

```bash
cd packages/anr-radar
npm install
npm run build
```

### Initialize Supabase Client

```typescript
import { setSupabaseClient } from '@total-audio/anr-radar';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

setSupabaseClient(supabase);
```

### Basic Example

```typescript
import {
  upsertCandidate,
  computeScoresForArtist,
  computeBreakoutProbability,
  generateAgencyShortlist,
} from '@total-audio/anr-radar';

// 1. Add a candidate
await upsertCandidate('artist-slug', {
  display_name: 'Artist Name',
  primary_scene_slug: 'hyperpop-uk',
  country: 'UK',
});

// 2. Compute scores
const scores = await computeScoresForArtist('artist-slug');
console.log('Composite Score:', scores?.composite_score);

// 3. Analyze momentum
const breakoutProb = await computeBreakoutProbability(candidate.id);
console.log('Breakout Probability:', breakoutProb?.probability);

// 4. Generate shortlist
const shortlist = await generateAgencyShortlist('user-id', {
  scenes: ['hyperpop-uk', 'drill-london'],
  min_composite_score: 0.6,
  limit: 20,
});
```

## API Routes

The following API routes are available:

1. `GET /api/anr/candidates` - List candidates with filters
2. `GET /api/anr/candidates/[artistSlug]` - Get candidate details
3. `POST /api/anr/candidates/[artistSlug]/refresh` - Refresh scores
4. `GET /api/anr/shortlists` - List user shortlists
5. `POST /api/anr/shortlists` - Create new shortlist
6. `GET /api/anr/shortlists/[id]` - Get shortlist details
7. `GET /api/anr/scenes/[sceneSlug]/candidates` - Get scene candidates
8. `GET /api/anr/insights` - Get user insights
9. `POST /api/anr/insights/refresh` - Regenerate insights

## Frontend Routes

User interfaces available at:

- `/anr` - Overview dashboard
- `/anr/candidates` - Browse and filter candidates
- `/anr/candidates/[artistSlug]` - Candidate detail with radar chart
- `/anr/shortlists` - Manage shortlists
- `/anr/shortlists/[id]` - Shortlist detail
- `/anr/insights` - View AI-generated insights
- `/anr/scenes/[sceneSlug]` - Scene-focused scouting

## Testing

```bash
npm run test          # Run all tests
npm run test:ui       # Run with UI
npm run typecheck     # TypeScript validation
```

## Extending the System

### Adding New Event Sources

1. Create adapter in `src/contextAdapters/`
2. Implement event ingestion in `src/eventIngestion.ts`
3. Update `ANREventType` in `src/types.ts`

### Customizing Scoring Weights

```typescript
import { computeScoresForArtist } from '@total-audio/anr-radar';

const customConfig = {
  model_version: 'v1.1',
  weights: {
    breakout: 0.4,
    momentum: 0.3,
    creative_uniqueness: 0.1,
    scene_alignment: 0.1,
    engagement_quality: 0.05,
    campaign_efficiency: 0.05,
  },
  risk_penalty: 0.2,
};

const scores = await computeScoresForArtist('artist-slug', undefined, customConfig);
```

### Adding New Insight Types

1. Update `ANRInsightType` in `src/types.ts`
2. Implement generator in `src/insightEngine.ts`
3. Add UI rendering in frontend

## Example Score Snapshot

```json
{
  "id": "...",
  "candidate_id": "...",
  "snapshot_date": "2025-11-17",
  "breakout_score": 0.75,
  "momentum_score": 0.82,
  "scene_alignment_score": 0.68,
  "creative_uniqueness_score": 0.71,
  "campaign_efficiency_score": 0.64,
  "engagement_quality_score": 0.59,
  "risk_score": 0.31,
  "composite_score": 0.72,
  "metadata": {
    "model_version": "v1.0",
    "weights": { "breakout": 0.3, "momentum": 0.2, ... },
    "explanation": "High breakout potential. Strengths: strong coverage, high momentum.",
    "components": { ... }
  }
}
```

## Example Shortlist

```json
{
  "id": "...",
  "user_id": "...",
  "name": "Hyperpop UK Prospects",
  "description": "Generated shortlist based on criteria",
  "criteria": {
    "scenes": ["hyperpop-uk"],
    "min_composite_score": 0.6,
    "limit": 20
  },
  "created_at": "2025-11-17T12:00:00Z"
}
```

## Future Enhancements

Potential extensions for the system:

1. **Social Data Integration**: Add Twitter, TikTok, Instagram metrics
2. **Touring Data**: Track live performance history and tour success
3. **Custom ML Models**: Replace heuristic scoring with trained models
4. **Real-Time Alerts**: Notify users when candidates cross thresholds
5. **Collaborative Filtering**: "Artists similar to your portfolio"
6. **Geographic Insights**: Regional talent discovery and scene analysis

## License

MIT

## Support

For issues and feature requests, please file an issue in the main repository.
