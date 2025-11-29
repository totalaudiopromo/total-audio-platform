# Gmail Integration Refactor - Complete Implementation

**Date**: 2025-11-15
**Status**: Complete - Ready for Testing

## Overview

Refactored Gmail integration from user-scoped to **workspace-scoped**using the new `BaseIntegrationSync` pattern. This enables multi-user workspaces to share Gmail connections and provides automatic OAuth token refresh, sync logging, and workspace-scoped email tracking.

---

## What Was Created

### 1. Base Integration Sync Class

**File**: `/packages/core-db/src/integrations/BaseIntegrationSync.ts`

**Purpose**: Abstract base class providing shared OAuth, logging, and workspace operations for all integrations.

**Features**:

- Automatic OAuth token refresh (5-minute buffer)
- Workspace-scoped configuration storage
- Sync logging with detailed metrics
- Error handling and retry logic
- Workspace-scoped query helpers

**Usage Pattern**:

```typescript
abstract class BaseIntegrationSync {
  abstract getIntegrationName(): string;
  abstract validateCredentials(): Promise<boolean>;
  abstract syncToExternal(data: any[]): Promise<SyncResult>;
  abstract syncFromExternal(): Promise<SyncResult>;
}
```

---

### 2. Gmail Sync Service

**File**: `/packages/core-db/src/integrations/GmailSyncService.ts`

**Purpose**: Workspace-scoped Gmail integration extending BaseIntegrationSync.

**Features**:

- Send pitches via Gmail API
- Track email threads for reply detection
- Automatic token refresh
- Workspace branding (signature, from_email)
- HTML email formatting

**Key Methods**:

```typescript
class GmailSyncService extends BaseIntegrationSync {
  async sendPitch(params: SendPitchParams): Promise<SendPitchResult>;
  async syncToExternal(pitches: any[]): Promise<SyncResult>;
  async syncFromExternal(): Promise<SyncResult>;
  async getConnectionStatus(): Promise<{ connected: boolean; email?: string }>;
}
```

**Example Usage**:

```typescript
import { GmailSyncService } from '@total-audio/core-db';

const gmail = new GmailSyncService(workspaceId);

// Send a pitch email
await gmail.sendPitch({
  to: 'contact@example.com',
  subject: 'New Track Submission',
  body: 'Hi, I have a new track...',
  pitchId: 'uuid',
  contactId: 'uuid',
});

// Check for replies
const result = await gmail.syncFromExternal();
console.log(`Found ${result.recordsSynced} replies`);
```

---

### 3. Database Migration

**File**: `/packages/core-db/supabase/migrations/20251115000001_workspace_integrations.sql`

**Creates**:

#### Table: `integrations`

Workspace-scoped integration configurations (replaces user-scoped `integration_connections`).

```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_name TEXT NOT NULL, -- 'gmail', 'google_sheets', etc.
  oauth_provider TEXT, -- 'google', 'mailchimp', etc.
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  credentials JSONB, -- { client_id, client_secret }
  settings JSONB, -- { signature, from_email, track_responses }
  status TEXT DEFAULT 'active', -- 'active', 'error', 'disconnected'
  error_message TEXT,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(workspace_id, integration_name)
);
```

#### Table: `integration_sync_logs`

Tracks all sync operations for debugging and analytics.

```sql
CREATE TABLE integration_sync_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_name TEXT NOT NULL,
  sync_type TEXT NOT NULL, -- 'send_pitches', 'check_replies'
  status TEXT NOT NULL, -- 'success', 'error', 'partial'
  records_processed INTEGER DEFAULT 0,
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

#### Table: `pitch_email_tracking`

Tracks sent pitch emails and reply detection.

```sql
CREATE TABLE pitch_email_tracking (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  pitch_id UUID REFERENCES pitches(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES pitch_contacts(id) ON DELETE SET NULL,
  gmail_message_id VARCHAR(255) UNIQUE,
  gmail_thread_id VARCHAR(255),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  bounced BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:

- `idx_integrations_workspace_id` - Fast workspace lookups
- `idx_email_tracking_replied_at` - Fast reply status checks
- `idx_email_tracking_thread_id` - Thread-based reply detection

**RLS Policies**:

- Workspace members can view integrations
- Workspace admins can manage integrations
- All sync logs and email tracking scoped to workspace members

---

### 4. Refactored API Routes

#### OAuth Connect (Initiate)

**File**: `/apps/pitch-generator/app/api/integrations/gmail/connect/route-refactored.ts`

**Changes**:

- Gets user's workspace_id from `workspace_members` table
- Stores PKCE state in workspace-scoped `integrations` table
- Uses workspace_id for OAuth state verification

#### OAuth Callback

**File**: `/apps/pitch-generator/app/api/integrations/gmail/callback/route-refactored.ts`

**Changes**:

- Verifies state token using workspace-scoped config
- Stores OAuth tokens in `integrations` table with workspace_id
- Stores credentials and settings in JSONB fields

#### Send Email

**File**: `/apps/pitch-generator/app/api/integrations/gmail/send/route-refactored.ts`

**Changes**:

- Uses `GmailSyncService` instead of direct Gmail API calls
- Automatically handles token refresh
- Tracks emails in `pitch_email_tracking` table
- Returns structured result with messageId and threadId

#### Connection Status

**File**: `/apps/pitch-generator/app/api/integrations/gmail/status/route-refactored.ts`

**Changes**:

- Uses `GmailSyncService.getConnectionStatus()`
- Returns workspace-scoped connection info
- Includes connected email address

#### Check Replies (NEW)

**File**: `/apps/pitch-generator/app/api/integrations/gmail/check-replies/route.ts`

**Purpose**: Sync FROM Gmail to detect email replies.

**Usage**:

```bash
POST /api/integrations/gmail/check-replies

Response:
{
  "success": true,
  "repliesFound": 3,
  "totalChecked": 15,
  "errors": [],
  "metadata": { "repliesFound": 3 }
}
```

---

## Configuration Storage Format

### OAuth Tokens

Stored in `integrations` table:

```json
{
  "workspace_id": "uuid",
  "integration_name": "gmail",
  "oauth_provider": "google",
  "access_token": "ya29.xxx",
  "refresh_token": "1//xxx",
  "token_expires_at": "2025-11-16T12:00:00Z",
  "credentials": {
    "client_id": "xxx.apps.googleusercontent.com",
    "client_secret": "GOCSPX-xxx"
  },
  "settings": {
    "send_from_email": "user@example.com",
    "signature": "Best regards,\nYour Name",
    "track_responses": true,
    "auto_follow_up": false
  },
  "status": "active"
}
```

---

## Migration Path

### From Existing User-Scoped System

The migration SQL includes a commented-out data migration helper:

```sql
-- Migration helper: Copy existing user-scoped connections to workspace-scoped
DO $$
BEGIN
  INSERT INTO integrations (workspace_id, integration_name, access_token, refresh_token, token_expires_at, status, created_at)
  SELECT
    w.id as workspace_id,
    ic.integration_type as integration_name,
    ic.access_token,
    ic.refresh_token,
    ic.token_expires_at,
    ic.status,
    ic.created_at
  FROM integration_connections ic
  JOIN workspaces w ON w.owner_id = ic.user_id
  WHERE ic.status = 'active'
  ON CONFLICT (workspace_id, integration_name) DO NOTHING;
END $$;
```

**To run migration**:

1. Apply the migration SQL
2. Uncomment the migration helper
3. Run against production database
4. Verify workspace members can access integrations
5. Archive old `integration_connections` table

---

## Testing Checklist

### OAuth Flow

- [ ] Click "Connect Gmail" button
- [ ] Redirected to Google OAuth consent screen
- [ ] Grant permissions
- [ ] Redirected back to app with success message
- [ ] `integrations` table has active Gmail connection
- [ ] Connection scoped to workspace_id

### Send Email

- [ ] Send pitch email via `/api/integrations/gmail/send`
- [ ] Email received in Gmail inbox
- [ ] `pitch_email_tracking` record created
- [ ] Pitch status updated to "sent"
- [ ] Email includes workspace signature

### Reply Detection

- [ ] Reply to pitch email in Gmail
- [ ] Call `/api/integrations/gmail/check-replies`
- [ ] Reply detected and `replied_at` timestamp set
- [ ] Pitch status updated to "replied"

### Token Refresh

- [ ] Wait for token to expire (or manually expire)
- [ ] Send email (should trigger refresh)
- [ ] New access_token saved to database
- [ ] Email still sends successfully

### Workspace Scoping

- [ ] Create second workspace
- [ ] Connect Gmail to second workspace
- [ ] Both workspaces have separate Gmail connections
- [ ] User in workspace A cannot see workspace B's emails

---

## Environment Variables Required

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com" # For client-side

# Base URL for OAuth redirects
NEXT_PUBLIC_BASE_URL="https://pitch.totalaudiopromo.com"
```

---

## Next Steps

### 1. Deploy Migration

```bash
cd packages/core-db
npx supabase migration up
```

### 2. Replace Old Routes

Rename refactored routes:

```bash
cd apps/pitch-generator/app/api/integrations/gmail

# Backup old routes
mv connect/route.ts connect/route-OLD.ts
mv callback/route.ts callback/route-OLD.ts
mv send/route.ts send/route-OLD.ts
mv status/route.ts status/route-OLD.ts

# Activate refactored routes
mv connect/route-refactored.ts connect/route.ts
mv callback/route-refactored.ts callback/route.ts
mv send/route-refactored.ts send/route.ts
mv status/route-refactored.ts status/route.ts
```

### 3. Update Frontend Components

Update Gmail connection UI to use workspace-scoped status:

```typescript
// Before
const { data } = await fetch('/api/integrations/gmail/status');

// After (same endpoint, workspace-scoped internally)
const { data } = await fetch('/api/integrations/gmail/status');
// Returns: { connected: true, email: 'user@gmail.com' }
```

### 4. Test with Real Gmail Account

1. Connect real Gmail account
2. Send test pitch email
3. Reply to pitch from Gmail
4. Run check-replies endpoint
5. Verify reply detection works

---

## Benefits of Refactor

### Before (User-Scoped)

- Each user had separate Gmail connection
- No token refresh automation
- No sync logging
- Manual error handling
- User-scoped tracking only

### After (Workspace-Scoped)

- Workspace members share Gmail connection
- Automatic OAuth token refresh (5-min buffer)
- Comprehensive sync logging with metrics
- Standardised error handling and retry logic
- Workspace-scoped email tracking
- Extensible pattern for other integrations (Sheets, Mailchimp, etc.)

---

## Architecture Improvements

### Code Organisation

```
packages/core-db/
 src/integrations/
    BaseIntegrationSync.ts     ← Shared base class
    GmailSyncService.ts        ← Gmail implementation
    AirtableSyncService.ts     ← Future: Airtable
    index.ts                   ← Exports
```

### Reusability

All integrations (Gmail, Sheets, Mailchimp, Airtable) can extend `BaseIntegrationSync` and inherit:

- OAuth token management
- Sync logging
- Error handling
- Workspace operations

### Type Safety

All integration services are fully typed with TypeScript:

- `SyncResult` - Standardised sync operation results
- `IntegrationConfig` - Type-safe configuration
- `SendPitchParams` - Gmail-specific types

---

## Files Summary

### New Core Files

1. `/packages/core-db/src/integrations/BaseIntegrationSync.ts` - 282 lines
2. `/packages/core-db/src/integrations/GmailSyncService.ts` - 457 lines
3. `/packages/core-db/supabase/migrations/20251115000001_workspace_integrations.sql` - 164 lines

### Refactored API Routes

4. `/apps/pitch-generator/app/api/integrations/gmail/connect/route-refactored.ts` - 97 lines
5. `/apps/pitch-generator/app/api/integrations/gmail/callback/route-refactored.ts` - 155 lines
6. `/apps/pitch-generator/app/api/integrations/gmail/send/route-refactored.ts` - 89 lines
7. `/apps/pitch-generator/app/api/integrations/gmail/status/route-refactored.ts` - 54 lines

### New API Routes

8. `/apps/pitch-generator/app/api/integrations/gmail/check-replies/route.ts` - 70 lines

### Updated Exports

9. `/packages/core-db/src/integrations/index.ts` - Updated to export Gmail service
10. `/packages/core-db/src/index.ts` - Updated to re-export integrations

**Total**: 10 files, ~1,370 lines of production code

---

## Conclusion

The Gmail integration has been successfully refactored from user-scoped to workspace-scoped using the BaseIntegrationSync pattern. This provides:

1. **Better Architecture**- Shared base class for all integrations
2. **Workspace Scoping**- Multi-user workspace support
3. **Automatic Token Refresh**- No manual re-authentication
4. **Comprehensive Logging**- Full sync operation tracking
5. **Extensibility**- Easy to add new integrations (Sheets, Mailchimp, etc.)

Next step: Test OAuth flow, send emails, and verify reply detection works correctly.
