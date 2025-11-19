#!/usr/bin/env tsx
/**
 * Dropzone approval CLI
 * Approve or reject files in quarantine
 *
 * Usage:
 *   dz approve <filename>    - Move from quarantine to queue
 *   dz reject <filename>     - Move from quarantine to errors
 *   dz list                  - List files in quarantine
 *
 * Safety: Defaults to dry-run mode unless --live flag is provided
 */

import { readdirSync, renameSync, existsSync, statSync } from 'fs';
import { join } from 'path';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

const QUARANTINE_DIR = '.claude/dropzones/quarantine';
const QUEUE_DIR = '.claude/dropzones/queue'; // Approved files go here
const ERRORS_DIR = '.claude/dropzones/errors'; // Rejected files go here

interface ApprovalOptions {
  dryRun: boolean;
  verbose: boolean;
}

/**
 * List files in quarantine
 */
function listQuarantine(): void {
  if (!existsSync(QUARANTINE_DIR)) {
    console.log(`${colors.yellow}Quarantine directory does not exist${colors.reset}`);
    return;
  }

  const files = readdirSync(QUARANTINE_DIR).filter((f) => {
    const stats = statSync(join(QUARANTINE_DIR, f));
    return stats.isFile();
  });

  if (files.length === 0) {
    console.log(`${colors.gray}No files in quarantine${colors.reset}`);
    return;
  }

  console.log(`${colors.cyan}📋 Files in Quarantine:${colors.reset}\n`);
  files.forEach((file, i) => {
    const path = join(QUARANTINE_DIR, file);
    const stats = statSync(path);
    const size = (stats.size / 1024).toFixed(2);
    const date = stats.mtime.toISOString().split('T')[0];

    console.log(`  ${i + 1}. ${colors.cyan}${file}${colors.reset}`);
    console.log(`     ${colors.gray}${size} KB | Added: ${date}${colors.reset}`);
  });

  console.log(`\n${colors.gray}Total: ${files.length} file(s)${colors.reset}`);
  console.log(`\n${colors.yellow}Use 'dz approve <filename>' to approve${colors.reset}`);
}

/**
 * Approve a file - move from quarantine to queue
 */
function approveFile(filename: string, options: ApprovalOptions): void {
  const sourcePath = join(QUARANTINE_DIR, filename);
  const destPath = join(QUEUE_DIR, filename);

  // Validation
  if (!existsSync(sourcePath)) {
    console.error(`${colors.red}ERROR:${colors.reset} File not found in quarantine: ${filename}`);
    console.log(`${colors.gray}Use 'dz list' to see available files${colors.reset}`);
    process.exit(1);
  }

  // Dry-run mode
  if (options.dryRun) {
    console.log(`${colors.yellow}[DRY RUN]${colors.reset} Would approve: ${filename}`);
    console.log(`${colors.gray}  From: ${sourcePath}${colors.reset}`);
    console.log(`${colors.gray}  To:   ${destPath}${colors.reset}`);
    console.log(`\n${colors.yellow}Use --live to actually move the file${colors.reset}`);
    return;
  }

  // Live mode - actually move the file
  try {
    renameSync(sourcePath, destPath);
    console.log(`${colors.green}✅ Approved:${colors.reset} ${filename}`);
    console.log(`${colors.gray}   Moved to queue for processing${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}ERROR:${colors.reset} Failed to approve file:`, error);
    process.exit(1);
  }
}

/**
 * Reject a file - move from quarantine to errors
 */
function rejectFile(filename: string, options: ApprovalOptions): void {
  const sourcePath = join(QUARANTINE_DIR, filename);
  const destPath = join(ERRORS_DIR, filename);

  // Validation
  if (!existsSync(sourcePath)) {
    console.error(`${colors.red}ERROR:${colors.reset} File not found in quarantine: ${filename}`);
    console.log(`${colors.gray}Use 'dz list' to see available files${colors.reset}`);
    process.exit(1);
  }

  // Dry-run mode
  if (options.dryRun) {
    console.log(`${colors.yellow}[DRY RUN]${colors.reset} Would reject: ${filename}`);
    console.log(`${colors.gray}  From: ${sourcePath}${colors.reset}`);
    console.log(`${colors.gray}  To:   ${destPath}${colors.reset}`);
    console.log(`\n${colors.yellow}Use --live to actually move the file${colors.reset}`);
    return;
  }

  // Live mode - actually move the file
  try {
    renameSync(sourcePath, destPath);
    console.log(`${colors.red}❌ Rejected:${colors.reset} ${filename}`);
    console.log(`${colors.gray}   Moved to errors directory${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}ERROR:${colors.reset} Failed to reject file:`, error);
    process.exit(1);
  }
}

/**
 * Show usage help
 */
function showHelp(): void {
  console.log(`${colors.cyan}Dropzone Approval CLI${colors.reset}\n`);
  console.log('Usage:');
  console.log(`  ${colors.green}dz list${colors.reset}                    List files in quarantine`);
  console.log(
    `  ${colors.green}dz approve${colors.reset} <filename>       Approve file (dry-run by default)`
  );
  console.log(
    `  ${colors.green}dz reject${colors.reset} <filename>        Reject file (dry-run by default)`
  );
  console.log(`  ${colors.green}dz approve${colors.reset} <filename> --live  Actually move file to queue`);
  console.log(`  ${colors.green}dz reject${colors.reset} <filename> --live   Actually move file to errors\n`);
  console.log('Options:');
  console.log(`  ${colors.yellow}--live${colors.reset}      Execute the move (default is dry-run)`);
  console.log(`  ${colors.yellow}--verbose${colors.reset}   Show detailed output\n`);
}

/**
 * Main CLI entry point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  const filename = args[1];
  const dryRun = !args.includes('--live'); // Default to dry-run for safety
  const verbose = args.includes('--verbose');

  const options: ApprovalOptions = { dryRun, verbose };

  switch (command) {
    case 'list':
    case 'ls':
      listQuarantine();
      break;

    case 'approve':
      if (!filename) {
        console.error(`${colors.red}ERROR:${colors.reset} Filename required`);
        console.log(`Usage: dz approve <filename> [--live]`);
        process.exit(1);
      }
      approveFile(filename, options);
      break;

    case 'reject':
      if (!filename) {
        console.error(`${colors.red}ERROR:${colors.reset} Filename required`);
        console.log(`Usage: dz reject <filename> [--live]`);
        process.exit(1);
      }
      rejectFile(filename, options);
      break;

    default:
      console.error(`${colors.red}ERROR:${colors.reset} Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main();
