#!/usr/bin/env npx tsx
/**
 * Pre-Tool-Use Hook
 *
 * Validates tool calls before execution to prevent dangerous operations.
 * Part of the IndyDevDan-style safety architecture.
 *
 * Checks:
 * - Denylist patterns (rm -rf, force push, etc.)
 * - File boundary enforcement (stay within project)
 * - Worktree isolation (if active)
 * - Kill-switch status
 * - Dry-run mode logging
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const SETTINGS_FILE = path.join(CLAUDE_DIR, 'settings.json');
const AUDIT_DIR = path.join(CLAUDE_DIR, 'logs', 'audit');
const KILL_SWITCH_FILE = path.join(CLAUDE_DIR, 'tmp', 'kill-switch');

// Dangerous command patterns (denylist)
const DENY_PATTERNS = [
  // Destructive file operations
  /rm\s+-rf\s+\//, // rm -rf /
  /rm\s+-rf\s+~\//, // rm -rf ~/
  /rm\s+-rf\s+\.\./, // rm -rf ..
  /rm\s+-rf\s+\*$/, // rm -rf *
  />\s*\/dev\/sd[a-z]/, // Overwrite disk devices
  /dd\s+if=.*of=\/dev/, // dd to devices

  // Git force operations
  /git\s+push\s+.*--force/, // git push --force
  /git\s+push\s+-f\s+/, // git push -f
  /git\s+reset\s+--hard\s+origin/, // git reset --hard origin
  /git\s+clean\s+-fd/, // git clean -fd

  // Environment exposure
  /echo\s+\$[A-Z_]+.*>>/, // Append env vars to files
  /printenv\s*>>/, // Dump env to files
  /env\s*>>/, // Dump env to files

  // System modifications
  /chmod\s+-R\s+777/, // World-writable recursively
  /chown\s+-R\s+root/, // Change ownership to root
  /sudo\s+rm\s+-rf/, // sudo rm -rf

  // Network/Security risks
  /curl.*\|\s*bash/, // Pipe curl to bash
  /wget.*\|\s*sh/, // Pipe wget to sh
  /nc\s+-l/, // Netcat listener
];

// Sensitive file patterns (warn but don't block)
const SENSITIVE_PATTERNS = [
  /\.env($|\.)/,
  /credentials/i,
  /secret/i,
  /private_key/,
  /\.pem$/,
  /\.key$/,
];

// Allowed directories (file operations must stay within these)
const ALLOWED_ROOTS = [
  PROJECT_ROOT,
  '/tmp',
  '/var/folders', // macOS temp
];

interface ToolCall {
  tool: string;
  input: Record<string, unknown>;
}

interface ValidationResult {
  allowed: boolean;
  reason?: string;
  warnings: string[];
}

function loadSettings(): Record<string, unknown> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch {
    // Default to safe settings
  }
  return { workflow: { safety: { enabled: true } } };
}

function isKillSwitchActive(): boolean {
  // Check environment variable first
  if (process.env.DROPZONE_DISABLE === '1') {
    return true;
  }
  // Check kill-switch file
  if (fs.existsSync(KILL_SWITCH_FILE)) {
    return true;
  }
  return false;
}

function isDryRunMode(): boolean {
  return process.env.DROPZONE_LIVE !== '1';
}

function isPathAllowed(filePath: string): boolean {
  if (!filePath) return true;

  const normalised = path.resolve(filePath);
  return ALLOWED_ROOTS.some(root => normalised.startsWith(root));
}

function checkDenyPatterns(command: string): string | null {
  for (const pattern of DENY_PATTERNS) {
    if (pattern.test(command)) {
      return `Matches deny pattern: ${pattern.source}`;
    }
  }
  return null;
}

function checkSensitivePatterns(filePath: string): string | null {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(filePath)) {
      return `Accessing sensitive file: ${filePath}`;
    }
  }
  return null;
}

function validateToolCall(toolCall: ToolCall): ValidationResult {
  const warnings: string[] = [];

  // Check kill-switch first
  if (isKillSwitchActive()) {
    return {
      allowed: false,
      reason: 'Kill-switch is active (DROPZONE_DISABLE=1). All tool operations blocked.',
      warnings,
    };
  }

  const { tool, input } = toolCall;

  // Validate Bash commands
  if (tool === 'Bash') {
    const command = (input.command as string) || '';

    // Check against deny patterns
    const denyReason = checkDenyPatterns(command);
    if (denyReason) {
      return {
        allowed: false,
        reason: denyReason,
        warnings,
      };
    }
  }

  // Validate file operations
  if (tool === 'Read' || tool === 'Write' || tool === 'Edit') {
    const filePath = (input.file_path as string) || (input.path as string) || '';

    // Check path is within allowed roots
    if (!isPathAllowed(filePath)) {
      return {
        allowed: false,
        reason: `File path outside allowed directories: ${filePath}`,
        warnings,
      };
    }

    // Warn about sensitive files (but allow)
    const sensitiveWarning = checkSensitivePatterns(filePath);
    if (sensitiveWarning) {
      warnings.push(sensitiveWarning);
    }
  }

  // Validate Glob/Grep patterns
  if (tool === 'Glob' || tool === 'Grep') {
    const searchPath = (input.path as string) || '';
    if (searchPath && !isPathAllowed(searchPath)) {
      return {
        allowed: false,
        reason: `Search path outside allowed directories: ${searchPath}`,
        warnings,
      };
    }
  }

  return { allowed: true, warnings };
}

function logAudit(toolCall: ToolCall, result: ValidationResult): void {
  const today = new Date().toISOString().split('T')[0];
  const auditFile = path.join(AUDIT_DIR, `${today}.jsonl`);

  const entry = {
    timestamp: new Date().toISOString(),
    hook: 'pre-tool-use',
    tool: toolCall.tool,
    input: toolCall.input,
    result: {
      allowed: result.allowed,
      reason: result.reason,
      warnings: result.warnings,
    },
    dryRun: isDryRunMode(),
  };

  try {
    // Ensure audit directory exists
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    }
    fs.appendFileSync(auditFile, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

// Main execution
async function main(): Promise<void> {
  // Read tool call from stdin (Claude Code passes JSON)
  let inputData = '';

  if (process.stdin.isTTY) {
    // No stdin, might be testing
    console.log('Pre-tool-use hook ready. Waiting for tool call input...');
    return;
  }

  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  if (!inputData.trim()) {
    // No input, exit cleanly
    process.exit(0);
  }

  try {
    const toolCall: ToolCall = JSON.parse(inputData);
    const result = validateToolCall(toolCall);

    // Always log to audit trail
    logAudit(toolCall, result);

    // If dry-run mode, log but allow
    if (isDryRunMode() && !result.allowed) {
      console.log(`[DRY-RUN] Would block: ${result.reason}`);
      process.exit(0);
    }

    // Output warnings
    for (const warning of result.warnings) {
      console.error(`[WARNING] ${warning}`);
    }

    if (!result.allowed) {
      console.error(`[BLOCKED] ${result.reason}`);
      process.exit(1);
    }

    // Allow the operation
    process.exit(0);
  } catch (err) {
    console.error('Pre-tool-use hook error:', err);
    // On error, default to allowing (fail-open for usability)
    process.exit(0);
  }
}

main();
