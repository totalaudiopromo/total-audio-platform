# Git Worktree Parallelization

**IndyDevDan's signature technique for 3-5x faster multi-feature development**

---

## 🎯 The Problem

Traditional sequential development:
```
Work on feature A (20 min) → Commit → Work on feature B (15 min) → Commit → Work on feature C (10 min)
Total time: 45 minutes
```

With worktrees, you can work on all 3 features **simultaneously** in separate terminal windows:
```
Terminal 1: Feature A (20 min) |
Terminal 2: Feature B (15 min) | ← All running in parallel
Terminal 3: Feature C (10 min) |
Total time: 20 minutes (longest task)
```

**Result: 3-5x speedup on multi-feature work!**

---

## 🚀 Quick Start

### Create a new worktree for parallel work

```bash
bash .claude/scripts/git/wt.sh "fix mobile UX issues"
```

This will:
1. ✅ Create new git worktree in `../worktrees/` directory
2. ✅ Create new branch `feature/fix-mobile-ux-issues-1234567890`
3. ✅ Copy .claude configuration to worktree
4. ✅ Create TASK.md with instructions
5. ✅ Open new terminal window automatically
6. ✅ Display task details and quick commands

**That's it!** Now work in the new terminal while your main terminal continues other work.

---

## 📋 Usage Examples

### Pattern 1: Multi-app updates

```bash
# Terminal 1 (main repository)
bash .claude/scripts/git/wt.sh "update audio-intel mobile UX"

# Terminal 2 (main repository)
bash .claude/scripts/git/wt.sh "add pitch-generator tests"

# Terminal 3 (main repository)
bash .claude/scripts/git/wt.sh "update tracker documentation"

# Now you have 3 Claude instances working in parallel!
```

### Pattern 2: Bug fix + tests + docs

```bash
bash .claude/scripts/git/wt.sh "fix authentication bug"
bash .claude/scripts/git/wt.sh "add auth tests"
bash .claude/scripts/git/wt.sh "document auth flow"

# All three can be developed simultaneously
```

### Pattern 3: Independent features

```bash
bash .claude/scripts/git/wt.sh "implement Stripe integration"
bash .claude/scripts/git/wt.sh "add newsletter automation"
bash .claude/scripts/git/wt.sh "create demo data generator"

# Complete isolation - no conflicts between features
```

---

## 🛠️ Commands

### Create worktree
```bash
bash .claude/scripts/git/wt.sh "task description"
```

### List all worktrees
```bash
bash .claude/scripts/git/list-worktrees.sh

# Or directly:
git worktree list
```

### Remove a worktree (when done)
```bash
bash .claude/scripts/git/cleanup-worktree.sh <path>

# Or directly:
git worktree remove <path>
```

---

## 📁 Directory Structure

When you create worktrees, this structure is created:

```
~/workspace/active/
├── total-audio-platform/              # Main repository
│   └── .claude/scripts/git/wt.sh     # Worktree creator
└── worktrees/                         # All worktrees live here
    ├── total-audio-platform-feature-mobile-ux-1234567890/
    ├── total-audio-platform-feature-new-tests-1234567891/
    └── total-audio-platform-feature-docs-update-1234567892/
```

**Benefits:**
- Worktrees are siblings, not children (cleaner structure)
- Each has its own .claude configuration
- Each has TASK.md with specific instructions
- All isolated from each other

---

## 🎯 Workflow

### 1. Create worktree
```bash
bash .claude/scripts/git/wt.sh "implement new feature"
```

### 2. Work in new terminal
- New terminal opens automatically
- Read TASK.md for context
- Code, test, commit as usual
- Everything is isolated from main repo

### 3. Push and create PR
```bash
git push -u origin <branch-name>
gh pr create --base main --fill
```

### 4. Clean up when merged
```bash
# After PR is merged
git worktree remove <path>

# Or use the cleanup script
bash .claude/scripts/git/cleanup-worktree.sh <path>
```

---

## ⚠️ Important Notes

### DO:
- ✅ Create separate worktrees for independent features
- ✅ Run tests in each worktree before pushing
- ✅ Clean up worktrees after PR is merged
- ✅ Use for parallel development

### DON'T:
- ❌ Don't modify the same file in multiple worktrees (will cause conflicts)
- ❌ Don't share database/node_modules between worktrees
- ❌ Don't forget to clean up old worktrees
- ❌ Don't check out the same branch in multiple worktrees

---

## 🔧 Advanced Usage

### Custom worktree location
```bash
# Instead of using wt.sh, use git worktree directly
git worktree add /custom/path -b feature-name
```

### Sync main branch changes
```bash
# In your worktree
git fetch origin main
git rebase origin/main
```

### Prune deleted worktrees
```bash
git worktree prune
```

---

## 📊 Performance Comparison

### Traditional Sequential Development
```
Feature 1: 20 min
Feature 2: 15 min  (starts after Feature 1)
Feature 3: 10 min  (starts after Feature 2)
────────────────────
Total: 45 minutes
```

### Parallel Development with Worktrees
```
Feature 1: 20 min ─┐
Feature 2: 15 min ─┼─ All running simultaneously
Feature 3: 10 min ─┘
────────────────────
Total: 20 minutes (longest task)
```

**Speedup: 2.25x in this example**

With more features or longer tasks, speedup can be **3-5x or higher**.

---

## 🎓 Learn More

- IndyDevDan's YouTube: Search "IndyDevDan Claude Code parallel worktrees"
- Git worktree docs: https://git-scm.com/docs/git-worktree
- Our implementation: `.claude/scripts/git/wt.sh`

---

## 💡 Pro Tips

1. **Name tasks clearly** - Makes branch names readable
2. **Keep worktrees short-lived** - Create, work, merge, clean up
3. **Use for isolated features** - Don't modify overlapping files
4. **Run tests before pushing** - Each worktree is independent
5. **Clean up regularly** - Don't accumulate old worktrees

---

**Ready to 3-5x your development speed?**

```bash
bash .claude/scripts/git/wt.sh "your next feature"
```
