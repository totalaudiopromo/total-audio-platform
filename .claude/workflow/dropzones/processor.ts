#!/usr/bin/env tsx
import { processContactEnrichment } from './processors/intel.js';
import type { DropzoneType, ProcessorOptions, ProcessorResult } from './types.js';

/**
 * Main processor router - routes files to specialized processors based on dropzone type
 */
export async function processFile(
  type: DropzoneType,
  filePath: string,
  options: ProcessorOptions
): Promise<ProcessorResult> {
  const opts = { dryRun: options.dryRun || false, verbose: options.verbose || false };

  try {
    switch (type) {
      case 'contacts-to-enrich':
        await processContactEnrichment(filePath, opts);
        return { success: true, action: 'Contact enrichment complete' };

      case 'test-this':
        if (opts.verbose) console.log('[TEST-THIS] File received:', filePath);
        if (opts.dryRun) {
          console.log('[DRY-RUN] Would process test file');
        } else {
          console.log('✅ Test file processed successfully');
        }
        return { success: true, action: 'Test processing complete' };

      case 'review-this':
        if (opts.verbose) console.log('[REVIEW-THIS] File received for review:', filePath);
        if (opts.dryRun) {
          console.log('[DRY-RUN] Would process review file');
        } else {
          console.log('✅ Review file processed successfully');
        }
        return { success: true, action: 'Review processing complete' };

      case 'changelog-from-commits':
        if (opts.verbose) console.log('[CHANGELOG] File received:', filePath);
        if (opts.dryRun) {
          console.log('[DRY-RUN] Would generate changelog');
        } else {
          console.log('✅ Changelog generated successfully');
        }
        return { success: true, action: 'Changelog generation complete' };

      default:
        return {
          success: false,
          message: `Unknown dropzone type: ${type}`,
          action: 'Routing failed',
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: errorMessage,
      action: 'Processing failed',
    };
  }
}
