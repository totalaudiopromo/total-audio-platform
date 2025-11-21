/**
 * Dropzone File Processor Router
 * Routes files to specialized processors with kill-switch and dry-run support
 */

import { readFile, rename } from 'fs/promises';
import { join, basename } from 'path';
import type { DropzoneType, ProcessOptions, ProcessResult } from './types.js';
import { processIntelFile } from './processors/intel.js';
import { processEpkFile } from './processors/epk.js';

// Paths
const DROPZONE_ROOT = join(process.cwd(), '.claude/dropzones');
const PROCESSED_DIR = join(DROPZONE_ROOT, 'processed');
const FAILED_DIR = join(DROPZONE_ROOT, 'failed');

/**
 * Process a file from the queue
 *
 * @param dropzoneType - Type of dropzone (test-this, intel, epk, etc.)
 * @param filePath - Full path to file in queue
 * @param options - Processing options (dryRun, verbose)
 * @returns ProcessResult with success status and details
 */
export async function processFile(
  dropzoneType: DropzoneType,
  filePath: string,
  options: ProcessOptions = {}
): Promise<ProcessResult> {
  const { dryRun = false, verbose = false } = options;
  const filename = basename(filePath);

  // Kill-switch check
  if (process.env.DROPZONE_DISABLE === '1') {
    return {
      success: false,
      message: 'Processing disabled by DROPZONE_DISABLE=1',
    };
  }

  try {
    if (verbose) {
      console.log(`Processing ${dropzoneType}: ${filename}`);
    }

    if (dryRun) {
      // DRY-RUN mode - just log what would happen
      const content = await readFile(filePath, 'utf-8');
      if (verbose) {
        console.log(`[DRY RUN] Would process ${filename}`);
        console.log(`[DRY RUN] Content length: ${content.length} bytes`);
      }
      return {
        success: true,
        action: 'DRY-RUN',
        message: `Would process ${filename}`,
        filePath,
      };
    }

    // LIVE mode - route to specialized processor
    const result = await routeToProcessor(dropzoneType, filePath, filename);

    // If processor succeeded, move original file to processed
    if (result.success) {
      const processedPath = join(PROCESSED_DIR, filename);
      await rename(filePath, processedPath);

      if (verbose) {
        console.log(`✅ Processed and moved to: ${processedPath}`);
      }
    }

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (verbose) {
      console.error(`❌ Error processing ${filename}: ${errorMessage}`);
    }

    // Move to failed directory
    try {
      const failedPath = join(FAILED_DIR, filename);
      await rename(filePath, failedPath);

      if (verbose) {
        console.log(`Moved to failed: ${failedPath}`);
      }
    } catch (moveError) {
      // If we can't move it, just log the error
      if (verbose) {
        console.error(`Could not move to failed directory: ${moveError}`);
      }
    }

    return {
      success: false,
      message: errorMessage,
      filePath,
    };
  }
}

/**
 * Route file to appropriate processor based on type or filename
 */
async function routeToProcessor(
  dropzoneType: DropzoneType,
  filePath: string,
  filename: string
): Promise<ProcessResult> {
  // Route by explicit type OR filename prefix
  if (dropzoneType === 'intel' || filename.startsWith('intel-')) {
    return await processIntelFile(filePath, PROCESSED_DIR);
  }

  if (dropzoneType === 'epk' || filename.startsWith('epk-')) {
    return await processEpkFile(filePath, PROCESSED_DIR);
  }

  // Fallback handlers for test/deploy/review types
  if (dropzoneType === 'test-this') {
    console.log(`Running tests for: ${filename}`);
    // TODO: Implement actual test logic
    return {
      success: true,
      action: 'test-this:processed',
      message: `Test processing for ${filename} (placeholder)`,
      filePath,
    };
  }

  if (dropzoneType === 'deploy-this') {
    console.log(`Deploying: ${filename}`);
    // TODO: Implement actual deployment logic
    return {
      success: true,
      action: 'deploy-this:processed',
      message: `Deployment for ${filename} (placeholder)`,
      filePath,
    };
  }

  if (dropzoneType === 'review-this') {
    console.log(`Reviewing code: ${filename}`);
    // TODO: Implement actual review logic
    return {
      success: true,
      action: 'review-this:processed',
      message: `Code review for ${filename} (placeholder)`,
      filePath,
    };
  }

  // Unknown type
  return {
    success: false,
    action: 'router:unknown_type',
    message: `No processor configured for type=${dropzoneType} file=${filename}`,
  };
}
