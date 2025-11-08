#!/usr/bin/env tsx
/**
 * Golden Deployment Rollback (Manual Trigger Only - Phase 10B)
 *
 * 🟡 MANUAL INVOCATION REQUIRED
 * This script is NOT automatically triggered by CI/CD workflows.
 * Run manually when post-deployment health checks fail.
 *
 * Usage: pnpm tsx scripts/golden-rollback.ts
 *
 * Required environment variables:
 *   - VERCEL_TOKEN
 *   - VERCEL_PROJECT_ID_AUDIO_INTEL
 *   - VERCEL_PROJECT_ID_TRACKER
 *   - VERCEL_PROJECT_ID_PITCH_GENERATOR
 *   - (Optional) TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 *
 * Emergency procedure:
 *   1. Identify failed deployment via golden-postcheck.ts reports
 *   2. Set required environment variables
 *   3. Run this script to rollback to previous READY deployment
 *   4. Verify rollback via health endpoints
 *
 * Uses Vercel REST API v13 to find and promote the previous READY deployment.
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
  meta?: {
    githubCommitSha?: string;
    githubCommitRef?: string;
    githubCommitMessage?: string;
  };
}

interface RollbackResult {
  app: string;
  projectId: string;
  previousDeploymentId?: string;
  previousDeploymentUrl?: string;
  currentDeploymentId?: string;
  status: 'success' | 'fail' | 'skipped';
  message: string;
  duration: number;
}

interface RollbackReport {
  timestamp: string;
  overall: 'success' | 'partial' | 'fail';
  duration: number;
  results: RollbackResult[];
}

// === GOLDEN PIPELINE SCOPE (Phase 10A - 2025-11-08) ===
const APP_PROJECTS: Record<string, string> = {
  'audio-intel': process.env.VERCEL_PROJECT_ID_AUDIO_INTEL!,
  tracker: process.env.VERCEL_PROJECT_ID_TRACKER!,
  'pitch-generator': process.env.VERCEL_PROJECT_ID_PITCH_GENERATOR!,
};

// === ENVIRONMENT VARIABLES ===
const { VERCEL_TOKEN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const TELEGRAM_ENABLED = Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

if (!VERCEL_TOKEN) {
  console.error('❌ Missing VERCEL_TOKEN');
  process.exit(1);
}

// Validate all project IDs are present
console.error('\n🔍 Validating Vercel project IDs...');
for (const [app, projectId] of Object.entries(APP_PROJECTS)) {
  if (!projectId || projectId === 'undefined') {
    console.error(`❌ Missing VERCEL_PROJECT_ID for ${app}`);
    process.exit(1);
  }
  console.error(`  ✅ ${app}: ${projectId}`);
}

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

async function getDeployments(
  projectId: string,
  token: string,
  limit = 20
): Promise<VercelDeployment[]> {
  const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=${limit}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch deployments: ${res.status} ${errorText}`);
    }

    const data = (await res.json()) as { deployments: VercelDeployment[] };
    return data.deployments || [];
  } catch (err) {
    throw new Error(`Error fetching deployments: ${(err as Error).message}`);
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

async function rollbackApp(app: string, projectId: string): Promise<RollbackResult> {
  const startTime = Date.now();
  console.error(`\n🔄 Rolling back ${app}...`);

  try {
    // Get recent deployments
    const deployments = await getDeployments(projectId, VERCEL_TOKEN!);

    // Find current production deployment (READY + production target)
    const currentProduction = deployments.find(
      d => d.state === 'READY' && d.target === 'production'
    );

    if (!currentProduction) {
      return {
        app,
        projectId,
        status: 'fail',
        message: 'No current production deployment found',
        duration: Date.now() - startTime,
      };
    }

    console.error(`  📍 Current production: ${currentProduction.url} (${currentProduction.uid})`);

    // Find previous READY production deployment (before current)
    const previousProduction = deployments.find(
      d =>
        d.uid !== currentProduction.uid &&
        d.state === 'READY' &&
        d.target === 'production' &&
        d.created < currentProduction.created
    );

    if (!previousProduction) {
      return {
        app,
        projectId,
        currentDeploymentId: currentProduction.uid,
        status: 'skipped',
        message: 'No previous production deployment found to rollback to',
        duration: Date.now() - startTime,
      };
    }

    console.error(
      `  📍 Previous production: ${previousProduction.url} (${previousProduction.uid})`
    );

    // Promote previous deployment back to production
    console.error(`  🚀 Promoting previous deployment to production...`);
    const promoteResult = await promoteDeployment(previousProduction.uid, VERCEL_TOKEN!);

    if (!promoteResult.ok) {
      return {
        app,
        projectId,
        previousDeploymentId: previousProduction.uid,
        previousDeploymentUrl: previousProduction.url,
        currentDeploymentId: currentProduction.uid,
        status: 'fail',
        message: `Failed to promote: ${promoteResult.text}`,
        duration: Date.now() - startTime,
      };
    }

    // Prevent API rate limits
    await new Promise(r => setTimeout(r, 1500));

    return {
      app,
      projectId,
      previousDeploymentId: previousProduction.uid,
      previousDeploymentUrl: previousProduction.url,
      currentDeploymentId: currentProduction.uid,
      status: 'success',
      message: `Rolled back to ${previousProduction.url}`,
      duration: Date.now() - startTime,
    };
  } catch (err) {
    return {
      app,
      projectId,
      status: 'fail',
      message: `Rollback error: ${(err as Error).message}`,
      duration: Date.now() - startTime,
    };
  }
}

// === MAIN EXECUTION ===
async function runRollback() {
  console.error('\n🔄 Starting Golden Deployment Rollback...');
  console.error(`⏰ Started at: ${new Date().toISOString()}\n`);

  const startTime = Date.now();
  const results: RollbackResult[] = [];

  // Rollback all apps
  for (const [app, projectId] of Object.entries(APP_PROJECTS)) {
    const result = await rollbackApp(app, projectId);
    results.push(result);

    const icon = result.status === 'success' ? '✅' : result.status === 'skipped' ? '⚠️' : '❌';
    console.error(`${icon} ${app}: ${result.message}`);
  }

  const duration = Date.now() - startTime;
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'fail');
  const skipped = results.filter(r => r.status === 'skipped');

  let overall: 'success' | 'partial' | 'fail';
  if (failed.length === 0 && successful.length > 0) {
    overall = 'success';
  } else if (successful.length > 0) {
    overall = 'partial';
  } else {
    overall = 'fail';
  }

  // Display summary
  console.error('\n=== Rollback Summary ===');
  console.error(`✅ Successful: ${successful.length}`);
  console.error(`⚠️  Skipped: ${skipped.length}`);
  console.error(`❌ Failed: ${failed.length}`);
  console.error(`⏱️  Total duration: ${(duration / 1000).toFixed(1)}s`);
  console.error(`📊 Overall: ${overall.toUpperCase()}\n`);

  // Create report
  const report: RollbackReport = {
    timestamp: new Date().toISOString(),
    overall,
    duration,
    results,
  };

  // Save report
  const reportDir = path.join(process.cwd(), 'reports', 'golden', 'rollback');
  fs.mkdirSync(reportDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.error(`📝 Rollback report saved: ${reportPath}`);

  // Send Telegram notification
  const versionInfo = process.env.GITHUB_REF?.replace('refs/tags/', '') || 'unknown';
  const previousVersion = versionInfo.replace(/\.(\d+)$/, (_, n) => `.${parseInt(n) - 1}`);

  if (overall === 'success') {
    await sendTelegram(
      `✅ Golden Deploy Rollback Complete (3-app scope)\n\n` +
        `Version: ${versionInfo} → ${previousVersion}\n` +
        `Apps rolled back: ${successful.length}/3\n` +
        `- audio-intel\n` +
        `- tracker\n` +
        `- pitch-generator\n\n` +
        `Duration: ${(duration / 1000).toFixed(1)}s`
    );
  } else if (overall === 'partial') {
    await sendTelegram(
      `⚠️ Golden Deploy Rollback Partial (3-app scope)\n\n` +
        `Successful: ${successful.length}\n` +
        `Failed: ${failed.length}\n` +
        `Check logs for details.`
    );
  } else {
    await sendTelegram(
      `❌ Golden Deploy Rollback Failed (3-app scope)\n\n` +
        `All rollbacks failed.\n` +
        `Manual intervention required.`
    );
  }

  process.exit(overall === 'fail' ? 1 : 0);
}

runRollback().catch(async err => {
  console.error('❌ Fatal error in rollback:', err);
  await sendTelegram(`❌ Golden Rollback fatal error: ${(err as Error).message}`);
  process.exit(1);
});
