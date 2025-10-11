# Integrations System Setup Checklist

## ✅ Complete (Built)
- [x] Database schema (013_integrations_system.sql)
- [x] OAuth infrastructure (oauth-handler.ts)
- [x] Google Sheets sync service
- [x] Gmail reply tracking service
- [x] UI components (IntegrationCard, dashboard page)
- [x] React hooks (useIntegrations)
- [x] API routes (connect, callback, sync)
- [x] Background sync worker (cron job)
- [x] Vercel cron configuration
- [x] Environment variable templates
- [x] Documentation (ROADMAP, IMPLEMENTATION, ENV_SETUP)

## 🔧 Configuration Needed

### 1. Install Dependencies
```bash
cd apps/tracker
npm install
```

This will install:
- googleapis@^144.0.0
- nanoid@^5.0.9

### 2. Apply Database Migration
```bash
# Option A: Supabase Dashboard (Recommended)
# 1. Go to https://app.supabase.com/project/_/sql
# 2. Copy contents of supabase/migrations/013_integrations_system.sql
# 3. Paste and run

# Option B: Supabase CLI
npx supabase db push
```

### 3. Generate Cron Secret
```bash
openssl rand -base64 32
```

Copy the output and add to your `.env.local`:
```
CRON_SECRET=<generated-secret>
```

### 4. Set Up Google OAuth
Follow detailed instructions in [ENV_SETUP_INTEGRATIONS.md](./ENV_SETUP_INTEGRATIONS.md)

Quick summary:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project "Total Audio Tracker"
3. Enable APIs: Google Sheets, Gmail, Drive
4. Create OAuth 2.0 credentials
5. Add redirect URIs:
   - `http://localhost:3000/api/integrations/google-sheets/callback`
   - `http://localhost:3000/api/integrations/gmail/callback`
   - `https://tracker.totalaudiopromo.com/api/integrations/google-sheets/callback`
   - `https://tracker.totalaudiopromo.com/api/integrations/gmail/callback`
6. Copy Client ID and Secret to `.env.local`

### 5. Update .env.local
Copy `.env.example` to `.env.local` and fill in:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=<your-client-id>
GOOGLE_SHEETS_CLIENT_SECRET=<your-client-secret>
NEXT_PUBLIC_GMAIL_CLIENT_ID=<your-client-id>
GMAIL_CLIENT_SECRET=<your-client-secret>
CRON_SECRET=<generated-secret>
```

### 6. Test Locally
```bash
npm run dev
```

Visit: http://localhost:3000/dashboard/integrations

Test flow:
1. Click "Connect Google Sheets"
2. Authorize with Google
3. Should redirect back to Tracker
4. Check database: `SELECT * FROM integration_connections;`

### 7. Deploy to Vercel
```bash
# Add environment variables to Vercel
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID production
vercel env add GOOGLE_SHEETS_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_GMAIL_CLIENT_ID production
vercel env add GMAIL_CLIENT_SECRET production
vercel env add CRON_SECRET production

# Deploy
git add .
git commit -m "feat: Add integrations system (Google Sheets, Gmail, Airtable, Mailchimp)"
git push
```

### 8. Verify Cron Job
After deployment:
1. Go to Vercel project → Settings → Cron Jobs
2. Verify "/api/cron/sync-integrations" is scheduled
3. Check logs after 15 minutes to confirm it runs

## 🧪 Testing Checklist

### Google Sheets Integration
- [ ] Connect to Google Sheets
- [ ] Select existing spreadsheet
- [ ] Create new spreadsheet
- [ ] Sync campaigns to sheet
- [ ] Edit campaign in sheet, verify sync back to Tracker
- [ ] Disconnect and verify credentials removed

### Gmail Integration
- [ ] Connect to Gmail
- [ ] Send test email from Tracker (when feature is built)
- [ ] Reply to email from external account
- [ ] Verify campaign status updates to "replied"
- [ ] Check reply snippet appears in campaign notes

### Background Sync
- [ ] Enable sync on connection
- [ ] Wait 15 minutes
- [ ] Check `integration_sync_logs` table for entries
- [ ] Verify campaigns updated
- [ ] Test error handling (disconnect Google account)

## 📊 Monitoring

### Check Sync Logs
```sql
-- Recent sync operations
SELECT
  connection_id,
  direction,
  records_updated,
  errors,
  completed_at
FROM integration_sync_logs
ORDER BY completed_at DESC
LIMIT 20;

-- Connection status
SELECT
  user_id,
  integration_type,
  status,
  last_sync_at,
  error_count,
  error_message
FROM integration_connections
WHERE status = 'error';
```

### Vercel Logs
```bash
vercel logs --follow
```

Look for:
- `Sync complete` messages every 15 minutes
- OAuth callback success/failures
- Error messages

## 🚀 Next Steps (After Basic Setup Works)

1. **Airtable Integration**: Implement sync service similar to Google Sheets
2. **Mailchimp Integration**: Contact list sync
3. **Google Sheets UI**: Configuration page for sheet selection and field mapping
4. **Gmail Compose**: Send emails directly from Tracker with auto-tracking
5. **Webhook Support**: Real-time updates instead of polling
6. **Bulk Operations**: Sync multiple campaigns at once
7. **Conflict Resolution**: Handle concurrent edits better

## 📝 Documentation Reference

- **Roadmap**: [INTEGRATIONS_ROADMAP.md](./INTEGRATIONS_ROADMAP.md)
- **Implementation Guide**: [INTEGRATIONS_IMPLEMENTATION.md](./INTEGRATIONS_IMPLEMENTATION.md)
- **OAuth Setup**: [ENV_SETUP_INTEGRATIONS.md](./ENV_SETUP_INTEGRATIONS.md)

---

**Status**: Ready for configuration and testing
**Estimated Setup Time**: 30 minutes
**Estimated Test Time**: 15 minutes per integration
