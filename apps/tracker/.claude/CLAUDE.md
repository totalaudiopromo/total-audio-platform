# TRACKER APP - CLAUDE INSTRUCTIONS

## CURRENT DEPLOYMENT SITUATION (October 2025)

### GitHub Actions Budget Issue

**Status**: Free tier Actions quota exhausted (100% of 2,000 minutes used)
**Impact**: All GitHub Actions workflows cancel automatically
**Consequence**: CI checks remain red, automated Vercel deploys blocked

### Workaround Until GitHub Pro Subscription

**DO NOT rely on GitHub Actions**- deploy manually instead:

```bash
# Navigate to Tracker app
cd apps/tracker

# Preview deployment (staging)
vercel

# Production deployment
vercel --prod
```

### Rollback Strategy

- **Vercel Dashboard**: Every build is stored, can rollback via UI
- **CLI Rollback**: `vercel rollback <deployment-url>`
- **Git History**: Separate from Vercel deployments, tracks code changes independently

### When GitHub Pro is Available

- Re-enable GitHub Actions workflows
- Resume automated CI/CD pipeline
- Configure new minute quota monitoring

---

## TRACKER APP CONTEXT

**Purpose**: Campaign tracking and analytics tool
**Live Site**: https://tracker.totalaudiopromo.com
**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Vercel

### Development Commands

```bash
# Development
npm run dev:tracker           # Start dev server
npm run build:tracker         # Production build
npm run typecheck:tracker     # TypeScript validation
npm run lint:tracker          # Code quality checks

# Testing
npm run test:tracker          # Run tests
npm run test:mobile           # Mobile test suite
```

### Deployment Commands (CURRENT WORKFLOW)

```bash
# Manual deployment (use until GitHub Pro)
cd apps/tracker
vercel                        # Preview/staging
vercel --prod                 # Production

# Check deployment status
vercel ls                     # List deployments
vercel inspect <url>          # Deployment details
```

---

**Last Updated**: October 2025
**Deployment Method**: Manual Vercel CLI (GitHub Actions quota exhausted)
**Next Review**: When GitHub Pro subscription active
