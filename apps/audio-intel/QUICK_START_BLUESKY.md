# 🚀 Bluesky Autonomous Posting - Quick Start

**⏱️ Time to Deploy: 5 minutes**

---

## Step 1: Get Bluesky App Password (2 mins)

1. Go to https://bsky.app/settings/app-passwords
2. Click "Add App Password"
3. Name: `Audio Intel Posting Agent`
4. Click "Create App Password"
5. **Copy the password**

---

## Step 2: Add to Vercel (2 mins)

Go to: https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings/environment-variables

Add these 3 variables to **all environments** (Production, Preview, Development):

| Name | Value | Example |
|------|-------|---------|
| `BLUESKY_IDENTIFIER` | Your Bluesky handle | `yourname.bsky.social` |
| `BLUESKY_APP_PASSWORD` | App password from Step 1 | `xxxx-xxxx-xxxx-xxxx` |
| `CRON_SECRET` | Random secret | Run: `openssl rand -base64 32` |

---

## Step 3: Deploy (1 min)

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
git add .
git commit -m "feat: add Bluesky autonomous posting agent"
git push
```

Vercel automatically deploys.

---

## ✅ Done!

Your agent now posts **twice daily** at:
- **9am UK time** (morning commute)
- **5pm UK time** (end-of-work)

**Content:** 9 posts over 4 weeks from your pre-written content calendar

**Cost:** £0 (Vercel free tier)

---

## 🔍 Check It's Working

After next 9am or 5pm, check:

**Vercel Logs:**
https://vercel.com/chris-projects-6ffe0e29/audio-intel/logs

Look for:
```
[CRON] 🤖 Autonomous social posting triggered
[BLUESKY] ✅ Posted successfully
```

**Your Bluesky Profile:**
Check your posts appeared correctly

---

## 📖 Need More Info?

- **Full docs:** `BLUESKY_AUTONOMOUS_POSTING_SETUP.md`
- **Complete summary:** `BLUESKY_AUTONOMOUS_AGENT_COMPLETE.md`
- **Setup checker:** Run `bash scripts/setup-bluesky-posting.sh`

---

## 🎯 What You Get

✅ Fully autonomous posting (no manual work)
✅ Peak UK engagement times
✅ Pre-written authentic content
✅ Zero ongoing costs
✅ Easy monitoring via Vercel logs

**That's it - your Bluesky agent is live!** 🎉
