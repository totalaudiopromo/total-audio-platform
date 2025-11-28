#!/usr/bin/env npx tsx
/**
 * Approval CLI
 *
 * Manual approval interface for dropzone files.
 * Part of the IndyDevDan-style workflow for human-in-the-loop safety.
 *
 * Commands:
 *   list              List files awaiting approval (in quarantine)
 *   approve <file>    Move file from quarantine to queue
 *   reject <file>     Move file to errors with rejection log
 *   approve-all       Approve all files in quarantine
 *   status            Show dropzone status summary
 *
 * Usage:
 *   npx tsx approve-file.ts list
 *   npx tsx approve-file.ts approve intel-contacts-2025-11-26.csv
 *   npx tsx approve-file.ts reject bad-file.csv --reason "Invalid format"
 */

import * as fs from 'fs';
import * as path from 'path';
import { AuditLogger } from '../workflow/audit-logger';
import { routeFile } from './processor-router';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const DROPZONES_DIR = path.join(CLAUDE_DIR, 'dropzones');
const QUARANTINE_DIR = path.join(DROPZONES_DIR, 'quarantine');
const QUEUE_DIR = path.join(DROPZONES_DIR, 'queue');
const ERRORS_DIR = path.join(DROPZONES_DIR, 'errors');
const INPUT_DIR = path.join(DROPZONES_DIR, 'input');
const PROCESSED_DIR = path.join(DROPZONES_DIR, 'processed');

const logger = new AuditLogger();

interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: Date;
  processor: string;
  description: string;
}

/**
 * Ensure directories exist
 */
function ensureDirectories(): void {
  for (const dir of [QUARANTINE_DIR, QUEUE_DIR, ERRORS_DIR, INPUT_DIR, PROCESSED_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * List files in a directory with metadata
 */
function listFiles(dir: string): FileInfo[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
  return files.map(name => {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    const routing = routeFile(name);

    return {
      name,
      path: filePath,
      size: stat.size,
      modified: stat.mtime,
      processor: routing.processor,
      description: routing.description,
    };
  });
}

/**
 * Format file size
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format relative time
 */
function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * List files awaiting approval
 */
function listQuarantine(): void {
  const files = listFiles(QUARANTINE_DIR);

  if (files.length === 0) {
    console.log('');
    console.log('✓ No files awaiting approval');
    console.log('');
    return;
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                   Files Awaiting Approval                      ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');

  for (const file of files) {
    const processorIcon =
      file.processor === 'intel' ? '📊' : file.processor === 'epk' ? '📄' : '❓';
    console.log(`║  ${processorIcon} ${file.name.padEnd(50).slice(0, 50)} ║`);
    console.log(`║     → ${file.processor} (${file.description})`.padEnd(65) + '║');
    console.log(
      `║     ${formatSize(file.size).padEnd(10)} ${formatRelativeTime(file.modified)}`.padEnd(65) +
        '║'
    );
    console.log('╟────────────────────────────────────────────────────────────────╢');
  }

  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Commands:');
  console.log(`  npx tsx approve-file.ts approve <filename>`);
  console.log(`  npx tsx approve-file.ts reject <filename> --reason "reason"`);
  console.log(`  npx tsx approve-file.ts approve-all`);
  console.log('');
}

/**
 * Approve a file (move from quarantine to queue)
 */
function approveFile(filename: string): boolean {
  const sourcePath = path.join(QUARANTINE_DIR, filename);
  const destPath = path.join(QUEUE_DIR, filename);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: File not found in quarantine: ${filename}`);
    console.error(`Looking in: ${QUARANTINE_DIR}`);
    return false;
  }

  try {
    fs.renameSync(sourcePath, destPath);

    logger.info('workflow', 'file-approved', {
      filename,
      from: 'quarantine',
      to: 'queue',
    });

    console.log(`✓ Approved: ${filename}`);
    console.log(`  Moved to queue for processing`);
    return true;
  } catch (err) {
    console.error(`Error approving file: ${err}`);
    logger.error('workflow', 'approve-failed', { filename, error: String(err) });
    return false;
  }
}

/**
 * Reject a file (move to errors with reason)
 */
function rejectFile(filename: string, reason: string): boolean {
  const sourcePath = path.join(QUARANTINE_DIR, filename);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const destPath = path.join(ERRORS_DIR, `rejected-${timestamp}_${filename}`);
  const logPath = path.join(ERRORS_DIR, `rejected-${timestamp}_${filename}.rejection.log`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: File not found in quarantine: ${filename}`);
    return false;
  }

  try {
    fs.renameSync(sourcePath, destPath);

    // Write rejection log
    fs.writeFileSync(
      logPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          filename,
          reason,
          rejected_by: 'manual',
        },
        null,
        2
      )
    );

    logger.info('workflow', 'file-rejected', {
      filename,
      reason,
      from: 'quarantine',
      to: 'errors',
    });

    console.log(`✗ Rejected: ${filename}`);
    console.log(`  Reason: ${reason}`);
    console.log(`  Moved to errors/`);
    return true;
  } catch (err) {
    console.error(`Error rejecting file: ${err}`);
    logger.error('workflow', 'reject-failed', { filename, error: String(err) });
    return false;
  }
}

/**
 * Approve all files in quarantine
 */
function approveAll(): void {
  const files = listFiles(QUARANTINE_DIR);

  if (files.length === 0) {
    console.log('No files to approve');
    return;
  }

  console.log(`Approving ${files.length} files...`);
  console.log('');

  let approved = 0;
  let failed = 0;

  for (const file of files) {
    if (approveFile(file.name)) {
      approved++;
    } else {
      failed++;
    }
  }

  console.log('');
  console.log(`Done: ${approved} approved, ${failed} failed`);
}

/**
 * Show dropzone status summary
 */
function showStatus(): void {
  const quarantine = listFiles(QUARANTINE_DIR);
  const queue = listFiles(QUEUE_DIR);
  const processed = listFiles(PROCESSED_DIR);
  const errors = listFiles(ERRORS_DIR);
  const input = listFiles(INPUT_DIR);

  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║              Dropzone Status Summary               ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(
    `║  📥 Input:      ${String(input.length).padStart(3)} files                        ║`
  );
  console.log(
    `║  🔒 Quarantine: ${String(quarantine.length).padStart(3)} files (awaiting approval)   ║`
  );
  console.log(
    `║  📋 Queue:      ${String(queue.length).padStart(3)} files (ready for processing) ║`
  );
  console.log(
    `║  ✅ Processed:  ${String(processed.length).padStart(3)} files                        ║`
  );
  console.log(
    `║  ❌ Errors:     ${String(errors.length).padStart(3)} files                        ║`
  );
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');

  if (quarantine.length > 0) {
    console.log(`⚠️  ${quarantine.length} file(s) awaiting approval.`);
    console.log('   Run: npx tsx approve-file.ts list');
    console.log('');
  }

  if (queue.length > 0) {
    console.log(`📋 ${queue.length} file(s) ready for processing.`);
    console.log('   Start watcher: npx tsx dropzone-watcher.ts');
    console.log('');
  }
}

/**
 * Move file from input to quarantine
 */
function quarantineInput(): void {
  const files = listFiles(INPUT_DIR);

  if (files.length === 0) {
    console.log('No files in input/');
    return;
  }

  console.log(`Moving ${files.length} files to quarantine...`);

  for (const file of files) {
    const sourcePath = path.join(INPUT_DIR, file.name);
    const destPath = path.join(QUARANTINE_DIR, file.name);

    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`  → ${file.name}`);

      logger.info('workflow', 'file-quarantined', {
        filename: file.name,
        from: 'input',
        to: 'quarantine',
      });
    } catch (err) {
      console.error(`  ✗ Failed: ${file.name} - ${err}`);
    }
  }

  console.log('');
  console.log('Files are now in quarantine awaiting approval.');
  console.log('Run: npx tsx approve-file.ts list');
}

/**
 * Preview a file in quarantine
 */
function previewFile(filename: string): void {
  const filePath = path.join(QUARANTINE_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found in quarantine: ${filename}`);
    return;
  }

  const stat = fs.statSync(filePath);
  const routing = routeFile(filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log(`║  File: ${filename.padEnd(55).slice(0, 55)} ║`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║  Processor:   ${routing.processor.padEnd(48)} ║`);
  console.log(`║  Description: ${routing.description.padEnd(48)} ║`);
  console.log(`║  Size:        ${formatSize(stat.size).padEnd(48)} ║`);
  console.log(`║  Modified:    ${stat.mtime.toISOString().padEnd(48)} ║`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  Preview (first 20 lines):                                     ║');
  console.log('╟────────────────────────────────────────────────────────────────╢');

  const lines = content.split('\n').slice(0, 20);
  for (const line of lines) {
    const truncated = line.slice(0, 62);
    console.log(`║  ${truncated.padEnd(62)} ║`);
  }

  if (content.split('\n').length > 20) {
    console.log('║  ... (truncated)                                               ║');
  }

  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Commands:');
  console.log(`  npx tsx approve-file.ts approve ${filename}`);
  console.log(`  npx tsx approve-file.ts reject ${filename} --reason "reason"`);
  console.log('');
}

// CLI interface
function main(): void {
  ensureDirectories();

  const command = process.argv[2];
  const filename = process.argv[3];

  switch (command) {
    case 'list':
    case 'ls':
      listQuarantine();
      break;

    case 'approve':
    case 'ok':
      if (!filename) {
        console.error('Usage: npx tsx approve-file.ts approve <filename>');
        process.exit(1);
      }
      approveFile(filename);
      break;

    case 'reject':
    case 'deny':
      if (!filename) {
        console.error('Usage: npx tsx approve-file.ts reject <filename> --reason "reason"');
        process.exit(1);
      }
      const reasonIdx = process.argv.indexOf('--reason');
      const reason = reasonIdx > -1 ? process.argv[reasonIdx + 1] : 'Manually rejected';
      rejectFile(filename, reason);
      break;

    case 'approve-all':
    case 'ok-all':
      approveAll();
      break;

    case 'status':
    case 'stat':
      showStatus();
      break;

    case 'quarantine':
    case 'q':
      quarantineInput();
      break;

    case 'preview':
    case 'show':
      if (!filename) {
        console.error('Usage: npx tsx approve-file.ts preview <filename>');
        process.exit(1);
      }
      previewFile(filename);
      break;

    default:
      console.log('');
      console.log('Dropzone Approval CLI');
      console.log('=====================');
      console.log('');
      console.log('Usage: npx tsx approve-file.ts <command> [args]');
      console.log('');
      console.log('Commands:');
      console.log('  list                     List files awaiting approval');
      console.log('  approve <file>           Approve file (move to queue)');
      console.log('  reject <file> [--reason] Reject file (move to errors)');
      console.log('  approve-all              Approve all files in quarantine');
      console.log('  preview <file>           Preview file contents');
      console.log('  quarantine               Move input files to quarantine');
      console.log('  status                   Show dropzone status summary');
      console.log('');

      // Show current status
      showStatus();
  }
}

main();
