# Keeping Documentation Organized

A guide to using the automated documentation organizer for TAP apps.

## The Problem

As you build, you create lots of `.md` files:

- `AUTH_SETUP_COMPLETE.md`
- `MOBILE_FIXES_DONE.md`
- `NEW_FEATURE_README.md`
- `DEPLOYMENT_GUIDE.md`

Without organization, they clutter your app root and make it hard to find what you need.

## The Solution

We've automated documentation organization with a smart script that:

- Scans your app for `.md` files
- Categorizes them based on their purpose
- Moves them to proper subdirectories
- Generates documentation indexes
- Preserves important root-level files

---

## Quick Usage

### Organize All Apps

```bash
# From monorepo root
npm run organize-docs
```

This scans all apps in `/apps/` and organizes their documentation.

### Preview Changes (Dry Run)

```bash
npm run organize-docs:dry-run
```

Shows what would be moved without actually moving files. Safe to run anytime.

### Organize Specific App

```bash
node scripts/organize-docs.js tap-saas-template
node scripts/organize-docs.js tracker
node scripts/organize-docs.js audio-intel
```

### Verbose Output

```bash
npm run organize-docs:verbose
```

Shows detailed information about every file moved.

---

## How It Works

### 1. File Categorization

The script automatically categorizes files based on naming patterns:

| Category       | Patterns                                             | Examples                                                           |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| **setup/**     | `*SETUP*`, `*DEPLOYMENT*`, `*MIGRATION*`, `*OAUTH*`  | `AUTH_SETUP.md`, `DEPLOYMENT_GUIDE.md`, `RUN_MIGRATION.md`         |
| **guides/**    | `*QUICKSTART*`, `*TUTORIAL*`, `*HOW_TO*`             | `QUICKSTART.md`, `HOW_TO_DEPLOY.md`                                |
| **reference/** | `*README_*`, `*STRATEGY*`, `*ARCHITECTURE*`, `*PRD*` | `README_PRD.md`, `PSEO_STRATEGY.md`, `API_REFERENCE.md`            |
| **status/**    | `*COMPLETE*`, `*FIXED*`, `*SUMMARY*`, `*REPORT*`     | `BUILD_COMPLETE.md`, `TEXT_COLORS_FIXED.md`, `BATCH_1_COMPLETE.md` |

### 2. Protected Files

These files **never** move (stay at root):

- `README.md`
- `DESIGN_SYSTEM.md`
- `TEMPLATE_USAGE.md`
- `QUICKSTART.md`
- `CONTRIBUTING.md`
- `LICENSE.md`
- `CHANGELOG.md`

### 3. Structure Creation

If your app doesn't have a `docs/` directory, the script creates:

```
your-app/
└── docs/
    ├── README.md        # Generated index
    ├── setup/           # Configuration & deployment
    ├── guides/          # Tutorials & how-tos
    ├── reference/       # Technical specs
    └── status/          # Historical reports (archive)
```

### 4. Documentation Index

A `docs/README.md` is automatically generated with:

- Links to all subdirectories
- Explanation of each category
- Quick start guide
- Documentation standards

---

## Workflow Integration

### Option 1: Run Periodically

Run manually when you notice `.md` files piling up:

```bash
npm run organize-docs
```

### Option 2: Git Pre-Commit Hook

Auto-organize on every commit:

```bash
# Install the hook
npm run install-hooks

# Now docs organize automatically when you commit .md files
```

### Option 3: CI/CD Pipeline

Add to your GitHub Actions workflow:

```yaml
- name: Organize Documentation
  run: npm run organize-docs

- name: Commit organized docs
  run: |
    git config user.name "Docs Organizer Bot"
    git config user.email "bot@totalaudiopromo.com"
    git add apps/*/docs/
    git commit -m "docs: auto-organize documentation" || true
    git push
```

---

## Examples

### Before

```
tracker/
├── AUTH_IMPLEMENTATION_COMPLETE.md
├── AUTH_SETUP_GUIDE.md
├── BUILD_COMPLETE.md
├── DEPLOYMENT_GUIDE.md
├── MIGRATION_INSTRUCTIONS.md
├── PSEO_BATCH_1_COMPLETE.md
├── PSEO_STRATEGY_TRACKER.md
├── QUICK_DEPLOY.md
├── README.md
├── README_PRD.md
├── RUN_MIGRATION.md
├── TAILWIND_V4_README.md
├── TRACKER_MVP_COMPLETE.md
├── app/
└── components/
```

### After

```
tracker/
├── README.md
├── QUICKSTART.md
├── app/
├── components/
└── docs/
    ├── README.md                           # Generated index
    ├── setup/
    │   ├── DEPLOYMENT_GUIDE.md
    │   ├── MIGRATION_INSTRUCTIONS.md
    │   ├── QUICK_DEPLOY.md
    │   └── RUN_MIGRATION.md
    ├── reference/
    │   ├── PSEO_STRATEGY_TRACKER.md
    │   ├── README_PRD.md
    │   └── TAILWIND_V4_README.md
    └── status/
        ├── AUTH_IMPLEMENTATION_COMPLETE.md
        ├── AUTH_SETUP_GUIDE.md
        ├── BUILD_COMPLETE.md
        ├── PSEO_BATCH_1_COMPLETE.md
        └── TRACKER_MVP_COMPLETE.md
```

---

## Troubleshooting

### File Not Moving

If a file doesn't get categorized:

- It moves to `reference/` by default
- You can manually move it to the correct directory
- Or update the categorization patterns in `scripts/organize-docs.js`

### File Already Exists

If target already exists, the script skips it with a message:

```
⏭️  Skipped: AUTH_SETUP.md (already exists in docs/setup/)
```

### Wrong Category

If a file goes to the wrong category:

1. Manually move it to the right place
2. Update the pattern matching in `scripts/organize-docs.js`
3. Submit a PR to improve the categorization

---

## Benefits

### For Solo Developers

- ✅ Quick cleanup of cluttered directories
- ✅ Easy to find documentation later
- ✅ Professional project structure

### For Teams

- ✅ Consistent organization across all apps
- ✅ New developers can navigate easily
- ✅ Standards enforced automatically

### For Open Source

- ✅ Contributors know where to add docs
- ✅ Clear structure for documentation
- ✅ Professional appearance

---

## Best Practices

### 1. Run After Major Milestones

```bash
# After completing a feature
git add .
git commit -m "feat: add new payment system"

# Organize any new docs created
npm run organize-docs
git add apps/*/docs/
git commit -m "docs: organize documentation"
```

### 2. Use Descriptive Filenames

Good names help with auto-categorization:

- ✅ `STRIPE_SETUP_GUIDE.md` → moves to `setup/`
- ✅ `USER_AUTH_COMPLETE.md` → moves to `status/`
- ❌ `NOTES.md` → goes to `reference/` (too vague)

### 3. Archive Historical Docs

Move old status reports to an archive:

```bash
mkdir docs/status/archive-2024
mv docs/status/*_COMPLETE.md docs/status/archive-2024/
```

### 4. Keep Root Clean

Only these at root:

- `README.md` - Main overview
- `QUICKSTART.md` - Getting started (optional)
- `CONTRIBUTING.md` - For open source (optional)

Everything else goes in `docs/`.

---

## Customization

To customize categorization, edit `scripts/organize-docs.js`:

```javascript
const CATEGORIES = {
  setup: [
    /auth.*setup/i,
    /setup.*guide/i,
    /your.*custom.*pattern/i, // Add your pattern
  ],
  // ... other categories
};
```

---

## Summary

- 🤖 **Automated:** One command organizes everything
- 🛡️ **Safe:** Dry-run mode previews changes
- 📊 **Smart:** Categorizes based on filenames
- 🎯 **Consistent:** Same structure across all apps
- ⚡ **Fast:** Organizes entire monorepo in seconds

Keep your docs organized. Your future self will thank you.

---

**Next:** Read [PROJECT_STRUCTURE.md](../../../PROJECT_STRUCTURE.md) for complete organizational standards.
