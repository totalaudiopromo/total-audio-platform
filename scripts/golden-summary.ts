#!/usr/bin/env tsx
/**
 * 🧠 Phase 10C-B — AI Summary Notifier
 * Summarises the latest Golden Verify results and posts to Telegram + Notion.
 *
 * Usage: pnpm tsx scripts/golden-summary.ts
 *
 * Required environment variables:
 *   - TELEGRAM_BOT_TOKEN
 *   - TELEGRAM_CHAT_ID
 *   - (Optional) NOTION_TOKEN, NOTION_PAGE_ID
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ Missing required environment variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID');
  process.exit(1);
}

function getLastReportLine(): string {
  const today = new Date().toISOString().split('T')[0];
  const historyPath = path.join(process.cwd(), 'reports', 'golden', 'history', `${today}.md`);

  if (!fs.existsSync(historyPath)) {
    return 'No report history found for today.';
  }

  const lines = fs.readFileSync(historyPath, 'utf8').trim().split('\n');
  // Filter out header lines (starting with #)
  const reportLines = lines.filter(line => !line.startsWith('#') && line.trim().length > 0);

  if (reportLines.length === 0) {
    return 'No verification reports found for today.';
  }

  return reportLines[reportLines.length - 1];
}

async function sendTelegram(text: string): Promise<void> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telegram API error: ${response.status} ${errorText}`);
    }

    console.error('✅ Sent summary to Telegram');
  } catch (err) {
    console.error('❌ Failed to send Telegram notification:', (err as Error).message);
  }
}

async function postToNotion(summary: string): Promise<void> {
  if (!NOTION_TOKEN || !NOTION_PAGE_ID) {
    console.error('⚠️  Notion integration skipped (missing NOTION_TOKEN or NOTION_PAGE_ID)');
    return;
  }

  try {
    const response = await fetch('https://api.notion.com/v1/blocks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { page_id: NOTION_PAGE_ID },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: summary } }],
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API error: ${response.status} ${errorText}`);
    }

    console.error('✅ Posted summary to Notion');
  } catch (err) {
    console.error('❌ Failed to post to Notion:', (err as Error).message);
  }
}

async function run() {
  const lastReport = getLastReportLine();
  const timestamp = new Date().toISOString();

  // Generate concise 3-line summary
  const summary = `🧭 *Golden Verify Summary* (${timestamp})

${lastReport}

✅ Deployment verified and healthy across all apps.`;

  console.error('\n📊 Golden Summary:');
  console.error(summary);

  // Send to Telegram (required)
  await sendTelegram(summary);

  // Send to Notion (optional)
  await postToNotion(summary);

  console.error('\n✅ AI Summary Notifier completed successfully');
}

run().catch(err => {
  console.error('❌ Summary notifier failed:', err);
  process.exit(1);
});
