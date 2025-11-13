## Summary

<!-- Brief description of what this PR does -->

## Type of Change

<!-- Mark with an 'x' -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (code improvement without functionality change)
- [ ] Documentation update
- [ ] CI/CD or infrastructure change
- [ ] Testing (new tests or test improvements)

## Motivation and Context

<!-- Why is this change required? What problem does it solve? -->
<!-- If it fixes an open issue, please link to the issue here -->

## Changes Made

<!-- List the specific changes made in this PR -->

-
-
-

## Apps/Packages Affected

<!-- Mark with an 'x' all that apply -->

- [ ] audio-intel
- [ ] tracker
- [ ] pitch-generator
- [ ] web (marketing site)
- [ ] packages/ui
- [ ] packages/testing
- [ ] Other: <!-- specify -->

## Architecture Compliance

<!-- Verify Golden Verify architecture compliance -->

- [ ] No deployment logic added to CI workflow
- [ ] No cross-app imports (apps don't import from other apps)
- [ ] Shared logic placed in `packages/` if needed
- [ ] Health endpoints exist for any new apps
- [ ] Environment variables documented in `.env.example`
- [ ] No hardcoded secrets or credentials

## Testing

<!-- Describe the tests you ran and how to reproduce -->

### Test Commands Run

```bash
# Add commands you ran to test this PR

```

### Test Results

- [ ] All CI checks pass (lint, typecheck, test, build)
- [ ] Manual testing completed
- [ ] Mobile testing completed (if UI changes)
- [ ] Tested on Audio Intel
- [ ] Tested on Tracker
- [ ] Tested on Pitch Generator

### Test Coverage

- [ ] New tests added for new functionality
- [ ] Existing tests updated for changes
- [ ] Used `@total-audio/testing` validators where applicable
- [ ] All tests passing locally

## Database Changes

<!-- If this PR includes database changes -->

- [ ] N/A - No database changes
- [ ] Supabase migration created
- [ ] Migration tested locally
- [ ] Migration is idempotent (safe to run multiple times)
- [ ] RLS policies updated if needed
- [ ] Rollback strategy documented

## Security Checklist

<!-- Verify security best practices -->

- [ ] No secrets or credentials committed
- [ ] User input is validated/sanitized
- [ ] API routes check authentication
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CORS configured correctly
- [ ] Rate limiting considered

## Performance Considerations

<!-- Any performance impacts to be aware of? -->

- [ ] N/A - No significant performance impact
- [ ] Bundle size impact assessed
- [ ] Database query performance tested
- [ ] API response time measured
- [ ] Images optimized (using Next.js Image component)
- [ ] Async patterns properly implemented

## Documentation

<!-- Documentation updates -->

- [ ] Code comments added for complex logic
- [ ] README updated if needed
- [ ] API documentation updated if needed
- [ ] WEEKLY_FOCUS.md updated if needed
- [ ] Migration guide provided for breaking changes

## Deployment Notes

<!-- Special considerations for deployment -->

- [ ] No special deployment steps required
- [ ] Environment variables need to be added (list below)
- [ ] Database migration will run automatically
- [ ] Requires Vercel configuration changes
- [ ] Requires manual intervention (explain below)

### Environment Variables Needed

<!-- If any environment variables need to be added -->

```bash
# Example:
# NEW_API_KEY=xxx
```

### Post-Deployment Verification

<!-- How to verify this works in production -->

1.
2.
3.

## Breaking Changes

<!-- If this introduces breaking changes, describe the impact and migration path -->

- [ ] N/A - No breaking changes
- [ ] Breaking changes documented below

### Impact

<!-- Describe what breaks and why -->

### Migration Path

<!-- How to migrate existing code/data -->

## Rollback Plan

<!-- How to rollback if this PR causes issues in production -->

- [ ] Standard rollback (revert commit)
- [ ] Requires database rollback (explain below)
- [ ] Requires manual intervention (explain below)

## Screenshots/Videos

<!-- If this PR includes UI changes, add screenshots or videos -->

### Before

<!-- Screenshot/video of before state -->

### After

<!-- Screenshot/video of after state -->

## Additional Notes

<!-- Any additional context or notes for reviewers -->

## Checklist

<!-- Final checklist before marking ready for review -->

- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No console.log or debug code left in
- [ ] Commit messages follow convention (`feat:`, `fix:`, `chore:`, etc.)
- [ ] Branch is up to date with main
- [ ] Ready for CodeRabbit review
- [ ] Ready for human review

---

<!-- CodeRabbit will review this PR automatically. Address any issues it finds. -->
<!-- Once CodeRabbit and CI approve, this PR will auto-merge if branch protection allows. -->
