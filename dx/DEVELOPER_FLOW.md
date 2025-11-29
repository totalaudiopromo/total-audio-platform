# Developer Flow Guide

## Overview

This guide explains the complete developer workflow for Total Audio Platform, from writing code to production deployment.

**The Golden Rule**: Code → PR → Review → Deploy → Verify (all automated)

## Table of Contents

1. [Development Tools](#development-tools)
2. [Daily Workflow](#daily-workflow)
3. [Creating Features](#creating-features)
4. [Pull Request Process](#pull-request-process)
5. [Deployment Pipeline](#deployment-pipeline)
6. [Monitoring & Verification](#monitoring--verification)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Development Tools

### Primary Tools

**Cursor**(or VS Code with Claude integration)

- Primary code editor
- AI-powered code completion
- Integrated terminal

**Claude Code**

- AI development assistant
- Project-aware context
- Task automation via `.claude/` configuration

**Playwright**

- End-to-end testing
- Mobile testing suite
- Component validation

**pnpm**

- Package manager
- Monorepo workspace management
- Fast, efficient installs

### Tool Setup

```bash
# Clone repository
git clone https://github.com/totalaudiopromo/total-audio-platform.git
cd total-audio-platform

# Install dependencies
pnpm install

# Verify setup
pnpm run typecheck
pnpm run lint
pnpm run test
```

---

## Daily Workflow

### Starting Development

```bash
# 1. Ensure you're on main and up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start development server
pnpm run dev:audio-intel    # or dev:tracker, dev:pitch-generator
```

### While Coding

```bash
# Run tests frequently
pnpm run test:audio-intel

# Check TypeScript errors
pnpm run typecheck:audio-intel

# Lint code
pnpm run lint:audio-intel
```

### Before Committing

```bash
# 1. Run all checks locally
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build:audio-intel  # Build to verify it compiles

# 2. Commit with conventional commit format
git add .
git commit -m "feat: add new feature description"

# 3. Push to remote
git push -u origin feature/your-feature-name
```

---

## Creating Features

### Feature Branch Naming

Use descriptive branch names with prefixes:

```bash
feature/add-user-dashboard      # New features
bugfix/fix-login-error          # Bug fixes
refactor/improve-api-routes     # Code improvements
docs/update-readme              # Documentation
test/add-mobile-tests           # Testing
chore/update-dependencies       # Maintenance
```

### Commit Message Format

Follow conventional commits:

```bash
feat: add user dashboard with analytics
fix: resolve login error for expired sessions
refactor: improve API route error handling
docs: update README with new setup instructions
test: add mobile tests for touch targets
chore: update dependencies to latest versions
```

**Format**: `<type>: <description>`

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code improvement without functionality change
- `docs`: Documentation only
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvement
- `style`: Code style changes (formatting, etc.)

### Monorepo Structure

**Apps**(independent applications):

```
apps/
 audio-intel/         # Contact enrichment (primary revenue)
 tracker/             # Campaign tracking CRM
 pitch-generator/     # Pitch generation tool
 web/                 # Marketing website
```

**Packages**(shared code):

```
packages/
 ui/                  # Shared UI components
 testing/             # Shared testing utilities
 config/              # Shared configuration
```

**Important Rules**:

-  Apps MUST NOT import from other apps
-  Apps CAN import from packages
-  Shared code goes in packages

**Example**:

```typescript
//  WRONG - cross-app import
import { UserProfile } from '../../../tracker/components/UserProfile';

//  CORRECT - use shared package
import { UserProfile } from '@total-audio/ui';
```

---

## Pull Request Process

### Creating a PR

#### Option 1: GitHub CLI (Recommended)

```bash
# After pushing your branch
gh pr create --title "feat: Your feature description" --body "
## Summary
Brief description of changes

## Changes Made
- Change 1
- Change 2

## Testing
- Tested locally
- All CI checks passed
"
```

#### Option 2: GitHub Web Interface

1. Push branch: `git push -u origin feature/your-feature`
2. Go to: `https://github.com/totalaudiopromo/total-audio-platform/pulls`
3. Click "New pull request"
4. Select your branch
5. Fill in PR template (auto-populated)
6. Click "Create pull request"

### PR Template

The template includes sections for:

- Summary and motivation
- Type of change
- Apps/packages affected
- Architecture compliance
- Testing results
- Security checklist
- Performance considerations
- Deployment notes

**Fill it out thoroughly**- it helps CodeRabbit and reviewers understand your changes.

### Enabling Auto-Merge

After creating PR:

1. Click "Enable auto-merge" button
2. Select merge method:
   - **Squash and merge**(recommended for feature branches)
   - **Rebase and merge**(for clean history)
   - **Create merge commit**(preserves all commits)

### What Happens Next

**Automated workflow**:

```
1. PR Created
   ↓
2. CodeRabbit Reviews (automatic)
    Architecture validation
    Security scanning
    Code quality checks
    Auto-approve (if no issues) OR Request changes
   ↓
3. CI Runs (automatic)
    Lint
    Typecheck
    Test
    Build
   ↓
4. Security Scan (automatic)
    Dependency audit
   ↓
5. Auto-Merge (if all pass)
   ↓
6. Branch Auto-Delete
   ↓
7. Vercel Auto-Deploy (all 3 apps)
   ↓
8. Golden Verify (post-deployment)
    Health checks for all apps
   ↓
9. Command Centre Ingestion
    Metrics to dashboard
   ↓
10. Telegram Notification (failures only)
```

**You only intervene if**:

- CodeRabbit finds issues (fix and push again)
- CI checks fail (fix and push again)
- Security vulnerabilities found (update dependencies)

---

## Deployment Pipeline

### Architecture (Phase 10B - Golden Verify)

```
Developer Push → CI (Validate) → Vercel (Deploy) → Golden Verify (Check)
```

### CI Workflow (Validation Only)

**File**: `.github/workflows/ci.yml`

**What it does**:

-  Lint all packages
-  Typecheck all packages
-  Run all tests
-  Build all apps (to verify they compile)
-  Does NOT deploy (that's Vercel's job)

**Triggers**:

- Push to `main` branch
- Pull request to `main` branch

### Vercel Deployment (Automatic)

**How it works**:

- Vercel GitHub App monitors `main` branch
- Automatic deployment on merge
- Deploys all 3 apps in parallel:
  - Audio Intel → https://intel.totalaudiopromo.com
  - Tracker → https://tracker.totalaudiopromo.com
  - Pitch Generator → https://pitch.totalaudiopromo.com

**No manual intervention needed**- Vercel handles everything.

### Golden Verify (Post-Deployment Checks)

**File**: `.github/workflows/golden-verify.yml`

**What it does**:

-  Health checks for all 3 apps
-  Validates deployments succeeded
-  Ingests metrics to Command Centre dashboard
-  Sends Telegram notifications (failures only)

**Triggers**:

- After Vercel deployment completes
- Hourly health checks (scheduled)
- Daily summary reports (scheduled)

### Manual Deployment (Emergency Only)

If you need to deploy manually:

```bash
# Audio Intel
cd apps/audio-intel
vercel --prod

# Tracker
cd apps/tracker
vercel --prod

# Pitch Generator
cd apps/pitch-generator
vercel --prod
```

**Warning**: Only use manual deployment in emergencies. Prefer the automatic pipeline.

---

## Monitoring & Verification

### Command Centre Dashboard

**Access**: https://command.totalaudiopromo.com (when deployed)

**Metrics available**:

- Deployment health status
- Test results across apps
- Component analysis findings
- Golden Verify history
- System performance

### Telegram Notifications

**Setup**: Telegram bot sends notifications to configured chat.

**Notification triggers**(failures only):

-  Golden Verify health check failed
-  CI workflow failed
-  Revenue audit failed
-  Agent health check failed

**No spam**: Successes are silent (check Command Centre for details).

### Vercel Logs

**Per-app dashboards**:

- Audio Intel: https://vercel.com/chris-projects-6ffe0e29/audio-intel
- Tracker: https://vercel.com/chris-projects-6ffe0e29/tracker-fresh
- Pitch Generator: https://vercel.com/chris-projects-6ffe0e29/pitch-generator

**What to check**:

- Build logs (if deployment failed)
- Runtime logs (if app errors occur)
- Analytics (traffic and performance)
- Environment variables (if secrets missing)

### Health Endpoints

**Check app health manually**:

```bash
# Audio Intel
curl https://intel.totalaudiopromo.com/api/health

# Tracker
curl https://tracker.totalaudiopromo.com/api/health

# Pitch Generator
curl https://pitch.totalaudiopromo.com/api/health
```

**Expected response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-11-13T12:00:00.000Z"
}
```

---

## Common Tasks

### Running Tests

```bash
# All apps
pnpm run test

# Specific app
pnpm run test:audio-intel
pnpm run test:tracker
pnpm run test:pitch-generator

# Mobile tests
cd apps/audio-intel && pnpm run test:mobile
cd apps/tracker && pnpm run test:mobile

# Watch mode
pnpm run test:audio-intel --watch

# UI mode (interactive)
pnpm run test:ui
```

### Using Testing Agents

The platform includes intelligent testing agents:

```bash
# Component Analyzer - finds UX issues
node tools/agents/active/testing/component-analyzer.js

# Test Generator - auto-generates tests
node tools/agents/active/testing/test-generator.js

# Cross-App Orchestrator - runs full pipeline
node tools/agents/active/testing/cross-app-orchestrator.js
```

### Building Apps

```bash
# Build all
pnpm run build:all

# Build specific app
pnpm run build:audio-intel
pnpm run build:tracker
pnpm run build:pitch-generator
pnpm run build:web
```

### Linting and Type Checking

```bash
# Lint
pnpm run lint              # Audio Intel only
pnpm run lint:all          # All packages
pnpm run lint:fix          # Auto-fix issues

# Typecheck
pnpm run typecheck         # Audio Intel only
pnpm run typecheck:all     # All packages
```

### Adding Dependencies

```bash
# Add to specific app
cd apps/audio-intel
pnpm add package-name

# Add to workspace root
pnpm add -w package-name

# Add to shared package
cd packages/ui
pnpm add package-name

# After adding dependencies, regenerate lockfile
pnpm install

# Commit both package.json and pnpm-lock.yaml
git add package.json pnpm-lock.yaml
git commit -m "chore: add package-name dependency"
```

**Important**: Always commit `pnpm-lock.yaml` with `package.json` changes. CI uses `--frozen-lockfile` and will fail if they're out of sync.

### Database Migrations

```bash
# Create new migration
cd apps/audio-intel
npx supabase migration new your-migration-name

# Edit migration file in supabase/migrations/

# Test locally (if Supabase CLI installed)
npx supabase db reset

# Push migration (production)
# Migrations auto-apply on deployment via Supabase dashboard
```

### Environment Variables

**Local development**:

```bash
# Copy example env files
cp apps/audio-intel/.env.example apps/audio-intel/.env.local
cp apps/tracker/.env.example apps/tracker/.env.local
cp apps/pitch-generator/.env.example apps/pitch-generator/.env.local

# Edit with your values
nano apps/audio-intel/.env.local
```

**Production**:

- Set in Vercel dashboard per project
- Set GitHub secrets for CI workflows
- Never commit `.env.local` files (gitignored)

---

## Troubleshooting

### CI Failing

**Lint errors**:

```bash
pnpm run lint:fix  # Auto-fix issues
```

**Type errors**:

```bash
pnpm run typecheck  # See all errors
# Fix manually, TypeScript can't auto-fix
```

**Test failures**:

```bash
pnpm run test:audio-intel --reporter=verbose  # See detailed output
# Fix failing tests
```

**Build errors**:

```bash
pnpm run build:audio-intel  # Build locally to debug
# Check error messages, usually missing env vars or type errors
```

### CodeRabbit Requesting Changes

**View comments**: Check PR "Files changed" tab for inline comments

**Address issues**:

1. Fix the issues CodeRabbit identified
2. Commit and push changes
3. CodeRabbit re-reviews automatically

**Override (if false positive)**:

```markdown
@coderabbit ignore [rule-name]

Reason: [explain why this is a false positive]
```

**Get human review approval**for overrides.

### PR Not Auto-Merging

**Check**:

1. Auto-merge enabled? (click "Enable auto-merge" button)
2. All checks passing? (view "Checks" tab)
3. Conversations resolved? (resolve all comment threads)
4. Branch up to date? (update branch if needed)

**Update branch**:

```bash
git checkout feature/your-branch
git fetch origin
git rebase origin/main  # or git merge origin/main
git push --force-with-lease
```

### Vercel Deployment Failed

**Check Vercel logs**:

1. Go to Vercel dashboard for the app
2. Click on failed deployment
3. View build logs

**Common issues**:

- Missing environment variables
- Build errors (fix locally first)
- Memory limit exceeded (contact Vercel support)

**Fix**:

1. Identify issue from logs
2. Fix in code or Vercel settings
3. Push again or trigger manual deployment

### Golden Verify Failing

**Check health endpoints**:

```bash
curl https://intel.totalaudiopromo.com/api/health
curl https://tracker.totalaudiopromo.com/api/health
curl https://pitch.totalaudiopromo.com/api/health
```

**If app not responding**:

1. Check Vercel deployment status
2. Check Vercel runtime logs
3. Verify environment variables set
4. Check Supabase connection

**View Golden Verify logs**:

- GitHub Actions: https://github.com/totalaudiopromo/total-audio-platform/actions/workflows/golden-verify.yml

### Lockfile Out of Sync

**Error**: `ERR_PNPM_OUTDATED_LOCKFILE`

**Fix**:

```bash
# Regenerate lockfile
pnpm install

# Commit updated lockfile
git add pnpm-lock.yaml
git commit -m "fix(ci): regenerate pnpm-lock.yaml"
git push
```

**Prevention**: Always commit `pnpm-lock.yaml` with `package.json` changes.

---

## Best Practices

### Code Quality

1. **Run checks before pushing**

   ```bash
   pnpm run lint && pnpm run typecheck && pnpm run test
   ```

2. **Write tests for new features**
   - Use `@total-audio/testing` validators
   - Cover happy path and edge cases
   - Test mobile interactions if UI changes

3. **Keep PRs focused**
   - One feature/fix per PR
   - Easier to review and merge
   - Faster to identify issues

4. **Comment complex logic**
   ```typescript
   // Explain WHY, not WHAT
   // Bad: "Loop through users"
   // Good: "Process users in batches to avoid memory issues"
   ```

### Security

1. **Never commit secrets**
   - Use environment variables
   - Check `.gitignore` includes `.env.local`

2. **Validate user input**

   ```typescript
   // Always validate and sanitize
   const email = z.string().email().parse(input.email);
   ```

3. **Use RLS policies**
   - All Supabase tables must have RLS enabled
   - Test policies thoroughly

### Performance

1. **Use Next.js Image component**

   ```typescript
   //  Correct
   import Image from 'next/image';
   <Image src="/logo.png" width={100} height={100} alt="Logo" />

   //  Wrong
   <img src="/logo.png" alt="Logo" />
   ```

2. **Optimize database queries**
   - Use indexes
   - Limit results
   - Paginate large datasets

3. **Monitor bundle size**
   - Check Vercel analytics
   - Lazy load components when possible
   - Use dynamic imports for heavy libraries

### Documentation

1. **Update documentation with code changes**
   - README if setup changes
   - WEEKLY_FOCUS.md for progress
   - AUDIO_INTEL_CONTEXT.md for business changes

2. **Don't create unnecessary .md files**
   - Update existing docs
   - Ask before creating new files in root
   - App-specific docs go in app directories

---

## Summary

**Your workflow in 5 steps**:

1. **Branch**: `git checkout -b feature/your-feature`
2. **Code**: Write code, run tests locally
3. **Commit**: `git commit -m "feat: your change"`
4. **PR**: `gh pr create` and enable auto-merge
5. **Deploy**: Automatic after merge

**The system handles**:

-  Code review (CodeRabbit)
-  Validation (CI)
-  Deployment (Vercel)
-  Verification (Golden Verify)
-  Monitoring (Command Centre)

**You only act when**:

-  CodeRabbit finds issues
-  CI checks fail
-  Telegram alerts you

**This is frictionless development**- focus on coding, let automation handle the rest.

---

## Additional Resources

- **CLAUDE.md**: `.claude/CLAUDE.md` - Full project context and architecture
- **GitHub Setup**: `dx/GITHUB_SETUP.md` - Branch protection and auto-merge configuration
- **CodeRabbit Guide**: `.coderabbit/reviewers.md` - What CodeRabbit checks and why
- **Testing Guide**: `packages/testing/README.md` - Shared testing utilities
- **Phase 10B Docs**: `docs/PHASE_10C_CLEANUP_AND_REBASE.md` - Golden Verify architecture details
