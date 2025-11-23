# Scenes Engine - Integration Boundaries

## Purpose

This document defines the clear boundaries and contracts between Scenes Engine and other systems in the Total Audio Platform.

## System Overview

**Scenes Engine** is a read-heavy analytics layer that:
- Models music scenes, microgenres, regions, and cultural movements
- Aggregates data from MIG, Fusion Layer, and CMG
- Provides scene pulse metrics and recommendations
- **DOES NOT** duplicate functionality from other systems

---

## Integration Contracts

### 1. Scenes Engine ↔ MIG (Music Industry Graph)

**Relationship**: Scenes Engine **reads from** MIG

**What Scenes Engine Reads**:
- Artist connectivity data (who knows who)
- Tastemaker relationships
- Industry graph centrality scores
- Network topology for scene membership inference

**What Scenes Engine Does NOT Do**:
- Modify MIG nodes or edges
- Create new artist relationships
- Duplicate MIG's graph algorithms

**Adapter**: `MIGAdapter` (read-only)

```typescript
// Example: Reading MIG data
const migSignals = await migAdapter.getArtistConnectivity(artistSlug);
// Returns: { connectivity: number, tastemakerLinks: number }
```

---

### 2. Scenes Engine ↔ CMG (Creative Momentum Graph)

**Relationship**: Scenes Engine **reads from** CMG

**What Scenes Engine Reads**:
- Creative arcs and evolution patterns
- Artistic shift metrics
- Style fingerprint data
- Creative momentum indicators

**What Scenes Engine Does NOT Do**:
- Calculate creative fingerprints (that's CMG's job)
- Store creative arc data (CMG is authoritative)
- Duplicate CMG's creative analysis algorithms

**Adapter**: `CMGAdapter` (read-only)

```typescript
// Example: Reading CMG data
const creativeShift = await cmgAdapter.getCreativeShift(artistSlug);
// Returns: number (0-1 indicating creative evolution)
```

---

### 3. Scenes Engine ↔ Fusion Layer

**Relationship**: Scenes Engine **reads from** Fusion Layer

**What Scenes Engine Reads**:
- Campaign metrics (volume, velocity, outcomes)
- Artist activity indicators
- Campaign success rates
- Time-series campaign data

**What Scenes Engine Does NOT Do**:
- Create or modify campaigns
- Store campaign data (Fusion Layer is authoritative)
- Duplicate campaign tracking logic

**Adapter**: `FusionAdapter` (read-only)

```typescript
// Example: Reading Fusion data
const campaignMetrics = await fusionAdapter.getCampaignMetrics(sceneSlug, 30);
// Returns: { campaignVolume: number, avgSuccess: number }
```

---

### 4. Scenes Engine ↔ Identity Kernel

**Relationship**: Scenes Engine **may read from** Identity Kernel (future integration)

**What Scenes Engine Could Read**:
- Artist identity coherence scores
- Brand alignment metrics
- Identity evolution patterns

**What Scenes Engine Does NOT Do**:
- Calculate identity scores (Identity Kernel's responsibility)
- Store identity data

**Status**: Placeholder adapter exists, integration pending

---

## What Scenes Engine OWNS

Scenes Engine is the **authoritative source** for:

1. **Scene Definitions**
   - Scene slugs, names, regions
   - Scene tags and metadata
   - Scene boundaries and classifications

2. **Scene Memberships**
   - Which artists belong to which scenes
   - Membership confidence scores
   - Scene affiliation strength

3. **Microgenre Taxonomies**
   - Microgenre definitions within scenes
   - Microgenre-scene associations
   - Microgenre trend tracking

4. **Scene Relationships**
   - How scenes connect to each other
   - Crossover patterns
   - Scene similarity scores

5. **Scene Pulse Metrics**
   - Scene hotness scores (0-100)
   - Scene growth classifications (Emerging, Hot, Stable, Cooling, etc.)
   - Scene momentum indicators
   - Crossover potential

6. **Scene Recommendations**
   - Personalized scene discovery for artists
   - Scene fit scores
   - Recommendation caching

---

## Data Flow Patterns

### Read Pattern (Scenes Engine consuming data)

```
┌─────────────┐
│ MIG/CMG/    │ ──READ──> │ Scenes Engine │
│ Fusion      │            │ Adapters      │
└─────────────┘            └───────────────┘
                                  │
                                  ▼
                           ┌─────────────────┐
                           │ Scenes Store    │
                           │ (PostgreSQL)    │
                           └─────────────────┘
```

### Write Pattern (Scenes Engine storing its own data)

```
┌──────────────────┐
│ Scenes Engine    │ ──WRITE──> │ scenes             │
│ (Membership,     │             │ microgenres        │
│  Trends,         │             │ scene_memberships  │
│  Relationships)  │             │ scene_trends       │
└──────────────────┘             │ scene_relationships│
                                 │ scene_recommendations_cache │
                                 └────────────────────┘
```

---

## Database Tables Owned by Scenes Engine

| Table | Purpose | Who Writes |
|-------|---------|-----------|
| `scenes` | Scene definitions | Scenes Engine |
| `microgenres` | Microgenre taxonomy | Scenes Engine |
| `scene_memberships` | Artist-scene associations | Scenes Engine |
| `scene_trends` | Time-series scene metrics | Scenes Engine |
| `scene_relationships` | Scene-to-scene connections | Scenes Engine |
| `scene_recommendations_cache` | Personalized recommendations | Scenes Engine |

**No other system should write to these tables.**

---

## API Boundaries

### Scenes Engine API Endpoints

- `GET /api/scenes` - List all scenes
- `GET /api/scenes/[slug]` - Get scene detail
- `GET /api/scenes/[slug]/pulse` - Get scene pulse metrics
- `GET /api/scenes/recommendations` - Get personalized scene recommendations

**All endpoints are READ-ONLY for external consumers.**

### What Other Systems Can Do

Other systems can:
- ✅ Read Scenes Engine data via API
- ✅ Subscribe to scene pulse updates (if event system exists)
- ✅ Use scene membership data for their own analysis

Other systems CANNOT:
- ❌ Write directly to Scenes Engine tables
- ❌ Modify scene definitions
- ❌ Create scene memberships (only Scenes Engine infers these)

---

## Integration with Talent Radar

**Special Relationship**: Talent Radar reads from Scenes Engine

**What Talent Radar Reads**:
- Scene pulse data (hotness, momentum)
- Scene membership information
- Microgenre associations

**Adapter**: `ScenesAdapter` in Talent Radar package (read-only)

```typescript
// Talent Radar reading from Scenes Engine
const sceneFit = await scenesAdapter.getArtistSceneFit(artistSlug);
const scenePulse = await scenesAdapter.getScenePulse(sceneSlug);
```

**Boundary**: Talent Radar NEVER writes to Scenes Engine tables.

---

## Performance Contracts

### Caching

Scenes Engine implements internal caching:
- Scene pulse: 5-minute TTL
- Scene details: 30-minute TTL
- Recommendations: 15-minute TTL

**External systems should not implement their own caching layers** for Scenes Engine data without coordination.

### Batch Processing

Scenes Engine supports batch queries:
- Maximum 100 scenes per batch request
- Maximum 10,000 memberships per query
- Concurrent processing with configurable limits (default: 10 concurrent operations)

### Rate Limits

API endpoints enforce:
- Maximum 100 items per response (pagination required)
- Configurable timeout guards
- Graceful degradation (partial failures return available data)

---

## Error Handling Contracts

### Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `SCENES_NOT_FOUND` | 404 | Scene does not exist |
| `MICROGENRE_NOT_FOUND` | 404 | Microgenre does not exist |
| `SCENES_INVALID_PARAMS` | 400 | Invalid query parameters |
| `SCENES_VALIDATION_ERROR` | 400 | Schema validation failed |
| `SCENES_RATE_LIMITED` | 429 | Too many requests |
| `SCENES_TIMEOUT` | 504 | Request exceeded timeout |
| `SCENES_INTERNAL_ERROR` | 500 | Unexpected error |

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

**External systems MUST handle both success and error cases.**

---

## Testing Boundaries

### What to Test in Scenes Engine

- Scene pulse calculation accuracy
- Membership inference algorithms
- Relationship detection logic
- Cache behavior and TTL
- API validation and error handling

### What NOT to Test in Scenes Engine

- MIG graph algorithms (MIG's responsibility)
- CMG creative analysis (CMG's responsibility)
- Fusion campaign tracking (Fusion's responsibility)
- Adapter connection reliability (test with mocks)

---

## Future Integration Points

### Planned (Not Yet Implemented)

1. **Identity Kernel Integration**
   - Read artist identity coherence scores
   - Use for scene fit calculations

2. **RCF (Real-time Campaign Feed) Integration**
   - Read real-time campaign events
   - Update scene pulse metrics dynamically

3. **Press Kit Intel Integration**
   - Read press coverage quality
   - Factor into scene momentum calculations

4. **Reply Intel Integration**
   - Read reply engagement metrics
   - Factor into scene activity scores

---

## Summary

| System | Relationship | Data Flow | Ownership |
|--------|--------------|-----------|-----------|
| **MIG** | Dependency | MIG → Scenes Engine | MIG owns graph |
| **CMG** | Dependency | CMG → Scenes Engine | CMG owns creative data |
| **Fusion** | Dependency | Fusion → Scenes Engine | Fusion owns campaigns |
| **Talent Radar** | Consumer | Scenes Engine → Talent Radar | Scenes Engine owns scene data |
| **Unified Dashboard** | Consumer | Scenes Engine → Dashboard | Scenes Engine provides read-only views |

**Key Principle**: Scenes Engine is a **read-heavy analytics layer** that aggregates data from authoritative systems and produces its own scene-specific insights. It never modifies source data in other systems.
