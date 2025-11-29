# Total Audio Platform

> AI-powered music promotion tools for UK industry professionals - Customer acquisition phase

## Quick Start

**Daily workflow:**`code WEEKLY_FOCUS.md` - Your main priorities and progress tracker

**Business context:**`code AUDIO_INTEL_CONTEXT.md` - Complete product and customer info

**Quick capture:**`code BUSINESS_NOTES.md` - Running log of ideas and feedback

## Live Applications

- **[Audio Intel](https://intel.totalaudiopromo.com)**- Contact enrichment & validation (PRIMARY REVENUE FOCUS)
- **[Pitch Generator](https://pitch.totalaudiopromo.com)**- AI-powered personalised pitch writing
- **[Campaign Tracker](https://tracker.totalaudiopromo.com)**- Radio promotion campaign management

## Current Focus (November 2025)

- **Phase**: Customer Acquisition (All apps production-ready)
- **Target**: First £500/month recurring revenue
- **Priority**: Radio promoter outreach (85% conversion rate)
- **Key Product**: Audio Intel - "15 hours → 15 minutes" contact research

## Automated Documentation

Keep your codebase professionally organized:

```bash
# Organize all documentation across all apps
npm run organize-docs

# Preview changes (dry-run)
npm run organize-docs:dry-run
```

The script automatically categorizes and organizes `.md` files into proper `docs/` structure.

**Full guide:**[`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md)

## Directory Structure

```
total-audio-platform/
 WEEKLY_FOCUS.md              # Daily priorities and progress
 AUDIO_INTEL_CONTEXT.md       # Complete business context
 BUSINESS_NOTES.md            # Running log and ideas

 apps/                        # Live production applications
    audio-intel/            # PRIMARY: Contact enrichment SaaS
    pitch-generator/        # AI pitch generation tool
    tracker/                # Campaign management CRM
    command-centre/         # Internal ops dashboard
    web/                    # Marketing website

 tools/                       # Development tools
    agents/                 # AI agents (31+ active)
    scripts/                # Utility scripts
    workflows/              # Automation

 docs/                        # Documentation
    setup/                  # Setup guides
    reference/              # Technical reference

 archive/                     # Historical files
```

## Development Commands

```bash
# Audio Intel (PRIMARY REVENUE FOCUS)
npm run dev:audio-intel         # Development server (port 3000)
npm run test:mobile             # Mobile testing suite
npm run build:audio-intel       # Production build

# Pitch Generator
npm run dev:pitch-generator     # Development server (port 3004)
npm run build:pitch-generator   # Production build

# Campaign Tracker
npm run dev:tracker             # Development server (port 3001)
npm run build:tracker           # Production build

# Testing & Quality
npm run test:audio-intel        # Full test suite
npm run typecheck:audio-intel   # TypeScript validation
```

## AI Agents & Automation

- **Agent OS**: Integrated development workflows (`/.agent-os/`)
- **31+ Active Agents**: Customer acquisition and development support (`/tools/agents/`)
- **MCP Integration**: 14+ servers for workflow automation

## Production Status (November 2025)

- **Live Apps**: 3 production deployments (Audio Intel, Pitch Generator, Tracker)
- **Infrastructure**: Vercel + Supabase, hourly health checks, auto-rollback
- **Quality**: 100% contact enrichment success rate (BBC Radio 1, Spotify validated)
- **Mobile**: Professional UX across all apps, comprehensive test coverage
- **Revenue Model**: FREE/PRO(£19)/AGENCY(£79) validated pricing
- **CI/CD**: Automated Golden Verification Pipeline with Telegram notifications

## Customer Segments

1. **Radio Promoters**- 85% conversion (highest priority)
2. **Solo Artists**- 60% conversion
3. **PR Agencies**- 70% conversion

## CI/CD & Monitoring

- **Automated Deployments**: Vercel integration with GitHub Actions
- **Health Checks**: Hourly verification, failure-only notifications
- **Daily Summary**: 8am GMT consolidated status report
- **Auto-Rollback**: Automatic rollback on health check failures
- **Monitoring**: Telegram notifications for all critical events

## Next Milestones

1. **First Paying Customer**- Radio promoter segment (highest conversion)
2. **£500/month MRR**- Sustainable revenue validation
3. **Case Study Distribution**- BBC Radio 1 & Spotify success stories
4. **Newsletter Growth**- "The Unsigned Advantage" subscriber expansion

---

**Built by Chris Schofield**| 5+ years radio promotion experience | [Audio Intel](https://intel.totalaudiopromo.com) · [Pitch Generator](https://pitch.totalaudiopromo.com) · [Tracker](https://tracker.totalaudiopromo.com)
