# LinkedIn OAuth Setup - Simple Method

## Quick Setup (5 minutes)

### Step 1: Go to LinkedIn Developer Portal

Open: https://www.linkedin.com/developers/apps

### Step 2: Find or Create Your App

Your existing app details:

- **Client ID**: `781ioptlbwi0ok`
- **Client Secret**: `WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==`

If you don't see an app with that Client ID, you may need to create a new one.

### Step 3: Configure Redirect URI

In your app settings:

1. Go to the **Auth**tab
2. Under **Redirect URLs**, add:
   ```
   https://intel.totalaudiopromo.com/auth/linkedin/callback
   ```
3. Save

### Step 4: Request Permissions

In the **Products**tab:

1. Make sure you have **"Share on LinkedIn"**or **"Marketing Developer Platform"**enabled
2. This gives you the `w_member_social` permission needed for posting

### Step 5: Get Access Token

**Option A: Use the OAuth Helper Script**(recommended)

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
npx tsx scripts/get-linkedin-token.ts
```

Follow the prompts. The script will:

1. Give you an authorization URL
2. You authorize in your browser
3. Copy the `code` from the redirect URL
4. Paste it back to get your access token

**Option B: Manual OAuth Flow**

1. **Build the authorization URL**:

   ```
   https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=781ioptlbwi0ok&redirect_uri=https%3A%2F%2Fintel.totalaudiopromo.com%2Fauth%2Flinkedin%2Fcallback&scope=openid%20profile%20email%20w_member_social&state=abc123
   ```

2. **Visit the URL**- LinkedIn will ask you to authorize

3. **Get the code**- After authorization, you'll be redirected to:

   ```
   https://intel.totalaudiopromo.com/auth/linkedin/callback?code=XXXXXXXXXX&state=abc123
   ```

   The page will show an error (this is fine). Copy the `code` value from the URL.

4. **Exchange code for token**- Run this curl command:

   ```bash
   curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code" \
     -d "code=PASTE_CODE_HERE" \
     -d "redirect_uri=https://intel.totalaudiopromo.com/auth/linkedin/callback" \
     -d "client_id=781ioptlbwi0ok" \
     -d "client_secret=WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g=="
   ```

   Replace `PASTE_CODE_HERE` with the code you copied.

5. **Save the token**- The response will include an `access_token`. Copy it!

### Step 6: Add to Environment Variables

**Local (.env.local)**:

```bash
LINKEDIN_CLIENT_ID=781ioptlbwi0ok
LINKEDIN_CLIENT_SECRET=WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==
LINKEDIN_ACCESS_TOKEN=<your token here>
```

**Vercel (Production)**:

```bash
vercel env add LINKEDIN_CLIENT_ID
# Paste: 781ioptlbwi0ok
# Select: Production, Preview, Development

vercel env add LINKEDIN_CLIENT_SECRET
# Paste: WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==
# Select: Production, Preview, Development

vercel env add LINKEDIN_ACCESS_TOKEN
# Paste: <your access token>
# Select: Production, Preview, Development
```

### Step 7: Test

```bash
npx tsx scripts/verify-linkedin-agent.ts
```

---

## Troubleshooting

### "Redirect URI mismatch" error

Make sure you've added the exact redirect URI in your LinkedIn app settings:

```
https://intel.totalaudiopromo.com/auth/linkedin/callback
```

### "Invalid scope" error

Your app needs the `w_member_social` permission. This comes from the "Share on LinkedIn" product. Add it in the Products tab.

### "Token expired" error

LinkedIn access tokens expire after 60 days. Set a calendar reminder to refresh them.

To refresh:

```bash
npx tsx scripts/get-linkedin-token.ts
```

---

## Alternative: Use LinkedIn's Test Token

For quick testing, you can use LinkedIn's temporary test tokens:

1. Go to your app in the developer portal
2. Click "Auth" tab
3. Look for "Access token" section
4. Generate a test token (valid for 60 days)
5. Use this for testing before setting up full OAuth

Note: Test tokens work but you'll still need proper OAuth for production automation.

---

## What Happens After Setup

Once configured, the autonomous posting system will:

- Post to LinkedIn twice daily (9am and 5pm UK time)
- Use content from CONTENT_CALENDAR.json
- Automatically retry failed posts
- Log all activity for debugging

Your LinkedIn access token is valid for 60 days. Set a reminder to refresh it!
