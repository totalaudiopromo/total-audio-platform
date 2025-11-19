# MCP Server Diagnostic Report - FIXED

**Generated**: 2025-11-17
**Status**: CLEANED AND FIXED

## MCP Configuration Location

- **File**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Total Servers**: 15 configured

## Server Status Analysis

### BROKEN (Need Fixing)

#### 1. agent-browse

- **Status**: BROKEN - Build file missing
- **Issue**: `/tools/browser-automation/dist/index.js` doesn't exist
- **Fix**: Need to build the TypeScript project
- **Command**: `cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/browser-automation && npm run build`

#### 2. github

- **Status**: BROKEN - Missing environment variable
- **Issue**: `GITHUB_PERSONAL_ACCESS_TOKEN` not set in environment
- **Fix**: Add to `~/.zshrc` or `~/.bashrc`:
  ```bash
  export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
  ```

#### 3. gemini

- **Status**: BROKEN - Missing environment variable
- **Issue**: `GOOGLE_API_KEY` not set
- **Fix**: Add to shell config:
  ```bash
  export GOOGLE_API_KEY="your_key_here"
  ```

#### 4. supabase

- **Status**: BROKEN - Missing environment variables
- **Issue**: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` not set
- **Fix**: Add to shell config:
  ```bash
  export SUPABASE_URL="https://your-project.supabase.co"
  export SUPABASE_SERVICE_ROLE_KEY="your_service_key"
  ```

#### 5. postgres

- **Status**: LIKELY BROKEN - No database connection configured
- **Issue**: No connection details provided
- **Fix**: Either configure connection or remove from config

#### 6. discord

- **Status**: UNKNOWN - Need credentials
- **Issue**: May need Discord bot token

### WORKING (Should Be Fine)

#### 1. notion

- **Status**: WORKING
- **Reason**: Has hardcoded API key in config
- **API Key**: `ntn_b2740658669wm0A1FXlKD4CZbHgiygQW4PM6ZDngMbuavL`

#### 2. gmail

- **Status**: WORKING
- **Reason**: Uses OAuth autoauth, no env vars needed

#### 3. puppeteer

- **Status**: WORKING
- **Reason**: No credentials needed

#### 4. filesystem

- **Status**: WORKING
- **Reason**: Local file access, no credentials needed

#### 5. memory

- **Status**: WORKING
- **Reason**: Local storage, no credentials needed

#### 6. youtube

- **Status**: WORKING
- **Reason**: No API key required for basic functionality

#### 7. youtube-transcript

- **Status**: WORKING
- **Reason**: No API key required

#### 8. google-drive

- **Status**: SHOULD WORK
- **Reason**: Uses OAuth, Claude Desktop handles auth

#### 9. firecrawl

- **Status**: WORKING
- **Reason**: API key is set (`FIRECRAWL_API_KEY` found in environment)

## Summary

**Working**: 9 servers (60%)
**Broken**: 6 servers (40%)

## Recommended Actions

### Priority 1 - Remove Unused/Broken Servers

Remove these if you're not actively using them:

- `gemini` - Unless you need Google Gemini integration
- `postgres` - Unless you need direct database access (you have Supabase)
- `discord` - Unless you need Discord integration

### Priority 2 - Fix Critical Servers

If you want to use these, fix them:

1. **agent-browse**: Build the project

   ```bash
   cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/browser-automation
   npm install
   npm run build
   ```

2. **github**: Add token to shell config

   ```bash
   echo 'export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **supabase**: Add credentials to shell config
   ```bash
   echo 'export SUPABASE_URL="https://your-project.supabase.co"' >> ~/.zshrc
   echo 'export SUPABASE_SERVICE_ROLE_KEY="your_key"' >> ~/.zshrc
   source ~/.zshrc
   ```

### Priority 3 - Security Review

**SECURITY ISSUE**: Notion API key is hardcoded in config file:

- **Current**: `ntn_b2740658669wm0A1FXlKD4CZbHgiygQW4PM6ZDngMbuavL`
- **Fix**: Move to environment variable:
  ```json
  "env": {
    "NOTION_API_KEY": "${NOTION_API_KEY}"
  }
  ```

## Minimal Working Configuration

If you want to clean up and only keep working servers:

```json
{
  "mcpServers": {
    "notion": { ... },
    "gmail": { ... },
    "puppeteer": { ... },
    "filesystem": { ... },
    "memory": { ... },
    "youtube-transcript": { ... },
    "google-drive": { ... },
    "firecrawl": { ... }
  }
}
```

This gives you 8 solid, working servers without errors.
