# Golden Deployment Pipeline v2.5.3

## Overview

The Golden Deployment Pipeline is an automated, multi-app deployment system that builds and deploys all Total Audio Platform applications to Vercel production domains using GitHub Actions.

**Version:** 2.5.3
**Last Updated:** November 6, 2025
**Status:** ✅ Production Ready

---

## 🎯 What is the Golden Pipeline?

The Golden Pipeline is a comprehensive deployment workflow that:

1. **Validates** - Checks environment variables, runs linting, and type checking
2. **Builds** - Compiles all apps in isolation with proper dependency management
3. **Deploys** - Creates Vercel preview deployments for each app
4. **Tests** - Runs health checks and Lighthouse performance audits
5. **Promotes** - Promotes validated deployments to production
6. **Verifies** - Confirms all production domains are live and healthy

---

## 📦 Apps Included

The Golden Pipeline builds and deploys **4 production applications**:

| App | Production URL | Description |
|-----|---------------|-------------|
| **Audio Intel** | https://intel.totalaudiopromo.com | Music intelligence platform |
| **Command Centre** | https://command.totalaudiopromo.com | Main dashboard and control center |
| **Main Website** | https://totalaudiopromo.com | Landing page and marketing site |
| **Playlist Pulse** | https://pulse.totalaudiopromo.com | Playlist tracking and analytics |

> **Note:** The original task description mentioned "tracker" and "pitch-generator" apps, but these do not exist in the current codebase. The pipeline has been configured for the 4 apps that actually exist.

---

## 🚀 How to Deploy

### Trigger a Golden Deployment

To trigger the pipeline, push a git tag matching the pattern `v*-golden`:

```bash
# Create and push a golden deployment tag
git tag v2.5.3-golden
git push origin v2.5.3-golden
```

The GitHub Actions workflow will automatically:
1. Validate the codebase
2. Build all 4 apps in parallel
3. Deploy to Vercel preview
4. Run health and performance checks
5. Promote to production (requires manual approval)
6. Verify production deployments

### Manual Deployment (Local)

You can also run deployments locally using the provided scripts:

```bash
# Check deployment readiness (dry-run)
npm run golden:check

# Check with full Lighthouse audits
npm run golden:check:full

# Deploy all apps to production
npm run golden:promote

# Deploy a single app
npm run golden:promote audio-intel
```

---

## 🔧 Setup Requirements

### GitHub Secrets

The following secrets must be configured in your GitHub repository:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `VERCEL_TOKEN` | Vercel authentication token | ✅ Yes |
| `VERCEL_ORG_ID` | Vercel organization/team ID | ✅ Yes |
| `VERCEL_PROJECT_ID_AUDIO_INTEL` | Project ID for Audio Intel | ✅ Yes |
| `VERCEL_PROJECT_ID_COMMAND_CENTRE` | Project ID for Command Centre | ✅ Yes |
| `VERCEL_PROJECT_ID_WEB` | Project ID for Main Website | ✅ Yes |
| `VERCEL_PROJECT_ID_PLAYLIST_PULSE` | Project ID for Playlist Pulse | ✅ Yes |

### How to Get Vercel IDs

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Get Organization ID (shown after login)
vercel teams list

# Get Project ID for each app
cd apps/audio-intel && vercel link
# Project ID will be in .vercel/project.json
```

---

## 🏗️ Architecture & Key Fixes

### Problem 1: Build Order Dependencies

**Issue:** Apps were failing because shared packages weren't built first.

**Solution:**
- Added explicit dependency installation steps
- Each app builds in isolation with its own working directory
- Root dependencies installed before app-specific builds

### Problem 2: Cache Collisions

**Issue:** Shared `.next` and `.turbo` caches between apps causing conflicts.

**Solution:**
- Each app cleans its cache before building
- Apps use separate working directories in the build matrix
- Build artifacts are isolated using GitHub Actions artifacts

### Problem 3: Missing Environment Variables

**Issue:** Vercel project IDs weren't being passed correctly to deployments.

**Solution:**
- Added validation step to check all required secrets
- Project IDs mapped correctly in matrix strategy using dynamic secret references
- Clear error messages when secrets are missing

### Problem 4: TypeScript and Environment Errors

**Issue:** Apps building locally but failing in CI with type errors.

**Solution:**
- TypeScript compilation now uses consistent settings
- Environment variables properly typed
- Non-blocking warnings for minor issues

### Problem 5: No Validation Before Deployment

**Issue:** Deployments failing silently without clear feedback.

**Solution:**
- Created `golden-check.ts` for pre-deployment validation
- Added health checks for production URLs
- Lighthouse performance audits
- Detailed status reporting

---

## 📊 Workflow Jobs

The Golden Pipeline consists of 7 sequential jobs:

### 1. Validate (`validate`)
- Extracts version from git tag
- Checks all required secrets exist
- Runs linting and type checking
- Validates environment configuration

### 2. Build (`build`)
- **Matrix Strategy:** Builds all 4 apps in parallel
- Installs dependencies for each app
- Runs `npm run build` in isolation
- Uploads build artifacts for later use

### 3. Deploy Preview (`deploy-preview`)
- Deploys each app to Vercel preview environment
- Pulls Vercel configuration
- Returns preview URLs for validation

### 4. Validate Deployments (`validate-deployments`)
- Performs health checks on preview URLs
- Runs basic Lighthouse performance tests
- Retries up to 5 times for transient failures

### 5. Promote Production (`promote-production`)
- **Requires:** Manual approval in GitHub Actions
- Promotes preview deployments to production
- Uses `vercel promote` command

### 6. Production Validation (`production-validation`)
- Checks all 4 production domains
- Verifies HTTP status codes
- Creates deployment summary report

### 7. Notify (`notify`)
- Sends success/failure notifications
- Provides quick deployment summary

---

## 🛠️ Troubleshooting

### Common Issues

#### ❌ "Missing Vercel project ID secrets"

**Cause:** GitHub secrets not configured properly.

**Fix:**
```bash
# Check your GitHub repository settings
# Settings → Secrets and variables → Actions
# Add the missing secret(s)
```

#### ❌ "Build failed: Module not found"

**Cause:** Dependencies not installed or workspace configuration issue.

**Fix:**
```bash
# Locally, run:
npm install --legacy-peer-deps
npm run build:audio-intel
# If it works locally, check GitHub Actions logs for specific errors
```

#### ❌ "Health check failed after 5 attempts"

**Cause:** Vercel deployment is slow or app has runtime errors.

**Fix:**
1. Check Vercel dashboard for deployment logs
2. Visit the preview URL manually to see errors
3. Check for missing environment variables in Vercel project settings

#### ⚠️ "Lighthouse score below 70"

**Cause:** Performance issues in the app.

**Fix:**
- Review Lighthouse report in GitHub Actions artifacts
- Optimize images, reduce bundle size, improve caching
- This is a warning, not a blocker

---

## 📝 Scripts Reference

### `golden-check.ts`

Pre-deployment validation script that checks build status, health, and performance.

```bash
# Basic validation
npm run golden:check

# Full validation with Lighthouse
npm run golden:check:full
```

**Output:**
- ✅ Build success/failure for each app
- ✅ Production health check status
- ⚠️ Performance warnings
- 📊 Summary table with deployment readiness

### `golden-promote.ts`

Deployment script that builds and promotes apps to production.

```bash
# Deploy all apps
npm run golden:promote

# Deploy single app
npm run golden:promote audio-intel
npm run golden:promote command-centre
npm run golden:promote web
npm run golden:promote playlist-pulse
```

**Output:**
- 🚀 Deployment progress for each app
- 🔗 Preview and production URLs
- ✅ Verification status
- 📊 Summary table

---

## 🎯 Best Practices

### Before Deploying

1. **Run validation locally:**
   ```bash
   npm run golden:check:full
   ```

2. **Test builds locally:**
   ```bash
   npm run build
   ```

3. **Check for TypeScript errors:**
   ```bash
   npm run typecheck
   ```

4. **Review recent commits:**
   ```bash
   git log --oneline -10
   ```

### During Deployment

1. Monitor GitHub Actions workflow in real-time
2. Check preview URLs before approving production promotion
3. Watch for any warnings or errors in the logs
4. Verify all 4 apps complete successfully

### After Deployment

1. Visit all 4 production URLs to verify
2. Check Lighthouse scores in the workflow summary
3. Monitor error tracking/analytics for issues
4. Tag the successful deployment in your project management tool

---

## 📈 Performance Benchmarks

Expected Lighthouse scores for each app:

| App | Target Score | Current Status |
|-----|--------------|----------------|
| Audio Intel | 85+ | To be measured |
| Command Centre | 80+ | To be measured |
| Main Website | 90+ | To be measured |
| Playlist Pulse | 85+ | To be measured |

> **Note:** Run `npm run golden:check:full` to get current Lighthouse scores.

---

## 🔄 Version History

### v2.5.3 (November 6, 2025)
- ✅ Complete overhaul of deployment pipeline
- ✅ Fixed build order and cache collision issues
- ✅ Added proper environment variable validation
- ✅ Created validation and promotion scripts
- ✅ Added comprehensive health checks
- ✅ Integrated Lighthouse performance audits
- ✅ Improved error reporting and diagnostics

### v2.5.2 (Previous)
- ⚠️ Known issues with deployment failures
- ⚠️ Missing validation steps
- ⚠️ Unreliable builds

---

## 🤝 Contributing

### Modifying the Pipeline

To add a new app to the Golden Pipeline:

1. **Update workflow** (`.github/workflows/golden-deploy.yml`):
   ```yaml
   matrix:
     app:
       - audio-intel
       - command-centre
       - web
       - playlist-pulse
       - your-new-app  # Add here
   ```

2. **Update scripts** (`scripts/golden-*.ts`):
   ```typescript
   const APPS: App[] = [
     // ... existing apps
     {
       name: 'your-new-app',
       displayName: 'Your New App',
       projectIdEnv: 'VERCEL_PROJECT_ID_YOUR_NEW_APP',
       productionUrl: 'https://your-app.totalaudiopromo.com',
       directory: 'apps/your-new-app'
     }
   ];
   ```

3. **Add GitHub secret:** `VERCEL_PROJECT_ID_YOUR_NEW_APP`

4. **Test locally:**
   ```bash
   npm run golden:check
   ```

---

## 📞 Support

### Getting Help

- **Documentation:** Read this file and `CLAUDE.md`
- **GitHub Actions:** Check workflow logs for specific errors
- **Vercel Dashboard:** View deployment logs and errors
- **Local Testing:** Use `golden-check.ts` to debug issues

### Reporting Issues

When reporting deployment issues, include:

1. Git tag used (e.g., `v2.5.3-golden`)
2. Which app(s) failed
3. Error messages from GitHub Actions
4. Output from `npm run golden:check`
5. Screenshots of Vercel errors (if applicable)

---

## ✅ Deployment Checklist

Before creating a golden deployment tag:

- [ ] All code changes committed and pushed
- [ ] `npm run golden:check` passes locally
- [ ] All GitHub secrets are configured
- [ ] No merge conflicts with main branch
- [ ] TypeScript compilation successful
- [ ] Tests passing (if applicable)
- [ ] Ready for production traffic

---

## 🎉 Success Criteria

A successful golden deployment means:

- ✅ All 4 apps built successfully
- ✅ All 4 apps deployed to Vercel
- ✅ All 4 production URLs returning HTTP 200/301/302
- ✅ Lighthouse scores meet or exceed targets
- ✅ No critical errors in deployment logs
- ✅ Manual verification of key features

---

**Happy Deploying! 🚀**

For questions or issues, refer to the troubleshooting section above or check the GitHub Actions workflow logs.
