# Google Cloud Console Fix for OAuth

## The Problem

You're getting "no registered origin" and "invalid_client" errors because your Google Cloud Console OAuth settings need to be updated.

## The Solution

### 1. Go to Google Cloud Console

1. Open: <https://console.cloud.google.com/>
2. Select your project: `gleaming-realm-471715-p3`

### 2. Update OAuth Consent Screen

1. Go to: APIs & Services > OAuth consent screen
2. Click "Edit App"
3. Add these Authorized domains:
   - `localhost`
   - `127.0.0.1`

### 3. Update OAuth Credentials

1. Go to: APIs & Services > Credentials
2. Find your OAuth 2.0 Client ID: `309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com`
3. Click the edit (pencil) icon
4. Add these Authorized redirect URIs:
   - `http://localhost:8080`
   - `http://127.0.0.1:8080`
   - `postmessage`
   - `urn:ietf:wg:oauth:2.0:oob`

### 4. Enable Required APIs

Make sure these APIs are enabled:

1. Go to: APIs & Services > Library
2. Enable these APIs:
   - Gmail API
   - Google Drive API
   - Google Calendar API
   - Google Chat API (if needed)

### 5. Test the Fix

After making these changes, run:

```bash
node google-oauth-simple.js
```

## Alternative: Use MCP Server

If OAuth continues to be problematic, the agent can use the MCP server approach instead, which doesn't require OAuth setup.
