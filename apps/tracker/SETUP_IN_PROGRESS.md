# 🚀 Integrations Setup In Progress

## ✅ Completed

1. **Database Migration** - SQL copied to clipboard
   - Paste and run in: https://app.supabase.com/project/ucncbighzqudaszewjrv/sql/new
   - Creates 4 tables: integration_connections, integration_sync_logs, integration_field_mappings, gmail_tracked_emails

2. **Cron Secret** - Generated and added to .env.local
   - `CRON_SECRET=vHt2Iqy8a2Gobw3etChkw9blsIb85CKIcMYJBwAuCwM=`

3. **Dependencies** - Installed
   - googleapis@^144.0.0
   - nanoid@^5.0.9

## 🔧 Next Steps (Google OAuth Setup)

### Step 1: Create Google Cloud Project
Open: https://console.cloud.google.com/projectcreate

1. Project name: **"Tracker Integrations"**
2. Organization: Leave as default
3. Click **"Create"**

### Step 2: Enable APIs
After project is created:

1. Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com
   - Click **"Enable"**

2. Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com
   - Click **"Enable"**

3. Go to: https://console.cloud.google.com/apis/library/drive.googleapis.com
   - Click **"Enable"**

### Step 3: Configure OAuth Consent Screen
Go to: https://console.cloud.google.com/apis/credentials/consent

1. User Type: **External**
2. Click **"Create"**
3. Fill in:
   - App name: **"Tracker by Total Audio"**
   - User support email: Your email
   - Developer contact email: Your email
4. Click **"Save and Continue"** (3 times)
5. Click **"Back to Dashboard"**

### Step 4: Create OAuth Client ID
Go to: https://console.cloud.google.com/apis/credentials

1. Click **"Create Credentials"** → **"OAuth Client ID"**
2. Application type: **"Web application"**
3. Name: **"Tracker Local Development"**
4. Authorized redirect URIs - Add these **exactly**:
   ```
   http://localhost:3004/api/integrations/google-sheets/callback
   http://localhost:3004/api/integrations/gmail/callback
   ```
5. Click **"Create"**
6. **Copy Client ID and Client Secret** (keep modal open)

### Step 5: Update .env.local
Add the credentials to your `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=<paste-client-id>
GOOGLE_SHEETS_CLIENT_SECRET=<paste-client-secret>
NEXT_PUBLIC_GMAIL_CLIENT_ID=<paste-client-id>
GMAIL_CLIENT_SECRET=<paste-client-secret>
```

### Step 6: Test Locally

```bash
# Restart dev server
npm run dev
```

Visit: http://localhost:3004/dashboard/integrations

1. Click **"Connect Google Sheets"**
2. Authorize with your Google account
3. Should redirect back with success

### Step 7: Production Setup (After Local Works)

1. Create another OAuth Client ID for production:
   - Name: **"Tracker Production"**
   - Redirect URIs:
     ```
     https://tracker.totalaudiopromo.com/api/integrations/google-sheets/callback
     https://tracker.totalaudiopromo.com/api/integrations/gmail/callback
     ```

2. Add to Vercel environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID production
   vercel env add GOOGLE_SHEETS_CLIENT_SECRET production
   vercel env add NEXT_PUBLIC_GMAIL_CLIENT_ID production
   vercel env add GMAIL_CLIENT_SECRET production
   vercel env add CRON_SECRET production
   ```

3. Deploy:
   ```bash
   git add .
   git commit -m "feat: Add integrations system (Google Sheets, Gmail)"
   git push
   ```

## 📊 What You'll Be Able To Do

### Google Sheets Integration
- ✅ One-click OAuth connection
- ✅ Automatic sync every 15 minutes
- ✅ Edit campaigns in Tracker or Sheet - syncs both ways
- ✅ Share campaign progress with clients/team

### Gmail Integration
- ✅ Automatic reply detection
- ✅ Campaign status updates when contacts respond
- ✅ Reply snippets in campaign notes
- ✅ Never miss a follow-up

## 🎯 Current Status

- [x] Code complete
- [x] Dependencies installed
- [ ] Database migration applied (SQL in clipboard - paste in Supabase)
- [x] Cron secret generated
- [ ] Google OAuth credentials created
- [ ] .env.local updated with OAuth
- [ ] Local testing
- [ ] Production deployment

## ⏱️ Estimated Time Remaining: 5-7 minutes

---

**Questions or issues?** Check [INTEGRATIONS_QUICK_START.md](./INTEGRATIONS_QUICK_START.md) for detailed troubleshooting.
