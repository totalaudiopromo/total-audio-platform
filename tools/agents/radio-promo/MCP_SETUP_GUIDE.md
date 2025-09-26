# 🚀 **MCP Setup Guide for Liberty Music PR**

## **Why MCPs are Better Than Custom APIs**

✅ **Standardized Interface**: MCPs provide a consistent way for AI agents to interact with external services  
✅ **Better Error Handling**: Built-in retry logic and error management  
✅ **Easier Maintenance**: No need to maintain custom API integration code  
✅ **Security**: OAuth flows handled properly with token refresh  
✅ **Scalability**: Can easily add more Google services  

## **Current MCP Status**

### ✅ **Working MCPs**
- **Puppeteer MCP** - Web automation
- **Notion MCP** - Project management
- **Google Services MCP** - Gmail, Drive, Calendar (custom)

### ❌ **Failed MCPs**
- **GitHub MCP** - Connection failed

## **Google Services MCP Setup**

### **Step 1: OAuth Authentication**
```bash
# Run the OAuth flow to get access tokens
node simple-gmail-oauth.js
```

**What this does:**
- Opens browser for Google OAuth
- Grants access to Gmail, Drive, and Calendar
- Saves tokens for MCP server

### **Step 2: Add MCP Server to Claude Desktop**

1. **Open Claude Desktop Settings**
2. **Go to "Model Context Protocol servers"**
3. **Add new server with these settings:**

```json
{
  "name": "google-services",
  "command": "node",
  "args": ["/Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo/mcp-servers/google-services-mcp.js"],
  "env": {
    "GOOGLE_CREDENTIALS_PATH": "/Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo/gmail-credentials.json",
    "GOOGLE_TOKEN_PATH": "/Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo/gmail-token.json"
  }
}
```

### **Step 3: Test MCP Integration**

Once added to Claude Desktop, you can ask Claude to:

**Gmail Operations:**
- "Search Gmail for campaign emails from artists"
- "Extract artist information from Gmail threads"
- "Find emails about specific campaigns"

**Google Drive Operations:**
- "Search Google Drive for press photos"
- "Find artist assets in Drive"
- "List recent campaign files"

**Google Calendar Operations:**
- "List upcoming campaign events"
- "Create a new campaign timeline event"
- "Schedule press release dates"

## **Available MCP Tools**

### **Gmail Tools**
- `gmail_search_emails` - Search for campaign emails
- `gmail_get_message` - Get full message content
- `gmail_extract_artist_info` - Extract artist details from threads

### **Google Drive Tools**
- `drive_search_files` - Search for files
- `drive_list_files` - List recent files

### **Google Calendar Tools**
- `calendar_list_events` - List upcoming events
- `calendar_create_event` - Create new events

## **Benefits Over Custom APIs**

### **Before (Custom APIs)**
```javascript
// Complex OAuth handling
const oAuth2Client = new google.auth.OAuth2(...);
await oAuth2Client.getToken(code);
// Manual error handling
// Custom retry logic
// Token refresh management
```

### **After (MCP)**
```javascript
// Simple MCP call
await mcp.callTool('gmail_search_emails', {
  query: 'from:artist@example.com subject:campaign'
});
// Automatic error handling
// Built-in retry logic
// Token refresh handled
```

## **Next Steps**

1. **Run OAuth Flow**: `node simple-gmail-oauth.js`
2. **Add to Claude Desktop**: Use the config above
3. **Test Integration**: Ask Claude to search Gmail
4. **Update Radio Promo Agent**: Use MCP calls instead of custom APIs

## **Troubleshooting**

### **OAuth Issues**
- Make sure Gmail API is enabled in Google Cloud Console
- Check that redirect URI is set to `urn:ietf:wg:oauth:2.0:oob`
- Verify credentials file is in the right location

### **MCP Connection Issues**
- Check file paths in Claude Desktop config
- Verify Node.js is available in PATH
- Check that gmail-token.json exists

### **Permission Issues**
- Ensure OAuth scopes include Gmail, Drive, and Calendar
- Check that your Google account has access to these services

## **Security Notes**

✅ **Read-Only Access**: Gmail and Drive are read-only by default  
✅ **Token Security**: Tokens are stored locally and not shared  
✅ **Scope Limitation**: Only requests necessary permissions  
✅ **No Data Storage**: MCP server doesn't store your data  

---

**Ready to set up? Run `node simple-gmail-oauth.js` to get started!**

