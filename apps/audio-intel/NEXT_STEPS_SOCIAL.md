# Next Steps for Social Media Posting Setup

## Current Status

✅ **Bluesky**: Fully configured and tested - working perfectly!
❌ **LinkedIn**: Needs OAuth authorization (ready to go)
❌ **Threads**: Needs Facebook/Instagram app setup
✅ **Twitter/X**: Check if already configured

---

## Immediate Action: LinkedIn Setup

### Step 1: Authorize LinkedIn App

**Authorization URL** (open this in your browser):

```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=781ioptlbwi0ok&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flinkedin%2Fcallback&state=bqzng8&scope=openid%20profile%20email%20w_member_social
```

### Step 2: What will happen

1. LinkedIn will ask you to authorize the app
2. You'll be redirected to: `http://localhost:3000/auth/linkedin/callback?code=XXX&state=XXX`
3. **Copy the entire `code` parameter value** (the XXX part after `code=`)
4. The terminal script is waiting for you to paste it

### Step 3: Get the access token

The script running in your terminal (`npx tsx scripts/get-linkedin-token.ts`) is waiting for the code.

Once you paste the code:

- It will exchange it for an access token
- You'll get a token to add to `.env.local` and Vercel

### Step 4: Add to Vercel

After getting the token:

```bash
# Add to local .env.local (script will show you the exact command)
# Then add to Vercel:
vercel env add LINKEDIN_ACCESS_TOKEN
# Paste the token when prompted
# Select: Production, Preview, Development (all three)
```

---

## Next: Threads Setup

After LinkedIn is done, you'll need to set up Threads:

### Requirements Check

- [ ] Do you have a **Business Instagram account**?
- [ ] Is it connected to a **Facebook Page**?
- [ ] Do you have access to **Facebook Developer** portal?

If yes to all three → Run: `npx tsx scripts/get-threads-token.ts`

If no:

1. Convert Instagram to business account (Settings → Account type)
2. Connect to a Facebook Page (Settings → Business)
3. Create Facebook App at https://developers.facebook.com/apps

---

## Testing After Setup

Once LinkedIn and Threads are configured:

```bash
# Test all platforms
curl -X POST http://localhost:3000/api/cron/social-posting

# Or test in production (after deploying)
curl -X POST https://intel.totalaudiopromo.com/api/cron/social-posting \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Timeline

**Now**: LinkedIn OAuth authorization (5 minutes)
**Next**: Threads Facebook app setup (15 minutes if accounts ready)
**Then**: Test full posting system (2 minutes)
**Finally**: Deploy to Vercel and verify cron works (5 minutes)

**Total**: ~30 minutes to get all platforms working

---

## What's Already Working

The autonomous posting system is **fully built** and **ready to go**:

- ✅ Bluesky agent working
- ✅ Content calendar created (CONTENT_CALENDAR.json)
- ✅ All content written (8 posts per platform)
- ✅ Cron job configured (twice daily: 9am & 5pm UK time)
- ✅ API route ready (/api/cron/social-posting)
- ✅ Error handling and logging
- ✅ Health checks for each platform

We just need to finish the OAuth setup for LinkedIn and Threads!

---

## Questions?

Check the full guide: [SOCIAL_POSTING_SETUP.md](./SOCIAL_POSTING_SETUP.md)
