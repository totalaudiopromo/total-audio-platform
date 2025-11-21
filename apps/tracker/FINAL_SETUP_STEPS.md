#  Final Setup Steps - 3 Minutes to Complete

##  Already Done

1.  **Database Migration SQL** - Copied to clipboard
2.  **Cron Secret** - Generated and added to .env.local
3.  **Google OAuth Credentials** - Found and added to .env.local
4.  **Dependencies** - Installed (googleapis, nanoid)

##  3 Steps Remaining

### Step 1: Apply Database Migration (1 minute)

The SQL is already in your clipboard. Now:

1. **Paste and run** in Supabase SQL editor (already open in browser)
   - Or open: https://app.supabase.com/project/ucncbighzqudaszewjrv/sql/new
   - Paste the migration
   - Click "Run"

You should see: "Success. No rows returned"

### Step 2: Update Google OAuth Redirect URIs (1 minute)

Go to Google Cloud Console:
https://console.cloud.google.com/apis/credentials

1. Find your OAuth 2.0 Client ID: `309298460159-4gcfsvpup4og77r0mifta91s8f651875`
2. Click the edit icon (pencil)
3. Under "Authorized redirect URIs", add these two URIs:
   ```
   http://localhost:3004/api/integrations/google-sheets/callback
   http://localhost:3004/api/integrations/gmail/callback
   ```
4. Click "Save"

### Step 3: Test It Works! (1 minute)

```bash
# Start Tracker (if not already running)
npm run dev
```

Then visit: http://localhost:3004/dashboard/integrations

You should see:

- Google Sheets integration card
- Gmail integration card
- Airtable integration card (ready for future)
- Mailchimp integration card (ready for future)

Click **"Connect Google Sheets"**:

1. Google OAuth screen appears
2. Select your account
3. Click "Allow"
4. Redirects back to Tracker with success 

##  That's It!

Your integrations system is now live. You can:

### Google Sheets

- Sync campaigns to spreadsheets automatically
- Edit in either Tracker or Sheet - changes sync both ways
- Share campaign progress with clients/team
- Auto-syncs every 15 minutes

### Gmail (Coming Soon)

- Automatic reply detection
- Campaign status updates
- Never miss a follow-up

##  Verify It Worked

After connecting Google Sheets, check your Supabase database:

1. Go to: https://app.supabase.com/project/ucncbighzqudaszewjrv/editor
2. Open table: `integration_connections`
3. You should see one row with:
   - `integration_type`: "google_sheets"
   - `status`: "active"
   - `credentials`: (encrypted OAuth tokens)

##  Troubleshooting

### Error: "redirect_uri_mismatch"

- Check you added the exact URIs to Google Console
- Must match exactly (no trailing slash, correct port 3004)
- Make sure you saved changes in Google Console

### Error: "invalid_client"

- Verify credentials copied correctly to .env.local
- Restart dev server: `npm run dev`

### Connection shows but doesn't work

- Check you enabled Google Sheets API in Cloud Console
- Check you enabled Gmail API in Cloud Console
- Go to: https://console.cloud.google.com/apis/library

##  Next Steps (After Basic Setup Works)

1. **Create a test campaign** in Tracker
2. **Configure Google Sheet** (set which spreadsheet to sync to)
3. **Watch the magic** - campaigns appear in your sheet
4. **Edit in sheet** - changes sync back to Tracker
5. **Deploy to production** - Add production redirect URIs

---

**Current Status**: Ready to test! Just need to apply database migration and update redirect URIs.

**Time to Complete**: ~3 minutes
