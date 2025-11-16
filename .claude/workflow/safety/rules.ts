/**
 * Safety rules for detecting dangerous operations
 */

import type { SafetyRule } from './types';

export const SAFETY_RULES: SafetyRule[] = [
  // Destructive filesystem operations
  {
    name: 'Root filesystem deletion',
    pattern: /rm\s+(-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*|--recursive.*--force)\s+(\/|~\s*$)/,
    severity: 'block',
    message: 'Attempted to recursively delete root or home directory',
    category: 'destructive',
    suggestion: 'Use specific paths instead of root directories',
  },
  {
    name: 'Force deletion of system paths',
    pattern: /rm\s+-[a-zA-Z]*f[a-zA-Z]*\s+(\/etc|\/var|\/usr|\/bin|\/sbin|\/lib)/,
    severity: 'block',
    message: 'Attempted to delete critical system directories',
    category: 'destructive',
  },
  {
    name: 'Git directory deletion',
    pattern: /rm\s+-[a-zA-Z]*r[a-zA-Z]*.*\.git($|\s|\/)/,
    severity: 'block',
    message: 'Attempted to delete .git directory',
    category: 'destructive',
    suggestion: 'Use git commands instead of direct deletion',
  },

  // Security risks
  {
    name: 'Fork bomb',
    pattern: /:\(\)\s*\{\s*:\|\:&\s*\};?\s*:/,
    severity: 'block',
    message: 'Fork bomb pattern detected',
    category: 'security',
  },
  {
    name: 'Disk write operations',
    pattern: /dd\s+if=.*of=(\/dev\/|\/sys\/|\/proc\/)/,
    severity: 'block',
    message: 'Direct disk/system write operations not allowed',
    category: 'security',
  },
  {
    name: 'Filesystem creation',
    pattern: /mkfs\./,
    severity: 'block',
    message: 'Filesystem creation operations not allowed',
    category: 'security',
  },
  {
    name: 'Sudo password in command',
    pattern: /echo\s+.*\|\s*sudo\s+-S/,
    severity: 'block',
    message: 'Attempted to pass password to sudo via pipe',
    category: 'security',
  },

  // Production safety
  {
    name: 'Force push to main/master',
    pattern: /git\s+push\s+.*--force.*\s+(main|master)/,
    severity: 'block',
    message: 'Force push to main/master branch',
    category: 'production',
    suggestion: 'Use normal push or create a new branch',
  },
  {
    name: 'Hard reset on main/master',
    pattern: /git\s+reset\s+--hard.*\s+(main|master)/,
    severity: 'block',
    message: 'Hard reset on main/master branch',
    category: 'production',
  },
  {
    name: 'Delete remote branch',
    pattern: /git\s+push\s+.*--delete\s+(main|master|production|prod)/,
    severity: 'block',
    message: 'Attempted to delete protected remote branch',
    category: 'production',
  },

  // Data operations
  {
    name: 'Database drop',
    pattern: /DROP\s+(DATABASE|TABLE|SCHEMA)/i,
    severity: 'warn',
    message: 'SQL DROP statement detected',
    category: 'data',
    suggestion: 'Verify this is intentional and have backups',
  },
  {
    name: 'Truncate table',
    pattern: /TRUNCATE\s+TABLE/i,
    severity: 'warn',
    message: 'SQL TRUNCATE statement detected',
    category: 'data',
  },

  // Node modules and dependencies
  {
    name: 'Delete node_modules at root',
    pattern: /rm\s+-rf\s+\/.*node_modules/,
    severity: 'block',
    message: 'Attempted to delete node_modules from root',
    category: 'destructive',
    suggestion: 'Use pnpm clean or target specific directory',
  },

  // Environment and secrets
  {
    name: 'Echo secrets to file',
    pattern: /echo\s+.*(?:API_KEY|SECRET|PASSWORD|TOKEN).*>\s*[^>]/,
    severity: 'warn',
    message: 'Potential secret being written to file',
    category: 'security',
    suggestion: 'Use environment variables or secret management',
  },

  // System modifications
  {
    name: 'Shutdown/reboot',
    pattern: /(shutdown|reboot|init\s+[06])/,
    severity: 'block',
    message: 'System shutdown/reboot commands not allowed',
    category: 'destructive',
  },
];
