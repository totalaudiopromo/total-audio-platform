# TDD Planning Helper for Total Audio

Simple TDD planning layer that enhances your existing 25-agent system without changing anything.

## Family-Friendly Design

- **Planning** (interruptible): Create specs when you have 5-15 minutes
- **Building** (focused): Use existing agents when you have 1-3 hours  
- **Emergency bailouts**: Skip planning or bypass TDD entirely when needed

## Quick Setup

Add these aliases to your `.zshrc` or `.bashrc`:

```bash
# TDD Planning Aliases
alias plan="cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents && ./tdd-helper.sh plan"
alias build="cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents && ./tdd-helper.sh build"
alias status="cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents && ./tdd-helper.sh status"
alias skip-plan="cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents && ./tdd-helper.sh skip-plan"
alias quick="cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents && ./tdd-helper.sh quick"
```

Then reload: `source ~/.zshrc`

## Usage Examples

### Normal Workflow
```bash
# Monday morning - kids around, 10 minutes free
plan "contact filtering"
# Creates mobile wireframes, component specs, tests, checklist

# Tuesday evening - focused time  
build "contact filtering"
# Uses specs to guide your existing 25 agents
```

### Emergency Modes
```bash
# Kids need attention, planning taking too long
skip-plan "contact filtering"
# Creates minimal specs in 30 seconds

# Urgent bug fix needed
quick "login bug fix"  
# Bypasses TDD entirely, straight to orchestrator
```

### Status Checking
```bash
status
# Shows:
# Ready to build: contact filtering (planned yesterday)
# In progress: mobile dashboard (building now)
# Ideas: analytics widget (rough notes only)
```

## What Gets Created

### 4 Planning Agents
- **tdd-ui-planner.js** - Mobile-first wireframes (Audio Intel blue, Playlist Pulse green)
- **tdd-component-selector.js** - shadcn/ui component selections
- **tdd-test-writer.js** - Natural language test scenarios  
- **tdd-implementation-planner.js** - Clear checklists for existing agents

### Specs Storage (`specs/` directory)
- `ui-wireframes/` - Mobile-first designs
- `components/` - Component selections
- `tests/` - Test scenarios
- `checklists/` - Implementation plans
- `status.json` - Track planned vs built features

## Integration with Existing System

**No Changes To:**
- Your existing 25 agents
- `orchestrator.sh` 
- `agent-manager.js`
- Current workflows

**How It Works:**
1. Planning agents create spec files
2. `build` command reads specs and calls `orchestrator.sh execute feature-with-tdd-specs`
3. Your existing agents receive mobile wireframes, component specs, test scenarios, and checklists
4. Implementation follows existing patterns but with better preparation

## Business Context Built-In

- **UK Music Industry**: £19-99 pricing, BBC regions, UK contact formats
- **Mobile-First**: All wireframes start with 320px iPhone SE
- **Product Themes**: Audio Intel (blue), Playlist Pulse (green)  
- **Integration**: Works with existing 515+ contact database

## Commands Reference

```bash
# Planning (interruptible)
./tdd-helper.sh plan "feature name" [audiointel|playlistpulse]
./tdd-helper.sh skip-plan "feature name"    # Emergency minimal specs
./tdd-helper.sh resume                      # Continue interrupted planning

# Building (focused work) 
./tdd-helper.sh build "feature name"        # Use specs with existing agents
./tdd-helper.sh quick "feature name"        # Bypass TDD entirely

# Status
./tdd-helper.sh status                      # Simple 3-line status
./tdd-helper.sh list                        # Show all specs created
```

## Example Feature: "Contact Filtering"

### Planning Phase (10 minutes, interruptible)
```bash
plan "contact filtering" audiointel
```
Creates:
- Mobile wireframe with filter chips, search input, results list
- Component selection: Card, Input, Select, Badge, Button (blue theme)
- Test scenarios: User searches BBC Radio 1, applies UK region filter
- Implementation checklist: Database queries, API endpoints, mobile responsive

### Building Phase (2 hours, focused)
```bash
build "contact filtering" audiointel  
```
- Reads all specs created during planning
- Calls `orchestrator.sh execute contact-filtering-with-tdd-specs`
- Your existing agents (database-agent, contact-agent, etc.) get:
  - Mobile wireframes to guide UI
  - Component specifications
  - Test scenarios to validate
  - Clear implementation steps

Result: Feature built faster with fewer errors, mobile-optimized from start.