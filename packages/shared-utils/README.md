# @total-audio/shared-utils

Shared utilities for the Total Audio Promo platform - used across agents, apps, and services.

## Utilities

### AgentLogger

Centralized logging and status tracking for automation agents.

```javascript
const { AgentLogger } = require('@total-audio/shared-utils/agent-logger');

const logger = new AgentLogger('my-agent');
logger.info('Starting process');
logger.updateProgress(50, 'Halfway done');
logger.complete({ itemsProcessed: 100 });
```

### CostTracker

Track API costs with budget management (£150/month budget).

```javascript
const { CostTracker } = require('@total-audio/shared-utils/cost-tracker');

const tracker = new CostTracker();
await tracker.recordAnthropicUsage({
  model: 'claude-sonnet-4-20250514',
  inputTokens: 1000,
  outputTokens: 500,
  contacts: 10,
});

const summary = await tracker.getMonthlySummary();
console.log(`Spent £${summary.total} of £${summary.budget} budget`);
```

### RetryWrapper

Exponential backoff retry logic for API calls.

```javascript
const { RetryWrapper } = require('@total-audio/shared-utils/retry-wrapper');

const retry = new RetryWrapper();

// Retry any function
const result = await retry.retry(async () => {
  return await someApiCall();
}, { retries: 5, baseDelay: 2000 });

// API-specific wrappers
const response = await retry.anthropicWithRetry(client, {
  model: 'claude-sonnet-4-20250514',
  messages: [...]
});
```

### EmailAlerts

Email notification system for agent failures, cost alerts, token expiry.

```javascript
const { EmailAlerts } = require('@total-audio/shared-utils/email-alerts');

const alerts = new EmailAlerts();

// Alert on agent failure
await alerts.alertAgentFailure('contact-enrichment', error, {
  contactsProcessed: 50,
  contactsFailed: 5,
});

// Alert on cost threshold
await alerts.alertCostThreshold(6.5, {
  anthropic: 4.2,
  perplexity: 2.3,
});
```

## Installation

This package is part of the Total Audio monorepo. To use in your app:

```bash
npm install @total-audio/shared-utils --workspace=apps/your-app
```

Or reference in package.json:

```json
{
  "dependencies": {
    "@total-audio/shared-utils": "*"
  }
}
```

## Usage Across Platform

- **Automation Agents** (`/tools/agents/`) - Primary users for logging and cost tracking
- **Audio Intel** (`/apps/audio-intel/`) - Can use for contact enrichment logging
- **Command Centre** (`/apps/command-centre/`) - Uses for dashboard data
- **Newsletter System** (`/apps/newsletter/`) - Can use for content generation tracking
- **Any Future App** - Shared utilities available across entire monorepo

## Data Storage

- Agent logs: `~/.total-audio-logs/`
- Agent status: `~/.total-audio-status/`
- Cost tracking: `~/.total-audio-costs/`
- Email alerts: `~/.total-audio-alerts/` (fallback when Gmail MCP unavailable)
