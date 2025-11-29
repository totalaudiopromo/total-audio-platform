# Total Audio Agents Directory

Clean, organized agent system for Total Audio Platform radio promotion workflow.

## Quick Start

```bash
# Run the main orchestrator
node orchestrator.js

# Set up Gmail organisation
cd gmail-setup
node gmail-liberty-setup.js setup
```

## Directory Structure

### Core Active Agents

**`core-agents/radio-promo/`**- Radio promotion workflow

- `radio-promo-agent.js` - Main radio promotion agent
- `campaign-agent.js` - Campaign management

**`core-agents/content/`**- Content generation and automation

- Content generation agents
- Newsletter automation
- Social media agents

**`core-agents/business/`**- Business and analytics

- Analytics agents
- Agency management
- SaaS marketing tools

**`core-agents/technical/`**- Technical utilities

- Database agents
- Contact management
- Dashboard tools

### Support Systems

**`gmail-setup/`**- Gmail organisation system

- Automated label and filter setup
- Radio promo workflow integration
- Colour coding and automation

**`radio-promo/`**- Radio promotion data and integrations

- Station databases
- API integrations
- Email templates

**`utilities/`**- Development utilities

- Notion integration tools
- Memory persistence
- Health checks

**`docs/`**- Documentation

- Setup guides
- Usage instructions
- Integration documentation

### Archives

**`archive/oauth-fixes/`**- OAuth setup scripts (completed)
**`archive/tests/`**- Test files and debugging tools
**`archive/outdated/`**- Old marketing agents no longer used
**`archive/working/`**- Development tools and specialists
**`parked/`**- Future features not currently in use

## Key Files

- `orchestrator.js` - Main agent coordinator
- `auto-trigger.js` - Automated task triggering
- `.env` - Environment configuration
- `30-second-fix.sh` - Quick fixes script

## Current Focus

The system is optimized for **radio promotion workflow**:

1. Gmail automatically organizes campaign emails
2. Radio promo agent handles station outreach
3. Campaign agent tracks progress
4. Content agents support marketing

## Usage

Most work happens through the radio promo agent:

```bash
# Main radio promotion commands
node core-agents/radio-promo/radio-promo-agent.js [command]

# Gmail system management
cd gmail-setup && node gmail-liberty-setup.js [command]
```

Everything is organized for your actual radio promotion business workflow, with outdated experiments archived and working tools easily accessible.
