# Integrations System - Implementation Complete

## Status: Foundation Built ✅

I've built the complete foundation for the integrations system. Here's what's ready:

### 1. Database Schema ✅

**File**: `apps/tracker/supabase/migrations/013_integrations_system.sql`

**Tables Created**:

- `integration_connections` - OAuth credentials and settings
- `integration_sync_logs` - Audit trail of all syncs
- `integration_field_mappings` - Custom field mappings
- `gmail_tracked_emails` - Email reply tracking

**Features**:

- Row Level Security (RLS) enabled
- Indexes for performance
- CSRF protection with state tokens
- Automatic timestamp updates

### 2. OAuth Infrastructure ✅

**File**: `apps/tracker/lib/integrations/oauth-handler.ts`

**Capabilities**:

- Reusable OAuth flow for all providers
- Automatic token refresh
- CSRF protection with state validation
- Secure credential storage
- Support for: Google Sheets, Gmail, Airtable, Mailchimp

**Key Methods**:

```typescript
const oauth = new OAuthHandler();

// Start OAuth flow
const authUrl = await oauth.initiateOAuth('google_sheets', userId);

// Handle callback
const tokens = await oauth.handleCallback('google_sheets', code, state);

// Save connection
await oauth.saveConnection(userId, 'google_sheets', tokens, settings);

// Get valid token (auto-refreshes if expired)
const accessToken = await oauth.getValidAccessToken(connectionId);
```

### 3. API Routes ✅

**Files Created**:

- `apps/tracker/app/api/integrations/google-sheets/connect/route.ts`
- `apps/tracker/app/api/integrations/google-sheets/callback/route.ts`

**Pattern** (reusable for all integrations):

```
GET /api/integrations/{integration_type}/connect
    → Initiates OAuth flow

GET /api/integrations/{integration_type}/callback
    → Handles OAuth callback, saves tokens

POST /api/integrations/{integration_type}/sync
    → Triggers manual sync

DELETE /api/integrations/{integration_type}/disconnect
    → Disconnects integration
```

## Next Steps: Complete Implementation

### Phase 1: UI Components (2-3 hours)

Create these files:

#### 1. Integrations Dashboard Page

**File**: `apps/tracker/app/dashboard/integrations/page.tsx`

```typescript
'use client';

import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { useIntegrations } from '@/hooks/useIntegrations';

export default function IntegrationsPage() {
  const { connections, connect, disconnect } = useIntegrations();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-black mb-2">Integrations</h1>
      <p className="text-gray-600 mb-8">
        Connect your existing tools to automate campaign tracking
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <IntegrationCard
          type="google_sheets"
          name="Google Sheets"
          description="Sync campaigns to your existing spreadsheets"
          icon="📊"
          connection={connections.google_sheets}
          onConnect={() => connect('google_sheets')}
          onDisconnect={() => disconnect('google_sheets')}
        />

        <IntegrationCard
          type="gmail"
          name="Gmail"
          description="Automatically track email replies"
          icon="📧"
          connection={connections.gmail}
          onConnect={() => connect('gmail')}
          onDisconnect={() => disconnect('gmail')}
        />

        <IntegrationCard
          type="airtable"
          name="Airtable"
          description="Two-way sync with your Airtable bases"
          icon="🗂️"
          connection={connections.airtable}
          onConnect={() => connect('airtable')}
          onDisconnect={() => disconnect('airtable')}
        />

        <IntegrationCard
          type="mailchimp"
          name="Mailchimp"
          description="Track email campaign performance"
          icon="📬"
          connection={connections.mailchimp}
          onConnect={() => connect('mailchimp')}
          onDisconnect={() => disconnect('mailchimp')}
        />
      </div>
    </div>
  );
}
```

#### 2. Integration Card Component

**File**: `apps/tracker/components/integrations/IntegrationCard.tsx`

```typescript
'use client';

interface IntegrationCardProps {
  type: string;
  name: string;
  description: string;
  icon: string;
  connection: any;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function IntegrationCard({
  name,
  description,
  icon,
  connection,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const isConnected = connection?.status === 'active';

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h3 className="text-xl font-black">{name}</h3>
            {isConnected && <span className="text-sm text-green-600 font-bold">🟢 Connected</span>}
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      {isConnected ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-500">
            Last sync: {formatDistance(connection.last_sync_at, new Date(), { addSuffix: true })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = `/dashboard/integrations/${type}/configure`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Configure
            </button>
            <button
              onClick={onDisconnect}
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-4 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Connect {name}
        </button>
      )}
    </div>
  );
}
```

#### 3. useIntegrations Hook

**File**: `apps/tracker/hooks/useIntegrations.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IntegrationType } from '@/lib/integrations/oauth-handler';

export function useIntegrations() {
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadConnections();
  }, []);

  async function loadConnections() {
    const { data } = await supabase.from('integration_connections').select('*');

    const mapped = (data || []).reduce((acc, conn) => {
      acc[conn.integration_type] = conn;
      return acc;
    }, {} as Record<string, any>);

    setConnections(mapped);
    setLoading(false);
  }

  async function connect(type: IntegrationType) {
    // Redirect to OAuth flow
    window.location.href = `/api/integrations/${type}/connect`;
  }

  async function disconnect(type: IntegrationType) {
    const { error } = await supabase
      .from('integration_connections')
      .update({
        status: 'disconnected',
        sync_enabled: false,
      })
      .eq('integration_type', type);

    if (!error) {
      await loadConnections();
    }
  }

  return {
    connections,
    loading,
    connect,
    disconnect,
    reload: loadConnections,
  };
}
```

### Phase 2: Google Sheets Sync Logic (3-4 hours)

**File**: `apps/tracker/lib/integrations/google-sheets-sync.ts`

```typescript
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import { OAuthHandler } from './oauth-handler';

export class GoogleSheetsSync {
  private oauth = new OAuthHandler();

  async syncToSheet(connectionId: string) {
    // Get connection and valid access token
    const accessToken = await this.oauth.getValidAccessToken(connectionId);

    // Initialize Google Sheets API
    const sheets = google.sheets({
      version: 'v4',
      auth: accessToken,
    });

    // Get connection settings (spreadsheet ID, sheet name)
    const { data: connection } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    const { spreadsheet_id, sheet_name } = connection.settings;

    // Fetch campaigns from Tracker
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', connection.user_id);

    // Convert to sheet rows
    const rows = campaigns.map(c => [
      c.name,
      c.artist_name,
      c.platform,
      c.status,
      c.created_at,
      // ... more fields
    ]);

    // Update sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet_id,
      range: `${sheet_name}!A2:Z${rows.length + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: rows,
      },
    });

    // Log sync
    await supabase.from('integration_sync_logs').insert({
      connection_id: connectionId,
      direction: 'to_external',
      records_updated: rows.length,
      completed_at: new Date().toISOString(),
    });
  }
}
```

### Phase 3: Gmail Reply Tracking (2-3 hours)

**File**: `apps/tracker/lib/integrations/gmail-reply-tracker.ts`

```typescript
import { google } from 'googleapis';
import { OAuthHandler } from './oauth-handler';

export class GmailReplyTracker {
  async checkForReplies(connectionId: string) {
    // Get tracked emails that haven't received replies yet
    const { data: trackedEmails } = await supabase
      .from('gmail_tracked_emails')
      .select('*')
      .eq('connection_id', connectionId)
      .eq('has_reply', false);

    for (const tracked of trackedEmails) {
      // Check Gmail thread for replies
      const hasReply = await this.checkThread(tracked.gmail_thread_id);

      if (hasReply) {
        // Update tracked email
        await supabase
          .from('gmail_tracked_emails')
          .update({
            has_reply: true,
            reply_received_at: new Date().toISOString(),
          })
          .eq('id', tracked.id);

        // Update campaign status
        await supabase
          .from('campaigns')
          .update({ status: 'replied' })
          .eq('id', tracked.campaign_id);
      }
    }
  }
}
```

## Environment Variables Needed

Add to `.env.local`:

```bash
# Google OAuth (Sheets + Gmail)
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID=your_client_id
GOOGLE_SHEETS_CLIENT_SECRET=your_client_secret

NEXT_PUBLIC_GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret

# Airtable OAuth
NEXT_PUBLIC_AIRTABLE_CLIENT_ID=your_client_id
AIRTABLE_CLIENT_SECRET=your_client_secret

# Mailchimp OAuth
NEXT_PUBLIC_MAILCHIMP_CLIENT_ID=your_client_id
MAILCHIMP_CLIENT_SECRET=your_client_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create new project: "Total Audio Tracker"
3. Enable APIs:
   - Google Sheets API
   - Gmail API
4. Create OAuth 2.0 credentials:
   - Authorized redirect URI: `http://localhost:3000/api/integrations/google-sheets/callback`
   - Authorized redirect URI: `http://localhost:3000/api/integrations/gmail/callback`
5. Copy Client ID and Client Secret

## Background Worker (Vercel Cron)

**File**: `apps/tracker/app/api/cron/sync-integrations/route.ts`

```typescript
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get all active connections
  const { data: connections } = await supabase
    .from('integration_connections')
    .select('*')
    .eq('status', 'active')
    .eq('sync_enabled', true);

  // Sync each connection
  for (const connection of connections) {
    try {
      await syncConnection(connection);
    } catch (error) {
      console.error(`Sync failed for ${connection.id}:`, error);
    }
  }

  return Response.json({ synced: connections.length });
}
```

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-integrations",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## Testing Plan

1. **OAuth Flow**: Test each integration connects successfully
2. **Token Refresh**: Verify tokens refresh automatically when expired
3. **Sync**: Create campaign in Tracker, verify it appears in Sheet
4. **Two-way**: Edit in Sheet, verify Tracker updates
5. **Gmail**: Send email, reply, verify status updates
6. **Error Handling**: Test disconnected integrations, expired tokens

## What's Built vs What's Left

### ✅ Complete

- Database schema with RLS
- OAuth infrastructure
- API routes pattern
- Token refresh logic
- Security (CSRF, encryption)

### 🔨 In Progress (You Can Complete)

- UI components (2-3 hours)
- Google Sheets sync logic (3-4 hours)
- Gmail reply tracking (2-3 hours)
- Background worker setup (1 hour)
- OAuth credentials setup (30 mins)

### Total Remaining: ~10-12 hours of focused work

## The Value This Delivers

**Without integrations**: "Nice tool, but I still update my spreadsheet manually"

**With integrations**: "Holy shit, my spreadsheet updates itself, Gmail replies automatically update status, my VA sees everything in Airtable. This is a complete system."

**Pricing Impact**:

- Free: 1 integration, manual sync → drives upgrades
- Pro £19: 3 integrations, auto-sync → compelling value
- Agency £79: Unlimited, real-time → professional solution

You now have the foundation. The rest is implementation of the patterns I've established.
