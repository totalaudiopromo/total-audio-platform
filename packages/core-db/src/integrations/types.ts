/**
 * Integration Types
 *
 * Shared TypeScript interfaces for integration sync services
 * across Airtable, Gmail, and Mailchimp integrations.
 */

export type IntegrationName = 'airtable' | 'gmail' | 'mailchimp' | 'google_sheets' | 'excel';
export type OAuthProvider = 'google' | 'mailchimp' | null;
export type IntegrationStatus = 'active' | 'paused' | 'error' | 'disconnected';
export type SyncDirection = 'to_external' | 'from_external' | 'bidirectional';

/**
 * Integration configuration stored in database
 * Maps to both new and legacy integration_connections table structures
 */
export interface IntegrationConfig {
  id?: string;
  workspace_id: string;
  integration_name: IntegrationName;
  oauth_provider?: OAuthProvider;

  // OAuth tokens
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: Date;

  // Alternative: API key auth
  api_key?: string;

  // Integration-specific credentials and settings
  credentials: Record<string, any>;
  settings: Record<string, any>;

  // Status tracking
  status?: IntegrationStatus;
  enabled?: boolean;
  error_message?: string;
  error_count?: number;

  // Sync metadata
  last_sync_at?: Date;
  sync_frequency_minutes?: number;

  // Audit timestamps
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Result of a sync operation
 * Includes success status, record counts, and error details
 */
export interface SyncResult {
  success: boolean;
  direction: SyncDirection;
  records_synced: number;
  records_created?: number;
  records_updated?: number;
  records_failed?: number;
  errors: string[];
  duration_ms?: number;
  started_at: Date;
  completed_at: Date;
  metadata?: Record<string, any>;
}

/**
 * OAuth token response from provider
 */
export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number; // seconds until expiry
  token_type?: string;
  scope?: string;
}

/**
 * Contact data from workspace_contacts_registry
 * Unified contact format across all apps
 */
export interface WorkspaceContact {
  id: string;
  workspace_id: string;
  email: string;
  name?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  tags?: string[];
  metadata?: Record<string, any>;

  // Cross-app references
  intel_contact_id?: string;
  pitch_contact_id?: string;
  tracker_contact_id?: string;

  created_at: Date;
  updated_at: Date;
}

/**
 * Integration activity log entry
 * Tracks all sync operations for debugging and analytics
 */
export interface IntegrationActivity {
  id?: string;
  workspace_id: string;
  integration_name: IntegrationName;
  action: string;
  success: boolean;
  records_affected: number;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

/**
 * Field mapping configuration
 * Maps workspace fields to external service fields
 */
export interface FieldMapping {
  id?: string;
  connection_id: string;
  workspace_field: string;
  external_field: string;
  transform_rules?: Record<string, any>;
  sync_direction?: SyncDirection;
  enabled?: boolean;
}
