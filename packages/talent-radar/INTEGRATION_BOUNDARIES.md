# Talent Radar - Integration Boundaries

## Purpose

This document defines the clear boundaries and contracts between Talent Radar and other systems, with special emphasis on the distinction between **Talent Radar** and **A&R Radar**.

---

## System Overview

**Talent Radar** is a global intelligence layer that:
- Aggregates signals from 7+ systems (MIG, Scenes, CMG, Fusion, Coverage, RCF, Identity)
- Provides high-level artist radar profiles
- Generates global music pulse snapshots
- Detects momentum, breakout potential, and risk signals
- Operates as a **pure intelligence layer** (reads only, no actions)

**Talent Radar is NOT**:
- A shortlist management system
- A scoring/ranking system for A&R decisions
- An action-triggering system
- A user-specific recommendation engine

---

## CRITICAL: Talent Radar vs A&R Radar

### Talent Radar (Global Intelligence)

**Purpose**: High-level ecosystem monitoring

**Characteristics**:
- **Global view**: Tracks all artists across the ecosystem
- **Non-invasive**: Never triggers actions or workflows
- **Read-only**: No writes to other systems' tables
- **Public/shared**: Same data for all users
- **Signals**: Momentum, breakout, risk, opportunities
- **Output**: Global pulse snapshots, artist radar profiles

**Tables**:
- `talent_radar_artists`
- `talent_radar_scenes`
- `talent_radar_microgenres`
- `talent_radar_recommendations` (workspace-scoped)

**API**:
- `GET /api/talent/pulse` - Global music pulse
- `GET /api/talent/artists/[slug]` - Artist radar profile

**Use Cases**:
- "Show me rising artists globally"
- "Which artists have breakout potential?"
- "What's the overall music ecosystem pulse?"
- "Which artists are at risk of stagnation?"

---

### A&R Radar (Decision Management)

**Purpose**: Artist evaluation and shortlist management

**Characteristics**:
- **User-specific**: Each A&R user has their own shortlists
- **Action-oriented**: Can trigger workflows (follow-up, meetings, contracts)
- **Writes**: Creates shortlist entries, candidate states
- **Private**: User-specific scoring and notes
- **Scoring**: Detailed per-dimension scoring (commercial, artistic, cultural)
- **Output**: Personal shortlists, candidate pipelines, decision workflows

**Tables** (assumed, not in Talent Radar):
- `ar_candidates`
- `ar_shortlists`
- `ar_scores`
- `ar_evaluations`
- `ar_workflows`

**API** (assumed, not in Talent Radar):
- `POST /api/ar/candidates` - Add to shortlist
- `PUT /api/ar/candidates/[id]/score` - Update scoring
- `POST /api/ar/workflows/[id]/trigger` - Trigger action

**Use Cases**:
- "Add this artist to my shortlist"
- "Score this artist on commercial potential"
- "Trigger a follow-up workflow for this candidate"
- "Show me my personal A&R pipeline"

---

### Key Differences

| Aspect | Talent Radar | A&R Radar |
|--------|--------------|-----------|
| **Scope** | Global ecosystem | User-specific shortlists |
| **Data Access** | Read-only | Read/write |
| **Actions** | None (pure intelligence) | Workflows, follow-ups |
| **Scoring** | Momentum, breakout, risk | Detailed A&R dimensions |
| **User Context** | Shared/public | Private per user |
| **Tables** | talent_radar_* | ar_* |
| **Purpose** | Ecosystem monitoring | Decision management |

---

### Integration Pattern

**Allowed**: A&R Radar can **read from** Talent Radar

```
┌─────────────────┐
│ Talent Radar    │ ──READ──> │ A&R Radar      │
│ (Global Pulse)  │            │ (Shortlisting) │
└─────────────────┘            └────────────────┘
```

**Example**:
- A&R Radar can display Talent Radar's momentum score alongside user-specific scores
- A&R Radar can filter candidates using Talent Radar's breakout predictions
- A&R Radar can subscribe to Talent Radar pulse updates

**Forbidden**: Talent Radar **NEVER** reads from or writes to A&R Radar

```
┌─────────────────┐
│ Talent Radar    │ ✗✗✗ NO ACCESS ✗✗✗ │ A&R Radar      │
│                 │                    │ (Shortlists)   │
└─────────────────┘                    └────────────────┘
```

**Rationale**: Talent Radar is a global intelligence layer, not aware of individual users' shortlists or decisions.

---

## Integration Contracts

### 1. Talent Radar ↔ MIG (Music Industry Graph)

**Relationship**: Talent Radar **reads from** MIG

**What Talent Radar Reads**:
- Artist connectivity scores (0-1)
- Network centrality metrics
- Tastemaker connection counts
- Industry graph topology

**What Talent Radar Does NOT Do**:
- Modify MIG nodes or edges
- Create new artist relationships
- Duplicate MIG's graph algorithms

**Adapter**: `MIGAdapter` (read-only)

```typescript
const migSignals = await migAdapter.getArtistMIGSignals(artistSlug);
// Returns: { connectivity, centralityScore, tastemakerConnectionCount }
```

---

### 2. Talent Radar ↔ Scenes Engine

**Relationship**: Talent Radar **reads from** Scenes Engine

**What Talent Radar Reads**:
- Scene membership data
- Scene pulse metrics (hotness, momentum)
- Microgenre associations
- Scene fit confidence scores

**What Talent Radar Does NOT Do**:
- Define scenes
- Calculate scene pulse (Scenes Engine's job)
- Store scene data (Scenes Engine is authoritative)

**Adapter**: `ScenesAdapter` (read-only)

```typescript
const sceneFit = await scenesAdapter.getArtistSceneFit(artistSlug);
const scenePulse = await scenesAdapter.getScenePulse(sceneSlug);
// Uses Scenes Engine's hotness score in breakout calculations
```

---

### 3. Talent Radar ↔ CMG (Creative Momentum Graph)

**Relationship**: Talent Radar **reads from** CMG

**What Talent Radar Reads**:
- Creative shift metrics (0-1)
- Fingerprint drift indicators
- Artistic evolution patterns

**What Talent Radar Does NOT Do**:
- Calculate creative fingerprints
- Store creative arc data
- Duplicate CMG's algorithms

**Adapter**: `CMGAdapter` (read-only, placeholder)

```typescript
const creativeShift = await cmgAdapter.getCreativeShift(artistSlug);
// Returns: number (0-1) indicating creative evolution
```

---

### 4. Talent Radar ↔ Fusion Layer

**Relationship**: Talent Radar **reads from** Fusion Layer

**What Talent Radar Reads**:
- Campaign velocity metrics
- Campaign success rates
- Artist activity indicators
- Time-series campaign data

**What Talent Radar Does NOT Do**:
- Create or modify campaigns
- Store campaign data
- Trigger campaign actions

**Adapter**: `FusionAdapter` (read-only)

```typescript
const campaignSignals = await fusionAdapter.getCampaignVelocity(artistSlug);
// Returns: { campaignVelocity, campaignCount }
```

---

### 5. Talent Radar ↔ Coverage Map (Press Intel)

**Relationship**: Talent Radar **reads from** Coverage Map

**What Talent Radar Reads**:
- Press coverage velocity
- Press quality scores
- Media outlet reach metrics

**What Talent Radar Does NOT Do**:
- Track press coverage (Coverage Map's job)
- Store press data

**Adapter**: `CoverageAdapter` (read-only, placeholder)

```typescript
const coverageVelocity = await coverageAdapter.getCoverageVelocity(artistSlug);
const pressQuality = await coverageAdapter.getPressQuality(artistSlug);
```

---

### 6. Talent Radar ↔ RCF (Real-time Campaign Feed)

**Relationship**: Talent Radar **reads from** RCF

**What Talent Radar Reads**:
- Real-time campaign events
- Activity spikes
- Engagement metrics

**What Talent Radar Does NOT Do**:
- Generate campaign events
- Store event data

**Adapter**: `RCFAdapter` (read-only, placeholder)

---

### 7. Talent Radar ↔ Identity Kernel

**Relationship**: Talent Radar **reads from** Identity Kernel

**What Talent Radar Reads**:
- Identity coherence scores
- Brand alignment metrics
- Identity evolution patterns

**What Talent Radar Does NOT Do**:
- Calculate identity scores
- Store identity data

**Adapter**: `IdentityKernelAdapter` (read-only, placeholder)

```typescript
const identityCoherence = await identityAdapter.getIdentityCoherence(artistSlug);
// Returns: number (0-1) indicating identity alignment
```

---

## What Talent Radar OWNS

Talent Radar is the **authoritative source** for:

1. **Artist Signals**
   - Aggregated momentum scores (0-100)
   - Breakout predictions (0-1)
   - Risk assessments (0-1)
   - Multi-signal aggregation logic

2. **Global Pulse Snapshots**
   - Top rising artists
   - Breakout candidates
   - At-risk artists
   - Ecosystem health metrics

3. **Artist Radar Profiles**
   - Comprehensive signal views
   - Opportunity analysis
   - Risk analysis
   - Trajectory predictions

4. **Scene-Level Talent Metrics**
   - Rising scenes from talent perspective
   - Scene-artist momentum correlations

5. **Workspace Recommendations** (optional feature)
   - Workspace-scoped talent recommendations
   - NOT the same as A&R shortlists

---

## Data Flow Patterns

### Read Pattern (Talent Radar consuming signals)

```
┌───────────────┐
│ MIG           │ ──┐
│ Scenes Engine │ ──┤
│ CMG           │ ──┤
│ Fusion        │ ──┼──READ──> ┌─────────────────┐
│ Coverage      │ ──┤           │ Talent Radar    │
│ RCF           │ ──┤           │ Signal Engine   │
│ Identity      │ ──┘           └─────────────────┘
└───────────────┘                        │
                                         ▼
                                ┌──────────────────────┐
                                │ talent_radar_artists │
                                │ talent_radar_scenes  │
                                └──────────────────────┘
```

### Write Pattern (Talent Radar storing aggregated signals)

```
┌──────────────────────┐
│ Talent Radar         │ ──WRITE──> │ talent_radar_artists         │
│ (Signal Aggregation) │             │ talent_radar_scenes          │
│                      │             │ talent_radar_microgenres     │
│                      │             │ talent_radar_recommendations │
└──────────────────────┘             └──────────────────────────────┘
```

---

## Database Tables Owned by Talent Radar

| Table | Purpose | Who Writes |
|-------|---------|-----------|
| `talent_radar_artists` | Aggregated artist signals | Talent Radar ONLY |
| `talent_radar_scenes` | Scene-level talent metrics | Talent Radar ONLY |
| `talent_radar_microgenres` | Microgenre talent signals | Talent Radar ONLY |
| `talent_radar_recommendations` | Workspace recommendations | Talent Radar ONLY |

**No other system should write to these tables.**

**A&R Radar uses separate tables** (e.g., `ar_candidates`, `ar_shortlists`).

---

## API Boundaries

### Talent Radar API Endpoints

- `GET /api/talent/pulse` - Global music pulse snapshot
- `GET /api/talent/artists/[slug]` - Artist radar profile

**All endpoints are READ-ONLY for external consumers.**

### What Other Systems Can Do

Other systems can:
- ✅ Read Talent Radar data via API
- ✅ Display momentum/breakout scores in their UIs
- ✅ Filter lists using Talent Radar metrics
- ✅ Subscribe to pulse updates (if event system exists)

Other systems CANNOT:
- ❌ Write to Talent Radar tables directly
- ❌ Modify artist signals
- ❌ Trigger workflows from Talent Radar (Talent Radar is non-invasive)

---

## Performance Contracts

### Caching

Talent Radar implements internal caching:
- Global pulse: 10-minute TTL
- Artist profiles: 5-minute TTL
- Scene signals: 15-minute TTL

### Batch Processing

- Maximum 20 artists per signal aggregation batch
- Maximum 10 concurrent signal aggregation operations
- Timeout: 30 seconds per artist signal aggregation

### Rate Limits

API endpoints enforce:
- Maximum 100 items per response
- Configurable timeout guards (30s - 2min depending on operation)

---

## Error Handling Contracts

### Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `TALENT_ARTIST_NOT_FOUND` | 404 | Artist has no signals yet |
| `TALENT_SCENE_NOT_FOUND` | 404 | Scene not tracked |
| `TALENT_INVALID_PARAMS` | 400 | Invalid query parameters |
| `TALENT_VALIDATION_ERROR` | 400 | Schema validation failed |
| `TALENT_RATE_LIMITED` | 429 | Too many requests |
| `TALENT_TIMEOUT` | 504 | Request exceeded timeout |
| `TALENT_INSUFFICIENT_DATA` | 422 | Not enough data to compute signals |
| `TALENT_INTERNAL_ERROR` | 500 | Unexpected error |

### Response Format

All API responses follow this envelope:

```typescript
{
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}
```

---

## Unified Dashboard Integration

**Purpose**: Display Talent Radar insights in read-only dashboards

**Allowed**:
- ✅ Fetch global pulse via API
- ✅ Display artist radar profiles
- ✅ Show momentum/breakout/risk visualizations
- ✅ Embed Talent Radar widgets

**Not Allowed**:
- ❌ Modify Talent Radar data from Dashboard
- ❌ Trigger workflows from Dashboard using Talent Radar data (use A&R Radar for that)
- ❌ Create new Talent Radar tables from Dashboard

**Pattern**:
```
Dashboard ──READ ONLY──> Talent Radar API
```

---

## Testing Boundaries

### What to Test in Talent Radar

- Signal aggregation accuracy
- Momentum/breakout/risk scoring algorithms
- Batch processing with concurrency
- Cache behavior and TTL
- API validation and error handling
- Adapter isolation (use mocks for source systems)

### What NOT to Test in Talent Radar

- MIG connectivity algorithms (MIG's responsibility)
- Scenes Engine pulse calculations (Scenes Engine's responsibility)
- CMG creative analysis (CMG's responsibility)
- A&R shortlist logic (A&R Radar's responsibility)

---

## Summary

| System | Relationship | Data Flow | Ownership |
|--------|--------------|-----------|-----------|
| **MIG** | Dependency | MIG → Talent Radar | MIG owns graph |
| **Scenes Engine** | Dependency | Scenes → Talent Radar | Scenes owns scene data |
| **CMG** | Dependency | CMG → Talent Radar | CMG owns creative data |
| **Fusion** | Dependency | Fusion → Talent Radar | Fusion owns campaigns |
| **Coverage** | Dependency | Coverage → Talent Radar | Coverage owns press data |
| **RCF** | Dependency | RCF → Talent Radar | RCF owns events |
| **Identity** | Dependency | Identity → Talent Radar | Identity owns identity data |
| **A&R Radar** | Consumer | Talent Radar → A&R Radar | SEPARATE SYSTEMS |
| **Unified Dashboard** | Consumer | Talent Radar → Dashboard | Read-only integration |

**Key Principle**: Talent Radar is a **pure intelligence layer** that reads from authoritative systems, aggregates signals, and provides high-level ecosystem insights. It never modifies source data and never triggers actions. A&R Radar is a completely separate system for decision management and shortlisting.
