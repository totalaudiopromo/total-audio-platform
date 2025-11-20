#!/usr/bin/env node
/**
 * Dropzone Approval Script — Safe File Movement from Quarantine to Queue
 *
 * SAFETY DESIGN:
 * - Requires explicit --live flag for actual file movement
 * - Default mode is dry-run (logs only, no file operations)
 * - Respects DROPZONE_DISABLE kill-switch
 * - Clear confirmation messages for all operations
 *
 * USAGE:
 *   # Dry-run mode (default - safe)
 *   npx tsx .claude/scripts/dropzones/approve.ts approve test.txt
 *
 *   # Live mode (actually moves files)
 *   npx tsx .claude/scripts/dropzones/approve.ts approve test.txt --live
 *
 *   # List quarantine files
 *   npx tsx .claude/scripts/dropzones/approve.ts list
 */

import { readdir, rename, stat } from 'fs/promises';
import { join, basename } from 'path';
import type { ApprovalOptions, ApprovalResult } from '../../workflow/dropzones/types.js';

// Paths
const DROPZONE_ROOT = join(process.cwd(), '.claude/dropzones');
const QUARANTINE_DIR = join(DROPZONE_ROOT, 'quarantine');
const QUEUE_DIR = join(DROPZONE_ROOT, 'queue');

/**
 * List files in quarantine
 */
async function listQuarantineFiles(): Promise<void> {
  try {
    const files = await readdir(QUARANTINE_DIR);
    const regularFiles = files.filter(f => !f.startsWith('.') && f !== 'README.md');

    if (regularFiles.length === 0) {
      console.log('Quarantine is empty');
      return;
    }

    console.log(`\nFiles in quarantine (${regularFiles.length}):\n`);
    for (const file of regularFiles) {
      const filePath = join(QUARANTINE_DIR, file);
      const stats = await stat(filePath);
      console.log(`  - ${file} (${stats.size} bytes)`);
    }
    console.log('');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error listing quarantine: ${errorMessage}`);
    process.exit(1);
  }
}

/**
 * Approve a file and move it from quarantine to queue
 */
async function approveFile(
  filename: string,
  options: ApprovalOptions = {}
): Promise<ApprovalResult> {
  const { live = false, verbose = false } = options;

  // Kill-switch check
  if (process.env.DROPZONE_DISABLE === '1') {
    console.log('Approval disabled by DROPZONE_DISABLE=1');
    process.exit(0);
  }

  const sourcePath = join(QUARANTINE_DIR, filename);
  const destPath = join(QUEUE_DIR, filename);

  try {
    // Verify source file exists
    const stats = await stat(sourcePath);
    if (!stats.isFile()) {
      return {
        success: false,
        message: `${filename} is not a file`,
      };
    }

    if (!live) {
      // DRY-RUN mode
      console.log(`[DRY RUN] Would approve: ${filename}`);
      console.log(`[DRY RUN] Would move: ${sourcePath} → ${destPath}`);
      return {
        success: true,
        action: 'DRY-RUN',
        message: `Would approve ${filename}`,
        from: sourcePath,
        to: destPath,
      };
    }

    // LIVE mode - actually move the file
    await rename(sourcePath, destPath);

    if (verbose) {
      console.log(`✅ Approved: ${filename}`);
      console.log(`   Moved: ${sourcePath} → ${destPath}`);
    } else {
      console.log(`✅ Approved: ${filename}`);
    }

    return {
      success: true,
      action: 'APPROVED',
      message: `Successfully approved ${filename}`,
      from: sourcePath,
      to: destPath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (verbose) {
      console.error(`❌ Error approving ${filename}: ${errorMessage}`);
    } else {
      console.error(`❌ Failed to approve ${filename}`);
    }

    return {
      success: false,
      message: errorMessage,
      from: sourcePath,
    };
  }
}

/**
 * Main CLI handler
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
Dropzone Approval Script

Commands:
  list                    List files in quarantine
  approve <filename>      Approve a file (dry-run by default)
  approve <filename> --live   Approve a file (actually move it)
  help                    Show this help message

Examples:
  npx tsx .claude/scripts/dropzones/approve.ts list
  npx tsx .claude/scripts/dropzones/approve.ts approve test.txt
  npx tsx .claude/scripts/dropzones/approve.ts approve test.txt --live
`);
    process.exit(0);
  }

  switch (command) {
    case 'list':
      await listQuarantineFiles();
      break;

    case 'approve': {
      const filename = args[1];
      if (!filename) {
        console.error('Error: filename required');
        console.log('Usage: approve <filename> [--live]');
        process.exit(1);
      }

      const live = args.includes('--live');
      const verbose = args.includes('--verbose') || args.includes('-v');

      if (!live) {
        console.log('Running in DRY-RUN mode (use --live to actually move files)\n');
      }

      await approveFile(filename, { live, verbose });
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      console.log('Run with "help" for usage information');
      process.exit(1);
  }
}

// Run CLI
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error: ${errorMessage}`);
  process.exit(1);
});
