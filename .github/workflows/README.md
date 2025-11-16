# GitHub Actions Workflows

This directory contains CI/CD and automation workflows for the Total Audio Platform.

---

## 🚀 Active Workflows

### CI Pipeline (`ci.yml`)
**Status:** ✅ Active
**Runs on:** Every push to `main`, every PR

**What it does:**
- Lints all code (ESLint)
- Type checks (TypeScript)
- Runs test suites
- Builds all apps to verify compilation

**Why:** Validates code quality before deployment

---

### Golden Verification (`golden-verify.yml`)
**Status:** ✅ Active
**Runs on:** After Vercel deploys, hourly health checks, scheduled summaries

**What it does:**
- Health checks for deployed sites
- Post-deployment verification
- Telegram notifications (failures only)
- Daily/weekly summaries

**Why:** Ensures deployed sites are healthy and accessible

---

## 🔮 Template Workflows (Require Setup)

### Claude PR Review (`claude-pr-review.yml.template`)
**Status:** ⏸️ Template (requires setup)
**Purpose:** Automated code review for every PR

**What it will do (once configured):**
- ✅ Security review (XSS, injection, auth issues)
- ✅ Performance analysis (re-renders, memory leaks)
- ✅ Mobile UX validation (touch targets, ARIA, responsive)
- ✅ Code quality checks (types, error handling, naming)
- ✅ Posts review comment on PR
- ✅ Adds labels based on findings
- ✅ Blocks merge if critical issues found

**Setup required:**
1. Install Claude Code CLI in GitHub Actions
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Rename file from `.template` to `.yml`

**Example workflow:**
```
Developer opens PR
  ↓
GitHub Actions triggers
  ↓
Claude reviews all changed files
  ↓
Posts comment with findings
  ↓
Adds labels (security, performance, needs-changes, etc.)
  ↓
Fails if critical issues (❌) found
```

---

### Claude Issue Triage (`claude-issue-triage.yml.template`)
**Status:** ⏸️ Template (requires setup)
**Purpose:** Automated triage for new GitHub issues

**What it will do (once configured):**
- 🏷️ Auto-labels issues (bug, feature, documentation, etc.)
- 📊 Estimates effort (1h, 4h, 1d, 3d, 1w)
- 🎯 Sets priority (high, medium, low)
- 🗺️ Identifies affected areas (audio-intel, tracker, etc.)
- 💬 Posts triage comment with summary

**Setup required:**
1. Install Claude Code CLI in GitHub Actions
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Rename file from `.template` to `.yml`

**Example workflow:**
```
User creates issue
  ↓
GitHub Actions triggers
  ↓
Claude analyzes title + body
  ↓
Determines type, priority, effort, areas
  ↓
Adds labels and triage comment
  ↓
(Optional) Assigns to appropriate developer
```

---

## 🛠️ Setup Instructions

### Prerequisites

1. **ANTHROPIC_API_KEY** in GitHub Secrets:
   - Go to: Settings → Secrets and variables → Actions
   - Click: New repository secret
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

2. **Install Claude Code CLI in Actions** (pending official support):
   ```yaml
   - name: Install Claude Code
     run: |
       npm install -g @anthropic-ai/claude-code-cli
       # Or download binary from releases
   ```

### Activate Template Workflows

```bash
# Activate PR review
mv .github/workflows/claude-pr-review.yml.template \
   .github/workflows/claude-pr-review.yml

# Activate issue triage
mv .github/workflows/claude-issue-triage.yml.template \
   .github/workflows/claude-issue-triage.yml

# Commit and push
git add .github/workflows/
git commit -m "feat: Enable Claude-powered PR review and issue triage"
git push origin main
```

---

## 📊 Workflow Comparison

| Workflow | Runs On | Purpose | Status | Cost |
|----------|---------|---------|--------|------|
| CI | Push, PR | Code quality validation | ✅ Active | Free (GitHub) |
| Golden Verify | Post-deploy, hourly | Health checks | ✅ Active | Free (GitHub) |
| Claude PR Review | PR opened/updated | Automated code review | ⏸️ Template | Claude API calls |
| Claude Issue Triage | Issue opened | Auto-label and prioritize | ⏸️ Template | Claude API calls |

---

## 🔐 Security Considerations

### API Key Protection
- Never commit `ANTHROPIC_API_KEY` to repository
- Use GitHub Secrets for all sensitive values
- Restrict workflow permissions to minimum required

### Review Workflow Permissions
```yaml
permissions:
  contents: read        # Read code
  pull-requests: write  # Comment on PRs
  issues: write         # Label issues
```

---

## 📈 Expected Impact

### With Claude PR Review Active

**Before:**
- Manual code review required for every PR
- Security issues sometimes missed
- Inconsistent review quality

**After:**
- 100% automated initial review coverage
- Consistent security/performance checks
- Human reviewers focus on business logic
- Faster feedback loop for developers

**Estimated time savings:** 2-3 hours/week per reviewer

---

### With Claude Issue Triage Active

**Before:**
- Manual triage of every issue
- Inconsistent labeling
- Priority assessment varies

**After:**
- Instant triage for all new issues
- Consistent labeling and priority
- Easier to find and prioritize work
- Better project management

**Estimated time savings:** 1-2 hours/week

---

## 🐛 Troubleshooting

### Template workflow doesn't run

**Cause:** Template files (`.yml.template`) are not executed by GitHub Actions.

**Fix:** Rename to `.yml` extension:
```bash
mv workflow.yml.template workflow.yml
```

---

### API key not found error

**Error:** `ANTHROPIC_API_KEY not set`

**Fix:** Add to GitHub Secrets:
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your API key

---

### Workflow failing on PR

**Check logs:**
1. Go to Actions tab
2. Click failing workflow run
3. Expand failed step
4. Review error message

**Common issues:**
- API key not configured
- Claude Code CLI not installed
- Insufficient permissions

---

## 🚀 Future Enhancements

**Planned workflow additions:**
- Automated dependency updates (Dependabot integration)
- Performance regression detection
- Visual regression testing
- Automated changelog generation
- Release automation

---

## 📚 Related Documentation

- [CI/CD Pipeline Details](../../docs/PHASE_10C_CLEANUP_AND_REBASE.md)
- [Golden Verification System](../../docs/GOLDEN_VERIFICATION.md)
- [Workflow Automation Suite](../../.claude/workflow/README.md)

---

**Questions or issues?** Check the main [CLAUDE.md](../../.claude/CLAUDE.md) or create a GitHub issue.
