# Telegram Bot Integration Guide

## Overview

The Total Audio Platform uses a unified Telegram bot (@TotalAudioBot) to send workflow notifications, audit alerts, and growth insights to a central operator console.

## Features

- **Unified Signal Feed**: One bot handles both `total-audio-platform` and `totalaud.io` repositories
- **Repository Identification**: Messages are prefixed with emoji indicators:
  - 🎧 `[Platform]` - total-audio-platform notifications
  - 🌌 `[Totalaud.io]` - totalaud.io notifications
- **Automated Notifications**:
  - Daily revenue audit results (✅ PASS / ⚠️ WARNING / 🚨 FAIL)
  - Weekly growth insights reports (📈)
  - Workflow failures and errors
  - Deployment status updates

## Setup Instructions

### Step 1: Create Telegram Bot (One-Time Setup)

If you haven't created @TotalAudioBot yet:

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow prompts to name your bot (e.g., "Total Audio Bot")
4. Set username (e.g., `@TotalAudioBot`)
5. Save the **bot token** provided by BotFather

### Step 2: Get Your Chat ID

1. Start a conversation with your new bot on Telegram
2. Send any message to the bot (e.g., "Hello")
3. Open this URL in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for `"chat":{"id":` in the response - this is your **chat ID**

### Step 3: Add GitHub Secrets

Add these secrets to **both** repositories:

#### For `total-audio-platform`:

1. Go to: https://github.com/totalaudiopromo/total-audio-platform/settings/secrets/actions
2. Click **"New repository secret"**
3. Add:
   - **Name**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Your bot token from BotFather
4. Add another secret:
   - **Name**: `TELEGRAM_CHAT_ID`
   - **Value**: Your chat ID from Step 2

#### For `totalaud.io`:

1. Go to: https://github.com/totalaudiopromo/totalaud.io/settings/secrets/actions
2. Repeat the same process (same token and chat ID for unified feed)

### Step 4: Test the Integration

#### Test in `total-audio-platform`:

1. Go to **Actions** tab: https://github.com/totalaudiopromo/total-audio-platform/actions
2. Select **"Telegram Notification Test"** workflow
3. Click **"Run workflow"**
4. Enter test message: `Testing from total-audio-platform`
5. Within 3-5 seconds, check Telegram for:
   ```
   🎧 [Platform] Testing from total-audio-platform
   ```

#### Test in `totalaud.io`:

1. Repeat the same steps in the totalaud.io repository
2. Expected message format:
   ```
   🌌 [Totalaud.io] Testing from totalaud.io
   ```

## Notification Types

### Revenue Audit Notifications

**Success (Daily at midnight UTC)**:
```
🎧 [Platform] ✅ Revenue Audit Passed - 2025-11

All revenue data in sync.
[View Run](https://github.com/...)
```

**Warning**:
```
🎧 [Platform] ⚠️ Revenue Audit Warning - 2025-11

Minor discrepancies detected. Review recommended.
[View Run](https://github.com/...)
```

**Failure**:
```
🎧 [Platform] 🚨 Revenue Audit Failed - 2025-11

Critical revenue discrepancy detected. Review required.
[View Run](https://github.com/...)
```

### Growth Insights Notifications

**Success (Weekly on Sundays at 9am UTC)**:
```
🎧 [Platform] 📈 Weekly Growth Insights Ready

Analyzed 4 weeks of growth data.
[View Report](https://github.com/...)
```

**Failure**:
```
🎧 [Platform] ⚠️ Growth Insights Generation Failed

Check workflow logs for details.
[View Run](https://github.com/...)
```

## Technical Details

### Script Location

Both repositories use the same script:
```bash
.github/scripts/send-telegram.sh
```

### Workflow Integration

The script is called from GitHub Actions workflows with environment variables:

```yaml
- name: Notify Telegram
  if: secrets.TELEGRAM_BOT_TOKEN != ''
  env:
    TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
    TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
    MESSAGE: "Your notification message here"
  run: .github/scripts/send-telegram.sh
```

### Repository Detection

The script automatically detects which repository it's running in:

```bash
REPO_NAME="${GITHUB_REPOSITORY##*/}"

if [[ "$REPO_NAME" == "total-audio-platform" ]]; then
  PREFIX="🎧 [Platform]"
elif [[ "$REPO_NAME" == "totalaud.io" ]]; then
  PREFIX="🌌 [Totalaud.io]"
else
  PREFIX="💡 [${REPO_NAME}]"
fi
```

## Troubleshooting

### Not receiving notifications?

1. **Check bot token**: Verify `TELEGRAM_BOT_TOKEN` secret is set correctly
2. **Check chat ID**: Verify `TELEGRAM_CHAT_ID` secret matches your Telegram chat
3. **Start conversation**: Ensure you've sent at least one message to the bot
4. **Check workflow logs**: Look for errors in GitHub Actions output
5. **Test bot manually**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
     -d chat_id="<YOUR_CHAT_ID>" \
     -d text="Test message"
   ```

### Notifications sent but not visible?

- Check your Telegram notification settings
- Ensure bot isn't muted
- Check if messages are in a different folder/category

### Multiple repositories sending notifications?

This is expected! The unified bot handles both:
- `total-audio-platform` (🎧)
- `totalaud.io` (🌌)

Use the emoji prefixes to identify which system sent the notification.

## Future Enhancements

Potential additions to the notification system:

- **Deployment notifications** - Vercel/production deploy status
- **Error alerts** - Runtime errors from production
- **User activity spikes** - Unusual traffic patterns
- **Support bot** - Separate `@TotalAudioSupportBot` for customer queries
- **Team channels** - Send notifications to team group chat instead of individual

## Security Notes

- **Bot token is sensitive**: Never commit it to git or share publicly
- **Chat ID is private**: Only authorized users should have access
- **Use GitHub Secrets**: Always store credentials in repository secrets
- **Rotate tokens regularly**: Change bot token periodically for security

## Related Documentation

- [GitHub Actions Workflows](../.github/workflows/)
- [Revenue Audit Script](../scripts/revenue-audit.ts)
- [Growth Insights Script](../scripts/growth-insights.ts)
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
