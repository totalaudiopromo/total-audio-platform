#!/usr/bin/env node

/**
 * Dropzone Watcher — Safe File Monitoring for Queue Processing
 *
 * SAFETY DESIGN:
 * - Respects DROPZONE_LIVE env var (0=dry-run, 1=live)
 * - Respects DROPZONE_DISABLE kill-switch (1=exit immediately)
 * - Watches ONLY .claude/dropzones/queue/ (approved files only)
 * - Auto-approves files from quarantine if autoApprove enabled
 * - Graceful shutdown on Ctrl+C
 * - Never processes without explicit DROPZONE_LIVE=1
 */

import { watch } from 'fs';
import { readdir, stat, rename } from 'fs/promises';
import { join } from 'path';
import { processFile } from '../../workflow/dropzones/processor.js';
import type { DropzoneType } from '../../workflow/dropzones/types.js';

// Environment variables for kill-switch and mode control
const live = process.env.DROPZONE_LIVE === '1';
const disabled = process.env.DROPZONE_DISABLE === '1';

// Paths
const QUEUE_DIR = join(process.cwd(), '.claude/dropzones/queue');
const QUARANTINE_DIR = join(process.cwd(), '.claude/dropzones/quarantine');

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
 * Detect dropzone type from filename
 */
function detectDropzoneType(filename: string): DropzoneType {
  const lower = filename.toLowerCase();

  // Intel processor: contacts, leads, emails
  if (lower.includes('intel-') || lower.includes('contacts') || lower.includes('leads')) {
    return 'contacts-to-enrich';
  }

  // Changelog processor
  if (lower.includes('changelog') || lower.includes('commits')) {
    return 'changelog-from-commits';
  }

  // Review processor
  if (lower.includes('review')) {
    return 'review-this';
  }

  // Default to test-this
  return 'test-this';
}

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
    const dropzoneType = detectDropzoneType(filename);
    console.log(`[DRY RUN] Would process: ${filename} (type: ${dropzoneType})`);
    processedFiles.add(filename);
    return;
  }

  // LIVE mode - actually process the file
  console.log(`\nProcessing: ${filename}`);

  try {
    // Detect dropzone type from filename
    const dropzoneType = detectDropzoneType(filename);

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
 * Auto-approve all files in quarantine (move to queue)
 * Only runs if autoApprove is enabled in settings
 */
async function autoApproveAll(): Promise<void> {
  try {
    const files = await readdir(QUARANTINE_DIR);
    const regularFiles = files.filter(f => !f.startsWith('.') && f !== 'README.md');

    if (regularFiles.length === 0) {
      console.log('📭 Quarantine is empty (nothing to auto-approve)\n');
      return;
    }

    console.log(`🔄 Auto-approving ${regularFiles.length} file(s) from quarantine...\n`);

    for (const filename of regularFiles) {
      const src = join(QUARANTINE_DIR, filename);
      const dest = join(QUEUE_DIR, filename);

      try {
        await rename(src, dest);
        console.log(`🟢 Auto-approved: ${filename}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Failed to auto-approve ${filename}: ${errorMessage}`);
      }
    }

    console.log('');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error reading quarantine directory: ${errorMessage}`);
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
  // Auto-approve files from quarantine → queue
  await autoApproveAll();

  // Process any existing files in queue
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
startWatcher().catch(error => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error: ${errorMessage}`);
  process.exit(1);
});
