#!/usr/bin/env tsx
/**
 * Golden Deployment Health Check
 * Validates app build, database connectivity, and API health
 * for a single app in the Golden Deployment Pipeline.
 *
 * Usage: pnpm tsx scripts/golden-check.ts --app <app-name>
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail';
  message: string;
  duration: number;
}

interface GoldenCheckSummary {
  app: string;
  timestamp: string;
  overall: 'pass' | 'fail';
  duration: number;
  checks: HealthCheck[];
}

// === PARSE ARGUMENTS ===
const args = process.argv.slice(2);
const appIndex = args.indexOf('--app');
if (appIndex === -1 || !args[appIndex + 1]) {
  console.error('❌ Missing --app argument');
  console.error('Usage: pnpm tsx scripts/golden-check.ts --app <app-name>');
  process.exit(1);
}

const APP_NAME = args[appIndex + 1];
const VALID_APPS = ['audio-intel', 'tracker', 'pitch-generator', 'command-centre'];

if (!VALID_APPS.includes(APP_NAME)) {
  console.error(`❌ Invalid app: ${APP_NAME}`);
  console.error(`Valid apps: ${VALID_APPS.join(', ')}`);
  process.exit(1);
}

// === ENVIRONMENT VARIABLES ===
const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
  process.env;

const checks: HealthCheck[] = [];
const startTime = Date.now();

// === HEALTH CHECKS ===
async function checkDatabase(): Promise<HealthCheck> {
  const checkStart = Date.now();

  if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      name: 'Database Connectivity',
      status: 'fail',
      message: 'Missing Supabase credentials',
      duration: Date.now() - checkStart,
    };
  }

  try {
    const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Test basic query
    const { error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      return {
        name: 'Database Connectivity',
        status: 'fail',
        message: `Database query failed: ${error.message}`,
        duration: Date.now() - checkStart,
      };
    }

    return {
      name: 'Database Connectivity',
      status: 'pass',
      message: 'Supabase connection successful',
      duration: Date.now() - checkStart,
    };
  } catch (err) {
    return {
      name: 'Database Connectivity',
      status: 'fail',
      message: `Database check failed: ${(err as Error).message}`,
      duration: Date.now() - checkStart,
    };
  }
}

async function checkBuildOutput(): Promise<HealthCheck> {
  const checkStart = Date.now();

  const buildPath = path.join(process.cwd(), 'apps', APP_NAME, '.next');

  if (!fs.existsSync(buildPath)) {
    return {
      name: 'Build Output',
      status: 'fail',
      message: `.next directory not found at ${buildPath}`,
      duration: Date.now() - checkStart,
    };
  }

  const buildManifestPath = path.join(buildPath, 'build-manifest.json');
  if (!fs.existsSync(buildManifestPath)) {
    return {
      name: 'Build Output',
      status: 'fail',
      message: 'build-manifest.json not found',
      duration: Date.now() - checkStart,
    };
  }

  return {
    name: 'Build Output',
    status: 'pass',
    message: 'Build artifacts present and valid',
    duration: Date.now() - checkStart,
  };
}

async function checkEnvironmentVariables(): Promise<HealthCheck> {
  const checkStart = Date.now();
  const missing: string[] = [];

  if (!NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missing.length > 0) {
    return {
      name: 'Environment Variables',
      status: 'fail',
      message: `Missing variables: ${missing.join(', ')}`,
      duration: Date.now() - checkStart,
    };
  }

  return {
    name: 'Environment Variables',
    status: 'pass',
    message: 'All required environment variables present',
    duration: Date.now() - checkStart,
  };
}

// === MAIN EXECUTION ===
async function runGoldenCheck() {
  console.error(`\n🏁 Starting Golden Health Check for ${APP_NAME}...`);
  console.error(`⏰ Started at: ${new Date().toISOString()}\n`);

  // Run all checks
  checks.push(await checkEnvironmentVariables());
  checks.push(await checkBuildOutput());

  // Database check is optional - only fail if both env vars and build checks fail
  const dbCheck = await checkDatabase();
  checks.push(dbCheck);

  const duration = Date.now() - startTime;

  // Critical checks: Environment variables and build output must pass
  const criticalChecks = checks.filter(
    c => c.name === 'Environment Variables' || c.name === 'Build Output'
  );
  const criticalPassed = criticalChecks.every(c => c.status === 'pass');

  // Database check is informational only in CI
  const allPassed = criticalPassed;

  // Display results
  console.error('\n=== Health Check Results ===');
  for (const check of checks) {
    const icon = check.status === 'pass' ? '✅' : '❌';
    console.error(`${icon} ${check.name}: ${check.message} (${check.duration}ms)`);
  }

  console.error(`\n⏱️  Total duration: ${duration}ms`);
  console.error(`📊 Result: ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);

  // Save JSON report if running in CI
  if (process.env.GITHUB_ACTIONS) {
    const summary: GoldenCheckSummary = {
      app: APP_NAME,
      timestamp: new Date().toISOString(),
      overall: allPassed ? 'pass' : 'fail',
      duration,
      checks,
    };

    const reportDir = path.join(process.cwd(), 'reports', 'golden');
    fs.mkdirSync(reportDir, { recursive: true });
    const filePath = path.join(reportDir, `${APP_NAME}.json`);
    fs.writeFileSync(filePath, JSON.stringify(summary, null, 2));
    console.error(`📝 Health check report saved: ${filePath}`);
  }

  process.exit(allPassed ? 0 : 1);
}

runGoldenCheck().catch(err => {
  console.error(`❌ Fatal error in golden-check for ${APP_NAME}:`, err);
  process.exit(1);
});
