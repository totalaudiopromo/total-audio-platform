# 📝 BUSINESS NOTES - RUNNING LOG

_Capture everything here, process into actions weekly_

## 📅 NOVEMBER 2025

### Week of Nov 20th - Git Repository Cleanup & Demo Fixes

**Git Cleanup Solution for PR Deployment Failures:**

**Problem:** PR #15 failed with 75 files (67 unrelated Chrome/cache files)
**Root Cause:** 6,454 Chrome profile files tracked in Git (2GB bloat)

**Solution Implemented:**

1. Updated `.gitignore` with comprehensive browser patterns
2. Removed Chrome files: `git rm -r --cached tools/browser-automation/.chrome-profile/`
3. Created pre-commit hook to prevent future contamination
4. Archived demo files to `archive/data/demo/` and `archive/liberty-demo/`
5. **Result:** 2GB repository size reduction, clean PRs deploy successfully

**Future Prevention:**

```bash
# If Chrome files sneak in again:
git rm -r --cached tools/browser-automation/.chrome-profile/
git add .gitignore
git commit -m "chore: Remove Chrome profile from Git"
```

### Week of Nov 9th - Phase 9: Autonomous Revenue Ops & Feedback Loops

**Implementation Complete:**

- ✅ Database migration: `20251109_agent_observability.sql` (3 tables, 3 views, 6 RLS policies)
- ✅ Agent observability script: `scripts/agent-observability.ts` (nightly health checks)
- ✅ Growth reflex script: `scripts/growth-reflex.ts` (weekly revenue correlation analysis)
- ✅ Feedback digest script: `scripts/feedback-digest.ts` (weekly AI-powered feedback analysis)
- ✅ GitHub Actions: 3 automated workflows (agent-health.yml, growth-reflex.yml, feedback-digest.yml)
- ✅ FeedbackButton component: `packages/ui/src/components/FeedbackButton.tsx` (thumbs up/down UI)
- ✅ Feedback API: `apps/audio-intel/app/api/feedback/route.ts` (POST/GET endpoints)
- ✅ Environment validation: Added Phase 9 feature flags to `packages/core-db/src/utils/env.ts`

**Technical Architecture:**

**Database Tables:**

- `agent_events`: Records every agent execution with latency/success metrics
- `feedback_events`: Captures user thumbs up/down feedback with optional comments
- `conversion_events`: Tracks conversion events with revenue attribution

**Monitoring Scripts:**

- **agent-observability.ts**: Compares 24h metrics vs 7-day baseline, alerts on degradation (PASS/WARN/FAIL)
- **growth-reflex.ts**: Correlates feature usage with revenue impact, identifies top drivers (strong/moderate/weak)
- **feedback-digest.ts**: Uses Claude 3.5 Sonnet to analyze negative feedback, generates insights and recommendations

**Automation:**

- **Nightly (02:00 UTC)**: Agent health check → Telegram notification
- **Weekly Mondays (09:00 UTC)**: Growth reflex report → Telegram + artifact upload
- **Weekly Fridays (16:00 UTC)**: Feedback digest with Claude analysis → Telegram with urgency detection

**Feature Flags:**

- `FEATURE_AGENT_OBSERVABILITY_ENABLED` (default: false)
- `FEATURE_GROWTH_REFLEX_ENABLED` (default: false)
- `FEATURE_FEEDBACK_DIGEST_ENABLED` (default: false)

**Success Criteria Target:**

- Build Pass Rate: 100%
- Telegram Notifications: 3 successful reports in 24h
- Claude Insight Digest: Received on Friday
- Agent Events Latency: <2s avg
- User Feedback Captured: ≥5 test events
- Revenue Correlation Detected: ≥1 feature driver identified

**Git Tag:** `v2.4.0-phase9-autonomous-ops`

**Philosophy:**

- Zero user-facing changes (all backend observability)
- Additive-only database migrations (no DROP/ALTER)
- Unified Telegram notification system (reuses existing infrastructure)
- AI-powered insights (Claude for feedback analysis)
- Baseline comparison for anomaly detection

**Next Actions:**

1. ⏳ Run dry-run tests for all three monitoring scripts
2. ⏳ Deploy database migration to production Supabase
3. ⏳ Enable GitHub Actions workflows with secrets
4. ⏳ Test FeedbackButton component in Audio Intel app
5. ⏳ Monitor first week of automated reports
6. ⏳ Create git tag `v2.4.0-phase9-autonomous-ops`

---

## 📅 OCTOBER 2025

### Week of Oct 21st - SEO & LLM Visibility Improvements

**SEO Infrastructure Complete:**

- ✅ Created comprehensive SEO asset generator (`scripts/generate-seo-assets.js`)
- ✅ Generated favicons for all apps (16x16, 32x32, ico, apple-touch-icon)
- ✅ Generated OG images for all apps (1200x630 with mascot logos)
- ✅ Updated Tracker layout.tsx with complete SEO meta tags
- ✅ Added robots.txt with LLM crawler permissions to all apps

**Assets Generated:**

- **Audio Intel**: Favicons + OG image (DJ dog with speakers)
- **Pitch Generator**: Favicons + OG image (DJ dog with speakers)
- **Tracker**: Favicons + OG image (detective dog with magnifying glass)

**LLM Crawler Support:**

- Allowed: GPTBot, Claude-Web, anthropic-ai, CCBot, PerplexityBot, Google-Extended
- Purpose: Enable ChatGPT/Claude/Perplexity to recommend Total Audio in search results

**Critical Issue Identified - V0 Session Privacy:**

- **Problem**: V0.dev session showing up in Google search results for "Total Audio"
- **Impact**: V0 link outranking actual product sites (intel.totalaudiopromo.com, pitch.totalaudiopromo.com)
- **Prevention**: Never share V0 session links publicly (Twitter, Discord, etc.)
- **Action Required**: Delete or make private the exposed V0 session

**Google Search Console Setup Complete (Oct 23):**

- ✅ All three domains verified via Google Tag Manager
- ✅ Sitemaps submitted for all domains:
  - intel.totalaudiopromo.com/sitemap.xml (22+ pages including blog)
  - pitch.totalaudiopromo.com/sitemap.xml (public pages only - gated app)
  - tracker.totalaudiopromo.com/sitemap.xml (public pages only - gated app)
- ✅ Page indexing monitoring enabled
- ✅ Search performance tracking active

**Indexing Status:**

- **Audio Intel**: 22+ pages submitted, strong SEO position (blog content + public pages)
- **Pitch Generator**: Public pages only (homepage, pricing, about) - gated app
- **Tracker**: Public pages only (homepage, pricing, about) - gated app

**Timeline for Data:**

- 0-24 hours: Google crawling sitemaps
- 1-2 days: Page indexing data available
- 3-7 days: Search performance data begins accumulating

**Remaining Actions:**

1. ❌ User to handle V0 session privacy (delete or contact Vercel support)
2. ⏳ Wait 2-3 days for initial GSC data to populate (Oct 25-26)
3. 📊 Check Pages report to ensure key pages indexed
4. 🎯 Request indexing for most important landing pages
5. 📈 Monitor LLM visibility monthly (ChatGPT/Claude/Perplexity searches)
6. 📝 Consider adding public blog content to Pitch Generator and Tracker for better SEO
7. 🚀 Implement LLM-friendly content strategy (see earlier conversation)

---

## 📅 SEPTEMBER 2025

### Week of Sept 30th - Major Consolidation Session

**Technical Completed:**

- ✅ Liberty training data processed: 39,883 messages, 4,560 campaign patterns
- ✅ MCP infrastructure cleanup: Removed broken Calendar/Chat MCPs
- ✅ Confirmed working MCPs: Gmail, Drive, Notion, Puppeteer, GitHub, YouTube

**Content Strategy Fixed:**

- ✅ Removed all false BBC Radio 1 placement claims (no actual Radio 1 plays)
- ✅ Removed weak metrics (33 plays across low-quality stations not marketing material)
- ✅ Reframed to process benefits: time savings (15hrs→3min), accuracy (60%→94%), response rates (8%→35%)
- ✅ 43 content pieces updated with authentic positioning

**Key Decisions:**

1. Stop debugging infrastructure - use what works, focus on customer acquisition
2. Only use defensible claims - 5+ years experience, BBC Radio 6 Music pitches, real time savings
3. Lead with process benefits, not vanity metrics
4. Authentic positioning: Brighton producer (sadact), uses tool daily

**Ready to Launch:**

- 43 content pieces (LinkedIn, Twitter, Bluesky, Threads, email, blog, pSEO)
- 4-week content deployment schedule
- Radio promoter demo script refined
- Liberty training data accessible for agent context

**Next Actions (Tuesday Oct 1):**

- Create radio promoter outreach list (10 prospects)
- Set up demo booking calendar
- Deploy first social content (LinkedIn + Twitter)
- Write newsletter issue #1

---

### Week of Sept 23rd

**Content Ideas:**

- ~~BBC Radio 1 case study content~~ (FALSE CLAIM - REMOVED)
- ✅ Process benefits messaging (time savings, accuracy, response rates)
- ✅ "15 hours → 15 minutes" value prop validated
- ✅ Founder authenticity (Brighton producer, 5+ years real experience)

**Outreach Insights:**

- Radio promoters are highest conversion segment (85%)
- Need personal, industry-credibility-based outreach
- Demo process: 5-10 prospect contacts, live enrichment, value calculation

**Demo Call Notes:**

- No demos yet - launching outreach this week

---

## 🔄 PROCESS WEEKLY

_Move important items to WEEKLY_FOCUS.md or AUDIO_INTEL_CONTEXT.md_

### Items to Move to Next Week's Focus:

- [ ]

### Items to Update in Audio Intel Context:

- [ ]

---

## 📊 CONVERSION DATA LOG

_Track real conversion rates and feedback_

### Radio Promoters

- Outreach attempts:
- Responses:
- Demo calls booked:
- Conversions:

### Solo Artists

- Content engagement:
- Trial signups:
- Conversions:

### PR Agencies

- LinkedIn outreach:
- Demo interest:
- Conversions:

---

## 💡 FUTURE IDEAS PARKING LOT

_Good ideas that aren't immediate priorities_

-
-
- ***

  _Quick capture format - just dump thoughts here, organise weekly_

---

## 📅 NOVEMBER 2025 - Week of Nov 11th

### ✅ PHASE 11: UNIFIED INTELLIGENCE - COMPLETE (2025-11-11)

**Integration**: Golden Verify health checks + @total-audio/testing results → Command Centre Ops Console
**Status**: ✅ Implementation complete, ready for production deployment
**Completion Date**: Monday, November 11, 2025

**What Was Accomplished:**

1. **Database Schema (Supabase)**
   - Created `golden_history` table: Stores deployment health checks from Golden Verify workflow
   - Created `testing_results` table: Stores component testing results from @total-audio/testing agents
   - Created 2 summary views: `golden_summary` and `testing_summary` for dashboard queries
   - Added helper functions: `get_latest_golden_status()` and `get_testing_pass_rate()`
   - Implemented 6 RLS policies for secure access (service role + authenticated users)
   - Inserted sample data for UI testing (4 Golden + 5 Testing records)

2. **Ingestion Pipeline**
   - Created `scripts/golden-intelligence.ts`: Reads `test-deployment-*.md` files → writes to Supabase
   - Parses Golden Verify health checks (deployment status, lighthouse scores, tests passed/failed)
   - Parses Testing results (component analysis, pass rates, issues found)
   - Runs via GitHub Actions after each deployment
   - Manual trigger: `pnpm tsx scripts/golden-intelligence.ts`

3. **Command Centre API Routes**
   - `/api/ops-console/golden/route.ts`: Returns Golden Verify history, summary, latest status
   - `/api/ops-console/testing/route.ts`: Returns Testing results, summary, pass rate
   - Both use Supabase service role for server-side access
   - Response format: JSON with historical data + summary stats

4. **Command Centre Dashboard UI**
   - `/app/(dashboard)/ops-console/golden/page.tsx`: Golden Verify results page
   - `/app/(dashboard)/ops-console/testing/page.tsx`: Testing results page
   - Displays real-time deployment health and testing metrics
   - Historical trend analysis and pass rate tracking

**Architecture:**

```
┌─────────────────────────────────────┐
│  Golden Verify Workflow (GitHub)    │
│  - Runs post-deployment checks      │
│  - Generates test-deployment-*.md   │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  golden-intelligence.ts (Script)    │
│  - Reads deployment reports         │
│  - Parses health + testing data     │
│  - Writes to Supabase               │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Supabase Database                  │
│  - golden_history table             │
│  - testing_results table            │
│  - Summary views                    │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Command Centre API Routes          │
│  - /api/ops-console/golden          │
│  - /api/ops-console/testing         │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Command Centre Dashboard UI        │
│  - Real-time ops data               │
│  - Historical trends                │
│  - Pass rate tracking               │
└─────────────────────────────────────┘
```

**Local Verification Results:**

- ✅ Database migration applied successfully
- ✅ Sample data inserted and queryable
- ✅ Ingestion script runs without errors
- ✅ API routes return valid JSON
- ✅ Dashboard UI displays data correctly
- ✅ No TypeScript errors or build failures

**Ready for Production:**

All components tested locally and working. Next steps:

1. Push Phase 11 changes to main branch
2. Verify CI passes (lockfile synchronized)
3. Verify Vercel auto-deploys Command Centre
4. Run Golden Verify workflow and check ingestion
5. Confirm data appears in Command Centre dashboard

**Key Gotchas Discovered:**

1. **Command Centre Standalone**: Not in monorepo workspace, has separate Vercel deployment
2. **Environment Variables**: Command Centre needs `SUPABASE_SERVICE_ROLE_KEY` for API routes
3. **Data Source Files**: Ingestion script reads from monorepo root `test-deployment-*.md` files
4. **RLS Policies**: Service role has full access, authenticated users read-only
5. **Sample Data**: Uses `ON CONFLICT DO NOTHING`, won't duplicate on re-run

---

### 🚀 DEPLOYMENT CHECKLIST: Golden Verify + Testing Integration (ARCHIVED)

**Note**: This checklist is now complete and archived below for reference.

---

#### 📋 OVERVIEW

**What This Does:**

- Ingests Golden Verify deployment health checks into Supabase (`golden_history` table)
- Ingests @total-audio/testing component analysis results into Supabase (`testing_results` table)
- Displays real-time ops data in Command Centre dashboard
- Provides historical trend analysis for deployment quality

**Architecture:**

```
Main Repo (Monorepo)
  ├── .github/workflows/golden-verify.yml (triggers ingestion)
  ├── scripts/golden-intelligence.ts (ingestion script)
  ├── supabase/migrations/20251111_golden_verify_integration.sql (database schema)
  └── test-deployment-*.md files (source data)

Command Centre (Standalone App)
  ├── app/api/ops-console/golden/route.ts (Golden Verify API)
  ├── app/api/ops-console/testing/route.ts (Testing API)
  └── Dashboard UI (displays data)
```

---

#### 🗄️ PART 1: DATABASE SETUP

**Location**: Main repository Supabase instance
**Migration File**: `/supabase/migrations/20251111_golden_verify_integration.sql`

**What Gets Created:**

- 2 tables: `golden_history`, `testing_results`
- 2 views: `golden_summary`, `testing_summary`
- 2 helper functions: `get_latest_golden_status()`, `get_testing_pass_rate()`
- 6 RLS policies (service role + authenticated users)
- Sample data for UI testing (4 Golden + 5 Testing records)

**Deployment Steps:**

```bash
# Option A: Apply via Supabase CLI (recommended)
cd /Users/chrisschofield/workspace/active/total-audio-platform
supabase db push --file supabase/migrations/20251111_golden_verify_integration.sql

# Option B: Apply via Supabase Dashboard
# 1. Go to https://supabase.com/dashboard/project/[project-id]/sql/new
# 2. Copy contents of 20251111_golden_verify_integration.sql
# 3. Click "Run"
# 4. Verify success message: "✅ Golden Verify + Testing integration migration complete"

# Verification Query (run in Supabase SQL Editor):
SELECT
  (SELECT COUNT(*) FROM golden_history) as golden_records,
  (SELECT COUNT(*) FROM testing_results) as testing_records,
  (SELECT COUNT(*) FROM golden_summary) as golden_summary_rows,
  (SELECT COUNT(*) FROM testing_summary) as testing_summary_rows;

# Expected: 4 golden records, 5 testing records (sample data)
```

**Critical Tables Created:**

| Table             | Purpose                   | Key Fields                                                                |
| ----------------- | ------------------------- | ------------------------------------------------------------------------- |
| `golden_history`  | Deployment health checks  | `app`, `health_status`, `tests_passed`, `lighthouse_*`, `deployed_at`     |
| `testing_results` | Component testing results | `app`, `test_suite`, `component`, `passed`, `issues_found`, `executed_at` |

---

#### 🔐 PART 2: ENVIRONMENT VARIABLES

**GitHub Actions Secrets (Main Repo):**

Required for `golden-verify.yml` workflow:

```bash
# Already configured (verify in GitHub repo settings):
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]  # Critical for ingestion
TELEGRAM_BOT_TOKEN=[bot-token]
TELEGRAM_CHAT_ID=[chat-id]

# Verify secrets exist:
# https://github.com/[your-org]/total-audio-platform/settings/secrets/actions
```

**Command Centre Environment Variables:**

```bash
# Location: apps/command-centre/.env.production
# Required for API routes to read from Supabase:

NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]  # For server-side API routes

# Verify file exists:
ls -la /Users/chrisschofield/workspace/active/total-audio-platform/apps/command-centre/.env.production
```

**Vercel Environment Variables (Command Centre):**

```bash
# Go to: https://vercel.com/[team]/command-centre/settings/environment-variables

# Add these if missing:
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Environment: Production
# ⚠️ CRITICAL: Must redeploy Command Centre after adding/updating env vars
```

---

#### 🚢 PART 3: COMMAND CENTRE DEPLOYMENT

**Location**: Standalone Next.js app at `apps/command-centre/`
**Deployment**: Vercel (https://command.totalaudiopromo.com)

**Pre-Deployment Checklist:**

```bash
# 1. Verify environment variables exist
cat apps/command-centre/.env.production

# 2. Test API routes locally (requires local Supabase)
cd apps/command-centre
npm run dev
# Visit: http://localhost:3005/api/ops-console/golden
# Visit: http://localhost:3005/api/ops-console/testing
# Expected: JSON response with sample data

# 3. Verify Vercel config
cat apps/command-centre/vercel.json
# Should specify: framework=nextjs, regions=[lhr1]
```

**Deployment Steps:**

```bash
# Option A: Push to main (auto-deploys via Vercel GitHub integration)
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/command-centre
git add .
git commit -m "feat(command-centre): Add Golden Verify + Testing integration"
git push origin main
# Vercel auto-deploys: https://vercel.com/[team]/command-centre/deployments

# Option B: Manual Vercel deployment (if needed)
cd apps/command-centre
vercel --prod
# Follow prompts, use existing project "command-centre"

# Post-Deployment Verification:
# 1. Check Vercel deployment logs for errors
# 2. Visit: https://command.totalaudiopromo.com/ops-console
# 3. Verify Golden Verify and Testing cards show sample data
# 4. Check browser console for API errors
```

**Vercel Configuration Notes:**

- **Build Command**: `cd /vercel/path0/apps/command-centre && npm run build`
- **Install Command**: Uses `--legacy-peer-deps` (important for dependency resolution)
- **Output Directory**: `.next`
- **API Route Timeout**: 30 seconds (configured in vercel.json)
- **Region**: `lhr1` (London - UK-centric deployment)

---

#### ✅ PART 4: VERIFICATION STEPS

**1. Database Verification:**

```sql
-- Run in Supabase SQL Editor
-- Verify tables exist and have sample data
SELECT
  'golden_history' as table_name,
  COUNT(*) as records,
  MAX(deployed_at) as latest_record
FROM golden_history
UNION ALL
SELECT
  'testing_results',
  COUNT(*),
  MAX(executed_at)
FROM testing_results;

-- Expected:
-- golden_history: 4 records
-- testing_results: 5 records

-- Verify helper functions work
SELECT * FROM get_latest_golden_status();
SELECT * FROM get_testing_pass_rate();
```

**2. Ingestion Script Verification:**

```bash
# Run ingestion script manually to test
cd /Users/chrisschofield/workspace/active/total-audio-platform
export SUPABASE_URL="https://[project-id].supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="[service-role-key]"

pnpm tsx scripts/golden-intelligence.ts

# Expected output:
# ✅ Golden Intelligence: Ingestion complete
#    - Golden Verify: X records inserted
#    - Testing: Y records inserted
#    - Latest test-deployment-*.md file processed

# Verify data was inserted:
# Check Supabase Table Editor for new records in golden_history and testing_results
```

**3. Command Centre UI Verification:**

```bash
# Visit: https://command.totalaudiopromo.com/ops-console
# Or locally: http://localhost:3005/ops-console

# ✅ Checklist:
# [ ] Page loads without errors
# [ ] Golden Verify card displays:
#     - Latest deployment status (healthy/degraded/down)
#     - Lighthouse scores (Performance, Accessibility, etc.)
#     - Tests passed/failed counts
# [ ] Testing card displays:
#     - Test pass rate percentage
#     - Issues found/fixed counts
#     - Test suite breakdown (component-analyzer, playwright-mobile, etc.)
# [ ] Data updates when refreshing page
# [ ] No API errors in browser console
# [ ] Charts/visualizations render correctly
```

**4. GitHub Actions Verification:**

```bash
# Trigger workflow manually or wait for next deployment
# Visit: https://github.com/[your-org]/total-audio-platform/actions

# ✅ Checklist for golden-verify.yml workflow:
# [ ] Workflow runs without errors
# [ ] "Ingest Golden Verify + Testing Results" step succeeds
# [ ] Supabase receives new records (check Table Editor)
# [ ] Telegram notification sent (if configured)
# [ ] Workflow artifacts uploaded (golden-verify-report-*)

# Check workflow logs for:
grep "Golden Intelligence: Ingestion complete" [workflow-logs]
```

**5. API Route Verification:**

```bash
# Test API routes directly
curl https://command.totalaudiopromo.com/api/ops-console/golden | jq
curl https://command.totalaudiopromo.com/api/ops-console/testing | jq

# Expected response structure:
# Golden: { history: [...], summary: {...}, latest: {...} }
# Testing: { results: [...], summary: {...}, pass_rate: {...} }

# Local testing:
curl http://localhost:3005/api/ops-console/golden | jq
curl http://localhost:3005/api/ops-console/testing | jq
```

---

#### 🚨 TROUBLESHOOTING TIPS

**Problem: No data appears in Command Centre dashboard**

```bash
# Diagnosis:
# 1. Check if migration was applied
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('golden_history', 'testing_results');
# Expected: Both tables listed

# 2. Check if data exists
SELECT COUNT(*) FROM golden_history;
SELECT COUNT(*) FROM testing_results;
# Expected: At least 4 and 5 respectively (sample data)

# 3. Check API route errors
# Visit: https://command.totalaudiopromo.com/api/ops-console/golden
# If error, check Vercel deployment logs

# 4. Verify environment variables
# Vercel Dashboard → command-centre → Settings → Environment Variables
# Must have: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

**Problem: Ingestion script fails in GitHub Actions**

```bash
# Check workflow logs for:
# ❌ Missing Supabase credentials
# ❌ No test-deployment-*.md files found
# ❌ Database connection errors

# Fix:
# 1. Verify GitHub secrets exist:
#    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
# 2. Check if test-deployment-*.md file was created
#    (golden-postcheck.ts should create this)
# 3. Test ingestion locally:
pnpm tsx scripts/golden-intelligence.ts
```

**Problem: RLS policies blocking access**

```bash
# Symptom: API returns empty arrays despite data existing
# Diagnosis: Row Level Security preventing reads

# Fix: Verify policies exist
SELECT * FROM pg_policies
WHERE tablename IN ('golden_history', 'testing_results');
# Expected: 6 policies total

# Temporary bypass (testing only):
ALTER TABLE golden_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE testing_results DISABLE ROW LEVEL SECURITY;
# ⚠️ Re-enable after testing!
```

**Problem: Command Centre API routes timeout**

```bash
# Check Vercel function logs:
# https://vercel.com/[team]/command-centre/deployments/[deployment-id]/logs

# Common causes:
# 1. Slow Supabase query (add indexes)
# 2. API route timeout too low (increase in vercel.json)
# 3. Network issues (check Supabase status)

# Fix: Increase timeout in vercel.json
{
  "functions": {
    "app/api/ops-console/**": {
      "maxDuration": 60  // Increase from 30 to 60 seconds
    }
  }
}
```

**Problem: Sample data not appearing**

```bash
# Sample data is inserted with ON CONFLICT DO NOTHING
# If migration ran before, sample data won't re-insert

# Verify sample data exists:
SELECT * FROM golden_history WHERE deployment_id LIKE 'dpl_test_%';
SELECT * FROM testing_results WHERE component IN ('HeroDemo', 'DashboardCard');

# If missing, manually insert:
# Copy sample INSERT statements from migration file and run in SQL Editor
```

---

#### ⏱️ ESTIMATED DEPLOYMENT TIME

**Total Time: 15-20 minutes**

- Database migration: 2-3 minutes (apply + verify)
- Environment variable setup: 3-5 minutes (if not already configured)
- Command Centre deployment: 5-7 minutes (build + deploy via Vercel)
- Verification: 5 minutes (UI + API checks)

**Critical Path Dependencies:**

1. Database migration MUST complete first
2. Environment variables MUST be set before Command Centre deployment
3. GitHub Actions will run automatically on next push to main

---

#### 🎯 SUCCESS CRITERIA

**Deployment is successful when:**

- ✅ Database tables exist with sample data (4 golden + 5 testing records)
- ✅ Ingestion script runs without errors (test manually first)
- ✅ Command Centre dashboard displays Golden Verify and Testing cards
- ✅ API routes return valid JSON responses
- ✅ GitHub Actions workflow completes successfully
- ✅ No errors in Vercel deployment logs
- ✅ Telegram notifications working (if configured)

**Next Steps After Deployment:**

1. Monitor first automated workflow run (wait for next push to main)
2. Verify real Golden Verify data appears (not just sample data)
3. Check Command Centre dashboard daily for trends
4. Set up alerts for degraded/down deployments (future enhancement)
5. Document any issues encountered in BUSINESS_NOTES.md

---

#### 📝 CRITICAL GOTCHAS

1. **Command Centre is NOT in the monorepo** - It's a standalone app at `apps/command-centre/` with its own `package.json` and Vercel deployment
2. **Two Supabase connections**: Main repo ingestion script uses `SUPABASE_SERVICE_ROLE_KEY`, Command Centre API uses both `ANON_KEY` (client) and `SERVICE_ROLE_KEY` (server)
3. **RLS policies**: Service role has full access, authenticated users have read-only access
4. **Sample data conflict**: Migration uses `ON CONFLICT DO NOTHING` - re-running won't duplicate sample data
5. **Vercel env vars**: Must redeploy Command Centre after adding/updating environment variables
6. **API route paths**: Located at `/api/ops-console/golden` and `/api/ops-console/testing` (not `/ops-console/api/...`)
7. **Data source files**: Ingestion script reads `test-deployment-*.md` files from monorepo root, not from Command Centre

---

#### 🔗 USEFUL URLS

**Production:**

- Command Centre: https://command.totalaudiopromo.com/ops-console
- Supabase Dashboard: https://supabase.com/dashboard/project/[project-id]
- Vercel Deployments: https://vercel.com/[team]/command-centre/deployments
- GitHub Actions: https://github.com/[your-org]/total-audio-platform/actions

**Local Development:**

- Command Centre: http://localhost:3005/ops-console
- API Routes:
  - http://localhost:3005/api/ops-console/golden
  - http://localhost:3005/api/ops-console/testing

**Documentation:**

- Migration file: `/supabase/migrations/20251111_golden_verify_integration.sql`
- Ingestion script: `/scripts/golden-intelligence.ts`
- Workflow: `/.github/workflows/golden-verify.yml`
- Command Centre API: `/apps/command-centre/app/api/ops-console/`

---

**Deployment Completed**: ⏳ Pending
**Last Updated**: 2025-11-11
**Next Review**: After first production deployment
