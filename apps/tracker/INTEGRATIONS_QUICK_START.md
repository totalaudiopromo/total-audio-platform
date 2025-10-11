# Integrations Quick Start Guide

## 🚀 Get Your First Integration Working in 10 Minutes

### Prerequisites
- Tracker running locally (`npm run dev`)
- Google account
- 10 minutes

## Step 1: Generate Cron Secret (30 seconds)

```bash
openssl rand -base64 32
```

Copy the output.

## Step 2: Set Up Google OAuth (5 minutes)

### A. Go to Google Cloud Console
https://console.cloud.google.com

### B. Create Project
1. Click project dropdown (top left)
2. Click "New Project"
3. Name: "Tracker Local Dev"
4. Click "Create"

### C. Enable APIs
1. Click "Enable APIs and Services"
2. Search "Google Sheets API" → Enable
3. Search "Gmail API" → Enable
4. Search "Google Drive API" → Enable

### D. Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth Client ID"
3. Click "Configure Consent Screen"
   - User Type: **External**
   - App name: "Tracker Local Dev"
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue" (3 times)
4. Back to "Create Credentials" → "OAuth Client ID"
5. Application type: **Web application**
6. Name: "Tracker Local"
7. Authorized redirect URIs:
   ```
   http://localhost:3000/api/integrations/google-sheets/callback
   http://localhost:3000/api/integrations/gmail/callback
   ```
8. Click "Create"
9. **Copy Client ID and Client Secret**

## Step 3: Update .env.local (1 minute)

```bash
cd apps/tracker
```

Add to `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=<paste-client-id>
GOOGLE_SHEETS_CLIENT_SECRET=<paste-client-secret>
NEXT_PUBLIC_GMAIL_CLIENT_ID=<paste-client-id>
GMAIL_CLIENT_SECRET=<paste-client-secret>
CRON_SECRET=<paste-generated-secret>
```

## Step 4: Apply Database Migration (2 minutes)

### Option A: Supabase Dashboard (Easiest)
1. Go to https://app.supabase.com/project/YOUR_PROJECT/sql
2. Open `apps/tracker/supabase/migrations/013_integrations_system.sql`
3. Copy all contents
4. Paste into Supabase SQL editor
5. Click "Run"

### Option B: Command Line
```bash
# If you have Supabase CLI set up
npx supabase db push
```

## Step 5: Restart Dev Server (30 seconds)

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 6: Test Google Sheets Integration (2 minutes)

### A. Open Integrations Page
http://localhost:3000/dashboard/integrations

### B. Connect Google Sheets
1. Click "Connect Google Sheets" button
2. Google OAuth screen appears
3. Select your account
4. Click "Allow"
5. Redirects back to Tracker

### C. Verify Connection
You should see:
- ✅ Green checkmark on Google Sheets card
- "Connected" status
- "Last synced: Just now"

### D. Check Database
Open Supabase dashboard → Table Editor → `integration_connections`

You should see one row with:
- `integration_type`: "google_sheets"
- `status`: "active"
- `credentials`: (encrypted JSON with tokens)

## Step 7: Test Sync (1 minute)

### A. Create Test Campaign
1. Go to http://localhost:3000/dashboard
2. Click "New Campaign"
3. Fill in:
   - Name: "Test Campaign"
   - Artist: "Test Artist"
   - Platform: "Spotify"
   - Status: "Planning"
4. Click "Create"

### B. Configure Sync (UI to be built)
For now, we'll use the database directly:

```sql
-- Update your connection to point to a test spreadsheet
UPDATE integration_connections
SET settings = jsonb_set(
  settings,
  '{spreadsheet_id}',
  '"YOUR_SHEET_ID"'::jsonb
)
WHERE integration_type = 'google_sheets';
```

To get a Sheet ID:
1. Create new Google Sheet: https://sheets.new
2. Copy ID from URL: `https://docs.google.com/spreadsheets/d/{THIS_IS_THE_ID}/edit`

### C. Trigger Manual Sync
```bash
curl -X POST http://localhost:3000/api/integrations/google-sheets/sync \
  -H "Content-Type: application/json"
```

### D. Check Google Sheet
Your campaign should appear in the spreadsheet!

## 🎉 Success!

You now have:
- ✅ OAuth authentication working
- ✅ Google Sheets connection active
- ✅ Campaigns syncing to spreadsheet
- ✅ Database migration applied
- ✅ Background worker ready (runs every 15 min)

## Next Steps

### Test Gmail Integration
1. Click "Connect Gmail" on integrations page
2. Authorize with Google
3. Check database for connection

### Build Configuration UI
Currently need to set `spreadsheet_id` in database manually. Should build:
- Sheet selector dropdown
- Column mapping interface
- Sync frequency settings

### Test Background Worker
The cron job runs automatically every 15 minutes. To test immediately:

```bash
# Add your CRON_SECRET to .env.local, then:
curl -X GET http://localhost:3000/api/cron/sync-integrations \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Check `integration_sync_logs` table to see results.

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Check redirect URI in Google Console matches exactly
- Must be: `http://localhost:3000/api/integrations/google-sheets/callback`
- No trailing slash!

### Error: "invalid_client"
- Client ID or Secret is wrong
- Check you copied full values (no spaces)
- Check environment variables loaded (`console.log(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID)`)

### Connection shows but no sync happening
- Check `integration_sync_logs` table for errors
- Verify `spreadsheet_id` is set in connection settings
- Check Vercel logs: `vercel logs --follow`

### Spreadsheet not updating
- Check you have edit access to the sheet
- Verify OAuth scopes include `https://www.googleapis.com/auth/spreadsheets`
- Try disconnecting and reconnecting

## Production Deployment

Once local testing works:

```bash
# Add environment variables to Vercel
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID production
vercel env add GOOGLE_SHEETS_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_GMAIL_CLIENT_ID production
vercel env add GMAIL_CLIENT_SECRET production
vercel env add CRON_SECRET production

# Update OAuth redirect URIs in Google Console:
https://tracker.totalaudiopromo.com/api/integrations/google-sheets/callback
https://tracker.totalaudiopromo.com/api/integrations/gmail/callback

# Deploy
git add .
git commit -m "feat: Add integrations system"
git push
```

## Documentation

- **Full Setup Guide**: [ENV_SETUP_INTEGRATIONS.md](./ENV_SETUP_INTEGRATIONS.md)
- **Implementation Details**: [INTEGRATIONS_IMPLEMENTATION.md](./INTEGRATIONS_IMPLEMENTATION.md)
- **Roadmap & Strategy**: [INTEGRATIONS_ROADMAP.md](./INTEGRATIONS_ROADMAP.md)
- **Setup Checklist**: [INTEGRATIONS_SETUP_CHECKLIST.md](./INTEGRATIONS_SETUP_CHECKLIST.md)
- **Complete Summary**: [INTEGRATIONS_COMPLETE.md](./INTEGRATIONS_COMPLETE.md)

---

**Time to First Sync**: ~10 minutes
**Difficulty**: Easy (just copy-paste credentials)
**Prerequisites**: Google account, running Tracker instance
