# Threads Agent Quick Start

Fast-track guide to get Threads autonomous posting running in under 30 minutes.

## Prerequisites

- Instagram Professional account (Creator or Business)
- Facebook Page linked to Instagram
- Meta Developer account
- 30 minutes of time

## 5-Step Setup

### Step 1: Meta Developer App (10 min)

```bash
# 1. Visit: https://developers.facebook.com/
# 2. Create new app (Business type)
# 3. Add "Threads API" product
# 4. Note App ID and App Secret
```

**Configure OAuth**:

- Add domain: `totalaudiopromo.com`
- Add redirect: `https://intel.totalaudiopromo.com/api/auth/threads/callback`
- Enable: `threads_basic`, `threads_content_publish`

### Step 2: Generate Access Token (5 min)

```bash
# Short-lived token (Graph API Explorer)
# Visit: https://developers.facebook.com/tools/explorer/
# Select app → Generate Access Token → Copy

# Convert to long-lived (60 days)
curl -X GET "https://graph.threads.net/access_token" \
  -d "grant_type=th_exchange_token" \
  -d "client_secret={FACEBOOK_APP_SECRET}" \
  -d "access_token={SHORT_LIVED_TOKEN}"
```

Save the long-lived token!

### Step 3: Get User ID (2 min)

```bash
curl -X GET "https://graph.threads.net/v1.0/me" \
  -d "fields=id,username" \
  -d "access_token={LONG_LIVED_TOKEN}"
```

Save the numeric `id` value!

### Step 4: Configure Environment (3 min)

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel

# Copy template
cp .env.threads.example .env.local

# Edit with your credentials
nano .env.local
```

Add your values:

```bash
THREADS_USER_ID=123456789
THREADS_ACCESS_TOKEN=IGQ...
FACEBOOK_APP_ID=987654321
FACEBOOK_APP_SECRET=abc123xyz
```

### Step 5: Test Integration (5 min)

```bash
# Run test script
npx tsx scripts/test-threads-agent.ts
```

Expected output:

```
 Environment variables configured
 Agent created successfully
 Health check passed - API is accessible
 All tests completed successfully!
```

## Production Deployment (10 min)

### Add to Vercel

```bash
# Vercel Dashboard → Audio Intel → Settings → Environment Variables
# Add all credentials from .env.local
# Scope: Production
```

### Configure Cron

Create `app/api/cron/threads-posting/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createThreadsAgent } from '@/lib/threads-posting-agent';
import calendar from '@/social-content/CONTENT_CALENDAR.json';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const agent = createThreadsAgent();
  const results = await agent.processScheduledPosts(calendar.schedule);

  return NextResponse.json({ success: true, results });
}
```

Update `vercel.json`:

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

Generate cron secret:

```bash
openssl rand -base64 32
# Add to Vercel as CRON_SECRET
```

Commit and deploy:

```bash
git add .
git commit -m "feat: add Threads autonomous posting agent"
git push
```

## Verify Deployment

1. Check Vercel deployment logs (no errors)
2. Wait for next hour
3. Check Vercel cron logs
4. Verify posts on Threads

## Usage Examples

### Manual Posting

```typescript
import { createThreadsAgent } from '@/lib/threads-posting-agent';

const agent = createThreadsAgent();
const result = await agent.post('Your content here (max 500 chars)');

if (result.success) {
  console.log('Posted:', result.postId);
}
```

### Scheduled Processing

```typescript
import { createThreadsAgent } from '@/lib/threads-posting-agent';
import calendar from '@/social-content/CONTENT_CALENDAR.json';

const agent = createThreadsAgent();
const results = await agent.processScheduledPosts(calendar.schedule);

console.log(`Posted: ${results.posted}, Failed: ${results.failed}`);
```

### Health Check

```typescript
const agent = createThreadsAgent();
const health = await agent.healthCheck();

console.log(health.healthy ? 'API OK' : `Error: ${health.error}`);
```

### Account Insights

```typescript
const agent = createThreadsAgent();
const insights = await agent.getAccountInsights();

if (insights.success) {
  console.log('Views:', insights.insights?.views);
  console.log('Likes:', insights.insights?.likes);
  console.log('Replies:', insights.insights?.replies);
}
```

## Content Mapped (10 Posts)

All content pre-mapped from `BLUESKY_THREADS_CONTENT.md`:

1.  The Real Problem
2.  BBC Radio 1 Success
3.  Regional Radio Strategy
4.  The Pricing Problem
5.  Response Rate Data
6.  The Brighton Producer Story
7.  Submission Window Problem
8.  The Spreadsheet Chaos
9.  Real ROI Calculation
10.  Industry Truth

Each post includes:

- 500 character compliance
- UTM tracking
- Call-to-action
- Link to intel.totalaudiopromo.com

## Scheduled Posts (Calendar)

From `CONTENT_CALENDAR.json`:

**Week 1**: 1 post (Spreadsheet Chaos)
**Week 2**: 3 posts (Regional Strategy, Pricing, ROI)
**Week 3**: 2 posts (Response Data, Brighton Story)
**Week 4**: 4 posts (Submission Windows, Spreadsheet, ROI, Real Problem)

**Total**: 10 posts across 4-week campaign

## Troubleshooting

**Health check fails**:

- Verify access token not expired
- Check Instagram is Professional account
- Confirm app permissions enabled

**Posts not publishing**:

- Check Vercel cron logs
- Verify scheduling window (±1 hour)
- Review content mapping

**Rate limit errors**:

- Check Meta dashboard usage
- Reduce posting frequency
- Increase delays

## Token Maintenance

**Access token expires in 60 days**

Set reminder for day 55:

```bash
curl -X GET "https://graph.threads.net/refresh_access_token" \
  -d "grant_type=th_refresh_token" \
  -d "access_token={CURRENT_TOKEN}"
```

Update Vercel environment variables with new token.

## Key Files

- `lib/threads-posting-agent.ts` - Main agent (571 lines)
- `lib/THREADS_API_SETUP.md` - Complete setup guide
- `scripts/test-threads-agent.ts` - Testing script
- `.env.threads.example` - Environment template
- `THREADS_AGENT_SUMMARY.md` - Full documentation
- `AGENT_COMPARISON.md` - BlueSky vs Threads
- `THREADS_DEPLOYMENT_CHECKLIST.md` - Production deployment

## API Limits

- **Rate**: 1,000 calls/hour
- **Publishing**: 250 posts/day
- **Character**: 500 max
- **Delay**: 2s between posts

## Monitoring

**Daily**: Check cron logs, posting success rate
**Weekly**: Review engagement metrics, API usage
**Monthly**: Optimise content, analyse performance
**55 Days**: Refresh access token

## Support

**Documentation**: All files in `/apps/audio-intel/`
**Test Issues**: Run `npx tsx scripts/test-threads-agent.ts`
**API Errors**: Check Meta Developer dashboard
**Contact**: chris@totalaudiopromo.com

## Success Checklist

- [x] Agent file created (571 lines)
- [x] Test script created
- [x] Environment template ready
- [x] 10 posts mapped
- [x] Calendar integration ready
- [x] Documentation complete
- [ ] API credentials obtained
- [ ] Local testing passed
- [ ] Production deployed
- [ ] First posts verified

---

**Ready to Deploy**: Yes 
**Time to Production**: 30 minutes
**Maintainer**: Chris Schofield / Total Audio
**Last Updated**: October 2025
