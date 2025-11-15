/**
 * BaseIntegrationSync
 *
 * Abstract base class for integration sync services with OAuth support
 * and workspace-scoped operations.
 *
 * Provides shared functionality for:
 * - Airtable sync
 * - Gmail sync
 * - Mailchimp sync
 * - Google Sheets sync
 *
 * Usage:
 * ```typescript
 * class AirtableSync extends BaseIntegrationSync {
 *   getIntegrationName() { return 'airtable'; }
 *   async validateCredentials() { ... }
 *   async syncToExternal(data) { ... }
 *   async syncFromExternal() { ... }
 * }
 *
 * const sync = new AirtableSync(workspaceId, supabase);
 * await sync.initialize();
 * const result = await sync.syncToExternal(contacts);
 * ```
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import type {
  IntegrationConfig,
  IntegrationName,
  SyncResult,
  SyncDirection,
  WorkspaceContact,
  OAuthTokenResponse,
  IntegrationActivity,
} from './types';
import { ErrorLogger } from '../utils/error-logger';

// Re-export SyncResult for convenience
export type { SyncResult, IntegrationConfig, IntegrationName, WorkspaceContact } from './types';

export abstract class BaseIntegrationSync {
  protected workspace_id: string;
  protected supabase: SupabaseClient<Database>;
  protected config: IntegrationConfig | null = null;
  protected initialized: boolean = false;
  protected errorLogger: ErrorLogger;

  constructor(workspace_id: string, supabase: SupabaseClient<Database>) {
    this.workspace_id = workspace_id;
    this.supabase = supabase;
    this.errorLogger = new ErrorLogger({
      isDevelopment: process.env.NODE_ENV === 'development',
      workspaceId: workspace_id,
    });
  }

  // ========================================
  // Abstract Methods (Must Implement)
  // ========================================

  /**
   * Get the integration name (e.g., 'airtable', 'gmail', 'mailchimp')
   */
  abstract getIntegrationName(): IntegrationName;

  /**
   * Validate that credentials are correct and working
   * Should make a lightweight API call to verify access
   *
   * @returns true if credentials are valid
   */
  abstract validateCredentials(): Promise<boolean>;

  /**
   * Sync data TO external service (e.g., push contacts to Airtable)
   *
   * @param data Array of contacts or records to sync
   * @returns SyncResult with success status and record counts
   */
  abstract syncToExternal(data: any[]): Promise<SyncResult>;

  /**
   * Sync data FROM external service (e.g., pull contacts from Gmail)
   *
   * @returns SyncResult with success status and record counts
   */
  abstract syncFromExternal(): Promise<SyncResult>;

  // ========================================
  // Initialization
  // ========================================

  /**
   * Initialize integration by loading config from database
   * Must be called before using sync methods
   *
   * @throws Error if integration not found or disabled
   */
  async initialize(): Promise<void> {
    try {
      this.config = await this.loadConfig();

      if (!this.config) {
        const error = new Error(
          `Integration '${this.getIntegrationName()}' not found for workspace ${this.workspace_id}`
        );
        this.errorLogger.log(error, { action: 'initialize', context: 'config_not_found' });
        throw error;
      }

      if (this.config.enabled === false) {
        const error = new Error(`Integration '${this.getIntegrationName()}' is disabled`);
        this.errorLogger.log(error, { action: 'initialize', context: 'integration_disabled' });
        throw error;
      }

      // Refresh OAuth token if expired or about to expire
      if (this.config.access_token && this.config.token_expires_at) {
        await this.ensureValidToken();
      }

      this.initialized = true;
    } catch (error) {
      this.errorLogger.logIntegrationError(error as Error, {
        integrationName: this.getIntegrationName(),
        action: 'initialize',
      });
      throw error;
    }
  }

  /**
   * Check if integration is initialized and ready
   */
  protected ensureInitialized(): void {
    if (!this.initialized || !this.config) {
      throw new Error('Integration not initialized. Call initialize() first.');
    }
  }

  // ========================================
  // Configuration Management
  // ========================================

  /**
   * Load integration config from database
   * Uses integration_connections table (existing tracker table)
   *
   * @returns IntegrationConfig or null if not found
   */
  async loadConfig(): Promise<IntegrationConfig | null> {
    try {
      // Query existing integration_connections table
      // Note: Using any to avoid deep type recursion issues with Supabase client
      const { data, error }: { data: any; error: any } = await this.supabase
        .from('integration_connections')
        .select('*')
        .eq('workspace_id', this.workspace_id)
        .eq('integration_type', this.getIntegrationName())
        .maybeSingle();

      if (error) {
        this.errorLogger.logIntegrationError(error as Error, {
          integrationName: this.getIntegrationName(),
          action: 'loadConfig',
        });
        return null;
      }

      if (!data) return null;

      // Map existing table structure to IntegrationConfig
      return {
        id: data.id,
        workspace_id: this.workspace_id,
        integration_name: this.getIntegrationName(),
        credentials: (data.credentials as Record<string, any>) || {},
        settings: (data.settings as Record<string, any>) || {},
        status: data.status as any,
        enabled: data.sync_enabled ?? true,
        error_message: data.error_message || undefined,
        error_count: data.error_count || 0,
        last_sync_at: data.last_sync_at ? new Date(data.last_sync_at) : undefined,
        sync_frequency_minutes: data.sync_frequency_minutes || undefined,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,

        // OAuth fields (if stored in credentials)
        access_token: (data.credentials as any)?.access_token,
        refresh_token: (data.credentials as any)?.refresh_token,
        token_expires_at: (data.credentials as any)?.token_expires_at
          ? new Date((data.credentials as any).token_expires_at)
          : undefined,
      };
    } catch (error) {
      this.errorLogger.logIntegrationError(error as Error, {
        integrationName: this.getIntegrationName(),
        action: 'loadConfig',
      });
      return null;
    }
  }

  /**
   * Save or update integration config in database
   *
   * @param config Partial config to update (merged with existing)
   */
  async saveConfig(config: Partial<IntegrationConfig>): Promise<void> {
    try {
      const integrationName = this.getIntegrationName();
      const now = new Date().toISOString();

      // Prepare credentials object for storage
      const credentials = {
        ...(this.config?.credentials || {}),
        ...(config.credentials || {}),
      };

      // Store OAuth tokens in credentials
      if (config.access_token) credentials.access_token = config.access_token;
      if (config.refresh_token) credentials.refresh_token = config.refresh_token;
      if (config.token_expires_at)
        credentials.token_expires_at = config.token_expires_at.toISOString();

      const updateData: any = {
        integration_type: integrationName,
        workspace_id: this.workspace_id,
        credentials,
        settings: config.settings || this.config?.settings || {},
        status: config.status || this.config?.status || 'active',
        sync_enabled: config.enabled !== undefined ? config.enabled : true,
        error_message: config.error_message,
        error_count: config.error_count || 0,
        last_sync_at: config.last_sync_at?.toISOString() || now,
        sync_frequency_minutes: config.sync_frequency_minutes || 15,
        updated_at: now,
      };

      // Upsert (insert or update)
      const { error } = await this.supabase.from('integration_connections').upsert(
        {
          ...updateData,
          created_at: this.config?.created_at?.toISOString() || now,
          // Note: user_id is still required by existing table schema
          // Will be deprecated once workspace migration is complete
          user_id: this.workspace_id,
        },
        {
          onConflict: 'workspace_id,integration_type',
        }
      );

      if (error) throw error;

      // Update local config directly to avoid recursion
      if (this.config) {
        this.config = {
          ...this.config,
          ...config,
          credentials,
          last_sync_at: config.last_sync_at || new Date(now),
          updated_at: new Date(now),
        };
      }
    } catch (error) {
      console.error(`Error saving integration config:`, error);
      throw error;
    }
  }

  // ========================================
  // OAuth Token Management
  // ========================================

  /**
   * Ensure OAuth token is valid and refresh if needed
   * Automatically refreshes if token expires within 5 minutes
   */
  protected async ensureValidToken(): Promise<void> {
    if (!this.config?.token_expires_at) return;

    const now = new Date();
    const expiresAt = new Date(this.config.token_expires_at);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Refresh if expired or expires soon
    if (expiresAt <= fiveMinutesFromNow) {
      await this.refreshOAuthToken();
    }
  }

  /**
   * Refresh OAuth access token using refresh token
   * Subclasses should override to implement provider-specific logic
   *
   * @returns New access token
   * @throws Error if refresh fails
   */
  async refreshOAuthToken(): Promise<string> {
    this.ensureInitialized();

    if (!this.config?.refresh_token) {
      throw new Error('No refresh token available. Re-authentication required.');
    }

    // Log the refresh attempt
    await this.logActivity({
      action: 'oauth_refresh_attempt',
      success: false,
      records_affected: 0,
      metadata: {
        integration_name: this.getIntegrationName(),
      },
    });

    // Subclasses must override this method
    throw new Error(
      `refreshOAuthToken() not implemented for ${this.getIntegrationName()}. Subclass must override.`
    );
  }

  /**
   * Update stored OAuth tokens after successful refresh
   *
   * @param tokenResponse OAuth token response from provider
   */
  protected async updateOAuthTokens(tokenResponse: OAuthTokenResponse): Promise<void> {
    const expiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000)
      : undefined;

    await this.saveConfig({
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token || this.config?.refresh_token,
      token_expires_at: expiresAt,
    });

    // Log successful refresh
    await this.logActivity({
      action: 'oauth_refresh_success',
      success: true,
      records_affected: 0,
      metadata: {
        expires_at: expiresAt?.toISOString(),
      },
    });
  }

  // ========================================
  // Workspace Data Access
  // ========================================

  /**
   * Get contacts from workspace_contacts_registry
   * Unified contact source across all apps
   *
   * @returns Array of workspace contacts
   */
  protected async getWorkspaceContacts(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('workspace_contacts_registry')
        .select('*')
        .eq('workspace_id', this.workspace_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching workspace contacts:', error);
      throw error;
    }
  }

  /**
   * Get contacts from specific app table (intel_contacts, pitch_contacts, etc)
   *
   * @param tableName Name of the contact table
   * @returns Array of contacts
   */
  protected async getAppContacts(tableName: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from(tableName as any)
        .select('*')
        .eq('workspace_id', this.workspace_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching contacts from ${tableName}:`, error);
      throw error;
    }
  }

  // ========================================
  // Activity Logging
  // ========================================

  /**
   * Log sync activity to integration_sync_logs table
   * Tracks all sync operations for debugging and analytics
   *
   * @param result SyncResult from sync operation
   */
  async logSyncActivity(result: SyncResult): Promise<void> {
    try {
      const { error } = await this.supabase.from('integration_sync_logs').insert({
        connection_id: this.config?.id,
        direction: result.direction,
        records_created: result.records_created || 0,
        records_updated: result.records_updated || 0,
        records_failed: result.records_failed || 0,
        errors: result.errors as any,
        duration_ms: result.duration_ms,
        started_at: result.started_at.toISOString(),
        completed_at: result.completed_at.toISOString(),
      });

      if (error) {
        console.error('Error logging sync activity:', error);
      }

      // Update last_sync_at on integration connection
      if (result.success) {
        await this.saveConfig({
          last_sync_at: result.completed_at,
          status: 'active',
          error_count: 0,
        });
      }
    } catch (error) {
      console.error('Error in logSyncActivity:', error);
    }
  }

  /**
   * Log general integration activity (OAuth refresh, config changes, etc)
   *
   * @param activity Activity details to log
   */
  protected async logActivity(
    activity: Omit<IntegrationActivity, 'workspace_id' | 'integration_name' | 'created_at'>
  ): Promise<void> {
    try {
      // Log to console for now - integration_activity table will be created by migration
      console.log('[Integration Activity]', {
        workspace_id: this.workspace_id,
        integration_name: this.getIntegrationName(),
        action: activity.action,
        success: activity.success,
        records_affected: activity.records_affected,
        error_message: activity.error_message,
        metadata: activity.metadata,
      });

      // Uncomment once migration is applied:
      // const { error } = await this.supabase.from('integration_activity').insert({
      //   workspace_id: this.workspace_id,
      //   integration_name: this.getIntegrationName(),
      //   action: activity.action,
      //   success: activity.success,
      //   records_affected: activity.records_affected,
      //   error_message: activity.error_message,
      //   metadata: activity.metadata as any,
      // });
      //
      // if (error) {
      //   console.error('Error logging activity:', error);
      // }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  }

  // ========================================
  // Error Handling
  // ========================================

  /**
   * Handle sync errors with standardized logging and status updates
   *
   * @param error Error that occurred
   * @param context Additional context for debugging
   */
  protected async handleSyncError(error: Error, context?: Record<string, any>): Promise<void> {
    console.error(`[${this.getIntegrationName()}] Sync error:`, error);

    // Increment error count
    const errorCount = (this.config?.error_count || 0) + 1;

    // Update integration status
    await this.saveConfig({
      status: errorCount >= 3 ? 'error' : 'active',
      error_message: error.message,
      error_count: errorCount,
    });

    // Log activity
    await this.logActivity({
      action: 'sync_error',
      success: false,
      records_affected: 0,
      error_message: error.message,
      metadata: {
        stack: error.stack,
        ...context,
      },
    });
  }

  /**
   * Create a failed SyncResult for error cases
   *
   * @param direction Sync direction that failed
   * @param error Error that occurred
   * @param startTime When sync started
   * @returns Failed SyncResult
   */
  protected createFailedResult(
    direction: SyncDirection,
    error: Error,
    startTime: Date
  ): SyncResult {
    const completedAt = new Date();
    return {
      success: false,
      direction,
      records_synced: 0,
      records_created: 0,
      records_updated: 0,
      records_failed: 0,
      errors: [error.message],
      duration_ms: completedAt.getTime() - startTime.getTime(),
      started_at: startTime,
      completed_at: completedAt,
    };
  }

  // ========================================
  // Utility Methods
  // ========================================

  /**
   * Get current integration status
   */
  getStatus(): string | undefined {
    return this.config?.status;
  }

  /**
   * Check if integration is enabled
   */
  isEnabled(): boolean {
    return this.config?.enabled !== false;
  }

  /**
   * Get last sync timestamp
   */
  getLastSyncAt(): Date | undefined {
    return this.config?.last_sync_at;
  }

  /**
   * Disable integration (stop syncing)
   */
  async disable(): Promise<void> {
    await this.saveConfig({
      enabled: false,
      status: 'paused',
    });
  }

  /**
   * Enable integration (resume syncing)
   */
  async enable(): Promise<void> {
    await this.saveConfig({
      enabled: true,
      status: 'active',
      error_count: 0,
      error_message: undefined,
    });
  }
}
