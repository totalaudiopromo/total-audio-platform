#!/usr/bin/env npx tsx
/**
 * Prompt Submit Hook
 *
 * Intercepts user prompts before processing to block dangerous commands.
 * Part of the IndyDevDan-style safety architecture.
 *
 * Blocks:
 * - rm -rf with dangerous paths
 * - Force push to main/master
 * - Environment variable exposure
 * - Credential file operations
 * - System-level destructive commands
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const AUDIT_DIR = path.join(CLAUDE_DIR, 'logs', 'audit');
const KILL_SWITCH_FILE = path.join(CLAUDE_DIR, 'tmp', 'kill-switch');

// Dangerous request patterns (absolute blocks)
const BLOCK_PATTERNS = [
  {
    pattern: /delete\s+(all|everything|the\s+entire)/i,
    message: 'Refusing request to delete everything. Be more specific about what to delete.',
  },
  {
    pattern: /rm\s+-rf\s+[\/~]/i,
    message: 'Refusing destructive rm -rf command with root or home path.',
  },
  {
    pattern: /force\s+push\s+(to\s+)?(main|master)/i,
    message: 'Refusing force push to main/master branch. Use a feature branch instead.',
  },
  {
    pattern: /git\s+push\s+--force\s+(origin\s+)?(main|master)/i,
    message: 'Refusing force push to main/master branch.',
  },
  {
    pattern: /expose\s+(the\s+)?(api\s+)?keys?/i,
    message: 'Refusing to expose API keys or secrets.',
  },
  {
    pattern: /print\s+(all\s+)?(env|environment)\s+var/i,
    message: 'Refusing to print environment variables (may contain secrets).',
  },
  {
    pattern: /send\s+.*(password|secret|credential)/i,
    message: 'Refusing to send sensitive credentials.',
  },
  {
    pattern: /drop\s+(the\s+)?database/i,
    message: 'Refusing to drop database. This requires manual confirmation.',
  },
  {
    pattern: /truncate\s+all\s+tables/i,
    message: 'Refusing to truncate all tables. This requires manual confirmation.',
  },
  {
    pattern: /disable\s+(all\s+)?security/i,
    message: 'Refusing to disable security measures.',
  },
  {
    pattern: /bypass\s+(the\s+)?(safety|security)/i,
    message: 'Refusing to bypass safety controls.',
  },
];

// Warning patterns (proceed with caution)
const WARN_PATTERNS = [
  {
    pattern: /deploy\s+to\s+production/i,
    message: 'Production deployment requested. Ensure all tests pass first.',
  },
  {
    pattern: /reset\s+(--)?hard/i,
    message: 'Hard reset requested. This will discard uncommitted changes.',
  },
  {
    pattern: /\.env/i,
    message: 'Operation involves .env files. Be careful with sensitive data.',
  },
  {
    pattern: /credential|secret|password/i,
    message: 'Operation may involve credentials. Ensure nothing is logged or exposed.',
  },
];

interface PromptInput {
  prompt: string;
  context?: Record<string, unknown>;
}

interface ValidationResult {
  allowed: boolean;
  message?: string;
  warnings: string[];
}

function isKillSwitchActive(): boolean {
  if (process.env.DROPZONE_DISABLE === '1') {
    return true;
  }
  if (fs.existsSync(KILL_SWITCH_FILE)) {
    return true;
  }
  return false;
}

function validatePrompt(input: PromptInput): ValidationResult {
  const warnings: string[] = [];
  const { prompt } = input;

  // Check kill-switch first
  if (isKillSwitchActive()) {
    return {
      allowed: false,
      message:
        'Kill-switch is active (DROPZONE_DISABLE=1). All operations blocked. Remove kill-switch to proceed.',
      warnings,
    };
  }

  // Check against block patterns
  for (const { pattern, message } of BLOCK_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        allowed: false,
        message,
        warnings,
      };
    }
  }

  // Check against warn patterns
  for (const { pattern, message } of WARN_PATTERNS) {
    if (pattern.test(prompt)) {
      warnings.push(message);
    }
  }

  return { allowed: true, warnings };
}

function logPromptAudit(input: PromptInput, result: ValidationResult): void {
  const today = new Date().toISOString().split('T')[0];
  const auditFile = path.join(AUDIT_DIR, `${today}.jsonl`);

  const entry = {
    timestamp: new Date().toISOString(),
    hook: 'prompt-submit',
    prompt_length: input.prompt.length,
    prompt_preview: input.prompt.slice(0, 100) + (input.prompt.length > 100 ? '...' : ''),
    result: {
      allowed: result.allowed,
      message: result.message,
      warnings: result.warnings,
    },
  };

  try {
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    }
    fs.appendFileSync(auditFile, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.error('Failed to write prompt audit log:', err);
  }
}

// Main execution
async function main(): Promise<void> {
  // Read prompt from stdin
  let inputData = '';

  if (process.stdin.isTTY) {
    console.log('Prompt submit hook ready. Waiting for prompt input...');
    return;
  }

  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  if (!inputData.trim()) {
    process.exit(0);
  }

  try {
    const promptInput: PromptInput = JSON.parse(inputData);
    const result = validatePrompt(promptInput);

    // Log to audit trail
    logPromptAudit(promptInput, result);

    // Output warnings
    for (const warning of result.warnings) {
      console.error(`[WARNING] ${warning}`);
    }

    if (!result.allowed) {
      console.error(`[BLOCKED] ${result.message}`);
      // Return the block message as JSON for Claude Code to display
      console.log(
        JSON.stringify({
          blocked: true,
          message: result.message,
        })
      );
      process.exit(1);
    }

    // Allow the prompt
    process.exit(0);
  } catch (err) {
    console.error('Prompt submit hook error:', err);
    // On error, default to allowing (fail-open)
    process.exit(0);
  }
}

main();
