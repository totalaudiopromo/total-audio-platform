# Complete OAuth Fix Guide - Liberty Radio Promo Agent

## 🎯 Current Status
**Project**: `gleaming-realm-471715-p3`
**OAuth Client ID**: `309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com`
**Issue**: OAuth consent screen and redirect URIs need proper configuration

## 📋 Required Google Cloud Console Fixes (5 minutes)

### Step 1: Configure OAuth Consent Screen
**URL**: https://console.cloud.google.com/apis/credentials/consent?project=gleaming-realm-471715-p3

**What to do:**
1. **Verify User Type**: Should be "External"
2. **Add Test User**:
   - Click "ADD USERS"
   - Add: `chrisschofield@libertymusicpr.com`
   - Click "SAVE"
3. **Verify App Information**:
   - App name: `Liberty Radio Promo Agent` (or similar)
   - User support email: `chrisschofield@libertymusicpr.com`
   - Developer contact: `chrisschofield@libertymusicpr.com`
4. **Add Authorized Domain**:
   - In "Authorized domains" section
   - Add: `libertymusicpr.com`
   - Click "SAVE AND CONTINUE"

### Step 2: Configure OAuth Credentials (CRITICAL)
**URL**: https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3

**What to do:**
1. **Find your OAuth 2.0 Client ID**: `309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com`
2. **Click the EDIT icon** (pencil) next to it
3. **Add ALL these Authorized redirect URIs** (click "+ ADD URI" for each):
   ```
   http://localhost:3000/callback
   http://localhost:3001/callback
   http://localhost:3002/callback
   http://localhost:8080/callback
   http://127.0.0.1:3000/callback
   http://127.0.0.1:3001/callback
   http://127.0.0.1:8080/callback
   ```
4. **Click "SAVE"**

### Step 3: Verify APIs are Enabled
Enable these APIs if they're not already enabled:

**Gmail API**: https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=gleaming-realm-471715-p3
- Click "ENABLE" if not already enabled

**Drive API**: https://console.cloud.google.com/apis/library/drive.googleapis.com?project=gleaming-realm-471715-p3
- Click "ENABLE" if not already enabled

**Calendar API**: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=gleaming-realm-471715-p3
- Click "ENABLE" if not already enabled

## 🚀 Test OAuth Setup

After completing the Google Cloud Console fixes above:

### Run the Foolproof OAuth Setup
```bash
cd tools/agents/radio-promo
node foolproof-oauth-setup.js
```

**What happens:**
1. Script finds an available port automatically
2. Starts OAuth callback server
3. Opens browser to Google OAuth page
4. You sign in and click "Allow"
5. Browser redirects back to server
6. Server exchanges code for tokens
7. Tests Gmail, Drive, Calendar connections
8. Shows success page
9. Saves tokens automatically

### Verify Integration Works
```bash
node radio-promo-agent.js find-liberty-campaigns-gmail
```

**Expected result:** Should use real Gmail API instead of demo mode

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: Add the redirect URI shown in the error to Step 2 above

### Error: "invalid_client" or "Access blocked"
**Solution**: Complete Step 1 (OAuth consent screen) and add yourself as test user

### Error: "invalid_grant"
**Solution**: Authorization code expired - run the setup again

### Error: "Access denied"
**Solution**: You clicked "Cancel" - run setup again and click "Allow"

## 📁 Files Created/Modified
- ✅ `foolproof-oauth-setup.js` - New robust OAuth setup script
- ✅ `gmail-token.json` - OAuth tokens (created after successful setup)
- ✅ Gmail integration updated to use tokens properly

## 🎉 Success Indicators
- ✅ No OAuth errors in terminal
- ✅ Gmail API returns real email data
- ✅ Agent shows "OAuth tokens found - using real Gmail API"
- ✅ Campaign emails from actual Gmail account

## ⏰ Time Estimate
- **Google Cloud Console fixes**: 5 minutes
- **Running OAuth setup**: 2 minutes
- **Testing agent**: 1 minute
- **Total**: ~8 minutes

## 🆘 Fallback Options
If OAuth setup continues to fail:
1. **Use Gmail Demo Mode** (already working)
2. **Try Service Account authentication** (different approach)
3. **Use Application Default Credentials** (requires gcloud CLI)

---

**🎯 The key issue was missing redirect URIs and test user configuration. Once those are fixed in Google Cloud Console, the OAuth flow should work perfectly.**