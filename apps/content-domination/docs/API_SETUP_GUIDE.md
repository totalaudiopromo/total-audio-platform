# Content Domination System - Complete API Setup Guide

## 🚀 Quick Start

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Follow each section below to configure your API credentials
3. Run the setup verification: `npm run verify-setup`

---

## 📱 Twitter API v2 Setup

### Prerequisites

- Twitter Developer Account
- Elevated Access (for v2 API features)

### Step-by-Step Configuration

1. **Create a Twitter Developer Account**
   - Go to <https://developer.twitter.com>
   - Apply for developer access
   - Select "Professional" or "Academic" based on your use case

2. **Create a New App**
   - Navigate to <https://developer.twitter.com/en/portal/dashboard>
   - Click "Create Project"
   - Name it: "Total Audio Promo Content System"
   - Select use case: "Making a bot" or "Exploring the API"

3. **Generate Credentials**
   - In your app settings, go to "Keys and tokens"
   - Generate and save:
     - API Key → `TWITTER_API_KEY`
     - API Secret → `TWITTER_API_SECRET`
     - Bearer Token → `TWITTER_BEARER_TOKEN`
   
4. **Generate Access Tokens**
   - Under "Authentication Tokens"
   - Generate Access Token & Secret with Read & Write permissions
   - Save:
     - Access Token → `TWITTER_ACCESS_TOKEN`
     - Access Token Secret → `TWITTER_ACCESS_TOKEN_SECRET`

5. **OAuth 2.0 Setup** (for advanced features)
   - Enable OAuth 2.0 in app settings
   - Save:
     - Client ID → `TWITTER_CLIENT_ID`
     - Client Secret → `TWITTER_CLIENT_SECRET`

### Required Permissions

- Read and write
- Direct message (optional)
- Email address (optional)

### Rate Limits

- 300 tweets per 3-hour window
- 1000 requests per 24-hour window for search

---

## 💼 LinkedIn API Setup

### Prerequisites

- LinkedIn account
- Company page (recommended)

### Step-by-Step Configuration

1. **Create LinkedIn App**
   - Go to <https://www.linkedin.com/developers/apps>
   - Click "Create app"
   - App name: "Total Audio Promo Automation"
   - LinkedIn Page: Select your company page
   - Privacy policy URL: Your website URL
   - App logo: Upload your logo

2. **Configure OAuth 2.0**
   - In app settings, go to "Auth" tab
   - Add redirect URLs:

     ```
     http://localhost:3000/auth/linkedin/callback
     https://your-domain.com/auth/linkedin/callback
     ```

   - Note your credentials:
     - Client ID → `LINKEDIN_CLIENT_ID`
     - Client Secret → `LINKEDIN_CLIENT_SECRET`

3. **Request API Access**
   - Go to "Products" tab
   - Request access to:
     - Share on LinkedIn
     - Marketing Developer Platform (if eligible)
   - Wait for approval (usually 1-2 business days)

4. **Generate Access Token**

   ```bash
   # Use the provided OAuth flow script
   npm run auth:linkedin
   ```

   - Follow the browser prompts
   - Save the generated tokens:
     - Access Token → `LINKEDIN_ACCESS_TOKEN`
     - Refresh Token → `LINKEDIN_REFRESH_TOKEN`

5. **Get Your Person URN**

   ```bash
   # After authentication, run:
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
        https://api.linkedin.com/v2/me
   ```

   - Find your person URN → `LINKEDIN_PERSON_URN`

### Permissions Required

- w_member_social (posting)
- r_liteprofile (profile access)
- r_emailaddress (optional)

---

## 📝 Notion API Setup

### Prerequisites

- Notion workspace
- Admin access to workspace

### Step-by-Step Configuration

1. **Create Notion Integration**
   - Go to <https://www.notion.so/my-integrations>
   - Click "New integration"
   - Name: "Content Domination System"
   - Select your workspace
   - Capabilities needed:
     - Read content
     - Update content
     - Insert content

2. **Copy Integration Token**
   - Copy the "Internal Integration Token"
   - Save as `NOTION_API_TOKEN`

3. **Create Required Databases**
   
   Create these databases in your Notion workspace:

   a. **Voice Examples Database**
   - Properties:
     - Content (Text)
     - Platform (Select: Twitter, LinkedIn, Newsletter)
     - Tone (Multi-select: Casual, Professional, Witty)
     - Performance (Number: engagement rate)
   
   b. **Content Templates Database**
   - Properties:
     - Template Name (Title)
     - Platform (Select)
     - Template (Text)
     - Variables (Multi-select)
   
   c. **Industry Terms Database**
   - Properties:
     - Term (Title)
     - Definition (Text)
     - Context (Text)
     - British Equivalent (Text)
   
   d. **Performance Analytics Database**
   - Properties:
     - Date (Date)
     - Platform (Select)
     - Reach (Number)
     - Engagement (Number)
     - Conversions (Number)
   
   e. **Newsjacking Opportunities Database**
   - Properties:
     - Headline (Title)
     - Source (URL)
     - Relevance Score (Number)
     - Status (Select: Pending, Approved, Published)
     - Content (Text)
   
   f. **Content Calendar Database**
   - Properties:
     - Title (Title)
     - Date (Date)
     - Platform (Multi-select)
     - Status (Select)
     - Content (Text)

4. **Share Databases with Integration**
   - Open each database
   - Click "Share" button
   - Invite your integration
   - Grant "Can edit" permissions

5. **Get Database IDs**
   - Open each database in browser
   - Copy the ID from URL: `notion.so/{workspace}/{database_id}?v=xxx`
   - Save each ID:
     - Voice Examples → `NOTION_VOICE_EXAMPLES_DB`
     - Content Templates → `NOTION_CONTENT_TEMPLATES_DB`
     - Industry Terms → `NOTION_INDUSTRY_TERMS_DB`
     - Performance Analytics → `NOTION_PERFORMANCE_ANALYTICS_DB`
     - Newsjacking Opportunities → `NOTION_NEWSJACKING_OPPORTUNITIES_DB`
     - Content Calendar → `NOTION_CONTENT_CALENDAR_DB`

---

## 🤖 Claude API (Anthropic) Setup

### Prerequisites

- Anthropic account
- Credit card for billing

### Step-by-Step Configuration

1. **Create Anthropic Account**
   - Go to <https://console.anthropic.com>
   - Sign up with email
   - Verify email address

2. **Add Payment Method**
   - Go to Billing section
   - Add credit card
   - Set usage limits (recommended: $100/month initially)

3. **Generate API Key**
   - Navigate to <https://console.anthropic.com/account/keys>
   - Click "Create Key"
   - Name: "Content Domination System"
   - Copy the key → `ANTHROPIC_API_KEY`

4. **Configure Model Settings**
   - Model: `claude-3-opus-20240229` (most capable)
   - Or use `claude-3-sonnet-20240229` (faster, cheaper)
   - Max tokens: 4096 (default)
   - Temperature: 0.7 (balanced creativity)

### Usage Considerations

- Claude-3-Opus: ~$15/million input tokens, $75/million output tokens
- Claude-3-Sonnet: ~$3/million input tokens, $15/million output tokens
- Monitor usage in console dashboard

---

## 📧 Kit.com (ConvertKit) Setup

### Prerequisites

- ConvertKit/Kit.com account
- At least one form created
- Email sequence configured

### Step-by-Step Configuration

1. **Get API Credentials**
   - Log into <https://app.kit.com>
   - Go to Settings → Advanced → API
   - Or direct link: <https://app.kit.com/account_settings/developer>
   - Copy credentials:
     - API Key → `KIT_API_KEY`
     - API Secret → `KIT_API_SECRET`

2. **Get Form ID**
   - Go to Landing Pages & Forms
   - Select your newsletter signup form
   - Copy the Form ID from URL or form settings
   - Save as `KIT_NEWSLETTER_FORM_ID`

3. **Get Sequence ID**
   - Go to Sequences
   - Select your "94 Audio Solutions" sequence
   - Copy Sequence ID from URL
   - Save as `KIT_NEWSLETTER_SEQUENCE_ID`

4. **Configure Webhooks** (Optional)
   - In Kit.com, go to Automations
   - Create webhook automation for:
     - New subscriber
     - Email opened
     - Link clicked
   - Point to your webhook endpoint

---

## 📰 News Source Configuration

### RSS Feeds (No API Key Required)

These sources work immediately with just the RSS URLs:

```env
# Music Business Worldwide
MBW_RSS_URL=https://www.musicbusinessworldwide.com/feed/

# Billboard
BILLBOARD_RSS_URL=https://www.billboard.com/c/music/music-news/feed/

# BBC Music News
BBC_RSS_URL=https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml

# Digital Music News
DMN_RSS_URL=https://www.digitalmusicnews.com/feed/

# Music Ally
MUSIC_ALLY_RSS_URL=https://musically.com/feed/

# Hypebot
HYPEBOT_RSS_URL=https://www.hypebot.com/feed
```

### Spotify for Artists API

1. **Create Spotify App**
   - Go to <https://developer.spotify.com/dashboard>
   - Create app: "Content Automation"
   - Note credentials:
     - Client ID → `SPOTIFY_CLIENT_ID`
     - Client Secret → `SPOTIFY_CLIENT_SECRET`

2. **News RSS**
   - Artists blog RSS: `https://artists.spotify.com/blog/rss`

### Premium News Sources (Optional)

For Music Week and other premium sources:

- Contact for API access
- Usually requires paid subscription
- Enhanced data quality and exclusivity

---

## 🔐 Security Configuration

### Generate Secure Secrets

Run these commands to generate secure secrets:

```bash
# JWT Secret (32 bytes)
openssl rand -hex 32
# Save as JWT_SECRET

# Session Secret (32 bytes)
openssl rand -hex 32
# Save as SESSION_SECRET

# Encryption Key (32 bytes)
openssl rand -hex 32
# Save as ENCRYPTION_KEY

# Webhook Secret (24 bytes)
openssl rand -hex 24
# Save as WEBHOOK_SECRET
```

---

## 📊 Optional Services

### Instagram API (via Facebook)

1. Create Facebook App at <https://developers.facebook.com>
2. Add Instagram Basic Display product
3. Configure OAuth Redirect URIs
4. Generate long-lived access token

### Monitoring Services

**Sentry** (Error Tracking)

- Sign up at <https://sentry.io>
- Create project
- Copy DSN → `SENTRY_DSN`

**Mixpanel** (Analytics)

- Sign up at <https://mixpanel.com>
- Get project token → `MIXPANEL_TOKEN`

---

## ✅ Verification Checklist

Run the verification script to ensure all APIs are configured:

```bash
npm run verify-setup
```

This will check:

- [ ] All required environment variables are set
- [ ] API credentials are valid
- [ ] Notion databases are accessible
- [ ] Twitter API connectivity
- [ ] LinkedIn OAuth flow
- [ ] Claude API response
- [ ] Kit.com list access
- [ ] RSS feeds are reachable

---

## 🚨 Troubleshooting

### Common Issues

1. **Twitter API: "Unauthorized"**
   - Ensure you have Elevated access
   - Regenerate tokens if needed
   - Check Read/Write permissions

2. **LinkedIn: "No permission to publish"**
   - Verify Share on LinkedIn product is approved
   - Check OAuth scopes include w_member_social

3. **Notion: "Database not found"**
   - Ensure integration is shared with database
   - Verify database IDs are correct
   - Check integration has edit permissions

4. **Claude: "Rate limit exceeded"**
   - Check usage in Anthropic console
   - Increase billing limits
   - Implement retry logic with exponential backoff

5. **RSS Feeds: "Failed to parse"**
   - Verify URLs are accessible
   - Check for IP blocking
   - Consider using proxy for rate-limited sources

---

## 📞 Support Contacts

- Twitter API: <https://developer.twitter.com/en/support>
- LinkedIn: <https://www.linkedin.com/help/linkedin>
- Notion: <https://www.notion.so/help>
- Anthropic: <support@anthropic.com>
- Kit.com: <https://help.kit.com>

---

## 🎯 Next Steps

1. Complete all API configurations
2. Run verification script
3. Test with sample content
4. Configure monitoring alerts
5. Set up backup credentials
6. Document any custom configurations

Remember to NEVER commit your `.env` file to version control!
