# WARM API Environment Setup - Liberty Radio Promo Agent

## 🎯 Current Status

✅ WARM API endpoint confirmed working: `https://public-api.warmmusic.net/api/v1`  
✅ Authentication format confirmed correct  
⏳ Rate limited from previous failed attempts (wait 10-15 minutes or ask Gustav to whitelist IP)

## 🔧 Required Environment Variables

Add these to your `.env` file in `tools/agents/radio-promo/`:

```bash
# Existing Monday.com key (already configured)
MONDAY_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU2MDQxOTk1MSwiYWFpIjoxMSwidWlkIjoxNzkyMDMyNCwiaWFkIjoiMjAyNS0wOS0xMFQxMzozODoyMC44MzVaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODI0MjgzLCJyZ24iOiJ1c2UxIn0.iSTCqKmzpJxhPxfh9zkAPFIe0dgnhBbrhl8V7Azf1Gw

# WARM API Integration (NEW - Required)
WARM_API_BASE_URL=https://public-api.warmmusic.net/api/v1
WARM_API_EMAIL=promo@totalaudiopromo.com
WARM_API_PASSWORD=YOUR_ACTUAL_WARM_PASSWORD_HERE

# Optional but recommended for full functionality
GOOGLE_CHAT_WEBHOOK=your_google_chat_webhook_here
GEMINI_API_KEY=your_gemini_api_key_here
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
TYPEFORM_API_KEY=your_typeform_api_key_here
```

## 🧪 Testing the Setup

### 1. Test WARM API Authentication

```bash
cd tools/agents/radio-promo
node test-warm-final.js
```

### 2. Test Full Integration

```bash
node test-warm-api.js
```

### 3. Test Liberty Radio Promo Agent

```bash
node radio-promo-agent.js health
```

## 🚨 Troubleshooting

### Rate Limiting (429 Error)

- **Cause**: Previous failed authentication attempts triggered brute force protection
- **Solution**: Wait 10-15 minutes OR ask Gustav to whitelist your IP
- **Test**: Run `node test-warm-final.js` to check if limits cleared

### Authentication Failed (403 Error)

- **Cause**: Wrong email/password or trial expired
- **Solution**:
  1. Verify password is correct
  2. Check 250-song trial is still active
  3. Contact Gustav if trial expired

### Network Issues

- **Cause**: DNS/connectivity problems
- **Solution**: Check internet connection and try again

## 🎵 WARM API Features Available

Once authenticated, the Liberty Radio Promo Agent can:

1. **Real-time Play Tracking** - Monitor track performance across UK radio
2. **Station Database** - Access 200+ UK radio stations
3. **CSV Reports** - Generate weekly performance reports
4. **Campaign Analytics** - Track campaign success metrics
5. **Google Drive Integration** - Auto-save reports to campaign folders

## 📞 Next Steps

1. **Add WARM password** to `.env` file
2. **Wait for rate limits to clear** (or ask Gustav to whitelist IP)
3. **Run test script** to verify authentication
4. **Test full agent** with WARM integration
5. **Start using** for real radio promo campaigns!

---

## 🤖 Discord Co-Pilot Setup

The Discord bot mirrors orchestrator status updates and exposes slash commands.

### Required Environment Variables

Add the following to the repo root `.env` (or `tools/agents/radio-promo/.env` if running standalone):

```bash
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_APP_ID=your_discord_application_id_here
DISCORD_GUILD_ID=your_primary_discord_guild_id_here
# Optional: channel used by the credential test script
DISCORD_BOT_TEST_CHANNEL_ID=your_discord_channel_id_here
```

### Validation Checklist

1. Create a Discord application + bot at <https://discord.com/developers/applications>.
2. Invite the bot to the target guild with the `applications.commands` and `bot` scopes.
3. Confirm `.env` values are set and not wrapped in `${...}` placeholders.
4. Run `npm run agents:discord:test` – success prints the bot identity (optional channel message if configured).

### Launching the Bot

- Run `npm run agents:discord` from the repo root (or `node tools/agents/radio-promo/scripts/discord-copilot.js`).
- On first launch the bot registers `/status`, `/submit`, `/notify`, and `/help` commands for the configured guild.
- The `/status` command reads `tools/agents/radio-promo/status/current-status.json`; ensure the orchestrator keeps this file fresh.
- `/submit` and `/notify` currently act as placeholders – extend the handlers to trigger internal workflows when ready.

## 🔗 Contact

- **WARM Support**: Gustav Morgensol (<gustav@warmmusic.net>)
- **API Endpoint**: <https://public-api.warmmusic.net/api/v1>
- **Documentation**: Check WARM dashboard for full API docs
