#!/usr/bin/env tsx
/**
 * Prompt-submit safety hook
 * Blocks potentially dangerous commands in user prompts BEFORE tool execution
 *
 * This hook runs when the user submits a prompt, allowing early detection
 * and blocking of dangerous operations before any tools are invoked.
 */

import { logDecision } from '../workflow/sessions/logger';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

/**
 * Dangerous patterns to block in user prompts
 */
const DANGEROUS_PATTERNS = [
  {
    name: 'Root filesystem deletion',
    pattern: /rm\s+(-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*|--recursive.*--force)\s+(\/|~|\$HOME)/i,
    message: 'Blocked: Attempted root filesystem deletion',
  },
  {
    name: 'Delete entire drive',
    pattern: /delete\s+\/|format\s+[Cc]:|wipe.*disk/i,
    message: 'Blocked: Attempted drive deletion',
  },
  {
    name: 'Dangerous sudo commands',
    pattern: /sudo\s+(rm|shutdown|reboot|halt|poweroff)/i,
    message: 'Blocked: Dangerous sudo command',
  },
  {
    name: 'Git hard reset',
    pattern: /git\s+reset\s+--hard\s+(HEAD~\d+|origin)/i,
    message: 'Blocked: Destructive git reset',
  },
  {
    name: 'Force push to main/master',
    pattern: /git\s+push\s+(-f|--force).*\s+(main|master)/i,
    message: 'Blocked: Force push to main/master branch',
  },
  {
    name: 'Shutdown/reboot commands',
    pattern: /shutdown|reboot|halt|poweroff/i,
    message: 'Blocked: System shutdown command',
  },
  {
    name: 'Kill all processes',
    pattern: /killall|pkill\s+-9/i,
    message: 'Blocked: Mass process termination',
  },
  {
    name: 'Chmod 777 recursively',
    pattern: /chmod\s+-R\s+777/i,
    message: 'Blocked: Recursive chmod 777 (security risk)',
  },
  {
    name: 'Curl pipe to shell',
    pattern: /curl.*\|\s*(bash|sh)/i,
    message: 'Blocked: Piping curl to shell (security risk)',
  },
];

/**
 * Check if prompt contains dangerous patterns
 */
function checkPrompt(promptText: string): {
  safe: boolean;
  blocked?: { pattern: string; message: string };
} {
  for (const { name, pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(promptText)) {
      return {
        safe: false,
        blocked: { pattern: name, message },
      };
    }
  }

  return { safe: true };
}

/**
 * Main hook execution
 */
function main() {
  try {
    // Get prompt text from arguments
    const promptText = process.argv.slice(2).join(' ');

    if (!promptText) {
      // No prompt text, allow
      process.exit(0);
    }

    // Check for dangerous patterns
    const result = checkPrompt(promptText);

    if (!result.safe && result.blocked) {
      // Log the blocked attempt
      try {
        logDecision({
          type: 'safety',
          title: 'Blocked dangerous prompt',
          description: result.blocked.message,
          reasoning: `Pattern matched: ${result.blocked.pattern}`,
          impact: 'high',
        });
      } catch {
        // Continue even if logging fails
      }

      // Print blocking message
      console.error(`\n${colors.red}🛑 SAFETY HOOK BLOCKED${colors.reset}`);
      console.error(`${colors.yellow}${result.blocked.message}${colors.reset}`);
      console.error(`${colors.yellow}Pattern: ${result.blocked.pattern}${colors.reset}\n`);
      console.error('If this command is safe and intentional, you can:');
      console.error('1. Rephrase your request to avoid the blocked pattern');
      console.error('2. Execute the command manually outside of Claude Code');
      console.error('3. Temporarily disable the hook in .claude/settings.json\n');

      // Exit with error code to block execution
      process.exit(1);
    }

    // Prompt is safe, allow execution
    process.exit(0);
  } catch (error) {
    // On error, fail safe by allowing (don't block legitimate requests)
    console.warn(`${colors.yellow}WARN: Prompt-submit hook error:${colors.reset}`, error);
    process.exit(0);
  }
}

main();
