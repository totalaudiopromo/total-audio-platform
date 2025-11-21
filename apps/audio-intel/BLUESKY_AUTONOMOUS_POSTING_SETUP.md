# Bluesky Autonomous Posting Setup

**Status**:  Code Complete - Ready for Credentials

Your autonomous Bluesky posting agent is built and configured. You just need to add your Bluesky credentials to make it live.

---

##  What This Does

- **Posts twice daily** at 9am and 5pm UK time (peak engagement)
- **Fully autonomous** - reads from your content calendar
- **Vercel cron** - completely free, no external services
- **35 posts scheduled** across 4 weeks

---

##  Setup Steps (5 minutes)

### Step 1: Create Bluesky App Password

1. Go to https://bsky.app/settings/app-passwords
2. Click **"Add App Password"**
3. Name it: `Audio Intel Posting Agent`
4. Click **"Create App Password"**
5. **Copy the password** (you'll need it in Step 2)

**IMPORTANT:** This is NOT your main Bluesky password. It's a special app-only password.

---

### Step 2: Add Environment Variables to Vercel

Go to your Audio Intel Vercel project:
https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings/environment-variables

Add these two variables:

**Variable 1:**

- **Name:** `BLUESKY_IDENTIFIER`
- **Value:** Your Bluesky handle (e.g., `yourname.bsky.social`)
- **Environment:** Production, Preview, Development (all three)

**Variable 2:**

- **Name:** `BLUESKY_APP_PASSWORD`
- **Value:** The app password from Step 1
- **Environment:** Production, Preview, Development (all three)

**Optional (Recommended):**

- **Name:** `CRON_SECRET`
- **Value:** Generate a random secret (e.g., `openssl rand -base64 32`)
- **Environment:** Production, Preview, Development (all three)
- **Purpose:** Prevents unauthorized cron triggers

---

### Step 3: Redeploy Audio Intel

After adding environment variables:

```bash
cd apps/audio-intel
git add .
git commit -m "feat: add Bluesky autonomous posting agent"
git push
```

Vercel will automatically redeploy with the new cron job.

---

##  Testing Your Agent

### Manual Test (Development)

```bash
cd apps/audio-intel
npm run dev

# In another terminal:
curl http://localhost:3000/api/cron/social-posting
```

This will:

1. Check your Bluesky credentials
2. Look for posts scheduled for "now" (within 1 hour)
3. Post to Bluesky if found
4. Log detailed results

### Production Test

After deployment, you can manually trigger the cron:

```bash
curl -X POST https://intel.totalaudiopromo.com/api/cron/social-posting \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace `YOUR_CRON_SECRET` with the secret you set in Step 2.

---

##  Posting Schedule

**Time:** 9am and 5pm UK time (every day)
**Platform:** Bluesky
**Content:** 35 posts across 4 weeks from your content calendar

**Cron Expression:** `0 9,17 * * *`

- `0` = At minute 0
- `9,17` = At 9am and 5pm
- `* * *` = Every day, every month, every day of week

**Why these times?**

- **9am** - Catch morning commute + coffee scroll
- **5pm** - Catch end-of-work scroll + evening engagement

These are **peak UK social media engagement times** for B2B audiences (radio promoters).

---

##  Monitoring

### Vercel Logs

Check logs in Vercel dashboard:
https://vercel.com/chris-projects-6ffe0e29/audio-intel/logs

Look for:

- `[CRON]  Autonomous social posting triggered`
- `[BLUESKY]  Posted successfully`

### Expected Output

```
[CRON]  Autonomous social posting triggered
[CRON] ⏰ Time: 2025-01-17T09:00:00.000Z
[CRON]  Bluesky health check passed
[BLUESKY] Found 1 Bluesky posts in calendar
[BLUESKY]  Posting: The Time Problem
[BLUESKY]  Posted successfully: at://did:plc:xxx/app.bsky.feed.post/xxx
[CRON]  Posting results:
       Posted: 1
       Skipped: 0
       Failed: 0
```

---

##  Content Calendar

Your posts are loaded from:
`apps/audio-intel/social-content/CONTENT_CALENDAR.json`

**Current schedule:**

- Week 1: Problem Awareness (8 posts)
- Week 2: Solution Education (7 posts)
- Week 3: Social Proof & Results (10 posts)
- Week 4: Call-to-Action Focus (10 posts)

**Bluesky posts:** 10 posts total across 4 weeks

The agent automatically:

1. Reads the calendar
2. Finds posts scheduled for "now" (within 1 hour)
3. Gets content from `BLUESKY_THREADS_CONTENT.md`
4. Posts to Bluesky
5. Logs results

---

##  Troubleshooting

### "Authentication failed"

- Check your `BLUESKY_IDENTIFIER` is correct (yourname.bsky.social)
- Check your `BLUESKY_APP_PASSWORD` is the app password, not main password
- Regenerate app password if needed

### "No content found for: [Title]"

- The agent couldn't find content for that post title
- Check `apps/audio-intel/lib/bluesky-posting-agent.ts` line 87
- Add the missing content to the `contentMap`

### "Skipping post - not scheduled for now"

- Post is scheduled for a different time
- Agent only posts within 1 hour of scheduled time
- Check `CONTENT_CALENDAR.json` for scheduled times

### Cron not triggering

- Check Vercel dashboard for cron job status
- Verify `vercel.json` has the cron configuration
- Check environment variables are set in Production

---

##  What's Next?

Once Bluesky is working, you can add:

- **X/Twitter** posting (need API credentials)
- **LinkedIn** posting (OAuth required)
- **Threads** posting (Instagram Graph API)

Same architecture, just add more agents to the cron endpoint.

---

##  Security Notes

- **Never commit** your app password to git
- **Use environment variables** for all credentials
- **Set CRON_SECRET** to prevent unauthorized triggers
- **App passwords** can be revoked anytime from Bluesky settings

---

##  Support

If something's not working:

1. Check Vercel logs first
2. Test manually in development
3. Verify environment variables are set
4. Check Bluesky API status: https://status.bsky.app

---

**Built:** January 2025
**Status:** Production Ready 
**Cost:** £0 (Vercel free tier)
