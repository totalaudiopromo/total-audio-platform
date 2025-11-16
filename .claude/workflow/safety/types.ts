/**
 * Type definitions for safety validation system
 */

export type SafetySeverity = 'block' | 'warn';
export type SafetyCategory = 'destructive' | 'security' | 'production' | 'data';

export interface SafetyRule {
  name: string;
  pattern: RegExp;
  severity: SafetySeverity;
  message: string;
  category: SafetyCategory;
  suggestion?: string;
}

export interface Violation {
  rule: SafetyRule;
  matched: string;
  position?: number;
}

export interface ValidationResult {
  safe: boolean;
  violations: Violation[];
  warnings: string[];
  blockers: string[];
}

export interface ProtectedPathsConfig {
  paths: string[];
  criticalFiles: string[];
}
