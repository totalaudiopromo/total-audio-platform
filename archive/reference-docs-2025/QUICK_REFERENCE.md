# TAP Automation - Quick Reference Card

Keep this handy for daily use! 🚀

## 📚 Documentation Organizer

### ✅ Recommended Setup (One-Time)

```bash
# Add to your shell config (~/.zshrc or ~/.bashrc)
echo 'alias organize-docs="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh"' >> ~/.zshrc
echo 'alias organize-docs-dry="bash ~/workspace/active/total-audio-platform/scripts/organize-docs-from-anywhere.sh --dry-run"' >> ~/.zshrc
source ~/.zshrc
```

### 🎯 Daily Use (With Alias)

```bash
organize-docs-dry     # Preview changes (safe!)
organize-docs         # Apply organization
organize-docs tracker # Organize specific app
```

### 🔧 Without Alias

```bash
# From monorepo root:
npm run organize-docs:dry-run
npm run organize-docs

# From any directory:
bash scripts/organize-docs-from-anywhere.sh --dry-run
bash ../../scripts/organize-docs-from-anywhere.sh --dry-run  # adjust ../ as needed
```

---

## 🎨 Design System Standards

### Color Palette

- **Audio Intel / Pitch Generator:** Electric Blue (`#3b82f6`)
- **Playlist Pulse:** Neon Green (`#22c55e`)
- **Release Radar:** Orange/Amber (`#f59e0b`)
- **Trend Track:** Purple/Magenta (`#a855f7`)
- **Content Clone:** Hot Pink (`#ec4899`)
- **Success Predict:** Gold/Yellow (`#eab308`)

### Core Components

```css
.glass-panel      /* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
/* Main card container */
.cta-button       /* Primary action button */
.subtle-button    /* Secondary button */
.badge-postcraft; /* Status badge */
```

### Design Rules

- ✅ Solid colours, bold borders, hard shadows
- ✅ UK spelling (colour, personalised, organise)
- ❌ No gradients, no glassmorphism, no backdrop-blur

---

## 📁 Template Duplication

```bash
# Create new tool from template
cd apps/
cp -r tap-saas-template your-new-tool
cd your-new-tool

# Update these:
# 1. package.json - name field
# 2. app/layout.tsx - metadata
# 3. Brand colour throughout (blue → your colour)
# 4. supabase/schema.sql - tool tables
```

---

## 🔍 Finding Things

### Documentation

- **[ORGANIZE_DOCS_USAGE.md](./ORGANIZE_DOCS_USAGE.md)** - How to use organizer
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Monorepo structure
- **[DESIGN_SYSTEM.md](./apps/tap-saas-template/DESIGN_SYSTEM.md)** - Complete design guide
- **[TEMPLATE_USAGE.md](./apps/tap-saas-template/TEMPLATE_USAGE.md)** - How to duplicate template

### Each App's Docs

```
your-app/docs/
├── README.md       # Index of all docs
├── setup/          # Configuration guides
├── guides/         # How-to tutorials
├── reference/      # Technical specs
└── status/         # Historical reports
```

---

## 🚀 Common Tasks

### Starting New Feature

```bash
# Just create files naturally
touch FEATURE_NAME_COMPLETE.md

# Organize when done
organize-docs-dry  # Preview
organize-docs      # Apply
```

### Before Committing

```bash
organize-docs-dry  # Check what would change
organize-docs      # Clean up docs
git add apps/*/docs/
git commit -m "docs: organize documentation"
```

### Finding a Specific Doc

```bash
# Search in organized docs
find apps/*/docs -name "*keyword*"

# Example: Find all setup guides
find apps/*/docs/setup -name "*.md"
```

---

## 💡 Pro Tips

1. **Always run dry-run first:** `organize-docs-dry`
2. **Set up the alias:** Makes life way easier
3. **Keep root clean:** Only README.md and core docs at root
4. **Archive old status files:** Move to `docs/status/archive-YYYY/`
5. **Use descriptive filenames:** Helps auto-categorization

---

## 🆘 Quick Troubleshooting

| Problem                    | Solution                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `npm error Missing script` | You're in an app dir - use `bash ../../scripts/organize-docs-from-anywhere.sh` or go to root |
| Files not moving           | You ran with `--dry-run` - remove that flag                                                  |
| Can't find script          | Make sure you're inside the `total-audio-platform/` directory tree                           |
| Wrong category             | Manually move file or update patterns in `scripts/organize-docs.js`                          |

---

## 📞 Need Help?

- **Full usage guide:** `ORGANIZE_DOCS_USAGE.md`
- **Project structure:** `PROJECT_STRUCTURE.md`
- **Design system:** `apps/tap-saas-template/DESIGN_SYSTEM.md`
- **Automation summary:** `AUTOMATION_SUMMARY.md`

---

**TL;DR:** Run `organize-docs-dry` to preview, `organize-docs` to apply. Works from anywhere after setting up alias.
