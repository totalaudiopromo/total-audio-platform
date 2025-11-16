/**
 * Session decision logger
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';
import type { Decision, SessionSummary } from './types';

const DECISIONS_DIR = '.claude/logs/decisions';
const SESSIONS_DIR = '.claude/logs/sessions';

/**
 * Generate a unique decision ID
 */
export function generateDecisionId(): string {
  return `decision-${Date.now()}-${randomBytes(4).toString('hex')}`;
}

/**
 * Get current session ID
 */
export function getSessionId(): string {
  // Try environment variable first
  if (process.env.CLAUDE_SESSION_ID) {
    return process.env.CLAUDE_SESSION_ID;
  }

  // Try to read from temp file
  const sessionFile = '.claude/tmp/current-session-id.txt';
  if (fs.existsSync(sessionFile)) {
    return fs.readFileSync(sessionFile, 'utf-8').trim();
  }

  // Generate new session ID
  const newSessionId = `session-${Date.now()}`;

  // Save for this session
  const dir = path.dirname(sessionFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(sessionFile, newSessionId);

  return newSessionId;
}

/**
 * Log a decision
 */
export function logDecision(decision: Omit<Decision, 'id' | 'timestamp' | 'sessionId'>): Decision {
  try {
    // Ensure directories exist
    if (!fs.existsSync(DECISIONS_DIR)) {
      fs.mkdirSync(DECISIONS_DIR, { recursive: true });
    }

    const completeDecision: Decision = {
      id: generateDecisionId(),
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      ...decision,
    };

    // Append to today's decisions log
    const date = new Date().toISOString().split('T')[0];
    const logPath = path.join(DECISIONS_DIR, `${date}.jsonl`);
    const logLine = JSON.stringify(completeDecision) + '\n';

    fs.appendFileSync(logPath, logLine, 'utf-8');

    return completeDecision;
  } catch (error) {
    // Fail silently
    throw error;
  }
}

/**
 * Read decisions from log
 */
export function readDecisions(date: string): Decision[] {
  try {
    const logPath = path.join(DECISIONS_DIR, `${date}.jsonl`);

    if (!fs.existsSync(logPath)) {
      return [];
    }

    const content = fs.readFileSync(logPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter((decision): decision is Decision => decision !== null);
  } catch (error) {
    return [];
  }
}

/**
 * Get all decisions for a session
 */
export function getSessionDecisions(sessionId: string): Decision[] {
  const decisionsDir = DECISIONS_DIR;

  if (!fs.existsSync(decisionsDir)) {
    return [];
  }

  const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.jsonl'));
  const allDecisions: Decision[] = [];

  for (const file of files) {
    const date = file.replace('.jsonl', '');
    const decisions = readDecisions(date);
    allDecisions.push(...decisions.filter(d => d.sessionId === sessionId));
  }

  return allDecisions;
}

/**
 * Initialize a session
 */
export function initSession(): SessionSummary {
  try {
    const sessionId = getSessionId();

    // Ensure sessions directory exists
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }

    const summary: SessionSummary = {
      sessionId,
      startTime: new Date().toISOString(),
      decisions: [],
      filesModified: [],
      filesRead: [],
      contextResets: 0,
      totalCommands: 0,
    };

    // Save initial session summary
    const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(summary, null, 2));

    return summary;
  } catch (error) {
    throw error;
  }
}

/**
 * Update session summary
 */
export function updateSession(updates: Partial<SessionSummary>): void {
  try {
    const sessionId = getSessionId();
    const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);

    let summary: SessionSummary;

    if (fs.existsSync(sessionFile)) {
      summary = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
    } else {
      summary = initSession();
    }

    // Merge updates
    Object.assign(summary, updates);

    // Save updated summary
    fs.writeFileSync(sessionFile, JSON.stringify(summary, null, 2));
  } catch (error) {
    // Fail silently
  }
}
