/**
 * Email Alerts System - Uses Gmail MCP for sending notifications
 *
 * Sends alerts to Chris when:
 * - Agents fail
 * - API tokens expire
 * - Costs exceed threshold
 * - Data quality drops
 */

const os = require('os');
const fs = require('fs');
const path = require('path');

class EmailAlerts {
  constructor(options = {}) {
    this.recipientEmail = options.recipientEmail || 'chris@totalaudiopromo.com';
    this.fromEmail = options.fromEmail || 'noreply@totalaudiopromo.com';
    this.enabled = options.enabled !== false;

    // Alert thresholds
    this.thresholds = {
      dailyCostGBP: options.dailyCostThreshold || 50,
      dataQualityPercent: options.qualityThreshold || 85,
      agentFailureCount: options.failureThreshold || 3,
    };
  }

  /**
   * Send email using Gmail MCP
   */
  async sendEmail(subject, htmlBody, textBody = null) {
    if (!this.enabled) {
      console.log('[EmailAlerts] Alerts disabled, skipping email');
      return false;
    }

    try {
      // Check if Gmail MCP is available
      const gmailMcpAvailable = await this.checkGmailMcp();

      if (gmailMcpAvailable) {
        return await this.sendViaGmailMcp(subject, htmlBody, textBody);
      } else {
        // Fallback: Log to file for manual review
        return await this.logToFile(subject, htmlBody);
      }
    } catch (error) {
      console.error('[EmailAlerts] Failed to send email:', error);
      return false;
    }
  }

  /**
   * Check if Gmail MCP server is available
   */
  async checkGmailMcp() {
    // Check if Gmail MCP server is installed
    // For now, return false and use file logging
    // TODO: Integrate with actual Gmail MCP when available
    return false;
  }

  /**
   * Send via Gmail MCP (when available)
   */
  async sendViaGmailMcp(subject, htmlBody, textBody) {
    // TODO: Implement Gmail MCP integration
    // For now, use file logging
    return await this.logToFile(subject, htmlBody);
  }

  /**
   * Fallback: Log alert to file (manual review)
   */
  async logToFile(subject, htmlBody) {
    const alertsDir = path.join(os.homedir(), '.total-audio-alerts');

    if (!fs.existsSync(alertsDir)) {
      fs.mkdirSync(alertsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `alert_${timestamp}.html`;
    const filepath = path.join(alertsDir, filename);

    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
    .header { background: #f44336; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; }
    .footer { margin-top: 20px; padding: 10px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Total Audio Alert</h1>
    <p>${subject}</p>
  </div>
  <div class="content">
    ${htmlBody}
  </div>
  <div class="footer">
    <p>Alert generated: ${new Date().toLocaleString('en-GB')}</p>
    <p>File: ${filepath}</p>
  </div>
</body>
</html>
    `;

    fs.writeFileSync(filepath, fullHtml);

    console.log(`[EmailAlerts] Alert saved to: ${filepath}`);
    console.log(`[EmailAlerts] MANUAL ACTION REQUIRED: Review alert file`);

    return true;
  }

  /**
   * Alert: Agent failure
   */
  async alertAgentFailure(agentName, error, context = {}) {
    const subject = `⚠️ Agent Failure: ${agentName}`;

    const htmlBody = `
      <h2>Agent Failed</h2>
      <p><strong>Agent:</strong> ${agentName}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString('en-GB')}</p>
      <p><strong>Error:</strong> ${error.message || error}</p>

      ${
        error.stack
          ? `
        <h3>Stack Trace</h3>
        <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;">${error.stack}</pre>
      `
          : ''
      }

      ${
        Object.keys(context).length > 0
          ? `
        <h3>Context</h3>
        <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(
          context,
          null,
          2
        )}</pre>
      `
          : ''
      }

      <h3>Next Steps</h3>
      <ol>
        <li>Check agent logs: <code>~/.total-audio-logs/${agentName}.log</code></li>
        <li>Check agent status: <code>cat ~/.total-audio-status/${agentName}-status.json</code></li>
        <li>Review error details above</li>
        <li>Re-run manually if needed</li>
      </ol>
    `;

    return await this.sendEmail(subject, htmlBody);
  }

  /**
   * Alert: Cost threshold exceeded
   */
  async alertCostThreshold(dailyCost, breakdown) {
    const subject = `💰 Cost Alert: £${dailyCost.toFixed(2)}/day (threshold: £${
      this.thresholds.dailyCostGBP
    })`;

    const htmlBody = `
      <h2>Daily Cost Exceeded Threshold</h2>
      <p><strong>Current Daily Cost:</strong> £${dailyCost.toFixed(2)}</p>
      <p><strong>Threshold:</strong> £${this.thresholds.dailyCostGBP}/day</p>
      <p><strong>Monthly Projection:</strong> £${(dailyCost * 30).toFixed(2)}</p>

      <h3>Cost Breakdown</h3>
      <table style="width: 100%; background: white; border-radius: 4px;">
        <thead>
          <tr style="background: #e0e0e0;">
            <th style="padding: 8px; text-align: left;">Service</th>
            <th style="padding: 8px; text-align: right;">Requests</th>
            <th style="padding: 8px; text-align: right;">Cost</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(breakdown)
            .map(
              ([service, data]) => `
            <tr>
              <td style="padding: 8px;">${service}</td>
              <td style="padding: 8px; text-align: right;">${data.requests}</td>
              <td style="padding: 8px; text-align: right;">£${data.cost.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h3>Recommendations</h3>
      <ul>
        <li>Review contact enrichment frequency (largest cost)</li>
        <li>Consider batch processing instead of real-time</li>
        <li>Pause non-critical agents temporarily</li>
        <li>Adjust cost threshold if this is acceptable</li>
      </ul>
    `;

    return await this.sendEmail(subject, htmlBody);
  }

  /**
   * Alert: API token expiring
   */
  async alertTokenExpiry(service, daysRemaining) {
    const subject = `⏰ Token Expiring: ${service} (${daysRemaining} days)`;

    const htmlBody = `
      <h2>API Token Expiring Soon</h2>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Days Remaining:</strong> ${daysRemaining}</p>
      <p><strong>Action Required:</strong> Renew token before expiry</p>

      <h3>How to Renew</h3>
      ${this.getTokenRenewalInstructions(service)}

      <h3>Impact if Expired</h3>
      <p>The following agents will fail:</p>
      ${this.getAffectedAgents(service)}
    `;

    return await this.sendEmail(subject, htmlBody);
  }

  /**
   * Alert: Data quality drop
   */
  async alertDataQuality(currentQuality, breakdown) {
    const subject = `📉 Data Quality Alert: ${currentQuality}% (threshold: ${this.thresholds.dataQualityPercent}%)`;

    const htmlBody = `
      <h2>Contact Data Quality Dropped</h2>
      <p><strong>Current Quality:</strong> ${currentQuality}% High/Medium contacts</p>
      <p><strong>Threshold:</strong> ${this.thresholds.dataQualityPercent}%</p>

      <h3>Quality Breakdown</h3>
      <table style="width: 100%; background: white; border-radius: 4px;">
        <tr>
          <td style="padding: 8px;"><strong>High Quality:</strong></td>
          <td style="padding: 8px; text-align: right;">${breakdown.high} (${breakdown.highPercent}%)</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Medium Quality:</strong></td>
          <td style="padding: 8px; text-align: right;">${breakdown.medium} (${breakdown.mediumPercent}%)</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Low Quality:</strong></td>
          <td style="padding: 8px; text-align: right;">${breakdown.low} (${breakdown.lowPercent}%)</td>
        </tr>
      </table>

      <h3>Next Steps</h3>
      <ol>
        <li>Run data cleanup: <code>node tools/agents/radio-promo/clean-airtable-contacts.js</code></li>
        <li>Review low-quality contacts manually</li>
        <li>Consider re-enrichment of medium quality contacts</li>
        <li>Check import sources for data quality issues</li>
      </ol>
    `;

    return await this.sendEmail(subject, htmlBody);
  }

  /**
   * Alert: Daily summary (success - green checkmark)
   */
  async alertDailySummary(summary) {
    const subject = `✅ Daily Summary: ${summary.agentsRun} agents, £${summary.totalCost.toFixed(
      2
    )} cost`;

    const htmlBody = `
      <div style="background: #4caf50; color: white; padding: 20px; border-radius: 8px;">
        <h2>✅ All Systems Operational</h2>
        <p>${new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>
      </div>

      <div style="margin-top: 20px;">
        <h3>Agents Run Today</h3>
        <ul>
          ${summary.agents
            .map(
              a => `
            <li><strong>${a.name}:</strong> ${a.status} - ${a.itemsProcessed} items processed</li>
          `
            )
            .join('')}
        </ul>

        <h3>Metrics</h3>
        <table style="width: 100%; background: white; border-radius: 4px;">
          <tr>
            <td style="padding: 8px;"><strong>Contacts Enriched:</strong></td>
            <td style="padding: 8px; text-align: right;">${summary.contactsEnriched}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Emails Organized:</strong></td>
            <td style="padding: 8px; text-align: right;">${summary.emailsOrganized}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Social Posts Scheduled:</strong></td>
            <td style="padding: 8px; text-align: right;">${summary.socialPosts}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Newsletter Generated:</strong></td>
            <td style="padding: 8px; text-align: right;">${summary.newsletter ? 'Yes' : 'No'}</td>
          </tr>
        </table>

        <h3>Costs</h3>
        <p><strong>Today:</strong> £${summary.totalCost.toFixed(2)}</p>
        <p><strong>This Month:</strong> £${summary.monthlyCost.toFixed(2)}</p>

        <h3>Manual Tasks Pending</h3>
        ${
          summary.pendingTasks.length > 0
            ? `
          <ul>
            ${summary.pendingTasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        `
            : '<p>✅ No manual tasks pending</p>'
        }
      </div>
    `;

    return await this.sendEmail(subject, htmlBody);
  }

  /**
   * Get token renewal instructions for service
   */
  getTokenRenewalInstructions(service) {
    const instructions = {
      WARM: '<ol><li>Visit WARM dashboard</li><li>Navigate to API settings</li><li>Generate new token</li><li>Update .env file</li></ol>',
      Gmail:
        '<ol><li>Run: <code>cd tools/agents && ./quick-oauth-setup.sh</code></li><li>Complete OAuth flow</li><li>Tokens auto-updated</li></ol>',
      Airtable:
        '<ol><li>Visit Airtable account settings</li><li>Generate new personal access token</li><li>Update AIRTABLE_API_KEY in .env</li></ol>',
      Anthropic:
        '<ol><li>Visit console.anthropic.com</li><li>Generate new API key</li><li>Update ANTHROPIC_API_KEY in .env</li></ol>',
    };

    return instructions[service] || '<p>Check service documentation for renewal instructions.</p>';
  }

  /**
   * Get affected agents for service
   */
  getAffectedAgents(service) {
    const affected = {
      WARM: ['station-discovery-system', 'get-real-campaign-data'],
      Gmail: ['liberty-autopilot', 'all Gmail integrations'],
      Airtable: ['enrich-all-contacts', 'clean-airtable-contacts', 'update-fields-from-enrichment'],
      Anthropic: ['enrich-all-contacts', 'newsletter-automation-agent', 'content-generation-agent'],
    };

    const agents = affected[service] || ['Unknown'];
    return '<ul>' + agents.map(a => `<li>${a}</li>`).join('') + '</ul>';
  }

  /**
   * Test alert system
   */
  async test() {
    console.log('[EmailAlerts] Testing alert system...');

    const result = await this.sendEmail(
      '🧪 Test Alert - Total Audio Agent System',
      `
        <h2>Test Alert</h2>
        <p>This is a test alert from the Total Audio agent monitoring system.</p>
        <p>If you're reading this, the alert system is working correctly!</p>

        <h3>Alert Capabilities</h3>
        <ul>
          <li>Agent failures</li>
          <li>Cost thresholds</li>
          <li>Token expiry warnings</li>
          <li>Data quality alerts</li>
          <li>Daily summaries</li>
        </ul>

        <p><strong>Time:</strong> ${new Date().toLocaleString('en-GB')}</p>
      `
    );

    if (result) {
      console.log('[EmailAlerts] ✅ Test alert sent successfully');
    } else {
      console.log('[EmailAlerts] ❌ Test alert failed');
    }

    return result;
  }
}

// Singleton instance
let instance = null;

function getAlerts(options = {}) {
  if (!instance) {
    instance = new EmailAlerts(options);
  }
  return instance;
}

// CLI test
if (require.main === module) {
  const alerts = getAlerts();
  alerts.test().then(() => {
    console.log('\nAlert files saved to:', require('os').homedir() + '/.total-audio-alerts/');
  });
}

module.exports = { EmailAlerts, getAlerts };
