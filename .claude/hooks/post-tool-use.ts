#!/usr/bin/env npx tsx
/**
 * Post-Tool-Use Hook
 *
 * Audit logging after tool execution completes.
 * Part of the IndyDevDan-style safety architecture.
 *
 * Actions:
 * - Log all tool usage to daily audit file
 * - Capture execution results and timing
 * - Track worktree context if active
 * - Scrub sensitive data before logging
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const SETTINGS_FILE = path.join(CLAUDE_DIR, 'settings.json');
const AUDIT_DIR = path.join(CLAUDE_DIR, 'logs', 'audit');
const DECISIONS_DIR = path.join(CLAUDE_DIR, 'logs', 'decisions');
const WORKTREE_FILE = path.join(CLAUDE_DIR, 'tmp', 'active-worktree');

// Patterns to scrub from logs
const SENSITIVE_PATTERNS = [
  {
    pattern: /ANTHROPIC_API_KEY[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'ANTHROPIC_API_KEY=***REDACTED***',
  },
  {
    pattern: /OPENAI_API_KEY[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'OPENAI_API_KEY=***REDACTED***',
  },
  {
    pattern: /SUPABASE_[A-Z_]*KEY[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'SUPABASE_KEY=***REDACTED***',
  },
  {
    pattern: /NOTION_API_KEY[=:]\s*["']?[^"'\s]+["']?/gi,
    replacement: 'NOTION_API_KEY=***REDACTED***',
  },
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, replacement: 'Bearer ***REDACTED***' },
  { pattern: /password[=:]\s*["']?[^"'\s]+["']?/gi, replacement: 'password=***REDACTED***' },
  { pattern: /secret[=:]\s*["']?[^"'\s]+["']?/gi, replacement: 'secret=***REDACTED***' },
  { pattern: /token[=:]\s*["']?[^"'\s]+["']?/gi, replacement: 'token=***REDACTED***' },
  // Email patterns (partial redaction)
  { pattern: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, replacement: '***@$2' },
];

interface ToolResult {
  tool: string;
  input: Record<string, unknown>;
  output?: string;
  error?: string;
  duration_ms?: number;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  hook: string;
  tool: string;
  input: Record<string, unknown>;
  output?: string;
  error?: string;
  duration_ms?: number;
  worktree?: string;
  session_id?: string;
}

function loadSettings(): Record<string, unknown> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch {
    // Default to safe settings
  }
  return { workflow: { audit: { enabled: true, scrubSensitive: true } } };
}

function getActiveWorktree(): string | undefined {
  try {
    if (fs.existsSync(WORKTREE_FILE)) {
      return fs.readFileSync(WORKTREE_FILE, 'utf-8').trim();
    }
  } catch {
    // No worktree
  }
  return undefined;
}

function getSessionId(): string | undefined {
  try {
    const sessionFile = path.join(CLAUDE_DIR, 'tmp', 'current-session-id.txt');
    if (fs.existsSync(sessionFile)) {
      return fs.readFileSync(sessionFile, 'utf-8').trim();
    }
  } catch {
    // No session
  }
  return undefined;
}

function scrubSensitiveData(data: unknown, settings: Record<string, unknown>): unknown {
  const auditSettings = (settings.workflow as Record<string, unknown>)?.audit as Record<
    string,
    unknown
  >;
  const shouldScrub = auditSettings?.scrubSensitive !== false;

  if (!shouldScrub) {
    return data;
  }

  if (typeof data === 'string') {
    let scrubbed = data;
    for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
      scrubbed = scrubbed.replace(pattern, replacement);
    }
    return scrubbed;
  }

  if (Array.isArray(data)) {
    return data.map(item => scrubSensitiveData(item, settings));
  }

  if (data && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Redact entire values for sensitive keys
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token') ||
        lowerKey.includes('key') ||
        lowerKey.includes('credential')
      ) {
        result[key] = '***REDACTED***';
      } else {
        result[key] = scrubSensitiveData(value, settings);
      }
    }
    return result;
  }

  return data;
}

function generateAuditId(): string {
  return crypto.randomBytes(8).toString('hex');
}

function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeAuditLog(entry: AuditEntry): void {
  const today = new Date().toISOString().split('T')[0];
  const auditFile = path.join(AUDIT_DIR, `${today}.jsonl`);

  try {
    ensureDirectoryExists(AUDIT_DIR);
    fs.appendFileSync(auditFile, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

function writeDecisionLog(entry: AuditEntry): void {
  // Only log certain tools to decisions (for debugging complex workflows)
  const decisionTools = ['Bash', 'Write', 'Edit', 'Task'];
  if (!decisionTools.includes(entry.tool)) {
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const decisionsFile = path.join(DECISIONS_DIR, `${today}.jsonl`);

  try {
    ensureDirectoryExists(DECISIONS_DIR);
    fs.appendFileSync(
      decisionsFile,
      JSON.stringify({
        id: entry.id,
        timestamp: entry.timestamp,
        tool: entry.tool,
        summary: summariseToolCall(entry),
      }) + '\n'
    );
  } catch (err) {
    console.error('Failed to write decision log:', err);
  }
}

function summariseToolCall(entry: AuditEntry): string {
  const { tool, input } = entry;

  switch (tool) {
    case 'Bash':
      return `Executed: ${(input.command as string)?.slice(0, 100) || 'unknown command'}`;
    case 'Write':
      return `Wrote file: ${input.file_path || 'unknown'}`;
    case 'Edit':
      return `Edited file: ${input.file_path || 'unknown'}`;
    case 'Read':
      return `Read file: ${input.file_path || 'unknown'}`;
    case 'Task':
      return `Spawned task: ${input.description || 'unknown'}`;
    case 'Glob':
      return `Searched: ${input.pattern || 'unknown'}`;
    case 'Grep':
      return `Searched content: ${input.pattern || 'unknown'}`;
    default:
      return `Used tool: ${tool}`;
  }
}

// Main execution
async function main(): Promise<void> {
  const settings = loadSettings();

  // Read tool result from stdin (Claude Code passes JSON)
  let inputData = '';

  if (process.stdin.isTTY) {
    // No stdin, might be testing
    console.log('Post-tool-use hook ready. Waiting for tool result input...');
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
    const toolResult: ToolResult = JSON.parse(inputData);

    // Scrub sensitive data
    const scrubbedInput = scrubSensitiveData(toolResult.input, settings) as Record<string, unknown>;
    const scrubbedOutput = toolResult.output
      ? (scrubSensitiveData(toolResult.output, settings) as string)
      : undefined;

    const entry: AuditEntry = {
      id: generateAuditId(),
      timestamp: new Date().toISOString(),
      hook: 'post-tool-use',
      tool: toolResult.tool,
      input: scrubbedInput,
      output: scrubbedOutput,
      error: toolResult.error,
      duration_ms: toolResult.duration_ms,
      worktree: getActiveWorktree(),
      session_id: getSessionId(),
    };

    // Write to audit log
    writeAuditLog(entry);

    // Write to decisions log (for key operations)
    writeDecisionLog(entry);

    // Success - exit cleanly
    process.exit(0);
  } catch (err) {
    console.error('Post-tool-use hook error:', err);
    // On error, exit cleanly (don't block)
    process.exit(0);
  }
}

main();
