# GitHub & Vercel Deployment Expert

**Trigger**: Use when encountering GitHub repository issues, Vercel deployment failures, or Git integration problems.

## Core Expertise

This skill provides systematic debugging and resolution of:

- Vercel monorepo deployment failures
- GitHub branch and webhook configuration
- Git integration issues between GitHub and Vercel
- Build configuration problems (vercel.json, package.json)
- Deployment trigger failures

## Activation Criteria

Activate this skill when:

- Vercel deployments are failing or not triggering
- GitHub default branch is incorrect
- Git webhooks are missing or misconfigured
- Monorepo apps aren't deploying correctly
- Root Directory settings are wrong in Vercel
- Build commands or environment variables are missing

## Diagnostic Framework

### Phase 1: Information Gathering

**ALWAYS start by collecting these facts:**

1. **Check Recent Commits**

   ```bash
   git log --oneline -10
   git status
   ```

2. **Verify GitHub Repository Settings**

   ```bash
   gh api repos/{owner}/{repo} --jq '{default_branch, private, archived}'
   ```

3. **Check GitHub Webhooks**

   ```bash
   gh api repos/{owner}/{repo}/hooks --jq '.[].config.url'
   ```

4. **List Recent Vercel Deployments**

   ```bash
   vercel ls {project-name} 2>&1 | head -15
   ```

5. **Verify Vercel Project Configuration**
   - Check Root Directory setting
   - Verify Production Branch
   - Confirm Git repository connection

### Phase 2: Pattern Recognition

**Common Deployment Failure Patterns:**

1. **4-10 Second Failures** = Missing Root Directory or wrong build config
2. **"No Next.js version detected"** = Root Directory not set for monorepo
3. **Webhook Missing** = Git integration disconnected
4. **Automatic Deployments Not Triggering** = Webhook deleted or disabled
5. **Build Timeout (13-14 minutes)** = Dependency or build configuration issue

### Phase 3: Systematic Resolution

**For Monorepo Deployment Issues:**

1. **Verify vercel.json Configuration**
   - Each app needs: `buildCommand`, `installCommand`, `outputDirectory`
   - Example for monorepo:
     ```json
     {
       "framework": "nextjs",
       "buildCommand": "pnpm --filter app-name build",
       "installCommand": "pnpm install --frozen-lockfile",
       "outputDirectory": ".next",
       "regions": ["lhr1"]
     }
     ```

2. **Check Root Directory in Vercel**
   - Navigate to: Vercel Project → Settings → General
   - Root Directory should be: `apps/{app-name}` for monorepo
   - NEVER leave blank for monorepo apps

3. **Verify Git Integration**
   - Navigate to: Vercel Project → Settings → Git
   - Ensure correct repository is connected
   - Verify Production Branch matches GitHub default branch
   - Check "Automatic Deployments" is enabled

**For GitHub Webhook Issues:**

1. **Check if webhook exists:**

   ```bash
   gh api repos/{owner}/{repo}/hooks --jq '.[].config.url'
   ```

2. **If missing, reconnect Git in Vercel:**
   - Go to Project Settings → Git tab
   - Click "Disconnect" (if needed)
   - Click "Connect Git Repository"
   - Select repository and branch
   - Vercel will recreate webhook

3. **Verify webhook was created:**

   ```bash
   gh api repos/{owner}/{repo}/hooks --jq '.[].config.url'
   ```

   - Should show Vercel webhook URL

**For GitHub Default Branch Issues:**

1. **Check current default branch:**

   ```bash
   gh api repos/{owner}/{repo} --jq '.default_branch'
   ```

2. **Change if incorrect:**

   ```bash
   gh api repos/{owner}/{repo} -X PATCH -f default_branch=main
   ```

3. **Update Vercel Production Branch to match:**
   - Go to: Vercel Project → Settings → Git
   - Set Production Branch to match GitHub default

### Phase 4: Verification

**After making fixes, verify:**

1. **Test Manual Deployment First**
   - Go to Vercel dashboard
   - Click "Deployments" → Select any deployment → "Redeploy"
   - Uncheck "Use existing Build Cache"
   - Click "Redeploy"
   - **If this succeeds**, Root Directory and build config are correct

2. **Test Automatic Deployments**
   - Make trivial commit (e.g., bump package version)
   - Push to main branch
   - Wait 30-60 seconds
   - Check Vercel deployments list for new deployment
   - **If no new deployment appears**, webhook issue persists

3. **Monitor Deployment Progress**

   ```bash
   vercel ls {project-name} 2>&1 | head -15
   ```

   - New deployments should appear within 1-2 minutes of push
   - Check Status column for "Building" or "Ready"

## Resolution Checklist

**Before concluding deployment issue is fixed:**

- [ ] Manual redeploy succeeds
- [ ] Root Directory is correctly set
- [ ] vercel.json has all required fields
- [ ] GitHub default branch is correct
- [ ] Vercel Production Branch matches GitHub
- [ ] GitHub webhook exists and points to Vercel
- [ ] Automatic deployment triggers on Git push
- [ ] New deployments appear in Vercel list within 2 minutes

## Common Mistakes to Avoid

1. **DON'T** try to deploy from app directory when using `vercel` CLI
2. **DON'T** leave Root Directory blank for monorepo apps
3. **DON'T** assume webhook exists - always verify with `gh api`
4. **DON'T** skip manual redeploy test before testing automatic deployments
5. **DON'T** commit large files or regenerate entire repo with prettier during urgent fixes

## ⚠️ CRITICAL: Multiple Failure Modes (2025-11-10)

**IMPORTANT**: When diagnosing "GitHub Actions failing", ALWAYS check ALL three failure types:

### 1. Vercel Deployment Failures

- **Symptom**: Vercel deployments show "Error" status
- **Common Causes**:
  - Missing Root Directory setting in Vercel UI
  - Missing buildCommand/installCommand/outputDirectory in vercel.json
  - GitHub default branch mismatch
- **Fix Location**: Vercel dashboard settings + vercel.json files

### 2. GitHub Actions CI/CD Failures

- **Symptom**: GitHub Actions runs show red X
- **Common Causes**:
  - TypeScript compilation errors (strict null checks)
  - Missing environment variables in GitHub Secrets
  - Test failures due to invalid configuration
- **Fix Location**: Source code + .github/workflows/\*.yml

### 3. Golden Verification Pipeline Failures

- **Symptom**: "Invalid Lighthouse budget structure" error
- **Common Causes**:
  - Wrong budget.json format (score thresholds vs. budget format)
  - Missing .lighthouse/budget.json file in repository
  - Validation script expecting different structure
- **Fix Location**: .lighthouse/budget.json + scripts/golden-postcheck.ts

**Diagnostic Protocol**:

1. Run `gh run list --limit 5` to see which workflows are failing
2. Run `gh run view [run-id] --log-failed` for each failed workflow
3. Check Vercel dashboard for deployment status
4. Identify which failure type(s) are occurring
5. Fix each type independently (they don't affect each other)

## Repository-Specific Context

**Total Audio Platform Monorepo:**

- Repository: `totalaudiopromo/total-audio-platform`
- Default Branch: `main`
- Package Manager: `pnpm` with workspaces
- Apps:
  - audio-intel (Root: `apps/audio-intel`)
  - tracker (Root: `apps/tracker`)
  - pitch-generator (Root: `apps/pitch-generator`)

**Vercel Project Names:**

- audio-intel
- tracker-fresh
- pitch-generator

## Output Format

**When diagnosing deployment issues, provide:**

1. **Current Status Summary**
   - What's failing
   - Last successful deployment time
   - Error patterns observed

2. **Root Cause Analysis**
   - Primary issue identified
   - Contributing factors
   - Why it's failing

3. **Step-by-Step Resolution**
   - Exact commands to run
   - Exact settings to change in Vercel UI
   - Expected outcomes at each step

4. **Verification Steps**
   - How to confirm fix worked
   - What to monitor
   - Timeline for success indicators

## Success Criteria

**Deployment issue is RESOLVED when:**

1. Manual redeployments succeed consistently
2. Automatic deployments trigger on Git push within 2 minutes
3. Deployments complete successfully (Status = "Ready")
4. GitHub webhook is present and functional
5. All three apps deploy correctly from same repository

---

**Created**: November 2025
**Last Updated**: November 2025
**Maintenance**: Update when new deployment patterns emerge
