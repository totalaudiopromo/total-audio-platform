# Vercel Environment Variables - Social Posting Setup

**Quick reference for adding credentials to Vercel**

Go to: https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings/environment-variables

---

## ✅ Bluesky (ALREADY CONFIGURED)

```
BLUESKY_IDENTIFIER=chrisschouk.bsky.social
BLUESKY_APP_PASSWORD=your-app-password-here
```

**Status**: ✅ Already added - Bluesky will post at 9am/5pm

---

## 🐦 Twitter/X (PENDING)

```
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
```

**How to get:**
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create app or use existing
3. Generate keys under "Keys and tokens"
4. Set permissions to "Read and Write"

**Documentation:** `TWITTER_AGENT_README.md`

---

## 💼 LinkedIn (PENDING)

```
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_ACCESS_TOKEN=your_access_token_here
```

**How to get:**
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Request "Share on LinkedIn" product access
4. Complete OAuth2 flow for access token

**Documentation:** `LINKEDIN_OAUTH_SETUP.md`

---

## 🧵 Threads (PENDING)

```
THREADS_USER_ID=your_instagram_user_id_here
THREADS_ACCESS_TOKEN=your_long_lived_access_token_here
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

**How to get:**
1. Go to https://developers.facebook.com/apps
2. Create new app
3. Add "Threads API" product
4. Get Instagram Business Account ID
5. Generate long-lived access token (60 days)

**Documentation:** `THREADS_QUICK_START.md`

---

## 🔐 Security (RECOMMENDED)

```
CRON_SECRET=generate-with-openssl-rand-base64-32
```

**How to generate:**
```bash
openssl rand -base64 32
```

This prevents unauthorized cron triggers.

---

## 📋 Environment Settings

**For each variable:**
- ✅ Production
- ✅ Preview
- ✅ Development

(Check all three boxes)

---

## 🚀 After Adding Variables

1. Wait for Vercel to redeploy (automatic)
2. Check Vercel logs at next scheduled time (9am or 5pm)
3. Look for: `[CRON] ✅ [Platform]: X posted, 0 failed`

---

## 🧪 Manual Test Command

After adding variables, test with:

```bash
curl -X POST https://intel.totalaudiopromo.com/api/cron/social-posting \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace `YOUR_CRON_SECRET` with your generated secret.

---

## ✅ Checklist

- [x] **Bluesky** credentials added
- [ ] **Twitter/X** credentials added
- [ ] **LinkedIn** credentials added
- [ ] **Threads** credentials added
- [ ] **CRON_SECRET** generated and added
- [ ] Code deployed to Vercel
- [ ] Manual test successful
- [ ] Monitoring first automated post

---

**Current Status:** Bluesky ready, awaiting other platform credentials
**Next Cron Run:** Check Vercel dashboard for next scheduled time (9am or 5pm UK)
