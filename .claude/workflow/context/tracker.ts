/**
 * Context usage tracker - monitors file reads, writes, and session duration
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ContextUsage, ContextAnalysis, ContextConfig } from './types';

const USAGE_FILE = '.claude/tmp/context-usage.json';
const CONFIG_FILE = '.claude/workflow/context/config.json';

/**
 * Get current context usage from disk
 */
export function getUsage(): ContextUsage {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = fs.readFileSync(USAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    // If file is corrupted or missing, return fresh usage
  }

  // Initialize new usage
  const newUsage: ContextUsage = {
    fileReads: 0,
    fileWrites: 0,
    toolCalls: 0,
    sessionStart: Date.now(),
    lastUpdate: Date.now(),
  };

  // Ensure directory exists
  const dir = path.dirname(USAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save initial usage
  fs.writeFileSync(USAGE_FILE, JSON.stringify(newUsage, null, 2));

  return newUsage;
}

/**
 * Increment a usage counter
 */
export function incrementCounter(type: 'read' | 'write' | 'tool'): void {
  try {
    const usage = getUsage();

    if (type === 'read') {
      usage.fileReads++;
    } else if (type === 'write') {
      usage.fileWrites++;
    } else if (type === 'tool') {
      usage.toolCalls++;
    }

    usage.lastUpdate = Date.now();

    // Ensure directory exists
    const dir = path.dirname(USAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (error) {
    // Fail silently - never crash
  }
}

/**
 * Reset usage counters
 */
export function resetUsage(): void {
  try {
    const newUsage: ContextUsage = {
      fileReads: 0,
      fileWrites: 0,
      toolCalls: 0,
      sessionStart: Date.now(),
      lastUpdate: Date.now(),
    };

    const dir = path.dirname(USAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(USAGE_FILE, JSON.stringify(newUsage, null, 2));
  } catch (error) {
    // Fail silently
  }
}

/**
 * Load configuration
 */
export function getConfig(): ContextConfig {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return defaults if config missing
    return {
      enabled: true,
      thresholds: {
        maxFileReads: 50,
        maxFileWrites: 30,
        maxSessionMinutes: 120,
      },
      reminderFile: '.claude/CONTEXT_RESET_RECOMMENDED.md',
    };
  }
}

/**
 * Analyze context usage and determine if reset is needed
 */
export function analyzeContext(): ContextAnalysis {
  const usage = getUsage();
  const config = getConfig();

  const reasons: string[] = [];
  const recommendations: string[] = [];

  // Calculate session duration in minutes
  const sessionDurationMs = Date.now() - usage.sessionStart;
  const sessionMinutes = Math.floor(sessionDurationMs / 1000 / 60);

  // Check against thresholds
  if (usage.fileReads >= config.thresholds.maxFileReads) {
    reasons.push(
      `High file read count: ${usage.fileReads} reads (threshold: ${config.thresholds.maxFileReads})`
    );
    recommendations.push('Context window is filling with file content');
  }

  if (usage.fileWrites >= config.thresholds.maxFileWrites) {
    reasons.push(
      `High file write count: ${usage.fileWrites} writes (threshold: ${config.thresholds.maxFileWrites})`
    );
    recommendations.push('Many file modifications may lead to context confusion');
  }

  if (sessionMinutes >= config.thresholds.maxSessionMinutes) {
    reasons.push(
      `Long session duration: ${sessionMinutes} minutes (threshold: ${config.thresholds.maxSessionMinutes})`
    );
    recommendations.push('Extended sessions can lead to degraded performance');
  }

  const shouldSuggestReset = reasons.length > 0;

  if (shouldSuggestReset) {
    recommendations.push('Type `/clear` to reset context and improve performance');
    recommendations.push(
      'Save important conversation history before clearing'
    );
  }

  return {
    shouldSuggestReset,
    reasons,
    usage,
    recommendations,
  };
}
