# Total Audio Platform - Project Structure

This document outlines the professional structure and organization standards for the Total Audio Platform monorepo.

## 🏗️ Monorepo Structure

```
total-audio-platform/
├── apps/                           # Individual TAP tools (deployable apps)
│   ├── tap-saas-template/         # ⚠️ Clean template (never modify directly)
│   ├── pitch-generator/           # Pitch writing tool
│   ├── audio-intel/               # Contact research tool
│   ├── tracker/                   # Campaign tracking tool
│   ├── playlist-pulse/            # Playlist analytics
│   └── [future-tools]/            # Release Radar, Voice Echo, etc.
│
├── packages/                       # Shared packages (future)
│   └── shared-ui/                 # Shared React components
│
├── scripts/                        # Monorepo automation scripts
│   ├── organize-docs.js           # 🤖 Auto-organize documentation
│   ├── pre-commit-organize-docs.sh # Git hook for docs
│   ├── bootstrap-tap-template.sh  # Bootstrap new tools
│   └── clone-tap-template.js      # Duplicate template
│
├── docs/                           # Monorepo-level documentation
│   ├── business/                  # Business strategy & planning
│   ├── technical/                 # Technical architecture
│   └── guides/                    # Development guides
│
├── archive/                        # Old/deprecated code
└── tools/                          # Standalone utilities
```

---

## 📁 App-Level Structure

Each app follows this standard structure:

```
app-name/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages
│   ├── [feature]/         # Feature pages
│   ├── globals.css        # Global styles + design system
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── [feature]/        # Feature-specific components
│
├── lib/                   # Utilities & helpers
│   ├── supabase.ts       # Database client
│   └── [helpers].ts      # Utility functions
│
├── supabase/              # Database
│   └── migrations/       # SQL migration files
│
├── docs/                  # 📚 Organized documentation
│   ├── README.md         # Documentation index
│   ├── setup/            # Setup & configuration guides
│   ├── guides/           # How-to guides & tutorials
│   ├── reference/        # Technical references
│   └── status/           # Historical status reports (archive)
│
├── public/                # Static assets
├── README.md              # Main project overview
├── QUICKSTART.md          # Quick start guide (optional)
└── package.json           # Dependencies & scripts
```

---

## 📚 Documentation Organization

### Automated Organization

We use **automated documentation organization** to keep things tidy:

```bash
# Organize all apps
npm run organize-docs

# Preview changes (dry run)
npm run organize-docs:dry-run

# Organize specific app
node scripts/organize-docs.js tap-saas-template

# With verbose output
npm run organize-docs:verbose
```

### Documentation Categories

All `.md` files are automatically categorized:

| Category          | Purpose                      | Examples                                                            |
| ----------------- | ---------------------------- | ------------------------------------------------------------------- |
| **`/setup/`**     | Configuration & deployment   | `AUTH_SETUP.md`, `DEPLOYMENT_GUIDE.md`, `MIGRATION_INSTRUCTIONS.md` |
| **`/guides/`**    | How-to tutorials             | `QUICKSTART.md`, `GETTING_STARTED.md`                               |
| **`/reference/`** | Technical specs              | `API_REFERENCE.md`, `ARCHITECTURE.md`, `README_PRD.md`              |
| **`/status/`**    | Historical reports (archive) | `*_COMPLETE.md`, `*_FIXED.md`, `BUILD_STATUS.md`                    |

### Root-Level Docs (Never Moved)

These stay at the app root:

- `README.md` - Main project overview
- `DESIGN_SYSTEM.md` - Design standards (template only)
- `TEMPLATE_USAGE.md` - Template duplication guide (template only)
- `QUICKSTART.md` - Quick start guide
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE.md` - License
- `CHANGELOG.md` - Version history

---

## 🤖 Automation Features

### 1. Documentation Organizer

The `organize-docs.js` script automatically:

- ✅ Scans all apps for loose `.md` files
- ✅ Creates `docs/` structure with subdirectories
- ✅ Categorizes files based on naming patterns
- ✅ Generates `docs/README.md` index
- ✅ Preserves root-level documentation
- ✅ Provides dry-run mode for safety

### 2. Git Hooks (Optional)

Install pre-commit hook to auto-organize on commit:

```bash
npm run install-hooks
```

This automatically organizes docs when you commit `.md` files.

### 3. Template Duplication

Create new tools from the clean template:

```bash
# From apps/ directory
cp -r tap-saas-template your-new-tool

# Or use the automated script
node scripts/clone-tap-template.js your-new-tool
```

---

## 🎨 Design System Standards

All TAP tools follow the **Postcraft aesthetic**:

- ✅ Bold black borders (`border-2`, `border-4`)
- ✅ Hard offset shadows
- ✅ Solid colours (no gradients)
- ✅ Clean black & white foundation
- ✅ Tool-specific colour activation
- ✅ UK spelling throughout
- ❌ No glassmorphism
- ❌ No backdrop blur
- ❌ No soft shadows

See [`apps/tap-saas-template/DESIGN_SYSTEM.md`](./apps/tap-saas-template/DESIGN_SYSTEM.md) for complete standards.

---

## 🚀 Development Workflow

### Starting a New Tool

1. **Duplicate template:**

   ```bash
   cd apps/
   cp -r tap-saas-template my-new-tool
   cd my-new-tool
   ```

2. **Customise branding:**

   - Update `package.json` name
   - Change brand colour throughout
   - Update metadata in `app/layout.tsx`

3. **Develop features:**

   - Add tool-specific routes
   - Create feature components
   - Build API endpoints

4. **Keep docs organized:**

   - Run `npm run organize-docs` periodically
   - Or install git hooks for automation

5. **Deploy separately:**
   - Each tool gets its own deployment
   - Independent domains and databases

### Adding Documentation

Just create `.md` files in your app root, then run:

```bash
npm run organize-docs
```

The script will automatically categorize and move them to the right place.

---

## 📦 Package Management

### Monorepo Structure

We use **npm workspaces** for the monorepo:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

### Installing Dependencies

```bash
# Install all workspace dependencies
npm install

# Add dependency to specific app
npm install package-name -w app-name

# Example: Add a package to tracker
npm install date-fns -w tracker
```

---

## 🧹 Maintenance

### Regular Cleanup

Run these periodically:

```bash
# Organize documentation
npm run organize-docs

# Preview organization changes
npm run organize-docs:dry-run

# Check for outdated dependencies
npm outdated --workspaces
```

### Archive Old Files

Move deprecated code to `/archive/`:

```bash
mv apps/old-tool archive/old-tool/
```

---

## 📝 Naming Conventions

### Apps

- Use kebab-case: `audio-intel`, `playlist-pulse`
- Tool name should match product name
- No abbreviations: `tracker` not `trk`

### Files

- Components: PascalCase (`CampaignCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Pages: kebab-case (`blog/spotify-playlist-tracking/page.tsx`)
- Documentation: SCREAMING_SNAKE_CASE (`SETUP_GUIDE.md`)

### Git Commits

```
feat(audio-intel): add contact enrichment
fix(tracker): resolve auth redirect loop
docs: update project structure guide
chore: organize documentation files
```

---

## 🎯 Goals

1. **Professional organization** - Clean structure like Anthropic, Vercel, Linear
2. **Easy to navigate** - Any developer can find what they need
3. **Automated maintenance** - Scripts handle tedious tasks
4. **Consistent standards** - All tools follow same patterns
5. **Scalable** - Easy to add new tools

---

## 🤝 Contributing

When adding new features or tools:

1. ✅ Follow the app structure template
2. ✅ Use the design system standards
3. ✅ Keep documentation organized (run `npm run organize-docs`)
4. ✅ Use UK spelling in all user-facing text
5. ✅ Create meaningful git commits
6. ✅ Test locally before deploying

---

## 📚 Further Reading

- **[TAP SaaS Template](./apps/tap-saas-template/README.md)** - Template usage guide
- **[Design System](./apps/tap-saas-template/DESIGN_SYSTEM.md)** - Complete aesthetic guide
- **[Template Usage](./apps/tap-saas-template/TEMPLATE_USAGE.md)** - How to duplicate template

---

_Last updated: ${new Date().toISOString().split('T')[0]}_
_Maintained by: Total Audio Promo Engineering_
