# Social Media Posting - Quick Start Guide

## TL;DR - What You Need to Do

**Right now**: Bluesky is working ✅
**Next 15 mins**: Set up LinkedIn
**Later (optional)**: Set up Threads (requires Facebook app approval)

---

## Current Status

| Platform      | Status            | Time to Setup | Complexity |
| ------------- | ----------------- | ------------- | ---------- |
| **Bluesky**   | ✅ Working        | Done          | Easy       |
| **LinkedIn**  | ⚠️ Needs token    | 10 minutes    | Medium     |
| **Threads**   | ❌ Not configured | 30+ minutes   | Hard       |
| **Twitter/X** | ❓ Unknown        | Need to check | Medium     |

---

## Recommended Approach

### Start with LinkedIn (10 minutes)

LinkedIn is the best platform for your audience (radio promoters, PR agencies). Get this working first.

**Follow this guide**: [LINKEDIN_SETUP.md](./LINKEDIN_SETUP.md)

**Quick steps**:

1. Go to https://www.linkedin.com/developers/apps
2. Find your app (Client ID: `781ioptlbwi0ok`)
3. Add redirect URI: `https://intel.totalaudiopromo.com/auth/linkedin/callback`
4. Visit this authorization URL (opens in browser):
   ```
   https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=781ioptlbwi0ok&redirect_uri=https%3A%2F%2Fintel.totalaudiopromo.com%2Fauth%2Flinkedin%2Fcallback&scope=openid%20profile%20email%20w_member_social&state=abc123
   ```
5. Authorize the app
6. Copy the `code` from the redirect URL
7. Run: `npx tsx scripts/get-linkedin-token.ts`
8. Add the token to `.env.local` and Vercel

### Skip Threads for Now (or do it later)

Threads requires:

- Business Instagram account
- Facebook Page connection
- Facebook Developer app approval (can take days)

**Recommendation**: Launch with Bluesky + LinkedIn first. Add Threads later when you have time.

**If you want to set it up anyway**: [THREADS_SETUP.md](./THREADS_SETUP.md)

---

## What Happens When Platforms Are Missing?

The autonomous posting system is smart - it will:

- ✅ Post to configured platforms (Bluesky, LinkedIn)
- ⏭️ Skip platforms without credentials (Threads, Twitter)
- 📊 Report which platforms succeeded/failed
- 🔄 Continue working even if one platform fails

**So you can launch with just Bluesky + LinkedIn and add others later!**

---

## Testing After LinkedIn Setup

Once LinkedIn is configured:

### 1. Test LinkedIn Agent

```bash
npx tsx scripts/verify-linkedin-agent.ts
```

### 2. Test Full Posting System

```bash
# Start dev server
PORT=3000 npm run dev

# In another terminal, trigger the cron
curl -X POST http://localhost:3000/api/cron/social-posting
```

### 3. Check What Posted

The response will show:

- Which platforms posted successfully
- How many posts went out
- Any errors or skipped platforms

---

## Production Deployment

After testing locally:

### 1. Add Environment Variables to Vercel

```bash
# LinkedIn
vercel env add LINKEDIN_CLIENT_ID
vercel env add LINKEDIN_CLIENT_SECRET
vercel env add LINKEDIN_ACCESS_TOKEN

# Select: Production, Preview, Development (all three)
```

### 2. Deploy

```bash
vercel --prod
```

### 3. Verify Cron is Working

Check Vercel dashboard:

- Go to your project
- Click "Deployments" → Latest deployment
- Click "Functions" tab
- Look for `/api/cron/social-posting` logs

Or manually trigger:

```bash
curl -X POST https://intel.totalaudiopromo.com/api/cron/social-posting \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Posting Schedule

The system posts **twice daily**:

- **9:00 AM UK time** - Morning post
- **5:00 PM UK time** - Afternoon post

Content comes from: `social-content/CONTENT_CALENDAR.json`

---

## Token Expiry & Maintenance

### LinkedIn

- **Expires**: 60 days
- **Refresh**: Run `npx tsx scripts/get-linkedin-token.ts`
- **Calendar reminder**: Set for 55 days from now

### Threads

- **Expires**: 60 days
- **Refresh**: Run `npx tsx scripts/get-threads-token.ts`
- **Calendar reminder**: Set for 55 days from now

### Bluesky

- **Expires**: Never (unless you revoke the app password)
- **Manage**: https://bsky.app/settings/app-passwords

---

## Files You Created

All documentation in one place:

1. **[SOCIAL_POSTING_QUICKSTART.md](./SOCIAL_POSTING_QUICKSTART.md)** (this file) - Start here
2. **[LINKEDIN_SETUP.md](./LINKEDIN_SETUP.md)** - Detailed LinkedIn OAuth guide
3. **[THREADS_SETUP.md](./THREADS_SETUP.md)** - Detailed Threads OAuth guide
4. **[SOCIAL_POSTING_SETUP.md](./SOCIAL_POSTING_SETUP.md)** - Complete technical reference

Scripts:

- `scripts/get-linkedin-token.ts` - LinkedIn OAuth helper
- `scripts/get-threads-token.ts` - Threads OAuth helper
- `scripts/test-bluesky.ts` - Test Bluesky agent
- `scripts/verify-linkedin-agent.ts` - Test LinkedIn agent
- `scripts/test-threads-agent.ts` - Test Threads agent

---

## Need Help?

**Common errors**: Check [SOCIAL_POSTING_SETUP.md](./SOCIAL_POSTING_SETUP.md) → Troubleshooting section

**Can't find LinkedIn app**: Go to https://www.linkedin.com/developers/apps

**Threads taking too long**: Skip it! Launch with Bluesky + LinkedIn

**Want to see the code**:

- API route: `app/api/cron/social-posting/route.ts`
- Bluesky agent: `lib/bluesky-posting-agent.ts`
- LinkedIn agent: `lib/linkedin-posting-agent.ts`
- Threads agent: `lib/threads-posting-agent.ts`

---

## Bottom Line

**Right now**:

1. Bluesky works ✅
2. LinkedIn needs 10 minutes of OAuth setup
3. Threads is optional (can add later)

**After LinkedIn setup**:

- You'll have autonomous posting to 2 platforms
- Twice daily (9am & 5pm UK time)
- Using the content you've already written
- Zero manual work required

**Get LinkedIn working first, then enjoy automated social posting! 🚀**
