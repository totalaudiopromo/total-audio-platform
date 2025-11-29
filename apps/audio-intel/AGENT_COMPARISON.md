# Social Media Agent Comparison

Comparison of BlueSky and Threads posting agents for Audio Intel automation.

## Agent Architecture

Both agents follow identical interface patterns for consistency and maintainability.

### Common Interface

```typescript
// Core posting interface (both agents)
interface PostingAgent {
  post(text: string): Promise<PostResult>;
  processScheduledPosts(calendar: Post[]): Promise<Results>;
  healthCheck(): Promise<HealthStatus>;
  getContentByTitle(title: string): string | null;
}

// Factory pattern
export function createAgent(): PostingAgent;
```

## Feature Comparison

| Feature             | BlueSky Agent     | Threads Agent                       |
| ------------------- | ----------------- | ----------------------------------- |
| **Authentication** | Username/password | OAuth access token                  |
| **Protocol**       | AT Protocol       | Instagram Graph API                 |
| **Character Limit**| 300               | 500                                 |
| **Posting Method** | Single-step       | Two-step (create + publish)         |
| **Rate Limiting**  | 1s delay          | 2s delay                            |
| **Health Check**   | Login test        | API access test                     |
| **Insights**       |  Not available  |  Views, likes, replies, followers |
| **Content Mapping**| 8 posts           | 10 posts                            |
| **Dependencies**   | @atproto/api      | axios (existing)                    |

## Implementation Details

### BlueSky Agent

- **Lines of Code**: 294
- **API Client**: @atproto/api (external package)
- **Authentication**: Session-based (login required)
- **Posting**: Direct post creation
- **Best For**: Tech-savvy audience, decentralised platform

### Threads Agent

- **Lines of Code**: 571
- **API Client**: axios (already installed)
- **Authentication**: Long-lived access token (60 days)
- **Posting**: Two-step workflow (container → publish)
- **Best For**: Broader audience, Instagram integration

## Content Strategy

### BlueSky Posts (8 total)

1. The Time Problem
2. BBC Radio 1 Test
3. Regional Radio Opportunity
4. The Cost Reality
5. Response Rate Breakthrough
6. The Brighton Reality
7. Submission Windows
8. The Spreadsheet Problem

**Focus**: Concise, tech-focused messaging (300 chars)

### Threads Posts (10 total)

1. The Real Problem
2. BBC Radio 1 Success
3. Regional Radio Strategy
4. The Pricing Problem
5. Response Rate Data
6. The Brighton Producer Story
7. Submission Window Problem
8. The Spreadsheet Chaos
9. Real ROI Calculation
10. Industry Truth

**Focus**: Detailed storytelling, case studies (500 chars)

## Usage Examples

### BlueSky

```typescript
import { createBlueskyAgent } from './lib/bluesky-posting-agent';

const agent = createBlueskyAgent();
await agent.authenticate();
const result = await agent.post('Content here (max 300 chars)');
```

### Threads

```typescript
import { createThreadsAgent } from './lib/threads-posting-agent';

const agent = createThreadsAgent();
const result = await agent.post('Content here (max 500 chars)');
```

## Scheduling Integration

Both agents integrate with `CONTENT_CALENDAR.json`:

### Calendar Structure

```json
{
  "schedule": [
    {
      "platform": "Bluesky",
      "title": "The Time Problem",
      "scheduledTime": "2025-09-29T13:00:00.396Z"
    },
    {
      "platform": "Threads",
      "title": "The Real Problem",
      "scheduledTime": "2025-09-30T08:00:00.396Z"
    }
  ]
}
```

### Processing Logic

```typescript
// Both agents use same interface
const agent = createAgent(); // BlueSky or Threads
const results = await agent.processScheduledPosts(calendar.schedule);

// Results structure (identical)
{
  posted: 2,
  skipped: 5,
  failed: 0,
  details: [...]
}
```

## Error Handling

Both agents implement identical error handling patterns:

```typescript
// Graceful failure with detailed errors
{
  success: false,
  error: 'Descriptive error message'
}

// Success with resource identifiers
{
  success: true,
  uri: 'at://...',      // BlueSky
  postId: '123456'      // Threads
}
```

## Environment Variables

### BlueSky

```bash
BLUESKY_IDENTIFIER=username.bsky.social
BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### Threads

```bash
THREADS_USER_ID=123456789
THREADS_ACCESS_TOKEN=IGQ...
FACEBOOK_APP_ID=987654321
FACEBOOK_APP_SECRET=abc123
```

## Setup Complexity

### BlueSky (Simple)

1. Create account on bsky.app
2. Generate app password
3. Add credentials to .env
4. Done! 

**Time**: 5 minutes

### Threads (Complex)

1. Convert Instagram to Professional
2. Create Meta Developer app
3. Configure OAuth settings
4. Generate access token
5. Convert to long-lived token
6. Get Instagram User ID
7. Add credentials to .env
8. Test integration

**Time**: 30-45 minutes

## Maintenance

### BlueSky

- **Token Expiry**: App passwords don't expire
- **Rotation**: Optional security best practice
- **Maintenance**: Minimal

### Threads

- **Token Expiry**: 60 days (long-lived)
- **Rotation**: Required before expiration
- **Maintenance**: Monthly token refresh
- **Monitoring**: API rate limits via Meta dashboard

## Performance

### BlueSky

- **API Calls**: No strict published limits
- **Rate Limiting**: 1s between posts (conservative)
- **Uptime**: Good (decentralised network)

### Threads

- **API Calls**: 1,000 per hour per user
- **Publishing**: 250 posts per day
- **Rate Limiting**: 2s between posts (API guidelines)
- **Uptime**: Excellent (Meta infrastructure)

## Monitoring & Analytics

### BlueSky

- Post URIs for tracking
- External analytics required
- No built-in insights API

### Threads

- Post IDs for tracking
- Built-in insights API
- Metrics: views, likes, replies, reposts, quotes
- Account-level and post-level analytics

## Recommended Usage

### BlueSky Best For:

- Tech industry audience
- Early adopters
- Decentralised platform advocates
- Quick setup requirements

### Threads Best For:

- Broader music industry audience
- Instagram integration benefits
- Detailed analytics needs
- Established social presence

## Cross-Platform Strategy

Both agents can run simultaneously:

```typescript
// Multi-platform posting
import { createBlueskyAgent } from './lib/bluesky-posting-agent';
import { createThreadsAgent } from './lib/threads-posting-agent';
import calendar from './social-content/CONTENT_CALENDAR.json';

async function postToAllPlatforms() {
  const bluesky = createBlueskyAgent();
  const threads = createThreadsAgent();

  await bluesky.authenticate();

  const blueskyResults = await bluesky.processScheduledPosts(calendar.schedule);
  const threadsResults = await threads.processScheduledPosts(calendar.schedule);

  return {
    bluesky: blueskyResults,
    threads: threadsResults,
  };
}
```

## Migration Path

If switching between platforms:

1. Content already mapped for both
2. Calendar includes both platforms
3. Change agent in cron job
4. Update environment variables
5. No code changes needed

## Summary

| Aspect               | Winner  | Reason                 |
| -------------------- | ------- | ---------------------- |
| **Setup Speed**     | BlueSky | 5 min vs 45 min        |
| **Analytics**       | Threads | Built-in insights API  |
| **Maintenance**     | BlueSky | No token expiry        |
| **Audience Reach**  | Threads | Instagram network      |
| **Rate Limits**     | Threads | Clear published limits |
| **Content Length**  | Threads | 500 vs 300 chars       |
| **Setup Complexity**| BlueSky | Simple credentials     |
| **Long-term Cost**  | Equal   | Both free              |

## Recommendation

**Use Both Platforms**:

- BlueSky for tech-savvy early adopters
- Threads for broader music industry reach
- Leverage existing content mapping
- Maximise audience coverage
- Minimal additional overhead (agents share interface)

---

**Status**: Both agents production-ready
**Maintainer**: Chris Schofield / Total Audio
**Last Updated**: October 2025
