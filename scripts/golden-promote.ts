#!/usr/bin/env tsx
/**
 * Golden Deployment Promotion
 * Promotes the latest READY preview deployment for each app to production
 * and notifies Telegram of progress.
 *
 * Used by the Phase 9E Golden Deployment Pipeline.
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  target: string;
}

interface PromoteResult {
  app: string;
  deploymentId: string;
  url?: string;
  status: "success" | "fail";
  message: string;
  duration: number;
}

const APP_PROJECTS: Record<string, string> = {
  "audio-intel": "audio-intel",
  tracker: "tracker",
  "pitch-generator": "pitch-generator",
  "command-centre": "command-centre",
};

// === ENVIRONMENT VARIABLES ===
const { VERCEL_TOKEN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const TELEGRAM_ENABLED = Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

// === UTILS ===
async function sendTelegram(message: string) {
  if (!TELEGRAM_ENABLED) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ chat_id: TELEGRAM_CHAT_ID!, text: message }),
    });
  } catch (err) {
    console.error("⚠️ Telegram send failed:", (err as Error).message);
  }
}

async function getLatestPreviewDeployment(
  projectName: string,
  token: string
): Promise<VercelDeployment | null> {
  const url = `https://api.vercel.com/v6/deployments?projectId=${projectName}&limit=20`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error(`❌ Failed to fetch deployments for ${projectName}: ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { deployments: VercelDeployment[] };
    const preview = data.deployments.find(
      (d) => d.target === "preview" && d.state === "READY"
    );
    return preview ?? null;
  } catch (err) {
    console.error(`❌ Error fetching deployments for ${projectName}:`, err);
    return null;
  }
}

async function promoteDeployment(
  deploymentId: string,
  token: string
): Promise<{ ok: boolean; text: string }> {
  try {
    const res = await fetch(
      `https://api.vercel.com/v13/deployments/${deploymentId}/promote`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: "production" }),
      }
    );
    const text = await res.text();
    return { ok: res.ok, text };
  } catch (err) {
    return { ok: false, text: (err as Error).message };
  }
}

// === CORE ===
async function promoteAllApps(): Promise<PromoteResult[]> {
  if (!VERCEL_TOKEN) {
    console.error("❌ Missing VERCEL_TOKEN");
    process.exit(1);
  }

  const results: PromoteResult[] = [];
  const startTime = Date.now();

  for (const [appName, projectName] of Object.entries(APP_PROJECTS)) {
    console.error(`\n🚀 Processing ${appName}...`);
    const appStart = Date.now();

    const deployment = await getLatestPreviewDeployment(projectName, VERCEL_TOKEN);
    if (!deployment) {
      await sendTelegram(`❌ ${appName}: No preview deployment found`);
      results.push({
        app: appName,
        deploymentId: "none",
        status: "fail",
        message: "No preview deployment found",
        duration: Date.now() - appStart,
      });
      continue;
    }

    console.error(`✅ Found preview deployment: ${deployment.url} (${deployment.uid})`);
    const { ok, text } = await promoteDeployment(deployment.uid, VERCEL_TOKEN);

    if (ok) {
      console.error(`✅ ${appName} promoted successfully`);
      await sendTelegram(`✅ ${appName}: Promoted to production (${deployment.url})`);
      results.push({
        app: appName,
        deploymentId: deployment.uid,
        url: deployment.url,
        status: "success",
        message: "Promoted successfully",
        duration: Date.now() - appStart,
      });
    } else {
      console.error(`❌ ${appName} promotion failed: ${text}`);
      await sendTelegram(`❌ ${appName}: Promotion failed`);
      results.push({
        app: appName,
        deploymentId: deployment.uid,
        url: deployment.url,
        status: "fail",
        message: text,
        duration: Date.now() - appStart,
      });
    }

    // prevent API rate limits
    await new Promise((r) => setTimeout(r, 1500));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.error(`\n=== Golden Promotion Summary (Total ${duration}s) ===`);
  for (const r of results) {
    const icon = r.status === "success" ? "✓" : "✗";
    console.error(`${icon} ${r.app}: ${r.message}`);
  }

  const allSuccess = results.every((r) => r.status === "success");
  const finalMsg = allSuccess
    ? "✅ Golden Deployment successful and promoted to production!"
    : "⚠️ Golden Deployment completed with some issues.";

  await sendTelegram(finalMsg);

  // Persist JSON report if running in CI
  if (process.env.GITHUB_ACTIONS) {
    const reportDir = path.join(process.cwd(), "reports", "golden");
    fs.mkdirSync(reportDir, { recursive: true });
    const filePath = path.join(reportDir, "promote.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify({ results, timestamp: new Date().toISOString() }, null, 2)
    );
    console.error(`📝 Promotion report saved: ${filePath}`);
  }

  process.exit(allSuccess ? 0 : 1);
}

// === EXECUTE ===
promoteAllApps().catch(async (err) => {
  console.error("❌ Fatal error in promotion:", err);
  await sendTelegram(`❌ Golden Deployment failed: ${(err as Error).message}`);
  process.exit(1);
});