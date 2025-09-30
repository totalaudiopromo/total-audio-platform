# Gmail Setup for Liberty Music PR

## Quick Start

Your Gmail organisation system is ready! Just need to set colours manually:

### 1. Open Gmail Settings

- Go to <https://mail.google.com>
- Click gear icon (⚙️) → "See all settings" → "Labels" tab

### 2. Set These Colours

- **Active Campaigns** → 🟢 Green
- **Needs Action** → 🔵 Blue
- **Station Feedback** → 🟠 Orange
- **Completed** → 🟡 Yellow
- **Old Campaigns** → 🔴 Red
- **Agent** → 🟣 Purple

### 3. Done!

Your emails will now auto-organise by colour:

- Green = current work
- Blue = needs your response
- Orange = station replies
- Auto-responses hidden automatically

## Files in This Folder

- `GMAIL_MANUAL_COLOUR_SETUP.md` - Detailed colour setup instructions
- `gmail-liberty-setup.js` - Technical setup script (already run)
- `gmail-colour-setup.js` - Playwright automation (if needed)
- `GMAIL_SETUP_COMPLETE.md` - Full system documentation

## Test Commands

```bash
cd gmail-setup
node gmail-liberty-setup.js test    # Test system
node gmail-liberty-setup.js list    # Show current setup
```

That's it! 2-3 minutes to set colours and your Gmail becomes a radio promo productivity machine.
