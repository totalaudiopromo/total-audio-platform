#!/usr/bin/env tsx
/**
 * Pre-tool-use safety hook
 * Validates tool usage before execution
 * Called automatically by Claude Code before each tool invocation
 */

import { validateToolUse } from '../workflow/safety/validator';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

function main() {
  try {
    // Parse arguments from Claude Code
    // Format: tool-name param1=value1 param2=value2 ...
    const args = process.argv.slice(2);

    if (args.length === 0) {
      // No args, allow by default
      process.exit(0);
    }

    const tool = args[0];
    const params: Record<string, any> = {};

    // Parse params (simple key=value parsing)
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      const [key, ...valueParts] = arg.split('=');
      if (key && valueParts.length > 0) {
        params[key] = valueParts.join('=');
      }
    }

    // If it's a Bash command, the entire command might be in args[1]
    if (tool === 'Bash' && args[1]) {
      params.command = args.slice(1).join(' ');
    }

    // Validate tool use
    const result = validateToolUse(tool, params);

    // Print warnings (but allow execution)
    if (result.warnings.length > 0) {
      console.error(`${colors.yellow}⚠️  Safety Warnings:${colors.reset}`);
      result.warnings.forEach(warning => {
        console.error(`   ${warning}`);
      });
      console.error(''); // Empty line
    }

    // Block if there are blockers
    if (result.blockers.length > 0) {
      console.error(`${colors.red}🚨 BLOCKED: Dangerous operation detected${colors.reset}\n`);
      result.blockers.forEach(blocker => {
        console.error(`   ${blocker}`);
      });

      // Show suggestions if available
      const suggestedRules = result.violations.filter(v => v.rule.suggestion);
      if (suggestedRules.length > 0) {
        console.error(`\n${colors.yellow}💡 Suggestions:${colors.reset}`);
        suggestedRules.forEach(v => {
          console.error(`   ${v.rule.suggestion}`);
        });
      }

      console.error('');
      process.exit(1); // Block execution
    }

    // Safe - allow execution
    process.exit(0);
  } catch (error) {
    // On error, allow by default (fail-safe)
    console.error('Warning: Safety check error:', error);
    process.exit(0);
  }
}

main();
