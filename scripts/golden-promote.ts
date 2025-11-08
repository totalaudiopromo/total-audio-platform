#!/usr/bin/env tsx
/**
 * ⚠️ DEPRECATED (Phase 10B - 2025-11-08)
 *
 * This script is no longer used in the Golden Pipeline.
 * Vercel Git integration now handles all production deployments automatically.
 *
 * Kept for historical reference only. Do not run or import.
 *
 * For emergency manual deployment, use Vercel dashboard or CLI directly.
 * For rollback, use: pnpm tsx scripts/golden-rollback.ts
 *
 * Original purpose: Verified that all apps have READY production deployments on Vercel
 * and notified Telegram of status.
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

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
  status: 'success' | 'fail';
  message: string;
  duration: number;
}

// === GOLDEN PIPELINE SCOPE (Phase 10A - 2025-11-08) ===
const APP_PROJECTS: Record<string, string> = {
  'audio-intel': process.env.VERCEL_PROJECT_ID!,
  tracker: process.env.VERCEL_PROJECT_ID_TRACKER!,
  'pitch-generator': process.env.VERCEL_PROJECT_ID_PITCH_GENERATOR!,
};

// Validate all project IDs are present
console.error('\n🔍 Validating Vercel project IDs...');
for (const [app, projectId] of Object.entries(APP_PROJECTS)) {
  if (!projectId || projectId === 'undefined') {
    console.error(`❌ Missing VERCEL_PROJECT_ID for ${app}`);
    process.exit(1);
  }
  console.error(`  ✅ ${app}: ${projectId}`);
}

// === ENVIRONMENT VARIABLES ===
const { VERCEL_TOKEN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const TELEGRAM_ENABLED = Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

// === UTILS ===
async function sendTelegram(message: string) {
  if (!TELEGRAM_ENABLED) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ chat_id: TELEGRAM_CHAT_ID!, text: message }),
    });
  } catch (err) {
    console.error('⚠️ Telegram send failed:', (err as Error).message);
  }
}

async function getLatestReadyDeployment(
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
    // Golden deployment: find latest READY production deployment from main branch
    // Vercel auto-deploys main to production, we just verify it's ready
    const deployment = data.deployments.find(d => d.state === 'READY' && d.target === 'production');
    return deployment ?? null;
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
    const res = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}/promote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target: 'production' }),
    });
    const text = await res.text();
    return { ok: res.ok, text };
  } catch (err) {
    return { ok: false, text: (err as Error).message };
  }
}

// === CORE ===
async function promoteAllApps(): Promise<PromoteResult[]> {
  if (!VERCEL_TOKEN) {
    console.error('❌ Missing VERCEL_TOKEN');
    process.exit(1);
  }

  const results: PromoteResult[] = [];
  const startTime = Date.now();

  for (const [appName, projectName] of Object.entries(APP_PROJECTS)) {
    console.error(`\n🚀 Processing ${appName}...`);
    const appStart = Date.now();

    const deployment = await getLatestReadyDeployment(projectName, VERCEL_TOKEN);
    if (!deployment) {
      await sendTelegram(`❌ ${appName}: No production deployment found`);
      results.push({
        app: appName,
        deploymentId: 'none',
        status: 'fail',
        message: 'No production deployment found',
        duration: Date.now() - appStart,
      });
      continue;
    }

    console.error(`✅ Found production deployment: ${deployment.url} (${deployment.uid})`);
    console.error(`✅ ${appName} already in production - Golden deployment verified`);
    await sendTelegram(`✅ ${appName}: Production deployment verified (${deployment.url})`);
    results.push({
      app: appName,
      deploymentId: deployment.uid,
      url: deployment.url,
      status: 'success',
      message: 'Production deployment verified',
      duration: Date.now() - appStart,
    });

    // prevent API rate limits
    await new Promise(r => setTimeout(r, 1500));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.error(`\n=== Golden Promotion Summary (Total ${duration}s) ===`);
  for (const r of results) {
    const icon = r.status === 'success' ? '✓' : '✗';
    console.error(`${icon} ${r.app}: ${r.message}`);
  }

  const allSuccess = results.every(r => r.status === 'success');
  const finalMsg = allSuccess
    ? '✅ Golden Deployment (3-app scope) successful:\n- audio-intel\n- tracker\n- pitch-generator'
    : '⚠️ Golden Deployment completed with some issues.';

  await sendTelegram(finalMsg);

  // Persist JSON report if running in CI
  if (process.env.GITHUB_ACTIONS) {
    const reportDir = path.join(process.cwd(), 'reports', 'golden');
    fs.mkdirSync(reportDir, { recursive: true });
    const filePath = path.join(reportDir, 'promote.json');
    fs.writeFileSync(
      filePath,
      JSON.stringify({ results, timestamp: new Date().toISOString() }, null, 2)
    );
    console.error(`📝 Promotion report saved: ${filePath}`);
  }

  process.exit(allSuccess ? 0 : 1);
}

// === EXECUTE ===
promoteAllApps().catch(async err => {
  console.error('❌ Fatal error in promotion:', err);
  await sendTelegram(`❌ Golden Deployment failed: ${(err as Error).message}`);
  process.exit(1);
});
