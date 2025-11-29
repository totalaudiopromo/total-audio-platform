# Audio Intel - Claude Development Notes

## Repository Architecture

**Audio Intel has its own separate GitHub repository**and is NOT part of the main monorepo's CI/CD pipeline.

### Key Details:

- **Repository**: `totalaudiopromo/audio-intel`
- **Remote URL**: `https://github.com/totalaudiopromo/audio-intel.git`
- **Deployment**: Vercel automatic deployment on push to main branch
- **CI/CD**: Dedicated GitHub Actions workflow (`.github/workflows/ci-cd.yml`)
- **Configuration**: Uses `vercel.json` + GitHub Actions for testing and deployment

## Deployment Process

### Correct Workflow:

1. Make changes in `/apps/audio-intel/` directory
2. Commit changes locally
3. **Push to Audio Intel repository**: `git push origin main`
4. GitHub Actions runs tests, linting, and builds
5. Vercel automatically deploys to `https://intel.totalaudiopromo.com`

### Common Mistake:

- **DON'T**push Audio Intel changes to the monorepo (`total-audio-platform`)
- **DON'T**expect Audio Intel to deploy via the main monorepo's CI/CD pipeline

## Repository Setup

### Verify Correct Remote:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
git remote -v
# Should show: origin https://github.com/totalaudiopromo/audio-intel.git
```

### If Remote is Wrong:

```bash
git remote set-url origin https://github.com/totalaudiopromo/audio-intel.git
```

## Development Checklist

- [ ] Changes made in `/apps/audio-intel/` directory
- [ ] Committed locally with descriptive message
- [ ] Pushed to Audio Intel repository (not monorepo)
- [ ] Verified deployment at `https://intel.totalaudiopromo.com`
- [ ] Checked that changes are live (not cached)

## Troubleshooting

### If Deployment Doesn't Work:

1. Check Vercel dashboard for build logs
2. Verify environment variables are set in Vercel
3. Ensure `vercel.json` configuration is correct
4. Check that changes were pushed to the correct repository

### If Changes Don't Appear:

1. Wait 2-3 minutes for Vercel deployment
2. Check for browser caching issues
3. Verify the correct branch was pushed
4. Check Vercel deployment logs

## Notes

- Audio Intel is intentionally separate from the main platform
- This allows independent development and deployment cycles
- The monorepo contains other apps (tracker, pitch-generator, web) but not audio-intel
- Always push Audio Intel changes to its own repository for deployment

---

_Last Updated: January 2025_
_Repository: totalaudiopromo/audio-intel_
