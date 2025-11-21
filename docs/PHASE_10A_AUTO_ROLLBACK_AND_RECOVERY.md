# Phase 10A: Auto-Rollback & Recovery Setup

**Status**: Implemented  
**Version**: v2.6.0-phase10a-intelligence  
**Date**: January 2025

## Overview

Phase 10A adds **Golden Intelligence** — an automated post-deployment validation and rollback system that ensures production deployments meet quality standards. If any health checks fail after a Golden deployment, the system automatically rolls back to the previous stable version.

### Key Features

- **Post-Deployment Health Checks**: Validates all production health endpoints
- **Lighthouse Budget Validation**: Ensures performance thresholds are met
- **Automatic Rollback**: Reverts to previous deployment if checks fail
- **Telegram Notifications**: Real-time alerts for post-check and rollback status
- **Comprehensive Reporting**: JSON reports saved for audit trail

---

## Architecture

```
Golden Deployment Pipeline
 Build & Test (golden-deploy.yml)
    [Deploys to production]

 Golden Intelligence (golden-intelligence.yml)
     Post-Check (golden-postcheck.ts)
        Health endpoint validation
        Lighthouse budget validation
        Generate report
    
     Auto-Rollback (golden-rollback.ts) [if post-check fails]
         Find previous production deployment
         Promote previous deployment
         Generate rollback report
```

---

## Workflow Trigger

The Golden Intelligence workflow runs **automatically** after the Golden Deployment Pipeline completes:

1. **Golden Deployment Pipeline** finishes (success or failure)
2. **Golden Intelligence** workflow triggers automatically
3. **Post-Check** runs health endpoint validation
4. **If post-check fails** → **Rollback** runs automatically
5. **Telegram notifications** sent at each step

### Manual Trigger

You can also run post-checks manually:

```bash
# Check all apps
pnpm tsx scripts/golden-postcheck.ts

# Check single app
pnpm tsx scripts/golden-postcheck.ts --app audio-intel
```

---

## Health Endpoint Validation

The post-check script validates these production endpoints:

- `https://intel.totalaudiopromo.com/api/health` (audio-intel)
- `https://tracker.totalaudiopromo.com/api/health`
- `https://pitch.totalaudiopromo.com/api/health` (pitch-generator)
- `https://totalaudiopromo.com/api/health` (web)

**Requirements**:

- Each endpoint must return HTTP 200
- Response time must be < 10 seconds
- JSON response must be valid

---

## Lighthouse Budget Validation

The post-check validates `.lighthouse/budget.json` structure:

```json
{
  "timings": [
    { "metric": "first-contentful-paint", "budget": 2000 },
    { "metric": "largest-contentful-paint", "budget": 3000 }
  ],
  "resourceSizes": [{ "resourceType": "script", "budget": 300 }],
  "resourceCounts": [{ "resourceType": "script", "budget": 10 }]
}
```

**Note**: Actual Lighthouse audits are run separately (if enabled). This validation ensures the budget file structure is correct.

---

## Rollback Process

If post-check fails, the rollback script:

1. **Fetches recent deployments** from Vercel API
2. **Identifies current production deployment**
3. **Finds previous READY production deployment**
4. **Promotes previous deployment** back to production
5. **Sends Telegram notification** with rollback details

**Rollback Criteria**:

- Only rolls back if a previous production deployment exists
- Only promotes deployments with `state: 'READY'` and `target: 'production'`
- Skips rollback if no previous deployment found (logs warning)

---

## Telegram Notifications

### Post-Check Success

```
Golden Post-Check PASSED

Apps checked: 4
Duration: 2.3s
All health endpoints responding correctly.
```

### Post-Check Failure

```
 Golden Post-Check FAILED

Failed apps: audio-intel, tracker
Duration: 5.1s
Rollback will be triggered automatically.
```

### Rollback Success

```
Golden Deploy Rollback Complete

Version: v2.6.0-phase10a-intelligence → v2.5.9-phase10a-intelligence
Apps rolled back: 4/4
Duration: 12.4s
```

### Rollback Failure

```
 Golden Deploy Rollback Failed

All rollbacks failed.
Manual intervention required.
```

---

## Manual Rollback

If you need to trigger rollback manually:

```bash
# Run rollback script directly
pnpm tsx scripts/golden-rollback.ts
```

**Required Environment Variables**:

- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID_AUDIO_INTEL`
- `VERCEL_PROJECT_ID_TRACKER`
- `VERCEL_PROJECT_ID_PITCH_GENERATOR`
- `VERCEL_PROJECT_ID_WEB`
- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional)

---

## Reports

### Post-Check Reports

Location: `reports/golden/postcheck/<timestamp>.json`

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "overall": "pass",
  "duration": 2341,
  "healthChecks": [
    {
      "app": "audio-intel",
      "url": "https://audio-intel.totalaudiopromo.com/api/health",
      "status": "pass",
      "httpStatus": 200,
      "responseTime": 234,
      "message": "Health check passed (234ms)"
    }
  ],
  "lighthouseValidation": {
    "status": "pass",
    "message": "Lighthouse budget.json validated successfully"
  }
}
```

### Rollback Reports

Location: `reports/golden/rollback/<timestamp>.json`

```json
{
  "timestamp": "2025-01-15T10:35:00.000Z",
  "overall": "success",
  "duration": 12456,
  "results": [
    {
      "app": "audio-intel",
      "projectId": "prj_xxx",
      "previousDeploymentId": "dpl_xxx",
      "previousDeploymentUrl": "https://audio-intel-xxx.vercel.app",
      "currentDeploymentId": "dpl_yyy",
      "status": "success",
      "message": "Rolled back to https://audio-intel-xxx.vercel.app",
      "duration": 3123
    }
  ]
}
```

---

## Troubleshooting

### Post-Check Fails Immediately

**Symptom**: Post-check fails with connection errors

**Solutions**:

1. Verify health endpoints are accessible from GitHub Actions runner
2. Check if apps are actually deployed to production
3. Verify DNS is resolving correctly
4. Check Vercel deployment status

### Rollback Finds No Previous Deployment

**Symptom**: Rollback reports "No previous production deployment found"

**Solutions**:

1. This is normal for first deployment — no rollback target exists
2. Check Vercel dashboard for deployment history
3. Verify deployments have `target: 'production'` set

### Rollback Promotion Fails

**Symptom**: Rollback script fails with API error

**Solutions**:

1. Verify `VERCEL_TOKEN` is valid and has deployment permissions
2. Check Vercel API rate limits (wait 60 seconds and retry)
3. Verify project IDs are correct
4. Check Vercel dashboard for deployment status

### Telegram Notifications Not Sending

**Symptom**: No Telegram messages received

**Solutions**:

1. Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in GitHub Secrets
2. Check Telegram bot is active and has permission to send messages
3. Verify chat ID is correct (use @userinfobot on Telegram to get your chat ID)

---

## Environment Variables

### GitHub Secrets (Required)

```bash
# Vercel API
VERCEL_TOKEN
VERCEL_PROJECT_ID_AUDIO_INTEL
VERCEL_PROJECT_ID_TRACKER
VERCEL_PROJECT_ID_PITCH_GENERATOR
VERCEL_PROJECT_ID_WEB

# Supabase (for health checks)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Telegram (for notifications)
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

### Vercel Environment Variables

Ensure all apps have these variables set in Vercel:

- `audio-intel` project
- `tracker` project
- `pitch-generator` project
- `web` project

**Required for each app**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- (App-specific variables as needed)

---

## Testing Locally

### Test Post-Check

```bash
# Check all apps
pnpm tsx scripts/golden-postcheck.ts

# Check single app
pnpm tsx scripts/golden-postcheck.ts --app audio-intel
```

**Required Environment Variables**:

- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional)

### Test Rollback (Dry Run)

 **Warning**: Rollback script will actually promote deployments. Use with caution.

```bash
# Set environment variables first
export VERCEL_TOKEN="your-token"
export VERCEL_PROJECT_ID_AUDIO_INTEL="prj_xxx"
# ... etc

# Run rollback
pnpm tsx scripts/golden-rollback.ts
```

---

## Integration with Golden Deployment

The Golden Intelligence workflow integrates seamlessly with the existing Golden Deployment Pipeline:

1. **Golden Deployment** (`golden-deploy.yml`) completes
2. **Golden Intelligence** (`golden-intelligence.yml`) triggers automatically
3. **Post-Check** validates production deployments
4. **If checks pass** → Deployment is confirmed successful
5. **If checks fail** → Automatic rollback to previous version

**No manual intervention required** — the system handles everything automatically.

---

## Future Enhancements

Potential improvements for future phases:

- [ ] Lighthouse CI integration for actual performance audits
- [ ] Synthetic monitoring (e.g., Checkly, UptimeRobot)
- [ ] Database connectivity checks in post-check
- [ ] Custom health check endpoints per app
- [ ] Rollback confirmation before execution (optional)
- [ ] Slack integration alongside Telegram

---

## Related Documentation

- [Phase 9E: Golden Deployment Pipeline](./PHASE_9E_GOLDEN_DEPLOYMENT.md)
- [Golden Deployment Checklist](../GOLDEN_DEPLOY_CHECKLIST.md)
- [Vercel Monorepo Setup](./VERCEL_MONOREPO_SETUP.md)

---

## Support

If you encounter issues:

1. Check GitHub Actions logs for detailed error messages
2. Review post-check and rollback reports in `reports/golden/`
3. Verify all environment variables are set correctly
4. Check Vercel dashboard for deployment status

For questions or issues, refer to the troubleshooting section above.
