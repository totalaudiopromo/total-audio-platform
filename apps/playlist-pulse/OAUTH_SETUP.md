# OAuth Setup Guide for Playlist Pulse

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up OAuth consent screen
6. Create OAuth 2.0 Client ID for "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
8. Copy the Client ID and Client Secret

## Apple OAuth Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new "Services ID"
4. Enable "Sign In with Apple"
5. Configure the domain and redirect URL
6. Create a key for "Sign In with Apple"
7. Download the key and note the Key ID
8. Generate a client secret using the key

## Environment Variables

Create a `.env.local` file in the project root with:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth (Optional)
APPLE_ID=your-apple-client-id
APPLE_SECRET=your-apple-client-secret
```

## Notes

- If OAuth credentials are not provided, only email/password authentication will be available
- The demo account (<demo@example.com> / password123) will always work
- OAuth providers are automatically enabled when credentials are provided 
