#!/usr/bin/env npx tsx
/**
 * Worktree Manager
 *
 * Git worktree management for safe automation isolation.
 * Part of the IndyDevDan-style workflow for preventing cross-branch contamination.
 *
 * Features:
 * - Create worktrees for automation tasks
 * - Track active worktree context
 * - Clean up stale worktrees
 * - Enforce worktree boundaries in hooks
 *
 * Usage:
 *   npx tsx worktree-manager.ts list
 *   npx tsx worktree-manager.ts create automation/intel-batch-001
 *   npx tsx worktree-manager.ts activate <path>
 *   npx tsx worktree-manager.ts cleanup
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { AuditLogger } from '../../workflow/audit-logger';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const TMP_DIR = path.join(CLAUDE_DIR, 'tmp');
const WORKTREES_DIR = path.join(PROJECT_ROOT, '..', 'total-audio-worktrees');
const ACTIVE_WORKTREE_FILE = path.join(TMP_DIR, 'active-worktree');

const logger = new AuditLogger();

export interface WorktreeInfo {
  path: string;
  branch: string;
  commit: string;
  isActive: boolean;
  isPrunable: boolean;
}

/**
 * Execute git command and return output
 */
function git(args: string, cwd?: string): string {
  try {
    return execSync(`git ${args}`, {
      cwd: cwd || PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    const error = err as { stderr?: Buffer; message?: string };
    throw new Error(error.stderr?.toString() || error.message || 'Git command failed');
  }
}

/**
 * Check if git is available and we're in a repo
 */
function checkGitRepo(): boolean {
  try {
    git('rev-parse --git-dir');
    return true;
  } catch {
    return false;
  }
}

/**
 * List all worktrees
 */
export function listWorktrees(): WorktreeInfo[] {
  if (!checkGitRepo()) {
    console.error('Not a git repository');
    return [];
  }

  const activeWorktree = getActiveWorktree();
  const output = git('worktree list --porcelain');
  const worktrees: WorktreeInfo[] = [];

  let current: Partial<WorktreeInfo> = {};

  for (const line of output.split('\n')) {
    if (line.startsWith('worktree ')) {
      if (current.path) {
        current.isActive = current.path === activeWorktree;
        worktrees.push(current as WorktreeInfo);
      }
      current = { path: line.replace('worktree ', ''), isPrunable: false };
    } else if (line.startsWith('HEAD ')) {
      current.commit = line.replace('HEAD ', '').slice(0, 8);
    } else if (line.startsWith('branch ')) {
      current.branch = line.replace('branch refs/heads/', '');
    } else if (line === 'prunable') {
      current.isPrunable = true;
    } else if (line.startsWith('detached')) {
      current.branch = '(detached)';
    }
  }

  if (current.path) {
    current.isActive = current.path === activeWorktree;
    worktrees.push(current as WorktreeInfo);
  }

  return worktrees;
}

/**
 * Create a new worktree
 */
export function createWorktree(branchName: string, baseBranch = 'main'): string | null {
  if (!checkGitRepo()) {
    console.error('Not a git repository');
    return null;
  }

  // Ensure worktrees directory exists
  if (!fs.existsSync(WORKTREES_DIR)) {
    fs.mkdirSync(WORKTREES_DIR, { recursive: true });
  }

  // Sanitise branch name for path
  const safeName = branchName.replace(/[^a-zA-Z0-9-_]/g, '-');
  const worktreePath = path.join(WORKTREES_DIR, safeName);

  // Check if path already exists
  if (fs.existsSync(worktreePath)) {
    console.error(`Worktree path already exists: ${worktreePath}`);
    return null;
  }

  try {
    // Create new branch and worktree
    git(`worktree add -b ${branchName} "${worktreePath}" ${baseBranch}`);

    logger.info('workflow', 'worktree-created', {
      branch: branchName,
      path: worktreePath,
      baseBranch,
    });

    console.log(`✓ Created worktree: ${worktreePath}`);
    console.log(`  Branch: ${branchName}`);
    console.log(`  Base: ${baseBranch}`);

    return worktreePath;
  } catch (err) {
    console.error(`Failed to create worktree: ${err}`);
    logger.error('workflow', 'worktree-create-failed', {
      branch: branchName,
      error: String(err),
    });
    return null;
  }
}

/**
 * Create worktree from existing branch
 */
export function createWorktreeFromBranch(branchName: string): string | null {
  if (!checkGitRepo()) {
    console.error('Not a git repository');
    return null;
  }

  // Ensure worktrees directory exists
  if (!fs.existsSync(WORKTREES_DIR)) {
    fs.mkdirSync(WORKTREES_DIR, { recursive: true });
  }

  const safeName = branchName.replace(/[^a-zA-Z0-9-_]/g, '-');
  const worktreePath = path.join(WORKTREES_DIR, safeName);

  if (fs.existsSync(worktreePath)) {
    console.error(`Worktree path already exists: ${worktreePath}`);
    return null;
  }

  try {
    git(`worktree add "${worktreePath}" ${branchName}`);

    logger.info('workflow', 'worktree-created', {
      branch: branchName,
      path: worktreePath,
    });

    console.log(`✓ Created worktree: ${worktreePath}`);
    console.log(`  Branch: ${branchName}`);

    return worktreePath;
  } catch (err) {
    console.error(`Failed to create worktree: ${err}`);
    return null;
  }
}

/**
 * Remove a worktree
 */
export function removeWorktree(worktreePath: string, force = false): boolean {
  if (!checkGitRepo()) {
    console.error('Not a git repository');
    return false;
  }

  try {
    const args = force ? 'worktree remove --force' : 'worktree remove';
    git(`${args} "${worktreePath}"`);

    // Clear active worktree if it was this one
    if (getActiveWorktree() === worktreePath) {
      clearActiveWorktree();
    }

    logger.info('workflow', 'worktree-removed', { path: worktreePath, force });

    console.log(`✓ Removed worktree: ${worktreePath}`);
    return true;
  } catch (err) {
    console.error(`Failed to remove worktree: ${err}`);
    return false;
  }
}

/**
 * Prune stale worktree entries
 */
export function pruneWorktrees(): number {
  if (!checkGitRepo()) {
    console.error('Not a git repository');
    return 0;
  }

  const before = listWorktrees().length;

  try {
    git('worktree prune');
    const after = listWorktrees().length;
    const pruned = before - after;

    if (pruned > 0) {
      logger.info('workflow', 'worktrees-pruned', { count: pruned });
      console.log(`✓ Pruned ${pruned} stale worktree entries`);
    }

    return pruned;
  } catch (err) {
    console.error(`Failed to prune worktrees: ${err}`);
    return 0;
  }
}

/**
 * Get active worktree path
 */
export function getActiveWorktree(): string | undefined {
  try {
    if (fs.existsSync(ACTIVE_WORKTREE_FILE)) {
      return fs.readFileSync(ACTIVE_WORKTREE_FILE, 'utf-8').trim();
    }
  } catch {
    // No active worktree
  }
  return undefined;
}

/**
 * Set active worktree
 */
export function setActiveWorktree(worktreePath: string): boolean {
  // Verify worktree exists
  const worktrees = listWorktrees();
  const found = worktrees.find(w => w.path === worktreePath);

  if (!found) {
    console.error(`Worktree not found: ${worktreePath}`);
    return false;
  }

  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
    fs.writeFileSync(ACTIVE_WORKTREE_FILE, worktreePath);

    logger.info('workflow', 'worktree-activated', {
      path: worktreePath,
      branch: found.branch,
    });

    console.log(`✓ Active worktree set to: ${worktreePath}`);
    console.log(`  Branch: ${found.branch}`);
    return true;
  } catch (err) {
    console.error(`Failed to set active worktree: ${err}`);
    return false;
  }
}

/**
 * Clear active worktree
 */
export function clearActiveWorktree(): void {
  if (fs.existsSync(ACTIVE_WORKTREE_FILE)) {
    fs.unlinkSync(ACTIVE_WORKTREE_FILE);
    logger.info('workflow', 'worktree-deactivated', {});
    console.log('✓ Active worktree cleared');
  }
}

/**
 * Check if a path is within the active worktree
 */
export function isPathInActiveWorktree(testPath: string): boolean {
  const activeWorktree = getActiveWorktree();

  // If no active worktree, default to main repo
  if (!activeWorktree) {
    return testPath.startsWith(PROJECT_ROOT);
  }

  const normalised = path.resolve(testPath);
  return normalised.startsWith(activeWorktree);
}

/**
 * Print worktree list
 */
function printWorktrees(): void {
  const worktrees = listWorktrees();
  const activeWorktree = getActiveWorktree();

  if (worktrees.length === 0) {
    console.log('No worktrees found');
    return;
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                         Git Worktrees                              ║');
  console.log('╠════════════════════════════════════════════════════════════════════╣');

  for (const wt of worktrees) {
    const activeMarker = wt.isActive ? ' ★' : '  ';
    const prunableMarker = wt.isPrunable ? ' [prunable]' : '';
    const branch = wt.branch || '(detached)';

    console.log(
      `║${activeMarker} ${branch.padEnd(30).slice(0, 30)} ${wt.commit || '--------'}${prunableMarker.padEnd(20)} ║`
    );
    console.log(`║    ${wt.path.slice(0, 62).padEnd(62)} ║`);
    console.log('╟────────────────────────────────────────────────────────────────────╢');
  }

  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (activeWorktree) {
    console.log(`★ Active worktree: ${activeWorktree}`);
  } else {
    console.log('No active worktree set (using main repository)');
  }
  console.log('');
}

/**
 * Clean up all automation worktrees
 */
function cleanupAutomationWorktrees(): void {
  const worktrees = listWorktrees();
  const automationWorktrees = worktrees.filter(
    w => w.path.includes('total-audio-worktrees') || w.branch?.startsWith('automation/')
  );

  if (automationWorktrees.length === 0) {
    console.log('No automation worktrees to clean up');
    return;
  }

  console.log(`Found ${automationWorktrees.length} automation worktrees:`);

  for (const wt of automationWorktrees) {
    console.log(`  Removing: ${wt.branch} (${wt.path})`);
    removeWorktree(wt.path, true);
  }

  pruneWorktrees();
  console.log('Cleanup complete');
}

// CLI interface
function main(): void {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];

  switch (command) {
    case 'list':
    case 'ls':
      printWorktrees();
      break;

    case 'create':
      if (!arg1) {
        console.error('Usage: npx tsx worktree-manager.ts create <branch-name> [base-branch]');
        process.exit(1);
      }
      createWorktree(arg1, arg2 || 'main');
      break;

    case 'add':
      // Add worktree from existing branch
      if (!arg1) {
        console.error('Usage: npx tsx worktree-manager.ts add <existing-branch>');
        process.exit(1);
      }
      createWorktreeFromBranch(arg1);
      break;

    case 'remove':
    case 'rm':
      if (!arg1) {
        console.error('Usage: npx tsx worktree-manager.ts remove <path> [--force]');
        process.exit(1);
      }
      const force = process.argv.includes('--force') || process.argv.includes('-f');
      removeWorktree(arg1, force);
      break;

    case 'activate':
    case 'use':
      if (!arg1) {
        console.error('Usage: npx tsx worktree-manager.ts activate <path>');
        process.exit(1);
      }
      setActiveWorktree(arg1);
      break;

    case 'deactivate':
    case 'clear':
      clearActiveWorktree();
      break;

    case 'prune':
      pruneWorktrees();
      break;

    case 'cleanup':
      cleanupAutomationWorktrees();
      break;

    case 'check':
      // Check if path is in active worktree
      if (!arg1) {
        console.error('Usage: npx tsx worktree-manager.ts check <path>');
        process.exit(1);
      }
      if (isPathInActiveWorktree(arg1)) {
        console.log('✓ Path is within active worktree');
        process.exit(0);
      } else {
        console.log('✗ Path is OUTSIDE active worktree');
        process.exit(1);
      }
      break;

    default:
      console.log('');
      console.log('Worktree Manager');
      console.log('================');
      console.log('');
      console.log('Usage: npx tsx worktree-manager.ts <command> [args]');
      console.log('');
      console.log('Commands:');
      console.log('  list                       List all worktrees');
      console.log('  create <branch> [base]     Create new worktree with new branch');
      console.log('  add <branch>               Add worktree from existing branch');
      console.log('  remove <path> [--force]    Remove a worktree');
      console.log('  activate <path>            Set active worktree for automation');
      console.log('  deactivate                 Clear active worktree');
      console.log('  prune                      Remove stale worktree entries');
      console.log('  cleanup                    Remove all automation worktrees');
      console.log('  check <path>               Check if path is in active worktree');
      console.log('');

      printWorktrees();
  }
}

main();
