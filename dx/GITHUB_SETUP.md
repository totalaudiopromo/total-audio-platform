# GitHub Branch Protection & Auto-Merge Setup

## Overview

This document explains how to configure GitHub branch protection rules and auto-merge for the Total Audio Platform repository to achieve frictionless developer workflow.

## Goal

**Ideal workflow**: `Code → PR → CodeRabbit Review → CI Pass → Auto-Merge → Vercel Deploy → Golden Verify`

## Branch Protection Rules for `main`

### Navigate to Settings

1. Go to: `https://github.com/totalaudiopromo/total-audio-platform/settings/branches`
2. Click "Add rule" or edit existing rule for `main` branch

### Required Settings

#### Basic Settings

- **Branch name pattern**: `main`
- **Require a pull request before merging**:  Enabled
  - **Require approvals**: 0 (CodeRabbit auto-approves)
  - **Dismiss stale pull request approvals when new commits are pushed**:  Enabled
  - **Require review from Code Owners**:  Disabled (optional - enable if you create CODEOWNERS file)
  - **Require approval of the most recent reviewable push**:  Enabled

#### Status Checks

- **Require status checks to pass before merging**:  Enabled
  - **Require branches to be up to date before merging**:  Enabled

  **Required status checks**(add these):
  - `ci` - Main CI workflow (lint, typecheck, test, build)
  - `security-scan` - Security audit workflow
  - `coderabbit` - CodeRabbit review status

#### Additional Settings

- **Require conversation resolution before merging**:  Enabled
  - Ensures all CodeRabbit comments are addressed

- **Require signed commits**:  Disabled (optional - enable for higher security)

- **Require linear history**:  Disabled (allow merge commits)

- **Require merge queue**:  Disabled (not needed for solo builder workflow)

- **Require deployments to succeed before merging**:  Disabled
  - Important: Vercel deploys AFTER merge, not before

- **Lock branch**:  Disabled (need to push to main)

- **Do not allow bypassing the above settings**:  Enabled
  - Prevents accidental direct pushes to main

- **Allow force pushes**:  Disabled
  - Prevents history rewriting on main

- **Allow deletions**:  Disabled
  - Prevents accidental branch deletion

### Auto-Merge Configuration

#### Enable in Repository Settings

1. Navigate to: `https://github.com/totalaudiopromo/total-audio-platform/settings`
2. Scroll to "Pull Requests" section
3. Enable:
   -  **Allow auto-merge**
   -  **Automatically delete head branches**

#### How Auto-Merge Works

When a PR is created:

1. **CodeRabbit reviews**→ Comments if issues found
2. **CI runs**→ lint, typecheck, test, build
3. **Security scan runs**→ Checks dependencies

When all pass: 4. **CodeRabbit auto-approves**(if configured to do so) 5. **PR auto-merges**(if auto-merge enabled on PR) 6. **Branch auto-deletes**7. **Vercel auto-deploys**8. **Golden Verify runs**post-deployment checks

## CodeRabbit Integration

### Install CodeRabbit GitHub App

1. Go to: `https://github.com/apps/coderabbitai`
2. Click "Install" or "Configure"
3. Select `totalaudiopromo/total-audio-platform` repository
4. Grant required permissions:
   -  Read access to code
   -  Read and write access to pull requests
   -  Read access to workflows

### CodeRabbit Configuration

Configuration already exists in `.coderabbit/config.yml`.

**Key settings**:

- Auto-review enabled for all PRs (not drafts)
- Auto-approve when no critical issues
- Request changes only for critical issues
- Silent mode (only comments on real problems)

## Vercel Integration

### Vercel GitHub App

Vercel integration should already be configured. Verify:

1. Go to Vercel dashboard for each project:
   - Audio Intel: `https://vercel.com/chris-projects-6ffe0e29/audio-intel`
   - Tracker: `https://vercel.com/chris-projects-6ffe0e29/tracker-fresh`
   - Pitch Generator: `https://vercel.com/chris-projects-6ffe0e29/pitch-generator`

2. For each project, verify Git settings:
   - **Production Branch**: `main`
   - **Ignored Build Step**: (default, should be empty)
   - **Auto-deploy**:  Enabled

### Important Notes

- **DO NOT**add Vercel checks to branch protection
  - Vercel deploys AFTER merge, not before
  - Branch protection should NOT wait for Vercel
  - Golden Verify handles post-deployment checks

- **Preview deployments**happen on PR creation
  - But don't block merging
  - Use for manual testing only

## Secrets Configuration

### GitHub Secrets

Navigate to: `https://github.com/totalaudiopromo/total-audio-platform/settings/secrets/actions`

**Required secrets**:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Telegram (for notifications)
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=987654321

# Vercel (for rollback capability - optional)
VERCEL_TOKEN=xxx
VERCEL_PROJECT_ID_AUDIO_INTEL=prj_xxx
VERCEL_PROJECT_ID_TRACKER=prj_xxx
VERCEL_PROJECT_ID_PITCH_GENERATOR=prj_xxx

# Stripe (for revenue audit)
STRIPE_SECRET_KEY=sk_live_xxx

# Notion (for reports - optional)
NOTION_TOKEN=secret_xxx
NOTION_PAGE_ID=xxx
```

### Vercel Environment Variables

Each Vercel project needs environment variables configured in dashboard.

**Per-project variables**(set in Vercel dashboard):

```
# All environments (Production, Preview, Development)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Production only
STRIPE_SECRET_KEY=sk_live_xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# Preview and Development
STRIPE_SECRET_KEY=sk_test_xxx
ANTHROPIC_API_KEY=sk-ant-xxx (can be same or different)
```

## Testing the Setup

### 1. Create Test PR

```bash
# Create a new branch
git checkout -b test/branch-protection

# Make a small change
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verify branch protection and auto-merge"

# Push branch
git push -u origin test/branch-protection

# Create PR via GitHub CLI
gh pr create --title "Test: Verify Branch Protection" --body "Testing auto-merge workflow"
```

### 2. Enable Auto-Merge on PR

In the PR page:

1. Click "Enable auto-merge" button
2. Select "Squash and merge" (or your preferred merge method)

### 3. Verify Workflow

Check that:

1.  CodeRabbit comments appear (or auto-approves if no issues)
2.  CI workflow runs and passes
3.  Security scan runs and passes
4.  PR auto-merges when all checks pass
5.  Branch auto-deletes after merge
6.  Vercel auto-deploys to production
7.  Golden Verify runs post-deployment checks
8.  Telegram notification sent (failures only)

### 4. Verify Branch Protection

Try to push directly to main:

```bash
git checkout main
echo "test" >> TEST.md
git add TEST.md
git commit -m "test: direct push"
git push origin main
```

**Expected result**:  Push rejected with message about branch protection.

## Troubleshooting

### PR Not Auto-Merging

**Possible causes**:

1. Auto-merge not enabled on PR (click "Enable auto-merge" button)
2. Required checks not passing (view PR checks tab)
3. CodeRabbit requesting changes (address issues)
4. Conversation not resolved (resolve all comments)

**Fix**: Check PR status, ensure all checks pass, resolve comments.

### CodeRabbit Not Reviewing

**Possible causes**:

1. CodeRabbit GitHub App not installed
2. PR marked as draft (CodeRabbit skips drafts)
3. No substantive changes (only formatting)

**Fix**: Install CodeRabbit app, mark PR as ready for review.

### Vercel Not Deploying

**Possible causes**:

1. Vercel GitHub App not connected
2. Production branch not set to `main`
3. Ignored Build Step blocking deployment

**Fix**: Check Vercel dashboard Git settings, ensure `main` is production branch.

### Golden Verify Failing

**Possible causes**:

1. Health endpoints not responding
2. App deployment failed on Vercel
3. Environment variables missing

**Fix**: Check Vercel deployment logs, verify health endpoints, check environment variables.

## Maintenance

### Regular Checks

**Monthly**:

- Review failed PR auto-merges (if any)
- Audit branch protection rules still correct
- Verify all required secrets still valid
- Check CodeRabbit review quality

**Quarterly**:

- Review auto-merge success rate
- Adjust CodeRabbit rules if too strict/lenient
- Update required status checks if workflows change

## Summary

**Proper setup enables**:

-  Frictionless PRs (code → review → merge → deploy)
-  Automated quality gates (CodeRabbit + CI)
-  Protection from accidents (branch protection)
-  Zero deployment failures (Golden Verify)

**Expected behavior**:

1. Developer creates PR
2. CodeRabbit reviews automatically
3. CI validates automatically
4. PR auto-merges when approved
5. Vercel deploys automatically
6. Golden Verify checks automatically
7. Developer notified only on failures

**This is the Golden Verify architecture in action.**
