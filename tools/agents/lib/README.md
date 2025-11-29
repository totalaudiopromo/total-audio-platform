# MOVED TO SHARED PACKAGE

The shared utilities previously in this directory have been moved to:

**`/packages/shared-utils/`**

This makes them available across the entire Total Audio Promo platform, not just automation agents.

## What Moved

-  ~~`lib/agent-logger.js`~~ →  `packages/shared-utils/agent-logger.js`
-  ~~`lib/cost-tracker.js`~~ →  `packages/shared-utils/cost-tracker.js`
-  ~~`lib/retry-wrapper.js`~~ →  `packages/shared-utils/retry-wrapper.js`
-  ~~`lib/email-alerts.js`~~ →  `packages/shared-utils/email-alerts.js`

## New Import Paths

**Before:**

```javascript
const { AgentLogger } = require('./lib/agent-logger');
```

**After (from agents directory):**

```javascript
const { AgentLogger } = require('../../packages/shared-utils/agent-logger');
```

**After (from apps):**

```javascript
const { AgentLogger } = require('@total-audio/shared-utils/agent-logger');
```

## Why the Move?

These utilities are useful across:

- Automation agents (`/tools/agents/`)
- Audio Intel app (`/apps/audio-intel/`)
- Command Centre (`/apps/command-centre/`)
- Newsletter system
- Any future apps/services

Having them in `/tools/agents/lib/` implied they were agent-specific. Now they're properly shared across the entire monorepo.

## What Stays in /tools/agents/lib/

This directory now contains agent-specific integrations (files that moved here are listed in the ls output above):

- Airtable integration
- Gmail integration
- Contact intelligence
- Drive asset manager
- Direct email sender
- Simplified contact manager

These are specific to the automation agents workflow and not general utilities.
