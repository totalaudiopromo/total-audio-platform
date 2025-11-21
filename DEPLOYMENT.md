# Deployment Guide - Total Audio Platform

**Last Updated**: 2025-11-02
**Phase**: 6 - Deployment Hardening Complete
**Apps**: Audio Intel, Tracker, Pitch Generator

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Workflows](#deployment-workflows)
5. [Rollback Procedures](#rollback-procedures)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Total Audio Platform consists of three Next.js applications deployed on Vercel:

- **Audio Intel** (`apps/audio-intel`) - Contact enrichment SaaS (PRIMARY REVENUE PRODUCT)
- **Campaign Tracker** (`apps/tracker`) - Radio submission tracking CRM
- **Pitch Generator** (`apps/pitch-generator`) - Personalised pitch email generation

### Deployment Architecture

```
GitHub Repository (main branch)
        ↓
GitHub Actions CI/CD
        ↓
Vercel Edge Network
        ↓
Production Apps + Supabase Database
```

---

## Pre-Deployment Checklist

Before deploying any app to production, verify:

### Code Quality

- [ ] All tests pass (`pnpm run test`)
- [ ] TypeScript type check passes (`pnpm run typecheck`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] All three apps build successfully (`pnpm run build:all`)

### Environment Variables

- [ ] All required env vars configured in Vercel
- [ ] Secrets rotated if necessary (Stripe keys, API keys)
- [ ] Database migrations applied to production
- [ ] Environment validation passes (`validateEnv()`)

### Database

- [ ] Backup created (automatic daily backups via GitHub Actions)
- [ ] Migrations tested in staging environment
- [ ] RLS policies reviewed and tested
- [ ] Database performance verified (no slow queries)

### Features

- [ ] Feature flags configured correctly for production
- [ ] Payment processing tested (Stripe webhooks working)
- [ ] Contact enrichment API quota verified (Perplexity)
- [ ] Email sending tested (Gmail integration)

---

## Environment Configuration

### Required Environment Variables

#### Supabase (All Apps)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  # Public anon key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...     # Server-side only
```

#### Audio Intel Specific

```bash
# Stripe payment processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Perplexity API (contact enrichment)
PERPLEXITY_API_KEY=pplx-...

# Application URL
NEXT_PUBLIC_APP_URL=https://intel.totalaudiopromo.com
```

#### Pitch Generator Specific

```bash
# Gmail OAuth integration
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# NextAuth configuration
NEXTAUTH_SECRET=...  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://pitch.totalaudiopromo.com
```

#### Feature Flags (Optional)

```bash
FEATURE_METRICS_ENABLED=true
FEATURE_ANALYTICS_ENABLED=true
FEATURE_PAYMENTS_ENABLED=true
```

### Vercel Configuration

**Set environment variables in Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add variables for `Production`, `Preview`, and `Development` environments
3. Ensure secrets are marked as "Encrypted"
4. Test in Preview deployment before promoting to Production

---

## Deployment Workflows

### Automatic Deployments (GitHub Actions)

**Triggers:**

- Push to `main` branch → Preview deployment
- Push to `production` branch → Production deployment
- Manual workflow dispatch → Custom environment

**Workflows:**

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on all pushes and PRs
   - Lints, typechecks, tests, and builds all apps
   - Uploads build artifacts
   - Runs security scan

2. **Per-App Deployment Workflows**
   - `deploy-audio-intel.yml` - Audio Intel deployment
   - `deploy-tracker.yml` - Tracker deployment
   - `deploy-pitch-generator.yml` - Pitch Generator deployment
   - Only trigger when app-specific files change
   - Deploy to Vercel with proper environment variables

3. **Supabase Backup Workflow** (`.github/workflows/supabase-backup.yml`)
   - Runs daily at 2:00 AM UTC
   - Exports schema, data, and roles
   - Retains backups for 30 days
   - Verifies backup integrity

### Manual Deployments (Vercel CLI)

For emergency deployments or hotfixes:

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy to preview
cd apps/audio-intel
vercel

# Deploy to production
vercel --prod
```

---

## Rollback Procedures

### Application Rollback (Vercel)

**Option 1: Vercel Dashboard**

1. Go to Deployments tab in Vercel dashboard
2. Find previous successful deployment
3. Click "Promote to Production"
4. Monitor deployment status

**Option 2: Git Revert**

```bash
# Revert problematic commit
git revert <commit-hash>
git push origin production

# Or reset to previous tag
git reset --hard v2.0.0-coredb-migration-complete
git push origin production --force
```

### Database Rollback (Supabase)

**Download backup from GitHub Actions:**

1. Go to Actions → Supabase Database Backup
2. Download backup artifact from desired date
3. Extract archive: `tar -xzf backup-YYYY-MM-DD_HH-MM-SS.tar.gz`

**Restore database:**

```bash
# Connect to Supabase project
supabase login
supabase link --project-id ucncbighzqudaszewjrv

# Restore schema
psql $DATABASE_URL < backups/YYYY-MM-DD_HH-MM-SS/schema.sql

# Restore data (WARNING: This will overwrite existing data)
psql $DATABASE_URL < backups/YYYY-MM-DD_HH-MM-SS/data.sql

# Restore roles and permissions
psql $DATABASE_URL < backups/YYYY-MM-DD_HH-MM-SS/roles.sql
```

**IMPORTANT:** Always test database restoration in a staging environment first.

---

## Post-Deployment Verification

### Automated Checks (Run after every deployment)

```bash
# 1. Verify all apps are accessible
curl -I https://intel.totalaudiopromo.com
curl -I https://tracker.totalaudiopromo.com
curl -I https://pitch.totalaudiopromo.com

# 2. Check health endpoints (if implemented)
curl https://intel.totalaudiopromo.com/api/health

# 3. Verify database connectivity
# (Test login to each app)
```

### Manual Verification Checklist

- [ ] Homepage loads correctly
- [ ] User authentication works (sign in/sign out)
- [ ] Core feature works (contact enrichment for Audio Intel)
- [ ] Payment flow works (Stripe checkout)
- [ ] Database queries execute successfully
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design intact
- [ ] API rate limits not exceeded

### Monitor for Issues

**Key Metrics to Watch (first 1 hour):**

- Error rate < 1%
- Response time < 2 seconds (p95)
- Database connection pool healthy
- No 5xx errors in logs

**Tools:**

- Vercel Analytics Dashboard
- Supabase Database Logs
- Stripe Webhook Logs (for payment events)

---

## Troubleshooting

### Common Deployment Issues

#### Build Failures

**Symptom:** "Build failed" in GitHub Actions or Vercel

**Solutions:**

1. Check build logs for TypeScript errors
2. Verify all dependencies installed (`pnpm install`)
3. Ensure environment variables set correctly
4. Clear Next.js cache: `rm -rf .next`

#### Database Connection Errors

**Symptom:** "Failed to connect to Supabase" in production

**Solutions:**

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
2. Check Supabase project status (not paused)
3. Verify RLS policies allow required operations
4. Check database connection limits (max 60 connections)

#### Stripe Webhook Failures

**Symptom:** Payments succeed but subscriptions not updated

**Solutions:**

1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. Check webhook endpoint URL in Stripe dashboard
3. Test webhook delivery in Stripe dashboard
4. Ensure `/api/webhooks/stripe` route is accessible

#### Environment Variable Issues

**Symptom:** "Environment validation failed" error

**Solutions:**

1. Run `validateEnv()` locally to identify missing vars
2. Check Vercel dashboard for correct environment variables
3. Ensure preview/production environments configured separately
4. Regenerate secrets if compromised

### Emergency Contacts

- **DevOps Lead**: Chris Schofield
- **Database Admin**: Supabase Support
- **Payment Issues**: Stripe Support
- **Hosting Issues**: Vercel Support

### Incident Response

For production incidents, follow [INCIDENTS.md](./INCIDENTS.md) procedures.

---

## Deployment Timeline

### Typical Deployment Duration

| Stage                    | Duration         | Notes                        |
| ------------------------ | ---------------- | ---------------------------- |
| CI Pipeline              | 5-8 minutes      | Lint, typecheck, test, build |
| Vercel Build             | 2-4 minutes      | Per app                      |
| Edge Network Propagation | 1-2 minutes      | Global CDN update            |
| **Total**                | **8-14 minutes** | From push to live            |

### Maintenance Windows

- **Scheduled Maintenance**: Sundays 2:00-4:00 AM GMT
- **Emergency Deployments**: Anytime (with stakeholder notification)

---

## Version Management

**Git Tags:**

- Use semantic versioning: `v2.1.0`, `v2.1.1`, etc.
- Tag format: `v{major}.{minor}.{patch}-{phase}-{status}`
- Example: `v2.1.0-phase6-complete`

**Changesets:**

- Use `@changesets/cli` for version bumping
- Generate changelogs automatically
- See [Changesets documentation](https://github.com/changesets/changesets)

---

## Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs/deployments)
- [Supabase Production Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Last Deployment:** Check Vercel dashboard for timestamp
**Next Scheduled Deployment:** Based on feature completion
**Deployment Frequency:** 2-3 times per week (development phase)
