# Real-Time Coverage Feed (RCF)

A high-frequency, real-time streaming feed that aggregates music industry events into a single, unified dashboard.

## 🎯 What is RCF?

RCF is a **live firehose** of music industry intelligence, aggregating signals from across your entire ecosystem:

- **Coverage**: Playlist adds, press features, radio plays, blog mentions
- **Scenes**: Pulse changes, trend spikes, momentum shifts
- **Network**: MIG connection discoveries, journalist activity
- **Campaigns**: Autopilot progress, Tracker activities, milestone completions
- **Signals**: Coverage spikes, creative breakthroughs
- **External**: YouTube, SoundCloud, Bandcamp, TikTok, Instagram (stubs)

### What RCF is NOT

- Not an automation system
- Not a campaign creator
- Not a replacement for Autopilot/MAL
- Not a replacement for Scenes Engine or MIG
- Not a creative generator
- Not a contact manager

**RCF only reads data and streams events in real-time.**

## 📦 Package Structure

```
packages/rcf/
├── src/
│   ├── types.ts                 # TypeScript type definitions
│   ├── pipeline.ts              # Main orchestration pipeline
│   ├── eventNormalizer.ts       # Event standardization
│   ├── eventWeights.ts          # Importance scoring
│   ├── eventPublisher.ts        # Database + Realtime publishing
│   ├── realtime.ts              # SSE/WebSocket management
│   ├── subscriptionEngine.ts    # User subscription management
│   ├── feedBuilder.ts           # Paginated feed queries
│   ├── eventIngestors/
│   │   ├── playlistIngestor.ts
│   │   ├── pressIngestor.ts
│   │   ├── radioIngestor.ts
│   │   ├── blogIngestor.ts
│   │   ├── migIngestor.ts
│   │   ├── scenesIngestor.ts
│   │   ├── cmgIngestor.ts
│   │   ├── campaignIngestor.ts
│   │   ├── communityIngestor.ts
│   │   └── externalSourcesIngestor.ts
│   └── utils/
│       ├── logger.ts
│       └── time.ts
└── tests/
    ├── eventNormalizer.test.ts
    ├── eventWeights.test.ts
    ├── feedBuilder.test.ts
    └── subscriptionEngine.test.ts
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd packages/rcf
pnpm install
```

### 2. Run Database Migration

```bash
# Apply RCF schema
psql -d your_database -f ../core-db/supabase/migrations/20251117000001_rcf_system.sql
```

### 3. Run Pipeline

```typescript
import { runPipeline } from '@total-audio/rcf';

// Run once
const result = await runPipeline();
console.log(`Published ${result.total_published} events`);

// Run on schedule (every minute)
import { schedulePipeline } from '@total-audio/rcf';
const interval = schedulePipeline(1); // Every 1 minute
```

### 4. Fetch Feed

```typescript
import { buildUserFeed } from '@total-audio/rcf';

const feed = await buildUserFeed('user-123', {
  event_types: ['playlist_add', 'press_feature'],
  limit: 50,
});

console.log(`Found ${feed.length} events`);
```

## 📡 API Routes

### GET /api/rcf/feed

Get paginated RCF events.

**Query Parameters:**
- `types` - Comma-separated event types (e.g., `playlist_add,press_feature`)
- `artists` - Comma-separated artist slugs
- `scenes` - Comma-separated scene slugs
- `min_weight` - Minimum importance score (0.0-1.0)
- `max_weight` - Maximum importance score (0.0-1.0)
- `since` - ISO timestamp (events after this time)
- `before` - ISO timestamp (events before this time)
- `limit` - Number of events to return (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**

```bash
curl "http://localhost:3000/api/rcf/feed?types=playlist_add,press_feature&limit=20"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "evt_123",
      "event_type": "playlist_add",
      "artist_slug": "artist-1",
      "entity_slug": "fresh-finds-playlist",
      "scene_slug": "uk-garage",
      "metadata": {
        "playlistName": "Fresh Finds",
        "curator": "Spotify",
        "followerCount": 500000,
        "addedAt": "2025-11-17T10:30:00Z"
      },
      "weight": 0.75,
      "created_at": "2025-11-17T10:30:00Z",
      "isNew": true,
      "isHighlighted": true,
      "displayCategory": "Coverage",
      "icon": "🎵"
    }
  ],
  "meta": {
    "count": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### GET /api/rcf/stream

Server-Sent Events (SSE) stream for real-time events.

**Example:**

```javascript
const eventSource = new EventSource('/api/rcf/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'event') {
    console.log('New event:', data.event);
  }
};
```

**SSE Payload:**

```json
{
  "type": "event",
  "event": {
    "id": "evt_456",
    "event_type": "press_feature",
    "metadata": { ... },
    "weight": 0.8
  },
  "timestamp": "2025-11-17T10:35:00Z"
}
```

### GET /api/rcf/subscriptions

Get current user subscription.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "user_id": "user_456",
    "subscribed_types": [
      "playlist_add",
      "press_feature",
      "radio_spin",
      "campaign_event"
    ],
    "subscribed_artists": ["artist-1", "artist-2"],
    "subscribed_scenes": ["uk-garage"],
    "created_at": "2025-11-01T00:00:00Z",
    "updated_at": "2025-11-17T10:00:00Z"
  }
}
```

### POST /api/rcf/subscriptions

Update user subscription.

**Request Body:**

```json
{
  "subscribed_types": ["playlist_add", "press_feature"],
  "subscribed_artists": ["artist-1"],
  "subscribed_scenes": ["uk-garage"]
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

### POST /api/rcf/ingest

Manually trigger RCF pipeline (admin-only).

**Headers:**
- `x-admin-key: YOUR_ADMIN_KEY`

**Request Body (optional):**

```json
{
  "ingestors": ["playlistAdds", "pressFeatures"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_ingested": 25,
    "total_normalized": 23,
    "total_inserted": 23,
    "total_published": 23,
    "duration_ms": 1234,
    "errors": []
  },
  "meta": {
    "mode": "selective"
  }
}
```

## 📊 Event Types

### Coverage Events

#### playlist_add

```json
{
  "event_type": "playlist_add",
  "metadata": {
    "playlistName": "Fresh Finds",
    "playlistId": "spotify:playlist:123",
    "curator": "Spotify",
    "curatorInfluence": 0.85,
    "followerCount": 500000,
    "addedAt": "2025-11-17T10:00:00Z",
    "position": 12
  },
  "weight": 0.75
}
```

#### press_feature

```json
{
  "event_type": "press_feature",
  "metadata": {
    "publication": "NME",
    "publicationTier": "tier1",
    "writer": "John Doe",
    "articleTitle": "Rising Stars of UK Garage",
    "articleUrl": "https://nme.com/article",
    "quote": "An exciting new voice",
    "sentiment": "positive",
    "reach": 250000
  },
  "weight": 0.85
}
```

#### radio_spin

```json
{
  "event_type": "radio_spin",
  "metadata": {
    "stationName": "BBC Radio 6 Music",
    "stationType": "bbc",
    "showName": "Tom Ravenscroft Show",
    "presenter": "Tom Ravenscroft",
    "spinTime": "2025-11-17T14:30:00Z",
    "reach": 1200000,
    "firstPlay": true
  },
  "weight": 0.9
}
```

### Scene Events

#### scene_pulse_change

```json
{
  "event_type": "scene_pulse_change",
  "scene_slug": "uk-garage",
  "metadata": {
    "sceneName": "UK Garage",
    "oldPulse": 65,
    "newPulse": 78,
    "delta": 13,
    "direction": "up",
    "contributingFactors": ["artist_growth", "press_activity"]
  },
  "weight": 0.7
}
```

### Creative Events

#### creative_breakthrough

```json
{
  "event_type": "creative_breakthrough",
  "metadata": {
    "breakthroughType": "motif",
    "description": "Novel chord progression combining UK garage rhythms with ambient textures",
    "cmgScore": 0.87,
    "details": {
      "key": "D minor",
      "bpm": 130
    }
  },
  "weight": 0.9
}
```

### Campaign Events

#### campaign_event

```json
{
  "event_type": "campaign_event",
  "metadata": {
    "campaignId": "camp_123",
    "campaignName": "Spring Release Campaign",
    "stage": "outreach",
    "action": "contacts_researched",
    "result": "success",
    "details": {
      "contacts_found": 45
    }
  },
  "weight": 0.5
}
```

## 🎨 Frontend Integration

### Basic Feed Component

```tsx
'use client';

import { useState, useEffect } from 'react';
import type { RCFUserFeedEntry } from '@total-audio/rcf/types';

export function RCFFeed() {
  const [events, setEvents] = useState<RCFUserFeedEntry[]>([]);

  useEffect(() => {
    // Fetch initial events
    fetch('/api/rcf/feed?limit=50')
      .then((res) => res.json())
      .then((data) => setEvents(data.data));

    // Setup real-time stream
    const eventSource = new EventSource('/api/rcf/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'event') {
        setEvents((prev) => [data.event, ...prev]);
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Admin key for manual ingestion
RCF_ADMIN_KEY=your-secret-admin-key

# Enable debug logging
RCF_DEBUG=true

# Database connection (handled by @total-audio/core-db)
DATABASE_URL=postgresql://...
```

### Pipeline Schedule

Set up a cron job or Vercel Cron to run the pipeline:

```typescript
// pages/api/cron/rcf-ingest.ts
import { runPipeline } from '@total-audio/rcf';

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers['x-vercel-cron-secret'] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const result = await runPipeline();

  res.json({
    success: true,
    published: result.total_published,
  });
}
```

**vercel.json:**

```json
{
  "crons": [
    {
      "path": "/api/cron/rcf-ingest",
      "schedule": "* * * * *"
    }
  ]
}
```

## 🧪 Testing

Run tests:

```bash
cd packages/rcf
pnpm test
```

Test specific module:

```bash
pnpm test eventNormalizer
pnpm test eventWeights
pnpm test feedBuilder
pnpm test subscriptionEngine
```

## 🚦 Future Integrations

### External Platform APIs

These are currently stubs. To implement:

1. **YouTube**: Integrate YouTube Data API v3
2. **SoundCloud**: Integrate SoundCloud API
3. **Bandcamp**: Implement scraper (no official API)
4. **TikTok**: Integrate TikTok API (if available)
5. **Instagram**: Integrate Instagram Graph API

### Example Integration

```typescript
// packages/rcf/src/eventIngestors/externalSourcesIngestor.ts

export async function ingestYouTubeSignals(): Promise<RCFIngestedEvent[]> {
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

  // Fetch recent video stats
  const response = await youtube.videos.list({
    part: ['statistics'],
    id: ['video-id'],
  });

  // Convert to RCF events
  const events: RCFIngestedEvent[] = [];
  // ... transform logic

  return events;
}
```

## 📚 Additional Resources

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Event Weight Configuration](./docs/WEIGHTS.md)
- [Ingestor Development Guide](./docs/INGESTORS.md)
- [API Reference](./docs/API.md)

## 🤝 Contributing

1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit PR

## 📄 License

UNLICENSED - Total Audio Promo proprietary code
