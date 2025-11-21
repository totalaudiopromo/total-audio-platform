# CodeRabbit Reviewers Guide

## Overview

CodeRabbit acts as an automated senior reviewer for the Total Audio Platform. This guide explains what CodeRabbit checks and why.

## Philosophy

**Silent unless needed.** CodeRabbit only comments on substantive issues that could:

- Break the Golden Verify architecture
- Introduce security vulnerabilities
- Violate monorepo boundaries
- Cause production failures

**Not a style cop.** CodeRabbit doesn't enforce:

- Code formatting (Prettier handles this)
- Naming conventions (trust developer judgment)
- Minor stylistic preferences
- JSDoc comments

## Critical Architecture Rules

### 1. Golden Verify Architecture (Phase 10B)

**Rule**: CI validates, Vercel deploys, Golden Verify checks post-deployment.

**What CodeRabbit checks**:

-  No `vercel deploy` commands in `.github/workflows/ci.yml`
-  `ci.yml` only runs: lint, typecheck, test, build
-  `golden-verify.yml` includes all 3 apps: audio-intel, tracker, pitch-generator
-  Health endpoints exist for all apps

**Why**: Prevents duplicate deployments and maintains clean separation of concerns.

### 2. Monorepo Boundaries

**Rule**: Apps don't import from other apps. Use shared packages.

**What CodeRabbit checks**:

-  No `import { X } from '../../../apps/other-app'`
-  Apps can import from `packages/ui`, `packages/testing`, etc.
-  Shared logic lives in `packages/` directory

**Why**: Prevents circular dependencies and maintains app independence.

### 3. Environment Variables & Secrets

**Rule**: Never hardcode secrets. Always use environment variables.

**What CodeRabbit checks**:

-  No hardcoded `sk_live_*`, `sk_test_*`, connection strings
-  Secrets accessed via `process.env.SECRET_NAME`
-  Environment variables documented in `.env.example`

**Why**: Prevents credential leaks and enables proper secret rotation.

### 4. Supabase Migrations

**Rule**: All database changes must use Supabase migrations.

**What CodeRabbit checks**:

-  Migration files follow naming convention: `YYYYMMDDHHMMSS_description.sql`
-  Migrations are idempotent (safe to run multiple times)
-  Breaking changes include rollback strategy

**Why**: Ensures database changes are tracked, reviewable, and reversible.

## Security Checks

### Dependency Vulnerabilities

CodeRabbit scans for:

- Critical CVEs in dependencies
- Outdated packages with known exploits
- Suspicious package additions

**Action**: Address critical vulnerabilities before merging.

### Auth & Authorization

CodeRabbit validates:

-  API routes check authentication
-  Row Level Security (RLS) enabled for Supabase tables
-  User input is validated/sanitized

**Why**: Prevents unauthorized access and data breaches.

## Performance Checks

### Async Patterns

CodeRabbit checks for:

-  Unhandled promise rejections
-  Missing `await` keywords
-  Blocking synchronous operations in API routes

**Why**: Prevents memory leaks and degraded performance.

### Image Optimization

CodeRabbit validates:

-  Next.js `<Image>` component used instead of `<img>`
-  Images have proper width/height attributes
-  Large images are optimized

**Why**: Improves Core Web Vitals and user experience.

## TypeScript Checks

CodeRabbit enforces:

-  Strict mode enabled
-  No `any` types (use `unknown` or proper types)
-  Explicit return types for exported functions

**Why**: Catches bugs at compile time, improves maintainability.

## Testing Requirements

### Shared Validators

**Recommendation**: Use `@total-audio/testing` validators for consistency.

```typescript
//  Preferred
import { validateAllTouchTargets } from '@total-audio/testing';
await validateAllTouchTargets(page);

//  Not recommended
expect(await element.boundingBox().height).toBeGreaterThanOrEqual(44);
```

**Why**: Maintains consistent validation logic across all apps.

### Health Endpoints

**Required**: Every app must have `/api/health` endpoint.

```typescript
// apps/your-app/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date().toISOString() });
}
```

**Why**: Golden Verify depends on health endpoints for post-deployment checks.

## Documentation Standards

### Markdown File Management

**Rule**: Avoid creating new `.md` files in root directory.

**Approved locations**:

- `README.md`, `SECURITY.md` (standard)
- `WEEKLY_FOCUS.md`, `AUDIO_INTEL_CONTEXT.md`, `BUSINESS_NOTES.md` (business)
- `.claude/**/*.md` (Claude Code configuration)
- `apps/**/README.md` (app-specific)
- `packages/**/README.md` (package-specific)
- `docs/**/*.md` (technical documentation)

**Why**: Prevents documentation sprawl and maintains single source of truth.

## Lockfile Management

### pnpm-lock.yaml Sync

**Rule**: Lockfile must stay in sync with `package.json` files.

**What CodeRabbit checks**:

-  `pnpm-lock.yaml` changed without corresponding `package.json` change
-  Both lockfile and `package.json` updated together

**Fix**: Run `pnpm install` to regenerate lockfile.

**Why**: CI uses `--frozen-lockfile` which requires exact synchronization.

## Auto-Approval Conditions

CodeRabbit will auto-approve PRs when:

1.  All CI checks pass (lint, typecheck, test, build)
2.  No critical issues detected
3.  No security vulnerabilities found
4.  All architecture rules satisfied

## When CodeRabbit Requests Changes

CodeRabbit will block merging when:

1.  Critical architecture rule violated
2.  Security vulnerability introduced
3.  Required health endpoints missing
4.  Breaking changes without migration strategy

## Workflow Integration

### Expected Flow

```
Developer → PR → CodeRabbit Review → CI Checks → Auto-Merge (if approved)
                     ↓                   ↓
                 Comments          Validate Code
                 (if issues)       (lint/test/build)
                     ↓                   ↓
               Developer fixes       All pass
                     ↓                   ↓
              Auto-approve        Vercel Auto-Deploy
                                        ↓
                                 Golden Verify
                                        ↓
                                 Command Centre
```

### What Happens After Auto-Approval

1. **Merge to main**: PR auto-merges when CodeRabbit + CI approve
2. **Vercel Deploy**: Vercel GitHub App automatically deploys all apps
3. **Golden Verify**: Post-deployment health checks run automatically
4. **Command Centre**: Metrics ingested to dashboard
5. **Telegram**: Notifications sent only on failures

## Overriding CodeRabbit

### When to Override

You can override CodeRabbit (with review approval) when:

- False positive detection
- Edge case not covered by rules
- Urgent hotfix required

### How to Override

Add comment in PR:

```
@coderabbit ignore [rule-name]

Reason: [explanation]
```

**Important**: Another human reviewer must approve overrides.

## Configuring CodeRabbit

### Adding New Rules

Edit `.coderabbit/config.yml`:

```yaml
custom_rules:
  - name: 'Your rule name'
    files: 'path/to/files/**/*.ts'
    pattern: 'regex-pattern'
    severity: 'error|warning|critical'
    message: 'Explanation for developers'
```

### Adjusting Sensitivity

To make CodeRabbit more/less strict:

```yaml
checks:
  code_quality:
    max_complexity: 20 # Increase for less strictness
    max_lines_per_file: 500 # Adjust as needed
```

### Disabling Specific Checks

```yaml
checks:
  architecture:
    enabled: false # Disable architecture checks
```

**Warning**: Only disable checks with team consensus.

## Troubleshooting

### CodeRabbit Not Commenting

**Possible causes**:

1. No substantive issues found (working as intended!)
2. PR only changes excluded files (node_modules, .next, etc.)
3. Changes are style-only (Prettier formatting)

**Action**: Check CodeRabbit logs in PR checks tab.

### CodeRabbit Blocking Valid PR

**Possible causes**:

1. False positive from pattern matching
2. Rule needs refinement
3. Edge case not handled

**Action**:

1. Review CodeRabbit comment for explanation
2. If false positive, add `@coderabbit ignore` comment with reason
3. Get human review approval
4. Update `.coderabbit/config.yml` to prevent future false positives

### CodeRabbit Too Noisy

**Possible causes**:

1. Code quality thresholds too strict
2. Too many warnings enabled
3. Learning period (CodeRabbit adapts over time)

**Action**:

1. Review `.coderabbit/config.yml` settings
2. Adjust `max_complexity` and `max_lines_per_file`
3. Disable style checks if enabled
4. Give CodeRabbit time to learn codebase patterns

## Support

### Resources

- **CodeRabbit Docs**: https://docs.coderabbit.ai
- **Configuration**: `.coderabbit/config.yml`
- **This Guide**: `.coderabbit/reviewers.md`
- **CLAUDE.md**: `.claude/CLAUDE.md` (architecture context)

### Getting Help

1. Check CodeRabbit comment explanations (includes links to docs)
2. Review this guide for rule explanations
3. Ask in team chat for interpretation
4. Update configuration if rule needs adjustment

## Summary

**CodeRabbit is your automated senior reviewer:**

-  Enforces critical architecture rules
-  Catches security vulnerabilities
-  Validates monorepo boundaries
-  Maintains Golden Verify integrity
-  Doesn't nitpick style
-  Doesn't block on minor issues
-  Doesn't require perfect code

**Goal**: Catch substantive issues early, let humans focus on creative problem-solving.
