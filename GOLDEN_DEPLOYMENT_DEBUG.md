# Golden Deployment Pipeline - Debug Summary

**Date**: 2025-01-11
**Issue**: GitHub Actions workflow failing despite 7 fix attempts
**Current Status**: All 4 build jobs failing with "same errors" (exact error not yet captured)

## Problem Context

Attempting to deploy Phase 9E Golden Deployment Pipeline via git tag `v2.5.1-golden`.

**Expected Behavior**:

1. Build 4 apps in parallel (audio-intel, tracker, pitch-generator, command-centre)
2. Run health checks on each
3. Run Lighthouse audits
4. Promote preview deployments to production
5. Generate Golden Report artifacts

**Actual Behavior**: All 4 build jobs fail consistently

## Fix Attempts (Chronological)

### Attempt 1-2: Wrong Script Logic

- **Issue**: `golden-check.ts` was duplicating `golden-promote.ts` logic
- **Fix**: Completely rewrote health check script with proper `--app` argument parsing
- **Result**: Still failed

### Attempt 3-5: Monorepo Lockfile Sync

- **Issue**: `ERR_PNPM_OUTDATED_LOCKFILE` - `@total-audio/core-db` in package.json but not in lockfile (or vice versa)
- **Fix**: Regenerated pnpm-lock.yaml, synced package.json changes
- **Result**: Still failed

### Attempt 6: Workflow Trigger Race Condition

- **Issue**: Workflow triggered on BOTH `push: branches: - main` AND `push: tags: - v*-golden`, causing simultaneous runs on different commits
- **Fix**: Removed main branch trigger, only use tag triggers
- **Result**: Still failed

### Attempt 7: Missing tsconfig.base.json

- **Issue**: `error TS5083: Cannot read file 'tsconfig.base.json'` - file was gitignored by pattern `!tsconfig.json`
- **Fix**: Force-added tsconfig.base.json with `git add -f`
- **Result**: User reports "Same issue" (need exact error)

## Current Commit State

**Latest Commit**: 68225ce - "fix: add missing tsconfig.base.json to repository"
**Tag**: v2.5.1-golden (points to 68225ce)

**Files Verified Clean**:

- ✅ tsconfig.base.json committed and in git
- ✅ No @total-audio/core-db in apps/command-centre/package.json
- ✅ pnpm-lock.yaml synced (no core-db references for command-centre)
- ✅ Workflow only triggers on tags (no race condition)

## Critical Questions for Codex

1. **What is the EXACT error message** from the latest GitHub Actions run?
   - User says "same errors" but hasn't provided the exact error text
   - Need to see actual build logs to confirm it's not still the tsconfig issue

2. **Is there a different missing file** that's gitignored?
   - Pattern: File exists locally but not in git repo
   - Check .gitignore for patterns that might exclude required files

3. **Are there other monorepo configuration issues?**
   - pnpm-workspace.yaml misconfigured?
   - Missing workspace dependencies?
   - Incorrect package.json references?

4. **Is Next.js 15.3.0 build failing for a different reason?**
   - Environment variable issues?
   - Build configuration problems?
   - TypeScript strict mode errors?

## Diagnostic Steps Needed

1. **Get exact error from GitHub Actions logs**

   ```bash
   # User needs to copy exact error text from:
   # https://github.com/totalaudiopromo/total-audio-platform/actions/workflows/golden-deploy.yml
   ```

2. **Check for other gitignored files**

   ```bash
   git ls-files -o --exclude-standard | grep -E "\.json$|\.ts$|\.js$"
   ```

3. **Verify build works locally**

   ```bash
   pnpm install --frozen-lockfile
   pnpm --filter tracker build  # Test the app that failed in logs
   ```

4. **Compare local vs CI environment**

   ```bash
   # Check Node.js version
   node --version  # Should match GitHub Actions

   # Check pnpm version
   pnpm --version  # Should be 10.x as specified in workflow
   ```

## Workflow File Reference

`.github/workflows/golden-deploy.yml`:

```yaml
on:
  push:
    tags:
      - 'v*-golden'
  workflow_dispatch:

jobs:
  build-and-test:
    strategy:
      matrix:
        app: [audio-intel, tracker, pitch-generator, command-centre]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - name: Install dependencies
        run: pnpm install
      - name: Build ${{ matrix.app }}
        run: pnpm --filter ${{ matrix.app }} build
```

## Files Modified in This Session

1. `scripts/golden-check.ts` - Complete rewrite of health check logic
2. `scripts/golden-promote.ts` - Vercel deployment promotion script
3. `.github/workflows/golden-deploy.yml` - Removed main branch trigger
4. `tsconfig.base.json` - Force-added to repository
5. `pnpm-lock.yaml` - Regenerated multiple times
6. `apps/command-centre/package.json` - Removed @total-audio/core-db dependency

## Next Actions

**CRITICAL**: Need exact error message from latest GitHub Actions run to proceed. Without this, we're debugging blind.

User should:

1. Open https://github.com/totalaudiopromo/total-audio-platform/actions/workflows/golden-deploy.yml
2. Click on the latest workflow run
3. Click on any failed build job (e.g., "Build & Verify tracker")
4. Expand the failed step
5. Copy the FULL error message including stack trace

## Pattern Recognition

All 7 attempts have revealed **different root causes**:

1. Wrong script implementation
2. Lockfile sync issue (3 variations)
3. Workflow trigger race condition
4. Missing gitignored file

**Hypothesis**: There may be a 5th unrelated issue that we can't see without exact error logs.

---

**For Codex**: Please help identify the root cause by either:

- Analyzing the exact error message (once provided)
- Suggesting what other common Next.js 15 build issues could cause this
- Identifying other potential gitignore patterns that might hide required files
