# Worktree Isolation Skill

**Trigger**: Use when performing batch automation, large refactors, or any operation that should be isolated from main development.

**Purpose**: Prevent cross-branch contamination by isolating automation work in git worktrees.

---

## When to Use This Skill

- **Batch processing** that generates many files
- **Large refactors** that touch multiple files
- **Experimental changes** you might want to discard
- **Parallel development** while keeping main branch clean
- **Automation tasks** that should be reviewable before merge

---

## Quick Commands

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform

# List all worktrees
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts list

# Create new worktree for automation task
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts create automation/intel-batch-001

# Activate worktree (hooks will enforce boundaries)
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts activate /path/to/worktree

# When done, deactivate
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts deactivate

# Clean up old automation worktrees
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts cleanup
```

---

## Workflow Pattern

### 1. Create Isolated Worktree

```bash
# Create worktree for a batch job
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts create automation/contact-enrichment-2025-11-26

# Output: Created at ../total-audio-worktrees/automation-contact-enrichment-2025-11-26
```

### 2. Activate Worktree

```bash
# Tell the system to use this worktree
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts activate ../total-audio-worktrees/automation-contact-enrichment-2025-11-26
```

### 3. Run Automation

With the worktree activated:

- Safety hooks will enforce file operations stay within the worktree
- Audit logs will include worktree context
- Changes are isolated from main branch

### 4. Review & Merge (or Discard)

```bash
# In the worktree directory, review changes
cd ../total-audio-worktrees/automation-contact-enrichment-2025-11-26
git status
git diff

# If good, push and create PR
git push -u origin automation/contact-enrichment-2025-11-26

# Or discard by removing the worktree
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts remove ../total-audio-worktrees/automation-contact-enrichment-2025-11-26 --force
```

### 5. Cleanup

```bash
# Deactivate worktree in session
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts deactivate

# Clean up all automation worktrees
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts cleanup
```

---

## Safety Integration

When a worktree is active:

1. **pre-tool-use hook** checks file paths against active worktree
2. **post-tool-use hook** logs worktree context in audit trail
3. **audit-logger** includes worktree in all log entries

### Boundary Enforcement

The active worktree is stored in `.claude/tmp/active-worktree`. Hooks read this file and:

- Allow operations within the worktree path
- Allow operations in `.claude/` directory (for logging)
- Block operations outside these boundaries

---

## Directory Structure

```
total-audio-platform/           # Main repository
├── .claude/
│   └── tmp/
│       └── active-worktree     # Current active worktree path
│
../total-audio-worktrees/       # Worktree storage (outside main repo)
├── automation-intel-batch-001/
├── automation-epk-generation/
└── feature-new-processor/
```

---

## Best Practices

### Naming Conventions

- `automation/*` - For dropzone/processor automation
- `feature/*` - For feature development
- `experiment/*` - For experimental changes
- `hotfix/*` - For urgent fixes

### Worktree Lifecycle

1. Create with descriptive name
2. Activate before automation
3. Run automation tasks
4. Review changes in worktree
5. Push and PR (or discard)
6. Remove worktree when done
7. Prune stale entries periodically

### Don't Forget

- **Deactivate** when switching back to main repo work
- **Cleanup** automation worktrees after merging
- **Prune** periodically to remove stale entries

---

## Integration with Dropzone Watcher

For batch processing with dropzone watcher:

```bash
# 1. Create worktree for batch
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts create automation/batch-$(date +%Y%m%d)

# 2. Activate it
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts activate ../total-audio-worktrees/automation-batch-*

# 3. Start watcher (will respect worktree boundaries)
DROPZONE_LIVE=1 npx tsx .claude/scripts/dropzone-watcher.ts

# 4. After processing, review and merge
cd ../total-audio-worktrees/automation-batch-*
git add -A
git commit -m "feat(intel): batch enrichment results"
git push -u origin HEAD
gh pr create --title "Batch enrichment results" --body "Auto-generated from dropzone processing"
```

---

## Troubleshooting

### "Worktree already exists"

```bash
# Remove existing worktree first
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts remove <path> --force
```

### "Not a git repository"

Ensure you're running from within the total-audio-platform directory.

### "Path outside active worktree" errors

```bash
# Check what's active
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts list

# Deactivate if needed
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts deactivate
```

### Stale worktree entries

```bash
# Prune stale entries (worktrees whose directories no longer exist)
npx tsx .claude/skills/worktree-isolation/worktree-manager.ts prune
```
