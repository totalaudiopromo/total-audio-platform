# Campaign Tracker - Documentation

All documentation for the Campaign Tracker app, organised by category.

## Documentation Structure

### `/setup/` - Setup & Configuration

Guides for deployment and configuration:

- **[DEPLOYMENT_GUIDE.md](./setup/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[MIGRATION_INSTRUCTIONS.md](./setup/MIGRATION_INSTRUCTIONS.md)** - Database migration guide
- **[RUN_MIGRATION.md](./setup/RUN_MIGRATION.md)** - Migration execution scripts
- **[QUICK_DEPLOY.md](./setup/QUICK_DEPLOY.md)** - Fast deployment guide

### `/reference/` - Reference Documentation

Technical references and specifications:

- **[PSEO_STRATEGY_TRACKER.md](./reference/PSEO_STRATEGY_TRACKER.md)** - PSEO implementation strategy
- **[TAILWIND_V4_README.md](./reference/TAILWIND_V4_README.md)** - Tailwind v4 configuration notes
- **[README_PRD.md](./reference/README_PRD.md)** - Product requirements document

### `/status/` - Status Reports (Archive)

Historical completion reports:

- `AUTH_IMPLEMENTATION_COMPLETE.md` - Auth system completion
- `AUTH_SETUP_GUIDE.md` - Auth setup documentation
- `BUILD_COMPLETE.md` - Initial build completion
- `PSEO_BATCH_1_COMPLETE.md` - First PSEO batch completion
- `TRACKER_MVP_COMPLETE.md` - MVP milestone completion

> **Note:** Status files are kept for historical reference but are not actively maintained.

---

## Quick Start

For getting started, see the root-level documentation:

- **[README.md](../README.md)** - Main project overview
- **[QUICKSTART.md](../QUICKSTART.md)** - Quick start development guide

---

## Architecture

Campaign Tracker follows the TAP SaaS template structure:

```
tracker/
 app/                    # Next.js App Router
    (auth)/            # Auth pages (login, signup)
    api/               # API routes
    blog/              # PSEO blog pages
    dashboard/         # Main dashboard
    demo/              # Demo page
 components/            # React components
    analytics/        # Analytics components
    auth/             # Auth components
    campaigns/        # Campaign management
    ui/               # Reusable UI components
 lib/                   # Utilities and helpers
 supabase/              # Database migrations
 docs/                  # This documentation
```

---

## Documentation Standards

When adding new documentation:

1. **Setup guides** → `/docs/setup/`
   - Deployment instructions
   - Configuration guides
   - Integration setup

2. **How-to guides** → `/docs/guides/`
   - Feature tutorials
   - Usage examples
   - Best practices

3. **Reference docs** → `/docs/reference/`
   - Technical specs
   - Architecture docs
   - Strategy documents

4. **Status updates** → `/docs/status/`
   - Completion reports
   - Milestone records
   - Historical notes

---

## Development Workflow

1. **Local development:**

   ```bash
   npm run dev
   ```

2. **Database migrations:**
   See [MIGRATION_INSTRUCTIONS.md](./setup/MIGRATION_INSTRUCTIONS.md)

3. **Deployment:**
   See [DEPLOYMENT_GUIDE.md](./setup/DEPLOYMENT_GUIDE.md)

---

## Design System

Tracker inherits the Postcraft aesthetic from the TAP SaaS template:

- Clean black & white foundation
- Bold borders and offset shadows
- No gradients or glassmorphism
- Mobile-first responsive design
