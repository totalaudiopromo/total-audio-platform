#!/usr/bin/env npx tsx
/**
 * Processor Router
 *
 * Routes files from the queue to appropriate processors based on filename prefix.
 * Part of the IndyDevDan-style dropzone workflow.
 *
 * Routing Rules:
 * - intel-*.csv → Intel Processor (contact enrichment)
 * - epk-*.md or epk-*.json → EPK Processor (press kit generation)
 * - Default → Move to errors/ with "unknown file type" log
 *
 * Usage:
 *   npx tsx processor-router.ts <filename>
 *   npx tsx processor-router.ts intel-contacts-2025-11-26.csv
 */

import * as fs from 'fs';
import * as path from 'path';
import { AuditLogger } from '../workflow/audit-logger';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const DROPZONES_DIR = path.join(CLAUDE_DIR, 'dropzones');
const QUEUE_DIR = path.join(DROPZONES_DIR, 'queue');
const PROCESSED_DIR = path.join(DROPZONES_DIR, 'processed');
const ERRORS_DIR = path.join(DROPZONES_DIR, 'errors');
const PROCESSORS_DIR = path.join(CLAUDE_DIR, 'scripts', 'processors');

// Processor types
export type ProcessorType = 'intel' | 'epk' | 'notes' | 'unknown';

// Routing rules
interface RoutingRule {
  pattern: RegExp;
  processor: ProcessorType;
  description: string;
}

const ROUTING_RULES: RoutingRule[] = [
  {
    pattern: /^intel-.*\.csv$/i,
    processor: 'intel',
    description: 'Contact enrichment CSV',
  },
  {
    pattern: /^epk-.*\.(md|json)$/i,
    processor: 'epk',
    description: 'Electronic Press Kit',
  },
  {
    pattern: /^contacts-.*\.csv$/i,
    processor: 'intel',
    description: 'Contacts CSV (legacy naming)',
  },
  {
    pattern: /^notes-.*\.(md|txt)$/i,
    processor: 'notes',
    description: 'Session notes for BUSINESS_NOTES.md',
  },
];

export interface RoutingResult {
  filename: string;
  processor: ProcessorType;
  description: string;
  fullPath: string;
}

export interface ProcessorResult {
  success: boolean;
  processor: ProcessorType;
  inputFile: string;
  outputFile?: string;
  error?: string;
  duration_ms: number;
}

const logger = new AuditLogger();

/**
 * Determine which processor should handle a file
 */
export function routeFile(filename: string): RoutingResult {
  const basename = path.basename(filename);

  for (const rule of ROUTING_RULES) {
    if (rule.pattern.test(basename)) {
      return {
        filename: basename,
        processor: rule.processor,
        description: rule.description,
        fullPath: path.join(QUEUE_DIR, basename),
      };
    }
  }

  return {
    filename: basename,
    processor: 'unknown',
    description: 'Unknown file type',
    fullPath: path.join(QUEUE_DIR, basename),
  };
}

/**
 * Move file to processed directory with timestamp
 */
export function moveToProcessed(filename: string): string {
  const basename = path.basename(filename);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const newName = `${timestamp}_${basename}`;
  const destPath = path.join(PROCESSED_DIR, newName);

  const sourcePath = path.join(QUEUE_DIR, basename);
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, destPath);
  }

  return destPath;
}

/**
 * Move file to errors directory with error log
 */
export function moveToErrors(filename: string, error: string): string {
  const basename = path.basename(filename);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const newName = `${timestamp}_${basename}`;
  const destPath = path.join(ERRORS_DIR, newName);
  const errorLogPath = path.join(ERRORS_DIR, `${timestamp}_${basename}.error.log`);

  const sourcePath = path.join(QUEUE_DIR, basename);
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, destPath);
  }

  // Write error log
  fs.writeFileSync(
    errorLogPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        filename: basename,
        error,
      },
      null,
      2
    )
  );

  return destPath;
}

/**
 * Execute a processor for a file
 */
export async function executeProcessor(routing: RoutingResult): Promise<ProcessorResult> {
  const startTime = Date.now();

  logger.info('processor', 'processor-start', {
    filename: routing.filename,
    processor: routing.processor,
  });

  // Check if file exists
  if (!fs.existsSync(routing.fullPath)) {
    const error = `File not found: ${routing.fullPath}`;
    logger.error('processor', 'file-not-found', { filename: routing.filename });
    return {
      success: false,
      processor: routing.processor,
      inputFile: routing.filename,
      error,
      duration_ms: Date.now() - startTime,
    };
  }

  // Handle unknown file type
  if (routing.processor === 'unknown') {
    const error = `Unknown file type: ${routing.filename}. Expected intel-*.csv or epk-*.{md,json}`;
    logger.warn('processor', 'unknown-file-type', { filename: routing.filename });
    moveToErrors(routing.filename, error);
    return {
      success: false,
      processor: 'unknown',
      inputFile: routing.filename,
      error,
      duration_ms: Date.now() - startTime,
    };
  }

  // Dynamic import of processor
  try {
    const processorPath = path.join(PROCESSORS_DIR, `${routing.processor}-processor.ts`);

    if (!fs.existsSync(processorPath)) {
      const error = `Processor not found: ${processorPath}`;
      logger.error('processor', 'processor-not-found', {
        processor: routing.processor,
        path: processorPath,
      });
      moveToErrors(routing.filename, error);
      return {
        success: false,
        processor: routing.processor,
        inputFile: routing.filename,
        error,
        duration_ms: Date.now() - startTime,
      };
    }

    // Import and execute processor
    const processor = await import(processorPath);

    if (typeof processor.processFile !== 'function') {
      const error = `Processor ${routing.processor} does not export a 'process' function`;
      logger.error('processor', 'invalid-processor', { processor: routing.processor });
      moveToErrors(routing.filename, error);
      return {
        success: false,
        processor: routing.processor,
        inputFile: routing.filename,
        error,
        duration_ms: Date.now() - startTime,
      };
    }

    // Execute processor
    const result = await processor.processFile(routing.fullPath);

    if (result.success) {
      const outputPath = moveToProcessed(routing.filename);
      logger.info('processor', 'processor-success', {
        filename: routing.filename,
        processor: routing.processor,
        outputPath,
      });
      return {
        success: true,
        processor: routing.processor,
        inputFile: routing.filename,
        outputFile: outputPath,
        duration_ms: Date.now() - startTime,
      };
    } else {
      moveToErrors(routing.filename, result.error || 'Unknown processor error');
      logger.error('processor', 'processor-failed', {
        filename: routing.filename,
        processor: routing.processor,
        error: result.error,
      });
      return {
        success: false,
        processor: routing.processor,
        inputFile: routing.filename,
        error: result.error,
        duration_ms: Date.now() - startTime,
      };
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error('processor', 'processor-exception', {
      filename: routing.filename,
      processor: routing.processor,
      error,
    });
    moveToErrors(routing.filename, error);
    return {
      success: false,
      processor: routing.processor,
      inputFile: routing.filename,
      error,
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * List all files in the queue
 */
export function listQueue(): string[] {
  if (!fs.existsSync(QUEUE_DIR)) {
    return [];
  }
  return fs.readdirSync(QUEUE_DIR).filter(f => !f.startsWith('.'));
}

/**
 * Process all files in the queue
 */
export async function processQueue(): Promise<ProcessorResult[]> {
  const files = listQueue();
  const results: ProcessorResult[] = [];

  for (const file of files) {
    const routing = routeFile(file);
    const result = await executeProcessor(routing);
    results.push(result);
  }

  return results;
}

// CLI interface
async function main(): Promise<void> {
  const command = process.argv[2];

  switch (command) {
    case 'route':
      // Route a specific file (just show routing, don't process)
      const routeFilename = process.argv[3];
      if (!routeFilename) {
        console.error('Usage: npx tsx processor-router.ts route <filename>');
        process.exit(1);
      }
      const routing = routeFile(routeFilename);
      console.log(JSON.stringify(routing, null, 2));
      break;

    case 'process':
      // Process a specific file
      const processFilename = process.argv[3];
      if (!processFilename) {
        console.error('Usage: npx tsx processor-router.ts process <filename>');
        process.exit(1);
      }
      const processRouting = routeFile(processFilename);
      const processResult = await executeProcessor(processRouting);
      console.log(JSON.stringify(processResult, null, 2));
      break;

    case 'list':
      // List queue
      const files = listQueue();
      if (files.length === 0) {
        console.log('Queue is empty');
      } else {
        console.log('Files in queue:');
        for (const file of files) {
          const r = routeFile(file);
          console.log(`  ${file} → ${r.processor} (${r.description})`);
        }
      }
      break;

    case 'process-all':
      // Process entire queue
      const results = await processQueue();
      console.log(JSON.stringify(results, null, 2));
      break;

    default:
      console.log('Usage: npx tsx processor-router.ts <command>');
      console.log('');
      console.log('Commands:');
      console.log('  route <filename>    Show routing for a file');
      console.log('  process <filename>  Process a specific file');
      console.log('  list                List files in queue');
      console.log('  process-all         Process entire queue');
      console.log('');
      console.log('Routing Rules:');
      for (const rule of ROUTING_RULES) {
        console.log(`  ${rule.pattern.source} → ${rule.processor} (${rule.description})`);
      }
  }
}

main().catch(console.error);
