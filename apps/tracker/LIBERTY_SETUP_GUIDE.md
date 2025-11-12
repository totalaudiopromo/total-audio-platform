# Liberty Music PR Tracker - Setup Guide

**Quick Start**: Get the Liberty campaign tracker running in 10 minutes.

---

## 🎯 What You're Setting Up

A production-ready Campaign Tracker with:
- **Real Liberty campaigns**: KYARA, Senior Dunce, Concerta
- **Integration badges**: Gmail, Mailchimp, Airtable, Monday, Drive, Sheets
- **WARM report uploader**: Drag-and-drop CSV/Excel parser
- **Activity timeline**: Real-time updates from all integrations
- **Contact management**: Status tracking and sync

---

## ✅ Step 1: Apply Database Migration (2 min)

The migration adds integration fields to your campaigns table and creates new tables for contacts, activities, metrics, and WARM reports.

### Option A: Using Supabase CLI (Recommended)

```bash
cd apps/tracker

# Apply migration to your Supabase project
npx supabase db push
```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20251119_tracker_production_schema.sql`
5. Paste and click **Run**

The migration is idempotent - it checks if columns/tables exist before adding them, so it's safe to run multiple times.

---

## ✅ Step 2: Import Liberty Campaign Data (1 min)

Import real campaigns with contacts, activities, and metrics:

```bash
cd apps/tracker

# Set your Supabase credentials (if not already in .env.local)
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run import script
npx tsx scripts/import-liberty-campaigns.ts
```

This creates:
- **KYARA "Bloodshot"**: 85 plays, Amazing Radio confirmed, 5 contacts, 7 activities
- **Senior Dunce "Bestial"**: 5 plays, Tom Robinson response, 3 contacts, 3 activities
- **Concerta "Consumption"**: 132 contacts ready, 2 activities, Airtable synced

---

## ✅ Step 3: Start Tracker (1 min)

```bash
# From root directory
npm run dev:tracker

# Or from tracker directory
cd apps/tracker
npm run dev
```

Opens on: **http://localhost:3001**

---

## 🎬 View Liberty Dashboard

### New Liberty-Specific Routes:

**Dashboard with integrations**:
```
http://localhost:3001/dashboard/liberty
```

**Campaign detail pages**:
```
http://localhost:3001/dashboard/liberty/[campaign-id]
```

### Existing Dashboard:

The original dashboard is still available at:
```
http://localhost:3001/dashboard
```

---

## 📊 What You'll See

### Dashboard (`/dashboard/liberty`)
- 3 Liberty campaigns with integration badges
- Stats cards (campaigns, contacts, plays, activities)
- Search and filter
- Create new campaign button

### Campaign Detail (`/dashboard/liberty/[id]`)
- **Timeline Tab**: All activities with integration sources (Gmail, Mailchimp, WARM)
- **Contacts Tab**: Contact list with status tracking
- **Metrics Tab**: Aggregated stats (plays, emails, opens)
- **Upload Tab**: WARM report uploader (drag-and-drop CSV/Excel)

### Integration Badges

Campaigns show color-coded badges for linked integrations:
- 📧 Gmail (red)
- 📬 Mailchimp (yellow)
- 📋 Monday (purple)
- 📊 Airtable (orange)
- 📁 Drive (blue)
- 📈 Sheets (green)

---

## 🔧 Troubleshooting

### Migration Fails

**Error**: "relation 'campaigns' does not exist"

**Fix**: Ensure you're running the migration on the correct Supabase project. Check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.

---

### Import Script Fails

**Error**: "Missing Supabase credentials"

**Fix**: Set environment variables:
```bash
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Get your service role key from Supabase Dashboard → Settings → API → service_role key.

---

### Can't See Liberty Routes

**Error**: 404 on `/dashboard/liberty`

**Fix**: Make sure you've restarted the dev server after creating the new route files:
```bash
# Kill the server (Ctrl+C)
npm run dev:tracker
```

---

### WARM Upload Not Working

**Error**: "Failed to parse WARM report"

**Fix**:
1. Check CSV/Excel format (requires columns: station, country, date)
2. Ensure file is < 10MB
3. Check browser console for detailed error messages

---

## 🎯 Demo Flow (10 minutes)

### 1. Dashboard Overview (0:00-2:00)
- Navigate to `/dashboard/liberty`
- Show 3 campaigns with integration badges
- Point out stats: 85 plays for KYARA, etc.

### 2. KYARA Campaign Deep Dive (2:00-4:00)
- Click "KYARA - Bloodshot"
- Show Timeline tab with 7 activities
- Point out integration sources (Gmail, Mailchimp, WARM)
- Highlight Amazing Radio confirmation

### 3. WARM Report Upload (4:00-6:00)
- Click "Upload WARM Report" tab
- Drag-and-drop demo CSV file
- Show parsing and auto-creation of activities
- View updated stats

### 4. Contacts & Integrations (6:00-8:00)
- Click "Contacts" tab
- Show 5 KYARA contacts with statuses
- Go to Concerta campaign
- Point out Airtable sync (132 contacts)

### 5. Multi-Campaign Management (8:00-10:00)
- Return to dashboard
- Switch between campaigns quickly
- Show Senior Dunce with Tom Robinson response
- Emphasize: "This is what we use for real Liberty campaigns"

---

## 📁 Files Created

### Database
```
supabase/migrations/20251119_tracker_production_schema.sql
```

### Integration Wrappers
```
lib/integrations/
├── gmail.ts          - Gmail integration
├── mailchimp.ts      - Mailchimp integration
├── airtable.ts       - Airtable bi-directional sync
└── warm-parser.ts    - CSV/Excel WARM report parser
```

### UI Components
```
components/
├── campaign-dashboard.tsx     - Dashboard grid view
├── campaign-detail.tsx        - Campaign detail page
└── warm-report-uploader.tsx   - Drag-and-drop uploader
```

### Pages (New Routes)
```
app/dashboard/liberty/
├── page.tsx              - Liberty dashboard
└── [id]/page.tsx         - Campaign detail page
```

### API Routes
```
app/api/tracker/warm/upload/route.ts  - WARM upload API
```

### Scripts
```
scripts/import-liberty-campaigns.ts   - Import real campaign data
```

### Types
```
lib/db/types.ts  - Complete TypeScript types
```

---

## 🚀 Next Steps

### Immediate (Demo Ready)
- ✅ Migration applied
- ✅ Data imported
- ✅ Dashboard working
- ✅ WARM uploader functional

### Next (Optional Enhancements)
- [ ] Add Monday.com integration wrapper
- [ ] Create integration API routes (link, sync, etc.)
- [ ] Build webhook endpoints for real-time logging
- [ ] Add integration settings page (OAuth management)
- [ ] Create Typeform import from Liberty submissions

### Production (Deployment)
- [ ] Set up production Supabase project
- [ ] Configure environment variables in Vercel
- [ ] Add Google OAuth for Gmail/Drive/Sheets
- [ ] Set up Mailchimp API keys
- [ ] Configure Airtable API access
- [ ] Deploy to production

---

## 💡 Key Features

### What's Working Now
✅ Database schema with integration fields
✅ Campaign dashboard with integration badges
✅ Campaign detail pages with timeline/contacts/metrics
✅ WARM report uploader (CSV/Excel)
✅ Real Liberty campaign data (KYARA, Senior Dunce, Concerta)
✅ Activity logging with integration sources
✅ Contact management with status tracking

### What Needs Integration Setup
⚠️ Gmail auto-logging (needs OAuth token)
⚠️ Mailchimp stats sync (needs API key)
⚠️ Airtable bi-directional sync (needs API key)
⚠️ Google Drive upload (needs service account)
⚠️ Monday.com integration (needs API token)

---

## 🔗 Integration Setup (Optional)

To enable live integrations, add these to `.env.local`:

```env
# Gmail
GOOGLE_GMAIL_ACCESS_TOKEN=your_oauth_token

# Mailchimp
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_SERVER_PREFIX=us19

# Airtable
AIRTABLE_API_KEY=your_api_key

# Google Drive
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Monday.com (if you want to add it)
MONDAY_API_TOKEN=your_api_token
```

---

## 📞 Support

**Issues**: Check `TRACKER_PRODUCTION_BUILD_COMPLETE.md` for detailed documentation.

**Questions**:
- Database schema: See migration file comments
- Integration APIs: See wrapper file JSDoc comments
- Component props: See TypeScript types in `lib/db/types.ts`

---

**You're ready to demo! 🚀**

Navigate to `http://localhost:3001/dashboard/liberty` after completing steps 1-3.
