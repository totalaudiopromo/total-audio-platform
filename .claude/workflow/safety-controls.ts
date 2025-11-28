#!/usr/bin/env npx tsx
/**
 * Safety Controls
 *
 * Kill-switch, dry-run mode, and pause/resume functionality.
 * Part of the IndyDevDan-style safety architecture.
 *
 * Features:
 * - Kill-switch: DROPZONE_DISABLE=1 stops all processing instantly
 * - Dry-run: DROPZONE_LIVE=0 (default) logs but doesn't execute
 * - Pause/Resume: Temporary processing halt
 * - Status reporting for debugging
 *
 * Usage:
 *   npx tsx safety-controls.ts status
 *   npx tsx safety-controls.ts enable-kill-switch
 *   npx tsx safety-controls.ts disable-kill-switch
 *   npx tsx safety-controls.ts pause
 *   npx tsx safety-controls.ts resume
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const TMP_DIR = path.join(CLAUDE_DIR, 'tmp');
const KILL_SWITCH_FILE = path.join(TMP_DIR, 'kill-switch');
const PAUSE_FILE = path.join(TMP_DIR, 'paused');
const WATCHER_PID_FILE = path.join(TMP_DIR, 'watcher.pid');

interface SafetyStatus {
  killSwitch: {
    active: boolean;
    source: 'env' | 'file' | 'none';
  };
  dryRun: {
    active: boolean;
    source: 'env' | 'default';
  };
  paused: boolean;
  watcher: {
    running: boolean;
    pid?: number;
  };
  timestamp: string;
}

function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function isKillSwitchActive(): { active: boolean; source: 'env' | 'file' | 'none' } {
  // Environment variable takes precedence
  if (process.env.DROPZONE_DISABLE === '1') {
    return { active: true, source: 'env' };
  }
  // Then check file
  if (fs.existsSync(KILL_SWITCH_FILE)) {
    return { active: true, source: 'file' };
  }
  return { active: false, source: 'none' };
}

export function isDryRunMode(): { active: boolean; source: 'env' | 'default' } {
  // DROPZONE_LIVE=1 means NOT dry-run (live mode)
  if (process.env.DROPZONE_LIVE === '1') {
    return { active: false, source: 'env' };
  }
  // Default is dry-run for safety
  return { active: true, source: 'default' };
}

export function isPaused(): boolean {
  return fs.existsSync(PAUSE_FILE);
}

export function isWatcherRunning(): { running: boolean; pid?: number } {
  if (!fs.existsSync(WATCHER_PID_FILE)) {
    return { running: false };
  }

  try {
    const pid = parseInt(fs.readFileSync(WATCHER_PID_FILE, 'utf-8').trim(), 10);

    // Check if process is actually running
    try {
      process.kill(pid, 0); // Signal 0 just checks existence
      return { running: true, pid };
    } catch {
      // Process not running, clean up stale PID file
      fs.unlinkSync(WATCHER_PID_FILE);
      return { running: false };
    }
  } catch {
    return { running: false };
  }
}

export function enableKillSwitch(): void {
  ensureDirectoryExists(TMP_DIR);
  fs.writeFileSync(KILL_SWITCH_FILE, new Date().toISOString());
  console.log('Kill-switch ENABLED. All dropzone processing will be blocked.');
  console.log('To disable: npx tsx safety-controls.ts disable-kill-switch');
  console.log('Or: rm ' + KILL_SWITCH_FILE);
}

export function disableKillSwitch(): void {
  if (fs.existsSync(KILL_SWITCH_FILE)) {
    fs.unlinkSync(KILL_SWITCH_FILE);
    console.log('Kill-switch DISABLED. Processing can resume.');
  } else {
    console.log('Kill-switch was not active (file-based).');
  }

  if (process.env.DROPZONE_DISABLE === '1') {
    console.log('WARNING: DROPZONE_DISABLE=1 is still set in environment.');
    console.log('Run: unset DROPZONE_DISABLE');
  }
}

export function pause(): void {
  ensureDirectoryExists(TMP_DIR);
  fs.writeFileSync(PAUSE_FILE, new Date().toISOString());
  console.log('Processing PAUSED. Watcher will skip processing until resumed.');
  console.log('To resume: npx tsx safety-controls.ts resume');
}

export function resume(): void {
  if (fs.existsSync(PAUSE_FILE)) {
    fs.unlinkSync(PAUSE_FILE);
    console.log('Processing RESUMED. Watcher will continue processing.');
  } else {
    console.log('Processing was not paused.');
  }
}

export function getStatus(): SafetyStatus {
  const killSwitch = isKillSwitchActive();
  const dryRun = isDryRunMode();
  const watcher = isWatcherRunning();

  return {
    killSwitch,
    dryRun,
    paused: isPaused(),
    watcher,
    timestamp: new Date().toISOString(),
  };
}

export function printStatus(): void {
  const status = getStatus();

  console.log('\n=== IndyDevDan Workflow Safety Status ===\n');

  // Kill-switch status
  if (status.killSwitch.active) {
    console.log(`  Kill-Switch: ACTIVE (source: ${status.killSwitch.source})`);
  } else {
    console.log('  Kill-Switch: disabled');
  }

  // Dry-run status
  if (status.dryRun.active) {
    console.log(
      `  Mode: DRY-RUN (${status.dryRun.source === 'default' ? 'default' : 'DROPZONE_LIVE not set'})`
    );
    console.log('        → Logs actions but does not execute');
  } else {
    console.log('  Mode: LIVE (DROPZONE_LIVE=1)');
    console.log('        → Changes will be executed');
  }

  // Pause status
  if (status.paused) {
    console.log('  Paused: YES (watcher skipping processing)');
  } else {
    console.log('  Paused: no');
  }

  // Watcher status
  if (status.watcher.running) {
    console.log(`  Watcher: RUNNING (PID: ${status.watcher.pid})`);
  } else {
    console.log('  Watcher: not running');
  }

  console.log('\n=== Environment Variables ===\n');
  console.log(`  DROPZONE_LIVE=${process.env.DROPZONE_LIVE || '(not set, defaults to dry-run)'}`);
  console.log(`  DROPZONE_DISABLE=${process.env.DROPZONE_DISABLE || '(not set)'}`);

  console.log('\n=== Quick Commands ===\n');
  console.log('  Enable kill-switch:  npx tsx safety-controls.ts enable-kill-switch');
  console.log('  Disable kill-switch: npx tsx safety-controls.ts disable-kill-switch');
  console.log('  Pause processing:    npx tsx safety-controls.ts pause');
  console.log('  Resume processing:   npx tsx safety-controls.ts resume');
  console.log('  Start watcher (dry): node .claude/scripts/dropzone-watcher.ts');
  console.log('  Start watcher (live): DROPZONE_LIVE=1 node .claude/scripts/dropzone-watcher.ts');
  console.log('');
}

/**
 * Check if processing should proceed
 * Returns false if kill-switch active, paused, or blocked
 */
export function shouldProcess(): { allowed: boolean; reason?: string } {
  const killSwitch = isKillSwitchActive();
  if (killSwitch.active) {
    return {
      allowed: false,
      reason: `Kill-switch active (source: ${killSwitch.source})`,
    };
  }

  if (isPaused()) {
    return {
      allowed: false,
      reason: 'Processing is paused',
    };
  }

  return { allowed: true };
}

/**
 * Check if we're in dry-run mode
 */
export function checkDryRun(): boolean {
  return isDryRunMode().active;
}

// CLI interface
function main(): void {
  const command = process.argv[2];

  switch (command) {
    case 'status':
      printStatus();
      break;

    case 'enable-kill-switch':
    case 'kill':
    case 'stop':
      enableKillSwitch();
      break;

    case 'disable-kill-switch':
    case 'unkill':
      disableKillSwitch();
      break;

    case 'pause':
      pause();
      break;

    case 'resume':
      resume();
      break;

    case 'check':
      // Programmatic check - returns exit code
      const check = shouldProcess();
      if (!check.allowed) {
        console.error(check.reason);
        process.exit(1);
      }
      process.exit(0);
      break;

    case 'is-dry-run':
      // Programmatic check - returns exit code
      if (checkDryRun()) {
        console.log('DRY-RUN');
        process.exit(0);
      } else {
        console.log('LIVE');
        process.exit(1);
      }
      break;

    default:
      console.log('Usage: npx tsx safety-controls.ts <command>');
      console.log('');
      console.log('Commands:');
      console.log('  status               Show current safety status');
      console.log('  enable-kill-switch   Block all processing');
      console.log('  disable-kill-switch  Re-enable processing');
      console.log('  pause                Temporarily pause processing');
      console.log('  resume               Resume paused processing');
      console.log('  check                Check if processing allowed (exit code)');
      console.log('  is-dry-run           Check if dry-run mode (exit code)');
      console.log('');
      printStatus();
  }
}

// Only run main if executed directly
if (import.meta.url.endsWith(process.argv[1].replace(/^file:\/\//, ''))) {
  main();
}
