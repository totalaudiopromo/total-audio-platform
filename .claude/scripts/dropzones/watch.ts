#!/usr/bin/env node
/**
 * Dropzone Watcher — Safe File Monitoring for Queue Processing
 *
 * SAFETY DESIGN:
 * - Respects DROPZONE_LIVE env var (0=dry-run, 1=live)
 * - Respects DROPZONE_DISABLE kill-switch (1=exit immediately)
 * - Watches ONLY .claude/dropzones/queue/ (approved files only)
 * - Graceful shutdown on Ctrl+C
 * - Never processes without explicit DROPZONE_LIVE=1
 *
 * USAGE:
 *   # Dry-run mode (safe)
 *   DROPZONE_LIVE=0 DROPZONE_DISABLE=0 npx tsx .claude/scripts/dropzones/watch.ts
 *
 *   # Live mode (processes files)
 *   DROPZONE_LIVE=1 DROPZONE_DISABLE=0 npx tsx .claude/scripts/dropzones/watch.ts
 *
 *   # Disabled (kill-switch)
 *   DROPZONE_DISABLE=1 npx tsx .claude/scripts/dropzones/watch.ts
 */

import { watch } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { processFile } from '../../workflow/dropzones/processor.js';
import type { DropzoneType } from '../../workflow/dropzones/types.js';

// Environment variables for kill-switch and mode control
const live = process.env.DROPZONE_LIVE === '1';
const disabled = process.env.DROPZONE_DISABLE === '1';

// Paths
const QUEUE_DIR = join(process.cwd(), '.claude/dropzones/queue');

// Kill-switch check
if (disabled) {
  console.log('Watcher disabled by DROPZONE_DISABLE=1');
  process.exit(0);
}

// Mode announcement
if (!live) {
  console.log('Watcher running in DRY-RUN mode');
  console.log('Set DROPZONE_LIVE=1 to enable live processing');
} else {
  console.log('Watcher running in LIVE mode');
  console.log('Files in queue/ will be processed automatically');
}

console.log(`Watching queue/ for approved files…`);
console.log('Press Ctrl+C to stop\n');

// Track processed files to avoid re-processing
const processedFiles = new Set<string>();

/**
 * Process a file from the queue
 */
async function handleFile(filename: string): Promise<void> {
  // Skip non-files (directories, README, etc.)
  if (filename === 'README.md' || filename.startsWith('.')) {
    return;
  }

  // Skip already processed files
  if (processedFiles.has(filename)) {
    return;
  }

  const filePath = join(QUEUE_DIR, filename);

  // Verify file still exists and is a file
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return;
    }
  } catch {
    // File was deleted or doesn't exist
    return;
  }

  if (!live) {
    // DRY-RUN mode - only log what would happen
    console.log(`[DRY RUN] Would process: ${filename}`);
    processedFiles.add(filename);
    return;
  }

  // LIVE mode - actually process the file
  console.log(`\nProcessing: ${filename}`);

  try {
    // Determine dropzone type from file content or naming convention
    // For now, default to 'test-this' for testing
    const dropzoneType: DropzoneType = 'test-this';

    const result = await processFile(dropzoneType, filePath, {
      dryRun: false, // LIVE processing
      verbose: true,
    });

    if (result.success) {
      console.log(`✅ ${result.action}: ${filename}`);
      processedFiles.add(filename);
    } else {
      console.error(`❌ Failed: ${filename} - ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error processing ${filename}: ${errorMessage}`);
  }
}

/**
 * Process existing files in queue on startup
 */
async function processExistingFiles(): Promise<void> {
  try {
    const files = await readdir(QUEUE_DIR);
    const regularFiles = files.filter(f => !f.startsWith('.') && f !== 'README.md');

    if (regularFiles.length === 0) {
      console.log('Queue is empty\n');
      return;
    }

    console.log(`Found ${regularFiles.length} file(s) in queue\n`);

    for (const file of regularFiles) {
      await handleFile(file);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error reading queue directory: ${errorMessage}`);
  }
}

/**
 * Start watching the queue directory
 */
async function startWatcher(): Promise<void> {
  // Process any existing files first
  await processExistingFiles();

  console.log('Watcher active (waiting for new files)...\n');

  // Set up file watcher
  const watcher = watch(QUEUE_DIR, { persistent: true }, async (eventType, filename) => {
    if (!filename || filename.startsWith('.') || filename === 'README.md') {
      return;
    }

    // Only process on 'rename' events (file added/moved to directory)
    if (eventType === 'rename') {
      // Small delay to ensure file is fully written
      await new Promise(resolve => setTimeout(resolve, 100));
      await handleFile(filename);
    }
  });

  // Graceful shutdown on Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\nShutting down watcher...');
    watcher.close();
    console.log('✅ Watcher stopped cleanly');
    process.exit(0);
  });

  // Keep process alive
  process.on('SIGTERM', () => {
    console.log('\n\nReceived SIGTERM, shutting down...');
    watcher.close();
    process.exit(0);
  });
}

// Start the watcher
startWatcher().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error: ${errorMessage}`);
  process.exit(1);
});
