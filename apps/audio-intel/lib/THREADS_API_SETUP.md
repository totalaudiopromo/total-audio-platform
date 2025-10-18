# Threads API Setup Guide

Complete guide for setting up Instagram Threads API integration for Audio Intel autonomous posting.

## Overview

The Threads API uses Instagram's Graph API infrastructure. You'll need:
- Meta Developer Account
- Instagram Professional Account (Creator or Business)
- Facebook Page connected to Instagram account
- App registered with Meta

## Prerequisites

1. **Instagram Professional Account**
   - Convert your personal Instagram to a Professional account (Creator or Business)
   - Settings → Account → Switch to Professional Account

2. **Facebook Page**
   - Create or use existing Facebook Page
   - Link Facebook Page to Instagram Professional account
   - Instagram Settings → Account → Linked Accounts → Facebook

## Step-by-Step Setup

### 1. Create Meta Developer App

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" as app type
4. Enter app details:
   - **App Name**: Audio Intel Social Automation
   - **App Contact Email**: chris@totalaudiopromo.com
   - **Business Account**: Select or create business account
5. Click "Create App"

### 2. Add Threads API Product

1. In your app dashboard, find "Add Products"
2. Search for "Threads API"
3. Click "Set Up"
4. Configure basic settings

### 3. Configure OAuth Settings

1. Navigate to **App Settings → Basic**
2. Add your domain:
   - **App Domains**: `totalaudiopromo.com`
   - **Privacy Policy URL**: `https://intel.totalaudiopromo.com/privacy`
   - **Terms of Service URL**: `https://intel.totalaudiopromo.com/terms`

3. Navigate to **Threads API → Settings**
4. Add OAuth Redirect URIs:
   ```
   https://intel.totalaudiopromo.com/api/auth/threads/callback
   http://localhost:3000/api/auth/threads/callback
   ```

5. Enable required permissions:
   - `threads_basic` - Basic access to Threads
   - `threads_content_publish` - Publish content to Threads

### 4. Get Your Credentials

From **App Settings → Basic**:
- **App ID**: Save this as `FACEBOOK_APP_ID`
- **App Secret**: Save this as `FACEBOOK_APP_SECRET`

### 5. Generate Access Token

#### Method 1: Using Graph API Explorer (Recommended for Testing)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from dropdown
3. Click "Generate Access Token"
4. Select permissions:
   - `threads_basic`
   - `threads_content_publish`
5. Authorize the app
6. Copy the **Short-Lived Token**

#### Method 2: OAuth Flow (Production)

Create authorization URL:
```
https://threads.net/oauth/authorize?
  client_id={FACEBOOK_APP_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=threads_basic,threads_content_publish&
  response_type=code
```

Exchange code for token:
```bash
curl -X POST "https://graph.threads.net/oauth/access_token" \
  -d "client_id={FACEBOOK_APP_ID}" \
  -d "client_secret={FACEBOOK_APP_SECRET}" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri={REDIRECT_URI}" \
  -d "code={AUTHORIZATION_CODE}"
```

Response:
```json
{
  "access_token": "short_lived_token_here",
  "token_type": "bearer"
}
```

### 6. Convert to Long-Lived Token

Short-lived tokens expire in 1 hour. Convert to long-lived token (60 days):

```bash
curl -X GET "https://graph.threads.net/access_token" \
  -d "grant_type=th_exchange_token" \
  -d "client_secret={FACEBOOK_APP_SECRET}" \
  -d "access_token={SHORT_LIVED_TOKEN}"
```

Response:
```json
{
  "access_token": "long_lived_token_here",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

### 7. Get Instagram User ID

Once you have an access token, get your Instagram User ID:

```bash
curl -X GET "https://graph.threads.net/v1.0/me" \
  -d "fields=id,username" \
  -d "access_token={ACCESS_TOKEN}"
```

Response:
```json
{
  "id": "123456789",
  "username": "your_username"
}
```

Save the `id` value as `THREADS_USER_ID`.

### 8. Refresh Long-Lived Token

Long-lived tokens expire after 60 days. Refresh before expiration:

```bash
curl -X GET "https://graph.threads.net/refresh_access_token" \
  -d "grant_type=th_refresh_token" \
  -d "access_token={LONG_LIVED_TOKEN}"
```

Response:
```json
{
  "access_token": "refreshed_long_lived_token",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# Threads API Configuration
THREADS_USER_ID=123456789
THREADS_ACCESS_TOKEN=your_long_lived_access_token_here
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

## Testing the Integration

### Test Script

Create `apps/audio-intel/scripts/test-threads-agent.ts`:

```typescript
import { createThreadsAgent } from '../lib/threads-posting-agent';

async function testThreadsAgent() {
  try {
    console.log('Creating Threads agent...');
    const agent = createThreadsAgent();

    console.log('Running health check...');
    const health = await agent.healthCheck();
    console.log('Health check result:', health);

    if (!health.healthy) {
      console.error('Health check failed');
      return;
    }

    console.log('Testing post...');
    const testPost = `Test post from Audio Intel automation system.

This is a test of the Threads API integration.

#AudioIntel #TestPost`;

    const result = await agent.post(testPost);
    console.log('Post result:', result);

    if (result.success) {
      console.log('✅ Threads integration working!');
      console.log('Post ID:', result.postId);
    } else {
      console.error('❌ Post failed:', result.error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testThreadsAgent();
```

Run test:
```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
npx tsx scripts/test-threads-agent.ts
```

## Usage Examples

### Basic Posting

```typescript
import { createThreadsAgent } from './lib/threads-posting-agent';

const agent = createThreadsAgent();

// Post to Threads
const result = await agent.post('Your thread content here (max 500 chars)');

if (result.success) {
  console.log('Posted successfully:', result.postId);
}
```

### Scheduled Content

```typescript
import { createThreadsAgent } from './lib/threads-posting-agent';
import calendar from './social-content/CONTENT_CALENDAR.json';

const agent = createThreadsAgent();

// Process scheduled posts
const results = await agent.processScheduledPosts(calendar.schedule);

console.log(`Posted: ${results.posted}`);
console.log(`Skipped: ${results.skipped}`);
console.log(`Failed: ${results.failed}`);
```

### Health Check

```typescript
const agent = createThreadsAgent();
const health = await agent.healthCheck();

if (health.healthy) {
  console.log('Threads API is accessible');
} else {
  console.error('Threads API error:', health.error);
}
```

### Get Account Insights

```typescript
const agent = createThreadsAgent();
const insights = await agent.getAccountInsights();

if (insights.success) {
  console.log('Account insights:', insights.insights);
}
```

## API Rate Limits

**Threads API Rate Limits:**
- **Rate Limit**: 1,000 API calls per hour per user
- **Publishing**: 250 posts per day per user
- **Recommended**: 2-3 second delay between posts

The agent includes built-in rate limiting (2 seconds between posts).

## Character Limits

- **Text Posts**: 500 characters maximum
- **URLs**: Automatically shortened by Threads
- **Hashtags**: No limit, but recommended 2-3 per post

## Troubleshooting

### Common Issues

**"Invalid OAuth access token"**
- Token expired (refresh required)
- Wrong token format
- Missing permissions

**"User not authorized"**
- Instagram account not Professional
- Missing Facebook Page connection
- App not approved for Threads API

**"Rate limit exceeded"**
- Too many API calls
- Wait and retry
- Implement exponential backoff

**"Media container creation failed"**
- Text exceeds 500 characters
- Invalid characters in content
- Network timeout

### Debug Mode

Enable debug logging:
```typescript
// Add to agent initialization
console.log('[THREADS] Debug mode enabled');
```

Check API responses:
```bash
curl -X GET "https://graph.threads.net/v1.0/{USER_ID}/threads" \
  -d "fields=id,text,timestamp" \
  -d "access_token={ACCESS_TOKEN}"
```

## Security Best Practices

1. **Never commit tokens**
   - Add `.env.local` to `.gitignore`
   - Use environment variables only

2. **Rotate tokens regularly**
   - Refresh long-lived tokens before expiration
   - Revoke old tokens

3. **Limit token scope**
   - Only request needed permissions
   - Use separate tokens for different environments

4. **Monitor usage**
   - Track API calls
   - Set up alerts for rate limits
   - Log all posting activity

## Automation Setup

### Cron Job (Production)

Run posting agent every hour:
```bash
# crontab -e
0 * * * * cd /path/to/audio-intel && npx tsx scripts/threads-posting-cron.ts
```

### Vercel Cron (Recommended)

Create API route: `app/api/cron/threads-posting/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createThreadsAgent } from '@/lib/threads-posting-agent';
import calendar from '@/social-content/CONTENT_CALENDAR.json';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const agent = createThreadsAgent();
    const results = await agent.processScheduledPosts(calendar.schedule);

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Threads posting cron failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

Configure `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/threads-posting",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Resources

- [Threads API Documentation](https://developers.facebook.com/docs/threads)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Meta Developer Portal](https://developers.facebook.com/)
- [Threads Best Practices](https://developers.facebook.com/docs/threads/best-practices)

## Support

For issues with this integration:
- Check Vercel logs: `vercel logs`
- Review Meta Developer dashboard for API errors
- Test with Graph API Explorer
- Contact chris@totalaudiopromo.com

---

**Last Updated**: October 2025
**Status**: Production Ready
**Maintainer**: Chris Schofield / Total Audio
