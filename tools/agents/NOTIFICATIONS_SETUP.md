# Newsletter Draft Notifications - Setup Complete 

## What You Get

When the automated newsletter runs every Monday at 9:00 AM, you'll receive:

### 1.  macOS Desktop Notification (Always Works)

- Pop-up notification on your Mac
- Sound alert ("Glass" sound)
- Message: "Newsletter Draft Ready! "
- Shows newsletter title

### 2.  Email Notification (If Mail.app Configured)

- Sent to: promo@totalaudiopromo.com
- Subject: "Newsletter Draft Ready: [Newsletter Title]"
- Includes:
  - Draft ID
  - What's included in the newsletter
  - Direct link to ConvertKit dashboard
  - Reminder that review takes ~15 minutes

## How It Works

**Monday 9:00 AM:**

1. Script runs automatically
2. Generates newsletter with 3 stories
3. Creates ConvertKit draft
4. Sends macOS desktop notification
5. Attempts to send email (if Mail.app configured)
6. Logs everything to `tools/agents/logs/`

**You see notification:**

- Desktop: Immediate pop-up
- Email: Check promo@totalaudiopromo.com inbox

**You review draft:**

- Click notification or go to https://app.convertkit.com/broadcasts
- Review content (15 minutes)
- Approve and schedule for Tuesday 9 AM

## Email Setup (Optional)

The email notification requires macOS Mail.app to be configured with an SMTP account.

### If You Want Email Notifications:

1. **Open Mail.app**
2. **Add Account**: Mail > Settings > Accounts
3. **Configure**: Add the email account you want to send from
4. **Test**: The script will automatically try to use it

### If Email Fails:

- **No problem!**Desktop notification always works
- Draft still created in ConvertKit
- Check dashboard manually at https://app.convertkit.com/broadcasts

## Notification Message

**Desktop notification:**

```
Newsletter Draft Ready! 
"The Unsigned Advantage - 14 October 2025" is ready for review in ConvertKit
```

**Email content:**

```
Hi Chris,

Your newsletter draft is ready for review! 

Newsletter: "The Unsigned Advantage - 14 October 2025"
Draft ID: 12345678

 What's included:
- 3 news stories with your expertise connection
- sadact authenticity details
- Tool Philosophy footer
- Specific tactical actions

 Review and approve:
https://app.convertkit.com/broadcasts

This should take about 15 minutes. Once reviewed, schedule for Tuesday 9 AM.

Cheers,
The Unsigned Advantage Bot 
```

## Testing Notifications

**Test now:**

```bash
cd ~/workspace/active/total-audio-platform/tools/agents
node generate-and-send-newsletter.js
```

This will:

1. Generate a real newsletter
2. Create ConvertKit draft
3. Send you a desktop notification
4. Attempt email (if Mail.app configured)

**Test just the notification:**

```bash
osascript -e 'display notification "Test: Newsletter Draft Ready!" with title "Newsletter System" sound name "Glass"'
```

## Troubleshooting

### Desktop Notification Not Showing?

Check System Preferences:

1. System Settings > Notifications
2. Find "Terminal" or "Script Editor"
3. Enable "Allow Notifications"

### Email Not Arriving?

- **Not a problem**- Desktop notification is primary
- Email is bonus if Mail.app is configured
- Can always check ConvertKit dashboard directly

### No Notification at All?

Check the log file:

```bash
tail -f ~/workspace/active/total-audio-platform/tools/agents/logs/newsletter-$(date +%Y-%m-%d).log
```

## Summary

**Primary notification:**macOS desktop pop-up (reliable)
**Backup notification:**Email via Mail.app (if configured)
**Fallback:**Check ConvertKit dashboard directly
**Frequency:**Every Monday 9:00 AM
**Your action:**Review draft within 30 minutes

You won't forget to review the newsletter - you'll get a notification on your Mac every Monday morning! 

---

**Last Updated**: October 11, 2025
**Status**: Active and automated
**Next notification**: Next Monday 9:00 AM
