import { readFileSync, existsSync } from 'fs';

import { basename } from 'path';

import type { DropzoneType, DropzoneOptions, ProcessResult } from './types.js';

export async function processFile(
  dropzone: DropzoneType,

  filePath: string,

  options: DropzoneOptions = {}
): Promise<ProcessResult> {
  const opts: Required<DropzoneOptions> = {
    dryRun: true,

    verbose: false,

    ...options,
  };

  const fileName = basename(filePath);

  if (!existsSync(filePath)) {
    return {
      success: false,

      file: fileName,

      dropzone,

      action: 'failed',

      message: 'File not found',
    };
  }

  if (opts.dryRun) {
    if (opts.verbose) {
      console.log(`[DRY RUN] Would process: ${fileName} in ${dropzone}`);
    }

    return {
      success: true,

      file: fileName,

      dropzone,

      action: 'skipped',

      message: 'Dry-run mode - no actual processing',
    };
  }

  if (opts.verbose) {
    console.log(`Processing: ${fileName} in ${dropzone}`);
  }

  try {
    const content = readFileSync(filePath, 'utf-8');

    switch (dropzone) {
      case 'test-this':
        console.log('Test generation would happen here (not yet implemented)');

        break;

      case 'contacts-to-enrich':
        console.log('Contact enrichment would happen here (not yet implemented)');

        break;

      case 'review-this':
        console.log('Code review would happen here (not yet implemented)');

        break;

      case 'changelog-from-commits':
        console.log('Changelog generation would happen here (not yet implemented)');

        break;

      default:
        throw new Error(`Unknown dropzone type: ${dropzone}`);
    }

    return {
      success: true,

      file: fileName,

      dropzone,

      action: 'processed',

      message: `Processed in ${dropzone}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,

      file: fileName,

      dropzone,

      action: 'failed',

      message: errorMessage,
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx tsx processor.ts <dropzone> <file-path> [--live] [--verbose]');

    process.exit(1);
  }

  const dropzone = args[0] as DropzoneType;

  const filePath = args[1];

  const live = args.includes('--live');

  const verbose = args.includes('--verbose');

  console.log(`Dropzone processor started in ${live ? 'LIVE' : 'DRY-RUN'} mode`);

  processFile(dropzone, filePath, { dryRun: !live, verbose })
    .then(result => {
      console.log(`Result: ${result.action} - ${result.message || 'OK'}`);

      process.exit(result.success ? 0 : 1);
    })

    .catch(error => {
      console.error('Fatal error:', error);

      process.exit(1);
    });
}
