# GitHub Actions Failure Diagnosis

**Date**: November 12, 2025  
**Status**: FIXED - Outdated pnpm-lock.yaml file

## ACTUAL ROOT CAUSE (FIXED)

**Error**: `ERR_PNPM_OUTDATED_LOCKFILE - Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with packages/testing/package.json`

**Issue**: The `pnpm-lock.yaml` file was missing dependencies that were added to `packages/testing/package.json`:

- `@vitest/ui@^2.1.8`
- `vitest@^2.1.8`

**Fix Applied**: Ran `pnpm install` locally to update the lockfile, then committed it.

---

## Previous Analysis (For Reference)

Based on the workflow files and local testing, here were the potential causes:

### 1. **Missing GitHub Secrets**(Most Likely)

The CI workflow requires these secrets to build apps:

```yaml
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

**Impact**: Builds will fail if these aren't set, even though typecheck has `|| true`.

**Fix**: Add these secrets in GitHub → Settings → Secrets → Actions

### 2. **Test Failures in CI Environment**

The CI workflow runs `pnpm run test` (Playwright tests) without `|| true`, so any test failure will fail the workflow.

**Local Status**: Tests pass locally  
**CI Status**:  Unknown - need to check GitHub Actions logs

**Potential Issues**:

- Missing environment variables for tests
- Browser dependencies not installed in CI
- Network/timeout issues in CI environment

### 3. **TypeScript Errors (Non-Blocking)**

There are React 19 type conflicts in `apps/web/src/components/integrations/HybridSEOIntegration.tsx`:

```
error TS2786: 'CheckCircle' cannot be used as a JSX component.
error TS2786: 'XCircle' cannot be used as a JSX component.
```

**Impact**: Typecheck has `|| true` so it won't fail CI, but builds might still encounter issues.

**Fix**: Update React types or fix component usage (see below)

### 4. **Golden Verification Pipeline Failures**

The Golden Verification Pipeline requires additional secrets:

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
NOTION_TOKEN
NOTION_PAGE_ID
```

**Impact**: Scripts will fail if secrets are missing.

## Immediate Fixes

### Step 1: Add Required Secrets to GitHub

Go to: `https://github.com/totalaudiopromo/total-audio-platform/settings/secrets/actions`

Add these secrets:

1. **NEXT_PUBLIC_SUPABASE_URL**- Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**- Supabase anonymous key
3. **SUPABASE_SERVICE_ROLE_KEY**- Supabase service role key
4. **TELEGRAM_BOT_TOKEN**(optional, for notifications)
5. **TELEGRAM_CHAT_ID**(optional, for notifications)

### Step 2: Fix TypeScript Errors

The React 19 type conflicts need to be resolved. The issue is with `lucide-react` components in React 19.

**Quick Fix**: Update the component usage in `apps/web/src/components/integrations/HybridSEOIntegration.tsx`:

```typescript
// Instead of:
<CheckCircle className="h-4 w-4" />

// Use:
{React.createElement(CheckCircle, { className: "h-4 w-4" })}
```

Or better: Ensure React types are consistent across the monorepo.

### Step 3: Make Tests More Resilient

Consider updating `.github/workflows/ci.yml` to handle test failures gracefully:

```yaml
- name: Run tests
  run: pnpm run test || true
  env:
    CI: true
```

**Note**: Only do this if you want tests to be non-blocking. Otherwise, fix the underlying test issues.

### Step 4: Check GitHub Actions Logs

To see the actual error:

1. Go to: `https://github.com/totalaudiopromo/total-audio-platform/actions`
2. Click on a failed workflow run
3. Expand the failing job
4. Check the error messages

## Verification Checklist

- [ ] All required secrets added to GitHub Actions
- [ ] TypeScript errors fixed (or confirmed non-blocking)
- [ ] Tests pass in CI environment
- [ ] Builds complete successfully
- [ ] Golden Verification Pipeline runs without errors

## Quick Test

After adding secrets, trigger a new workflow run:

```bash
# Make a small commit to trigger CI
git commit --allow-empty -m "test: trigger CI after adding secrets"
git push
```

## Notes

- **GitHub Actions Quota**: Previous documentation mentioned quota exhaustion, but workflows are running (not cancelled), so this might not be the current issue
- **Local vs CI**: Everything works locally, suggesting environment/secret differences
- **Build Success**: Local builds succeed, so code is fine - it's likely a CI configuration issue

---

**Next Steps**: Add the secrets first, then check the workflow logs to see if there are other issues.
