# Phase 9E: Golden Deployment Pipeline

**Status**: Implemented
**Version**: v2.5.0-phase9e-golden-pipeline
**Date**: November 2025

## Overview

The Golden Deployment Pipeline provides a unified, monitored, and rollback-safe release process for all Total Audio Platform apps (Audio Intel, Tracker, Pitch Generator, Command Centre).

### Key Features

- **Automated Health Checks**: Verifies database connectivity, API endpoints, and external services
- **Lighthouse Audits**: Ensures performance, accessibility, and SEO standards
- **Telegram Notifications**: Real-time deployment status updates
- **Vercel Promotion**: Automated preview → production promotion
- **Multi-App Support**: Single workflow handles all four production apps

## Architecture

```
Golden Deployment Workflow
├── Build & Test (Parallel)
│   ├── Build each app
│   ├── Run golden-check.ts
│   ├── Run Lighthouse audit
│   └── Send Telegram notification
└── Promote (Sequential)
    ├── Promote preview deployments
    └── Send final notification
```

## Trigger Instructions

### Manual Trigger via Git Tag

```bash
# Create and push a golden tag
git tag v2.5.1-golden
git push --tags

# The workflow will automatically start
```

### Manual Trigger via GitHub UI

1. Go to **Actions** → **Golden Deployment Pipeline**
2. Click **Run workflow**
3. Select branch and click **Run**

## Health Check System

The `golden-check.ts` script verifies:

### Database Checks

- ✅ Supabase connectivity
- ✅ `agent_events` table exists and accessible
- ✅ `feedback_events` table exists and accessible
- ✅ `conversion_events` table exists and accessible
- ✅ `get_agent_metrics` RPC function (optional)

### API Endpoint Checks

- ✅ `/api/health` responds with 200
- ✅ `/api/ops-console/agents` (Command Centre only)
- ✅ `/api/ops-console/feedback` (Command Centre only)

### External Service Checks

- ✅ Telegram Bot API reachable
- ✅ Plausible Analytics reachable

## Lighthouse Budget

Performance thresholds defined in `.lighthouse/budget.json`:

```json
{
  "performance": 90,
  "accessibility": 95,
  "best-practices": 95,
  "seo": 90
}
```

**Policy**: Any app scoring below these thresholds will fail the build and prevent promotion.

## Required Environment Variables

### GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Vercel
VERCEL_TOKEN=xxx  # Create at https://vercel.com/account/tokens
VERCEL_PROJECT_ID=prj_xxx

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdef...  # From @BotFather
TELEGRAM_CHAT_ID=-1001234567890  # Your chat ID
```

### How to Get Telegram Credentials

1. **Create Bot**:

   ```
   Message @BotFather on Telegram
   Send: /newbot
   Follow prompts to get your TELEGRAM_BOT_TOKEN
   ```

2. **Get Chat ID**:
   ```
   Add bot to your channel/group
   Send a message
   Visit: https://api.telegram.org/bot<TOKEN>/getUpdates
   Look for "chat":{"id": -1001234567890}
   ```

## Telegram Notification Examples

### During Build & Test

```
Golden check for audio-intel completed with status success
Golden check for tracker completed with status success
Golden check for pitch-generator completed with status success
Golden check for command-centre completed with status success
```

### During Promotion

```
✅ audio-intel: Promoted to production (audio-intel-abc123.vercel.app)
✅ tracker: Promoted to production (tracker-def456.vercel.app)
✅ pitch-generator: Promoted to production (pitch-generator-ghi789.vercel.app)
✅ command-centre: Promoted to production (command-centre-jkl012.vercel.app)
```

### Final Success

```
✅ Golden Deployment successful and promoted to production!
```

### Failure Examples

```
❌ audio-intel: Lighthouse score below threshold (Performance: 85)
❌ tracker: Health check failed - Database connectivity error
❌ Golden Deployment: Some apps failed to promote
```

## Rollback Instructions

### Option 1: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select the affected project (e.g., `audio-intel`)
3. Click **Deployments**
4. Find the previous working deployment
5. Click **⋮** → **Promote to Production**

### Option 2: Vercel CLI

```bash
# List recent deployments
vercel ls audio-intel

# Promote a specific deployment
vercel promote <deployment-url> --yes
```

### Option 3: Git Revert

```bash
# Revert the problematic commit
git revert <commit-hash>
git push origin main

# Create new golden tag
git tag v2.5.2-golden
git push --tags
```

## Audit Log Retention Policy

### Lighthouse Reports

- **Storage**: GitHub Actions artifacts
- **Retention**: 90 days (GitHub default)
- **Access**: Actions → Workflow run → Artifacts section

### Health Check Logs

- **Storage**: GitHub Actions logs
- **Retention**: 90 days (GitHub default)
- **Access**: Actions → Workflow run → Build & Test job logs

### Vercel Deployment History

- **Storage**: Vercel dashboard
- **Retention**: Unlimited (Vercel preserves all deployments)
- **Access**: https://vercel.com/<team>/<project>/deployments

## Workflow Customisation

### Adding New Apps

Edit `.github/workflows/golden-deploy.yml`:

```yaml
strategy:
  matrix:
    app: [audio-intel, tracker, pitch-generator, command-centre, new-app]
```

Edit `scripts/golden-check.ts`:

```typescript
const APP_URLS: Record<string, string> = {
  // ... existing apps
  'new-app': 'https://new-app.totalaudiopromo.com',
};
```

Edit `scripts/golden-promote.ts`:

```typescript
const APP_PROJECTS: Record<string, string> = {
  // ... existing apps
  'new-app': 'new-app',
};
```

### Adjusting Lighthouse Thresholds

Edit `.lighthouse/budget.json`:

```json
{
  "performance": 85, // Lower threshold
  "accessibility": 100, // Higher threshold
  "best-practices": 95,
  "seo": 90
}
```

### Adding Custom Health Checks

Edit `scripts/golden-check.ts` and add to `runGoldenCheck()`:

```typescript
// Add custom check
checks.push(await checkCustomEndpoint(app));
```

## Performance Expectations

### Build Times (Parallel)

- Audio Intel: ~2-3 minutes
- Tracker: ~2-3 minutes
- Pitch Generator: ~2-3 minutes
- Command Centre: ~2-3 minutes

### Health Check Times

- Supabase checks: ~500ms
- API endpoint checks: ~1-2 seconds
- External service checks: ~500ms
- **Total**: ~3-5 seconds per app

### Lighthouse Audit Times

- Per app: ~30-60 seconds
- **Total (parallel)**: ~60 seconds

### Promotion Times

- Per app: ~5-10 seconds
- **Total (sequential)**: ~30 seconds

### End-to-End Pipeline

- **Expected**: 5-8 minutes
- **Maximum**: 15 minutes (includes retries)

## Troubleshooting

### Health Check Failures

**Symptom**: `Supabase Connectivity: Connection failed`

**Solution**:

```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test connection manually
curl https://ucncbighzqudaszewjrv.supabase.co/rest/v1/agent_events?limit=1 \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"
```

### Lighthouse Failures

**Symptom**: `Lighthouse score below threshold (Performance: 85)`

**Solution**:

1. Run Lighthouse locally: `npm run lighthouse`
2. Check Vercel deployment logs for build issues
3. Review performance recommendations
4. Temporarily lower threshold in `.lighthouse/budget.json` if justified

### Promotion Failures

**Symptom**: `No preview deployment found`

**Solution**:

```bash
# Check if preview deployment exists
vercel ls audio-intel

# If missing, trigger preview deployment
vercel deploy audio-intel
```

**Symptom**: `Promotion failed`

**Solution**:

1. Check Vercel token is valid
2. Verify project ID matches
3. Check deployment is in READY state
4. Review Vercel dashboard for deployment errors

### Telegram Notification Failures

**Symptom**: No Telegram messages received

**Solution**:

```bash
# Test Telegram bot manually
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  -d "chat_id=$TELEGRAM_CHAT_ID" \
  -d "text=Test message"

# Verify bot is added to channel/group
# Verify bot has permission to send messages
```

## Security Considerations

### Token Rotation

Rotate these tokens every 90 days:

- `VERCEL_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY` (only if compromised)

### Deployment Approval

For production deployments requiring human approval:

1. Edit `.github/workflows/golden-deploy.yml`
2. Add `environment` to promote job:

```yaml
promote:
  needs: build-and-test
  environment: production # Requires GitHub environment approval
  runs-on: ubuntu-latest
  # ...
```

3. Configure approval in **Settings → Environments → production**

## Future Enhancements

### Planned (Phase 10)

- [ ] Automated rollback on error detection
- [ ] Performance regression detection
- [ ] Database migration verification
- [ ] Canary deployments (10% → 50% → 100%)
- [ ] Slack integration alongside Telegram
- [ ] Detailed HTML reports uploaded to S3

### Under Consideration

- [ ] Visual regression testing (Percy/Chromatic)
- [ ] Load testing integration
- [ ] Security scanning (OWASP ZAP)
- [ ] Cost tracking per deployment

## Support

### Resources

- **Vercel Docs**: https://vercel.com/docs/rest-api
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **GitHub Actions**: https://docs.github.com/en/actions

### Internal Documentation

- [Phase 9B: Agent Observability](./PHASE_9B_AGENT_OBSERVABILITY.md)
- [Phase 9D2: Deployment Fix](./PHASE_9D2_IMPLEMENTATION_REPORT.md)
- [Supabase Schema](../packages/core-db/supabase/migrations/)

---

**Last Updated**: November 2025
**Maintained By**: Total Audio Platform Team
**Status**: Production Ready ✅
