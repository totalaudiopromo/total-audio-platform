# Liberty Music PR - Google Chat MCP Setup

##  OBJECTIVE

Give the agent read-only access to Liberty Google Chat for training on:

- Campaign workflows
- Station communications
- Team processes
- Client management patterns

##  CREDENTIALS

**Liberty Admin Email**: `chrisschofield@libertymusicpr.com`
**Purpose**: Read Liberty Google Chat spaces for agent training
**Access Level**: Read-only

##  SETUP STEPS

### 1. Enable Google Chat API (Liberty Workspace)

Go to: https://console.cloud.google.com/apis/library/chat.googleapis.com

**Important**: Make sure you're in the **Liberty workspace project** (not Total Audio)

1. Select or create a Google Cloud project for Liberty Music PR
2. Click **"ENABLE"** on Google Chat API
3. Note the project name/ID

### 2. Create OAuth 2.0 Client ID (Liberty)

Go to: https://console.cloud.google.com/apis/credentials

1. Click **"+ CREATE CREDENTIALS"** → OAuth 2.0 Client ID
2. Application type: **Desktop app**
3. Name: **Liberty Agent - Google Chat**
4. Click **Create**
5. Download the JSON credentials file

### 3. Configure OAuth Consent Screen

If prompted, configure the OAuth consent screen:

- User Type: **Internal** (if Google Workspace) or **External**
- App name: **Liberty Music PR Agent**
- User support email: `chrisschofield@libertymusicpr.com`
- Developer contact: `chrisschofield@libertymusicpr.com`

Add scopes:

- `https://www.googleapis.com/auth/chat.spaces.readonly`
- `https://www.googleapis.com/auth/chat.messages.readonly`

### 4. Save Credentials

```bash
# Create Liberty Chat credentials directory
mkdir -p ~/.liberty-chat-mcp

# Save the downloaded JSON file as:
cp ~/Downloads/client_secret_*.json ~/.liberty-chat-mcp/credentials.json
```

### 5. Update MCP Configuration

The Liberty Chat MCP is already created. Just need to point it to Liberty credentials:

```bash
# Update the Google Chat MCP to use Liberty credentials instead
cp ~/.liberty-chat-mcp/credentials.json ~/.google-chat-mcp/credentials.json
```

### 6. First Authentication

The first time you use the agent to access Liberty Chat, it will:

1. Open a browser window
2. Ask you to sign in with `chrisschofield@libertymusicpr.com`
3. Request permission to read Google Chat spaces and messages
4. Save the token to `~/.google-chat-mcp/token.json`

##  SECURITY NOTES

- **Read-only access**: Agent can only READ messages, not post
- **Your account**: Uses your Liberty admin credentials
- **Token storage**: Saved locally in `~/.google-chat-mcp/token.json`
- **Token refresh**: Auto-refreshes when expired
- **Revoke access**: Can revoke from Google Account settings anytime

##  WHAT THE AGENT CAN ACCESS

From Liberty Google Chat:

- All spaces you have access to
- Historical messages (subject to retention policies)
- Channel/space metadata
- User information (for understanding team structure)

Training data will help agent understand:

- How Liberty manages campaigns
- Station communication patterns
- Client interaction workflows
- Team coordination processes
- Best practices for radio promotion

##  QUICK START (After Setup)

Once authenticated, you can ask the agent:

- "List all Liberty Chat spaces"
- "Show recent messages from #campaigns channel"
- "Search Liberty Chat for 'BBC Radio 6 Music' campaigns"
- "Extract workflow patterns from #team-updates"

##  EXISTING TRAINING DATA

You already have Liberty Takeout data at:
`/Users/chrisschofield/workspace/active/liberty-music-pr/Liberty_Training_Data/Takeout/Google Chat/`

The agent will use BOTH:

- **Takeout data**: Historical baseline (up to export date)
- **Live Chat API**: Recent updates and ongoing conversations

This gives complete historical context + real-time updates.

---

**Next Step**: Download OAuth credentials from Google Cloud Console for Liberty workspace
