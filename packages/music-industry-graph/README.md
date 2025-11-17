# Music Industry Graph (MIG)

A graph-based data intelligence layer that models the entire UK/EU/global music ecosystem.

## Overview

The Music Industry Graph (MIG) is a comprehensive graph database system that connects artists, journalists, radio hosts, playlists, blogs, DJs, labels, scenes, and microgenres in a unified network. It enables:

- **Graph-based recommendations** for similar artists and pitch targets
- **Scene pulse analytics** to track emerging trends
- **Influence pathfinding** to discover degrees of separation
- **Natural language queries** across the entire music ecosystem
- **Microgenre clustering** to identify emerging sounds
- **Cross-scene analysis** to find tastemakers and crossover opportunities

## Installation

```bash
npm install @total-audio/music-industry-graph
```

## Requirements

- Node.js 18+
- Supabase account with RLS policies configured
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Database Setup

Run the migration to create MIG tables:

```bash
# Located in: packages/core-db/supabase/migrations/20251117000001_mig_core.sql
```

This creates:
- `migraph_nodes` - All entities in the music ecosystem
- `migraph_edges` - Relationships between entities
- `migraph_metadata` - Graph-wide configuration

## Usage

### Basic Node Operations

```typescript
import {
  getNodeBySlug,
  searchNodesByType,
  addNode,
  getNeighbors,
} from '@total-audio/music-industry-graph';

// Get a node by slug
const artist = await getNodeBySlug('artist-slug');

// Search for nodes
const londonArtists = await searchNodesByType('artist', 'london', 50);

// Get neighbors
const neighbors = await getNeighbors(artist.id, {
  relationship_filter: ['influences', 'collaborates'],
  depth_limit: 2,
});

// Add a new node
const newArtist = await addNode({
  type: 'artist',
  name: 'Example Artist',
  slug: 'example-artist',
  country: 'UK',
  metadata: {
    genres: ['alt-r&b', 'electronic'],
    location: { city: 'London', country: 'UK' },
  },
  external_ids: {
    spotify_id: 'abc123',
  },
});
```

### Graph Queries

```typescript
import {
  getGraphNeighborhood,
  getGraphForScene,
  getGraphForMicrogenre,
} from '@total-audio/music-industry-graph';

// Get neighborhood around a node
const neighborhood = await getGraphNeighborhood(artistId, 2);

// Get all nodes in a scene
const sceneGraph = await getGraphForScene('london-alt-rnb');

// Get all nodes in a microgenre
const microGraph = await getGraphForMicrogenre('uk-garage');
```

### Recommendations

```typescript
import {
  recommendSimilarArtists,
  recommendPitchTargets,
  recommendScenes,
} from '@total-audio/music-industry-graph';

// Get similar artists
const similar = await recommendSimilarArtists(artistId, {
  limit: 10,
  min_score: 0.5,
});

// Get pitch target recommendations
const targets = await recommendPitchTargets(artistId, {
  limit: 20,
  filters: { country: 'UK' },
});

// Get scene recommendations
const scenes = await recommendScenes(artistId);
```

### Pathfinding

```typescript
import {
  findShortestPath,
  findInfluencePath,
  getDegreesOfSeparation,
} from '@total-audio/music-industry-graph';

// Find shortest path between two nodes
const path = await findShortestPath(sourceId, targetId);

// Find path with maximum influence
const influencePath = await findInfluencePath(sourceId, targetId, {
  relationship_weights: {
    influences: 2.0,
    supports: 1.5,
  },
});

// Get degrees of separation
const degrees = await getDegreesOfSeparation(sourceId, targetId);
```

### Scene Pulse Analytics

```typescript
import {
  computeScenePulse,
  getScenePulseForCountry,
  getGlobalTrendingScenes,
} from '@total-audio/music-industry-graph';

// Get pulse for a specific scene
const pulse = await computeScenePulse('london-alt-rnb');

// Get all scenes in a country with pulse data
const ukPulse = await getScenePulseForCountry('UK');

// Get globally trending scenes
const trending = await getGlobalTrendingScenes(10);
```

### Natural Language Queries

```typescript
import { executeNLQuery } from '@total-audio/music-industry-graph';

// Execute natural language queries
const result = await executeNLQuery('show me all London alt-R&B artists');
const result2 = await executeNLQuery('who covers UK rap?');
const result3 = await executeNLQuery('find playlist curators in Bristol');
```

## API Routes

The MIG package is integrated with Next.js API routes:

- `GET /api/mig/node/[slug]` - Get node by slug
- `GET /api/mig/search?type=artist&query=london` - Search nodes
- `POST /api/mig/query` - Natural language query
- `GET /api/mig/scene/[slug]` - Get scene graph
- `GET /api/mig/microgenre/[slug]` - Get microgenre graph
- `POST /api/mig/recommend` - Get recommendations
- `GET /api/mig/pulse/[country]` - Get country scene pulse

## UI Components

Pre-built React components for the Scene Explorer:

- `GraphCanvas` - Interactive graph visualization
- `NodeDetailPanel` - Node information sidebar
- `MIGSearchBar` - Search interface
- `ScenePulseHeatmap` - Scene activity visualization

## Architecture

### Zero Overlap Constraint

MIG is a **standalone system** that:
- Does NOT re-implement Fusion Layer, CMG, or other existing subsystems
- MAY read from Fusion Layer for artist/scene metadata (read-only)
- Provides its own graph database layer, APIs, and UI
- Exists as an independent product module

### Node Types

- `artist` - Musical artists
- `journalist` - Music journalists and writers
- `radio_host` - Radio presenters
- `playlist` - Spotify/Apple Music playlists
- `blog` - Music blogs and publications
- `dj` - DJs and selectors
- `label` - Record labels
- `scene` - Local music scenes
- `microgenre` - Sub-genres and micro-genres
- `event` - Events and festivals
- `venue` - Music venues
- `radio_show` - Radio shows
- `podcast` - Music podcasts

### Relationship Types

- `influences` - Influences another entity
- `supports` - Supports or backs another entity
- `covers` - Covers or writes about
- `collaborates` - Collaborates with
- `same_scene` - Part of the same scene
- `same_microgenre` - Part of the same microgenre
- `similar_to` - Similar to another entity
- `part_of` - Member of a scene/genre
- And 15+ more relationship types...

## Testing

```bash
npm test
```

## Development

```bash
# Build the package
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run typecheck
```

## License

MIT

## Author

Total Audio
