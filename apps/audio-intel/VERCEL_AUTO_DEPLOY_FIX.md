# Fix Vercel Auto-Deploy from GitHub

## The Problem
When you deleted the old Vercel project and created a new one, the GitHub integration webhook wasn't properly connected. This means GitHub pushes don't trigger deployments automatically.

## Solution: Re-connect GitHub Integration

### Step 1: Check Current Integration
1. Go to Vercel Dashboard: https://vercel.com/chris-projects-6ffe0e29/audio-intel
2. Click **Settings** tab
3. Click **Git** in the sidebar
4. Check if **GitHub Repository** is connected

### Step 2: If Not Connected
1. Click **Connect Git Repository**
2. Select **GitHub**
3. Choose repository: `totalaudiopromo/total-audio-platform`
4. Set **Root Directory**: `apps/audio-intel`
5. Leave **Production Branch**: `main`

### Step 3: Configure Build Settings
1. Still in Settings → **Git**
2. Set **Framework Preset**: Next.js
3. **Build Command**: `npm run build` (or leave default)
4. **Output Directory**: `.next` (or leave default)
5. **Install Command**: `npm install` (or leave default)

### Step 4: Test Auto-Deploy
1. Make a small change to any file (e.g., add a comment)
2. Commit and push to `main` branch
3. Check Vercel dashboard - you should see a new deployment automatically triggered
4. Look for webhook event in GitHub: Settings → Webhooks

## Alternative: Manual Deploy Command
If you prefer manual control, keep using:
```bash
npx vercel --prod --yes
```

## Expected Behavior After Fix
- ✅ Every push to `main` → Automatic Vercel deployment
- ✅ Every PR → Automatic preview deployment
- ✅ GitHub shows deployment status in commits/PRs
