#!/usr/bin/env tsx

/**
 * Pre-commit cleanup script (TypeScript version)
 *
 * Organizes documentation files before commit.
 * Runs automatically via git pre-commit hook.
 *
 * Usage:
 *   tsx scripts/precommit-cleanup.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const rootDir = path.resolve(__dirname, '..');

/**
 * Check if markdown files are staged
 */
function hasStagedMarkdownFiles(): boolean {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=AM', {
      encoding: 'utf-8',
      cwd: rootDir,
    });
    return output.split('\n').some(line => line.endsWith('.md'));
  } catch {
    return false;
  }
}

/**
 * Run organize-docs script
 */
function organizeDocs(): void {
  try {
    execSync('node scripts/organize-docs.js', {
      stdio: 'inherit',
      cwd: rootDir,
    });
  } catch (error) {
    console.error('Error organizing docs:', error);
    process.exit(1);
  }
}

/**
 * Stage organized files
 */
function stageOrganizedFiles(): void {
  const pathsToStage = ['docs/', 'apps/*/docs/'];

  for (const pattern of pathsToStage) {
    try {
      execSync(`git add ${pattern}`, {
        stdio: 'ignore',
        cwd: rootDir,
      });
    } catch {
      // Path doesn't exist or already staged, skip
    }
  }
}

/**
 * Main execution
 */
function main(): void {
  if (!hasStagedMarkdownFiles()) {
    // No markdown files changed, skip
    process.exit(0);
  }

  console.log('📝 Markdown files changed, organizing docs...');

  organizeDocs();
  stageOrganizedFiles();

  console.log('✅ Docs organized and staged');
}

if (require.main === module) {
  main();
}

export { organizeDocs, stageOrganizedFiles, hasStagedMarkdownFiles };
