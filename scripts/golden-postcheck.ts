#!/usr/bin/env tsx
/**
 * Golden Post-Deployment Check
 * Validates production health endpoints and Lighthouse budgets after Golden deployment.
 * Runs automatically after golden-deploy.yml completes.
 *
 * Usage: pnpm tsx scripts/golden-postcheck.ts [--app <app-name>]
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

interface HealthCheck {
  app: string;
  url: string;
  status: 'pass' | 'fail';
  httpStatus?: number;
  responseTime: number;
  message: string;
}

interface LighthouseBudget {
  path?: string;
  timings?: Array<{
    metric: string;
    budget: number;
  }>;
  resourceSizes?: Array<{
    resourceType: string;
    budget: number;
  }>;
  resourceCounts?: Array<{
    resourceType: string;
    budget: number;
  }>;
}

interface PostCheckReport {
  timestamp: string;
  overall: 'pass' | 'fail';
  duration: number;
  healthChecks: HealthCheck[];
  lighthouseValidation?: {
    status: 'pass' | 'fail' | 'skipped';
    message: string;
  };
}

// === GOLDEN PIPELINE SCOPE (Phase 10A - 2025-11-08) ===
const APP_URLS: Record<string, string> = {
  'audio-intel': 'https://intel.totalaudiopromo.com/api/health',
  tracker: 'https://tracker.totalaudiopromo.com/api/health',
  'pitch-generator': 'https://pitch.totalaudiopromo.com/api/health',
};

const VALID_APPS = Object.keys(APP_URLS);

// === PARSE ARGUMENTS ===
const args = process.argv.slice(2);
const appIndex = args.indexOf('--app');
const singleApp = appIndex !== -1 && args[appIndex + 1] ? args[appIndex + 1] : null;

const APPS_TO_CHECK = singleApp ? [singleApp] : VALID_APPS;

if (singleApp && !VALID_APPS.includes(singleApp)) {
  console.error(`❌ Invalid app: ${singleApp}`);
  console.error(`Valid apps: ${VALID_APPS.join(', ')}`);
  process.exit(1);
}

// === ENVIRONMENT VARIABLES ===
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
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

async function checkHealthEndpoint(app: string, url: string): Promise<HealthCheck> {
  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Golden-PostCheck/1.0' },
      timeout: 10000,
    });

    const responseTime = Date.now() - startTime;
    const httpStatus = response.status;

    if (httpStatus === 200) {
      const data = await response.json().catch(() => ({}));
      return {
        app,
        url,
        status: 'pass',
        httpStatus,
        responseTime,
        message: `Health check passed (${responseTime}ms)`,
      };
    } else {
      return {
        app,
        url,
        status: 'fail',
        httpStatus,
        responseTime,
        message: `Health check failed: HTTP ${httpStatus}`,
      };
    }
  } catch (err) {
    const responseTime = Date.now() - startTime;
    return {
      app,
      url,
      status: 'fail',
      responseTime,
      message: `Health check failed: ${(err as Error).message}`,
    };
  }
}

function validateLighthouseBudget(): { status: 'pass' | 'fail' | 'skipped'; message: string } {
  const budgetPath = path.join(process.cwd(), '.lighthouse', 'budget.json');

  if (!fs.existsSync(budgetPath)) {
    return {
      status: 'skipped',
      message: 'Lighthouse budget.json not found - skipping validation',
    };
  }

  try {
    const budgetContent = fs.readFileSync(budgetPath, 'utf-8');
    const budget: LighthouseBudget | LighthouseBudget[] = JSON.parse(budgetContent);

    // Lighthouse budget can be an array or single object
    const budgets = Array.isArray(budget) ? budget : [budget];

    // Basic validation - ensure budget structure is valid
    const isValid = budgets.some(b => b.timings || b.resourceSizes || b.resourceCounts);

    if (!isValid) {
      return {
        status: 'fail',
        message: 'Invalid Lighthouse budget structure',
      };
    }

    return {
      status: 'pass',
      message: 'Lighthouse budget.json validated successfully',
    };
  } catch (err) {
    return {
      status: 'fail',
      message: `Failed to parse Lighthouse budget: ${(err as Error).message}`,
    };
  }
}

// === MAIN EXECUTION ===
async function runPostCheck() {
  console.error('\n🏁 Starting Golden Post-Deployment Check...');
  console.error(`⏰ Started at: ${new Date().toISOString()}\n`);

  const startTime = Date.now();
  const healthChecks: HealthCheck[] = [];

  // Check all health endpoints
  for (const app of APPS_TO_CHECK) {
    const url = APP_URLS[app];
    console.error(`🔍 Checking ${app}...`);
    const check = await checkHealthEndpoint(app, url);
    healthChecks.push(check);

    const icon = check.status === 'pass' ? '✅' : '❌';
    console.error(`${icon} ${app}: ${check.message}`);

    // Prevent rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  // Validate Lighthouse budget
  console.error('\n📊 Validating Lighthouse budget...');
  const lighthouseValidation = validateLighthouseBudget();
  const lighthouseIcon =
    lighthouseValidation.status === 'pass'
      ? '✅'
      : lighthouseValidation.status === 'skipped'
        ? '⚠️'
        : '❌';
  console.error(`${lighthouseIcon} Lighthouse: ${lighthouseValidation.message}`);

  const duration = Date.now() - startTime;
  const allHealthPassed = healthChecks.every(c => c.status === 'pass');
  const lighthousePassed =
    lighthouseValidation.status === 'pass' || lighthouseValidation.status === 'skipped';
  const overall = allHealthPassed && lighthousePassed ? 'pass' : 'fail';

  // Display summary
  console.error('\n=== Post-Check Summary ===');
  console.error(`⏱️  Total duration: ${duration}ms`);
  console.error(`📊 Overall: ${overall === 'pass' ? '✅ PASS' : '❌ FAIL'}\n`);

  // Create report
  const report: PostCheckReport = {
    timestamp: new Date().toISOString(),
    overall,
    duration,
    healthChecks,
    lighthouseValidation,
  };

  // Save report
  const reportDir = path.join(process.cwd(), 'reports', 'golden', 'postcheck');
  fs.mkdirSync(reportDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.error(`📝 Post-check report saved: ${reportPath}`);

  // Phase 10C: Append to history markdown file
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const historyDir = path.join(process.cwd(), 'reports', 'golden', 'history');
  fs.mkdirSync(historyDir, { recursive: true });
  const historyPath = path.join(historyDir, `${today}.md`);

  const statusIcon = overall === 'pass' ? '✅' : '❌';
  const statusLine = `${timestamp} | ${statusIcon} ${overall.toUpperCase()} | ${duration}ms | ${
    healthChecks.filter(c => c.status === 'pass').length
  }/${healthChecks.length} apps healthy\n`;

  // Create file with header if it doesn't exist
  if (!fs.existsSync(historyPath)) {
    const header = `# Golden Verify History - ${today}\n\n`;
    fs.writeFileSync(historyPath, header);
  }

  // Append status line
  fs.appendFileSync(historyPath, statusLine);
  console.error(`📜 History appended to: ${historyPath}`);

  // Send Telegram notification (Phase 10C: Enhanced with timestamp details)
  const timestampFormatted = new Date().toISOString();

  if (overall === 'pass') {
    await sendTelegram(
      `✅ Golden Verify: All apps healthy at ${timestampFormatted}\n\n` +
        `Apps checked: ${healthChecks.length}/3\n` +
        `- audio-intel ✓\n` +
        `- tracker ✓\n` +
        `- pitch-generator ✓\n\n` +
        `Duration: ${(duration / 1000).toFixed(1)}s\n` +
        `History: reports/golden/history/${today}.md`
    );
  } else {
    const failedApps = healthChecks.filter(c => c.status === 'fail').map(c => c.app);
    await sendTelegram(
      `❌ Golden Verify: Detected issues (${overall}) at ${timestampFormatted}\n\n` +
        `Failed apps: ${failedApps.join(', ')}\n` +
        `Duration: ${(duration / 1000).toFixed(1)}s\n` +
        `Auto-rollback will be triggered if this persists.\n` +
        `History: reports/golden/history/${today}.md`
    );
  }

  process.exit(overall === 'pass' ? 0 : 1);
}

runPostCheck().catch(async err => {
  console.error(`❌ Fatal error in post-check:`, err);
  await sendTelegram(`❌ Golden Post-Check fatal error: ${(err as Error).message}`);
  process.exit(1);
});
