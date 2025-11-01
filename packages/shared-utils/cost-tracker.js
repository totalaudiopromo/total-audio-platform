/**
 * Cost Tracking System - Monitor API usage and costs
 *
 * Tracks costs for:
 * - Anthropic Claude (contact enrichment)
 * - Perplexity (if used)
 * - Platform APIs (Twitter, LinkedIn when added)
 * - WARM API (subscription)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class CostTracker {
  constructor(options = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.total-audio-costs');
    this.currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // API pricing (GBP)
    this.pricing = {
      anthropic: {
        'claude-sonnet-4-20250514': {
          input: 0.003 / 1000, // per 1K tokens
          output: 0.015 / 1000,
          perContact: 0.003 * 0.79, // Approx £0.0024 per contact (USD to GBP)
        },
      },
      perplexity: {
        standard: 0.001 * 0.79, // per request
      },
      warm: {
        subscription: 25, // £25/month subscription
      },
      twitter: {
        enterprise: 100, // £100/month if using API
      },
      airtable: {
        free: 0,
        plus: 10, // £10/month if exceeding free tier
      },
    };

    // Monthly budget thresholds
    this.budgets = {
      total: options.monthlyBudget || 150, // £150/month total
      daily: options.dailyBudget || 5, // £5/day average
      anthropic: 100, // £100/month for Claude
      perplexity: 20, // £20/month for Perplexity
      subscriptions: 30, // £30/month for WARM + others
    };

    this.ensureDataDir();
  }

  /**
   * Ensure cost data directory exists
   */
  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * Get cost file path for current month
   */
  getCostFilePath() {
    return path.join(this.dataDir, `costs-${this.currentMonth}.json`);
  }

  /**
   * Load cost data for current month
   */
  loadCosts() {
    const filepath = this.getCostFilePath();

    if (!fs.existsSync(filepath)) {
      return this.initializeCostData();
    }

    try {
      const data = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('[CostTracker] Failed to load costs:', error);
      return this.initializeCostData();
    }
  }

  /**
   * Initialize new cost data structure
   */
  initializeCostData() {
    return {
      month: this.currentMonth,
      total: 0,
      services: {
        anthropic: { requests: 0, cost: 0, contacts: 0 },
        perplexity: { requests: 0, cost: 0 },
        warm: { cost: 0 },
        twitter: { cost: 0 },
        airtable: { cost: 0 },
      },
      daily: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Save cost data
   */
  saveCosts(data) {
    const filepath = this.getCostFilePath();
    data.lastUpdated = new Date().toISOString();

    try {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('[CostTracker] Failed to save costs:', error);
      return false;
    }
  }

  /**
   * Record Anthropic Claude usage
   */
  recordAnthropicUsage(options = {}) {
    const {
      model = 'claude-sonnet-4-20250514',
      inputTokens = 0,
      outputTokens = 0,
      contacts = 0, // Shorthand for contact enrichment
    } = options;

    const costs = this.loadCosts();
    const today = new Date().toISOString().slice(0, 10);

    // Calculate cost
    let cost = 0;
    if (contacts > 0) {
      // Simple per-contact pricing
      cost = contacts * this.pricing.anthropic[model].perContact;
      costs.services.anthropic.contacts += contacts;
    } else {
      // Token-based pricing
      const pricing = this.pricing.anthropic[model];
      cost = inputTokens * pricing.input + outputTokens * pricing.output;
    }

    // Update totals
    costs.services.anthropic.requests += 1;
    costs.services.anthropic.cost += cost;
    costs.total += cost;

    // Update daily totals
    if (!costs.daily[today]) {
      costs.daily[today] = { anthropic: 0, total: 0 };
    }
    costs.daily[today].anthropic += cost;
    costs.daily[today].total += cost;

    this.saveCosts(costs);

    console.log(`[CostTracker] Anthropic: +£${cost.toFixed(4)} (${contacts} contacts)`);

    // Check thresholds
    this.checkThresholds(costs);

    return cost;
  }

  /**
   * Record Perplexity usage
   */
  recordPerplexityUsage(requests = 1) {
    const costs = this.loadCosts();
    const today = new Date().toISOString().slice(0, 10);

    const cost = requests * this.pricing.perplexity.standard;

    costs.services.perplexity.requests += requests;
    costs.services.perplexity.cost += cost;
    costs.total += cost;

    if (!costs.daily[today]) {
      costs.daily[today] = { perplexity: 0, total: 0 };
    }
    costs.daily[today].perplexity = (costs.daily[today].perplexity || 0) + cost;
    costs.daily[today].total += cost;

    this.saveCosts(costs);

    console.log(`[CostTracker] Perplexity: +£${cost.toFixed(4)} (${requests} requests)`);

    return cost;
  }

  /**
   * Record subscription cost (monthly)
   */
  recordSubscription(service, cost) {
    const costs = this.loadCosts();

    if (!costs.services[service]) {
      costs.services[service] = { cost: 0 };
    }

    costs.services[service].cost = cost;
    costs.total += cost;

    this.saveCosts(costs);

    console.log(`[CostTracker] Subscription (${service}): £${cost.toFixed(2)}/month`);

    return cost;
  }

  /**
   * Get current month summary
   */
  getMonthlySummary() {
    const costs = this.loadCosts();

    return {
      month: costs.month,
      total: costs.total,
      budget: this.budgets.total,
      remaining: this.budgets.total - costs.total,
      percentUsed: (costs.total / this.budgets.total) * 100,
      services: costs.services,
      dailyAverage: this.calculateDailyAverage(costs),
      projectedMonthly: this.projectMonthlyTotal(costs),
    };
  }

  /**
   * Get today's costs
   */
  getTodayCosts() {
    const costs = this.loadCosts();
    const today = new Date().toISOString().slice(0, 10);

    return costs.daily[today] || { total: 0 };
  }

  /**
   * Calculate daily average
   */
  calculateDailyAverage(costs) {
    const days = Object.keys(costs.daily).length;
    if (days === 0) return 0;

    const total = Object.values(costs.daily).reduce((sum, day) => sum + day.total, 0);
    return total / days;
  }

  /**
   * Project monthly total based on current usage
   */
  projectMonthlyTotal(costs) {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    const daysPassed = Object.keys(costs.daily).length;
    if (daysPassed === 0) return 0;

    const dailyAverage = this.calculateDailyAverage(costs);
    return dailyAverage * daysInMonth;
  }

  /**
   * Check if any thresholds are exceeded
   */
  checkThresholds(costs) {
    const warnings = [];

    // Daily threshold
    const today = this.getTodayCosts();
    if (today.total > this.budgets.daily) {
      warnings.push({
        type: 'daily',
        message: `Daily cost (£${today.total.toFixed(2)}) exceeded threshold (£${this.budgets.daily})`,
        severity: 'warning',
      });
    }

    // Monthly threshold (80% = warning, 100% = alert)
    const monthlyPercent = (costs.total / this.budgets.total) * 100;
    if (monthlyPercent >= 100) {
      warnings.push({
        type: 'monthly',
        message: `Monthly budget (£${this.budgets.total}) exceeded! Current: £${costs.total.toFixed(2)}`,
        severity: 'critical',
      });
    } else if (monthlyPercent >= 80) {
      warnings.push({
        type: 'monthly',
        message: `Monthly budget ${monthlyPercent.toFixed(0)}% used (£${costs.total.toFixed(2)} / £${this.budgets.total})`,
        severity: 'warning',
      });
    }

    // Anthropic threshold
    if (costs.services.anthropic.cost > this.budgets.anthropic) {
      warnings.push({
        type: 'anthropic',
        message: `Anthropic cost (£${costs.services.anthropic.cost.toFixed(2)}) exceeded budget (£${this.budgets.anthropic})`,
        severity: 'warning',
      });
    }

    // Log warnings
    warnings.forEach(w => {
      const icon = w.severity === 'critical' ? '🚨' : '⚠️';
      console.log(`${icon} [CostTracker] ${w.message}`);
    });

    return warnings;
  }

  /**
   * Get cost breakdown for alerts
   */
  getCostBreakdown() {
    const costs = this.loadCosts();

    return {
      anthropic: {
        requests: costs.services.anthropic.requests,
        contacts: costs.services.anthropic.contacts,
        cost: costs.services.anthropic.cost,
      },
      perplexity: {
        requests: costs.services.perplexity.requests,
        cost: costs.services.perplexity.cost,
      },
      subscriptions: {
        warm: costs.services.warm.cost,
        twitter: costs.services.twitter.cost,
        airtable: costs.services.airtable.cost,
      },
      total: costs.total,
    };
  }

  /**
   * Export cost report (CSV)
   */
  exportCostReport(outputPath = null) {
    const costs = this.loadCosts();
    const filepath = outputPath || path.join(this.dataDir, `report-${this.currentMonth}.csv`);

    let csv = 'Date,Service,Requests,Cost (GBP)\n';

    // Daily breakdown
    Object.entries(costs.daily).forEach(([date, day]) => {
      Object.entries(day).forEach(([service, cost]) => {
        if (service !== 'total') {
          csv += `${date},${service},-,${cost.toFixed(4)}\n`;
        }
      });
    });

    // Monthly subscriptions
    Object.entries(costs.services).forEach(([service, data]) => {
      if (data.cost > 0 && !data.requests) {
        csv += `${this.currentMonth},${service} (subscription),-,${data.cost.toFixed(2)}\n`;
      }
    });

    fs.writeFileSync(filepath, csv);

    console.log(`[CostTracker] Report exported to: ${filepath}`);

    return filepath;
  }

  /**
   * Generate cost summary for Command Centre
   */
  getCommandCentreSummary() {
    const costs = this.loadCosts();
    const summary = this.getMonthlySummary();
    const today = this.getTodayCosts();

    return {
      today: {
        total: today.total,
        breakdown: today,
      },
      month: {
        total: costs.total,
        budget: this.budgets.total,
        remaining: summary.remaining,
        percentUsed: summary.percentUsed,
        projectedTotal: summary.projectedMonthly,
      },
      services: {
        anthropic: {
          contacts: costs.services.anthropic.contacts,
          requests: costs.services.anthropic.requests,
          cost: costs.services.anthropic.cost,
          budget: this.budgets.anthropic,
        },
        perplexity: {
          requests: costs.services.perplexity.requests,
          cost: costs.services.perplexity.cost,
          budget: this.budgets.perplexity,
        },
      },
      warnings: this.checkThresholds(costs),
    };
  }

  /**
   * Test cost tracker
   */
  test() {
    console.log('[CostTracker] Testing cost tracking system...\n');

    // Record test usage
    console.log('Recording test Anthropic usage (100 contacts)...');
    this.recordAnthropicUsage({ contacts: 100 });

    console.log('\nRecording test Perplexity usage (10 requests)...');
    this.recordPerplexityUsage(10);

    console.log('\nRecording WARM subscription...');
    this.recordSubscription('warm', 25);

    console.log('\n📊 Monthly Summary:');
    const summary = this.getMonthlySummary();
    console.log(JSON.stringify(summary, null, 2));

    console.log("\n💰 Today's Costs:");
    const today = this.getTodayCosts();
    console.log(JSON.stringify(today, null, 2));

    console.log('\n✅ Cost tracking test complete!');
    console.log(`\nCost data saved to: ${this.dataDir}`);
  }
}

// Singleton instance
let instance = null;

function getCostTracker(options = {}) {
  if (!instance) {
    instance = new CostTracker(options);
  }
  return instance;
}

// CLI test
if (require.main === module) {
  const tracker = getCostTracker();
  tracker.test();
}

module.exports = { CostTracker, getCostTracker };
