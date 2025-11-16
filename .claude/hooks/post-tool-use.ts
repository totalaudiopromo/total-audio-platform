#!/usr/bin/env tsx
/**
 * Post-tool-use hook
 * Logs tool execution and updates context tracking
 * Called automatically by Claude Code after each tool invocation
 */

import { logToolExecution } from '../workflow/audit/logger';
import { incrementCounter } from '../workflow/context/tracker';

function main() {
  try {
    // Parse arguments from Claude Code
    const args = process.argv.slice(2);

    if (args.length === 0) {
      process.exit(0);
    }

    const tool = args[0];
    const params: Record<string, any> = {};

    // Parse params
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      const [key, ...valueParts] = arg.split('=');
      if (key && valueParts.length > 0) {
        params[key] = valueParts.join('=');
      }
    }

    // For Bash commands, capture full command
    if (tool === 'Bash' && args[1]) {
      params.command = args.slice(1).join(' ');
    }

    // Log tool execution
    logToolExecution({
      tool,
      params,
      result: 'success',
    });

    // Update context tracking
    if (tool === 'Read' || tool === 'Grep' || tool === 'Glob') {
      incrementCounter('read');
    } else if (tool === 'Write' || tool === 'Edit') {
      incrementCounter('write');
    } else {
      incrementCounter('tool');
    }

    // Silent success
    process.exit(0);
  } catch (error) {
    // Fail silently - never crash
    process.exit(0);
  }
}

main();
