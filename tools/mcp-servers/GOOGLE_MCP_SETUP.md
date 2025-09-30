# Google Calendar & Chat MCP Setup

## ✅ INSTALLED

Both MCPs are now added to your Claude Desktop configuration:
- **google-calendar**: Campaign scheduling and milestone tracking
- **google-chat**: Read-only access to Liberty channels (training data)

## 🔐 AUTHENTICATION SETUP

### 1. Create OAuth Credentials (One-Time)

Go to: https://console.cloud.google.com/apis/credentials?project=gleaming-realm-471715-p3

**For Calendar MCP:**
1. Create new OAuth 2.0 Client ID (or use existing "Google Calendar")
2. Application type: Desktop app
3. Download credentials JSON
4. Save as: `~/.google-calendar-mcp/credentials.json`

**For Chat MCP:**
1. First, enable Google Chat API: https://console.cloud.google.com/apis/library/chat.googleapis.com
2. Create new OAuth 2.0 Client ID (or use existing)
3. Application type: Desktop app
4. Add scopes:
   - `https://www.googleapis.com/auth/chat.spaces.readonly`
   - `https://www.googleapis.com/auth/chat.messages.readonly`
5. Download credentials JSON
6. Save as: `~/.google-chat-mcp/credentials.json`

### 2. First-Time Authentication

**Calendar:**
```bash
# Create credentials directory
mkdir -p ~/.google-calendar-mcp

# Copy your Google Calendar OAuth credentials
cp /path/to/downloaded/credentials.json ~/.google-calendar-mcp/credentials.json

# Test authentication (will open browser)
node /Users/chrisschofield/workspace/active/total-audio-platform/tools/mcp-servers/google-calendar-mcp.js
```

**Chat:**
```bash
# Create credentials directory
mkdir -p ~/.google-chat-mcp

# Copy your Google Chat OAuth credentials
cp /path/to/downloaded/credentials.json ~/.google-chat-mcp/credentials.json

# Test authentication (will open browser)
node /Users/chrisschofield/workspace/active/total-audio-platform/tools/mcp-servers/google-chat-mcp.js
```

### 3. Grant Permissions

When the browser opens:
1. Sign in with your `promo@totalaudiopromo.com` account
2. Grant calendar/chat permissions
3. Token will be saved to `~/.google-calendar-mcp/token.json` and `~/.google-chat-mcp/token.json`

## 📋 AVAILABLE TOOLS

### Google Calendar MCP

- `calendar_list_events` - View upcoming campaigns/milestones
- `calendar_create_event` - Schedule campaign milestones
- `calendar_update_event` - Update campaign dates
- `calendar_delete_event` - Remove events

### Google Chat MCP (Read-Only)

- `chat_list_spaces` - List all Liberty channels
- `chat_list_messages` - Read channel messages (training data)
- `chat_get_space` - Get channel details
- `chat_search_messages` - Search across channels

## 💡 USE CASES

### Campaign Scheduling
```
Create a calendar event for:
- Campaign: KYARA "Bloodshot"
- Start: 2025-10-01
- End: 2025-11-15
- Milestones: Week 1 pitch, Week 3 review, Week 6 report
```

### Training Data Extraction
```
List messages from Liberty #campaigns channel from last 3 months
Search for "Senior Dunce" across all Liberty channels
Extract workflow patterns from #team-updates
```

## ⚠️ IMPORTANT NOTES

1. **Google Chat API** requires Workspace admin approval for production use
2. **Calendar** works immediately after OAuth consent
3. **Chat MCP is read-only** - no message posting (by design)
4. Credentials are stored in `~/.google-*-mcp/` directories
5. Tokens auto-refresh when expired

## 🔧 TROUBLESHOOTING

**"Error: ENOENT: no such file or directory, open '~/.google-calendar-mcp/credentials.json'"**
- You need to download OAuth credentials from Google Cloud Console first

**"Access blocked: This app isn't verified"**
- Click "Advanced" → "Go to [app name] (unsafe)"
- This is safe for your own OAuth app

**Chat API: "403 Forbidden"**
- Enable Google Chat API in Cloud Console
- Add required scopes to OAuth consent screen
- May need Workspace admin approval

## 📚 NEXT STEPS

1. Download OAuth credentials from Google Cloud Console
2. Save to `~/.google-calendar-mcp/credentials.json` and `~/.google-chat-mcp/credentials.json`
3. Restart Claude Desktop to activate MCPs
4. Test by asking Claude to "list my calendar events" or "list Liberty chat spaces"

---

**MCP Locations:**
- Calendar: `/Users/chrisschofield/workspace/active/total-audio-platform/tools/mcp-servers/google-calendar-mcp.js`
- Chat: `/Users/chrisschofield/workspace/active/total-audio-platform/tools/mcp-servers/google-chat-mcp.js`

**Status:** ✅ Installed, awaiting OAuth credentials