# Documentation Organizer - Usage Guide

Quick reference for organizing documentation from anywhere in the monorepo.

## 🚀 Quick Start

### Option 1: From Monorepo Root (Recommended)

```bash
# From /total-audio-platform/
npm run organize-docs
npm run organize-docs:dry-run
npm run organize-docs:verbose
```

**Best for:** Running from your main terminal at project root.

---

### Option 2: From Any Directory (Convenience Script)

```bash
# From ANY directory inside the monorepo
bash scripts/organize-docs-from-anywhere.sh --dry-run
bash scripts/organize-docs-from-anywhere.sh
bash scripts/organize-docs-from-anywhere.sh --verbose
bash scripts/organize-docs-from-anywhere.sh tracker
```

**Best for:** When you're working inside a specific app (like `apps/tracker/`).

---

### Option 3: Create a Shell Alias (Easiest!)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# TAP Documentation Organizer
alias organize-docs='bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh'
alias organize-docs-dry='bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh --dry-run'
```

Then reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

Now from **anywhere**:

```bash
# Works from any directory!
organize-docs-dry          # Preview changes
organize-docs              # Apply organization
organize-docs tracker      # Organize specific app
```

**Best for:** Daily workflow - fastest and works everywhere.

---

## 📋 Commands Reference

### From Monorepo Root

| Command                                 | Description                          |
| --------------------------------------- | ------------------------------------ |
| `npm run organize-docs`                 | Organize all apps                    |
| `npm run organize-docs:dry-run`         | Preview without moving files (safe!) |
| `npm run organize-docs:verbose`         | Show detailed output                 |
| `node scripts/organize-docs.js tracker` | Organize specific app                |

### From Any Directory

| Command                                                 | Description           |
| ------------------------------------------------------- | --------------------- |
| `bash scripts/organize-docs-from-anywhere.sh`           | Organize all apps     |
| `bash scripts/organize-docs-from-anywhere.sh --dry-run` | Preview changes       |
| `bash scripts/organize-docs-from-anywhere.sh --verbose` | Verbose output        |
| `bash scripts/organize-docs-from-anywhere.sh tracker`   | Organize specific app |

### With Alias (After Setup)

| Command                   | Description             |
| ------------------------- | ----------------------- |
| `organize-docs`           | Organize all apps       |
| `organize-docs-dry`       | Preview changes (safe!) |
| `organize-docs --verbose` | Verbose output          |
| `organize-docs tracker`   | Organize specific app   |

---

## 💡 Common Scenarios

### Scenario 1: "I'm in tracker/ and created a new FEATURE_COMPLETE.md"

```bash
# From apps/tracker/
bash ../../scripts/organize-docs-from-anywhere.sh --dry-run tracker

# Or with alias:
organize-docs-dry tracker
```

### Scenario 2: "I want to organize all apps before committing"

```bash
# From project root:
npm run organize-docs:dry-run   # Preview
npm run organize-docs            # Apply

# From anywhere with alias:
organize-docs-dry               # Preview
organize-docs                   # Apply
```

### Scenario 3: "I'm not sure if it will work correctly"

```bash
# Always start with dry-run (safe, no files moved)
organize-docs-dry

# Review the output, then if happy:
organize-docs
```

### Scenario 4: "I just want to see what would change"

```bash
# From anywhere:
organize-docs-dry --verbose

# Shows every file that would move and where
```

---

## 🎯 Setting Up the Alias (Recommended)

**For zsh (default on macOS):**

```bash
# Add to ~/.zshrc
echo '# TAP Documentation Organizer' >> ~/.zshrc
echo 'alias organize-docs="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh"' >> ~/.zshrc
echo 'alias organize-docs-dry="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh --dry-run"' >> ~/.zshrc

# Reload
source ~/.zshrc

# Test
organize-docs-dry
```

**For bash:**

```bash
# Add to ~/.bashrc
echo '# TAP Documentation Organizer' >> ~/.bashrc
echo 'alias organize-docs="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh"' >> ~/.bashrc
echo 'alias organize-docs-dry="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh --dry-run"' >> ~/.bashrc

# Reload
source ~/.bashrc

# Test
organize-docs-dry
```

**Adjust path if needed:**
If your repo is not at `~/workspace/active/total-audio-platform/`, update the path in the alias.

---

## 🔧 Troubleshooting

### "npm error Missing script"

**Problem:** You're in an app directory (like `apps/tracker/`) and running `npm run organize-docs`.

**Solution:** Either:

1. Go to monorepo root: `cd ../.. && npm run organize-docs`
2. Use the convenience script: `bash ../../scripts/organize-docs-from-anywhere.sh`
3. Set up the alias (recommended): `organize-docs`

### "Could not find monorepo root"

**Problem:** The convenience script can't find the root `package.json` with workspaces.

**Solution:** Make sure you're inside the `total-audio-platform/` directory tree.

### "Files aren't moving"

**Problem:** You ran with `--dry-run` flag.

**Solution:** Remove the `--dry-run` flag to actually move files:

```bash
organize-docs  # not organize-docs-dry
```

---

## 📊 What It Does

1. **Scans** all apps for loose `.md` files
2. **Categorizes** them:
   - `setup/` - Configuration, deployment, auth
   - `guides/` - Tutorials, how-tos
   - `reference/` - Technical specs, PRDs
   - `status/` - Completion reports (archive)
3. **Creates** `docs/` structure if needed
4. **Generates** `docs/README.md` indexes
5. **Preserves** root-level files (README.md, DESIGN_SYSTEM.md, etc.)

---

## ⚡ Daily Workflow

**Best practice:**

```bash
# 1. Set up alias once (see above)

# 2. Work on features, create .md files naturally
#    Don't worry about organization

# 3. Periodically (or when you notice clutter):
organize-docs-dry    # Preview
organize-docs        # Apply

# 4. Commit organized structure
git add apps/*/docs/
git commit -m "docs: organize documentation"
```

---

## 🎨 VS Code Integration (Optional)

Add tasks to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Organize Docs (Dry Run)",
      "type": "shell",
      "command": "bash scripts/organize-docs-from-anywhere.sh --dry-run",
      "problemMatcher": [],
      "group": "build"
    },
    {
      "label": "Organize Docs",
      "type": "shell",
      "command": "bash scripts/organize-docs-from-anywhere.sh",
      "problemMatcher": [],
      "group": "build"
    }
  ]
}
```

Then use `Cmd+Shift+P` → "Tasks: Run Task" → "Organize Docs"

---

## 📚 Further Reading

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete organizational standards
- **[AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md)** - What we built
- **[apps/tap-saas-template/docs/guides/KEEPING_DOCS_ORGANIZED.md](./apps/tap-saas-template/docs/guides/KEEPING_DOCS_ORGANIZED.md)** - Detailed guide

---

## 🎁 Bonus: Git Hooks

Auto-organize on every commit:

```bash
# From monorepo root
npm run install-hooks

# Now docs organize automatically when you commit .md files
```

---

## Summary

**Easiest way:** Set up the alias once, then just run `organize-docs` from anywhere.

```bash
# One-time setup (30 seconds)
echo 'alias organize-docs="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh"' >> ~/.zshrc
echo 'alias organize-docs-dry="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh --dry-run"' >> ~/.zshrc
source ~/.zshrc

# Daily use (5 seconds)
organize-docs-dry  # Preview
organize-docs      # Apply
```

Never worry about messy documentation again! 🎉
