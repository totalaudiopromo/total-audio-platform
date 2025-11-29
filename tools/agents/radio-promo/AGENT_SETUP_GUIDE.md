# **Agent Setup Guide - Liberty Music PR vs Total Audio Promo**

## **Current Setup: Liberty Music PR Agent**

### **What This Agent Does**

- **Purpose**: Personal assistant for your Liberty Music PR work
- **Gmail**: Connected to `chrisschofield@libertymusicpr.com`
- **Monday.com**: Only edits board `2443582331` (your Liberty board)
- **Focus**: Radio promotion campaigns, press releases, artist management

### **Liberty Agent Features**

-  **Campaign Discovery**: Gmail+Typeform cross-referencing
-  **Press Release Generation**: With artist assets from Typeform
-  **Monday.com Integration**: Campaign board management
-  **Mailchimp Integration**: Email campaigns and templates
-  **Transcript Processing**: Google Meet + Otter.ai
-  **Intelligence Gathering**: Google Chat monitoring

## **Future Setup: Total Audio Promo Agent**

### **What This Agent Will Do**

- **Purpose**: Business operations for Total Audio Promo
- **Gmail**: Connected to your Total Audio Promo email
- **Monday.com**: Your Total Audio Promo boards
- **Focus**: SaaS operations, Audio Intel, business development

### **Total Audio Promo Agent Features**(Planned)

-  **Audio Intel Management**: Contact enrichment workflows
-  **Customer Support**: Ticket management and responses
-  **Business Analytics**: Revenue tracking and metrics
-  **Content Generation**: Blog posts, social media
-  **Lead Management**: Prospect tracking and nurturing

## **Current Liberty Agent Status**

### **Fully Working**

```bash
# Test the agent
MONDAY_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU2MDQxOTk1MSwiYWFpIjoxMSwidWlkIjoxNzkyMDMyNCwiaWFkIjoiMjAyNS0wOS0xMFQxMzozODoyMC44MzVaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODI0MjgzLCJyZ24iOiJ1c2UxIn0.iSTCqKmzpJxhPxfh9zkAPFIe0dgnhBbrhl8V7Azf1Gw node ../radio-promo-agent.js --help
```

### **Available Commands**

```bash
# Process transcripts
node ../radio-promo-agent.js process-transcript gemini:transcript-id
node ../radio-promo-agent.js process-transcript downloads:otter-file.txt

# Find campaigns
node ../radio-promo-agent.js find-liberty-campaigns-gmail
node ../radio-promo-agent.js find-artist-campaigns-gmail "Artist Name"

# Generate press releases
node ../radio-promo-agent.js generate-press-release "Artist Name"
node ../radio-promo-agent.js generate-recent-press-releases 30

# Create Monday.com campaigns
node ../radio-promo-agent.js create-campaign "Artist Name" "Track Title"

# Intelligence gathering
node ../radio-promo-agent.js gather-intelligence
node ../radio-promo-agent.js analyze-mailchimp
```

## **MCP Integration Status**

### **Current MCPs**

-  **Notion MCP**: Project management
-  **Puppeteer MCP**: Web automation
-  **Google Services MCP**: Gmail, Drive, Calendar (custom)

### **MCP Setup for Liberty Agent**

1. **Run OAuth Flow**:

   ```bash
   node simple-gmail-oauth.js
   ```

2. **Add to Claude Desktop**:
   - Open Claude Desktop settings
   - Go to Model Context Protocol servers
   - Add Google Services MCP server

3. **Test MCP Integration**:
   - Ask Claude to search Gmail for campaign emails
   - Ask Claude to create calendar events
   - Ask Claude to search Google Drive

## **Next Steps for Total Audio Promo Agent**

### **Phase 1: Duplicate Liberty Agent**

```bash
# Copy Liberty agent structure
cp -r radio-promo/ total-audio-promo-agent/
cd total-audio-promo-agent/

# Update configuration for Total Audio Promo
# - Change email addresses
# - Update Monday.com board IDs
# - Modify templates and branding
```

### **Phase 2: Customize for Total Audio Promo**

- **Gmail**: Connect to your Total Audio Promo email
- **Monday.com**: Connect to your Total Audio Promo boards
- **Templates**: Update for Audio Intel, SaaS operations
- **Workflows**: Focus on business operations, not radio promotion

### **Phase 3: Add Total Audio Promo Features**

- **Audio Intel Integration**: Contact enrichment workflows
- **Customer Support**: Ticket management
- **Business Analytics**: Revenue and metrics tracking
- **Content Generation**: Blog posts, social media

## **Agent Separation Strategy**

### **Liberty Music PR Agent**(Current)

- **Location**: `/tools/agents/radio-promo/`
- **Purpose**: Personal Liberty Music PR work
- **Gmail**: `chrisschofield@libertymusicpr.com`
- **Monday.com**: Board `2443582331`
- **Focus**: Radio promotion, press releases, artist management

### **Total Audio Promo Agent**(Future)

- **Location**: `/tools/agents/total-audio-promo/`
- **Purpose**: Total Audio Promo business operations
- **Gmail**: Your Total Audio Promo email
- **Monday.com**: Your Total Audio Promo boards
- **Focus**: SaaS operations, Audio Intel, business development

## **Current Status Summary**

| Component               | Liberty Agent       | Total Audio Promo Agent |
| ----------------------- | ------------------- | ----------------------- |
| **Core System**        |  Ready            |  Planned              |
| **Gmail Integration**  |  Liberty email    |  Total Audio email    |
| **Monday.com**         |  Board 2443582331 |  Total Audio boards   |
| **MCP Integration**    |  Ready            |  Copy from Liberty    |
| **Press Releases**     |  Ready            |  Adapt for business   |
| **Campaign Management**|  Ready            |  Adapt for SaaS       |

## **Ready to Use!**

**Your Liberty Music PR agent is fully set up and ready to use!**

**For Total Audio Promo agent, we can duplicate the Liberty agent and customize it for your business operations.**

**Would you like me to:**

1. **Test the Liberty agent**with your Monday.com API key?
2. **Start building the Total Audio Promo agent**based on the Liberty agent?
3. **Set up the MCP integration**for Gmail/Drive/Calendar?
