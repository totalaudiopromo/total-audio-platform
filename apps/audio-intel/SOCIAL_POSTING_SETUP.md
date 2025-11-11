# Autonomous Social Media Posting Setup

## Overview

This system autonomously posts to Bluesky, Twitter/X, LinkedIn, and Threads twice daily (9am and 5pm UK time) using content from the CONTENT_CALENDAR.json.

## Current Status

- ✅ **Bluesky**: Configured and working
- ❌ **LinkedIn**: Needs OAuth setup
- ❌ **Threads**: Needs OAuth setup
- ✅ **Twitter/X**: Previously configured (check if tokens still valid)

## Setup Instructions

### 1. Bluesky ✅ (DONE)

**Status**: Already configured and tested successfully

Environment variables set:

- `BLUESKY_IDENTIFIER=chrisschouk.bsky.social`
- `BLUESKY_APP_PASSWORD=7vdl-l7hi-ckwj-ma3h` (app password, not main password)

**Test command**:

```bash
npx tsx scripts/test-bluesky.ts
```

---

### 2. LinkedIn ❌ (NEEDS SETUP)

**Requirements**:

- LinkedIn Developer App with posting permissions
- OAuth 2.0 authentication

**Current credentials** (from your previous setup):

- `LINKEDIN_CLIENT_ID=781ioptlbwi0ok`
- `LINKEDIN_CLIENT_SECRET=WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==`

**Setup steps**:

1. **Get Access Token** (run this script):

   ```bash
   npx tsx scripts/get-linkedin-token.ts
   ```

2. **Follow the OAuth flow**:
   - Script will give you an authorization URL
   - Visit the URL in your browser
   - Authorize the app
   - Copy the `code` parameter from the redirect URL
   - Paste it back into the script
   - Script will exchange it for an access token

3. **Add to environment variables**:

   ```bash
   # Local (.env.local)
   LINKEDIN_ACCESS_TOKEN=<token from script>

   # Vercel (production)
   vercel env add LINKEDIN_ACCESS_TOKEN
   vercel env add LINKEDIN_REFRESH_TOKEN  # if provided
   ```

4. **Update LinkedIn App Settings**:
   - Go to https://www.linkedin.com/developers/apps
   - Make sure these are configured:
     - Redirect URLs: `http://localhost:3000/auth/linkedin/callback`
     - Products: Share on LinkedIn
     - Permissions: `openid`, `profile`, `email`, `w_member_social`

**Token Expiry**: LinkedIn access tokens typically expire after 60 days. Set a calendar reminder to refresh.

---

### 3. Threads (Instagram) ❌ (NEEDS SETUP)

**Requirements**:

- Business Instagram account
- Instagram account connected to a Facebook Page
- Facebook Developer App with Threads API

**Setup steps**:

1. **Create Facebook App**:
   - Go to https://developers.facebook.com/apps
   - Create new app (type: Business)
   - Add "Threads API" product
   - Request permissions: `threads_basic`, `threads_content_publish`

2. **Get App Credentials**:
   - Note your App ID and App Secret
   - Add to .env.local:
     ```bash
     THREADS_APP_ID=<your app id>
     THREADS_APP_SECRET=<your app secret>
     ```

3. **Get Access Token** (run this script):

   ```bash
   npx tsx scripts/get-threads-token.ts
   ```

4. **Follow the OAuth flow**:
   - Script will give you an authorization URL
   - Visit the URL in your browser
   - Authorize with your Instagram business account
   - Copy the `code` parameter from the redirect URL
   - Paste it back into the script
   - Script will exchange for a long-lived access token (60 days)

5. **Add to environment variables**:

   ```bash
   # Local (.env.local)
   THREADS_USER_ID=<user id from script>
   THREADS_ACCESS_TOKEN=<token from script>

   # Vercel (production)
   vercel env add THREADS_USER_ID
   vercel env add THREADS_ACCESS_TOKEN
   ```

**Token Expiry**: Threads long-lived tokens expire after 60 days. Set a calendar reminder to refresh.

---

### 4. Twitter/X ✅ (CHECK STATUS)

**Environment variables to check**:

- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

**Test if configured**:

```bash
vercel env ls | grep TWITTER
```

If not configured, you'll need to:

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create or use existing app
3. Generate access tokens with "Read and Write" permissions

---

## Testing

### Test Individual Platforms

```bash
# Test Bluesky
npx tsx scripts/test-bluesky.ts

# Test LinkedIn (after setup)
npx tsx scripts/verify-linkedin-agent.ts

# Test Threads (after setup)
npx tsx scripts/test-threads-agent.ts
```

### Test Full Cron Job Locally

```bash
# Start the dev server
PORT=3000 npm run dev

# In another terminal, trigger the cron job
curl -X POST http://localhost:3000/api/cron/social-posting
```

### Test in Production

```bash
# Trigger via Vercel cron (with proper authorization)
curl -X POST https://intel.totalaudiopromo.com/api/cron/social-posting \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Vercel Cron Configuration

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/social-posting",
      "schedule": "0 9,17 * * *"
    }
  ]
}
```

This runs at:

- 9:00 AM UK time (morning post)
- 5:00 PM UK time (afternoon post)

---

## Troubleshooting

### "Credentials not configured" error

Check that environment variables are set:

```bash
# Local
cat .env.local | grep -E "BLUESKY|LINKEDIN|THREADS|TWITTER"

# Vercel
vercel env ls
```

### "Health check failed" error

Platform-specific issues:

**Bluesky**:

- Check app password is correct (not main password)
- Regenerate app password if needed: https://bsky.app/settings/app-passwords

**LinkedIn**:

- Check access token hasn't expired (60 days)
- Verify app has `w_member_social` permission
- Check redirect URI matches exactly

**Threads**:

- Check Instagram account is business account
- Verify account is connected to Facebook Page
- Check access token hasn't expired (60 days)
- Verify app has `threads_content_publish` permission

### Posts not going out at scheduled times

1. Check Vercel cron is configured:

   ```bash
   vercel inspect <deployment-url>
   ```

2. Check cron logs in Vercel dashboard:
   - Go to project > Deployments > Latest deployment
   - Check "Functions" tab for cron execution logs

3. Verify timezone in cron schedule (should be UTC for Vercel):
   - 9am UK = 8am UTC (winter) or 7am UTC (summer)
   - 5pm UK = 4pm UTC (winter) or 3pm UTC (summer)

---

## Token Refresh Reminder

Set calendar reminders to refresh OAuth tokens:

- **LinkedIn**: Every 55 days (tokens expire after 60 days)
- **Threads**: Every 55 days (tokens expire after 60 days)
- **Twitter/X**: Check expiry in developer portal
- **Bluesky**: App passwords don't expire (unless revoked)

To refresh:

```bash
# LinkedIn
npx tsx scripts/get-linkedin-token.ts
vercel env add LINKEDIN_ACCESS_TOKEN

# Threads
npx tsx scripts/get-threads-token.ts
vercel env add THREADS_ACCESS_TOKEN
```

---

## Content Calendar

Content is managed in `/apps/audio-intel/social-content/CONTENT_CALENDAR.json`

Each post includes:

- `platform`: Which platform to post to
- `title`: Post title (maps to content in agent files)
- `scheduledTime`: When to post (ISO 8601 format)
- `status`: "scheduled", "posted", or "failed"

The cron job reads this calendar and posts content within a 1-hour window of the scheduled time.
