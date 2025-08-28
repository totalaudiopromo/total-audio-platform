# Authentication Setup Guide

## ✅ Demo Credentials (Working Now)

The authentication system is now working with demo credentials:

- **Email:** `demo@example.com`
- **Password:** `password123`

You can test this at: http://localhost:3001/auth/signin

## 🔧 Current Status

### ✅ Working:
- Email/password authentication with demo credentials
- Beautiful sign-in page with glassmorphic design
- Proper error handling and loading states
- Session management

### ⚠️ OAuth Providers (Need Setup):
- Google sign-in (requires OAuth credentials)
- Apple sign-in (requires OAuth credentials)

## 🚀 How to Test Authentication

1. **Visit the sign-in page:** http://localhost:3001/auth/signin
2. **Use demo credentials:**
   - Email: `demo@example.com`
   - Password: `password123`
3. **Test page:** http://localhost:3001/test-auth

## 🔑 Setting Up OAuth Providers

### Google OAuth Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up OAuth consent screen
6. Create OAuth 2.0 Client ID for "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
8. Copy Client ID and Client Secret

### Apple OAuth Setup:

1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new "Services ID"
4. Enable "Sign In with Apple"
5. Configure domain and redirect URL
6. Copy the Client ID and Secret

### Environment Variables:

Create a `.env.local` file in the project root:

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth (Optional)
APPLE_ID=your-apple-id
APPLE_SECRET=your-apple-secret
```

## 🎨 Features

- **Glassmorphic Design:** Beautiful blur effects and transparency
- **Responsive:** Works on all devices
- **Error Handling:** Clear error messages
- **Loading States:** Smooth loading animations
- **Demo Mode:** Works without OAuth setup
- **Session Management:** Proper session handling

## 🔍 Troubleshooting

### If demo credentials don't work:
1. Check server is running: `npm run dev`
2. Clear browser cache
3. Check browser console for errors

### If OAuth doesn't work:
1. Verify environment variables are set
2. Check OAuth credentials are correct
3. Ensure redirect URIs match exactly
4. Check server logs for errors

## 📱 Testing

- **Demo Login:** http://localhost:3001/auth/signin
- **Test Page:** http://localhost:3001/test-auth
- **Main App:** http://localhost:3001

The authentication system is now fully functional with demo credentials! 