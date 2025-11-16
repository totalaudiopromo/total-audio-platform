#!/usr/bin/env tsx
/**
 * Post-tool hook integration for context tracking
 * Called automatically after each tool execution
 * Usage: Called by Claude Code, not manually
 */

import { incrementCounter } from './tracker';

function main() {
  try {
    // Parse tool name from arguments
    const args = process.argv.slice(2);
    const toolName = args[0] || '';

    // Increment appropriate counter based on tool
    if (toolName === 'Read' || toolName === 'Grep' || toolName === 'Glob') {
      incrementCounter('read');
    } else if (toolName === 'Write' || toolName === 'Edit') {
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
