# Agents Directory

This directory contains specialized agents for the Total Audio Promo platform. Each agent is designed to handle specific tasks and workflows.

## Available Agents

### 1. Database Agent (`database-agent.js`)

Handles database operations, migrations, and schema management for the multi-tenant platform.

### 2. Integration Agent (`integration-agent.js`)

Manages third-party integrations including Airtable, Mailchimp, Gmail, and Claude AI.

### 3. Campaign Agent (`campaign-agent.js`)

Specialized for campaign management, analytics tracking, and performance monitoring.

### 4. Contact Agent (`contact-agent.js`)

Handles contact enrichment, deduplication, and relationship management.

### 5. Agency Agent (`agency-agent.js`)

Manages agency-specific operations including multi-tenant data isolation and white-label features.

### 6. Music Tech Agent (`music-tech-agent.js`)

Full-Stack Music Technology specialist with deep expertise in music technology development, API integration, and scalable architecture. Handles audio processing, music platform integrations (Spotify, Apple Music, YouTube, SoundCloud), streaming optimization, and technical recommendations for music-focused applications.

### 7. Growth Hacking Optimizer (`growth-hacking-optimizer.js`)

SaaS growth specialist focused on conversion optimization, A/B testing, and retention strategies. Analyzes user acquisition funnels, implements growth experiments, and provides data-driven recommendations for rapid user growth and sustainable business scaling.

### 8. Music Industry Strategist (`music-industry-strategist.js`)

Music business development expert specializing in industry partnerships, strategic relationships, and market analysis. Handles partnership development, competitive analysis, industry networking, and strategic planning for music industry ecosystem navigation.

### 9. Music Marketing Mastermind (`music-marketing-mastermind.js`)

Music promotion and viral marketing specialist with deep platform expertise. Creates comprehensive campaign strategies, playlist pitching campaigns, viral content strategies, and platform-specific optimization for independent artists and PR agencies.

### 10. Viral Content Automation (`viral-content-automation.js`)

Social media automation and viral content creation specialist. Handles cross-platform content scheduling, viral strategy development, trend analysis, and automated engagement workflows for maximum social media impact and growth.

## Usage

Each agent can be run independently or as part of automated workflows. They are designed to work with the existing codebase structure and follow the established patterns.

## Configuration

Agents use the same environment variables and configuration as the main application. Ensure all required API keys and database connections are properly configured.

## New Music Tech Features

The Music Tech Agent introduces specialized capabilities:

### Audio Processing

- Audio analysis (BPM, key detection, genre classification)
- Format optimization and conversion
- Streaming configuration optimization
- Performance monitoring and recommendations

### Music Platform Integration

- Multi-platform music search (Spotify, Apple Music, YouTube, SoundCloud)
- API rate limiting and error handling
- Consolidated music data across platforms
- Authentication and token management

### Technical Architecture

- Full-stack development recommendations
- Database schema optimization for music data
- Performance analysis and optimization suggestions
- Security best practices for music applications

### Available Commands

```bash
# Music Tech Agent specific commands
npm run agents:music-tech                    # General music tech agent info
npm run agents:music-analyze                 # Analyze audio files (demo)
npm run agents:music-search                  # Search music across platforms (demo)
npm run agents:music-performance             # Get performance analysis
npm run agents:music-recommendations         # Get technical recommendations

# Growth Hacking Optimizer commands
node agents/growth-hacking-optimizer.js funnel [agencyId]           # Analyze conversion funnel
node agents/growth-hacking-optimizer.js experiment create           # Create A/B test experiment
node agents/growth-hacking-optimizer.js experiment analyze <id>     # Analyze experiment results
node agents/growth-hacking-optimizer.js retention [agencyId]        # Analyze user retention
node agents/growth-hacking-optimizer.js report [agencyId]           # Generate growth report

# Music Industry Strategist commands
node agents/music-industry-strategist.js market [sector] [market]   # Market opportunity analysis
node agents/music-industry-strategist.js partnership [type]         # Partnership strategy development
node agents/music-industry-strategist.js network                    # Industry network analysis
node agents/music-industry-strategist.js report [focus]             # Comprehensive strategy report

# Music Marketing Mastermind commands
node agents/music-marketing-mastermind.js campaign                  # Create campaign strategy
node agents/music-marketing-mastermind.js playlist                  # Develop playlist strategy
node agents/music-marketing-mastermind.js viral                     # Generate viral marketing strategy

# Viral Content Automation commands
node agents/viral-content-automation.js strategy                    # Generate viral content strategy
node agents/viral-content-automation.js calendar                    # Create content calendar
node agents/viral-content-automation.js schedule                    # Schedule content across platforms

# New workflows available via orchestrator
npm run agents:workflows                     # Shows all available workflows including new agents
```

### New Workflows

- **music-analysis**: Comprehensive music analysis and platform integration
- **tech-recommendations**: Generate technical architecture recommendations
- **performance-optimization**: Enhanced with music tech performance analysis
- **growth-optimization**: User acquisition funnel analysis and conversion optimization
- **viral-campaign**: End-to-end viral content strategy and automation
- **industry-strategy**: Market analysis and partnership development
- **campaign-strategy**: Comprehensive music marketing campaign planning
