/**
 * Safety validator - checks commands against safety rules
 */

import * as fs from 'fs';
import * as path from 'path';
import { SAFETY_RULES } from './rules';
import type { ValidationResult, Violation, ProtectedPathsConfig } from './types';

const PROTECTED_PATHS_FILE = path.join(__dirname, 'protected-paths.json');

/**
 * Load protected paths configuration
 */
export function getProtectedPaths(): ProtectedPathsConfig {
  try {
    const data = fs.readFileSync(PROTECTED_PATHS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return defaults if config missing
    return {
      paths: ['/', '/home', '/etc', '/var', '.git', 'node_modules'],
      criticalFiles: ['package.json', 'pnpm-lock.yaml', 'tsconfig.json'],
    };
  }
}

/**
 * Check if a path is protected
 */
export function isProtectedPath(filePath: string): boolean {
  const config = getProtectedPaths();

  // Check exact matches
  if (config.paths.includes(filePath)) {
    return true;
  }

  // Check if path starts with protected path
  for (const protectedPath of config.paths) {
    if (filePath.startsWith(protectedPath + '/') || filePath === protectedPath) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a file is critical
 */
export function isCriticalFile(filePath: string): boolean {
  const config = getProtectedPaths();
  const basename = path.basename(filePath);

  // Check exact filename match
  if (config.criticalFiles.includes(basename)) {
    return true;
  }

  // Check full path match
  if (config.criticalFiles.includes(filePath)) {
    return true;
  }

  return false;
}

/**
 * Validate a bash command against safety rules
 */
export function validateCommand(command: string): ValidationResult {
  const violations: Violation[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  // Check each safety rule
  for (const rule of SAFETY_RULES) {
    const match = command.match(rule.pattern);

    if (match) {
      const violation: Violation = {
        rule,
        matched: match[0],
        position: match.index,
      };

      violations.push(violation);

      if (rule.severity === 'block') {
        blockers.push(rule.message);
      } else if (rule.severity === 'warn') {
        warnings.push(rule.message);
      }
    }
  }

  const safe = blockers.length === 0;

  return {
    safe,
    violations,
    warnings,
    blockers,
  };
}

/**
 * Validate file operations (Write, Edit)
 */
export function validateFileOperation(
  operation: 'write' | 'edit',
  filePath: string
): ValidationResult {
  const warnings: string[] = [];
  const blockers: string[] = [];
  const violations: Violation[] = [];

  // Check if modifying critical file
  if (isCriticalFile(filePath)) {
    warnings.push(
      `⚠️  Modifying critical file: ${filePath}. Ensure changes are intentional.`
    );
  }

  // Check if trying to write to protected system paths
  if (isProtectedPath(filePath) && filePath.startsWith('/')) {
    blockers.push(
      `🚨 Attempted to ${operation} protected system path: ${filePath}`
    );
  }

  const safe = blockers.length === 0;

  return {
    safe,
    violations,
    warnings,
    blockers,
  };
}

/**
 * Validate any tool use
 */
export function validateToolUse(
  tool: string,
  params: Record<string, any>
): ValidationResult {
  // Bash commands
  if (tool === 'Bash' && params.command) {
    return validateCommand(params.command);
  }

  // File write operations
  if (tool === 'Write' && params.file_path) {
    return validateFileOperation('write', params.file_path);
  }

  // File edit operations
  if (tool === 'Edit' && params.file_path) {
    return validateFileOperation('edit', params.file_path);
  }

  // All other tools are safe by default
  return {
    safe: true,
    violations: [],
    warnings: [],
    blockers: [],
  };
}
