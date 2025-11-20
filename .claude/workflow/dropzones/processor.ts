/**
 * Dropzone File Processor
 * Handles file processing with kill-switch and dry-run support
 */

import { readFile, rename, unlink } from 'fs/promises';
import { join, basename } from 'path';
import type { DropzoneType, ProcessOptions, ProcessResult } from './types.js';

// Paths
const DROPZONE_ROOT = join(process.cwd(), '.claude/dropzones');
const PROCESSED_DIR = join(DROPZONE_ROOT, 'processed');
const FAILED_DIR = join(DROPZONE_ROOT, 'failed');

/**
 * Process a file from the queue
 *
 * @param dropzoneType - Type of dropzone (test-this, deploy-this, etc.)
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

    // Read file content
    const content = await readFile(filePath, 'utf-8');

    if (dryRun) {
      // DRY-RUN mode - just log what would happen
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

    // LIVE mode - actually process the file
    await processFileByType(dropzoneType, filePath, content);

    // Move to processed directory
    const processedPath = join(PROCESSED_DIR, filename);
    await rename(filePath, processedPath);

    if (verbose) {
      console.log(`✅ Processed and moved to: ${processedPath}`);
    }

    return {
      success: true,
      action: 'PROCESSED',
      message: `Successfully processed ${filename}`,
      filePath: processedPath,
    };
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
 * Process file based on dropzone type
 * This is where actual processing logic lives
 *
 * @param dropzoneType - Type of dropzone
 * @param filePath - Full path to file
 * @param content - File content
 */
async function processFileByType(
  dropzoneType: DropzoneType,
  filePath: string,
  content: string
): Promise<void> {
  switch (dropzoneType) {
    case 'test-this':
      // Run tests on the file content
      console.log(`Running tests for: ${basename(filePath)}`);
      // TODO: Implement actual test logic
      break;

    case 'deploy-this':
      // Deploy the file
      console.log(`Deploying: ${basename(filePath)}`);
      // TODO: Implement actual deployment logic
      break;

    case 'review-this':
      // Review the code
      console.log(`Reviewing code: ${basename(filePath)}`);
      // TODO: Implement actual review logic
      break;

    default:
      throw new Error(`Unknown dropzone type: ${dropzoneType}`);
  }
}
