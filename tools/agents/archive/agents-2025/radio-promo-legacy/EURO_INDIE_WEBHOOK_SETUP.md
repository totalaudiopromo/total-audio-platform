# Euro Indie Music Network - Webhook Setup Guide

## Overview

The Discord bot now supports approval workflows for purchasing the £10 Euro Indie Music one-song package. When requested through the bot, it will send an approval notification to a designated Discord channel for Chris to review.

## Setup Instructions

### 1. Create Discord Webhook

1. Go to your Discord server settings
2. Navigate to the channel where you want approval requests (e.g., #approvals or #admin)
3. Click **Integrations** → **Webhooks** → **New Webhook**
4. Name it: "Euro Indie Purchase Requests"
5. Copy the **Webhook URL** (looks like: `https://discord.com/api/webhooks/123456789/abcdefg...`)

### 2. Update Environment Variables

Add the webhook URL to your `.env` file:

```bash
EURO_INDIE_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

**Security Note**: The webhook URL has been added to `.env.vault` for backup. Keep this secure as it allows posting to your Discord channel.

### 3. How It Works

When someone asks the bot to purchase a Euro Indie Music package:

1. Bot sends an embedded message to your approval channel with:
   - Artist name
   - Track title
   - Reason for purchase
   - Package details (£10 One Song Package)
   - Euro Indie Music contact information

2. Chris receives notification and can:
   - Approve: Contact Euro Indie Music directly and complete purchase
   - Reject: Respond in Discord explaining why

3. Bot informs the user that approval request has been sent

### 4. Bot Commands

Users can request Euro Indie packages by asking naturally:

- "Can we buy the Euro Indie Music package for Artist Name - Track Title?"
- "Request approval for €10 Euro Indie package"
- "I need the one-song package for this campaign"

The AI agent will detect the intent and trigger the approval workflow.

### 5. Euro Indie Music Contact Details

**Configured Details**:

```javascript
const EURO_INDIE_CONTACT = {
  email: 'euroindiemusic@gmail.com',
  name: 'Alessandro',
  packagePrice: 10,
  packageName: 'Formula Indie Promotion (1 Slot)',
  purchaseUrl: 'https://euroindiemusic.bigcartel.com/product/formula-indie-promotion-1-slot',
  submissionInstructions:
    'Email Alessandro with MP3 attached (filename: ArtistName-TrackName.mp3) with friendly message',
};
```

**After Purchase Workflow**:

1. Purchase package at: https://euroindiemusic.bigcartel.com/product/formula-indie-promotion-1-slot
2. Prepare MP3 file with naming: `ArtistName-TrackName.mp3`
3. Email Alessandro (euroindiemusic@gmail.com) with:
   - Subject: "New Track for Euro Indie Music Network - [Artist Name]"
   - Body: "Hi Alessandro, here's a new track for rotation on Euro Indie Music Network. Looking forward to hearing it on air!"
   - Attachment: The MP3 file

### 6. Monday.com Board Security

The bot is **hardcoded** to only access Chris Schofield's Monday.com board:

- **Board ID**: `2443582331`
- **Board URL**: https://liberty-music.monday.com/boards/2443582331
- **Restriction**: Cannot read or write to any other boards in the Liberty Music workspace

This ensures the company-wide Monday.com account remains secure.

## Testing

Test the webhook by asking the bot:

```
@Audio Can you request approval for the Euro Indie Music package for Test Artist - Test Track? We need it for radio promotion campaign.
```

You should receive an embedded message in your approval channel.

## Troubleshooting

### Webhook not working

1. Check that `EURO_INDIE_WEBHOOK_URL` is set in `.env`
2. Verify webhook URL is valid (visit it in browser - should show "Unknown Webhook")
3. Check bot logs for webhook errors
4. Restart bot: `npm run agents:discord`

### Wrong channel receiving notifications

1. Recreate webhook in the correct channel
2. Update `.env` with new webhook URL
3. Restart bot

### Bot says webhook not configured

1. Ensure `.env` file has `EURO_INDIE_WEBHOOK_URL=...`
2. Check for typos in env variable name
3. Run: `echo $EURO_INDIE_WEBHOOK_URL` to verify it's loaded
4. Restart bot to reload environment variables

## Security Considerations

- **Webhook URL**: Keep secure - anyone with this URL can post to your channel
- **Monday.com**: Board access is hardcoded to `2443582331` - cannot be changed without code modification
- **Discord Bot Token**: Already secured in `.env` and `.env.vault`
- **Radio Portal Credentials**: Amazing Radio and Wigwam use existing credentials from `.env`

## Feature Summary

✅ **Deprecation Warning Fixed**: Changed from `ready` to `clientReady` event
✅ **Amazing Radio Integration**: Automated browser submission with Puppeteer
✅ **Wigwam Integration**: Automated browser submission with Puppeteer
✅ **Euro Indie Webhook**: Purchase approval workflow via Discord
✅ **Monday.com Security**: Hardcoded to Chris Schofield board only (`2443582331`)
✅ **Thread Conversations**: No need to @mention bot repeatedly
✅ **Cost Transparency**: ~$0.003 per message displayed in startup

## Next Steps

1. Create webhook in your Discord server
2. Copy webhook URL to `.env`
3. Test with a sample approval request
4. Update Euro Indie contact details if you have specific contact person
5. Configure role mentions in approval messages (optional)

---

**Last Updated**: September 29, 2025
**Bot Version**: Liberty Radio AI Agent v2.0
**AI Model**: Claude Sonnet 4.5 (claude-sonnet-4-20250514)
