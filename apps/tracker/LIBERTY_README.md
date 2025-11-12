# 🎵 Campaign Tracker - Liberty Music PR Setup

Production-ready campaign tracker with real Liberty Music PR campaign data and integrations.

## ✅ What's Complete

- ✅ Server running on http://localhost:3000
- ✅ Supabase credentials configured (.env.local)
- ✅ Module resolution fixed (pnpm)
- ✅ Database migration script ready
- ✅ Liberty campaign import script ready
- ✅ All UI components and routes built

## 🚀 Quick Start (After Migration)

Once you've applied the database migration in Supabase:

```bash
# Import Liberty campaigns
pnpm import:liberty

# View dashboard
open http://localhost:3000/dashboard/liberty
```

## 📊 Liberty Campaigns Included

### 1. KYARA "Bloodshot"
- **Genre**: Electronic / Dance
- **Status**: Active pre-release push
- **Contacts**: 5 (Triple J, Triple R, PBS FM, Amazing Radio, BBC Radio 1)
- **Plays**: 85 plays across 9 countries
- **Highlights**: Amazing Radio UK confirmed support

### 2. Senior Dunce "Bestial"
- **Genre**: Rock / Alternative
- **Status**: Active UK expansion
- **Contacts**: 3 (BBC Radio 6 Music, Tom Robinson, XS Manchester)
- **Plays**: 5 confirmed plays
- **Highlights**: Tom Robinson positive response

### 3. Concerta "Consumption"
- **Genre**: Electronic / Experimental
- **Status**: Active European campaign
- **Contacts**: 132 (Airtable synced)
- **Highlights**: South Korean artist breaking European market

## 📁 Routes

- `/dashboard/liberty` - Liberty campaigns dashboard
- `/dashboard/liberty/[id]` - Campaign detail view
  - Timeline tab (activities)
  - Contacts tab (radio contacts)
  - Metrics tab (plays, emails, opens)
  - WARM Reports tab (upload CSV/Excel)

## 🔧 Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm import:liberty   # Import Liberty campaign data
pnpm check:schema     # Verify database tables exist
pnpm migrate          # Apply database migration (if automatic works)
pnpm typecheck        # TypeScript validation
pnpm lint             # Code linting
pnpm test             # Run Playwright tests
```

## 🗄️ Database Schema

Tables created by migration:

- `campaigns` - Campaign information + integration fields
- `campaign_contacts` - Radio contacts per campaign
- `campaign_activities` - Timeline events (emails, plays, milestones)
- `campaign_metrics` - Aggregated metrics (plays, email stats)
- `warm_reports` - Radio play submission uploads

## 🔌 Integrations (Ready to Connect)

Tracker includes integration wrappers for:

- **Gmail API** - Link campaigns to labels, auto-detect replies
- **Mailchimp** - Sync email campaign stats
- **Airtable** - Bi-directional contact sync
- **WARM Reports** - Parse CSV/Excel radio play submissions
- **Monday.com** - Board sync (wrapper ready)
- **Google Sheets** - Live reporting (optional)

Integration fields added to campaigns table:
- `gmail_label`
- `mailchimp_campaign_id`
- `monday_board_id`
- `drive_folder_id`
- `airtable_base_id`
- `airtable_table_id`
- `sheets_report_id`

## 📝 Environment Variables

Required (already configured in `.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
NODE_ENV=development
```

Optional (for live integrations):
```bash
GOOGLE_GMAIL_ACCESS_TOKEN=***
MAILCHIMP_API_KEY=***
AIRTABLE_API_KEY=***
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## 🎯 Demo User

Import script creates:
- **Email**: demo@libertymusicpr.com
- **Company**: Liberty Music PR
- **Purpose**: Demo account with real campaign data

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run specific test
pnpm test tests/dashboard.spec.ts
```

## 📚 Documentation

- `LIBERTY_SETUP_GUIDE.md` - Complete 10-minute setup walkthrough
- `MIGRATION_INSTRUCTIONS.md` - Database migration steps
- `supabase/migrations/20251119_tracker_production_schema.sql` - Full schema

## 🔒 Security

- Row Level Security (RLS) policies enabled
- Service role key only used server-side
- User can only see their own campaigns
- Demo user isolated from production data

## 🎨 UI Components

Built with:
- **Next.js 15.3.0** - App Router with Server Components
- **React 19.1.0** - Latest React features
- **Tailwind CSS** - Total Audio design system
- **Headless UI** - Accessible components
- **Lucide Icons** - Modern iconography

## 🚀 Next Steps

1. ✅ Server running
2. ⏳ Apply database migration (you're handling this)
3. ⏳ Run `pnpm import:liberty`
4. ⏳ View dashboard at `/dashboard/liberty`
5. ⏳ Test WARM report upload
6. ⏳ Connect live integrations (optional)

## 📞 Support

Chris Schofield - Liberty Music PR
- **Location**: Brighton, UK
- **Experience**: 5+ years radio promotion
- **Notable**: BBC Radio 6 Music, Triple J, Amazing Radio campaigns

---

**Built for**: Liberty Music PR Demo (October 2025)
**Purpose**: Campaign tracker with real integration data
**Status**: Production-ready, awaiting migration
