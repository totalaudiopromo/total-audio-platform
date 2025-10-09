# Deployment Automation Guide

## The Problem You're Experiencing

**Issue**: Vercel doesn't auto-deploy when you push to `main` branch
**Why**: The monorepo structure requires specific configuration for each app

## Current Setup

Your repository has multiple apps:
- `apps/audio-intel` → intel.totalaudiopromo.com
- `apps/pitch-generator` → pitch.totalaudiopromo.com
- `apps/web` → totalaudiopromo.com
- `apps/tracker` → tracker.totalaudiopromo.com
- etc.

**What's happening**: When you push changes to any app, Vercel doesn't know which project to redeploy.

## Quick Fix: Auto-Deploy Scripts

Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "deploy:web": "cd apps/web && vercel --prod",
    "deploy:audio-intel": "cd apps/audio-intel && vercel --prod",
    "deploy:pitch": "cd apps/pitch-generator && vercel --prod",
    "deploy:tracker": "cd apps/tracker && vercel --prod",
    "deploy:all": "npm run deploy:web && npm run deploy:audio-intel && npm run deploy:pitch && npm run deploy:tracker"
  }
}
```

**Usage**:
```bash
# Deploy specific app
npm run deploy:web

# Deploy all apps at once
npm run deploy:all
```

## Long-term Solution: GitHub Actions Auto-Deploy

Add this file: `.github/workflows/deploy.yml`

```yaml
name: Auto Deploy on Push

on:
  push:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.filter.outputs.web }}
      audio-intel: ${{ steps.filter.outputs.audio-intel }}
      pitch: ${{ steps.filter.outputs.pitch }}
      tracker: ${{ steps.filter.outputs.tracker }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            web:
              - 'apps/web/**'
            audio-intel:
              - 'apps/audio-intel/**'
            pitch:
              - 'apps/pitch-generator/**'
            tracker:
              - 'apps/tracker/**'

  deploy-web:
    needs: detect-changes
    if: needs.detect-changes.outputs.web == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_WEB_PROJECT_ID }}
          working-directory: apps/web
          vercel-args: '--prod'

  deploy-audio-intel:
    needs: detect-changes
    if: needs.detect-changes.outputs.audio-intel == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_AUDIO_INTEL_PROJECT_ID }}
          working-directory: apps/audio-intel
          vercel-args: '--prod'

  deploy-pitch:
    needs: detect-changes
    if: needs.detect-changes.outputs.pitch == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PITCH_PROJECT_ID }}
          working-directory: apps/pitch-generator
          vercel-args: '--prod'

  deploy-tracker:
    needs: detect-changes
    if: needs.detect-changes.outputs.tracker == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_TRACKER_PROJECT_ID }}
          working-directory: apps/tracker
          vercel-args: '--prod'
```

## Setup Steps for Auto-Deploy

### 1. Get Your Vercel Tokens

```bash
# Get your Vercel token
vercel whoami
# Follow prompts to get token

# Get your org ID
vercel project ls

# Get project IDs for each app
cd apps/web && vercel project
cd ../audio-intel && vercel project
cd ../pitch-generator && vercel project
cd ../tracker && vercel project
```

### 2. Add GitHub Secrets

Go to: GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - Your Vercel org ID
- `VERCEL_WEB_PROJECT_ID` - Web project ID
- `VERCEL_AUDIO_INTEL_PROJECT_ID` - Audio Intel project ID
- `VERCEL_PITCH_PROJECT_ID` - Pitch Generator project ID
- `VERCEL_TRACKER_PROJECT_ID` - Tracker project ID

### 3. Test It

```bash
# Make a change to any app
echo "// test" >> apps/web/src/pages/index.tsx

# Commit and push
git add .
git commit -m "test: trigger auto-deploy"
git push
```

Within 2-3 minutes, GitHub Actions will automatically deploy the changed app to Vercel!

## Alternative: Vercel's Built-in Git Integration

**Note**: This is the simplest but requires setup in Vercel dashboard for each project.

1. Go to each Vercel project settings
2. Connect to GitHub repository
3. Set "Root Directory" for each project:
   - Web: `apps/web`
   - Audio Intel: `apps/audio-intel`
   - Pitch Generator: `apps/pitch-generator`
   - Tracker: `apps/tracker`
4. Set "Include files changed in this directory" option
5. Enable "Production Branch" = `main`

## Current Workaround (Manual)

Until you set up automation, manually deploy after pushing:

```bash
# After pushing changes to main
git push

# Deploy affected apps
cd apps/web && vercel --prod
cd ../audio-intel && vercel --prod
cd ../pitch-generator && vercel --prod
```

## Why This Happens

**Vercel's Default Behavior**:
- Single-app repos: Auto-deploys on every push ✅
- Monorepos: Requires configuration per project ❌

**Your Setup**:
- Monorepo with 10+ apps
- Each app = separate Vercel project
- Each needs explicit deployment trigger

## Recommended Solution

**Option 1** (Fastest): Add the npm scripts above and run `npm run deploy:all` after each push

**Option 2** (Best long-term): Set up GitHub Actions workflow for automatic deployments

**Option 3** (Vercel-native): Configure each project in Vercel dashboard with Root Directory settings

---

**Current Status**: Homepage (totalaudiopromo.com) successfully deployed ✅
