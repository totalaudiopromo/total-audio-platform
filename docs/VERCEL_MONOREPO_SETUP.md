# Vercel Monorepo Configuration Guide

## ✅ Standardized Configuration

All apps now have consistent `vercel.json` files with:
- `installCommand`: `pnpm install --frozen-lockfile` (runs at monorepo root)
- `buildCommand`: `pnpm --filter <app-name> build` (builds specific app)
- `outputDirectory`: `apps/<app-name>/.next` (tells Vercel where build output is)

## 🔧 Required Vercel Dashboard Settings

For **EACH** Vercel project, you MUST configure these settings:

### Step 1: Go to Project Settings
1. Open Vercel Dashboard
2. Select the project (audio-intel, tracker, pitch-generator, or web)
3. Go to **Settings** → **General**

### Step 2: Configure Root Directory

**CRITICAL**: Choose ONE of these options:

#### Option A: Root Directory = Blank (Recommended)
- **Root Directory**: Leave blank or set to `.`
- ✅ **Check**: "Include source files outside of the Root Directory in the Build Step"
- This tells Vercel to use the entire monorepo

#### Option B: Root Directory = App Directory
- **Root Directory**: `apps/<app-name>` (e.g., `apps/audio-intel`)
- ✅ **Check**: "Include source files outside of the Root Directory in the Build Step"
- This is required so Vercel can access workspace packages

### Step 3: Verify Build Settings

The `vercel.json` files now handle these automatically, but verify:
- **Framework Preset**: Next.js
- **Build Command**: (handled by vercel.json)
- **Output Directory**: (handled by vercel.json)
- **Install Command**: (handled by vercel.json)

### Step 4: Save and Redeploy

1. Click **Save**
2. Go to **Deployments** tab
3. Click **...** on latest deployment
4. Click **Redeploy**

## 📋 Project-Specific Settings

### audio-intel
- **Vercel Project**: `audio-intel`
- **Package Name**: `audio-intel`
- **Domain**: `intel.totalaudiopromo.com`

### tracker
- **Vercel Project**: `tracker`
- **Package Name**: `tracker`
- **Domain**: `tracker.totalaudiopromo.com`

### pitch-generator
- **Vercel Project**: `pitch-generator`
- **Package Name**: `pitch-generator`
- **Domain**: `pitch.totalaudiopromo.com`

### web
- **Vercel Project**: `web`
- **Package Name**: `total-audio-promo-frontend`
- **Domain**: `totalaudiopromo.com`

## 🚨 Common Issues

### Issue: "Module not found: Can't resolve '@total-audio/ui'"
**Solution**: Make sure "Include source files outside of the Root Directory" is checked

### Issue: "ERR_PNPM_LOCKFILE_CONFIG_MISMATCH"
**Solution**: Already fixed - all `.npmrc` files now match root configuration

### Issue: Build fails with "directory doesn't exist"
**Solution**: Set Root Directory to blank (`.`) instead of `apps/<app-name>`

### Issue: Build succeeds but deployment fails
**Solution**: Check that `outputDirectory` in vercel.json matches the actual build output location

## ✅ Verification

After configuring, test by:
1. Making a small change to any app
2. Committing and pushing to `main`
3. Checking Vercel dashboard for successful deployment

If builds still fail, check the build logs in Vercel dashboard for specific errors.

