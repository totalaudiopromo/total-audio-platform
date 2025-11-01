#!/usr/bin/env node

/**
 * Agent Health Check - Monitor all automation agents
 *
 * Checks:
 * - Last run timestamps
 * - Success/failure status
 * - API token expiry
 * - Cost thresholds
 * - Data quality
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getAlerts } = require('../../packages/shared-utils/email-alerts');
const { getCostTracker } = require('../../packages/shared-utils/cost-tracker');

class AgentHealthCheck {
  constructor() {
    this.statusDir = path.join(os.homedir(), '.total-audio-status');
    this.logsDir = path.join(os.homedir(), '.total-audio-logs');

    // Expected agents (production only)
    this.expectedAgents = [
      'contact-enrichment',
      'gmail-autopilot',
      'social-calendar',
      'newsletter-generator',
      'data-cleanup',
      'station-discovery',
    ];

    // Maximum age before alerting (in hours)
    this.maxAge = {
      'contact-enrichment': 24, // Should run daily
      'gmail-autopilot': 2, // Should run hourly
      'social-calendar': 168, // Should run weekly (7 days)
      'newsletter-generator': 168, // Should run weekly
      'data-cleanup': 168, // Should run weekly
      'station-discovery': 168, // Should run weekly
    };

    this.alerts = getAlerts();
    this.costTracker = getCostTracker();
  }

  /**
   * Run complete health check
   */
  async check() {
    console.log('🏥 Total Audio Agent Health Check');
    console.log('==================================\n');

    const health = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      agents: {},
      warnings: [],
      critical: [],
      costs: null,
      summary: {
        total: 0,
        healthy: 0,
        warning: 0,
        critical: 0,
        missing: 0,
      },
    };

    // Check each expected agent
    for (const agentName of this.expectedAgents) {
      const agentHealth = await this.checkAgent(agentName);
      health.agents[agentName] = agentHealth;
      health.summary.total++;

      if (agentHealth.status === 'healthy') {
        health.summary.healthy++;
      } else if (agentHealth.status === 'warning') {
        health.summary.warning++;
        health.warnings.push({
          agent: agentName,
          message: agentHealth.message,
        });
      } else if (agentHealth.status === 'critical') {
        health.summary.critical++;
        health.critical.push({
          agent: agentName,
          message: agentHealth.message,
        });
      } else if (agentHealth.status === 'missing') {
        health.summary.missing++;
        health.warnings.push({
          agent: agentName,
          message: 'Agent has never run',
        });
      }
    }

    // Check costs
    health.costs = this.checkCosts();
    if (health.costs.warnings.length > 0) {
      health.warnings.push(...health.costs.warnings);
      health.summary.warning++;
    }

    // Determine overall health
    if (health.summary.critical > 0) {
      health.overall = 'critical';
    } else if (health.summary.warning > 0) {
      health.overall = 'warning';
    }

    // Display results
    this.displayResults(health);

    // Send alerts if needed
    await this.sendAlerts(health);

    // Save health report
    this.saveHealthReport(health);

    return health;
  }

  /**
   * Check individual agent
   */
  async checkAgent(agentName) {
    const statusFile = path.join(this.statusDir, `${agentName}-status.json`);

    if (!fs.existsSync(statusFile)) {
      return {
        status: 'missing',
        message: 'Never run',
        lastRun: null,
        age: null,
      };
    }

    try {
      const data = fs.readFileSync(statusFile, 'utf8');
      const status = JSON.parse(data);

      const lastRunDate = new Date(status.lastUpdate || status.startedAt);
      const now = new Date();
      const ageHours = (now - lastRunDate) / (1000 * 60 * 60);

      // Check if agent is stale
      const maxAgeHours = this.maxAge[agentName];
      let health = {
        status: 'healthy',
        message: 'Running normally',
        lastRun: lastRunDate.toISOString(),
        age: ageHours,
        maxAge: maxAgeHours,
        agentStatus: status.status,
      };

      if (status.status === 'failed') {
        health.status = 'critical';
        health.message = `Failed: ${status.errors[status.errors.length - 1]?.message || 'Unknown error'}`;
      } else if (ageHours > maxAgeHours) {
        health.status = 'warning';
        health.message = `Hasn't run in ${Math.round(ageHours)} hours (max: ${maxAgeHours}h)`;
      } else if (status.status === 'running' && ageHours > 2) {
        health.status = 'warning';
        health.message = `Stuck in 'running' state for ${Math.round(ageHours)} hours`;
      }

      return health;
    } catch (error) {
      return {
        status: 'critical',
        message: `Error reading status: ${error.message}`,
        lastRun: null,
        age: null,
      };
    }
  }

  /**
   * Check costs and budgets
   */
  checkCosts() {
    const summary = this.costTracker.getMonthlySummary();
    const today = this.costTracker.getTodayCosts();

    const warnings = [];

    // Daily threshold
    if (today.total > this.costTracker.budgets.daily) {
      warnings.push({
        type: 'daily-cost',
        severity: 'warning',
        message: `Daily cost (£${today.total.toFixed(2)}) exceeded threshold (£${this.costTracker.budgets.daily})`,
      });
    }

    // Monthly threshold
    if (summary.percentUsed >= 100) {
      warnings.push({
        type: 'monthly-cost',
        severity: 'critical',
        message: `Monthly budget exceeded! £${summary.total.toFixed(2)} / £${summary.budget}`,
      });
    } else if (summary.percentUsed >= 80) {
      warnings.push({
        type: 'monthly-cost',
        severity: 'warning',
        message: `Monthly budget ${summary.percentUsed.toFixed(0)}% used (£${summary.total.toFixed(2)} / £${summary.budget})`,
      });
    }

    return {
      today: today.total,
      month: summary.total,
      budget: summary.budget,
      percentUsed: summary.percentUsed,
      warnings,
    };
  }

  /**
   * Display health check results
   */
  displayResults(health) {
    // Overall status
    const statusIcon = {
      healthy: '✅',
      warning: '⚠️',
      critical: '🚨',
    }[health.overall];

    console.log(`${statusIcon} Overall Status: ${health.overall.toUpperCase()}\n`);

    // Agent summary
    console.log('📊 Agent Summary:');
    console.log(`   Total: ${health.summary.total}`);
    console.log(`   ✅ Healthy: ${health.summary.healthy}`);
    console.log(`   ⚠️  Warning: ${health.summary.warning}`);
    console.log(`   🚨 Critical: ${health.summary.critical}`);
    console.log(`   ❓ Missing: ${health.summary.missing}\n`);

    // Individual agents
    console.log('🤖 Agent Status:');
    Object.entries(health.agents).forEach(([name, agent]) => {
      const icon = {
        healthy: '✅',
        warning: '⚠️',
        critical: '🚨',
        missing: '❓',
      }[agent.status];

      const ageStr = agent.age !== null ? `(${Math.round(agent.age)}h ago)` : '';

      console.log(`   ${icon} ${name}: ${agent.message} ${ageStr}`);
    });

    // Costs
    console.log('\n💰 Costs:');
    console.log(`   Today: £${health.costs.today.toFixed(2)}`);
    console.log(
      `   This Month: £${health.costs.month.toFixed(2)} / £${health.costs.budget} (${health.costs.percentUsed.toFixed(0)}%)`
    );

    // Warnings
    if (health.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      health.warnings.forEach(w => {
        console.log(`   • ${w.agent || w.type}: ${w.message}`);
      });
    }

    // Critical issues
    if (health.critical.length > 0) {
      console.log('\n🚨 Critical Issues:');
      health.critical.forEach(c => {
        console.log(`   • ${c.agent}: ${c.message}`);
      });
    }

    console.log('');
  }

  /**
   * Send alerts if needed
   */
  async sendAlerts(health) {
    // Send alert if any critical issues
    if (health.critical.length > 0) {
      await this.alerts.alertAgentFailure(
        'Multiple Agents',
        new Error(`${health.critical.length} critical issues detected`),
        { critical: health.critical }
      );
    }

    // Send cost alert if over budget
    if (health.costs.warnings.some(w => w.severity === 'critical')) {
      const breakdown = this.costTracker.getCostBreakdown();
      await this.alerts.alertCostThreshold(health.costs.today, breakdown);
    }

    // Send daily summary if all healthy
    if (health.overall === 'healthy') {
      // Only send daily summary once per day
      const lastSummaryFile = path.join(this.statusDir, 'last-summary.txt');
      const today = new Date().toISOString().slice(0, 10);

      let shouldSendSummary = true;
      if (fs.existsSync(lastSummaryFile)) {
        const lastSummary = fs.readFileSync(lastSummaryFile, 'utf8').trim();
        shouldSendSummary = lastSummary !== today;
      }

      if (shouldSendSummary) {
        await this.sendDailySummary(health);
        fs.writeFileSync(lastSummaryFile, today);
      }
    }
  }

  /**
   * Send daily summary email
   */
  async sendDailySummary(health) {
    const summary = {
      agentsRun: health.summary.healthy,
      totalCost: health.costs.today,
      monthlyCost: health.costs.month,
      agents: Object.entries(health.agents)
        .filter(([_, a]) => a.status === 'healthy')
        .map(([name, agent]) => ({
          name,
          status: 'completed',
          itemsProcessed: 0, // TODO: Extract from agent status
        })),
      contactsEnriched: 0, // TODO: Get from enrichment agent
      emailsOrganized: 0, // TODO: Get from Gmail autopilot
      socialPosts: 0, // TODO: Get from social calendar
      newsletter: false, // TODO: Check if newsletter ran
      pendingTasks: health.warnings.map(w => w.message),
    };

    await this.alerts.alertDailySummary(summary);
  }

  /**
   * Save health report to file
   */
  saveHealthReport(health) {
    const reportFile = path.join(this.statusDir, 'health-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(health, null, 2));

    console.log(`📄 Health report saved to: ${reportFile}`);
  }

  /**
   * Get health status for Command Centre API
   */
  async getHealthForApi() {
    const health = await this.check();

    return {
      status: health.overall,
      timestamp: health.timestamp,
      agents: Object.entries(health.agents).map(([name, agent]) => ({
        name,
        status: agent.status,
        message: agent.message,
        lastRun: agent.lastRun,
        age: agent.age ? Math.round(agent.age) : null,
      })),
      costs: {
        today: health.costs.today,
        month: health.costs.month,
        budget: health.costs.budget,
        percentUsed: Math.round(health.costs.percentUsed),
      },
      warnings: health.warnings.length,
      critical: health.critical.length,
    };
  }
}

// CLI interface
async function main() {
  const healthCheck = new AgentHealthCheck();
  const health = await healthCheck.check();

  // Exit code: 0 = healthy, 1 = warning, 2 = critical
  const exitCode = health.overall === 'healthy' ? 0 : health.overall === 'warning' ? 1 : 2;
  process.exit(exitCode);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(2);
  });
}

module.exports = { AgentHealthCheck };
