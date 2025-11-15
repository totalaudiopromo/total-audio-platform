/**
 * Integration Sync Services Index
 * Exports all integration sync services and related types
 */

export { BaseIntegrationSync } from './BaseIntegrationSync';
export { AirtableSyncService } from './AirtableSyncService';
export { GmailSyncService } from './GmailSyncService';

export type {
  IntegrationName,
  OAuthProvider,
  IntegrationStatus,
  SyncDirection,
  IntegrationConfig,
  SyncResult,
  OAuthTokenResponse,
  WorkspaceContact,
  IntegrationActivity,
  FieldMapping,
} from './types';

// Re-export Gmail-specific types
export type { SendPitchParams, SendPitchResult } from './GmailSyncService';
