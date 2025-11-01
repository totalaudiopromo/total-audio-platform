# Phase 7: Revenue Instrumentation & Growth Telemetry - Testing Guide

**Phase**: 7 - Revenue Instrumentation & Growth Telemetry
**Status**: Ready for Testing
**Date**: 2025-11-02

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Stripe Webhook Local Testing](#stripe-webhook-local-testing)
3. [Event Tracking Testing](#event-tracking-testing)
4. [Admin Dashboard Testing](#admin-dashboard-testing)
5. [Growth Report Testing](#growth-report-testing)
6. [Backfill Script Testing](#backfill-script-testing)

---

## Prerequisites

### Required Environment Variables

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://ucncbighzqudaszewjrv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Stripe (Required for webhook + backfill testing)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>

# Anthropic (Required for enrichment tracking)
ANTHROPIC_API_KEY=<your-anthropic-key>
```

### Database Migrations

Apply Phase 7 migrations:

```bash
cd packages/core-db
npm run migrate

# Verify migrations applied
supabase db diff
```

Expected migrations:

- `20251102_metrics.sql` - Events, usage_counters, payments tables
- `20251102_payments_event_id_constraint.sql` - Idempotency constraint

---

## Stripe Webhook Local Testing

### 1. Install Stripe CLI

```bash
# macOS (via Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe

```bash
stripe login
```

### 3. Start Local Webhook Forwarding

```bash
# Start Audio Intel dev server
cd apps/audio-intel
npm run dev

# In a new terminal, forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Note the webhook signing secret** - update your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### 4. Trigger Test Events

```bash
# Test payment intent succeeded
stripe trigger payment_intent.succeeded

# Test checkout session completed
stripe trigger checkout.session.completed

# Test invoice paid (subscription)
stripe trigger invoice.paid

# Test refund
stripe trigger charge.refunded
```

### 5. Verify in Database

```sql
-- Check payments table
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;

-- Verify idempotency (no duplicates)
SELECT event_id, COUNT(*) FROM payments GROUP BY event_id HAVING COUNT(*) > 1;
```

---

## Event Tracking Testing

### 1. Track Enrichment Event

```typescript
// In apps/audio-intel/app/api/enrich-claude/route.ts
import { trackEnrichmentComplete, incrementUsageCounter, getTodayDate } from '@/lib/metrics';

// After successful enrichment
await trackEnrichmentComplete({
  userId: user.id,
  contactCount: contacts.length,
  successCount: enrichedContacts.length,
  durationMs: Date.now() - startTime,
  source: 'web_upload',
});

await incrementUsageCounter({
  userId: user.id,
  date: getTodayDate(),
  enrichmentsCount: contacts.length,
});
```

### 2. Verify Events in Database

```sql
-- Check events table
SELECT event_name, event_category, properties, status
FROM events
WHERE event_name = 'enrichment_completed'
ORDER BY created_at DESC
LIMIT 10;

-- Check usage counters
SELECT user_id, date, enrichments_count, exports_count
FROM usage_counters
ORDER BY date DESC
LIMIT 10;
```

### 3. Test Event Tracking Helpers

```bash
# Run manual test
npx tsx -e "
import { trackFeatureUsage } from './apps/audio-intel/lib/metrics';
await trackFeatureUsage({
  userId: 'test-user-id',
  featureName: 'export_csv',
  properties: { count: 5 }
});
"
```

---

## Admin Dashboard Testing

### 1. Access Dashboard

```bash
# Start Audio Intel
cd apps/audio-intel
npm run dev

# Navigate to:
open http://localhost:3000/admin/metrics
```

### 2. Verify Metrics Display

Check that the following metrics load:

- ✅ Monthly Recurring Revenue (MRR)
- ✅ Annual Recurring Revenue (ARR)
- ✅ Active Subscriptions
- ✅ Total/New/Active Users
- ✅ DAU/WAU/MAU
- ✅ Enrichment statistics
- ✅ Top users table
- ✅ Recent payments table

### 3. Test Period Selector

- Switch between 7 days, 30 days, 90 days
- Verify metrics update correctly
- Check "Generated at" timestamp updates

### 4. API Endpoint Testing

```bash
# Test metrics API directly
curl http://localhost:3000/api/admin/metrics?days=30 | jq

# Verify response structure
```

---

## Growth Report Testing

### 1. Generate Local Report

```bash
# Default (7 days)
npx tsx scripts/growth-report.ts

# Custom period (30 days)
npx tsx scripts/growth-report.ts --days 30

# Save to file
npx tsx scripts/growth-report.ts --days 7 --output test-report.md
```

### 2. Verify Report Contents

Check that report includes:

- ✅ Revenue metrics (MRR, ARR, subscriptions)
- ✅ User growth metrics
- ✅ Engagement metrics (DAU/WAU/MAU)
- ✅ Product metrics (enrichments, success rate)
- ✅ Conversion funnel
- ✅ Key insights
- ✅ Recommended actions

### 3. Test GitHub Actions Workflow (Manual Trigger)

```bash
# Via GitHub UI
1. Go to Actions tab
2. Select "Weekly Growth Report"
3. Click "Run workflow"
4. Enter days: 7
5. Click "Run workflow" button

# Via GitHub CLI
gh workflow run growth-report.yml --field days=7
```

### 4. Verify Workflow Output

- Check workflow runs successfully
- Download artifact from Actions tab
- Verify GitHub issue created with report

---

## Backfill Script Testing

### 1. Dry Run (Safe)

```bash
# Test without inserting data
npx tsx scripts/backfill-stripe.ts --days 30 --dry-run
```

Expected output:

```
🔄 Starting Stripe payment backfill...
📅 Period: Last 30 days
🧪 Dry run: YES

📡 Fetching payment intents from Stripe...
✅ Found X payment intents

📡 Fetching invoices from Stripe...
✅ Found Y invoices

💳 Processing payment intents...
🧪 Would insert: pi_xxxx for user@example.com (£19.00)
...

📊 BACKFILL SUMMARY
✅ Successfully processed: X
⏭️  Skipped (already exists): Y
❌ Errors: 0
📦 Total records: Z

🧪 DRY RUN - No data was actually inserted
```

### 2. Real Backfill (Last 7 Days)

```bash
# Start with small period
npx tsx scripts/backfill-stripe.ts --days 7
```

### 3. Verify Backfilled Data

```sql
-- Check backfilled payments
SELECT *
FROM payments
WHERE event_id LIKE 'backfill_%'
ORDER BY created_at DESC;

-- Verify no duplicates
SELECT event_id, COUNT(*)
FROM payments
WHERE event_id LIKE 'backfill_%'
GROUP BY event_id
HAVING COUNT(*) > 1;
```

### 4. Full Historical Backfill (90 Days)

```bash
# After testing with smaller periods
npx tsx scripts/backfill-stripe.ts --days 90
```

---

## Integration Testing Checklist

### End-to-End Flow Test

1. **User Signup** →

   ```bash
   # Check events table for user_signed_up event
   SELECT * FROM events WHERE event_name = 'user_signed_up' AND user_id = '<user-id>';
   ```

2. **Contact Enrichment** →

   ```bash
   # Check enrichment_completed event
   # Check usage_counters enrichments_count incremented
   ```

3. **Data Export** →

   ```bash
   # Check export_csv_completed event
   # Check usage_counters exports_count incremented
   ```

4. **Payment (via Stripe CLI test event)** →

   ```bash
   stripe trigger checkout.session.completed
   # Check payments table for new record
   ```

5. **View Admin Dashboard** →

   ```bash
   # Verify all metrics display correctly
   open http://localhost:3000/admin/metrics
   ```

6. **Generate Growth Report** →
   ```bash
   npx tsx scripts/growth-report.ts
   # Verify report includes all sections
   ```

---

## Troubleshooting

### Stripe Webhook Not Receiving Events

```bash
# Check webhook endpoint accessible
curl -I http://localhost:3000/api/webhooks/stripe

# Verify Stripe CLI forwarding
stripe listen --print-secret

# Check webhook secret matches
echo $STRIPE_WEBHOOK_SECRET
```

### Events Not Appearing in Database

```sql
-- Check if events table exists
SELECT COUNT(*) FROM events;

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'events';

-- Check service role key permissions
-- Ensure SUPABASE_SERVICE_ROLE_KEY is set correctly
```

### Admin Dashboard Not Loading

```bash
# Check API route
curl http://localhost:3000/api/admin/metrics?days=7

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Check browser console for errors
```

### Growth Report Errors

```bash
# Test database connection
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const { data, error } = await supabase.from('events').select('count');
console.log('Events count:', data, error);
"
```

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Commit Phase 7 changes
2. ✅ Create git tag `v2.2.0-phase7-growth-telemetry`
3. ✅ Deploy to production
4. ✅ Configure Stripe production webhooks
5. ✅ Run backfill script for production data
6. ✅ Enable GitHub Actions weekly report
7. ✅ Set up admin dashboard authentication

---

**Testing completed by**: Chris Schofield
**Last updated**: 2025-11-02
