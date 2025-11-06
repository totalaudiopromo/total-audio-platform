#!/usr/bin/env ts-node

/**
 * Golden Check Script
 * Validates deployments without actually deploying (dry-run mode)
 *
 * Usage:
 *   ts-node scripts/golden-check.ts [--full]
 *
 * Options:
 *   --full    Run full validation including Lighthouse performance tests
 *
 * This script performs:
 *   1. Environment validation
 *   2. Build validation (local builds)
 *   3. Health checks on production URLs
 *   4. Lighthouse performance tests (optional)
 *   5. Deployment readiness report
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface App {
  name: string;
  displayName: string;
  projectIdEnv: string;
  productionUrl: string;
  directory: string;
}

const APPS: App[] = [
  {
    name: 'audio-intel',
    displayName: 'Audio Intel',
    projectIdEnv: 'VERCEL_PROJECT_ID_AUDIO_INTEL',
    productionUrl: 'https://intel.totalaudiopromo.com',
    directory: 'apps/audio-intel'
  },
  {
    name: 'command-centre',
    displayName: 'Command Centre',
    projectIdEnv: 'VERCEL_PROJECT_ID_COMMAND_CENTRE',
    productionUrl: 'https://command.totalaudiopromo.com',
    directory: 'apps/command-centre'
  },
  {
    name: 'web',
    displayName: 'Main Website',
    projectIdEnv: 'VERCEL_PROJECT_ID_WEB',
    productionUrl: 'https://totalaudiopromo.com',
    directory: 'apps/web'
  },
  {
    name: 'playlist-pulse',
    displayName: 'Playlist Pulse',
    projectIdEnv: 'VERCEL_PROJECT_ID_PLAYLIST_PULSE',
    productionUrl: 'https://pulse.totalaudiopromo.com',
    directory: 'apps/playlist-pulse'
  }
];

interface ValidationResult {
  app: string;
  displayName: string;
  buildSuccess: boolean;
  healthCheck: boolean;
  httpStatus?: number;
  lighthouseScore?: number;
  errors: string[];
  warnings: string[];
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  console.log(`${icons[type]} ${message}`);
}

function executeCommand(command: string, cwd?: string, silent = false): string {
  try {
    const result = execSync(command, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return result.trim();
  } catch (error: any) {
    if (!silent) {
      throw new Error(`Command failed: ${command}\n${error.message}`);
    }
    return '';
  }
}

function checkEnvironmentVariables(): { valid: boolean; missing: string[] } {
  log('Checking environment variables...', 'info');

  const required = ['VERCEL_TOKEN', 'VERCEL_ORG_ID'];
  const missing: string[] = [];

  for (const envVar of required) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check project IDs
  for (const app of APPS) {
    if (!process.env[app.projectIdEnv]) {
      missing.push(app.projectIdEnv);
    }
  }

  if (missing.length > 0) {
    log('Missing environment variables:', 'warning');
    missing.forEach(v => log(`  - ${v}`, 'warning'));
    return { valid: false, missing };
  }

  log('All required environment variables present', 'success');
  return { valid: true, missing: [] };
}

async function validateBuild(app: App): Promise<{ success: boolean; error?: string }> {
  log(`Building ${app.displayName}...`, 'info');

  try {
    // Check if directory exists
    if (!fs.existsSync(app.directory)) {
      throw new Error(`Directory not found: ${app.directory}`);
    }

    // Check if package.json exists
    const packageJsonPath = path.join(app.directory, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    // Install dependencies
    log(`  Installing dependencies...`, 'info');
    executeCommand('npm install --legacy-peer-deps', app.directory, true);

    // Run build
    log(`  Running build...`, 'info');
    executeCommand('npm run build', app.directory, false);

    // Check if build output exists
    const buildOutputPath = path.join(app.directory, '.next');
    if (!fs.existsSync(buildOutputPath)) {
      throw new Error('Build output (.next) not found');
    }

    log(`${app.displayName} build successful`, 'success');
    return { success: true };
  } catch (error: any) {
    log(`${app.displayName} build failed: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function checkHealth(url: string, appName: string): Promise<{ success: boolean; status?: number }> {
  log(`Checking health of ${appName}...`, 'info');

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });
    const status = response.status;

    if (status === 200 || status === 301 || status === 302) {
      log(`  ${appName} is healthy (HTTP ${status})`, 'success');
      return { success: true, status };
    } else {
      log(`  ${appName} returned HTTP ${status}`, 'warning');
      return { success: false, status };
    }
  } catch (error: any) {
    log(`  Failed to reach ${appName}: ${error.message}`, 'error');
    return { success: false };
  }
}

async function runLighthouse(url: string, appName: string): Promise<{ score?: number; error?: string }> {
  log(`Running Lighthouse on ${appName}...`, 'info');

  try {
    // Check if Lighthouse is installed
    try {
      executeCommand('which lighthouse', undefined, true);
    } catch {
      log('  Lighthouse not installed, skipping...', 'warning');
      return {};
    }

    // Run Lighthouse
    const tmpFile = `/tmp/lighthouse-${appName}-${Date.now()}.json`;
    executeCommand(
      `lighthouse ${url} --output=json --output-path=${tmpFile} --chrome-flags="--headless" --quiet`,
      undefined,
      true
    );

    // Read results
    const results = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'));
    const score = Math.round(results.categories.performance.score * 100);

    // Clean up
    fs.unlinkSync(tmpFile);

    if (score >= 90) {
      log(`  Lighthouse score: ${score}/100 (Excellent)`, 'success');
    } else if (score >= 70) {
      log(`  Lighthouse score: ${score}/100 (Good)`, 'success');
    } else if (score >= 50) {
      log(`  Lighthouse score: ${score}/100 (Needs improvement)`, 'warning');
    } else {
      log(`  Lighthouse score: ${score}/100 (Poor)`, 'warning');
    }

    return { score };
  } catch (error: any) {
    log(`  Lighthouse test failed: ${error.message}`, 'warning');
    return { error: error.message };
  }
}

async function validateApp(app: App, runFullCheck: boolean): Promise<ValidationResult> {
  console.log('\n' + '-'.repeat(80));
  log(`Validating ${app.displayName}`, 'info');
  console.log('-'.repeat(80) + '\n');

  const result: ValidationResult = {
    app: app.name,
    displayName: app.displayName,
    buildSuccess: false,
    healthCheck: false,
    errors: [],
    warnings: []
  };

  // Step 1: Build validation
  const buildResult = await validateBuild(app);
  result.buildSuccess = buildResult.success;
  if (!buildResult.success && buildResult.error) {
    result.errors.push(`Build failed: ${buildResult.error}`);
  }

  // Step 2: Health check
  const healthResult = await checkHealth(app.productionUrl, app.displayName);
  result.healthCheck = healthResult.success;
  result.httpStatus = healthResult.status;
  if (!healthResult.success) {
    result.warnings.push(`Health check failed (HTTP ${healthResult.status || 'N/A'})`);
  }

  // Step 3: Lighthouse (optional)
  if (runFullCheck && result.healthCheck) {
    const lighthouseResult = await runLighthouse(app.productionUrl, app.displayName);
    if (lighthouseResult.score) {
      result.lighthouseScore = lighthouseResult.score;
      if (lighthouseResult.score < 70) {
        result.warnings.push(`Low Lighthouse score: ${lighthouseResult.score}/100`);
      }
    }
  }

  return result;
}

function printDetailedReport(results: ValidationResult[]): void {
  console.log('\n' + '='.repeat(100));
  log('Golden Deployment Validation Report', 'info');
  console.log('='.repeat(100) + '\n');

  console.log('| App              | Build  | Health | HTTP | Lighthouse | Status      |');
  console.log('|------------------|--------|--------|------|------------|-------------|');

  for (const result of results) {
    const appName = result.displayName.padEnd(16);
    const build = result.buildSuccess ? '✅ Pass' : '❌ Fail';
    const health = result.healthCheck ? '✅ Pass' : '⚠️ Warn';
    const http = result.httpStatus ? result.httpStatus.toString().padEnd(4) : 'N/A ';
    const lighthouse = result.lighthouseScore ? `${result.lighthouseScore}/100` : 'N/A';
    const lighthouseDisplay = lighthouse.padEnd(10);

    let status = 'Ready';
    if (result.errors.length > 0) {
      status = '❌ Blocked';
    } else if (result.warnings.length > 0) {
      status = '⚠️ Warning';
    } else {
      status = '✅ Ready';
    }

    console.log(`| ${appName} | ${build}  | ${health}  | ${http} | ${lighthouseDisplay} | ${status.padEnd(11)} |`);
  }

  console.log('\n' + '='.repeat(100));

  // Print detailed errors and warnings
  console.log('\nDetailed Issues:\n');

  for (const result of results) {
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`${result.displayName}:`);

      if (result.errors.length > 0) {
        result.errors.forEach(err => log(`  ${err}`, 'error'));
      }

      if (result.warnings.length > 0) {
        result.warnings.forEach(warn => log(`  ${warn}`, 'warning'));
      }

      console.log('');
    }
  }

  // Summary
  const readyCount = results.filter(r => r.buildSuccess && r.errors.length === 0).length;
  const totalCount = results.length;
  const blockedCount = results.filter(r => r.errors.length > 0).length;

  console.log('='.repeat(100));
  console.log('\nSummary:\n');
  log(`Total apps: ${totalCount}`, 'info');
  log(`Ready for deployment: ${readyCount}`, 'success');
  log(`Blocked: ${blockedCount}`, blockedCount > 0 ? 'error' : 'info');
  log(`Warnings: ${results.filter(r => r.warnings.length > 0).length}`, 'warning');

  if (readyCount === totalCount && blockedCount === 0) {
    console.log('');
    log('🎉 All apps are ready for golden deployment!', 'success');
  } else if (blockedCount > 0) {
    console.log('');
    log('⚠️ Some apps are blocked. Fix errors before deploying.', 'error');
  }
}

async function main(): Promise<void> {
  console.log('\n🔍 Golden Deployment Pipeline - Validation Check\n');

  const runFullCheck = process.argv.includes('--full');

  if (runFullCheck) {
    log('Running full validation with Lighthouse tests', 'info');
  } else {
    log('Running standard validation (use --full for Lighthouse tests)', 'info');
  }

  // Check environment variables
  const envCheck = checkEnvironmentVariables();
  if (!envCheck.valid) {
    log('\n⚠️ Environment validation failed. Set missing variables before deployment.', 'warning');
  }

  console.log('');

  // Validate all apps
  const results: ValidationResult[] = [];

  for (const app of APPS) {
    const result = await validateApp(app, runFullCheck);
    results.push(result);
  }

  // Print detailed report
  printDetailedReport(results);

  // Exit with error if any app is blocked
  const hasBlockers = results.some(r => r.errors.length > 0);
  if (hasBlockers) {
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  });
}

export { validateApp, checkHealth, runLighthouse };
