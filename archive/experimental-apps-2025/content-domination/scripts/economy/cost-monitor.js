/**
 * Cost Monitoring and Usage Tracking System
 * Tracks all API usage and costs to prevent exceeding free tier limits
 * Provides real-time cost analysis and automatic shutdowns
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

class CostMonitor {
  constructor() {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.usageFile = path.join(process.cwd(), 'data', 'usage-tracking.json');
    this.costThresholds = this.loadCostThresholds();
    this.apiPricing = this.loadAPIPricing();
    this.monthlyLimits = this.loadMonthlyLimits();
    this.warningThresholds = this.loadWarningThresholds();
  }

  /**
   * Track an API call and its associated cost
   */
  async trackAPICall(service, endpoint, tokens = 0, success = true, metadata = {}) {
    const timestamp = new Date().toISOString();
    const cost = this.calculateCost(service, tokens, endpoint);

    const usage = {
      timestamp,
      service,
      endpoint,
      tokens,
      cost,
      success,
      metadata,
      month: this.currentMonth,
      year: this.currentYear,
    };

    await this.saveUsageRecord(usage);
    await this.checkThresholds(service);

    console.log(
      `📊 API Call Tracked: ${service}/${endpoint} - £${cost.toFixed(4)} (${tokens} tokens)`
    );

    return usage;
  }

  /**
   * Get current month's usage summary
   */
  async getCurrentMonthUsage() {
    const usageData = await this.loadUsageData();
    const currentMonthData = usageData.filter(
      record => record.month === this.currentMonth && record.year === this.currentYear
    );

    const summary = {
      totalCalls: currentMonthData.length,
      totalCost: currentMonthData.reduce((sum, record) => sum + record.cost, 0),
      successfulCalls: currentMonthData.filter(r => r.success).length,
      failedCalls: currentMonthData.filter(r => !r.success).length,
      serviceBreakdown: {},
      dailyBreakdown: {},
      trends: this.calculateTrends(currentMonthData),
    };

    // Service breakdown
    currentMonthData.forEach(record => {
      if (!summary.serviceBreakdown[record.service]) {
        summary.serviceBreakdown[record.service] = {
          calls: 0,
          cost: 0,
          tokens: 0,
          successRate: 0,
        };
      }

      const service = summary.serviceBreakdown[record.service];
      service.calls++;
      service.cost += record.cost;
      service.tokens += record.tokens || 0;

      if (record.success) {
        service.successRate = (service.successRate * (service.calls - 1) + 1) / service.calls;
      } else {
        service.successRate = (service.successRate * (service.calls - 1)) / service.calls;
      }
    });

    // Daily breakdown
    currentMonthData.forEach(record => {
      const day = new Date(record.timestamp).getDate();
      if (!summary.dailyBreakdown[day]) {
        summary.dailyBreakdown[day] = { calls: 0, cost: 0 };
      }
      summary.dailyBreakdown[day].calls++;
      summary.dailyBreakdown[day].cost += record.cost;
    });

    return summary;
  }

  /**
   * Check if we're approaching any limits
   */
  async checkAllLimits() {
    const usage = await this.getCurrentMonthUsage();
    const alerts = [];

    // Check total cost limit
    if (usage.totalCost > this.costThresholds.monthly_budget * this.warningThresholds.warning) {
      alerts.push({
        type: 'cost_warning',
        message: `Monthly cost at ${(
          (usage.totalCost / this.costThresholds.monthly_budget) *
          100
        ).toFixed(1)}% of budget`,
        current: usage.totalCost,
        limit: this.costThresholds.monthly_budget,
        severity:
          usage.totalCost > this.costThresholds.monthly_budget * this.warningThresholds.emergency
            ? 'emergency'
            : 'warning',
      });
    }

    // Check service-specific limits
    for (const [service, serviceUsage] of Object.entries(usage.serviceBreakdown)) {
      const limit = this.monthlyLimits[service];
      if (limit && serviceUsage.calls > limit * this.warningThresholds.warning) {
        alerts.push({
          type: 'service_limit_warning',
          service,
          message: `${service} at ${((serviceUsage.calls / limit) * 100).toFixed(
            1
          )}% of monthly limit`,
          current: serviceUsage.calls,
          limit: limit,
          severity:
            serviceUsage.calls > limit * this.warningThresholds.emergency ? 'emergency' : 'warning',
        });
      }
    }

    return alerts;
  }

  /**
   * Get real-time cost dashboard data
   */
  async getDashboardData() {
    const usage = await this.getCurrentMonthUsage();
    const alerts = await this.checkAllLimits();
    const projectedCosts = this.calculateProjectedCosts(usage);

    return {
      currentUsage: usage,
      alerts,
      projectedCosts,
      recommendations: this.generateRecommendations(usage, alerts),
      healthScore: this.calculateHealthScore(usage, alerts),
      budgetRemaining: this.costThresholds.monthly_budget - usage.totalCost,
      daysRemainingInMonth: this.getDaysRemainingInMonth(),
      isEconomyMode: process.env.ECONOMY_MODE === 'true',
    };
  }

  /**
   * Emergency shutdown check
   */
  async shouldEmergencyShutdown() {
    const usage = await this.getCurrentMonthUsage();
    const emergencyThreshold =
      this.costThresholds.monthly_budget * this.warningThresholds.emergency;

    if (usage.totalCost >= emergencyThreshold) {
      return {
        shutdown: true,
        reason: 'Monthly budget exceeded',
        current: usage.totalCost,
        limit: emergencyThreshold,
      };
    }

    // Check individual service limits
    for (const [service, serviceUsage] of Object.entries(usage.serviceBreakdown)) {
      const limit = this.monthlyLimits[service];
      if (limit && serviceUsage.calls >= limit * this.warningThresholds.emergency) {
        return {
          shutdown: true,
          reason: `${service} limit exceeded`,
          current: serviceUsage.calls,
          limit: limit * this.warningThresholds.emergency,
        };
      }
    }

    return { shutdown: false };
  }

  /**
   * Generate cost optimization recommendations
   */
  generateRecommendations(usage, alerts) {
    const recommendations = [];

    if (usage.totalCost > this.costThresholds.monthly_budget * 0.5) {
      recommendations.push({
        type: 'cost_optimization',
        priority: 'high',
        message: 'Consider switching Claude model to Haiku for remaining month',
        savings: 'Up to 80% reduction in AI costs',
      });
    }

    if (usage.serviceBreakdown.claude?.calls > 30) {
      recommendations.push({
        type: 'usage_optimization',
        priority: 'medium',
        message: 'Increase AI threshold to 0.9 to use AI only for highest-value opportunities',
        savings: 'Reduce AI calls by ~40%',
      });
    }

    if (usage.serviceBreakdown.twitter?.calls > 800) {
      recommendations.push({
        type: 'platform_optimization',
        priority: 'medium',
        message: 'Focus on LinkedIn over Twitter for remaining month',
        savings: 'Better engagement with lower API costs',
      });
    }

    const emergencyAlerts = alerts.filter(alert => alert.severity === 'emergency');
    if (emergencyAlerts.length > 0) {
      recommendations.push({
        type: 'emergency',
        priority: 'critical',
        message: 'Switch to template-only mode immediately',
        savings: 'Prevent budget overrun',
      });
    }

    return recommendations;
  }

  /**
   * Calculate projected month-end costs
   */
  calculateProjectedCosts(usage) {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const daysPassed = new Date().getDate();
    const daysRemaining = daysInMonth - daysPassed;

    if (daysPassed === 0) return usage.totalCost;

    const dailyAverageCost = usage.totalCost / daysPassed;
    const projectedMonthEnd = usage.totalCost + dailyAverageCost * daysRemaining;

    return {
      current: usage.totalCost,
      projected: projectedMonthEnd,
      dailyAverage: dailyAverageCost,
      budgetRisk:
        projectedMonthEnd > this.costThresholds.monthly_budget
          ? 'high'
          : projectedMonthEnd > this.costThresholds.monthly_budget * 0.8
          ? 'medium'
          : 'low',
    };
  }

  /**
   * Calculate overall system health score
   */
  calculateHealthScore(usage, alerts) {
    let score = 100;

    // Deduct for cost overruns
    const costPercentage = (usage.totalCost / this.costThresholds.monthly_budget) * 100;
    if (costPercentage > 50) score -= (costPercentage - 50) * 2;

    // Deduct for alerts
    score -= alerts.filter(a => a.severity === 'warning').length * 10;
    score -= alerts.filter(a => a.severity === 'emergency').length * 25;

    // Deduct for failed calls
    const failureRate = usage.failedCalls / Math.max(usage.totalCalls, 1);
    score -= failureRate * 50;

    return Math.max(0, Math.round(score));
  }

  /**
   * Private helper methods
   */
  calculateCost(service, tokens, endpoint) {
    const pricing = this.apiPricing[service];
    if (!pricing) return 0;

    switch (service) {
      case 'claude':
        // Claude pricing per 1K tokens
        return (tokens / 1000) * pricing.per_1k_tokens;

      case 'twitter':
        // Twitter free tier - no cost, but track usage
        return 0;

      case 'linkedin':
        // LinkedIn free tier - no cost, but track usage
        return 0;

      case 'notion':
        // Notion free tier - no cost, but track usage
        return 0;

      default:
        return 0;
    }
  }

  async saveUsageRecord(usage) {
    try {
      let usageData = [];
      try {
        const existingData = await fs.readFile(this.usageFile, 'utf8');
        usageData = JSON.parse(existingData);
      } catch (error) {
        // File doesn't exist or is empty - start fresh
        await fs.mkdir(path.dirname(this.usageFile), { recursive: true });
      }

      usageData.push(usage);

      // Keep only last 3 months of data to manage file size
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      usageData = usageData.filter(record => new Date(record.timestamp) > threeMonthsAgo);

      await fs.writeFile(this.usageFile, JSON.stringify(usageData, null, 2));

      // Also save to Notion if configured
      if (process.env.NOTION_USAGE_TRACKING_DB) {
        await this.saveToNotion(usage);
      }
    } catch (error) {
      console.error('❌ Failed to save usage record:', error.message);
    }
  }

  async loadUsageData() {
    try {
      const data = await fs.readFile(this.usageFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return []; // Return empty array if file doesn't exist
    }
  }

  async saveToNotion(usage) {
    try {
      await axios.post(
        `https://api.notion.com/v1/pages`,
        {
          parent: { database_id: process.env.NOTION_USAGE_TRACKING_DB },
          properties: {
            Timestamp: {
              date: { start: usage.timestamp },
            },
            Service: {
              select: { name: usage.service },
            },
            Endpoint: {
              rich_text: [{ text: { content: usage.endpoint } }],
            },
            Tokens: {
              number: usage.tokens,
            },
            'Cost (GBP)': {
              number: usage.cost,
            },
            Success: {
              checkbox: usage.success,
            },
            Month: {
              number: usage.month + 1, // Notion months are 1-indexed
            },
            Year: {
              number: usage.year,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('❌ Failed to save to Notion:', error.message);
    }
  }

  async checkThresholds(service) {
    const usage = await this.getCurrentMonthUsage();
    const serviceUsage = usage.serviceBreakdown[service];

    if (serviceUsage) {
      const limit = this.monthlyLimits[service];
      if (limit) {
        const percentage = (serviceUsage.calls / limit) * 100;

        if (percentage > this.warningThresholds.warning * 100) {
          await this.sendAlert(`${service} usage at ${percentage.toFixed(1)}%`, 'warning');
        }

        if (percentage > this.warningThresholds.emergency * 100) {
          await this.sendAlert(`${service} usage CRITICAL: ${percentage.toFixed(1)}%`, 'emergency');
        }
      }
    }
  }

  async sendAlert(message, severity) {
    console.log(`🚨 ${severity.toUpperCase()}: ${message}`);

    // Send email alert if configured
    if (process.env.SMTP_USER && process.env.ALERT_EMAIL) {
      // Email sending would be implemented here
      console.log(`📧 Alert email would be sent: ${message}`);
    }
  }

  calculateTrends(monthData) {
    if (monthData.length < 7) return { trend: 'insufficient_data' };

    const dailyCosts = {};
    monthData.forEach(record => {
      const day = new Date(record.timestamp).getDate();
      if (!dailyCosts[day]) dailyCosts[day] = 0;
      dailyCosts[day] += record.cost;
    });

    const costs = Object.values(dailyCosts);
    const recent = costs.slice(-3);
    const earlier = costs.slice(-7, -3);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    if (recentAvg > earlierAvg * 1.2)
      return {
        trend: 'increasing',
        change: (((recentAvg - earlierAvg) / earlierAvg) * 100).toFixed(1),
      };
    if (recentAvg < earlierAvg * 0.8)
      return {
        trend: 'decreasing',
        change: (((earlierAvg - recentAvg) / earlierAvg) * 100).toFixed(1),
      };
    return { trend: 'stable' };
  }

  getDaysRemainingInMonth() {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.getDate() - now.getDate();
  }

  loadCostThresholds() {
    return {
      monthly_budget: parseFloat(process.env.CLAUDE_MONTHLY_BUDGET_USD || 5),
      daily_budget: parseFloat(process.env.CLAUDE_MONTHLY_BUDGET_USD || 5) / 30,
      emergency_stop: parseFloat(process.env.CLAUDE_MONTHLY_BUDGET_USD || 5) * 0.95,
    };
  }

  loadAPIPricing() {
    return {
      claude: {
        per_1k_tokens: parseFloat(process.env.CLAUDE_COST_PER_1K_TOKENS || 0.00025), // Haiku pricing
      },
      twitter: { per_request: 0 }, // Free tier
      linkedin: { per_request: 0 }, // Free tier
      notion: { per_request: 0 }, // Free tier
    };
  }

  loadMonthlyLimits() {
    return {
      claude: parseInt(process.env.MAX_MONTHLY_CLAUDE_CALLS || 50),
      twitter: parseInt(process.env.MAX_MONTHLY_TWITTER_CALLS || 1000),
      linkedin: parseInt(process.env.MAX_MONTHLY_LINKEDIN_CALLS || 200),
      notion: parseInt(process.env.MAX_MONTHLY_NOTION_CALLS || 2000),
    };
  }

  loadWarningThresholds() {
    return {
      warning: parseFloat(process.env.WARNING_THRESHOLD_PERCENT || 70) / 100,
      pause: parseFloat(process.env.PAUSE_THRESHOLD_PERCENT || 85) / 100,
      emergency: parseFloat(process.env.EMERGENCY_STOP_PERCENT || 95) / 100,
    };
  }
}

// Export for use in other scripts
module.exports = CostMonitor;

// CLI usage
if (require.main === module) {
  const monitor = new CostMonitor();

  const command = process.argv[2];

  switch (command) {
    case 'dashboard':
      monitor.getDashboardData().then(data => {
        console.log('\n📊 COST MONITORING DASHBOARD');
        console.log('='.repeat(50));
        console.log(
          `💰 Current Spend: £${data.currentUsage.totalCost.toFixed(2)} / £${
            data.budgetRemaining + data.currentUsage.totalCost
          }`
        );
        console.log(
          `📈 Projected: £${data.projectedCosts.projected.toFixed(2)} (${
            data.projectedCosts.budgetRisk
          } risk)`
        );
        console.log(`🏥 Health Score: ${data.healthScore}/100`);
        console.log(`⚠️  Alerts: ${data.alerts.length}`);
        if (data.alerts.length > 0) {
          data.alerts.forEach(alert => console.log(`   - ${alert.message}`));
        }
        console.log(`💡 Recommendations: ${data.recommendations.length}`);
        data.recommendations.forEach(rec => console.log(`   - ${rec.message}`));
      });
      break;

    case 'emergency-check':
      monitor.shouldEmergencyShutdown().then(result => {
        if (result.shutdown) {
          console.log(`🚨 EMERGENCY SHUTDOWN REQUIRED: ${result.reason}`);
          process.exit(1);
        } else {
          console.log('✅ System within safe limits');
          process.exit(0);
        }
      });
      break;

    case 'track':
      const service = process.argv[3];
      const endpoint = process.argv[4];
      const tokens = parseInt(process.argv[5] || 0);
      monitor.trackAPICall(service, endpoint, tokens, true).then(() => {
        console.log(`✅ Tracked: ${service}/${endpoint}`);
      });
      break;

    default:
      console.log(
        'Usage: node cost-monitor.js [dashboard|emergency-check|track <service> <endpoint> <tokens>]'
      );
  }
}
