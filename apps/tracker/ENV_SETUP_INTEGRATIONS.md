# Integration Environment Variables Setup

## Google OAuth Setup (for Sheets + Gmail)

### 1. Go to Google Cloud Console

https://console.cloud.google.com

### 2. Create/Select Project

- Create new project: "Total Audio Tracker"
- Or select existing project

### 3. Enable APIs

- Go to "APIs & Services" → "Enable APIs and Services"
- Enable: **Google Sheets API**
- Enable: **Gmail API**
- Enable: **Google Drive API**

### 4. Create OAuth 2.0 Credentials

- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth Client ID"
- Application type: **Web application**
- Name: "Tracker Production"

**Authorized JavaScript origins**:

```
https://tracker.totalaudiopromo.com
http://localhost:3000
```

**Authorized redirect URIs**:

```
https://tracker.totalaudiopromo.com/api/integrations/google-sheets/callback
https://tracker.totalaudiopromo.com/api/integrations/gmail/callback
http://localhost:3000/api/integrations/google-sheets/callback
http://localhost:3000/api/integrations/gmail/callback
```

### 5. Copy Credentials

You'll get:

- Client ID (starts with something like `123456-abc.apps.googleusercontent.com`)
- Client Secret

Add to `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=your_client_id_here
GOOGLE_SHEETS_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
```

Note: You can use the same Client ID/Secret for both Sheets and Gmail

---

## Airtable OAuth Setup

### 1. Go to Airtable Developers

https://airtable.com/create/oauth

### 2. Create OAuth Integration

- Integration name: "Total Audio Tracker"
- Redirect URIs:
  - `https://tracker.totalaudiopromo.com/api/integrations/airtable/callback`
  - `http://localhost:3000/api/integrations/airtable/callback`

### 3. Scopes Required

- `data.records:read`
- `data.records:write`
- `schema.bases:read`

### 4. Copy Credentials

Add to `.env.local`:

```bash
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=your_client_id_here
AIRTABLE_CLIENT_SECRET=your_client_secret_here
```

---

## Mailchimp OAuth Setup

### 1. Go to Mailchimp Developers

https://mailchimp.com/developer/

### 2. Register App

- Go to "Register an App"
- App name: "Total Audio Tracker"
- Redirect callback URL: `https://tracker.totalaudiopromo.com/api/integrations/mailchimp/callback`

### 3. Copy Credentials

Add to `.env.local`:

```bash
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=your_client_id_here
MAILCHIMP_CLIENT_SECRET=your_client_secret_here
```

---

## Vercel Cron Secret

Generate a random secret for securing cron endpoints:

```bash
# Generate random secret
openssl rand -base64 32
```

Add to `.env.local`:

```bash
CRON_SECRET=your_generated_secret_here
```

---

## Complete .env.local Template

```bash
# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (you already have these)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Anthropic (you already have this)
ANTHROPIC_API_KEY=your_anthropic_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or https://tracker.totalaudiopromo.com

# Google (Sheets + Gmail)
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=
GOOGLE_SHEETS_CLIENT_SECRET=
NEXT_PUBLIC_GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=

# Airtable
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=
AIRTABLE_CLIENT_SECRET=

# Mailchimp
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=
MAILCHIMP_CLIENT_SECRET=

# Cron Secret
CRON_SECRET=
```

---

## Deploy to Vercel

Add all environment variables to Vercel:

```bash
# Navigate to project root
cd /Users/chrisschofield/workspace/active/total-audio-platform

# Add each variable to Vercel
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID production
vercel env add GOOGLE_SHEETS_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_GMAIL_CLIENT_ID production
vercel env add GMAIL_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_AIRTABLE_CLIENT_ID production
vercel env add AIRTABLE_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_MAILCHIMP_CLIENT_ID production
vercel env add MAILCHIMP_CLIENT_SECRET production
vercel env add CRON_SECRET production
```

---

## Vercel Cron Job Setup

Add to `vercel.json` in tracker directory:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-integrations",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

This runs the sync every 15 minutes.

---

## Testing OAuth Flows Locally

1. **Start dev server**:

   ```bash
   cd apps/tracker
   npm run dev
   ```

2. **Visit integrations page**:

   ```
   http://localhost:3000/dashboard/integrations
   ```

3. **Click "Connect Google Sheets"**:

   - Should redirect to Google OAuth
   - Authorize the app
   - Should redirect back to Tracker

4. **Check database**:
   ```sql
   SELECT * FROM integration_connections;
   ```

You should see your connection with encrypted credentials.

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

- Check that your redirect URIs in Google Console match exactly
- Include both `http://localhost:3000` and `https://tracker.totalaudiopromo.com`

### Error: "invalid_client"

- Client ID or Secret is incorrect
- Check you copied the full values
- Check environment variables are set

### Error: "access_denied"

- User clicked "Cancel" in OAuth flow
- Try again

### Token expired errors

- The OAuth handler automatically refreshes tokens
- Check that refresh_token is stored in credentials

---

## Security Notes

1. **Never commit `.env.local`** - it's in .gitignore
2. **Use Supabase Vault for production** - encrypt OAuth tokens
3. **Rotate secrets regularly** - especially CRON_SECRET
4. **Monitor error logs** - check `integration_sync_logs` table

---

## Next Steps After Setup

1. Apply database migration:

   ```bash
   # Copy SQL to Supabase dashboard
   cat supabase/migrations/013_integrations_system.sql
   ```

2. Install new dependencies:

   ```bash
   npm install
   ```

3. Test OAuth flows

4. Deploy to production:

   ```bash
   git push
   ```

5. Verify cron job runs (check Vercel logs)
