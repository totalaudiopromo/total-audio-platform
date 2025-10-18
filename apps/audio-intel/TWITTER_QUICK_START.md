# Twitter Agent Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Twitter API Credentials (5 minutes)

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new project and app (or use existing)
3. Click "Keys and tokens" tab
4. Click "Generate" for API Key & Secret
5. Click "Generate" for Access Token & Secret
6. **Important**: Set app permissions to "Read and Write"
7. Save all 4 values (you'll need them next)

### Step 2: Add Credentials to Environment (1 minute)

Copy the example file:
```bash
cd apps/audio-intel
cp .env.twitter.example .env.local
```

Edit `.env.local` and add your credentials:
```bash
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
```

### Step 3: Verify Setup (30 seconds)

```bash
npx tsx scripts/verify-twitter-setup.ts
```

You should see:
```
✅ Twitter API Package
✅ Agent File
✅ Content File
✅ Content Calendar
✅ Environment Variables
✅ Example File
✅ Documentation

🎉 All checks passed!
```

### Step 4: Test with Example (1 minute)

```bash
npx tsx lib/examples/twitter-agent-example.ts
```

This will list available content. To test posting, edit the example file and uncomment one of the test functions.

---

## 💡 Quick Usage Examples

### Post a Thread

```typescript
import { createTwitterAgent } from './lib/twitter-posting-agent';

const agent = createTwitterAgent();

// Get content
const content = agent.getContentByTitle('The Brighton Producer Story');

// Post thread
const result = await agent.postThread(content);

if (result.success) {
  console.log(`Posted ${result.count} tweets!`);
}
```

### Process Scheduled Posts

```typescript
import { createTwitterAgent } from './lib/twitter-posting-agent';
import contentCalendar from './social-content/CONTENT_CALENDAR.json';

const agent = createTwitterAgent();
const results = await agent.processScheduledPosts(contentCalendar.schedule);

console.log(`Posted: ${results.posted}, Skipped: ${results.skipped}`);
```

### Health Check

```typescript
const agent = createTwitterAgent();
const health = await agent.healthCheck();

console.log(health.healthy ? '✅ Ready' : '❌ Not ready');
```

---

## 📅 Scheduled Posts in Calendar

The agent will automatically post these threads when scheduled:

1. **Oct 1, 8am** - "The Brighton Producer Story"
2. **Oct 6, 8am** - "The BBC Radio 1 Test"
3. **Oct 10, 8am** - "The Brighton Producer Story" (repeat)
4. **Oct 15, 8am** - "The Submission Window Problem"
5. **Oct 21, 1pm** - "The Cost Reality"
6. **Oct 24, 8am** - "The Response Rate Breakthrough"

Run `processScheduledPosts()` hourly to catch posts within their scheduled time window.

---

## 🔧 Quick Deploy to Production

### Option A: Vercel Cron (Easiest)

1. Create `/app/api/social/twitter/post-scheduled/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createTwitterAgent } from '@/lib/twitter-posting-agent';
import contentCalendar from '@/social-content/CONTENT_CALENDAR.json';

export async function GET() {
  const agent = createTwitterAgent();
  const results = await agent.processScheduledPosts(contentCalendar.schedule);

  return NextResponse.json({ success: true, results });
}
```

2. Add to `vercel.json`:

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

3. Add environment variables to Vercel dashboard

4. Deploy!

### Option B: Server Cron

Add to crontab:
```bash
0 * * * * cd /path/to/audio-intel && npx tsx schedule-twitter-posts.ts
```

---

## 📊 Available Content

All content pre-configured and ready to post:

- **The 2AM Reality** - Origin story (7 tweets)
- **The Contact Intelligence Reality** - Features (7 tweets)
- **The Brighton Producer Story** - Founder story (8 tweets)
- **The Submission Window Problem** - Urgency (7 tweets)
- **The Cost Reality** - Pricing (7 tweets)
- **The Response Rate Breakthrough** - Results (7 tweets)

**Total**: 43 tweets across 6 threads

---

## ⚠️ Important Notes

1. **Free tier limit**: 50 tweets/day (1,500/month)
2. **Thread counts**: Each thread is 7-8 tweets
3. **Daily capacity**: ~6-7 threads per day max
4. **Rate limiting**: Built-in 1-2 second delays
5. **Permissions**: App must have "Read and Write" access

---

## 🐛 Troubleshooting

**"Authentication failed"**
- Check credentials in `.env.local` match Twitter portal exactly
- Ensure app has "Read and Write" permissions
- Regenerate tokens if needed

**"Tweet exceeds 280 characters"**
- Use `postThread()` not `post()` for long content
- Agent auto-splits long content into threads

**"Rate limit exceeded"**
- Free tier: 50 tweets/day
- Wait for reset or upgrade to elevated access

---

## 📚 Full Documentation

For complete details, see:
- **Main README**: `lib/TWITTER_AGENT_README.md`
- **Summary**: `TWITTER_AGENT_SUMMARY.md`
- **Examples**: `lib/examples/twitter-agent-example.ts`

---

## ✅ Checklist

- [ ] Twitter developer account created
- [ ] App created with "Read and Write" permissions
- [ ] API credentials generated
- [ ] Credentials added to `.env.local`
- [ ] Verification script passed
- [ ] Tested with example script
- [ ] Production deployment configured
- [ ] Monitoring set up

---

**Need Help?**

1. Run verification: `npx tsx scripts/verify-twitter-setup.ts`
2. Check README: `lib/TWITTER_AGENT_README.md`
3. Review examples: `lib/examples/twitter-agent-example.ts`
4. Test health check: `agent.healthCheck()`

**Ready to Go?**

```bash
# Test it now
npx tsx lib/examples/twitter-agent-example.ts
```

---

**Last Updated**: October 17, 2025
**Status**: Production Ready
