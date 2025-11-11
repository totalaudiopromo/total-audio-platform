# 🚀 Audio Intel - Vercel Deployment Guide

**Last Updated**: November 11, 2025
**Status**: Fixed and ready for deployment

## 📋 Quick Summary

Audio Intel is part of a **pnpm monorepo** at `total-audio-platform`. Vercel needs special configuration to handle monorepo deployments correctly.

## ✅ Configuration Applied (November 11, 2025)

### Files Updated

1. **`vercel.json`** - Simplified to use local build commands
2. **`.vercelignore`** - Added to exclude unnecessary files
3. **Configuration documented** - This guide created

## 🔧 Vercel Dashboard Setup (REQUIRED)

### Step 1: Access Project Settings

Go to: https://vercel.com/chris-projects-6ffe0e29/audio-intel/settings

### Step 2: Configure Build Settings

Navigate to **General** → **Build & Development Settings**

Set these values:

| Setting                        | Value                            | Why                                |
| ------------------------------ | -------------------------------- | ---------------------------------- |
| **Root Directory**             | `apps/audio-intel`               | Deploy only this app from monorepo |
| **Include files outside root** | ✅ **ENABLED**                   | Critical for pnpm workspace access |
| **Framework Preset**           | Next.js                          | Auto-detected                      |
| **Build Command**              | `pnpm build`                     | From vercel.json                   |
| **Install Command**            | `pnpm install --frozen-lockfile` | From vercel.json                   |
| **Output Directory**           | `.next`                          | Next.js default                    |
| **Node.js Version**            | 18.x                             | Default (18.x or 20.x work)        |

### Step 3: Verify Environment Variables

Ensure these are set in **Environment Variables** section:

#### Required for App Function

- `NEXT_PUBLIC_BASE_URL` = `https://intel.totalaudiopromo.com`
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key

#### Required for Features

- `PERPLEXITY_API_KEY` = For contact enrichment
- `STRIPE_SECRET_KEY` = For payment processing
- `STRIPE_WEBHOOK_SECRET` = For Stripe webhooks
- `ANTHROPIC_API_KEY` = For AI features
- `RESEND_API_KEY` = For transactional emails

#### Optional (Social Media Features)

- `TWITTER_API_KEY` = Twitter posting
- `TWITTER_API_SECRET` = Twitter posting
- `TWITTER_ACCESS_TOKEN` = Twitter posting
- `TWITTER_ACCESS_SECRET` = Twitter posting
- `BLUESKY_IDENTIFIER` = BlueSky posting
- `BLUESKY_PASSWORD` = BlueSky posting

### Step 4: Save and Deploy

1. Click **Save** at the bottom of settings
2. Go to **Deployments** tab
3. Click **"..." menu** on latest deployment
4. Click **Redeploy**
5. Monitor the build logs

## 🧪 Verification Checklist

After deployment completes:

### 1. Check Build Logs

```
✓ Installing dependencies
  Running "pnpm install --frozen-lockfile"
  Lockfile is up to date, resolution step is skipped
  Progress: resolved 1234, reused 1234, downloaded 0, added 0

✓ Building
  Running "pnpm build"
  Checking brand colours...
  Creating optimized production build
  Compiled successfully in X seconds

✓ Build completed
```

**Expected build time**: 55-90 seconds (NOT 13-14 minutes)

### 2. Test Site Access

```bash
# Homepage should load
curl -I https://intel.totalaudiopromo.com
# Expected: 200 OK

# Protected routes should redirect
curl -I https://intel.totalaudiopromo.com/demo
# Expected: 307 Temporary Redirect to /auth/login

# API routes should work
curl -I https://intel.totalaudiopromo.com/api/health
# Expected: 200 OK
```

### 3. Browser Testing

- Visit https://intel.totalaudiopromo.com
- Should see landing page
- Click "Try Demo" - should redirect to login
- Login should work
- Demo should load and function

## 🚨 Troubleshooting

### Build Fails with "Module not found: @total-audio/ui"

**Cause**: "Include files outside root" is not enabled
**Fix**: Enable it in Vercel Dashboard (Step 2 above)

### Build Takes 13-14 Minutes

**Cause**: Wrong build command or Root Directory misconfigured
**Fix**:

1. Ensure Root Directory = `apps/audio-intel`
2. Ensure Build Command = `pnpm build` (not `pnpm --filter audio-intel build`)

### "Root directory doesn't exist" Error

**Cause**: Root Directory is set incorrectly
**Fix**: Set to exactly `apps/audio-intel` (no leading/trailing slashes)

### Build Succeeds but Site Doesn't Work

**Cause**: Missing environment variables
**Fix**: Check all required env vars are set (see Step 3)

### pnpm: command not found

**Cause**: Vercel doesn't recognize pnpm
**Status**: Should be auto-detected from `pnpm-lock.yaml` at monorepo root
**Fix**: Verify "Include files outside root" is enabled

## 📊 Expected Build Output

```
Vercel Build Process:
1. Clone repository → 5s
2. Install dependencies (pnpm) → 30-45s
3. Run prebuild (colour check) → 2s
4. Build Next.js app → 15-30s
5. Optimize and generate static files → 5-10s
6. Upload to Vercel CDN → 5s

Total: ~55-90 seconds
```

## 🔄 Redeployment Process

For code changes:

```bash
# From monorepo root or apps/audio-intel directory
git add .
git commit -m "fix: description of changes"
git push origin main
```

Vercel will automatically:

1. Detect the push
2. Start a new build
3. Deploy if build succeeds
4. Make it live

For manual redeploy (no code changes):

1. Go to Vercel Dashboard → Deployments
2. Click "..." on any deployment
3. Click "Redeploy"

## 🎯 Success Indicators

✅ Build completes in 55-90 seconds
✅ No "Module not found" errors
✅ Site loads at https://intel.totalaudiopromo.com
✅ Authentication works
✅ Demo functionality works
✅ API routes respond
✅ Mobile experience is smooth

## 📝 Additional Notes

### Why These Settings?

1. **Root Directory = `apps/audio-intel`**: Tells Vercel which app to deploy from the monorepo
2. **Include files outside root**: Allows pnpm to access `../../pnpm-workspace.yaml` and `../../packages/*`
3. **Simple build commands**: Avoids pnpm filter issues when Vercel changes directories
4. **Output Directory = `.next`**: Standard Next.js output (relative to Root Directory)

### Monorepo Structure

```
total-audio-platform/          ← Repository root
├── pnpm-workspace.yaml        ← Defines monorepo packages
├── pnpm-lock.yaml             ← Lock file
├── packages/
│   ├── ui/                    ← Shared UI components
│   └── ...
└── apps/
    ├── audio-intel/           ← Root Directory in Vercel
    │   ├── vercel.json        ← Deployment config
    │   ├── .vercelignore      ← Files to exclude
    │   ├── package.json
    │   └── app/               ← Next.js app
    └── ...
```

### Alternative: CLI Deployment

If dashboard deployment fails, you can deploy via CLI:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
vercel --prod
```

This respects `vercel.json` settings automatically.

---

**Questions?** Check the Vercel build logs first - they show the exact commands being run and any errors.
