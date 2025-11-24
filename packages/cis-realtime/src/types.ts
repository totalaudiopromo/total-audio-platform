/**
 * CIS Realtime Types
 */

export interface AutosaveSnapshot {
  projectId: string;
  sessionId?: string;
  userId: string;
  snapshot: Record<string, any>;
  sizeBytes?: number;
  createdAt: string;
}

export interface ProjectSession {
  id: string;
  projectId: string;
  userId: string;
  status: 'active' | 'closed' | 'crashed';
  lastHeartbeat: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RecoveryOptions {
  projectId: string;
  userId: string;
  preferLatest?: boolean;
}

export interface RecoveryResult {
  hasRecovery: boolean;
  snapshot?: AutosaveSnapshot;
  session?: ProjectSession;
  age?: number; // milliseconds since last save
}
