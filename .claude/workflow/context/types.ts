/**
 * Type definitions for context usage tracking and analysis
 */

export interface ContextUsage {
  fileReads: number;
  fileWrites: number;
  toolCalls: number;
  sessionStart: number; // Unix timestamp
  lastUpdate: number; // Unix timestamp
}

export interface ContextAnalysis {
  shouldSuggestReset: boolean;
  reasons: string[];
  usage: ContextUsage;
  recommendations: string[];
}

export interface ContextConfig {
  enabled: boolean;
  thresholds: {
    maxFileReads: number;
    maxFileWrites: number;
    maxSessionMinutes: number;
  };
  reminderFile: string;
}

export interface ContextResetRecommendation {
  severity: 'low' | 'medium' | 'high';
  message: string;
  metrics: {
    fileReads: number;
    fileWrites: number;
    sessionMinutes: number;
  };
}
