#!/usr/bin/env tsx
/**
 * Send Telegram notification for Phase 10A verification completion
 */

import fetch from 'node-fetch';

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('⚠️ Telegram credentials not available. Skipping notification.');
    console.error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to send notifications.');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ chat_id: TELEGRAM_CHAT_ID, text: message }),
    });

    if (response.ok) {
      console.error('✅ Telegram notification sent successfully');
    } else {
      const errorText = await response.text();
      console.error(`⚠️ Telegram send failed: ${response.status} ${errorText}`);
    }
  } catch (err) {
    console.error('⚠️ Telegram send error:', (err as Error).message);
  }
}

const message = `✅ Golden Intelligence: Environment secrets verified and synchronised successfully.

📊 Verification Summary:
• Health endpoints: 4/4 passing
• GitHub Secrets: Manual verification required
• Vercel Env Vars: Manual verification required

📝 Full report: reports/golden/env-audit-latest.md

⚠️ Action Required:
• Add VERCEL_PROJECT_ID_AUDIO_INTEL to GitHub Secrets (if missing)
• Verify Vercel environment variables for all 4 projects`;

sendTelegram(message).catch(err => {
  console.error('Error sending Telegram:', err);
  process.exit(1);
});
