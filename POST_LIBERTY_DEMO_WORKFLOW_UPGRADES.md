# Post-Liberty Demo: Workflow Upgrade Checklist

**Created:** 2025-11-15
**Status:** ON HOLD until after Liberty Music PR demo
**Reference:** [Workflow Audit Session - 2025-11-15]

---

## ✅ Already Completed (Safe & Active)

### Auto-Tidy System
- **Status:** ✅ Installed and running in post-session hook
- **Location:** `.claude/auto-tidy-daemon.sh` + management scripts
- **Impact:** Automatically archives old completion/status files to keep root directory clean
- **Commands:**
  - `bash .claude/tidy-now.sh` - Run cleanup now
  - `bash .claude/tidy-status.sh` - Check status
  - `bash .claude/stop-auto-tidy.sh` - Disable if needed

**Note:** This is safe and non-intrusive. Only moves old files to `archive/`, never touches active work.

---

## 🚧 Remaining Upgrades (Install After Demo)

### Priority 1: High-Impact Automation (Install First)

#### 1. Context Reset Automation
**Time to install:** 2 hours
**ROI:** 1.25x velocity improvement, fewer failed attempts

**What it does:**
- Monitors session context usage automatically
- Creates visible reminder file when context gets heavy (>50 file reads or >2 hours)
- Suggests `/clear` to reset context and improve performance
- Prevents hallucinations and slower responses from context bloat

**Files to create:**
- `.claude/hooks/session-monitor.sh` - Background monitor
- `.claude/hooks/session-start.sh` - Auto-start monitoring
- Update `.claude/settings.json` - Configure hooks

**Commands after installation:**
- Automatic - no commands needed
- Just watch for `.claude/CONTEXT_RESET_RECOMMENDED.md` file appearing

---

#### 2. Pre-Tool-Use Safety Hooks
**Time to install:** 3 hours
**ROI:** 90% reduction in dangerous command risks

**What it does:**
- Automatically validates EVERY tool use before execution
- Blocks dangerous patterns: `rm -rf /`, fork bombs, disk operations
- Prevents accidental deletion of protected paths
- Warns when modifying critical files (package.json, lockfiles, CI configs)
- Auto-increments context usage counter

**Files to create:**
- `.claude/hooks/pre-tool-use.sh` - Safety validation
- Update `.claude/settings.json` - Enable pre-tool-use hook

**Commands after installation:**
- Automatic - runs before every Bash/Edit/Write command
- You just get blocked if you try something dangerous

---

#### 3. Drop Zone Workflows
**Time to install:** 4 hours
**ROI:** 5-10 hours/week saved on repetitive tasks

**What it does:**
- Auto-processes files dropped into special directories
- CSV → `.claude/dropzones/contacts-to-enrich/` → auto-enriched with Audio Intel
- Code → `.claude/dropzones/test-this/` → auto-generates Playwright tests
- Code → `.claude/dropzones/review-this/` → auto-reviews for security/performance
- Commits → `.claude/dropzones/changelog-from-commits/` → auto-generates changelog

**Files to create:**
- `.claude/dropzone-daemon.sh` - File watcher
- `.claude/dropzones/` directory structure
- Auto-start configuration in shell profile

**Commands after installation:**
```bash
# Just drag files to dropzones - processing happens automatically
cp ~/Downloads/contacts.csv .claude/dropzones/contacts-to-enrich/
# → 2 seconds later, enriched CSV appears in processed/

cp apps/audio-intel/app/components/NewComponent.tsx .claude/dropzones/test-this/
# → 5 seconds later, tests generated
```

---

#### 4. Tool Execution Audit Trail
**Time to install:** 3 hours
**ROI:** 30% faster debugging, full traceability

**What it does:**
- Logs every tool execution to `.claude/audit-logs/{date}.jsonl`
- Tracks: timestamp, tool name, parameters, session ID
- Generates daily/weekly summaries
- Sends Telegram notifications with audit reports
- Helps debug "what did I do yesterday?" questions

**Files to create:**
- `.claude/hooks/post-tool-use.ts` - Audit logger
- `.github/workflows/audit-summary.yml` - Daily reports
- Update `.claude/settings.json` - Enable post-tool-use hook

**Commands after installation:**
```bash
# View today's activity
cat .claude/audit-logs/$(date +%Y-%m-%d).jsonl | jq

# Generate summary
pnpm tsx .claude/hooks/post-tool-use.ts --generate-summary
```

---

#### 5. Session History Tracker
**Time to install:** 2 hours
**ROI:** Better decision tracking, easier to resume work

**What it does:**
- Tracks major decisions per session
- Logs context resets, files modified, important actions
- Creates session summary reports
- Helps answer "why did we do it this way?"

**Files to create:**
- `.claude/session-manager.sh` - Session tracking
- `.claude/session-history.md` - Running log

**Commands after installation:**
```bash
# Automatic logging via hooks
# Manual commands:
start_session          # Called automatically
log_decision "reason"  # Log important decisions
log_context_reset      # Log when you run /clear
end_session           # Called automatically
```

---

### Priority 2: Parallel Development (Game Changer)

#### 6. Git Worktree Parallelization (IndyDevDan's Signature)
**Time to install:** 3 hours
**ROI:** 3-5x faster on multi-feature development

**What it does:**
- One command creates new git worktree + opens new terminal + starts Claude
- Run multiple Claude instances on different branches simultaneously
- Work on 3 features in parallel instead of sequentially
- Total time = longest task (not sum of all tasks)

**Files to create:**
- `.claude/scripts/parallel-claude.sh` - Worktree automation
- `~/.local/bin/wt` - Single command wrapper

**Commands after installation:**
```bash
# Old way: 60 minutes for 3 features sequentially
git worktree add ../feature1 -b feature1
cd ../feature1
# work on feature 1 (20 min)
cd ../total-audio-platform
git worktree add ../feature2 -b feature2
# etc...

# New way: 20 minutes for 3 features in parallel
wt "fix mobile UX"      # Terminal 1: 20 min
wt "add new tests"      # Terminal 2: 15 min (parallel)
wt "update docs"        # Terminal 3: 10 min (parallel)
# Total: 20 min (longest task)
```

**Usage patterns:**
```bash
# Pattern 1: Multi-app updates in parallel
wt "update audio-intel mobile UX"
wt "update pitch-generator tests"
wt "update tracker documentation"

# Pattern 2: Bug fix + tests + docs in parallel
wt "fix authentication bug"
wt "add auth tests"
wt "document auth flow"

# Pattern 3: Independent feature development
wt "implement stripe integration"
wt "add newsletter automation"
wt "create demo data generator"
```

**Cleanup:**
```bash
# List active worktrees
git worktree list

# Remove when done
git worktree remove ../worktrees/total-audio-platform-feature-name
```

---

### Priority 3: CI/CD Integration (Advanced)

#### 7. Headless Claude in GitHub Actions
**Time to install:** 4 hours
**ROI:** 100% automated code review coverage

**What it does:**
- Claude automatically reviews every PR for security, performance, mobile UX
- Auto-triages new GitHub issues with labels and priority
- Posts review comments directly on PRs
- Blocks merge if critical issues found

**Files to create:**
- `.github/workflows/claude-pr-review.yml` - Automated PR reviews
- `.github/workflows/claude-issue-triage.yml` - Issue labeling
- Install Claude Code CLI in GitHub Actions

**Example workflow:**
```yaml
# On every PR:
1. Claude reviews code changes
2. Checks for: XSS, SQL injection, missing ARIA, type errors
3. Posts comment with findings
4. Blocks merge if critical issues detected

# On every new issue:
1. Claude analyzes title + body
2. Suggests labels: bug, feature, mobile-ux, security, etc.
3. Estimates effort: 1h, 4h, 1d, 3d
4. Sets priority: high, medium, low
```

**Configuration:**
```bash
# Requires:
- ANTHROPIC_API_KEY secret in GitHub
- Claude Code CLI installed in Actions
- Proper permissions for posting comments
```

---

## 📊 Expected Combined Impact

| Upgrade | Time Savings | Velocity Increase | Risk Reduction |
|---------|--------------|-------------------|----------------|
| Auto-tidy | 30 min/week | - | - |
| Context reset | 20% fewer failures | 1.25x | - |
| Safety hooks | - | - | 90% fewer dangerous commands |
| Drop zones | 5-10 hours/week | 2-4 sessions/month | - |
| Audit trail | 2 hours/week debugging | 1.3x | Full traceability |
| Session history | 1 hour/week context recovery | - | Better decisions |
| Git worktrees | **60 min → 20 min multi-feature** | **3-5x** | Isolated branches |
| Headless CI | 3 hours/week code review | - | 100% coverage |

**Total expected velocity increase:** 3-5x on complex multi-feature development

---

## 🎯 Installation Sequence (After Liberty Demo)

### Week 1: Foundation (7-8 hours total)
**Do these first - highest ROI, lowest risk:**

1. **Context reset automation** (2h) - Immediate quality improvement
2. **Pre-tool-use safety hooks** (3h) - Prevent disasters
3. **Drop zone workflows** (4h) - Save hours weekly

**Test after Week 1:**
- Context resets happen when needed
- Dangerous commands get blocked
- Drop zones auto-process files

---

### Week 2: Observability (5 hours total)
**Better visibility into what's happening:**

4. **Tool execution audit trail** (3h) - Track everything
5. **Session history tracker** (2h) - Decision tracking

**Test after Week 2:**
- All commands logged to audit trail
- Session summaries generated
- Can answer "what did I do yesterday?"

---

### Week 3: Parallelization (3 hours)
**The game changer:**

6. **Git worktree parallelization** (3h) - 3-5x speedup

**Test after Week 3:**
- Run `wt "task description"`
- Multiple terminals with Claude instances
- Parallel development on different branches
- Measure: 3 features in 20 min vs 60 min sequentially

---

### Week 4: CI Integration (4 hours)
**Advanced automation:**

7. **Headless Claude in CI** (4h) - Automated reviews

**Test after Week 4:**
- Create test PR, watch Claude review it
- Create test issue, watch Claude triage it
- Verify Telegram notifications work

---

## 🚀 Quick Start Commands (After Demo)

```bash
# Week 1 setup
cd ~/workspace/active/total-audio-platform

# 1. Context reset (2h)
# Create files from audit session notes
# Test with long session to trigger reset

# 2. Safety hooks (3h)
# Create .claude/hooks/pre-tool-use.sh
# Test by trying `rm -rf /` (should block)

# 3. Drop zones (4h)
# Install fswatch: brew install fswatch
# Create .claude/dropzone-daemon.sh
# Test by dropping CSV file

# Week 2-4 setup
# Follow detailed instructions from audit session
# Reference: Previous conversation with full code examples
```

---

## 📋 Pre-Installation Checklist

Before starting upgrades, ensure:

- [ ] Liberty demo complete and successful
- [ ] All demo-related code merged to main
- [ ] No urgent customer work pending
- [ ] Have 2-hour blocks available for each upgrade
- [ ] Auto-tidy system working well (confidence in automation)
- [ ] Git branch for testing: `git checkout -b feature/workflow-automation-phase-2`

---

## 🛡️ Safety Protocols

**For each upgrade:**

1. **Create git branch** - Test before committing to main
2. **Test in isolation** - Install one upgrade at a time
3. **Verify functionality** - Run test scenarios
4. **Document issues** - Note any problems immediately
5. **Rollback plan** - Know how to disable each upgrade

**Rollback commands:**
```bash
# Context monitor
kill $(cat .claude/tmp/session-monitor.pid)

# Safety hooks
# Remove from .claude/settings.json

# Drop zones
kill $(cat .claude/tmp/dropzone-daemon.pid)

# Audit trail
# Remove from .claude/settings.json

# Git worktrees
git worktree remove <path>

# CI integration
# Disable GitHub Actions workflows
```

---

## 📚 Reference Materials

**From audit session (2025-11-15):**
- Full audit comparison table
- Complete code examples for all upgrades
- IndyDevDan best practices
- Anthropic official recommendations

**Key resources:**
- IndyDevDan YouTube: Git worktree parallelization
- Anthropic docs: https://www.anthropic.com/engineering/claude-code-best-practices
- Your existing `.claude/skills/task-orchestrator/SKILL.md` - Already has parallel patterns

---

## 🎯 Success Metrics

**Track these to measure improvement:**

| Metric | Before | Target After |
|--------|--------|--------------|
| Root directory .md files | 41 | 6-8 (✅ achieved with auto-tidy) |
| Failed attempts per session | ~15% | <5% (context resets) |
| Dangerous commands executed | ~3/month | 0 (safety hooks) |
| Hours on repetitive tasks | 10/week | 2/week (drop zones) |
| Time for 3-feature development | 60 min | 20 min (worktrees) |
| Code review coverage | Ad-hoc | 100% (CI integration) |

---

## 🚨 Red Flags (Stop and Reassess)

If any of these happen, pause upgrades:

- ⚠️ Claude starts behaving unexpectedly
- ⚠️ Important files get moved/deleted
- ⚠️ Git workflows break
- ⚠️ CI/CD pipeline fails
- ⚠️ Customer work gets blocked

**Emergency contact:** Revert to previous commit, disable hooks in `.claude/settings.json`

---

## ✅ Completion Criteria

This checklist is complete when:

- [ ] All 7 upgrades installed and tested
- [ ] Success metrics show improvement
- [ ] No red flags or issues
- [ ] Team trained on new workflows (if applicable)
- [ ] Documentation updated in CLAUDE.md
- [ ] This file archived to `archive/workflow-upgrades/2025/`

---

## 📝 Notes Section

**Add notes here after each upgrade:**

### Upgrade 1: Context Reset Automation
**Installed:** 2025-11-15
**Status:** ✅ SUCCESS
**Notes:**
- Tracks file reads, writes, and session duration automatically
- Triggers at 50 reads, 30 writes, or 120 minutes
- Creates `.claude/CONTEXT_RESET_RECOMMENDED.md` when thresholds exceeded
- Integrated with post-session hook for automatic checking
- CLI tool available: `pnpm tsx .claude/workflow/context/check-context.ts`
- Configuration: `.claude/workflow/context/config.json`
- All functionality tested and working correctly

---

### Upgrade 2: Pre-Tool-Use Safety Hooks
**Installed:** 2025-11-15
**Status:** ✅ SUCCESS
**Notes:**
- 15+ safety rules implemented (destructive, security, production, data categories)
- Automatically validates every tool use before execution
- Blocks dangerous patterns: rm -rf /, fork bombs, disk ops, force git operations
- Protects critical paths and files
- Warnings for critical file modifications
- Configuration: `.claude/workflow/safety/protected-paths.json`
- Hook configured in `.claude/settings.json`
- All safety rules tested with simulated dangerous commands

---

### Upgrade 3: Drop Zone Workflows
**Installed:** [NOT IMPLEMENTED - Deferred to Batch 3]
**Status:** ⏸️ SKIPPED (Batch 1)
**Notes:**
- Requires external dependencies (fswatch/inotify-tools)
- Deferred to Batch 3 for separate implementation
- Core automation complete without this feature

---

### Upgrade 4: Tool Execution Audit Trail
**Installed:** 2025-11-15
**Status:** ✅ SUCCESS
**Notes:**
- Logs all tool executions to `.claude/audit-logs/YYYY-MM-DD.jsonl`
- Automatic sensitive data scrubbing (API keys, passwords, tokens)
- JSONL format for easy parsing and analysis
- CLI viewer: `pnpm tsx .claude/workflow/audit/view.ts`
- CLI summary generator: `pnpm tsx .claude/workflow/audit/summarize.ts`
- Filtering by date, tool, session supported
- Integrated with post-tool-use hook
- Privacy-safe logging confirmed

---

### Upgrade 5: Session History Tracker
**Installed:** 2025-11-16
**Status:** ✅ SUCCESS
**Notes:**
- Decision logging system with JSONL format (`.claude/decisions/YYYY-MM-DD.jsonl`)
- Session ID tracking for grouping related decisions
- CLI tools: record-decision, list-decisions, summarize-decisions
- Records: title, type, description, impact, session context
- Command: `npx tsx .claude/workflow/sessions/record-decision.ts`
- Command: `npx tsx .claude/workflow/sessions/list-decisions.ts`
- Command: `npx tsx .claude/workflow/sessions/summarize-decisions.ts`
- All three tools tested and working correctly
- Helps answer "why did we do it this way?" questions

---

### Upgrade 6: Git Worktree Parallelization
**Installed:** 2025-11-16
**Status:** ✅ SUCCESS
**Notes:**
- IndyDevDan's signature technique for 3-5x faster multi-feature development
- Main script: `bash .claude/scripts/git/wt.sh "task description"`
- Creates isolated worktrees in `../worktrees/` directory
- Auto-generates feature branch names
- Copies .claude configuration to each worktree
- Creates TASK.md with context and quick commands
- Auto-opens new terminal window (platform-specific)
- Utility scripts: list-worktrees.sh, cleanup-worktree.sh
- Comprehensive README with usage patterns and examples
- Enables parallel Claude instances on different branches
- All scripts tested and operational

---

### Upgrade 7: Headless Claude in CI
**Installed:** [DATE]
**Status:** [SUCCESS/ISSUES]
**Notes:**

---

**When all upgrades complete, move this file to:**
`archive/workflow-upgrades/2025/POST_LIBERTY_DEMO_WORKFLOW_UPGRADES_COMPLETE.md`
