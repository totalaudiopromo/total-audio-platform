#!/usr/bin/env tsx
/**
 * Golden Deployment Promotion Script
 * Promotes the latest preview deployments for each app to production.
 * Notifies Telegram and logs all actions.
 *
 * Total Audio Platform (intel / tracker / pitch / command-centre)
 */

import fetch from "node-fetch";

interface VercelDeployment {
  uid: string;
  url: string;
  state: string;
  name: string;
  createdAt: number;
}

const APPS: Record<string, string> = {
  "audio-intel": "audio-intel",
  "tracker": "tracker",
  "pitch-generator": "pitch-generator",
  "command-centre": "command-centre",
};

// === ENVIRONMENT CONFIGURATION ===
const {
  VERCEL_TOKEN,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
} = process.env;

if (!VERCEL_TOKEN) {
  console.error("❌ Missing VERCEL_TOKEN environment variable");
  process.exit(1);
}

const TELEGRAM_ENABLED = TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID;

// === UTILITIES ===
async function sendTelegram(message: string) {
  if (!TELEGRAM_ENABLED) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        chat_id: TELEGRAM_CHAT_ID!,
        text: message,
      }),
    });
  } catch (error) {
    console.error("⚠️ Telegram send failed:", (error as Error).message);
  }
}

async function getLatestPreview(app: string): Promise<VercelDeployment | null> {
  console.error(`🔍 Fetching latest preview for ${app}...`);
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?app=${app}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    console.error(`❌ Failed to fetch deployments for ${app}: ${response.statusText}`);
    return null;
  }

  const data = (await response.json()) as { deployments: VercelDeployment[] };
  const readyDeployment = data.deployments.find((d) => d.state === "READY");

  if (!readyDeployment) {
    console.error(`⚠️ No READY preview deployment found for ${app}`);
    return null;
  }

  console.error(`✅ Found preview deployment: ${readyDeployment.url}`);
  return readyDeployment;
}

async function promoteToProduction(app: string, deployment: VercelDeployment): Promise<boolean> {
  console.error(`🚀 Promoting ${app} → production (${deployment.url})`);

  const response = await fetch(
    `https://api.vercel.com/v13/deployments/${deployment.uid}/promote`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: "production",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Promotion failed for ${app}: ${errorText}`);
    await sendTelegram(`❌ ${app}: Promotion failed. ${errorText}`);
    return false;
  }

  console.error(`✅ ${app} promoted to production.`);
  await sendTelegram(`✅ ${app}: Promoted to production (${deployment.url})`);
  return true;
}

async function runGoldenPromote() {
  console.error("🏁 Starting Golden Promotion Pipeline...");
  const results: Record<string, string> = {};
  const startTime = Date.now();

  for (const app of Object.keys(APPS)) {
    try {
      const deployment = await getLatestPreview(app);
      if (!deployment) {
        results[app] = "No ready deployment";
        continue;
      }

      const success = await promoteToProduction(app, deployment);
      results[app] = success ? "Promoted ✅" : "Failed ❌";
    } catch (error) {
      console.error(`❌ Error promoting ${app}:`, error);
      results[app] = "Error ❌";
    }

    // Delay between promotions (to avoid API rate limit)
    await new Promise((r) => setTimeout(r, 2000));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.error("\n=== Golden Promotion Summary ===");
  Object.entries(results).forEach(([app, status]) => console.error(`${app}: ${status}`));
  console.error(`Total time: ${duration}s`);

  const allSuccess = Object.values(results).every((s) => s.includes("✅"));
  const finalMsg = allSuccess
    ? "✅ Golden Deployment successful and promoted to production!"
    : "⚠️ Golden Deployment completed with issues (check logs).";

  await sendTelegram(finalMsg);
  process.exit(allSuccess ? 0 : 1);
}

// === RUN ===
runGoldenPromote().catch((err) => {
  console.error("❌ Fatal error in golden-promote:", err);
  sendTelegram(`❌ Golden Deployment failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});