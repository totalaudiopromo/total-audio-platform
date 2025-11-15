# Integration Sync System

Shared base class and types for building workspace-scoped integration sync services across Airtable, Gmail, Mailchimp, and other external services.

## Features

- **Workspace-Scoped**: All operations are scoped to a specific workspace
- **OAuth Support**: Built-in token management with automatic refresh
- **Error Handling**: Standardized error logging and retry logic
- **Activity Logging**: Track all sync operations for debugging and analytics
- **Type-Safe**: Full TypeScript support with strict typing

## Usage

### Basic Implementation

```typescript
import { BaseIntegrationSync, type SyncResult } from '@total-audio/core-db/integrations';
import type { SupabaseClient } from '@supabase/supabase-js';

class AirtableSync extends BaseIntegrationSync {
  getIntegrationName() {
    return 'airtable' as const;
  }

  async validateCredentials(): Promise<boolean> {
    try {
      // Make a lightweight API call to verify credentials
      const apiKey = this.config?.credentials?.api_key;
      if (!apiKey) return false;

      // Example: Check Airtable API access
      const response = await fetch('https://api.airtable.com/v0/meta/bases', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      return response.ok;
    } catch (error) {
      console.error('Credential validation failed:', error);
      return false;
    }
  }

  async syncToExternal(contacts: any[]): Promise<SyncResult> {
    const startTime = new Date();

    try {
      this.ensureInitialized();

      const baseId = this.config?.settings?.base_id;
      const tableId = this.config?.settings?.table_id;

      if (!baseId || !tableId) {
        throw new Error('Airtable base and table must be configured');
      }

      // Sync logic here...
      const created = 0;
      const updated = 0;
      const failed = 0;

      const result: SyncResult = {
        success: true,
        direction: 'to_external',
        records_synced: created + updated,
        records_created: created,
        records_updated: updated,
        records_failed: failed,
        errors: [],
        duration_ms: Date.now() - startTime.getTime(),
        started_at: startTime,
        completed_at: new Date(),
      };

      await this.logSyncActivity(result);
      return result;
    } catch (error) {
      await this.handleSyncError(error as Error);
      return this.createFailedResult('to_external', error as Error, startTime);
    }
  }

  async syncFromExternal(): Promise<SyncResult> {
    const startTime = new Date();

    try {
      this.ensureInitialized();

      // Fetch records from Airtable...
      const records: any[] = [];

      const result: SyncResult = {
        success: true,
        direction: 'from_external',
        records_synced: records.length,
        records_created: records.length,
        records_updated: 0,
        records_failed: 0,
        errors: [],
        duration_ms: Date.now() - startTime.getTime(),
        started_at: startTime,
        completed_at: new Date(),
      };

      await this.logSyncActivity(result);
      return result;
    } catch (error) {
      await this.handleSyncError(error as Error);
      return this.createFailedResult('from_external', error as Error, startTime);
    }
  }
}

// Usage
const sync = new AirtableSync(workspaceId, supabase);
await sync.initialize();

// Push contacts to Airtable
const contacts = await sync.getWorkspaceContacts();
const result = await sync.syncToExternal(contacts);

console.log(`Synced ${result.records_synced} contacts`);
```

### OAuth-Based Integration (Gmail, Mailchimp)

```typescript
import { BaseIntegrationSync, type SyncResult } from '@total-audio/core-db/integrations';

class GmailSync extends BaseIntegrationSync {
  getIntegrationName() {
    return 'gmail' as const;
  }

  async validateCredentials(): Promise<boolean> {
    try {
      // Validate OAuth token by making a test request
      const accessToken = this.config?.access_token;
      if (!accessToken) return false;

      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Override refreshOAuthToken with Gmail-specific logic
  async refreshOAuthToken(): Promise<string> {
    this.ensureInitialized();

    if (!this.config?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      // Exchange refresh token for new access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: this.config.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh Gmail OAuth token');
      }

      const tokens = await response.json();
      await this.updateOAuthTokens(tokens);

      return tokens.access_token;
    } catch (error) {
      await this.logActivity({
        action: 'oauth_refresh_failed',
        success: false,
        records_affected: 0,
        error_message: (error as Error).message,
      });
      throw error;
    }
  }

  async syncToExternal(pitches: any[]): Promise<SyncResult> {
    const startTime = new Date();

    try {
      this.ensureInitialized();
      await this.ensureValidToken();

      // Send pitches via Gmail API...
      const sent = 0;

      const result: SyncResult = {
        success: true,
        direction: 'to_external',
        records_synced: sent,
        records_created: sent,
        errors: [],
        duration_ms: Date.now() - startTime.getTime(),
        started_at: startTime,
        completed_at: new Date(),
      };

      await this.logSyncActivity(result);
      return result;
    } catch (error) {
      await this.handleSyncError(error as Error);
      return this.createFailedResult('to_external', error as Error, startTime);
    }
  }

  async syncFromExternal(): Promise<SyncResult> {
    // Fetch replies from Gmail...
    return this.createFailedResult('from_external', new Error('Not implemented'), new Date());
  }
}
```

## Configuration

### Initial Setup

```typescript
// 1. Create integration record in database
const { data: integration } = await supabase
  .from('integration_connections')
  .insert({
    workspace_id: workspaceId,
    integration_type: 'airtable',
    credentials: {
      api_key: 'your-api-key',
    },
    settings: {
      base_id: 'appXXXXXXXXXXXXXX',
      table_id: 'tblXXXXXXXXXXXXXX',
    },
    sync_enabled: true,
  })
  .select()
  .single();

// 2. Initialize sync service
const sync = new AirtableSync(workspaceId, supabase);
await sync.initialize();

// 3. Validate credentials
const isValid = await sync.validateCredentials();
if (!isValid) {
  throw new Error('Invalid Airtable credentials');
}

// 4. Run sync
const result = await sync.syncToExternal(contacts);
```

### OAuth Setup (Gmail/Mailchimp)

```typescript
// 1. Store OAuth tokens
await supabase.from('integration_connections').insert({
  workspace_id: workspaceId,
  integration_type: 'gmail',
  credentials: {
    access_token: 'ya29.a0AfH6SMBxxx...',
    refresh_token: '1//0xxx...',
    token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  },
  sync_enabled: true,
});

// 2. Initialize and use
const sync = new GmailSync(workspaceId, supabase);
await sync.initialize(); // Automatically refreshes token if expired

const result = await sync.syncToExternal(pitches);
```

## Database Tables

### integration_connections

Stores integration configurations and credentials per workspace.

```sql
CREATE TABLE integration_connections (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  integration_type TEXT NOT NULL, -- 'airtable', 'gmail', 'mailchimp'
  credentials JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### integration_sync_logs

Tracks all sync operations for debugging and analytics.

```sql
CREATE TABLE integration_sync_logs (
  id UUID PRIMARY KEY,
  connection_id UUID REFERENCES integration_connections(id),
  direction TEXT NOT NULL, -- 'to_external', 'from_external'
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  duration_ms INTEGER,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
```

### integration_activity

Logs OAuth refreshes, config changes, and other activities.

```sql
CREATE TABLE integration_activity (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  integration_name VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  success BOOLEAN NOT NULL,
  records_affected INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## API Reference

### BaseIntegrationSync

Abstract base class for all integration sync services.

#### Constructor

```typescript
constructor(workspace_id: string, supabase: SupabaseClient<Database>)
```

#### Abstract Methods (Must Implement)

- `getIntegrationName()` - Return integration identifier
- `validateCredentials()` - Verify credentials are valid
- `syncToExternal(data)` - Push data to external service
- `syncFromExternal()` - Fetch data from external service

#### Protected Methods

- `loadConfig()` - Load integration config from database
- `saveConfig(config)` - Save/update integration config
- `ensureValidToken()` - Check and refresh OAuth token if needed
- `refreshOAuthToken()` - Refresh OAuth access token (override in subclass)
- `updateOAuthTokens(tokens)` - Update stored OAuth tokens
- `getWorkspaceContacts()` - Fetch workspace contacts
- `getAppContacts(tableName)` - Fetch app-specific contacts
- `logSyncActivity(result)` - Log sync operation
- `logActivity(activity)` - Log general activity
- `handleSyncError(error)` - Handle and log sync errors
- `createFailedResult(direction, error, startTime)` - Create failed SyncResult

#### Public Methods

- `initialize()` - Initialize integration (must call first)
- `getStatus()` - Get current integration status
- `isEnabled()` - Check if integration is enabled
- `getLastSyncAt()` - Get last sync timestamp
- `disable()` - Disable integration
- `enable()` - Enable integration

## Types

### SyncResult

```typescript
interface SyncResult {
  success: boolean;
  direction: 'to_external' | 'from_external' | 'bidirectional';
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
```

### IntegrationConfig

```typescript
interface IntegrationConfig {
  id?: string;
  workspace_id: string;
  integration_name: IntegrationName;
  oauth_provider?: 'google' | 'mailchimp' | null;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: Date;
  api_key?: string;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  status?: 'active' | 'paused' | 'error' | 'disconnected';
  enabled?: boolean;
  error_message?: string;
  error_count?: number;
  last_sync_at?: Date;
  sync_frequency_minutes?: number;
  created_at?: Date;
  updated_at?: Date;
}
```

## Error Handling

The base class provides standardized error handling:

- Errors are caught and logged to `integration_activity` table
- Error count is incremented on each failure
- After 3 consecutive failures, status changes to 'error'
- Failed sync operations return `SyncResult` with `success: false`

```typescript
try {
  const result = await sync.syncToExternal(contacts);
  if (!result.success) {
    console.error('Sync failed:', result.errors);
  }
} catch (error) {
  // Errors are already logged by BaseIntegrationSync
  console.error('Sync threw exception:', error);
}
```

## Migration

Apply the migration to create workspace-scoped integration tables:

```bash
# Apply migration
cd packages/core-db
supabase migration apply 20251120000006_workspace_integrations.sql
```

This adds:

- `workspace_id` column to `integration_connections`
- `integration_activity` table for activity logging
- Helper functions for querying integration status
- Updated RLS policies for workspace access control
