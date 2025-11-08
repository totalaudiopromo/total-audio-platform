# Gmail Integration Setup Guide

## Overview

This guide will help you set up Gmail integration for Total Audio Promo to track email replies and send emails directly from your Gmail account.

## Prerequisites

- Google Cloud Platform account
- Gmail account
- Node.js backend running

## Step 1: Google Cloud Platform Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

### 1.2 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the following:
   - **Name**: Total Audio Promo Gmail Integration
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3001/api/gmail/callback`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## Step 2: Environment Variables

Add these variables to your `.env` file:

```bash
# Gmail Integration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id

# Gmail OAuth Redirect URLs
GMAIL_REDIRECT_URI=http://localhost:3001/api/gmail/callback
BACKEND_URL=http://localhost:3001

# Other required variables
DATABASE_URL=postgresql://username:password@localhost:5432/total_audio_promo
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Step 3: Database Schema

The Gmail integration requires these database tables (already included in your Prisma schema):

```prisma
model Integration {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "GMAIL", "MAILCHIMP", etc.
  status    String   // "CONNECTED", "DISCONNECTED", "ERROR"
  config    Json     // OAuth tokens and settings
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, type])
}

model EmailCampaign {
  id          String   @id @default(cuid())
  campaignId  String
  subject     String
  content     String
  recipientCount Int
  sentAt      DateTime @default(now())
  analytics   EmailCampaignAnalytics?

  @@index([campaignId])
}

model EmailCampaignAnalytics {
  id              String   @id @default(cuid())
  emailCampaignId String   @unique
  emailCampaign   EmailCampaign @relation(fields: [emailCampaignId], references: [id])
  replies         Int      @default(0)
  replyRate       Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model EmailReply {
  id        String   @id @default(cuid())
  campaignId String
  contactId String?
  email     String
  subject   String
  content   String
  timestamp DateTime @default(now())

  @@index([campaignId])
  @@index([contactId])
}
```

## Step 4: API Endpoints

The Gmail integration provides these endpoints:

### Authentication

- `GET /api/gmail/auth` - Initiate OAuth flow
- `GET /api/gmail/callback` - OAuth callback handler
- `GET /api/gmail/status` - Check connection status
- `DELETE /api/gmail/disconnect` - Disconnect Gmail

### Email Operations

- `POST /api/gmail/send` - Send individual email
- `POST /api/gmail/send-bulk` - Send bulk emails
- `GET /api/gmail/search` - Search emails
- `GET /api/gmail/thread/:threadId` - Get email thread

### Campaign Tracking

- `POST /api/gmail/track-replies/:campaignId` - Start reply tracking
- `GET /api/gmail/analytics/:campaignId` - Get campaign analytics
- `GET /api/gmail/replies/:campaignId` - Get recent replies

## Step 5: Frontend Integration

The Gmail integration includes a React component (`GmailIntegration.tsx`) that provides:

- **Connection Status**: Shows if Gmail is connected
- **OAuth Flow**: Handles Gmail authentication
- **Campaign Tracking**: Start/stop reply tracking for campaigns
- **Analytics**: View email reply statistics
- **Quick Email Sender**: Send emails directly from the interface

## Step 6: Testing the Integration

### 6.1 Test Connection

1. Start your backend server
2. Navigate to `/integrations` in your frontend
3. Click "Connect" on the Gmail integration
4. Complete the OAuth flow
5. Verify the connection status shows "Connected"

### 6.2 Test Email Sending

1. Use the "Quick Email Sender" in the Gmail integration component
2. Send a test email to yourself
3. Verify the email is received

### 6.3 Test Reply Tracking

1. Create a campaign in your system
2. Start reply tracking for the campaign
3. Send emails from the campaign
4. Reply to those emails from your Gmail
5. Check the analytics to see if replies are tracked

## Troubleshooting

### Common Issues

1. **OAuth Error**: "redirect_uri_mismatch"

   - Solution: Ensure the redirect URI in Google Cloud Console matches your backend URL

2. **Token Expired**: "invalid_grant"

   - Solution: Re-authenticate by disconnecting and reconnecting Gmail

3. **Permission Denied**: "insufficient_permission"

   - Solution: Ensure the Gmail API is enabled in Google Cloud Console

4. **Rate Limiting**: "quota_exceeded"
   - Solution: Implement exponential backoff in your requests

### Debug Mode

Enable debug logging by setting:

```bash
LOG_LEVEL=debug
```

### Monitoring

Check the logs for Gmail-related activities:

```bash
tail -f logs/combined.log | grep gmail
```

## Security Considerations

1. **Token Storage**: OAuth tokens are encrypted in the database
2. **HTTPS**: Use HTTPS in production for all OAuth flows
3. **Scopes**: Only request necessary Gmail scopes
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Token Refresh**: Automatically refresh expired tokens

## Production Deployment

For production deployment:

1. Update redirect URIs to your production domain
2. Use environment-specific Google Cloud projects
3. Implement proper error handling and logging
4. Set up monitoring for Gmail API quotas
5. Use HTTPS for all OAuth flows

## API Reference

### GmailService Class

```typescript
class GmailService {
  constructor(config: GmailConfig);

  // Authentication
  async refreshTokens(): Promise<void>;

  // Email Operations
  async sendEmail(to: string, subject: string, content: string): Promise<void>;
  async sendBulkEmail(
    recipients: string[],
    subject: string,
    content: string
  ): Promise<BulkEmailResult>;
  async searchEmails(query: string, maxResults?: number): Promise<Email[]>;
  async getEmailThread(threadId: string): Promise<EmailThread>;

  // Campaign Tracking
  async trackReplies(campaignId: string): Promise<void>;
  async getRecentReplies(subject: string, sentAfter: Date): Promise<EmailReply[]>;
  async watchEmailChanges(campaignId: string): Promise<void>;
  async stopWatching(): Promise<void>;

  // Analytics
  async updateReplyAnalytics(campaignId: string): Promise<void>;
}
```

### Response Types

```typescript
interface Email {
  id: string;
  from: string;
  subject: string;
  date: Date;
  snippet: string;
}

interface EmailReply {
  id: string;
  campaignId: string;
  contactId?: string;
  email: string;
  subject: string;
  content: string;
  timestamp: Date;
}

interface BulkEmailResult {
  success: string[];
  failed: string[];
}
```

## Support

For issues with the Gmail integration:

1. Check the logs for error messages
2. Verify your Google Cloud Console settings
3. Ensure all environment variables are set correctly
4. Test with a simple email send operation first
5. Contact support with specific error messages and logs
