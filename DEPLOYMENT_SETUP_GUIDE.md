# 🚀 Deployment Setup Guide

## ✅ What's Been Fixed

Your GitHub and Vercel setup has been configured with industry best practices:

### 1. **Build Scripts Added** ✅
All 5 apps now have build scripts in root `package.json`:
- `npm run build:audio-intel`
- `npm run build:command-centre`
- `npm run build:tracker`
- `npm run build:web`
- `npm run build:pitch-generator`

### 2. **GitHub Actions CI/CD Updated** ✅
- **Build matrix**: All 5 apps build independently
- **Deploy matrix**: All 5 apps deploy to staging and production
- **Fail-safe**: One app failure won't block others (`fail-fast: false`)
- **Build gates**: Tests must pass before deployment

### 3. **Vercel Configuration Standardized** ✅
All apps now have consistent `vercel.json`:
- Framework detection (`nextjs`)
- UK region (`lhr1`)
- API timeout configuration (30s)
- Environment variables per app

### 4. **Monorepo Deployment Pattern** ✅
Configured for shared packages like `@total-audio/ui`:
- Deploy from repo root with app directory
- Single lockfile authoritative across all apps
- Workspace packages included in dependency graph

## 🔧 Manual Setup Required

### Step 1: Link Vercel Projects to GitHub

For each project in your Vercel dashboard:

**Projects to link:**
- `audio-intel` → `intel.totalaudiopromo.com`
- `command-centre` → `command.totalaudiopromo.com`
- `tracker` → `tracker.totalaudiopromo.com`
- `web` → `totalaudiopromo.com`
- `pitch-generator` → `pitch.totalaudiopromo.com`

**How to link:**
1. Go to Vercel Dashboard → [Project Name] → Settings → Git
2. Click "Connect Git Repository"
3. Select: `totalaudiopromo/total-audio-platform`
4. Set Root Directory: `apps/[app-name]`
5. Leave build settings empty (handled by `vercel.json`)

**Important for Monorepo:**
- Root Directory ensures shared packages like `@total-audio/ui` are available
- Single `package-lock.json` stays authoritative across all apps
- Workspace dependencies properly resolved during builds

### Step 2: Add GitHub Secrets

Go to GitHub repo → Settings → Secrets → Actions and add:

**Existing secrets (already configured):**
- `VERCEL_TOKEN` ✅
- `VERCEL_ORG_ID` ✅
- `VERCEL_PROJECT_ID_AUDIO_INTEL` ✅
- `VERCEL_PROJECT_ID_COMMAND_CENTRE` ✅

**New secrets needed:**
- `VERCEL_PROJECT_ID_TRACKER`
- `VERCEL_PROJECT_ID_WEB`
- `VERCEL_PROJECT_ID_PITCH_GENERATOR`

**To get project IDs:**
1. Vercel Dashboard → [Project] → Settings → General
2. Copy the "Project ID" value

## 🧪 Testing the Setup

### Test on Staging Branch (Safe)
```bash
# Create and push to staging branch
git checkout -b staging
git add .
git commit -m "feat: configure multi-app deployment"
git push origin staging

# Watch GitHub Actions run
# Check Vercel dashboard for preview deployments
```

### Deploy to Production
```bash
# Merge to main for production deployment
git checkout main
git merge staging
git push origin main

# Watch GitHub Actions deploy all 5 apps to production
```

## 🎯 How It Works

### Automatic Deployment Flow
1. **Push to `main`** → All 5 apps deploy to production
2. **Push to `staging`** → All 5 apps deploy to preview
3. **Push to feature branch** → No deployment (manual only)

### Build Process
1. **Test & Lint** → TypeScript, ESLint checks
2. **Build** → All 5 apps build in parallel (from repo root)
3. **Deploy** → Each app deploys independently with shared packages

### Failure Handling
- **Build fails** → Deployment blocked
- **One app fails** → Others continue deploying
- **Missing secrets** → Deployment skipped for that app

## 🔍 Monitoring Deployments

### GitHub Actions
- Go to your repo → Actions tab
- Watch "CI/CD Pipeline" workflow runs
- Check individual job logs for details

### Vercel Dashboard
- Each app has its own deployment history
- Preview deployments for staging branch
- Production deployments for main branch

## 🚨 Troubleshooting

### Common Issues

**"No Production Deployment"**
- Check if GitHub Secrets are configured
- Verify Vercel project is linked to GitHub
- Check build logs in GitHub Actions

**"Connect Git Repository"**
- Project not linked to GitHub repo
- Follow Step 1 above to link

**Build Failures**
- Check individual app build logs
- Verify `package.json` scripts exist
- Check for TypeScript/ESLint errors

**"Missing Module" Errors (e.g. `@total-audio/ui`)**
- Ensure Root Directory is set to `apps/[app-name]` in Vercel
- Verify workspace packages are in root `package.json`
- Run `npm run build --workspace=apps/[app-name]` locally to test
- Check that `packages/ui` is properly referenced in app's `package.json`

### Getting Help
- Check GitHub Actions logs first
- Vercel dashboard shows deployment status
- Each app can be debugged independently

## 📚 Monorepo Best Practices

### Shared Packages
- `packages/ui` - Shared UI components
- `packages/auth` - Authentication utilities  
- `packages/shared-utils` - Common utilities

### Deployment Strategy
- **Root-based builds**: All apps build from repo root
- **Single lockfile**: `package-lock.json` authoritative across workspace
- **Workspace resolution**: Dependencies properly resolved during Vercel builds

### Pre-deploy Validation
```bash
# Test builds locally before pushing
npm run build:audio-intel
npm run build:command-centre
npm run build:tracker
npm run build:web
npm run build:pitch-generator
```

---

**Next Steps**: Once you've completed the manual setup, push to `staging` branch to test, then `main` for production deployment. All 5 apps will deploy automatically with shared packages! 🎉
