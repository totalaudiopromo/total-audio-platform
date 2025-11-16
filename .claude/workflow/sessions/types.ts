/**
 * Type definitions for session decision tracking
 */

export interface Decision {
  id: string;
  timestamp: string; // ISO 8601
  sessionId: string;
  type: 'architectural' | 'implementation' | 'bug-fix' | 'refactor' | 'feature' | 'configuration';
  title: string;
  description: string;
  reasoning: string;
  alternatives?: string[];
  impact?: 'low' | 'medium' | 'high';
  relatedFiles?: string[];
  tags?: string[];
}

export interface SessionSummary {
  sessionId: string;
  startTime: string;
  endTime?: string;
  decisions: Decision[];
  filesModified: string[];
  filesRead: string[];
  contextResets: number;
  totalCommands: number;
  branch?: string;
}

export interface DecisionFilter {
  sessionId?: string;
  type?: Decision['type'];
  dateFrom?: string;
  dateTo?: string;
  tag?: string;
}
