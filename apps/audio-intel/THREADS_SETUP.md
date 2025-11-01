# Threads (Instagram) API Setup

## Prerequisites Check

Before you can post to Threads via API, you need:

- [ ] **Professional Instagram Account** (not personal)
- [ ] Instagram account connected to a **Facebook Page**
- [ ] Access to **Facebook Developers** portal

### Don't Have These Yet?

**Convert to Professional Account**:

1. Open Instagram app
2. Go to Settings → Account
3. Select "Switch to Professional Account"
4. Choose a category (e.g., "Musician/Band")

**Create/Connect Facebook Page**:

1. Create a Facebook Page if you don't have one
2. In Instagram: Settings → Business → Link to Facebook Page

---

## Quick Setup (15 minutes)

### Step 1: Create Facebook App

1. Go to: https://developers.facebook.com/apps
2. Click **"Create App"**
3. Select **"Business"** as the app type
4. Fill in:
   - App name: "Total Audio Posting"
   - App contact email: your email
   - Business account: (create if needed)

### Step 2: Add Threads API Product

1. In your new app dashboard
2. Click **"Add Product"**
3. Find **"Threads API"** and click **"Set Up"**

### Step 3: Request Permissions

1. Go to **App Review** → **Permissions and Features**
2. Request these permissions:
   - `threads_basic`
   - `threads_content_publish`
3. Facebook may require app review for these permissions

### Step 4: Get Your Credentials

1. Go to **Settings** → **Basic**
2. Copy your:
   - **App ID**
   - **App Secret** (click "Show")

Add these to `.env.local`:

```bash
THREADS_APP_ID=<your app id>
THREADS_APP_SECRET=<your app secret>
```

### Step 5: Configure Redirect URI

1. In your app, go to **Threads API** → **Settings**
2. Add redirect URI:
   ```
   https://intel.totalaudiopromo.com/auth/threads/callback
   ```

### Step 6: Get Access Token

**Option A: Use the OAuth Helper Script** (recommended)

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
npx tsx scripts/get-threads-token.ts
```

**Option B: Manual OAuth Flow**

1. **Build authorization URL**:

   ```
   https://threads.net/oauth/authorize?client_id=YOUR_APP_ID&redirect_uri=https%3A%2F%2Fintel.totalaudiopromo.com%2Fauth%2Fthreads%2Fcallback&scope=threads_basic,threads_content_publish&response_type=code&state=abc123
   ```

   Replace `YOUR_APP_ID` with your actual app ID.

2. **Visit the URL** - Authorize with your Instagram business account

3. **Get the code** - After authorization:

   ```
   https://intel.totalaudiopromo.com/auth/threads/callback?code=XXXXXXXXXX&state=abc123
   ```

   Copy the `code` value.

4. **Exchange for short-lived token**:

   ```bash
   curl "https://graph.threads.net/oauth/access_token?client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&grant_type=authorization_code&redirect_uri=https://intel.totalaudiopromo.com/auth/threads/callback&code=PASTE_CODE_HERE"
   ```

5. **Exchange for long-lived token** (60 days):

   ```bash
   curl "https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
   ```

6. **Save the response** - You'll get:
   - `access_token` (long-lived, 60 days)
   - `user_id` (your Instagram user ID)

### Step 7: Add to Environment Variables

**Local (.env.local)**:

```bash
THREADS_USER_ID=<user id from response>
THREADS_ACCESS_TOKEN=<long-lived token from response>
```

**Vercel (Production)**:

```bash
vercel env add THREADS_USER_ID
# Paste your user ID
# Select: Production, Preview, Development

vercel env add THREADS_ACCESS_TOKEN
# Paste your long-lived access token
# Select: Production, Preview, Development
```

### Step 8: Test

```bash
npx tsx scripts/test-threads-agent.ts
```

---

## Common Issues

### "Invalid Instagram Account"

Your account must be:

- Professional (not personal)
- Connected to a Facebook Page
- The same account you authorized with

### "Permissions Not Approved"

Facebook may require app review for posting permissions. This can take a few days.

**Workaround for testing**: Add your Instagram account as a tester:

1. App Dashboard → Roles → Roles
2. Add Instagram Testers
3. Add your Instagram username

This lets you test while waiting for app review.

### "Token Expired"

Threads long-lived tokens expire after 60 days.

**Set a calendar reminder** to refresh every 55 days:

```bash
npx tsx scripts/get-threads-token.ts
```

Then update Vercel:

```bash
vercel env add THREADS_ACCESS_TOKEN
```

---

## Alternative: Skip Threads for Now

Threads API setup is the most complex because it requires:

- Facebook app approval (can take days)
- Business Instagram account
- Facebook Page connection

**You can launch with Bluesky and LinkedIn first**, then add Threads later when your Facebook app is approved.

The autonomous posting system will simply skip Threads if credentials aren't configured - the other platforms will still work fine.

---

## Character Limits

Threads has a **500 character limit** for text posts.

The posting agent automatically truncates posts to 497 characters (+ "...") if they're too long.

All content in CONTENT_CALENDAR.json is already optimised for Threads' character limit.

---

## What Happens After Setup

Once configured, the autonomous posting system will:

- Post to Threads twice daily (9am and 5pm UK time)
- Use content from CONTENT_CALENDAR.json
- Automatically handle the two-step posting process (create container → publish)
- Log all activity for debugging

Your Threads access token is valid for 60 days. Set a reminder to refresh it!
