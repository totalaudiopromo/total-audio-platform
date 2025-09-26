# Personal Radio Promo Agent

Your enhanced Radio Promo Agent now includes personal workflow automation capabilities for streamlined campaign management.

## 🚀 Features

### Traditional Radio Promotion
- Radio station database management
- Genre-based targeting and segmentation  
- DJ relationship tracking and engagement
- Playlist placement optimization
- Campaign performance analytics
- Automated follow-up sequences

### Personal Workflow Automation
1. **Google Meet transcript processing** - Extract campaign briefs from meeting recordings
2. **Monday.com campaign auto-creation** - Generate structured campaign boards
3. **Liberty-style press release generation** - Professional PR templates
4. **WARM API play tracking** - Monitor track performance with notifications
5. **Google Chat integration** - Team notifications for campaign wins
6. **Verification system** - Approve each step before execution

## 🛠️ Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Fill in your API keys and configuration:
```bash
# Monday.com Integration
MONDAY_API_KEY=your_monday_api_key_here

# Google Chat Notifications  
GOOGLE_CHAT_WEBHOOK=your_google_chat_webhook_url

# WARM API Configuration
WARM_API_KEY=your_warm_api_key_here
```

### 2. Directory Structure

The agent will automatically create these directories:
- `./transcripts/` - Google Meet transcript files
- `./campaigns/` - Campaign briefs and Monday.com structures  
- `./press-releases/` - Generated Liberty-style press releases
- `./tracking-data/` - WARM API tracking configurations

## 🔧 Usage

### Traditional Radio Promo Commands

```bash
# Check agent health
node radio-promo-agent.js health

# Get statistics  
node radio-promo-agent.js stats

# Generate radio campaign
node radio-promo-agent.js campaign "Track Title" "Artist Name" "Genre"

# Execute outreach campaign (demo)
node radio-promo-agent.js execute

# Generate performance report
node radio-promo-agent.js report campaign_id
```

### Personal Workflow Commands

```bash
# Process Google Meet transcript
node radio-promo-agent.js process-transcript ./transcripts/meeting.txt

# Generate Liberty-style press release
node radio-promo-agent.js generate-pr ./campaigns/brief_12345.json

# Execute complete workflow (all steps)
node radio-promo-agent.js personal-workflow ./transcripts/meeting.txt

# Disable verification prompts
node radio-promo-agent.js no-verify
```

### Complete Workflow Example

1. **Record your campaign planning meeting** and save transcript as `meeting.txt`
2. **Run the complete workflow**:
   ```bash
   node radio-promo-agent.js personal-workflow ./transcripts/meeting.txt
   ```
3. **The agent will**:
   - Extract campaign details from transcript
   - Create Monday.com campaign board
   - Generate Liberty-style press release
   - Setup WARM API play tracking  
   - Send Google Chat notification
   - Request verification at each step

## 📊 Workflow Steps

### Step 1: Transcript Processing
- Extracts artist name, track title, genre, release date
- Identifies budget, targets, priorities, deadlines
- Saves campaign brief with confidence score

### Step 2: Monday.com Campaign Creation  
- Generates structured campaign board
- Creates task groups: Pre-Launch, Launch Week, Follow-up, Tracking
- Sets priorities, deadlines, and recurring tasks
- Saves board structure locally

### Step 3: Press Release Generation
- Uses Liberty PR style templates
- Professional headline and subheadline
- Artist quote and background
- Contact information and release details

### Step 4: WARM API Tracking Setup
- Configures play count monitoring
- Sets milestone notifications (100, 500, 1K, 5K, 10K plays)
- Enables daily/weekly reporting
- Saves tracking configuration

### Step 5: Google Chat Notifications
- Sends campaign creation notification
- Milestone achievement alerts
- Daily performance updates
- Campaign win celebrations

## 🔍 Verification System

The agent includes a verification system that prompts before each major action:

```
🔍 [VERIFICATION] Ready to process transcript?
🔍 [VERIFICATION] Verification required for: Process transcript and extract campaign data
🔍 [VERIFICATION] Proceed? (y/N): 
```

Disable verification for automated workflows:
```bash
node radio-promo-agent.js no-verify
```

## 📁 File Outputs

### Campaign Brief (`./campaigns/brief_*.json`)
```json
{
  "extractedAt": "2024-01-15T10:30:00.000Z",
  "source": "google_meet_transcript",
  "data": {
    "artistName": "Artist Name",
    "trackTitle": "Track Title", 
    "genre": "Genre",
    "releaseDate": "2024-02-01"
  },
  "confidence": 100
}
```

### Monday.com Board (`./campaigns/monday_*.json`)
```json
{
  "boardName": "Artist Name - Track Title Radio Campaign",
  "description": "Radio promotion campaign...",
  "groups": [
    {
      "title": "Pre-Launch Preparation",
      "items": [...]
    }
  ]
}
```

### Press Release (`./press-releases/*_PR.txt`)
```
FOR IMMEDIATE RELEASE

Breaking: Artist Name Drops Game-Changing Genre Anthem 'Track Title'

New release set to dominate genre charts with innovative sound...
```

### Tracking Data (`./tracking-data/tracking_*.json`)
```json
{
  "trackId": "track_1642248600000",
  "artistName": "Artist Name",
  "trackTitle": "Track Title",
  "config": {
    "checkInterval": 300000,
    "notificationThresholds": [100, 500, 1000, 5000, 10000]
  }
}
```

## 🔄 Integration with Orchestrator

The enhanced Radio Promo Agent integrates with the existing orchestrator system:

```bash
# Via orchestrator
node orchestrator.js execute radio-promotion

# Direct agent usage  
node radio-promo-agent.js personal-workflow transcript.txt
```

## 📈 Metrics Tracking

The agent tracks comprehensive metrics:

- **Traditional**: stations contacted, airplay secured, relationships built
- **Personal Workflow**: transcripts processed, campaigns created, press releases generated
- **Integrations**: Monday.com boards, WARM API tracks, Chat notifications
- **Verification**: approval steps completed

## 🚨 Error Handling

The agent includes robust error handling:
- File not found errors for transcripts
- API connection failures with graceful degradation  
- Verification step cancellation
- Automatic directory creation
- Detailed error logging with timestamps

## 🎯 Best Practices

1. **Transcript Quality**: Ensure clear audio and accurate transcription
2. **Environment Setup**: Test API connections before running workflows
3. **File Organization**: Use descriptive filenames for transcripts
4. **Verification**: Review extracted data before proceeding
5. **Backup**: Save generated files to cloud storage

## 🔧 Troubleshooting

### Common Issues

**"Transcript file not found"**
- Check file path is correct
- Ensure file exists in transcripts directory

**"Missing environment variables"**  
- Copy .env.example to .env
- Fill in required API keys

**"Low confidence score"**
- Improve transcript quality
- Use clearer campaign terminology in meetings

**"API connection failed"**
- Verify API keys are correct
- Check network connectivity
- Review API endpoint URLs

## 🤝 Integration Points

### Monday.com
- Campaign board creation
- Task management and tracking
- Team collaboration features

### Google Chat  
- Real-time notifications
- Campaign milestone alerts
- Team communication

### WARM API
- Play count monitoring
- Performance analytics  
- Trend analysis

This enhanced Radio Promo Agent combines traditional radio promotion expertise with modern workflow automation, making your campaign management more efficient and effective.