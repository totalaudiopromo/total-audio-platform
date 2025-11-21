# Twitter/X Posting Agent

Autonomous posting agent for Audio Intel social media automation on Twitter/X.

## Features

-  **Single Tweet Posting**: Post individual tweets (280 character limit)
-  **Thread Posting**: Automatically split long content into threads (5-7 tweets)
-  **Scheduled Posts**: Process posts from content calendar
-  **Content Mapping**: Pre-configured content from `TWITTER_X_THREADS_RADIO_PROMOTERS.md`
-  **Authentication**: OAuth 1.0a authentication with Twitter API v2
-  **Rate Limiting**: Built-in delays to respect Twitter API limits
-  **Health Checks**: Verify credentials and connection status

## Installation

The required package is already installed:

```bash
npm install twitter-api-v2
```

## Configuration

### 1. Get Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app (or use existing)
3. Navigate to "Keys and tokens" tab
4. Generate/regenerate your API Key & Secret (Consumer Keys)
5. Generate/regenerate your Access Token & Secret (Authentication Tokens)
6. **Important**: Ensure your app has "Read and Write" permissions

### 2. Set Environment Variables

Copy `.env.twitter.example` to `.env.local` and add your credentials:

```bash
cp .env.twitter.example .env.local
```

Edit `.env.local`:

```env
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
```

**Never commit `.env.local` to git!**

## Usage

### Basic Setup

```typescript
import { createTwitterAgent } from './lib/twitter-posting-agent';

const agent = createTwitterAgent();
```

### Example 1: Post a Single Tweet

```typescript
const agent = createTwitterAgent();

// Authenticate
await agent.authenticate();

// Post a tweet (max 280 characters)
const result = await agent.post(
  'After 5+ years promoting music to UK radio, I was spending 15+ hours weekly researching contacts.\n\n' +
    'Built Audio Intel to solve this properly. Now it takes 2 minutes.\n\n' +
    'intel.totalaudiopromo.com'
);

if (result.success) {
  console.log('Tweet posted! ID:', result.id);
}
```

### Example 2: Post a Thread

```typescript
const agent = createTwitterAgent();

// Get pre-configured content
const content = agent.getContentByTitle('The Brighton Producer Story');

// Post as thread (automatically splits into multiple tweets)
const result = await agent.postThread(content);

if (result.success) {
  console.log(`Thread posted! ${result.count} tweets`);
  console.log('Tweet IDs:', result.ids);
}
```

### Example 3: Process Scheduled Posts

```typescript
import { createTwitterAgent } from './lib/twitter-posting-agent';
import contentCalendar from './social-content/CONTENT_CALENDAR.json';

const agent = createTwitterAgent();

// Process all Twitter/X posts scheduled for current time
const results = await agent.processScheduledPosts(contentCalendar.schedule);

console.log(`Posted: ${results.posted}`);
console.log(`Skipped: ${results.skipped}`);
console.log(`Failed: ${results.failed}`);
```

### Example 4: Health Check

```typescript
const agent = createTwitterAgent();

const health = await agent.healthCheck();

if (health.healthy) {
  console.log(' Twitter agent ready');
} else {
  console.error(' Health check failed:', health.error);
}
```

## Available Content

Pre-configured threads mapped from `TWITTER_X_THREADS_RADIO_PROMOTERS.md`:

1. **The 2AM Reality** - Origin story and problem awareness
2. **The Contact Intelligence Reality** - Feature demonstration
3. **The Brighton Producer Story** - Founder credibility and authenticity
4. **The Submission Window Problem** - Urgency and time-saving benefits
5. **The Cost Reality** - Pricing comparison and value proposition
6. **The Response Rate Breakthrough** - Results and social proof

Each thread contains 5-7 tweets with natural breaks and UTM tracking.

## API Methods

### `authenticate(): Promise<boolean>`

Verifies credentials with Twitter API.

```typescript
const authenticated = await agent.authenticate();
```

### `post(text: string): Promise<PostResult>`

Posts a single tweet (max 280 characters).

```typescript
const result = await agent.post('Your tweet text here');
```

Returns:

```typescript
{
  success: boolean;
  id?: string;
  error?: string;
}
```

### `postThread(text: string): Promise<ThreadResult>`

Posts a thread by splitting content into multiple tweets.

```typescript
const result = await agent.postThread(longContent);
```

Returns:

```typescript
{
  success: boolean;
  ids?: string[];
  count?: number;
  error?: string;
}
```

### `getContentByTitle(title: string): string | null`

Retrieves pre-configured content by title.

```typescript
const content = agent.getContentByTitle('The Brighton Producer Story');
```

### `processScheduledPosts(calendar): Promise<ProcessResult>`

Processes scheduled posts from content calendar (posts within 1-hour window of scheduled time).

```typescript
const results = await agent.processScheduledPosts(calendar.schedule);
```

Returns:

```typescript
{
  posted: number;
  skipped: number;
  failed: number;
  details: Array<{
    title: string;
    status: string;
    ids?: string[];
    count?: number;
    error?: string;
  }>;
}
```

### `healthCheck(): Promise<HealthResult>`

Checks agent health and authentication status.

```typescript
const health = await agent.healthCheck();
```

## Content Calendar Integration

The agent integrates with `CONTENT_CALENDAR.json`. Twitter/X posts are identified by:

```json
{
  "platform": "Twitter/X",
  "title": "The Brighton Producer Story",
  "scheduledTime": "2025-10-01T08:00:00.396Z",
  "status": "scheduled"
}
```

## Rate Limiting

Built-in rate limiting:

- **Between tweets in thread**: 1 second delay
- **Between threads**: 2 second delay
- **Twitter API limits**:
  - Free tier: 1,500 tweets/month (50/day)
  - Elevated access: 3,000 tweets/month

## Thread Splitting Logic

The agent automatically splits long content into tweets:

1. Splits by double newlines (paragraph breaks)
2. Respects 280 character limit per tweet
3. If paragraph too long, splits by sentences
4. Maintains natural reading flow
5. Links tweets as replies to create thread

## Error Handling

All methods return detailed error information:

```typescript
const result = await agent.post(text);

if (!result.success) {
  console.error('Error:', result.error);
}
```

Common errors:

- **Authentication failed**: Check credentials in `.env.local`
- **Tweet too long**: Use `postThread()` instead of `post()`
- **Rate limit exceeded**: Wait and retry (API returns 429 status)
- **Content not found**: Check title spelling in `getContentByTitle()`

## Testing

Run the example file to test the agent:

```bash
# Using tsx (recommended)
npx tsx lib/examples/twitter-agent-example.ts

# Using ts-node
npx ts-node lib/examples/twitter-agent-example.ts
```

## Architecture

```
twitter-posting-agent.ts          # Main agent class
 TwitterPostingAgent            # Core agent
 TwitterCredentials             # Type definitions
 TwitterPost                    # Post type
 createTwitterAgent()           # Factory function

twitter-agent-example.ts           # Usage examples
 5 example functions

.env.twitter.example               # Environment template
TWITTER_AGENT_README.md            # This file
```

## Comparison with Bluesky Agent

Both agents share similar architecture for consistency:

| Feature         | Twitter Agent             | Bluesky Agent                 |
| --------------- | ------------------------- | ----------------------------- |
| Single post     | `post()`                  | `post()`                      |
| Thread support  | `postThread()`            | N/A (Bluesky uses long posts) |
| Content mapping | `getContentByTitle()`     | `getContentByTitle()`         |
| Scheduled posts | `processScheduledPosts()` | `processScheduledPosts()`     |
| Health check    | `healthCheck()`           | `healthCheck()`               |
| Rate limiting   | 1-2 second delays         | 1 second delays               |

## Production Deployment

### 1. Automated Posting (Cron Job)

Create a cron job or scheduled task:

```typescript
// schedule-twitter-posts.ts
import { createTwitterAgent } from './lib/twitter-posting-agent';
import contentCalendar from './social-content/CONTENT_CALENDAR.json';

async function runScheduledPosts() {
  try {
    const agent = createTwitterAgent();
    const results = await agent.processScheduledPosts(contentCalendar.schedule);

    console.log(`[${new Date().toISOString()}] Twitter posting complete`);
    console.log(
      `Posted: ${results.posted}, Skipped: ${results.skipped}, Failed: ${results.failed}`
    );

    // Log to monitoring service
    // await logToMonitoring(results);
  } catch (error) {
    console.error('Twitter posting failed:', error);
    // Alert monitoring service
    // await alertMonitoring(error);
  }
}

runScheduledPosts();
```

Run via cron (every hour):

```bash
0 * * * * cd /path/to/audio-intel && npx tsx schedule-twitter-posts.ts
```

### 2. Vercel Cron (Alternative)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/social/twitter/post-scheduled",
      "schedule": "0 * * * *"
    }
  ]
}
```

Create API route at `/app/api/social/twitter/post-scheduled/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createTwitterAgent } from '@/lib/twitter-posting-agent';
import contentCalendar from '@/social-content/CONTENT_CALENDAR.json';

export async function GET() {
  try {
    const agent = createTwitterAgent();
    const results = await agent.processScheduledPosts(contentCalendar.schedule);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

## Security Best Practices

1. **Never commit credentials** - Use `.env.local` (gitignored)
2. **Use environment variables** - Keep secrets out of code
3. **Rotate tokens regularly** - Regenerate API keys periodically
4. **Monitor API usage** - Watch for unusual activity
5. **Use read/write permissions only** - Don't grant unnecessary access
6. **Verify webhook signatures** - If using webhooks for automation

## Troubleshooting

### "Failed to authenticate with Twitter"

- Verify credentials in `.env.local`
- Check app has "Read and Write" permissions
- Regenerate access tokens if needed
- Ensure API keys are active (not regenerated)

### "Tweet exceeds 280 characters"

- Use `postThread()` instead of `post()`
- Content automatically splits into thread

### "Rate limit exceeded"

- Free tier: 50 tweets/day limit
- Implement exponential backoff
- Consider upgrading to elevated access

### "Content not found"

- Check exact title spelling in `getContentByTitle()`
- Review available content in `contentMap`

## Monitoring & Logging

Recommended monitoring:

```typescript
// Add to production deployment
import * as Sentry from '@sentry/node';

try {
  const results = await agent.processScheduledPosts(calendar);

  // Log success metrics
  Sentry.addBreadcrumb({
    message: 'Twitter posts completed',
    data: {
      posted: results.posted,
      skipped: results.skipped,
      failed: results.failed,
    },
  });
} catch (error) {
  // Capture errors
  Sentry.captureException(error);
}
```

## Future Enhancements

- [ ] Image/media attachment support
- [ ] Poll creation
- [ ] Quote tweet functionality
- [ ] Analytics integration (impressions, engagement)
- [ ] Retry logic for failed posts
- [ ] Queue system for bulk posting
- [ ] A/B testing for different content variations

## Support

For issues or questions:

- Review this README
- Check example file: `lib/examples/twitter-agent-example.ts`
- Verify credentials in `.env.local`
- Test with health check: `agent.healthCheck()`

## License

Part of Total Audio Platform - Audio Intel application.

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready
