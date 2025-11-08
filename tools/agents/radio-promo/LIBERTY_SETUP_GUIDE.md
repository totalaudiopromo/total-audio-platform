# Liberty Music PR Radio Promo Agent - Setup Guide

## 🚨 CRITICAL SAFETY NOTICE

**ONLY EDIT: <https://liberty-music.monday.com/boards/2443582331>**

This is a shared workspace used by the entire Liberty team. The agent is configured to ONLY work with this specific board ID for safety.

## 🔧 API Setup Required

### 1. Monday.com API Key

1. Go to [Monday.com Developer](https://developer.monday.com/)
2. Create a new app or use existing
3. Get your API key
4. **CRITICAL**: Verify the board ID is `2443582331`

### 2. Google Chat Integration (READ-ONLY MODE) ✅ CONFIGURED

- **Mode**: Read-only intelligence gathering
- **No notifications sent** to anyone
- **Channels monitored**:
  - Success Shout Outs: `AAAANDK-SNA`
  - Radio Superstars: `AAAACVjpDTI`
  - Campaigns: `AAAAu3XTTik`
- **Test**: Run `node test-google-chat-readonly.js` to verify

### 3. Otter.ai API Key

1. Go to [Otter.ai API](https://otter.ai/api)
2. Create developer account
3. Generate API key
4. Note: You'll need access to your Otter.ai account

### 4. Typeform API Key

1. Go to [Typeform Developer](https://developer.typeform.com/)
2. Create a new app
3. Get your API key
4. Note: You'll need access to your Typeform account

### 5. Mailchimp API Key ✅ CONFIGURED

- **API Key**: `b0f629921e6d1f85c4549c63dee5b9b2-us13`
- **Server Prefix**: `us13`
- **Status**: Ready to use
- **Test**: Run `node test-mailchimp.js` to verify

### 6. WARM API (When Available)

1. Contact WARM API support
2. Get API key and base URL
3. Configure play tracking

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo
npm install node-fetch
```

### 2. Configure Environment

```bash
cp env.example .env
# Edit .env with your actual API keys
```

### 3. Test Integrations

```bash
# Test Monday.com connection
node -e "
const MondayApi = require('./integrations/monday-api');
const monday = new MondayApi();
monday.validateBoardAccess().then(console.log);
"

# Test Google Chat webhook
node -e "
const GoogleChat = require('./integrations/google-chat');
const chat = new GoogleChat();
chat.testConnection().then(console.log);
"
```

## 📋 Usage Examples

### Process Otter.ai Transcript

```bash
node radio-promo-agent.js process-transcript otter:TRANSCRIPT_ID
```

### Process Typeform Response

```bash
node radio-promo-agent.js process-transcript typeform:FORM_ID:RESPONSE_ID
```

### Complete Workflow

```bash
node radio-promo-agent.js personal-workflow otter:TRANSCRIPT_ID
```

## 🔍 Safety Features

### Board Protection

- Hard-coded board ID: `2443582331`
- Validation before any operations
- Error handling for unauthorized access

### Verification System

- Every operation requires approval
- Step-by-step confirmation
- Rollback capabilities

### Rate Limiting

- 1 second between Monday.com calls
- 2 seconds between Otter.ai calls
- 1 second between Google Chat calls

## 📊 What Gets Created

### Monday.com Board Items

- **Main Item**: `{Artist Name} - {Track Title}`
- **Subitems**: 8 campaign tasks with deadlines
- **Columns**: Artist, Track, Genre, Release Date, Status, Budget, Priority

### Google Chat Notifications

- Campaign creation alerts
- Press release ready notifications
- Monday.com board created alerts
- Milestone achievements
- Daily performance updates

### File Outputs

- Campaign briefs: `./campaigns/brief_*.json`
- Press releases: `./press-releases/*.txt`
- Workflow logs: `./campaigns/workflow_*.json`

## 🚨 Error Handling

### Monday.com Errors

- Board access validation
- Rate limit handling
- Retry logic with exponential backoff

### API Failures

- Graceful degradation
- Error notifications to Google Chat
- Detailed logging

### Safety Checks

- Board ID validation
- Permission verification
- Operation confirmation

## 🔧 Troubleshooting

### Common Issues

1. **Monday.com Access Denied**

   - Check API key permissions
   - Verify board ID is correct
   - Ensure you have access to the Liberty board

2. **Google Chat Not Working**

   - Verify webhook URL is correct
   - Check webhook is enabled in space
   - Test with simple message first

3. **Otter.ai API Errors**

   - Check API key is valid
   - Verify transcript ID exists
   - Check rate limits

4. **Typeform Integration Issues**
   - Verify form ID and response ID
   - Check API key permissions
   - Ensure form is accessible

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug node radio-promo-agent.js [command]
```

## 📞 Support

If you encounter issues:

1. Check the logs in `./logs/`
2. Verify all API keys are correct
3. Test individual integrations
4. Contact Chris for Liberty-specific issues

## 🎯 Next Steps

1. **Set up API keys** (priority order):

   - Monday.com (critical)
   - Google Chat (critical)
   - Otter.ai (for existing transcripts)
   - Typeform (for client intake)

2. **Test with existing data**:

   - Process an Otter.ai transcript
   - Create a test campaign
   - Verify Monday.com integration

3. **Go live**:
   - Process real client transcripts
   - Create actual campaigns
   - Monitor Google Chat notifications

Remember: This agent is designed to save you 15+ hours per week on radio promo tasks. Take time to set it up properly - it'll pay off massively!
