# Audio Intel Monorepo Migration

**Date:** 2025-11-11
**Status:** Configuration Complete - Awaiting Vercel Deployment

## Problem Summary

Audio Intel was 175 commits behind production due to **dual-repository architecture**:

- **Development**: Happened in monorepo (`totalaudiopromo/total-audio-platform`)
- **Deployment**: Vercel was watching standalone repo (`totalaudiopromo/audio-intel`)
- **Result**: 175 commits pushed to standalone repo but never deployed

### Symptoms

- Live site showing 46-hour-old cached content (`age: 165857` seconds)
- All 7 images returning HTTP 400 errors
- Mobile experience showing old, broken UI
- User discovered: "shouldnt intel be in the monorepo? i dunno why i did it this way tbh"

## Solution: Eliminate Dual-Repository Architecture

**Decision:** Consolidate everything into single monorepo deployment (Option C)

### Changes Made

#### 1. Updated `apps/audio-intel/vercel.json`

**Before:**

```json
{
  "buildCommand": "pnpm build"
}
```

**After:**

```json
{
  "buildCommand": "pnpm --filter audio-intel build"
}
```

**Reason:** Matches the working pattern used by Tracker and Pitch Generator:

- Tracker: `"buildCommand": "pnpm --filter tracker build"` 
- Pitch Generator: `"buildCommand": "pnpm --filter pitch-generator build"` 
- Audio Intel: Now matches this pattern 

#### 2. Vercel Dashboard Configuration (Manual - User Completed)

User manually configured Vercel Dashboard with correct settings:

- **Repository**: `totalaudiopromo/total-audio-platform` (monorepo)
- **Root Directory**: `apps/audio-intel`
- **Include files outside root**: Enabled
- **Build Command**: `pnpm --filter audio-intel build` (from vercel.json)
- **Install Command**: `pnpm install --frozen-lockfile` (from vercel.json)
- **Output Directory**: `.next` (from vercel.json)

## Deployment Architecture

### Current (Unified Monorepo)

```
Developer Push to `main`
           ↓
GitHub Actions: ci.yml (validation)
           ↓
Vercel Git Integration
   Audio Intel (apps/audio-intel) → https://intel.totalaudiopromo.com
   Tracker (apps/tracker) → https://tracker.totalaudiopromo.com
   Pitch Generator (apps/pitch-generator) → https://pitch.totalaudiopromo.com
           ↓
golden-verify.yml (post-deployment checks)
```

### All Apps Now Use Same Pattern

| App             | Build Command                         | Root Directory         | Status |
| --------------- | ------------------------------------- | ---------------------- | ------ |
| Audio Intel     | `pnpm --filter audio-intel build`     | `apps/audio-intel`     |     |
| Tracker         | `pnpm --filter tracker build`         | `apps/tracker`         |     |
| Pitch Generator | `pnpm --filter pitch-generator build` | `apps/pitch-generator` |     |

## Verification Status

### Completed 

1. **vercel.json updated** - Commit: `fe9e3f03`
2. **Pushed to GitHub** - Successfully pushed to `main` branch
3. **Golden Verify passed** - Post-deployment health checks succeeded
4. **User configured Vercel Dashboard** - Manual configuration complete

### Pending 

1. **Vercel Deployment** - Waiting for automatic deployment trigger
2. **Live Site Refresh** - Currently showing 46-hour-old cache
3. **Image Loading** - 7 broken images need to resolve with fresh deploy
4. **Mobile UX Verification** - Test mobile experience after deployment

### CI Status 

- **CI Workflow**: Failed on latest commit (needs investigation)
- **Impact**: Should NOT block Vercel deployment (Vercel deploys independently)
- **Golden Verify**: Passed (post-deployment checks working)

## Expected Outcomes

Once Vercel deployment completes:

1. **Fresh Content**: All 175 commits deployed to production
2. **Images Fixed**: `/images/` and `/assets/` paths resolve correctly
3. **Mobile UX**: 21 previously fixed UX issues visible on live site
4. **Cache Cleared**: New deployment replaces 46-hour-old cached version
5. **Unified Pipeline**: Single source of truth for all development

## Migration Complete Checklist

- [x] Update `apps/audio-intel/vercel.json` with monorepo filter command
- [x] Push changes to GitHub `main` branch
- [x] User manually configured Vercel Dashboard settings
- [x] Document migration in this file
- [ ] Verify Vercel deployment triggered automatically
- [ ] Test live site loads fresh content (check cache age)
- [ ] Verify all 7 images load successfully (no HTTP 400)
- [ ] Test mobile UX on live site
- [ ] Confirm Golden Verify runs post-deployment checks
- [ ] Update other documentation with monorepo patterns

## Troubleshooting

### If Deployment Doesn't Trigger

1. **Check Vercel Dashboard**:
   - Go to https://vercel.com/chris-projects-6ffe0e29/audio-intel/deployments
   - Look for recent deployment with commit `fe9e3f03`
   - If not visible, trigger manual deployment

2. **Verify Git Integration**:
   - Ensure Vercel GitHub App has access to repository
   - Check deployment trigger settings (should be auto-deploy on `main`)

3. **Manual Trigger** (if needed):
   ```bash
   vercel --prod --cwd apps/audio-intel
   ```

### If Images Still Broken After Deploy

1. **Check Image Paths**: Verify `/public/images/` contains all referenced files
2. **Check Next.js Config**: Review `next.config.js` image optimization settings
3. **Check Vercel Logs**: Look for build-time warnings about missing assets

## Historical Context

### Why Dual-Repository Existed

Unknown - user stated: "shouldnt intel be in the monorepo? i dunno why i did it this way tbh"

Likely reasons:

- Early experimentation with deployment patterns
- Separate repository for "production" vs "development"
- Confusion about monorepo deployment capabilities

### Why It Broke

1. Development happened in monorepo
2. 175 commits pushed to standalone repo
3. Vercel was configured to watch standalone repo
4. Standalone repo wasn't actually being watched (config error)
5. Result: No deployments for 46+ hours

### Lesson Learned

**Single Source of Truth**: Keep all development and deployment in one repository with proper monorepo tooling (pnpm workspaces + Vercel root directory configuration).

---

**Last Updated:** 2025-11-11 21:30 GMT
**Next Action:** Wait for Vercel automatic deployment, then verify live site
**Related Docs:**

- [docs/PHASE_10C_CLEANUP_AND_REBASE.md](./PHASE_10C_CLEANUP_AND_REBASE.md) - Golden Pipeline Reset
- [.claude/CLAUDE.md](../.claude/CLAUDE.md) - CI/CD Pipeline Architecture
