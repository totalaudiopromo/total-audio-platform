#!/usr/bin/env ts-node

/**
 * Golden Promote Script
 * Promotes Vercel preview deployments to production
 *
 * Usage:
 *   ts-node scripts/golden-promote.ts [app-name]
 *
 * Environment variables required:
 *   - VERCEL_TOKEN
 *   - VERCEL_ORG_ID
 *   - VERCEL_PROJECT_ID_AUDIO_INTEL
 *   - VERCEL_PROJECT_ID_COMMAND_CENTRE
 *   - VERCEL_PROJECT_ID_WEB
 *   - VERCEL_PROJECT_ID_PLAYLIST_PULSE
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface App {
  name: string;
  projectIdEnv: string;
  productionUrl: string;
  directory: string;
}

const APPS: App[] = [
  {
    name: 'audio-intel',
    projectIdEnv: 'VERCEL_PROJECT_ID_AUDIO_INTEL',
    productionUrl: 'https://intel.totalaudiopromo.com',
    directory: 'apps/audio-intel'
  },
  {
    name: 'command-centre',
    projectIdEnv: 'VERCEL_PROJECT_ID_COMMAND_CENTRE',
    productionUrl: 'https://command.totalaudiopromo.com',
    directory: 'apps/command-centre'
  },
  {
    name: 'web',
    projectIdEnv: 'VERCEL_PROJECT_ID_WEB',
    productionUrl: 'https://totalaudiopromo.com',
    directory: 'apps/web'
  },
  {
    name: 'playlist-pulse',
    projectIdEnv: 'VERCEL_PROJECT_ID_PLAYLIST_PULSE',
    productionUrl: 'https://pulse.totalaudiopromo.com',
    directory: 'apps/playlist-pulse'
  }
];

interface DeploymentResult {
  app: string;
  success: boolean;
  deploymentUrl?: string;
  productionUrl?: string;
  error?: string;
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

function checkEnvironmentVariables(): void {
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
    log('Missing required environment variables:', 'error');
    missing.forEach(v => log(`  - ${v}`, 'error'));
    process.exit(1);
  }

  log('All required environment variables present', 'success');
}

function executeCommand(command: string, cwd?: string): string {
  try {
    const result = execSync(command, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

async function deployApp(app: App): Promise<DeploymentResult> {
  log(`Deploying ${app.name}...`, 'info');

  try {
    // Check if directory exists
    if (!fs.existsSync(app.directory)) {
      throw new Error(`Directory not found: ${app.directory}`);
    }

    // Pull Vercel environment
    log(`Pulling Vercel environment for ${app.name}...`, 'info');
    executeCommand(
      `vercel pull --yes --environment=production --token=${process.env.VERCEL_TOKEN}`,
      app.directory
    );

    // Deploy to Vercel
    log(`Building and deploying ${app.name}...`, 'info');
    const deploymentUrl = executeCommand(
      `vercel deploy --token=${process.env.VERCEL_TOKEN} --prod`,
      app.directory
    );

    if (!deploymentUrl || !deploymentUrl.startsWith('http')) {
      throw new Error('Invalid deployment URL returned');
    }

    log(`${app.name} deployed successfully!`, 'success');
    log(`  Preview URL: ${deploymentUrl}`, 'info');
    log(`  Production URL: ${app.productionUrl}`, 'info');

    return {
      app: app.name,
      success: true,
      deploymentUrl,
      productionUrl: app.productionUrl
    };
  } catch (error: any) {
    log(`Failed to deploy ${app.name}: ${error.message}`, 'error');
    return {
      app: app.name,
      success: false,
      error: error.message
    };
  }
}

async function promoteDeployment(deploymentUrl: string, app: App): Promise<void> {
  log(`Promoting ${app.name} to production...`, 'info');

  try {
    executeCommand(
      `vercel promote ${deploymentUrl} --token=${process.env.VERCEL_TOKEN} --yes`,
      app.directory
    );
    log(`${app.name} promoted to production!`, 'success');
  } catch (error: any) {
    throw new Error(`Failed to promote: ${error.message}`);
  }
}

async function verifyDeployment(url: string, appName: string): Promise<boolean> {
  log(`Verifying deployment for ${appName}...`, 'info');

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const status = response.status;

    if (status === 200 || status === 301 || status === 302) {
      log(`${appName} is live and responding (HTTP ${status})`, 'success');
      return true;
    } else {
      log(`${appName} returned unexpected status: HTTP ${status}`, 'warning');
      return false;
    }
  } catch (error: any) {
    log(`Failed to verify ${appName}: ${error.message}`, 'error');
    return false;
  }
}

function printSummary(results: DeploymentResult[]): void {
  console.log('\n' + '='.repeat(80));
  log('Golden Deployment Summary', 'info');
  console.log('='.repeat(80) + '\n');

  console.log('| App              | Status | Production URL                           |');
  console.log('|------------------|--------|------------------------------------------|');

  for (const result of results) {
    const status = result.success ? '✅ Success' : '❌ Failed';
    const url = result.productionUrl || 'N/A';
    const appName = result.app.padEnd(16);
    console.log(`| ${appName} | ${status.padEnd(6)} | ${url.padEnd(40)} |`);
  }

  console.log('\n' + '='.repeat(80));

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  if (successCount === totalCount) {
    log(`All ${totalCount} apps deployed successfully! 🎉`, 'success');
  } else {
    log(`${successCount}/${totalCount} apps deployed successfully`, 'warning');
  }
}

async function main(): Promise<void> {
  console.log('\n🚀 Golden Deployment Pipeline - Promote Script\n');

  // Check if specific app is requested
  const targetApp = process.argv[2];
  let appsToDeploy = APPS;

  if (targetApp) {
    const app = APPS.find(a => a.name === targetApp);
    if (!app) {
      log(`Unknown app: ${targetApp}`, 'error');
      log(`Available apps: ${APPS.map(a => a.name).join(', ')}`, 'info');
      process.exit(1);
    }
    appsToDeploy = [app];
    log(`Deploying single app: ${targetApp}`, 'info');
  } else {
    log(`Deploying all ${APPS.length} apps`, 'info');
  }

  // Check environment variables
  checkEnvironmentVariables();

  // Deploy all apps
  const results: DeploymentResult[] = [];

  for (const app of appsToDeploy) {
    const result = await deployApp(app);
    results.push(result);

    // Verify deployment if successful
    if (result.success && result.productionUrl) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s for DNS
      await verifyDeployment(result.productionUrl, app.name);
    }

    console.log(''); // Empty line between apps
  }

  // Print summary
  printSummary(results);

  // Exit with error if any deployment failed
  const hasFailures = results.some(r => !r.success);
  if (hasFailures) {
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

export { deployApp, promoteDeployment, verifyDeployment };
