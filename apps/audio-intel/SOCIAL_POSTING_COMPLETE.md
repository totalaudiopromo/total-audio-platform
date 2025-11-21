#  Autonomous Social Media Posting - COMPLETE

## What's Working

### Platforms Configured

-  **Bluesky**: Fully tested and operational
-  **LinkedIn**: Fixed API endpoint, tested and operational
-  **Threads**: Not configured (optional - can add later)
-  **Twitter/X**: Not checked (may already be configured)

### Posting Schedule

- **Frequency**: Once daily (Vercel Hobby plan limitation)
- **Time**: 9:00 AM UK time
- **Content**: 8 posts per platform in rotation
- **Automation**: Fully automatic via Vercel Cron

### Environment Variables (All Set in Vercel)

```
 BLUESKY_IDENTIFIER
 BLUESKY_APP_PASSWORD
 LINKEDIN_CLIENT_ID
 LINKEDIN_CLIENT_SECRET
 LINKEDIN_ACCESS_TOKEN
 CRON_SECRET
```

---

## What Changed

### LinkedIn API Fix

**Problem**: Original code used `/v2/me` endpoint which required extra LinkedIn products.

**Solution**: Changed to `/v2/userinfo` endpoint which works with basic OpenID permissions.

**File Changed**: `lib/linkedin-posting-agent.ts` line 52

### Cron Schedule Update

**Problem**: Vercel Hobby plan only allows daily cron jobs, not multiple times per day.

**Original**: `0 9,17 * * *` (9am and 5pm)
**Updated**: `0 9 * * *` (9am only)

**File Changed**: `vercel.json` line 15

**Upgrade Option**: Vercel Pro plan ($20/month) allows multiple daily cron jobs if you want 2x daily posting.

---

## Ready to Deploy

Everything is configured and tested locally. To deploy:

```bash
# From the audio-intel directory
vercel --prod
```

After deployment:

- Cron will run automatically at 9am UK time daily
- Posts will go to Bluesky and LinkedIn
- Check Vercel dashboard → Functions → Logs to verify

---

## Content Calendar

Content is stored in: `social-content/CONTENT_CALENDAR.json`

**Current content**:

- 8 posts for Bluesky
- 10 posts for LinkedIn
- 10 posts for Threads (ready when you set it up)

Posts rotate through different themes:

- Product value propositions
- Real customer results
- Founder story
- Industry insights

---

## Testing

### Test Locally (Before Deploying)

```bash
# Start dev server
PORT=3000 npm run dev

# In another terminal, trigger the cron
curl -X POST http://localhost:3000/api/cron/social-posting
```

### Test in Production (After Deploying)

```bash
# Manual trigger (requires CRON_SECRET)
curl -X POST https://intel.totalaudiopromo.com/api/cron/social-posting \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Check Logs

1. Go to Vercel dashboard
2. Select your project (audio-intel)
3. Go to Deployments → Latest deployment
4. Click "Functions" tab
5. Look for `/api/cron/social-posting` logs

---

## Token Expiry Reminders

### LinkedIn (59 days from now)

- **Expires**: ~17 December 2025
- **Refresh**: Run `npx tsx scripts/get-linkedin-token-simple.ts`
- **Update Vercel**: `./add-linkedin-to-vercel.sh`
- **Set calendar reminder**: 15 December 2025

### Bluesky

- **Expires**: Never (unless you revoke the app password)
- **Manage**: https://bsky.app/settings/app-passwords

---

## Troubleshooting

### Posts not going out

1. Check Vercel cron logs (see "Check Logs" above)
2. Verify environment variables: `vercel env ls`
3. Check cron is enabled in Vercel dashboard

### LinkedIn 403 errors

- Token expired → Get new token (see Token Expiry section)
- App permissions changed → Verify products in LinkedIn developer portal

### Bluesky authentication failed

- App password revoked → Generate new one at https://bsky.app/settings/app-passwords
- Update BLUESKY_APP_PASSWORD in Vercel

---

## Upgrade to 2x Daily Posting

If you want to post twice daily (9am and 5pm):

1. **Upgrade to Vercel Pro** ($20/month)
2. **Update vercel.json**:
   ```json
   "schedule": "0 9,17 * * *"
   ```
3. **Redeploy**

---

## Adding Threads (Optional)

If you want to add Instagram Threads posting:

1. Follow guide: [THREADS_SETUP.md](./THREADS_SETUP.md)
2. Get Threads credentials (requires Facebook Developer app)
3. Add to Vercel:
   ```bash
   vercel env add THREADS_USER_ID
   vercel env add THREADS_ACCESS_TOKEN
   ```
4. Content is already written and ready!

---

## File Reference

### Core Files

- `app/api/cron/social-posting/route.ts` - Main cron endpoint
- `lib/bluesky-posting-agent.ts` - Bluesky integration
- `lib/linkedin-posting-agent.ts` - LinkedIn integration
- `lib/threads-posting-agent.ts` - Threads integration (ready to use)
- `social-content/CONTENT_CALENDAR.json` - Post schedule and content
- `vercel.json` - Cron configuration

### Setup Scripts

- `scripts/get-linkedin-token-simple.ts` - LinkedIn OAuth helper
- `scripts/test-bluesky.ts` - Bluesky testing
- `scripts/test-linkedin-simple.ts` - LinkedIn testing
- `add-linkedin-to-vercel.sh` - Bulk add LinkedIn env vars

### Documentation

- `SOCIAL_POSTING_QUICKSTART.md` - Quick overview
- `LINKEDIN_SETUP.md` - LinkedIn OAuth guide
- `THREADS_SETUP.md` - Threads OAuth guide
- `SOCIAL_POSTING_SETUP.md` - Technical reference
- `SOCIAL_POSTING_COMPLETE.md` - This file

---

## Success Metrics to Track

After deploying, monitor:

1. **Post Success Rate**: Check Vercel logs for successful posts
2. **Engagement**: Track LinkedIn and Bluesky engagement
3. **Follower Growth**: Monitor both platforms
4. **Link Clicks**: UTM parameters track traffic to intel.totalaudiopromo.com

---

## Summary

 **You're all set!**

-  2 platforms ready (Bluesky + LinkedIn)
-  Daily automated posting at 9am UK time
-  8-10 posts per platform ready to go
-  All credentials configured in Vercel
-  Testing completed successfully

**Next step**: Deploy with `vercel --prod` and your autonomous social posting begins!

---

**Last Updated**: 18 October 2025
**Status**: Ready for production deployment
**Posting Frequency**: Daily at 9am UK time (Vercel Hobby plan)
