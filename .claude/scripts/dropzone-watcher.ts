#!/usr/bin/env npx tsx
/**
 * Dropzone Watcher (Background Daemon)
 *
 * Polls the queue directory and processes files automatically.
 * Part of the IndyDevDan-style dropzone workflow.
 *
 * Features:
 * - Polls queue every 5 seconds
 * - Respects kill-switch (DROPZONE_DISABLE=1)
 * - Dry-run mode (DROPZONE_LIVE=0, default)
 * - PID file for process management
 * - Graceful shutdown on SIGINT/SIGTERM
 * - Comprehensive audit logging
 *
 * Usage:
 *   # Start in dry-run mode (default)
 *   npx tsx dropzone-watcher.ts
 *
 *   # Start in live mode
 *   DROPZONE_LIVE=1 npx tsx dropzone-watcher.ts
 *
 *   # Run in background
 *   DROPZONE_LIVE=1 npx tsx dropzone-watcher.ts &
 *
 *   # Stop
 *   kill $(cat .claude/tmp/watcher.pid)
 *
 *   # Emergency stop
 *   export DROPZONE_DISABLE=1
 */

import * as fs from 'fs';
import * as path from 'path';
import { shouldProcess, checkDryRun, isPaused } from '../workflow/safety-controls';
import { routeFile, executeProcessor, listQueue, ProcessorResult } from './processor-router';
import { AuditLogger } from '../workflow/audit-logger';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const TMP_DIR = path.join(CLAUDE_DIR, 'tmp');
const PID_FILE = path.join(TMP_DIR, 'watcher.pid');
const QUEUE_DIR = path.join(CLAUDE_DIR, 'dropzones', 'queue');
const QUARANTINE_DIR = path.join(CLAUDE_DIR, 'dropzones', 'quarantine');

// Poll interval (milliseconds)
const POLL_INTERVAL = 5000;

// Processing timeout (milliseconds)
const PROCESS_TIMEOUT = 30000;

const logger = new AuditLogger();

interface WatcherState {
  running: boolean;
  startTime: Date;
  processedCount: number;
  errorCount: number;
  lastPoll: Date | null;
  dryRun: boolean;
}

let state: WatcherState = {
  running: false,
  startTime: new Date(),
  processedCount: 0,
  errorCount: 0,
  lastPoll: null,
  dryRun: true,
};

/**
 * Ensure directories exist
 */
function ensureDirectories(): void {
  for (const dir of [TMP_DIR, QUEUE_DIR, QUARANTINE_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Write PID file
 */
function writePidFile(): void {
  fs.writeFileSync(PID_FILE, String(process.pid));
  logger.info('watcher', 'pid-written', { pid: process.pid, file: PID_FILE });
}

/**
 * Clean up PID file
 */
function cleanupPidFile(): void {
  if (fs.existsSync(PID_FILE)) {
    fs.unlinkSync(PID_FILE);
  }
}

/**
 * Move files from quarantine to queue (auto-approve)
 */
function autoApproveQuarantine(): string[] {
  if (!fs.existsSync(QUARANTINE_DIR)) {
    return [];
  }

  const files = fs.readdirSync(QUARANTINE_DIR).filter(f => !f.startsWith('.'));
  const approved: string[] = [];

  for (const file of files) {
    const sourcePath = path.join(QUARANTINE_DIR, file);
    const destPath = path.join(QUEUE_DIR, file);

    try {
      // Check if it's a file (not directory)
      const stat = fs.statSync(sourcePath);
      if (!stat.isFile()) continue;

      fs.renameSync(sourcePath, destPath);
      approved.push(file);

      logger.info('watcher', 'file-auto-approved', {
        file,
        from: 'quarantine',
        to: 'queue',
      });
    } catch (err) {
      logger.error('watcher', 'auto-approve-failed', {
        file,
        error: String(err),
      });
    }
  }

  return approved;
}

/**
 * Process a single file with timeout
 */
async function processFileWithTimeout(filename: string): Promise<ProcessorResult> {
  const routing = routeFile(filename);

  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      logger.error('watcher', 'process-timeout', {
        filename,
        timeout_ms: PROCESS_TIMEOUT,
      });
      resolve({
        success: false,
        processor: routing.processor,
        inputFile: filename,
        error: `Processing timeout after ${PROCESS_TIMEOUT}ms`,
        duration_ms: PROCESS_TIMEOUT,
      });
    }, PROCESS_TIMEOUT);

    executeProcessor(routing)
      .then(result => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch(err => {
        clearTimeout(timeout);
        resolve({
          success: false,
          processor: routing.processor,
          inputFile: filename,
          error: String(err),
          duration_ms: 0,
        });
      });
  });
}

/**
 * Single poll iteration
 */
async function poll(): Promise<void> {
  state.lastPoll = new Date();

  // Check if we should process
  const check = shouldProcess();
  if (!check.allowed) {
    logger.debug('watcher', 'poll-skipped', { reason: check.reason });
    return;
  }

  // Check if paused
  if (isPaused()) {
    logger.debug('watcher', 'poll-paused', {});
    return;
  }

  // Auto-approve files from quarantine (if enabled)
  const approved = autoApproveQuarantine();
  if (approved.length > 0) {
    logger.info('watcher', 'files-auto-approved', { count: approved.length, files: approved });
  }

  // Get files in queue
  const files = listQueue();
  if (files.length === 0) {
    return;
  }

  logger.info('watcher', 'processing-queue', {
    files: files.length,
    dryRun: state.dryRun,
  });

  // Process each file
  for (const file of files) {
    // Re-check safety before each file
    const recheck = shouldProcess();
    if (!recheck.allowed) {
      logger.warn('watcher', 'processing-interrupted', { reason: recheck.reason });
      break;
    }

    const routing = routeFile(file);

    if (state.dryRun) {
      // Dry-run: just log what would happen
      logger.info('watcher', 'dry-run-would-process', {
        file,
        processor: routing.processor,
        description: routing.description,
      });
      console.log(`[DRY-RUN] Would process: ${file} → ${routing.processor}`);
      continue;
    }

    // Live mode: actually process
    console.log(`Processing: ${file} → ${routing.processor}`);

    const result = await processFileWithTimeout(file);

    if (result.success) {
      state.processedCount++;
      console.log(`  ✓ Success: ${result.outputFile}`);
    } else {
      state.errorCount++;
      console.log(`  ✗ Error: ${result.error}`);
    }
  }
}

/**
 * Main watch loop
 */
async function watch(): Promise<void> {
  state.running = true;
  state.startTime = new Date();
  state.dryRun = checkDryRun();

  logger.info('watcher', 'started', {
    pid: process.pid,
    dryRun: state.dryRun,
    pollInterval: POLL_INTERVAL,
    processTimeout: PROCESS_TIMEOUT,
  });

  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║          IndyDevDan Dropzone Watcher               ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(
    `║  Mode: ${state.dryRun ? 'DRY-RUN (logs only)' : 'LIVE (processing enabled)'}${state.dryRun ? '       ' : '  '} ║`
  );
  console.log(`║  PID:  ${process.pid}                                      ║`);
  console.log(`║  Poll: Every ${POLL_INTERVAL / 1000} seconds                           ║`);
  console.log('╠════════════════════════════════════════════════════╣');
  console.log('║  Commands:                                         ║');
  console.log('║    Ctrl+C       Stop watcher                       ║');
  console.log('║    kill-switch  export DROPZONE_DISABLE=1          ║');
  console.log('║    Live mode    DROPZONE_LIVE=1 npx tsx ...        ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');

  if (state.dryRun) {
    console.log('⚠️  DRY-RUN MODE: No files will be processed.');
    console.log('   Set DROPZONE_LIVE=1 to enable processing.');
    console.log('');
  }

  console.log('Watching for files...');
  console.log('');

  while (state.running) {
    try {
      await poll();
    } catch (err) {
      logger.error('watcher', 'poll-error', { error: String(err) });
      console.error('Poll error:', err);
    }

    // Wait for next poll
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }
}

/**
 * Graceful shutdown
 */
function shutdown(signal: string): void {
  console.log('');
  console.log(`Received ${signal}, shutting down...`);

  state.running = false;

  const runtime = Math.round((Date.now() - state.startTime.getTime()) / 1000);

  logger.info('watcher', 'stopped', {
    signal,
    runtime_seconds: runtime,
    processed: state.processedCount,
    errors: state.errorCount,
  });

  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║              Watcher Shutdown Summary              ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(
    `║  Runtime:   ${runtime} seconds${' '.repeat(Math.max(0, 27 - String(runtime).length))}║`
  );
  console.log(
    `║  Processed: ${state.processedCount} files${' '.repeat(Math.max(0, 28 - String(state.processedCount).length))}║`
  );
  console.log(
    `║  Errors:    ${state.errorCount}${' '.repeat(Math.max(0, 35 - String(state.errorCount).length))}║`
  );
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');

  cleanupPidFile();
  process.exit(0);
}

/**
 * Print status
 */
function printStatus(): void {
  const runtime = Math.round((Date.now() - state.startTime.getTime()) / 1000);
  const queue = listQueue();

  console.log('');
  console.log('=== Watcher Status ===');
  console.log(`Running:    ${state.running}`);
  console.log(`Mode:       ${state.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  console.log(`Runtime:    ${runtime} seconds`);
  console.log(`Processed:  ${state.processedCount}`);
  console.log(`Errors:     ${state.errorCount}`);
  console.log(`Queue:      ${queue.length} files`);
  console.log(`Last Poll:  ${state.lastPoll?.toISOString() || 'never'}`);
  console.log('');
}

// CLI interface
async function main(): Promise<void> {
  const command = process.argv[2];

  switch (command) {
    case 'status':
      // Show status (doesn't start watcher)
      if (fs.existsSync(PID_FILE)) {
        const pid = fs.readFileSync(PID_FILE, 'utf-8').trim();
        console.log(`Watcher PID: ${pid}`);
        try {
          process.kill(parseInt(pid), 0);
          console.log('Status: RUNNING');
        } catch {
          console.log('Status: NOT RUNNING (stale PID file)');
        }
      } else {
        console.log('Status: NOT RUNNING');
      }
      console.log(`Queue: ${listQueue().length} files`);
      console.log(`Mode: ${checkDryRun() ? 'DRY-RUN' : 'LIVE'}`);
      break;

    case 'once':
      // Run once (don't start loop)
      state.dryRun = checkDryRun();
      console.log(`Running single poll (${state.dryRun ? 'DRY-RUN' : 'LIVE'})...`);
      await poll();
      console.log('Done');
      break;

    default:
      // Start watcher
      ensureDirectories();
      writePidFile();

      // Handle signals
      process.on('SIGINT', () => shutdown('SIGINT'));
      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGUSR1', () => printStatus());

      await watch();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  cleanupPidFile();
  process.exit(1);
});
