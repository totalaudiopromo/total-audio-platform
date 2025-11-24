# 🚨 URGENT: Fix Golden Deployment Pipeline (30th Attempt Failed)

## Context

Working on Total Audio Platform monorepo. The Golden Deployment Pipeline has failed **30 times** due to various CI/CD issues. We've fixed:

- ✅ Build matrix app names (27th attempt)
- ✅ Deployment case statements for Vercel (28th attempt)
- ✅ CI workflow template syntax - hashFiles (29th attempt)
- ✅ ESLint plugin conflicts (30th attempt)

**Current Status**: 30th attempt still showing failures. Need to fix ALL remaining issues in ONE go.

## Repository Info

- **Repo**: `/Users/chrisschofield/workspace/active/total-audio-platform`
- **Main Branch**: `main`
- **Latest Commit**: `364882a` - "fix: resolve ESLint plugin conflict in audio-intel (30th Golden Deploy)"
- **Package Manager**: pnpm (workspace monorepo)
- **Node**: v20
- **Apps**: audio-intel, tracker, pitch-generator, command-centre, web, api

## Latest CI/CD Failures (Commit 364882a)

### Failed Jobs:

1. **Lint, Typecheck, Test & Build** - Exit code 1
2. **Security Scan** - Exit code 1 (twice)

## Your Task: FIX EVERYTHING

Run these diagnostic steps **locally** first, then fix ALL issues:

### Step 1: Diagnose Lint Failures

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
pnpm run lint 2>&1 | tee lint-output.txt
```

Check for:

- ESLint configuration conflicts (root vs app-level)
- Missing plugins or extends
- TypeScript path resolution issues
- Any files that can't be parsed

### Step 2: Diagnose Typecheck Failures

```bash
pnpm run typecheck 2>&1 | tee typecheck-output.txt
```

Check for:

- TypeScript errors in any app
- Missing type definitions
- Path alias issues (@total-audio/\* imports)
- tsconfig.json inheritance problems

### Step 3: Diagnose Test Failures

```bash
pnpm run test 2>&1 | tee test-output.txt
```

Check for:

- Failing unit tests
- Missing test dependencies
- Environment variable issues

### Step 4: Diagnose Build Failures

```bash
pnpm run build:audio-intel 2>&1 | tee build-audio-intel.txt
pnpm run build:tracker 2>&1 | tee build-tracker.txt
pnpm run build:pitch-generator 2>&1 | tee build-pitch.txt
```

Check for:

- Build-time errors
- Missing environment variables
- Next.js build issues
- Dependency resolution problems

### Step 5: Diagnose Security Scan

```bash
pnpm audit --audit-level=high --json > audit-results.json 2>&1 || true
cat audit-results.json
```

Check for:

- High-severity vulnerabilities
- JSON parsing issues in CI script
- False positives

## Required Fixes

Based on diagnostics, fix ALL of these:

### 1. ESLint Configuration

- Ensure no plugin conflicts between root and app-level configs
- Verify `"root": true` is set correctly in app configs
- Check all extends are valid
- Remove any unavailable rules

### 2. TypeScript Configuration

- Fix any path alias issues
- Ensure tsconfig.json inheritance works
- Resolve any type errors
- Check exclude patterns don't break builds

### 3. Build Configuration

- Ensure all apps can build successfully locally
- Fix any missing dependencies
- Resolve environment variable issues
- Check Next.js configs are valid

### 4. CI Workflow Fixes

Check `.github/workflows/ci.yml`:

- Verify hashFiles syntax is correct
- Ensure security scan exit code handling works
- Check all pnpm commands are valid
- Verify cache keys are correct

### 5. Test Fixes

- Fix any failing tests
- Mock any external dependencies
- Ensure test environment is configured

## Expected Result: ALL GREEN TICKS ✅✅✅

After your fixes, ALL of these should pass:

```bash
# All these commands should exit with code 0
pnpm run lint          # ✅ No ESLint errors
pnpm run typecheck     # ✅ No TypeScript errors
pnpm run test          # ✅ All tests passing
pnpm run build:audio-intel       # ✅ Clean build
pnpm run build:tracker           # ✅ Clean build
pnpm run build:pitch-generator   # ✅ Clean build
pnpm audit --audit-level=high    # ✅ No high-severity issues (or properly handled)
```

## Commit Format

After fixing everything:

```bash
git add -A
git commit -m "fix: resolve ALL CI/CD blockers - lint, typecheck, test, build, security (31st Golden Deploy)

- Fix: [describe lint fix]
- Fix: [describe typecheck fix]
- Fix: [describe test fix]
- Fix: [describe build fix]
- Fix: [describe security scan fix]

Expected: ALL GREEN TICKS ✅✅✅ on GitHub Actions
Previous attempts: 30 failed, this is the final comprehensive fix
"
git push origin main
```

## Critical Requirements

1. **Test EVERYTHING locally first** - don't push until all commands pass
2. **Fix ALL issues in ONE commit** - no more incremental fixes
3. **Provide detailed commit message** - explain what each fix addresses
4. **Verify no regressions** - don't break previously working configs
5. **Check file permissions** - use `git add -f` if files are gitignored

## Files You May Need to Edit

Based on previous attempts, these are likely candidates:

- `.github/workflows/ci.yml` - CI workflow configuration
- `.github/workflows/ci-cd.yml` - Deployment workflow
- `.eslintrc.json` (root) - Root ESLint config
- `apps/audio-intel/.eslintrc.json` - App-level ESLint config
- `apps/audio-intel/tsconfig.json` - TypeScript config
- `apps/*/package.json` - Dependencies and scripts
- `package.json` (root) - Workspace scripts
- Any test files that are failing

## Success Criteria

Push this commit ONLY when:

1. ✅ `pnpm run lint` passes with exit code 0
2. ✅ `pnpm run typecheck` passes with exit code 0
3. ✅ `pnpm run test` passes with exit code 0
4. ✅ `pnpm run build:audio-intel` succeeds
5. ✅ `pnpm run build:tracker` succeeds
6. ✅ `pnpm run build:pitch-generator` succeeds
7. ✅ `pnpm audit` handled properly (no blockers)

## Additional Context

**Why This Matters**:

- This is blocking production deployments
- 30 failed attempts have been made
- Each failure wastes GitHub Actions minutes
- Customer acquisition is blocked by deployment issues

**Previous Fixes**:

- Attempt 27: Fixed build matrix app names
- Attempt 28: Fixed Vercel project ID mappings
- Attempt 29: Fixed hashFiles template syntax + security scan
- Attempt 30: Fixed ESLint plugin conflict with `"root": true`

**What's Still Failing**: Unknown - need to run diagnostics to find out

## Your Mission

**Run diagnostics → Identify ALL issues → Fix ALL issues → Test locally → Commit once → Push → ALL GREEN TICKS**

Let's get this done ONCE AND FOR ALL. 🚀
