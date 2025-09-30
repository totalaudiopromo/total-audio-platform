# Manual Google Cloud Console OAuth Setup

## Quick Fix - Follow These Exact Steps

### Step 1: OAuth Consent Screen

1. **Open this URL:** <https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3>
2. **Click "Edit App"** (or "Configure" if you see that instead)
3. **Scroll down to "Authorized domains"**
4. **Click "Add domain"** and add: `localhost`
5. **Click "Add domain"** again and add: `127.0.0.1`
6. **Click "Save and Continue"**

### Step 2: OAuth Credentials

1. **Open this URL:** <https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3>
2. **Find your OAuth 2.0 Client ID:** `309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com`
3. **Click the edit icon** (pencil) next to it
4. **In "Authorized redirect URIs" section, add these URIs:**
   - `http://localhost:8080`
   - `http://127.0.0.1:8080`
   - `postmessage`
   - `urn:ietf:wg:oauth:2.0:oob`
5. **Click "Save"**

### Step 3: Enable APIs

1. **Gmail API:** <https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=gleaming-realm-471715-p3>
   - Click "Enable"
2. **Google Drive API:** <https://console.cloud.google.com/apis/library/drive.googleapis.com?project=gleaming-realm-471715-p3>
   - Click "Enable"
3. **Google Calendar API:** <https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=gleaming-realm-471715-p3>
   - Click "Enable"

### Step 4: Test the Fix

After completing all steps, run:

```bash
node working-oauth-setup.js
```

## What This Fixes

- **"no registered origin"** error → Fixed by adding localhost domains
- **"invalid_client"** error → Fixed by adding redirect URIs
- **"401 Unauthorized"** error → Fixed by enabling required APIs

## Expected Result

After these changes, the OAuth flow should work without errors and you'll be able to use Gmail, Drive, and Calendar integrations in your Radio Promo Agent.
